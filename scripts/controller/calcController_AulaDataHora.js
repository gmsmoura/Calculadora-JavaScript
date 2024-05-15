class CalcController{

    constructor(){

        //COM A O "this" TRANSFORMAMOS A VARIÁVEL EM UMA PROPRIEDADE, ATRIBUTO OU MÉTODO PARA SER UTILIZADA EM QUALQUER LUGAR DENTRO DA CLASSE INVÉS DE USAR O "var"
        //O UNDERLINE SIGNIFICA QUE OS ATRIBUTOS OU PROPRIEDADES SÃO PRIVADOS, ENTÃO É USADO POR "CONVENÇÃO"
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector('#display');
        this._horaEl = document.querySelector('#hora');
        this._dateEl = document.querySelector('#data');
        this._currentDate;
        this.initialize();
    }

    //MÉTODO PRINCIPAL PARA INICIALIZAÇÃO DA CALCULADORA
    initialize(){

        this.setDisplayDateTime();

        //ARROW FUNCTION, A SETA INDICA ONDE COMEÇA A EXECUÇÃO DA FUNÇÃO QUE SERÁ DENTRO DAS CHAVES
        //setInterval(), FUNCTION JS PARA EXECUTAR UMA AÇÃO DE ACORDO COM A QUANTIDADE DE TEMPO PRÉ-DETERMINADA
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        //EXEMPLO DE FUNÇÃO PARA DAR UM STOP NA FUNÇÃO "setInterval()" UTILIZANDO O "setTimeout"
        // setTimeout(() => {
        //     //PARA A EXECUÇÃO DO "setInterval()" LIMPANDO O ID DA FUNÇÃO "interval" QUE É GERADO AUTOMATICAMENTE PELO JS, DECLARANDO O "interval" ANTES DA FUNÇÃO
        //     //let interval = setInterval(()....
        //     clearInterval(interval);
        // }, 10000);
        
    }

    //MÉTODO QUE ESTÁ SENDO CHAMADO NO "initialize()"
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
           //FORMATANDO A DATA
           day: "2-digit",
           month: "long",
           yeah: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    //GETTERS AND SETTERS, GET PARA PEGAR E SET PARA ATRIBUIR VALORES 
    get displayTime(){
        return this._horaEl.innerHTML;
    }

    set displayTime(value){
        this._horaEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML = value; 
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._dataAtual = value;
    }

}