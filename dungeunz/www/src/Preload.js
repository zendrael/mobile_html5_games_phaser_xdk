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
		//o tileset
		game.load.image('tileset', 'asset/tileset.png');
		//os mapas gerados pelo Tiled
		game.load.tilemap('mapa00', 'asset/mapa00.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('mapa01', 'asset/mapa01.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('mapa02', 'asset/mapa02.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('mapa03', 'asset/mapa03.json', null, Phaser.Tilemap.TILED_JSON);

		game.load.spritesheet('personagens', 'asset/spritesheet.png', 16, 16);
		game.load.spritesheet('botoes_jogo', 'asset/botoes_jogo.png', 32, 32);
		game.load.spritesheet('vidas', 'asset/vidas.png', 16, 16);
		
		//para tela de gameover
		game.load.image('gameover', 'asset/gameover.png');
		game.load.image('fundo_gameover', 'asset/fundo_gameover.png');
		
        //áudio
        game.load.audio('musica', ['asset/musica.ogg', 'asset/musica.mp3']);
		game.load.audio('pontuou', ['asset/pontuou.ogg', 'asset/pontuou.mp3']);
		game.load.audio('colisao', ['asset/colisao.ogg', 'asset/colisao.mp3']);
		game.load.audio('fimjogo', ['asset/fimjogo.ogg', 'asset/fimjogo.mp3']);
    },

    //primeira execução
    create : function () {
        game.state.start('Menu');
    }
};