//url para requicisões
const url = 'http://' + location.host.split(':')[0] + ':3000/';
//elementos html
let bStart = document.getElementById('bStart');
let initPlay = document.getElementById('initPlay');
let playername = document.getElementById('playername');
let playertag = document.getElementById('playertag');
let gameplay = document.getElementById('gameplay');
let playershowname = document.getElementById('playershowname');
let playershowtag = document.getElementById('playershowtag');
let playershowdate = document.getElementById('playershowdate');
let scoresvalues = document.querySelectorAll('.points');
let operationprint = document.getElementById('operation');
let showtimer = document.getElementById('showtimer');
let applause = document.getElementById('applause');
let emoji = document.getElementById('emoji');
let defeat = document.getElementById('defeat');
//sons
const drop = new Audio("./assets/songs/drop.wav");
const winLevel = new Audio("./assets/songs/winLevel.mp3");
//emojis
const emojis = {
    'crying': './img/emoji-crying.png',
    'sadness':'./img/emoji-sadness.png',
    'smiley':'./img/emoji-smiley.png',
    'sunglasses':'./img/emoji-sunglasses.png',
    'thinking':'./img/emoji-thinking.png'
}
//constantes de tempo
let timecred = 0;//credito de tempo
let timeSeg = 0;//tempo restante
let timecr = 0;// início da contagem de tempo
let timectrl = 0;//referência ao setInterval de tempo
let stoped = true;//está parado (true) ou não (false)
//classe com os dados dinamicos do jogo
class gamedb{
    constructor() {
        this.accValues = 0;
        this.sublevel = 0;
        this.user = {
            "name": "",
            "description": "",
            "score": 0,
            "level": 0,
            "timecred": 0
        }
        this.oper = {
            "operation" : "operação",
            "result" : 0
        }
    }
    gamereset(){
        this.accValues = 0;
        this.sublevel = 0;
        this.user = {
            "name": "",
            "description": "",
            "score": 0,
            "level": 0,
            "timecred": 0
        }
        this.oper = {
            "operation" : "operação",
            "result" : 0
        }
    }
    setaccValues(value){
        this.accValues = value;
    }
    incaccValues(plus){
        this.accValues += plus;
    }
    getaccValues(){
        return this.accValues;
    }
    setsublevel(value){
        this.sublevel = value;
    }
    incasublevel(plus){
        this.sublevel += plus;
    }
    getsublevel(){
        return this.sublevel;
    }
    getnameuser(){
        return this.user.name;
    }
    getdescuser(){
        return this.user.description;
    }
    getscoreuser(){
        return this.user.score;
    }
    getleveluser(){
        return this.user.level;
    }
    incscoreuser(plus){
        this.user.score += plus;
    }
    incleveluser(plus){
        this.user.level += plus;
    }
    setnameuser(value){
        this.user.name = value;
    }
    setdescuser(value){
        this.user.description = value;
    }
    setscoreuser(value){
        this.user.score = value;
    }
    setleveluser(value){
        this.user.level = value;
    }
    setUser(userset){
        this.user = userset;
    }
    setOper(operset){
        this.oper = operset;
    }
    getUser(){
        return this.user;
    }
    setOperOperation(operation){
        this.oper.operation = operation;
    }
    setOperResult(resultset){
        this.oper.result = resultset;
    }
    getOper(){
        return this.oper;
    }
    getOperOperation(){
        return this.oper.operation;
    }
    getOperResult(){
        return this.oper.result;
    }
    setTimeCred(value){
        this.user.timecred = value;
    }
    getTimeCred(){
        return this.user.timecred;
    }
}
let gamedates = new gamedb;

