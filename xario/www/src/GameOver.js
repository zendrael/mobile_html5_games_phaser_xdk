//cria o State GameOver
GameOver = function (game) {
};

//define os métodos da classe
GameOver.prototype = {
	//inicializa o state
	init : function ( pontos ) {
		//ao reiniciar, não perde os pontos obtidos
		this.pontos = ( pontos != null ) ? pontos : 0;
	},
	
    //primeira execução
    create : function () {
		//altera a cor de fundo
        this.game.stage.backgroundColor = '#667479';
        
		//coloca a imagem de fundo
		this.fundo = game.add.image(game.world.centerX, game.world.height, 'fundo_gameover');
		this.fundo.anchor.setTo(0.5, 1);
        
        //prepara e posiciona o logotipo do jogo
        this.titulo = game.add.sprite(game.world.centerX, 30, 'gameover');
        this.titulo.anchor.setTo(0.5, 0);
		
		//cria botão 
		this.botao_continuar = game.add.button(20, game.world.height - 50, 'botao_play', this.acaoBotaoContinuar, this, 1, 0, 1);
        
        //escrevendo os pontos
		//primeiro definimos a fonte e a cor
        var estilo = { 
			font: 'bold 25px Arial', 
			fill: '#fff', 
			boundsAlignH: "center", 
			boundsAlignV: "middle"
		};

        //depois criamos o texto na posição desejada
        var texto = game.add.text(0, game.world.centerY, this.pontos + ' Pontos!', estilo);
        
		//adicionamos sombra ao texto
        texto.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		
		//configura a caixa para alinhar o texto
		texto.setTextBounds(0, game.world.centerY, game.world.width, 50);
    },
	
	//ação do botão
	acaoBotaoContinuar : function () {
		game.state.start('Play');
	}
};