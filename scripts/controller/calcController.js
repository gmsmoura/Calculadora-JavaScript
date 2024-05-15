class CalcController{

    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector('#display');
        this._horaEl = document.querySelector('#hora');
        this._dateEl = document.querySelector('#data');
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    //CRIA UM ELEMENTO PROVISORIAMENTE PARA GUARDAR O VALUE COPIADO
    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy');
        input.remove();
    }

    //APLICA O "paste" UTILIZANDO O MÉTODO "addEventListener" PARA ADICIONAR O EVENTO "paste" e "getData" PARA CAPTURAR O TEXTO A SER COLADO
    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);

        });
    }

    initialize(){
        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);   
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                //MÉTODO QUE CONTROLA O ATRIBUTO SE ESTARÁ DESLIGADO OU NÃO
                this.toggleAudio();
            });
        });
    }

    //APLICADO CONDICIONAL PARA VERICIAR SE O ÁUDIO ESTÁ LIGADO OU DESLIGADO (TRUE OR FALSE)
    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    //MÉTODO PARA CRIAR ÁUDIO
    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard(){

        document.addEventListener('keyup', e=>{

            this.playAudio();

            switch (e.key){

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    //CHAMANDO O MÉTODO calc() PARA EXIBIR O RESULTADO QUANDO CLICAR NO "="
                    this.calc();
                    break;
    
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });
    }

    //MÉTODO CRIADO PARA UTILIZAR VÁRIOS EVENTOS EM UM ELEMENTO
    addEventListenerAll(element, events, fn){
        
        //split PARA TRANSFORMAR OS PARÂMETROS DE EVENTOS QUE SÃO STRING EM ARRAY PARA UTILIZAR NO forEach
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false);
        })

    }

    //MÉTODO PARA LIMPAR TODO O "_displayCalc"
    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

    //MÉTODO PARA LIMPAR O ÚLTIMO ELEMENTO DIGITADO DO ARRAY "_operation"
    clearEntry(){
        this._operation.pop();

        this.setLastNumberToDisplay();
    }

    //MÉTODO PARA RETORNAR QUAL TIPO DE ELEMENTO SERÁ OBTIDO DO ARRAY "_operation"
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    //MÉTODO PARA QUE O ULTIMO NÚMERO DIGITADO NAO ENTRE EM UM NOVO INDICE DO ARRAY E FIQUE CONCATENADO NO MESMO INDICE ENQUANTO NAO FOR CLICADO EM ALGUM OPERADOR
    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }

    //MÉTODO PARA VALIDAR OS OPERADORES, UTILIZANDO O "indexOf" PARA ENCONTRAR SE O VALOR EXISTE NO ARRAY DE OPERADORES ABAIXO
    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    pushOperation(value){

        this._operation.push(value);

        //VERIFICA SE JÁ TEM MAIS QUE 3 ITENS NO ARRAY PARA EXECUTAR UM CÁLCULO
        if(this._operation.length > 3){
            this.calc();
        }
    }
    
    //MÉTODO RESPONSÁVEL PELO CÁLCULO QUE SERÁ USADO MAIS DE UMA VEZ
    getResult(){
        try {
            //O "eval" EXECUTA QUALQUER TIPO DE CÁLCULO DE UMA EXPRESSÃO E O "join" É PARECIDO COM O "toString" TRANSFORMA EM STRING MAS COM FORMATAÇÃO, COM O ASPAS ELE REMOVE AS VÍRGULAS
            return eval(this._operation.join(""));
        } catch(e){
            setTimeout(() => {
                this.setError();
            }, 500);
        }
    }

    //MÉTODO PARA REALIZAÇÃO DO CÁLCULO UTILIZANDO O "eval"
    calc(){

        let last = '';

        //GUARDA O OPERADOR QUE FOR USADO QUANDO FOR MAIS DE 3 ITENS ou FOR IGUAL A 3 ITENS
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            //IRÁ CAPTURAR OS TRÊS ITENS NA OPERAÇÃO PARA CONTINUAR FAZENDO O CÁLCULO NA HORA DE PRESSIONAR O IGUAL
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){
         
            //pop RETIRA O ÚLTIMO ITEM PARA QUE O CÁLCULO POSSA SER REALIZADO ENTRE OS 3 PRIMEIROS ELEMENTOS, EX "345 + 234"
            last = this._operation.pop();

            //GUARDA O NÚMERO QUE FOR CALCULADO QUANDO FOR MAIS DE 3 ITENS
            this._lastNumber = this.getResult();
            
        } else if(this._operation.length == 3){
            
            //GUARDA O ÚLTIMO NÚMERO
            this._lastNumber = this.getLastItem(false);
        }

        console.log('lastOperator', this._lastOperator);
        console.log('lastNumber', this._lastNumber);

        let result = this.getResult();

        //if QUE VERIFICA SE CASO FOR ACIONADO O "%" REALIZA A OPERAÇÃO ABAIXO PARA CALCULAR A PORCENTAGEM E GUARDA O RESULTADO
        if(last == '%'){

            result /= 100;
            this._operation = [result];

        } else{

            this._operation = [result];

            //SE FOR DIFERENTE DE VAZIO, TIVER ALGO, ELE REALIZA O PUSH DO VALOR NO ARRAY
            if(last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    }

    //MÉTODO QUE VERIFICA SE O ÚLTIMO DO ITEM DO ARRAY É UM OPERADOR
    getLastItem(isOperator = true){

        let lastItem;

        //length-1 DEVIDO O ARRAY COMEÇAR NA POSIÇÃO '0', ENTÃO ELE PEGA O TOTAL DE ITENS E O "i--" PRA ELE VARRER DA FRENTE PRA TRÁS ATÉ ACABAR O ARRAY
        for(let i = this._operation.length -1; i >= 0; i--){
         
            //SE FOR UM OPERADOR, ESTÁ O ENCONTRANDO E O CAPTURA NA VARIÁVEL lastItem
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }

        if(!lastItem){

            //SE OPERADOR FOR IGUAL A TRUE SIGNIFICA QUE PEGA O ULTIMO OPERADOR, SE NÃO PEGA O ÚLTIMO NÚMERO
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    //MÉTODO PARA PEGAR O ÚLTIMO NÚMERO DO ARRAY PARA EXIBIÇÃO NO DISPLAY
    setLastNumberToDisplay(){

        //CHAMANDO O MÉTODO getLastItem, O false SIGNIFICA QUE ESTÁ PEGANDO UM NÚMERO E NÃO UM OPERADOR
        let lastNumber = this.getLastItem(false);

        //VERIFICA SE ÚLTIMO NÚMERO É IGUAL A VAZIO, E COLOCA '0'
        if(!lastNumber) 
            lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    //MÉTODO PARA ADICIONAR UM VALOR NUMÉRICO DIGITADO AO ARRAY "_operation"
    addOperation(value){

        //console.log('A', value, isNaN(this.getLastOperation()));

        //VERIFICAR SE É UM NÚMERO
        if(isNaN(this.getLastOperation())){
            
            //VALIDA QUANDO O ÚLTIMO ELEMENTO DIGITADO É UM OPERADOR, SE FOR, TROCA PARA O NOVO OPERADOR DIGITADO (O ÚLTIMO)
            if(this.isOperator(value)){

                this.setLastOperation(value);
            
            //VALIDA SE O ELEMENTO É UM "ponto" OU "igual", SE NÃO É UM NÚMERO    
            } else {
                this.pushOperation(value);

                this.setLastNumberToDisplay();
            }
        } else {

            //VALIDA QUANDO UM OPERADOR É DIGITADO PELA PRIMEIRA VEZ
            if(this.isOperator(value)){

                this.pushOperation(value);

            } else {

                //VALIDA SE O ÚLTIMO VALOR DIGITADO FOR UM NÚMERO, SE FOR, CONCATENA AO NÚMERO ANTERIOR COMO STRING E DEPOIS NO "setLastOperation" TRANSFORMA EM FLOAT
                let newValue = this.getLastOperation().toString() + value.toString();
                
                //CORRIGIR, ANTES ESTAVA COM O parseFloat(newValue); E REMOVEMOS PARA CORREÇÃO DO BUG DE ACEITAR MAIS DE UM PONTO, PORÉM QUANDO CLICA NO "=" ELE PEGA O ULTIMO NÚMERO CONCATENADO COM O "=" E NÃO FAZ O CÁLCULO
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
        }

        //console.log(this._operation);
    }

    setError(){
        this.displayCalc = 'Error';
    }

    //MÉTODO PARA EVENTO DO CLICK NO 'PONTO'
    addDot(){

        let lastOperation = this.getLastOperation();
        
        //VERIFICA SE A OPERAÇÃO JÁ EXISTE E SE ELA POSSUI UM "PONTO";
        //O SPLIT COM O INDEXOF, SEPARA E PROCURA SE EXISTE UM "PONTO", SE SIM ELE PARA E NEM CONTINUA O CÓDIGO
        //O TYPEOF VERIFICA SE O TIPO DO ÚLTIMO ITEM É UMA STRING, NO CASO O "PONTO"
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        //VERIFICAR SE O BOTÃO CLICADO É UM OPERADOR, SE FOR UNDEFINED SERÁ TRUE
        if(this.isOperator(lastOperation) || !lastOperation){

            //ADD UM NOVO ITEM NA NOSSA OPERAÇÃO
            this.pushOperation('0.');
        } else {

            //SE JÁ FOR UM NÚMERO, SOBREESCREVE A ÚLTIMA OPERAÇÃO
            //PARA CONCATENAR O NÚMERO COM O PONTO
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    //MÉTODO QUE EXECUTA AS VALIDAÇÕES DAS TECLAS A SEREM PRESSIONADAS COM "switch case"
    execBtn(value){
        
        this.playAudio();

        switch (value){

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'igual':
                //CHAMANDO O MÉTODO calc() PARA EXIBIR O RESULTADO QUANDO CLICAR NO "="
                this.calc();
                break;

            case 'ponto':
                this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default: 
                this.setError();
                break;
        }
    }

    //MÉTODO DE INICIALIZAÇÃO DOS EVENTOS E AÇÕES DOS BOTÕES DA CALCULADORA E PODE SER CHAMADO NO MÉTODO "initialize" OU NO PRÓPRIO "constructor"
    initButtonsEvents(){

        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        //VARRE TODOS OS BOTÕES E APLICA OS EVENTOS ABAIXO
        buttons.forEach((btn, index) =>{
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace('btn-', '');
                this.execBtn(textBtn);
            });

            //EVENTOS PARA CRIAR O ÍCONE DE 'mãozinha' QUANDO O ELEMENTO FOR 'clicável'
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = 'pointer'
            })
        });
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
           day: '2-digit',
           month: 'long',
           year: 'numeric'
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

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
        if(value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value; 
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._dataAtual = value;
    }

}