//cria o State GameOver
GameOver = function (game) {
};

//define os métodos da classe
GameOver.prototype = {
	//inicializa o state
	init : function ( caverna ) {
		//recebe os pontos obtidos
		this.caverna = ( caverna != null ) ? caverna : 0;
	},
	
    //primeira execução
    create : function () {
		//altera a cor de fundo
        this.game.stage.backgroundColor = '#667479';
		
		//coloca a imagem de fundo
		this.fundo = game.add.image(game.world.centerX, game.world.height, 'fundo_gameover');
		this.fundo.anchor.setTo(0.5, 1);
        
        //prepara e posiciona o logotipo do gameover
        this.titulo = game.add.sprite(game.world.centerX, 10, 'gameover');
        this.titulo.anchor.setTo(0.5, 0);
		
		//cria botão 
		this.botao_continuar = game.add.button(game.world.centerX, game.world.height - 40, 'botao_play', this.acaoBotaoContinuar, this, 1, 0, 1);
        this.botao_continuar.anchor.setTo(0.5, 0);
		
		//lê o 'save' do jogo
		this.verificarPontuacao();
		
        //escrevendo os pontos
		//primeiro definimos a fonte e a cor
        var estilo = { 
			font: 'bold 15px Times', 
			fill: '#fff', 
			boundsAlignH: "center", 
			boundsAlignV: "middle"
		};
        //depois criamos o texto na posição desejada
        var textoPontos = game.add.text(0, game.world.centerY-30, 'Caverna atingida: ' + this.caverna, estilo);
		//adicionamos sombra ao texto
        textoPontos.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		//configura a caixa para alinhar o texto
		textoPontos.setTextBounds(0, game.world.centerY-30, game.world.width, 50);
		
		//reaproveitamos a variável do estilo
		estilo = { 
			font: 'bold 12px Times', 
			fill: '#fff', 
			boundsAlignH: "center", 
			boundsAlignV: "middle"
		};
		//criamos novo objeto de texto
		var textoMelhorPontuacao = game.add.text(0, game.world.centerY-10, 'Caverna mais distante: ' + this.maiorPontuacao, estilo);
		//adicionamos sombra ao texto
        textoMelhorPontuacao.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		//configura a caixa para alinhar o texto
		textoMelhorPontuacao.setTextBounds(0, game.world.centerY-10, game.world.width, 50);
    },
	
	verificarPontuacao : function () {
		//lê informação salva
		this.maiorPontuacao = carregarJogo();
		
		//verifica se é mesmo a maior pontuação,
		//se não for, atualiza o 'save'
		if( this.maiorPontuacao < this.caverna ){
			//salva a pontuação nova
			salvarJogo( this.caverna );
			this.maiorPontuacao = this.caverna;
		}
	},
	
	//ação do botão
	acaoBotaoContinuar : function () {
		game.state.start('Play');
	}
};