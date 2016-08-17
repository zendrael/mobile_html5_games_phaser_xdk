//cria o State Menu
Menu = function (game) {
};

//define os métodos da classe
Menu.prototype = {
    //primeira execução
    create : function () {
		//altera a cor de fundo
        this.game.stage.backgroundColor = '#667479';
        
		//coloca a imagem de fundo
		this.fundoMenu = game.add.image(game.world.centerX, game.world.height, 'fundo_menu');
		this.fundoMenu.anchor.setTo(0.5, 1);
        
        //prepara e posiciona o logotipo do jogo
        this.logoJogo = game.add.sprite(game.world.centerX, 15, 'logoJogo');
        this.logoJogo.anchor.setTo(0.5, 0);
		
		//cria botão de Play
		this.botao_play = game.add.button(game.world.width-80, game.world.height-50, 'botao_play', this.acaoBotaoPlay, this, 1, 0, 1);
        
        //escrevendo o nome da empresa
		//primeiro definimos a fonte e a cor
        var estilo = { font: 'bold 10px Arial', fill: '#fff'};

        //depois criamos o texto na posição desejada
        var texto = game.add.text(10, game.world.height-15, '© 2016 Xyz Games', estilo);
        
		//adicionamos sombra ao texto
        texto.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		
		//toca música de fundo
		var musica = game.add.audio('musica');
		musica.loop = true;
        musica.play();
    },
	
	//ação do botão play
	acaoBotaoPlay : function () {
		game.state.start('Play');
	}
};