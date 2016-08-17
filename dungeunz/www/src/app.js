(function () {
	// crio a variável que irá representar o Phaser
    // definindo a largura e altura da área do jogo
	//calcula a proporção
	var proporcao = window.innerWidth / window.innerHeight;
    
	//cria a áre de acordo com a proporção
	game = new Phaser.Game(Math.ceil(160 * proporcao), 160, Phaser.CANVAS, null);

    // adiciono o primeiro state que define o jogo
    game.state.add('Boot', Boot);
    
    //  inicia o state
    game.state.start('Boot');

})();