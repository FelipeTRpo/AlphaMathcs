const url = 'http://' + location.host.split(':')[0] + ':3000/';//'http://localhost:3000/';
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
const drop = new Audio("./assets/songs/drop.wav");
const winLevel = new Audio("./assets/songs/winLevel.mp3");
//classe com os dados dinamicos do jogo
class gamedb{
    constructor() {
        this.accValues = 0;
        this.sublevel = 0;
        this.user = {
            "name": "",
            "description": "",
            "score": 0,
            "level": 0
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
}
let gamedates = new gamedb;

//inicia o jogo ao clicar no botão
function stargame(){
    if (playername.value == ""){
        alert("Digite seu nome de jogador");
        return false;
    }
    //muda a tela
    initPlay.style.display='none';
    gameplay.style.display='flex';
    //instancia o jogador e inicia o jogo
    sendstatus(playername.value);
}
//quando é um novo jogador
function playerinit(){
    gamedates.setnameuser(playername.value);
    gamedates.setdescuser(playertag.value);
    playershowname.innerHTML = gamedates.getnameuser();
    playershowtag.innerHTML = gamedates.getdescuser();
    sendregister();
}

//imprime o ranking de pontuações
function showScores(data){
    scoresvalues.forEach((item,index)=>{
        item.innerHTML = `<div>${(index+1)} - ${data[index].name}</div><div>${data[index].score}</div>`;
    })
}
//envia requicisão do ranking de pontuações
function sendscores(){
    const fullurl = url + 'scores';
    console.log("request:" + fullurl);
    fetch(fullurl).then(
        function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }
        response.json().then(function(data) {
            console.log(data);
            console.log('Records recebidos');
            showScores(data);
        });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    });  
}
//envia requicisão para salvar os dados no servidor
function sendregister(){
    const fullurl = url + 'register';
    console.log(fullurl);
    fetch(fullurl,{
        method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(gamedates.getUser())
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
            initlevel();
            console.log('dados recebidos');
        });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    }); 
}
//inicia o nivel de jogo
function initlevel(){
    playershowdate.innerHTML = `Nivel:${gamedates.getleveluser()} Pontos:${gamedates.getscoreuser()}`;
    gamedates.setOper(sortOP(gamedates.getleveluser(),gamedates.getsublevel()));
    operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
    sendscores();
}
//quando o jogador acerta o valor vai para o proximo subnivel
function nextlevel(){
    restepositions();
    if (gamedates.getsublevel()<4){
        gamedates.incasublevel(1);
        gamedates.incscoreuser(10);
        initlevel();
    }else{
        gamedates.setsublevel(0);
        gamedates.incscoreuser(20);
        gamedates.incleveluser(1);
        sendregister();
    }
}
//envia requicisão dos dados salvos do jogador
function sendstatus(name){
    const fullurl = url + 'status?name=' + name;
    fetch(fullurl).then(
        function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }
        response.json().then(function(data) {
            console.log(data);
            if (data){
                gamedates.setnameuser(data.name);
                if (!gamedates.getdescuser()) gamedates.setdescuser(data.description);
                gamedates.setleveluser(data.level);
                gamedates.setscoreuser(data.score);
                playershowname.innerHTML = gamedates.getnameuser();
                playershowtag.innerHTML = gamedates.getdescuser();
            }else{
                playerinit();
            }
            initlevel();
            console.log('dados recebidos');
        });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    });  
}
//funções executados ao abrir a pagina
sendscores();
//eventos
bStart.addEventListener('click',stargame);

//cria os blocos arrastaveis
for(let i=0;i<9;i++){
    $("#maingame").append(`<div class="moveable1" value=1 inside=0></div> `)
    $("#maingame").append(`<div class="moveable10" value=10 inside=0></div> `)
    $("#maingame").append(`<div class="moveable100" value=100 inside=0></div> `)
    $("#maingame").append(`<div class="moveable1000" value=1000 inside=0></div> `)
}
$(".moveable1").draggable({
    containment : "#maingame"
});
$(".moveable10").draggable({
    containment : "#maingame"
});
$(".moveable100").draggable({
    containment : "#maingame"
});
$(".moveable1000").draggable({
    containment : "#maingame"
});
//Botão de reset
$('#reset-btn').on('click',function(){
    restepositions();
})
//função para rsetar a posição das peças
function restepositions(){
    $('.moveable1').remove();
    $('.moveable10').remove();
    $('.moveable100').remove();
    $('.moveable1000').remove();
    gamedates.setaccValues(0);
    for(let i=0;i<9;i++){
        $("#maingame").append(`<div class="moveable1" value=1 inside=0></div> `)
        $("#maingame").append(`<div class="moveable10" value=10 inside=0></div> `)
        $("#maingame").append(`<div class="moveable100" value=100 inside=0></div> `)
        $("#maingame").append(`<div class="moveable1000" value=1000 inside=0></div> `)
    }
    $(".moveable1").draggable({
        containment : "#maingame"
    });
    $(".moveable10").draggable({
        containment : "#maingame"
    });
    $(".moveable100").draggable({
        containment : "#maingame"
    });
    $(".moveable1000").draggable({
        containment : "#maingame"
    });
    operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
}
//cria a área que recebe os objetos arrastaveis
$( "#alvo1" ).droppable({
    drop:function(event,ui){
        console.log("drop");
        gamedates.incaccValues(Number(ui.draggable.attr("value")));
        console.log(gamedates.getaccValues());
        operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
        drop.play();
        if (gamedates.getaccValues() == gamedates.getOperResult()){

            nextlevel();
            winLevel.play();
        }
        ui.draggable.attr("inside",1)
    },
    over: function (event, ui) {
        if(Number(ui.draggable.attr("inside"))){
            gamedates.incaccValues((-1)*Number(ui.draggable.attr("value")));
            console.log(gamedates.getaccValues());
            drop.play();
            if (gamedates.getaccValues() == gamedates.getOperResult()){
                nextlevel();
                winLevel.play();
            }
        }
    },
    out: function (event, ui) {
        ui.draggable.attr("inside",0)
        operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
    }
});

//função de sorteio
function sortOP(level, sublevel=0){
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
            op.operation = `${temp1} / ${temp2} =  `;
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
                op.operation = `${temp1} / ${temp2} =  `;
                op.result = temp1/temp2;
            }
            break;
    }
    //retorna um objeto com a operação montada em um string e o resultado em um inteiro
    return op;
}
// Modal

const modal = document.getElementById("modal");
const btn = document.getElementById("bTutorial");
const span = document.getElementsByClassName("close")[0];
const video = document.getElementById("videoTutorial");
const modalheader = document.getElementById('modal-header');

btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
    closemodal();
}
window.onclick = function(event) {
  if (event.target == modal)
    closemodal();
}
function closemodal(){
    modal.style.display = "none";
    video.pause();
    video.currentTime = 0;
}
modalheader.addEventListener('click',closemodal);