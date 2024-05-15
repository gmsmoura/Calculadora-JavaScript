class CalcController{

    constructor(){


        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector('#display');
        this._horaEl = document.querySelector('#hora');
        this._dateEl = document.querySelector('#data');
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){

        this.setDisplayDateTime();
        
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);      
    }

    initButtonsEvents(){
        //querySelectorAll PEGA TODOS OS ELEMENTOS DO SELETOR INFORMADO 
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        //LAÇO PARA PERCORRER CADA ELEMENTO (BUTTON) E APLICAR O EVENTO
        //NOS PARÂMETROS, QUANDO FOR SÓ UM PODE DEIXAR SOZINHO, MAS SE FOR MAIS DE UM TEM QUE DEIXA-LOS ENTRE PARENTESES E EM SEGUIDA VEM A FUNCTION
        buttons.forEach((btn, index) =>{
            btn.addEventListener('click', e => {
                //btn.className.baseVal TRÁS SÓ O NOME DA CLASSE, ISSO POR ESTAR SENDO USADO O SVG
                console.log(btn.className.baseVal.replace('btn-', ''));
            });
        });
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
           day: "2-digit",
           month: "long",
           year: "numeric"
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
        this._displayCalcEl.innerHTML = value; 
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._dataAtual = value;
    }

}