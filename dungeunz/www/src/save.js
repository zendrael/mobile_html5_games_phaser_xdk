//cria métodos para salvar informações

//salva informações
function salvarJogo( caverna ) {
	//se há suporta ao localStorage
	if ( typeof (Storage) !== 'undefined') {
		//insere em uma chave
		localStorage.setItem('pontos', caverna);
	} else {
		// não há suporte...
		console.log('Não há suporte para salvar dados nesta plataforma!');
	}
}
 
//carrega dados salvos anteriormente
function carregarJogo() {
	//se há suporta ao localStorage
	if ( typeof (Storage) !== 'undefined') {
		//lê os pontos salvos
		var pontos = localStorage.getItem('pontos');
		
		//verifica se já existe algum valor
		if( pontos == undefined ){
			pontos = 0;
		}
		
		//retorna o valor encontrado
		return( pontos );
	} else {
		// não há suporte...
		console.log('Não há suporte para recuperar dados nesta plataforma!');
	}
}
//fim do arquivo