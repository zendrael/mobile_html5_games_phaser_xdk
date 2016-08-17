//cria o State Preload
Preload = function (game) {
};

//define os métodos da classe
Preload.prototype = {
    //pré-carregamento
    preload : function () {
        //prepara e posiciona o logotipo do jogo
        this.logoJogo = game.add.sprite(game.world.centerX, 30, 'logoJogo');
        this.logoJogo.anchor.setTo(0.5, 0);
        
        //prepara e posiciona a barra de carregamento
        this.barraLoading = game.add.sprite(game.world.centerX, game.world.height-50, 'barraLoading');
        this.barraLoading.anchor.setTo(0.5, 0);
        
        //define o sprite de carregamento
        game.load.setPreloadSprite(this.barraLoading);
        
        //carregando outros itens...
        game.load.spritesheet('botao_play', 'asset/botao_play.png', 64, 32);
        game.load.image('fundo_menu', 'asset/fundo_menu.png');
        
        //para tela Play
        game.load.image('pilares', 'asset/pilares.png');
		game.load.spritesheet('fundo', 'asset/fundo.png', 231, 63);
        game.load.spritesheet('solos', 'asset/solos.png', 21, 42);
        game.load.spritesheet('caixas', 'asset/caixas.png', 21, 21);
        game.load.spritesheet('jogador', 'asset/jogador.png', 21, 21);
		game.load.spritesheet('botoes_jogo', 'asset/botoes_jogo.png', 64, 64);
		game.load.spritesheet('monstros', 'asset/monstros.png', 21, 21);
		game.load.spritesheet('icones', 'asset/icones.png', 21, 21);
        
		//para tela de score
		game.load.image('score', 'asset/score.png');
		game.load.image('fundo_score', 'asset/fundo_score.png');
		
		//para tela de gameover
		game.load.image('gameover', 'asset/gameover.png');
		game.load.image('fundo_gameover', 'asset/fundo_gameover.png');
        
        //áudio
        game.load.audio('musica', ['asset/musica.ogg', 'asset/musica.mp3']);
		game.load.audio('pontuou', ['asset/pontuou.ogg', 'asset/pontuou.mp3']);
		game.load.audio('fimjogo', ['asset/fimjogo.ogg', 'asset/fimjogo.mp3']);
		game.load.audio('colisao', ['asset/colisao.ogg', 'asset/colisao.mp3']);
        
    },

    //primeira execução
    create : function () {
        game.state.start('Menu');
    }
};