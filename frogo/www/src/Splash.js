//cria o State Splash
Splash = function (game) {
};

//define os métodos da classe
Splash.prototype = {
    //pré-carregamento
    preload : function () {
        //imagem usada para exibir o splash
        this.load.image('logoSplash', 'asset/logotipo_empresa.png');
        
        //imagens que serão usadas para o carregamento
        this.load.image('logoJogo', 'asset/logotipo_jogo.png');
        this.load.image('barraLoading', 'asset/barra_loading.png');
    },

    //primeira execução
    create : function () {
        //altera a cor de fundo
        this.game.stage.backgroundColor = '#FFFFFF';
        
        //carrega a imagem na tela
        this.logo = game.add.sprite( game.world.centerX, game.world.centerY, 'logoSplash');
        //usa o ponto central da imagem como referência
        this.logo.anchor.setTo(0.5, 0.5);
        
        //aguarda 3 segundos antes de prosseguir
        setTimeout( function () {
            //chama o Preload
            game.state.start('Preload');
        }, 3000);
    }
};