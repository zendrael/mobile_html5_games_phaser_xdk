//cria o State Play
Play = function (game) {
};

//define os métodos da classe
Play.prototype = {
	//inicialização
	init : function ( pontos ) {
		//inicia jogo com 0 pontos e
		//ao reiniciar, não perde os pontos obtidos
		this.pontos = ( pontos != null ) ? pontos : 0;
	},
	
	//primeira execução
    create : function () {
        //habilitando Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
		//define o fundo
		this.criarCenario();
		
		//cria o tesouro a ser encontrado
        this.criarTesouro();
		
		//cria arbustos para atrapalhar
		this.criarArbustos();
		
		//cria o jogador e configura
		this.criarJogador();
        
		//cria os veículos nas pistas
        this.criarVeiculos();

        //cria os botões de jogo
        this.criarBotoes();
		
		//configura teclado
        this.teclado = game.input.keyboard.createCursorKeys();
		//marcador do botão pressionado na tela
		this.botaoAtivo = '';
		
		//marca pontuação
		//primeiro definimos a fonte e a cor
        var estilo = { font: 'bold 20px Arial', fill: '#fff'};
		//posicionamos o texto
		var texto = game.add.text(8, 8, this.pontos + ' Pontos', estilo);
		//criamos um efeito de sombra
		texto.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
    },
    
    //atualização a cada frame
    update : function () {
        //verifica as colisões
		game.physics.arcade.overlap(this.jogador, this.veiculos, this.colideComVeiculos, null, this);
		game.physics.arcade.collide(this.jogador, this.arbustos);
		game.physics.arcade.overlap(this.jogador, this.tesouro, this.colideComTesouro, null, this);
		
		//reposiciona os veículos
		this.atualizarVeiculos();
		
		//verifica teclas pressionadas
		this.verificarTeclas();
    },
    
    criarCenario : function () {
        //altera a cor de fundo
        this.game.stage.backgroundColor = '#82bb65';
		
        //cria estradas
        //verifica quantas cabem na tela
        var quantidade = Math.floor( ( game.height - 96 ) / 64 );
        
        //guarda posições das pistas
        this.pistas = [64];
        
        //cria as estradas
        for (var i=0; i<(quantidade-1); i++ ) {
            
            //se a posição da pista for maior que o limite ou menor que o limite
            if( (this.pistas[i] > game.height-96) || (this.pistas[i] < 64) ){
                //sai do loop
                break;
            }
            
            //vai existir espaço entre as pistas?
            var espaco = game.rnd.integerInRange(1, 2);
            
            //cria a pista
            game.add.tileSprite(0, this.pistas[i], game.width, 64, 'estrada', 0);
            
            //adiciona a próxima pista no array
            this.pistas.push( this.pistas[i]+64+(espaco*32) );
        }
    },
	
	criarTesouro : function () {
		this.tesouro = game.add.sprite(game.world.centerX, game.world.height-64, 'tesouro');
        this.tesouro.anchor.setTo(0.5, 0);
		
		//aplica física
		game.physics.arcade.enable( this.tesouro );
		//habilita o corpo para interação
		this.tesouro.enableBody = true;
	},
	
	criarArbustos : function () {
		//cria grupo dos arbustos
		this.arbustos = game.add.group();
		
		//aplica física aos arbustos
        game.physics.arcade.enable( this.arbustos );
        this.arbustos.enableBody = true;
		
		//quantos cabem entre a largura da tela
		quantidade = Math.floor(game.width/32);
		
		//posiciona após cada pista
		for ( var y=0; y<this.pistas.length-1; y++) {

			//percorre a largura da tela
			for ( var x=0; x<quantidade; x++) {
				//posiciona aleatoriamente
				if( game.rnd.integerInRange(0,10) > 5 ){
					continue;
				}
				
				//cria elemento no grupo
				var arbusto = this.arbustos.create(x*32, this.pistas[y]+64, 'arbusto');
				
				//altera o tamanho da área de colisão
				arbusto.body.setSize(26, 26, 3, 3);
				
				//marca para não se mover 
				arbusto.body.immovable = true;
				arbusto.body.moves = false;
			}
		}
	},
	
	criarJogador : function () {
		//adiciona o jogador na tela
		this.jogador = game.add.sprite(game.world.centerX, 16, 'jogador');
		
		//cria animações
		this.jogador.animations.add('paraCima', [0, 1, 2, 1]);
		this.jogador.animations.add('paraBaixo', [6, 7, 8, 7]);
		this.jogador.animations.add('paraEsquerda', [9, 10, 11, 10]);
		this.jogador.animations.add('paraDireita', [3, 4, 5, 4]);
		
		//aplica física 
        game.physics.arcade.enable( this.jogador );
        this.jogador.enableBody = true;
		//define área de colisão
		this.jogador.body.setSize(18, 28, 7, 10);
		//evita sair da tela
		this.jogador.body.collideWorldBounds = true;
		
		//inicia a animação
		this.jogador.animations.play('paraBaixo', 7, true);
	},
    
    criarVeiculos : function () {
        //cria um grupo de veículos
        this.veiculos = game.add.group();
		
		//aplica física aos veículos
        game.physics.arcade.enable( this.veiculos );
        this.veiculos.enableBody = true;
        
        //tipos de veículos possíveis
        var tipoVeiculo = ['pickup_marrom','caminhonete_marrom'];
		//direções a seguir
		var direcoes = ['Direita','Esquerda'];
        
        //adiciona veículos ao grupo e 
        //coloca nas pistas
        for(var i=0; i<this.pistas.length-1; i++){
            //escolhe o tipo a ser criado
            var tipo = tipoVeiculo[ game.rnd.integerInRange(0, tipoVeiculo.length-1) ];
            
            //cria o veículo no grupo
            var veiculo = this.veiculos.create(32, this.pistas[i]-16, tipo);
			
			//define área de colisão
			if ( tipo == 'pickup_marrom' ) {
				veiculo.body.setSize(105, 43, 0, 19);
			} else {
				veiculo.body.setSize(130, 43, 2, 19);
			}
            
            //define animações
            veiculo.animations.add('irDireita', [0, 1]);
            veiculo.animations.add('irEsquerda', [2, 3]);
        
			//define a direção que irá
			veiculo.direcao = direcoes[ game.rnd.integerInRange(0, direcoes.length-1) ];
			
			//de acordo com a direção, prepara o veículo
			if( veiculo.direcao == 'Direita'){
				//velocidade do movimento
				veiculo.body.velocity.x = game.rnd.integerInRange(80, 150);
			} else {
				veiculo.body.velocity.x = -game.rnd.integerInRange(80, 150);
			}
			
			//inicia a animação
			veiculo.animations.play('ir'+veiculo.direcao, game.rnd.integerInRange(4, 7), true);
        }
    },
	
	atualizarVeiculos : function () {
		//percorre o grupo e realiza alterações
		this.veiculos.forEach( function( veiculo ) {
			//verifica para onde está indo e se deve ser reposicionado
			if( veiculo.direcao == 'Direita' && veiculo.x > game.width ){
				//volta ao outro lado da tela
				veiculo.x = -veiculo.width;
				
				//troca a velocidade do movimento
				veiculo.body.velocity.x = game.rnd.integerInRange(80, 150);
			} else if( veiculo.direcao == 'Esquerda' && veiculo.x < -veiculo.width ){
				//volta ao outro lado da tela
				veiculo.x = game.width;
				
				//troca a velocidade do movimento
				veiculo.body.velocity.x = -game.rnd.integerInRange(80, 150);
			}
		}, this);
	},
    
    criarBotoes : function () {
        //cria os botões e seus eventos
        var botao_esquerda = game.add.button(0, game.height-64, 'botoes_jogo', null, this, 4, 0, 4);
		botao_esquerda.name = 'esquerda';
		botao_esquerda.events.onInputDown.add( this.botaoPressionado, this );
		botao_esquerda.events.onInputUp.add( this.botaoSolto, this );
		
        var botao_direita = game.add.button(64, game.height-64, 'botoes_jogo', null, this, 5, 1, 5);
		botao_direita.name = 'direita';
		botao_direita.events.onInputDown.add( this.botaoPressionado, this );
		botao_direita.events.onInputUp.add( this.botaoSolto, this );
		
        var botao_cima = game.add.button(game.width-128, game.height-64, 'botoes_jogo', null, this, 6, 2, 6);
		botao_cima.name = 'cima';
		botao_cima.events.onInputDown.add( this.botaoPressionado, this );
		botao_cima.events.onInputUp.add( this.botaoSolto, this );
		
        var botao_baixo = game.add.button(game.width-64, game.height-64, 'botoes_jogo', null, this, 7, 3, 7);
		botao_baixo.name = 'baixo';
		botao_baixo.events.onInputDown.add( this.botaoPressionado, this);
		botao_baixo.events.onInputUp.add( this.botaoSolto, this );
	
    },

	botaoPressionado : function ( botao ) {
		//marca qual o botão pressionado
		this.botaoAtivo = botao.name;
	},
	
	botaoSolto : function () {
		//desmarca o botão
		this.botaoAtivo = '';
	},
	
	verificarTeclas : function () {
		if (this.teclado.left.isDown || this.botaoAtivo == 'esquerda') {
			this.jogador.body.velocity.x = -80;
			this.jogador.body.velocity.y = 0;
			this.jogador.animations.play('paraEsquerda', 7, true);
			
		} else if (this.teclado.right.isDown || this.botaoAtivo == 'direita') {
			this.jogador.body.velocity.x = 80;
			this.jogador.body.velocity.y = 0;
			this.jogador.animations.play('paraDireita', 7, true);
			
		} else if (this.teclado.up.isDown || this.botaoAtivo == 'cima') {
			this.jogador.body.velocity.x = 0;
			this.jogador.body.velocity.y = -80;
			this.jogador.animations.play('paraCima', 7, true);
			
		} else if (this.teclado.down.isDown || this.botaoAtivo == 'baixo') {
			this.jogador.body.velocity.x = 0;
			this.jogador.body.velocity.y = 80;
			this.jogador.animations.play('paraBaixo', 7, true);
			
		} else {
			this.jogador.body.velocity.x = 0;
			this.jogador.body.velocity.y = 0;
		}
	},
	
	colideComVeiculos : function () {
		//toca o som 
        var som = game.add.audio('fimjogo');
        som.play();
		
		//verifica se o dispositivo aceita vibração
		if ("vibrate" in window.navigator) {
            window.navigator.vibrate(200);
        }
		
		//fim de jogo depois de um segundo
		setTimeout( function () {
			game.state.start('GameOver', true, false, this.pontos);
		}, 1000);
	},
	
	colideComTesouro : function () {
		//toca o som 
        var som = game.add.audio('pontuou');
        som.play();
		
		//acrescenta pontos
		this.pontos++;
		
		//chama a tela de pontos
		game.state.start('Score', true, false, this.pontos);
	}
    
};