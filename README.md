# Desenvolvendo Jogos Mobile com HTML5
Fontes dos projetos do livro [Desenvolvendo Jogos Mobile com HTML5](https://novatec.com.br/livros/jogos-mobile-html5/) usando Phaser, Intel XDK e Apache Cordova / Phonegap

## NOTA SOBRE O NOVO Intel XDK!
Devido a uma atualização do Intel XDK, não há mais a opção de criar diretamente um projeto com Phaser como descrito no livro, mas isso é facilmente contornado com os passos a seguir e implicam somente na criação do projeto:

1. Como o template de games não existe mais, pode usar o template  "Blank" e escolher "HTML5 + Cordova" 
2. Clicar em "Continue"
3. Dê um nome ao projeto, como pedido e citado no livro, escolha também onde irá salvá-lo
4. Clique em "Create" e aguarde
5. Ele vai criar um projeto com uma estrutura bem mais simples que a do livro, não tem problema, basta criar as pastas DENTRO DO WWW que são mostradas no livro.
6. Como ele não faz mais o Download automático do Phaser, acesse este endereço: http://phaser.io/download/stable e baixe o phaser.min.js colocando-o dentro da pasta lib (que faz parte das pastas que você teve que criar no passo anterior)
7. Daqui em diante só seguir o livro normalmente!

## XDK VERSÃO 3900+ NÃO FAZ MAIS BUILD NA NUVEM!
Segundo nota da Intel, a partir da versão 3900 do XDK o build na nuvem está descontinuado e será removido completamente das próximas versões e é altamente recomendado seguir os passos deste link (fornecido pela Intel e equipe do XDK) para gerar aplicativos móveis: https://software.intel.com/pt-br/xdk/docs/build-xdk-app-with-phonegap-cordova-cli