//inicia timer do jogo
function updateTime(){
    //se o tempo estiver parado nada acontece
    if (stoped) return;
    //atualiza o tempo em contagem regressiva
    timeSeg = timecred - Math.floor((+new Date() - timecr) / 1000);
    showtimer.innerHTML = Math.floor(timeSeg/60) +" : "+ timeSeg%60;
    //controla a cor (vere quando maior que 15s e vermelho quando melhor ou igual)
    if(timeSeg < 15){
        showtimer.style.color = 'red';
    }else{
        showtimer.style.color = 'var(--green-dark)';
    }
    //Quando termina o tempo para a contagem regressiva e muda a emoção
    if (timeSeg<=0) {
        stoped = true;
        emoji.src = emojis.crying;
        defeat.style.display = 'flex';
        document.getElementById('defeat-music').play();
        document.getElementById("background-music").volume = 0;
    }
    return;
}
//comando de iniciar jogo
function stargame(){
    //quando não digitou o nome do jogador
    if (playername.value == ""){
        alert("DIGITE SEU NOME DE JOGADOR");
        return false;
    }
    //muda a tela
    initPlay.style.display='none';
    gameplay.style.display='flex';
    //instancia o jogador e inicia o jogo
    sendstatus(playername.value);
    //Informaçoes iniciais do audio de fundo
    document.getElementById('background-music').play();
    document.getElementById("background-music").volume = 0.5;

    
}
//quando é um novo jogador
function playerinit(){
    //inicia dados de usuario
    gamedates.setnameuser(playername.value);
    gamedates.setdescuser(playertag.value);
    gamedates.setTimeCred(60);
    //mostra dados de usuario
    playershowname.innerHTML = gamedates.getnameuser();
    playershowtag.innerHTML = gamedates.getdescuser();
    showtimer.innerHTML = gamedates.getTimeCred();
    //envia dados de usuario para o servidor
    sendregister();
}
//imprime o ranking de pontuações
function showScores(data){
    scoresvalues.forEach((item,index)=>{
        item.innerHTML = `<div>${(index+1)} - ${data[index].name}</div><div>${data[index].score}</div>`;
    })
}
//inicia o nivel de jogo
function initlevel(){
    playershowdate.innerHTML = `NIVEL:${gamedates.getleveluser()} PONTOS:${gamedates.getscoreuser()}`;
    gamedates.setOper(sortOP(gamedates.getleveluser(),gamedates.getsublevel()));
    operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
    emoji.src = emojis.thinking;
    timecred = gamedates.getTimeCred() + 30;//a cada nivel ganha 30 segundos
    timecr = +new Date(); 
    stoped = false;
    sendscores();
}
//quando o jogador acerta o valor vai para o proximo subnivel
function nextlevel(){
    emoji.src = emojis.sunglasses;//muda a emoção
    applause.style.display = 'block';//mostra aplausos
    winLevel.play();//toca sons de comemoração
    stoped = true;//pausa o timer
    //comemoração de 5 segundos antes de ir para o proximo nivel 
    let interval = setInterval(function(){
        gamedates.setTimeCred(timeSeg);
        if (gamedates.getsublevel()<4){//se não estiver no ultimo subnivel
            gamedates.incasublevel(1);//aumenta um subnivel
            gamedates.incscoreuser(10);//aumenta 10 pontos
            initlevel();//inicia proximo subnivel
        }else{//se estiver no ultimo subnivel
            gamedates.setsublevel(0);//primeiro subnivel do proximo nivel
            gamedates.incscoreuser(20);//aumenta 20 pontos
            gamedates.incleveluser(1);//aumenta um nivel
            sendregister();//envia dados para registro no servidor
        }
        stoped = false;
        restepositions();//restaura posições das peças
        applause.style.display = 'none';//apaga animação de aplausos
        emoji.src = emojis.thinking;//muda emoção
        clearTimeout(interval);
    },5000);
}
//envia requicisão do ranking de pontuações
function sendscores(){
    //monta url da requicisão
    const fullurl = url + 'scores';
    console.log("request:" + fullurl);
    //faz requicisão get
    fetch(fullurl).then(
        function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }
        response.json().then(function(data) {
            console.log(data);
            console.log('Records recebidos');
            //imprime dados recebidos
            showScores(data);
        });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    });  
}
//envia requisição para salvar os dados no servidor
function sendregister(){
    //monta url da requicisão
    const fullurl = url + 'register';
    console.log(fullurl);
    //faz requicisão post
    fetch(fullurl,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(gamedates.getUser())//envia dados do usuario no corpo
    }).then(
        function(response) {
            console.log(response);
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }
        response.json().then(function(data) {
            console.log('dados recebidos agora');
            console.log(data);
            //inicial nivel que o jogador estava
            initlevel();
            console.log('dados recebidos');
        });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    }); 
}
//envia requisição dos dados salvos do jogador
function sendstatus(name){
    //monta url da requicisão
    const fullurl = url + 'status?name=' + name;
    //faz requicisão get
    fetch(fullurl).then(
        function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }
        response.json().then(function(data) {
            console.log(data);
            if (data){//se os dados forem encontrados e resgatados
                //seta informações resgatadas do usuario
                gamedates.setnameuser(data.name);
                //o lema antigo só sera usado se não for digitado lema novo
                if (!gamedates.getdescuser()) gamedates.setdescuser(data.description);
                gamedates.setleveluser(data.level);
                gamedates.setscoreuser(data.score);
                gamedates.setTimeCred(data.timecred);
                playershowname.innerHTML = gamedates.getnameuser();
                playershowtag.innerHTML = gamedates.getdescuser();
            }else{//se não houve dados resgatados
                playerinit();//inicia novo jogador
            }
            initlevel();//inicia nivel
            console.log('dados recebidos');
        });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    });  
}
//funções executados ao abrir a pagina
sendscores();
updateTime();
timectrl = window.setInterval(updateTime, 1000); 
//eventos
bStart.addEventListener('click',stargame);

