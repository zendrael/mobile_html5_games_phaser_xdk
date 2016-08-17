//cria o State Play
Play = function (game) {};

//define os métodos da classe
Play.prototype = {
	//inicialização
	init: function (caverna, vidas) {
		//inicia jogo na no hall
		//ao reiniciar, incrementa o número da caverna
		this.numeroCaverna = (caverna != null) ? caverna : 0;

		//não perde as vidas que o jogador já tinha
		this.vidasJogador = (vidas != null) ? vidas : 3;
	},

	//primeira execução
	create: function () {
		//habilitando Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//define o fundo
		this.criarCenario();

		//cria o jogador e configura
		this.criarJogador();

		//cria os inimigos
		this.criarInimigos();

		//cria os botões de jogo
		this.criarBotoes();

		//cria o marcador de vidas
		this.criarIconesVidasJogador();

		//atualiza assim que cria o state
		this.atualizarIconesVidasJogador();

		//cria texto informativo
		this.criarInformacao();

		//configura teclado
		this.teclado = game.input.keyboard.createCursorKeys();
		//marcador do botão pressionado na tela
		this.botaoAtivo = '';
	},

	//atualização a cada frame
	update: function () {
		//colisões para o jogador
		game.physics.arcade.collide(this.jogador, this.layerParedes);
		game.physics.arcade.collide(this.jogador, this.layerObjetos);
		game.physics.arcade.collide(this.jogador, this.layerPortas, this.abrirPorta, null, this);
		game.physics.arcade.overlap(this.jogador, this.inimigos, this.colideComInimigo, null, this);

		//colisões para os inimigos
		game.physics.arcade.collide(this.inimigos, this.layerParedes, this.colideComObstaculo, null, this);
		game.physics.arcade.collide(this.inimigos, this.layerObjetos, this.colideComObstaculo, null, this);

		//reposiciona os inimigos
		this.atualizarInimigos();

		//verifica teclas pressionadas
		this.verificarTeclas();
	},

	criarCenario: function () {
		//altera a cor de fundo
		this.game.stage.backgroundColor = '#000000';

		if (this.numeroCaverna == 0) {
			//caverna inicial
			this.mapa = game.add.tilemap('mapa00');
		} else {
			//vai para uma caverna aleatória entre as existentes
			this.mapa = game.add.tilemap('mapa0' + game.rnd.integerInRange(1, 3));
		}

		//associa a imagem ao alias dentro do arquivo JSON do mapa
		this.mapa.addTilesetImage('mapa', 'tileset');

		//cria cada um dos layers
		this.layerChao = this.mapa.createLayer('chao');
		this.layerParedes = this.mapa.createLayer('paredes');
		this.layerPortas = this.mapa.createLayer('portas');
		this.layerObjetos = this.mapa.createLayer('objetos');
		this.layerDetalhes = this.mapa.createLayer('detalhes');

		//define a área do mapa em tela
		//é necessário para o funcionamento da câmera
		game.world.setBounds(0, 0, this.mapa.width * 16, this.mapa.height * 16);

		//habilita colisões com as paredes
		//this.mapa.setCollisionBetween(0, 521, true, 'paredes');

		//colisões com os objetos
		this.mapa.setCollisionBetween(100, 521, true, 'objetos');

		//colisões com as portas
		this.mapa.setCollisionBetween(100, 521, true, 'portas');
		
		//desabilita colisões para alguns tiles
		this.mapa.setCollisionByExclusion([126,271], true, 'paredes');
	},

	criarJogador: function () {
		//adiciona o jogador na tela
		this.jogador = game.add.sprite(game.world.centerX, game.world.centerY, 'personagens');

		//ajusta posição
		this.mapa.objects['jogador'].forEach(function (element) {
			this.jogador.x = element.x;
			this.jogador.y = element.y;
		}, this);

		this.jogador.frame = 11;

		//cria propriedade personalizada
		this.jogador.vidas = this.vidasJogador;
		this.jogador.atingido = false;

		//aplica física 
		game.physics.arcade.enable(this.jogador);
		this.jogador.enableBody = true;

		//faz a câmera seguir o jogador
		game.camera.follow(this.jogador);
	},

	criarInimigos: function () {
		//cria um grupo de inimigos
		this.inimigos = game.add.group();

		//cria inimigos a partir do layer de objetos
		this.mapa.createFromObjects('inimigos', 'inimigo01', 'personagens', 20, true, false, this.inimigos);

		//aplica física aos inimigos
		game.physics.arcade.enable(this.inimigos);
		this.inimigos.enableBody = true;

		//percorre o grupo e realiza alterações
		this.inimigos.forEach(function (inimigo) {
			//altera o frame
			inimigo.frame = game.rnd.integerInRange(20, 21);

			//cria propriedade
			inimigo.parado = true;

			//remove ou não da fase
			if (game.rnd.integerInRange(0, 100) > 50) {
				inimigo.kill();
			}

		}, this);
	},

	atualizarInimigos: function () {
		//percorre o grupo e realiza alterações
		this.inimigos.forEachAlive(function (inimigo) {
			//se o inimigo estiver parado
			if (inimigo.parado) {
				//começa a se movimentar
				inimigo.parado = false;

				//tenta alcançar o jogador
				game.physics.arcade.moveToObject(inimigo, this.jogador, game.rnd.integerInRange(80, 100));
			}
		}, this);
	},

	criarBotoes: function () {
		//cria os botões e seus eventos
		var botao_esquerda = game.add.button(0, game.height - 32, 'botoes_jogo', null, this, 4, 0, 4);
		botao_esquerda.fixedToCamera = true;
		botao_esquerda.name = 'esquerda';
		botao_esquerda.events.onInputDown.add(this.botaoPressionado, this);
		botao_esquerda.events.onInputUp.add(this.botaoSolto, this);

		var botao_direita = game.add.button(32, game.height - 32, 'botoes_jogo', null, this, 5, 1, 5);
		botao_direita.fixedToCamera = true;
		botao_direita.name = 'direita';
		botao_direita.events.onInputDown.add(this.botaoPressionado, this);
		botao_direita.events.onInputUp.add(this.botaoSolto, this);

		var botao_cima = game.add.button(game.width - 64, game.height - 32, 'botoes_jogo', null, this, 6, 2, 6);
		botao_cima.fixedToCamera = true;
		botao_cima.name = 'cima';
		botao_cima.events.onInputDown.add(this.botaoPressionado, this);
		botao_cima.events.onInputUp.add(this.botaoSolto, this);

		var botao_baixo = game.add.button(game.width - 32, game.height - 32, 'botoes_jogo', null, this, 7, 3, 7);
		botao_baixo.fixedToCamera = true;
		botao_baixo.name = 'baixo';
		botao_baixo.events.onInputDown.add(this.botaoPressionado, this);
		botao_baixo.events.onInputUp.add(this.botaoSolto, this);

	},

	botaoPressionado: function (botao) {
		//marca qual o botão pressionado
		this.botaoAtivo = botao.name;
	},

	botaoSolto: function () {
		//desmarca o botão
		this.botaoAtivo = '';
	},

	verificarTeclas: function () {
		if (this.teclado.left.isDown || this.botaoAtivo == 'esquerda') {
			this.jogador.body.velocity.x = -80;
			this.jogador.body.velocity.y = 0;

		} else if (this.teclado.right.isDown || this.botaoAtivo == 'direita') {
			this.jogador.body.velocity.x = 80;
			this.jogador.body.velocity.y = 0;

		} else if (this.teclado.up.isDown || this.botaoAtivo == 'cima') {
			this.jogador.body.velocity.x = 0;
			this.jogador.body.velocity.y = -80;

		} else if (this.teclado.down.isDown || this.botaoAtivo == 'baixo') {
			this.jogador.body.velocity.x = 0;
			this.jogador.body.velocity.y = 80;

		} else {
			this.jogador.body.velocity.x = 0;
			this.jogador.body.velocity.y = 0;
		}
	},

	abrirPorta: function (jogador, porta) {
		//toca o som 
		var som = game.add.audio('pontuou');
		som.play();

		//recria o state com outro cenário
		//passando as variáveis
		game.state.start('Play', true, false, this.numeroCaverna + 1, jogador.vidas);
	},

	colideComInimigo: function (jogador, inimigo) {
		if (!this.jogador.atingido) {
			//jogador foi atingido
			jogador.atingido = true;
			jogador.vidas--;

			//atualiza corações na tela
			this.atualizarIconesVidasJogador();

			//muda de cor
			jogador.tint = 0xff0000;

			//toca o som 
			var som = game.add.audio('colisao');
			som.play();

			//verifica se o dispositivo aceita vibração
			if ("vibrate" in window.navigator) {
				window.navigator.vibrate(200);
			}

			//para o inimigo
			inimigo.body.velocity.x = 0;
			inimigo.body.velocity.y = 0;

			//permite que se movimente após um tempo
			game.time.events.add(Phaser.Timer.SECOND * game.rnd.integerInRange(1, 3), function () {
				//pode se movimentar de novo
				inimigo.parado = true;
			}, this).autoDestroy = true;

			//verifica se o jogador ainda possui vidas
			if (jogador.vidas > 0) {
				//pode ser atingido de novo depois de dois segundos
				game.time.events.add(Phaser.Timer.SECOND * 2, function () {
					//volta ao normal
					jogador.atingido = false;

					//volta cor normal
					jogador.tint = 0xFFFFFF;
				}, this).autoDestroy = true;

			} else {
				//toca o som 
				var som = game.add.audio('fimjogo');
				som.play();

				//volta a câmera para posição padrão
				game.camera.reset();

				//redimensiona a área do mundo
				this.game.world.setBounds(0, 0, this.game.width, this.game.height);

				//muda de state
				game.state.start('GameOver', true, false, this.numeroCaverna);
			}
		}

	},

	colideComObstaculo: function (inimigo, obstaculo) {
		//aguarda algum tempo antes de se mover novamente
		game.time.events.add(Phaser.Timer.SECOND * game.rnd.integerInRange(1, 3), function () {
			//pode se movimentar de novo
			inimigo.parado = true;
		}, this).autoDestroy = true;
	},

	criarIconesVidasJogador: function () {
		//cria grupo de icones
		this.iconesVidas = game.add.group();

		for (var i = 0; i < 3; i++) {
			var icone = this.iconesVidas.create(5 + (i * 16), 5, 'vidas');
			icone.frame = 0;
			icone.fixedToCamera = true;
			icone.posicao = i;
		}
	},

	atualizarIconesVidasJogador: function () {
		//percorre o grupo e realiza alterações
		this.iconesVidas.forEach(function (icone) {
			if (icone.posicao >= this.jogador.vidas) {
				icone.frame = 1;
			}
		}, this);
	},

	criarInformacao: function () {
		//cria o texto onde vai ser mostrado
		var estilo = {
			font: 'bold 15px Arial',
			fill: '#fff',
			align: 'center'
		};

		//cria o texto na tela
		this.textoInformacao = game.add.text(5, 20, '0', estilo);
		this.textoInformacao.fixedToCamera = true;
		this.textoInformacao.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

		if (this.numeroCaverna == 0) {
			this.textoInformacao.setText('Início');
		} else {
			this.textoInformacao.setText('Caverna ' + this.numeroCaverna);
		}

		//apaga o texto após 2 segundos
		game.time.events.add(Phaser.Timer.SECOND * 2, function () {
			//deixa transparente aos poucos
			game.add.tween(this.textoInformacao).to({
				alpha: 0
			}, 2000, 'Linear', true);

		}, this).autoDestroy = true;
	}

};