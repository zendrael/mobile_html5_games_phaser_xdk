(function () {
	// crio a variável que irá representar o Phaser
    // definindo a largura e altura da área do jogo
    //game = new Phaser.Game(480, 320, Phaser.CANVAS, null);
	//calcula a proporção
	var proporcao = window.innerHeight / window.innerWidth;
    
	//cria a áre de acordo com a proporção
	game = new Phaser.Game(320, Math.ceil(320 * proporcao), Phaser.CANVAS, null);

    // adiciono o primeiro state que define o jogo
    game.state.add('Boot', Boot);
    
    //  inicia o state
    game.state.start('Boot');

})();