//cria os blocos arrastaveis
for(let i=0;i<9;i++){
    $("#supermain").append(`<div class="moveable1" value=1 inside=0></div> `)
    $("#supermain").append(`<div class="moveable10" value=10 inside=0></div> `)
    $("#supermain").append(`<div class="moveable100" value=100 inside=0></div> `)
    $("#supermain").append(`<div class="moveable1000" value=1000 inside=0></div> `)
}
$(".moveable1").draggable({
    containment : "#supermain"
});
$(".moveable10").draggable({
    containment : "#supermain"
});
$(".moveable100").draggable({
    containment : "#supermain"
});
$(".moveable1000").draggable({
    containment : "#supermain"
});
//Botão de reset
$('#reset-btn').on('click',function(){
    restepositions();
})
//função para resetar a posição das peças
function restepositions(){
    $('.moveable1').remove();
    $('.moveable10').remove();
    $('.moveable100').remove();
    $('.moveable1000').remove();
    if(!stoped) gamedates.setaccValues(0);
    for(let i=0;i<9;i++){
        $("#supermain").append(`<div class="moveable1" value=1 inside=0></div> `)
        $("#supermain").append(`<div class="moveable10" value=10 inside=0></div> `)
        $("#supermain").append(`<div class="moveable100" value=100 inside=0></div> `)
        $("#supermain").append(`<div class="moveable1000" value=1000 inside=0></div> `)
    }
    $(".moveable1").draggable({
        containment : "#supermain"
    });
    $(".moveable10").draggable({
        containment : "#supermain"
    });
    $(".moveable100").draggable({
        containment : "#supermain"
    });
    $(".moveable1000").draggable({
        containment : "#supermain"
    });
    operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
}
let diftemp1, diftemp2;
//cria a área que recebe os objetos arrastaveis
$( "#alvo1" ).droppable({
    drop:function(event,ui){
        console.log("drop");
        if (!stoped){
            diftemp1 = gamedates.getaccValues()-gamedates.getOperResult();
            if (diftemp1 < 0) diftemp1 *= -1;
            gamedates.incaccValues(Number(ui.draggable.attr("value")));
            console.log(gamedates.getaccValues());
            operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
            if (gamedates.getaccValues() == gamedates.getOperResult()){
                nextlevel();
            }else{
                diftemp2 = gamedates.getaccValues()-gamedates.getOperResult();
                if (diftemp2 < 0) diftemp2 *= -1;
                if (diftemp2 < diftemp1) emoji.src = emojis.smiley;
                else emoji.src = emojis.sadness;
            }
        }
        drop.play();
        ui.draggable.attr("inside",1)
    },
    over: function (event, ui) {
        if(Number(ui.draggable.attr("inside"))){
            if (!stoped){
                diftemp1 = gamedates.getaccValues()-gamedates.getOperResult();
                if (diftemp1 < 0) diftemp1 *= -1;
                gamedates.incaccValues((-1)*Number(ui.draggable.attr("value")));
                console.log(gamedates.getaccValues());
                if (gamedates.getaccValues() == gamedates.getOperResult()){
                    nextlevel();
                }else{
                    diftemp2 = gamedates.getaccValues()-gamedates.getOperResult();
                    if (diftemp2 < 0) diftemp2 *= -1;
                    if (diftemp2 < diftemp1) emoji.src = emojis.smiley;
                    else emoji.src = emojis.sadness;
                }
            }
            drop.play();
        }
    },
    out: function (event, ui) {
        ui.draggable.attr("inside",0)
        operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
    }
});
//função de sorteio
function sortOP(level, sublevel=0){
    //variavel internas
    let op = {
        "operation" : "operação",
        "result" : 0
    }
    let temp1 = 0;
    let temp2 = 0;
    let tempop = 0;
    let min = 0;
    let max = 9999;
    //sub-funções que sorteiam os termos de cada tipo de operação
    //termos da soma
    function sum(max, min){
        const temp1 = Math.floor(Math.random()*(max-min))+(min);
        max -= temp1;//a soma dos termos não pode ser maior que o limite
        const temp2 = Math.floor(Math.random()*(max-min))+(min);
        return [temp1, temp2];
    }
    //termos da subtração
    function subtraction(max, min){
        const temp1 = Math.floor(Math.random()*(max-min))+(min);
        max = temp1;//o segundo termo não pode ser maior que o primeiro
        const temp2 = Math.floor(Math.random()*(max-min))+(min);
        return [temp1, temp2];
    }
    //termos da multiplicação
    function multiply(max, min){
        if (max > 10) max = max/10;//a multiplicação usa termos mais baixos que a soma
        if (min == 0) min = 1;//na multiplicação nenhum termo pode ser zero
        const temp1 = Math.floor(Math.random()*(max-min))+(min);
        const temp2 = Math.floor(Math.random()*(max-min))+(min);
        return [temp1, temp2];
    }
    //termos da divisão
    function division(max,min){
        let maxdiv = 20;//o divisor não pode ser maior que 20
        if (max < 200) maxdiv = 10;//para numeros baixos não pode ser maior que 10
        min = 1;//não pode ter divisão por zero
        const temp2 = Math.floor(Math.random()*(maxdiv-min))+(min);
        const temp1 = temp2 * (Math.floor(Math.random()*(maxdiv-min))+(min));
        return [temp1, temp2];
    }
    //verifca o nivel do jogador e escolhe a operação de acordo
    switch (level) {
        case 0://somente um numero - sublevel condiz com numero de digitos dos numeros
            if (sublevel >= 4) {
                min = Math.pow(10,sublevel-1);
                max = Math.pow(10,sublevel);
            }else{
                min = Math.pow(10,sublevel);
                max = Math.pow(10,sublevel+1);
            }
            temp1 = Math.floor(Math.random()*(max-min))+(min);
            op.operation = `${temp1} =  `;
            op.result = temp1;
            break;
        case 1://somas - sublevel condiz com numero maximo de digitos dos numeros
            if (sublevel >= 3) {max = Math.pow(10,sublevel-1);
            }else if(sublevel >= 1){max = Math.pow(10,sublevel);
            }else{max = Math.pow(10,1);}
            [temp1,temp2] = sum(max,min);
            op.operation = `${temp1} + ${temp2} =  `;
            op.result = temp1+temp2;
            break;
        case 2://somas e subtrações de numeros de 0 a 1000 - sublevel não é mais necessario
            max = 1000;
            tempop = Math.round(Math.random());//0 = subtração, 1 = adição
            if(tempop == 0){//caso seja uma subtração
                [temp1,temp2] = subtraction(max,min);
                op.operation = `${temp1} - ${temp2} =  `;
                op.result = temp1-temp2;
            }else{//caso seja adição
                [temp1,temp2] = sum(max,min);
                op.operation = `${temp1} + ${temp2} =  `;
                op.result = temp1+temp2;
            }
            break;
        case 3://multiplicações conforme sublevel (maximo até 100)
            if (sublevel<3) max = 10;
            else max = 100;
            [temp1,temp2] = multiply(max,min);
            op.operation = `${temp1} x ${temp2} =  `;
            op.result = temp1*temp2;
            break;
        case 4://soma, subtração e multiplicação, conforme sublevel (maximo até 100)
            if (sublevel<3) max = 10;
            else max = 100;
            tempop = Math.round(Math.random()*2);//0 = subtração, 1 = adição, 2 = multipicação
            if (tempop == 1){//caso seja adição
                [temp1,temp2] = sum(max,min);
                op.operation = `${temp1} + ${temp2} =  `;
                op.result = temp1+temp2;
            }else if(tempop == 0){//caso seja subtração
                [temp1,temp2] = subtraction(max,min);
                op.operation = `${temp1} - ${temp2} =  `;
                op.result = temp1-temp2;
            }else if(tempop == 2){//caso seja multiplicação
                [temp1,temp2] = multiply(max,min);
                op.operation = `${temp1} x ${temp2} =  `;
                op.result = temp1*temp2;
            }
            break;
        case 5://divisão conforme o conforme sublevel
            min = 1;
            max = (sublevel+1)*10;
            [temp1,temp2] = division(max,min);
            op.operation = `${temp1} ÷ ${temp2} =  `;
            op.result = temp1/temp2;
            break
        default://mistura todos os casos possiveis - sublevel não é mais necessario
            tempop = Math.round(Math.random()*3);//0 = subtração, 1 = adição, 2 = multipicação, 3 = divisão
            if (tempop == 1){//caso seja adição
                [temp1,temp2] = sum(max,min);
                op.operation = `${temp1} + ${temp2} =  `;
                op.result = temp1+temp2;
            }else if(tempop == 0){//caso seja subtração
                [temp1,temp2] = subtraction(max,min);
                op.operation = `${temp1} - ${temp2} =  `;
                op.result = temp1-temp2;
            }else if(tempop == 2){//caso seja multiplicação
                max = 500;
                [temp1,temp2] = multiply(max,min);
                op.operation = `${temp1} x ${temp2} =  `;
                op.result = temp1*temp2;
            }else if(tempop == 3){//caso seja divisão
                [temp1,temp2] = division(max,min);
                op.operation = `${temp1} ÷ ${temp2} =  `;
                op.result = temp1/temp2;
            }
            break;
    }
    //retorna um objeto com a operação montada em uma string e o resultado em um inteiro
    return op;
}
// Modal
const modal = document.getElementById("modal");
const btn = document.getElementById("bTutorial");
const span = document.getElementsByClassName("close")[0];
const video = document.getElementById("videoTutorial");
const modalheader = document.getElementById('modal-header');
//mostra modal os clicar no botão tutorial
btn.onclick = function() {
  modal.style.display = "block";
}
//fecha ao clicar no simbolo fechar
span.onclick = function() {
    closemodal();
}
//fecha o modal ao clicar fora
window.onclick = function(event) {
  if (event.target == modal)
    closemodal();
}
//fecha o modal
function closemodal(){
    modal.style.display = "none";//torna invisivel
    video.pause();//pausa video
    video.currentTime = 0;//reseta video
}
//inclui evento click no cabeçalho do modal com a função fechar modal
modalheader.addEventListener('click',closemodal);

