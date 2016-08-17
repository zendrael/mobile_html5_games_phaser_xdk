//cria o State Play
Play = function (game) {};

//define os métodos da classe
Play.prototype = {
	//inicialização
	init: function (pontos, vidas) {
		//inicia jogo com 0 pontos e
		//ao reiniciar, não perde os pontos obtidos
		this.pontos = (pontos != null) ? pontos : 0;

		//não perde as vidas qu eo jogador já tinha
		this.vidas = (vidas != null) ? vidas : 3;
	},

	//primeira execução
	create: function () {
		//habilitando Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//define o fundo
		this.criarCenario();

		//cria as plataformas
		this.criarPlataformas();
		//cria obstáculos
		this.criarCaixas();

		//cria o jogador e configura
		this.criarJogador();

		//cria os inimigos
		this.criarMonstros();

		//cria os botões de jogo
		this.criarBotoes();

		//cria o cronômetro
		this.criarCronometro();

		//cria o marcador de vidas
		this.criarVidasJogador();

		//configura teclado
		this.teclado = game.input.keyboard.createCursorKeys();
		//marcador do botão pressionado na tela
		this.botaoAtivo = '';
	},

	//atualização a cada frame
	update: function () {
		//verifica as colisões das caixas
		game.physics.arcade.collide(this.caixas, this.pilares);
		game.physics.arcade.collide(this.caixas, this.solo);
		game.physics.arcade.collide(this.caixas, this.plataformas);
		game.physics.arcade.collide(this.caixas, this.caixas);
		game.physics.arcade.collide(this.caixas, this.monstros);

		//colisões para o jogador
		game.physics.arcade.collide(this.jogador, this.pilares);
		game.physics.arcade.collide(this.jogador, this.solo);
		game.physics.arcade.collide(this.jogador, this.plataformas);
		game.physics.arcade.collide(this.jogador, this.caixas);
		game.physics.arcade.collide(this.jogador, this.monstros, this.colideComMonstros, null, this);

		//colisões para os monstros
		game.physics.arcade.collide(this.monstros, this.pilares);
		game.physics.arcade.collide(this.monstros, this.solo);
		game.physics.arcade.collide(this.monstros, this.plataformas);

		//reposiciona os monstros
		this.atualizarMonstros();

		//verifica teclas pressionadas
		this.verificarTeclas();
	},

	criarCenario: function () {
		//altera a cor de fundo
		this.game.stage.backgroundColor = '#d0f4f7';

		//coloca uma imagem de fundo
		game.add.tileSprite(0, game.world.height - 42 - 63, game.width, 231, 'fundo', 0);

		//cria pilares
		this.pilares = game.add.group();
		var pilar1 = this.pilares.create(0, 0, 'pilares');
		var pilar2 = this.pilares.create(game.world.width - 21, 0, 'pilares');

		//aplica física
		game.physics.arcade.enable(this.pilares);
		this.pilares.enableBody = true;
		pilar1.enableBody = true;
		pilar1.body.immovable = true;
		pilar1.body.moves = false;
		pilar2.enableBody = true;
		pilar2.body.immovable = true;
		pilar2.body.moves = false;

		//verifica qual tipo de solo criar
		this.tipoSolo = game.rnd.integerInRange(0, 5);

		//cria o solo
		this.solo = game.add.tileSprite(0, game.world.height - 42, game.width, 42, 'solos', this.tipoSolo);
		//aplica física
		game.physics.arcade.enable(this.solo);
		this.solo.enableBody = true;
		this.solo.body.immovable = true;
		this.solo.body.moves = false;
	},

	criarPlataformas: function () {
		//define um grupo
		this.plataformas = game.add.group();
		//aplica física
		game.physics.arcade.enable(this.plataformas);
		this.plataformas.enableBody = true;

		//cria quantidade aleatoriamente
		var quantidade = game.rnd.integerInRange(10, 15);

		//intervalo possível de posições na vertical
		var posicoesY = [1, 3, 5];

		//cria plataformas
		for (var i = 0; i < quantidade; i++) {
			//gera posição aleatória
			var x = game.rnd.integerInRange(0, Math.floor((game.world.width / 21) - 1)) * 21;
			var y = posicoesY[game.rnd.integerInRange(0, posicoesY.length - 1)] * 21;

			//gera largura aleatória
			var largura = game.rnd.integerInRange(2, 3) * 21;

			var plataforma = game.add.tileSprite(x, y, largura, 21, 'solos', this.tipoSolo, this.plataformas);
			plataforma.body.immovable = true;
			plataforma.body.moves = false;
			
			//plataformas tipo 'cloud'
			//plataforma.body.checkCollision.down = false;
    		//plataforma.body.checkCollision.left = false;
    		//plataforma.body.checkCollision.right = false;
		}
	},

	criarCaixas: function () {
		//define um grupo
		this.caixas = game.add.group();
		//aplica física
		game.physics.arcade.enable(this.caixas);
		this.caixas.enableBody = true;

		//cria quantidade aleatoriamente
		var quantidade = game.rnd.integerInRange(5, 10);

		//cria caixas em posições aleatórias
		for (var i = 0; i < quantidade; i++) {
			//gera posição aleatória
			var x = game.rnd.integerInRange(1, Math.floor((game.world.width / 21) - 1)) * 21;
			var y = game.rnd.integerInRange(0, 5) * 21;

			//cria elemento no grupo
			var caixa = this.caixas.create(x, y, 'caixas');

			//troca o tipo da caixa
			caixa.frame = game.rnd.integerInRange(0, 3);

			//aplica física
			caixa.body.gravity.y = 300;
			caixa.body.bounce.y = 0.2 + Math.random() * 0.2;
		}
	},

	criarJogador: function () {
		//adiciona o jogador na tela
		this.jogador = game.add.sprite(game.world.centerX, game.world.height - 65, 'jogador');

		//cria propriedade personalizada
		this.jogador.vidas = this.vidas;
		this.jogador.atingido = false;

		//cria animações
		this.jogador.animations.add('paraEsquerda', [6, 7]);
		this.jogador.animations.add('paraDireita', [4, 5]);

		//aplica física 
		game.physics.arcade.enable(this.jogador);
		this.jogador.enableBody = true;
		this.jogador.body.gravity.y = 200;

		//define área de colisão
		this.jogador.body.setSize(17, 18, 2, 3);

		//evita sair da tela
		this.jogador.body.collideWorldBounds = true;
	},

	criarMonstros: function () {
		//cria um grupo de monstros
		this.monstros = game.add.group();

		//aplica física aos monstros
		game.physics.arcade.enable(this.monstros);
		this.monstros.enableBody = true;

		//quantidade de monstros
		this.quantidadeMonstros = game.rnd.integerInRange(5, 10);

		//marca quantos monstros destruídos
		this.monstrosMortos = 0;

		//direções a seguir
		var direcoes = ['Direita', 'Esquerda'];

		//adiciona monstros ao grupo 
		for (var i = 0; i < this.quantidadeMonstros; i++) {
			//tipos de monstros possíveis
			var tipo = game.rnd.integerInRange(0, 6);

			//gera posição aleatória
			var x = game.rnd.integerInRange(1, Math.floor((game.world.width / 21) - 1)) * 21;

			//cria fora da tela
			var monstro = this.monstros.create(x, 0, 'monstros');

			//define área de colisão
			monstro.body.setSize(19, 5, 2, 16);

			//aplica física
			monstro.body.gravity.y = 300;
			monstro.body.bounce.x = 0.1 + Math.random() * 0.2;

			//define animações
			monstro.animations.add('irEsquerda', [0 + (tipo * 6), 1 + (tipo * 6)]);
			monstro.animations.add('irDireita', [4 + (tipo * 6), 5 + (tipo * 6)]);

			//define a direção que irá
			monstro.direcao = direcoes[game.rnd.integerInRange(0, direcoes.length)];

			//de acordo com a direção, aplica a velocidade
			if (monstro.direcao == 'Direita') {
				//velocidade do movimento
				monstro.body.velocity.x = game.rnd.integerInRange(80, 150);
			} else {
				monstro.body.velocity.x = -game.rnd.integerInRange(80, 150);
			}

			//inicia a animação
			monstro.animations.play('ir' + monstro.direcao, game.rnd.integerInRange(4, 7), true);
		}

		//se saírem fora da tela, elimina
		this.monstros.setAll('outOfBoundsKill', true);
	},

	atualizarMonstros: function () {
		//percorre o grupo e realiza alterações
		this.monstros.forEach(function (monstro) {
			//verifica para onde está indo e se deve ser reposicionado
			if (monstro.direcao == 'Direita' && monstro.body.touching.right) {
				//vai para outra direção
				monstro.direcao = 'Esquerda';
				monstro.body.velocity.x = -game.rnd.integerInRange(80, 150);
				//acerta a animação
				monstro.animations.play('irEsquerda', game.rnd.integerInRange(4, 7), true);

			} else if (monstro.direcao == 'Esquerda' && monstro.body.touching.left) {
				//vai para outra direção
				monstro.direcao = 'Direita';
				monstro.body.velocity.x = game.rnd.integerInRange(80, 150);
				//acerta a animação
				monstro.animations.play('irDireita', game.rnd.integerInRange(4, 7), true);
			}
		}, this);
	},

	criarBotoes: function () {
		//cria os botões e seus eventos
		var botao_esquerda = game.add.button(0, game.height - 64, 'botoes_jogo', null, this, 4, 0, 4);
		botao_esquerda.name = 'esquerda';
		botao_esquerda.events.onInputDown.add(this.botaoPressionado, this);
		botao_esquerda.events.onInputUp.add(this.botaoSolto, this);

		var botao_direita = game.add.button(64, game.height - 64, 'botoes_jogo', null, this, 5, 1, 5);
		botao_direita.name = 'direita';
		botao_direita.events.onInputDown.add(this.botaoPressionado, this);
		botao_direita.events.onInputUp.add(this.botaoSolto, this);

		var botao_cima = game.add.button(game.width - 64, game.height - 64, 'botoes_jogo', null, this, 6, 2, 6);
		botao_cima.name = 'cima';
		botao_cima.events.onInputDown.add(this.botaoPressionado, this);
		botao_cima.events.onInputUp.add(this.botaoSolto, this);

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
		//inicia sem o deslocamento
		this.jogador.body.velocity.x = 0;

		if (this.teclado.left.isDown || this.botaoAtivo == 'esquerda') {
			this.jogador.body.velocity.x = -100;
			//se estiver no chão, anda
			if (this.jogador.body.touching.down) {
				this.jogador.animations.play('paraEsquerda', 7, true);
			}
		}

		if (this.teclado.right.isDown || this.botaoAtivo == 'direita') {
			this.jogador.body.velocity.x = 100;
			//se estiver no chão, anda
			if (this.jogador.body.touching.down) {
				this.jogador.animations.play('paraDireita', 7, true);
			}
		}

		if ((this.teclado.up.isDown || this.botaoAtivo == 'cima') && this.jogador.body.touching.down) {
			//faz o jogador 'pular'
			this.jogador.body.velocity.y = -170;
			
			this.jogador.animations.stop();
			if (this.jogador.animations.currentAnim.name == 'paraDireita') {
				this.jogador.frame = 8;
			} else {
				this.jogador.frame = 9;
			}

		}
	},

	colideComMonstros: function (jogador, monstro) {
		//verifica se o jogador está pisando no monstro
		if (jogador.body.touching.down && monstro.body.touching.up) {
			//toca o som 
			var som = game.add.audio('colisao');
			som.play();

			//mata o monstro e remove do grupo
			monstro.destroy();

			//um monstro a menos
			this.monstrosMortos++;

			//jogador é rebate para cima
			this.jogador.body.velocity.y = -50;

			//verifica se acabou com todos
			if ((this.monstros.total <= 0) || (this.monstros.length <= 0)) {
				game.state.start('Score', true, false, this.pontos + this.quantidadeMonstros, this.jogador.vidas);
			}

		} else if (!this.jogador.atingido) {
			//jogador foi atingido
			this.jogador.atingido = true;
			this.jogador.vidas--;
			this.textoVidas.setText(this.jogador.vidas);

			//toca o som 
			var som = game.add.audio('colisao');
			som.play();

			this.jogador.animations.stop();
			if (this.jogador.animations.currentAnim.name == 'paraDireita') {
				this.jogador.frame = 12;
			} else {
				this.jogador.frame = 13;
			}

			//verifica se o dispositivo aceita vibração
			if ("vibrate" in window.navigator) {
				window.navigator.vibrate(200);
			}

			if (this.jogador.vidas > 0) {
				//pode ser atingido de novo depois de dois segundos
				game.time.events.add(Phaser.Timer.SECOND * 2, function () {
					//volta ao normal
					this.jogador.atingido = false;
				}, this).autoDestroy = true;

			} else {
				//toca o som 
				var som = game.add.audio('fimjogo');
				som.play();

				game.state.start('GameOver', true, false, this.pontos + this.monstrosMortos);
			}
		}

	},

	criarCronometro: function () {
		//coloca a imagem na tela
		var icone = game.add.sprite(game.world.width - 120, game.world.height - 30, 'icones');
		icone.frame = 0;

		//cria o texto onde vai ser mostrado
		var estilo = {
			font: 'bold 23px Arial',
			fill: '#fff',
			align: 'center'
		};
		this.textoCronometro = game.add.text(game.world.width - 100, game.world.height - 30, '0', estilo);
		this.textoCronometro.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

		//inicia com valor padrão de 30 segundos
		this.valorCronometro = 30;

		//diz ao Phaser o que fazer a cada segundo
		this.time.events.loop(Phaser.Timer.SECOND, this.AtualizarCronometro, this);
	},

	AtualizarCronometro: function () {
		//tira um segundo
		this.valorCronometro--;

		//fim de jogo por tempo
		if (this.valorCronometro == 0) {
			game.state.start('GameOver', true, false, this.pontos + this.monstrosMortos);

		} else {
			//atualiza o cronômetro em tela
			this.textoCronometro.setText(this.valorCronometro);
		}
	},

	criarVidasJogador: function () {
		//coloca a imagem na tela
		var icone = game.add.sprite(game.world.width - 170, game.world.height - 30, 'icones');
		icone.frame = 1;

		//cria o texto onde vai ser mostrado
		var estilo = {
			font: 'bold 23px Arial',
			fill: '#fff',
			align: 'center'
		};
		this.textoVidas = game.add.text(game.world.width - 150, game.world.height - 30, '0', estilo);
		this.textoVidas.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

		this.textoVidas.setText(this.jogador.vidas);
	}

};