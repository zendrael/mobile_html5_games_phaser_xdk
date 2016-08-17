//cria o State Boot
Boot = function (game) {
};

//define os métodos da classe
Boot.prototype = {
    //inicialização
    init : function () {
        //configura a área do jogo
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        //centraliza a área
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        //força a orientação do dispositivo
        //entre landscape e portrait
        this.scale.forceOrientation(false, true);
        
        //atualiza o tamanho da tela
        this.scale.updateLayout(true);
        
        //recalcula o tamanho
        this.scale.refresh();
        
        //vamos definir apenas um ponto de toque por vez
        this.input.maxPointers = 1;
        this.input.addPointer();
    },
    
    //primeira execução
    create : function () {
        //adiciona os outros States
        game.state.add('Splash', Splash);
        game.state.add('Preload', Preload);
        game.state.add('Menu', Menu);
        game.state.add('Play', Play);
		game.state.add('Score', Score);
        game.state.add('GameOver', GameOver);
        
        //chama o Splash
        game.state.start('Splash');
    }
};