//controle de volume
//mudo
$('#mute-audio').on('click',function(){
    document.getElementById("background-music").volume = 0;
    drop.volume = 0;
    winLevel.volume = 0;
    document.getElementById('defeat-music').volume=0;
});
//abaixar volume
$('#down-audio').on('click',function(){
    if(document.getElementById("background-music").volume>=0.1){
        document.getElementById("background-music").volume -= 0.1;
    }
    if(drop.volume>=0.1) drop.volume -= 0.1;
    if(winLevel.volume>=0.1) winLevel.volume -= 0.1;
    if(document.getElementById('defeat-music').volume>=0.1){
        document.getElementById('defeat-music').volume -= 0.1;
    }
});
//aumentar volume
$('#up-audio').on('click',function(){
    if(document.getElementById("background-music").volume<=0.9){
        document.getElementById("background-music").volume += 0.1;
    }
    if(drop.volume<=0.9) drop.volume += 0.1;
    if(winLevel.volume<=0.9) winLevel.volume += 0.1;
    if(document.getElementById('defeat-music').volume<=0.9){
        document.getElementById('defeat-music').volume += 0.1;
    }
});
//volume maximo
$('#max-audio').on('click',function(){
    document.getElementById("background-music").volume = 1;
    drop.volume = 1;
    winLevel.volume = 1;
    document.getElementById('defeat-music').volume=1;
});
//botao de voltar - reseta todas variaveis
$('#btn-back-click').on('click',function(){
    initPlay.style.display='flex';
    gameplay.style.display='none';
    document.getElementById("background-music").volume = 0;
    defeat.style.display = 'none';
    gamedates.gamereset();
    timecred = 0;
    timeSeg = 0;
    timecr = 0;
    stoped = true;
    restepositions();
})