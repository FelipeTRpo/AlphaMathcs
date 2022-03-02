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
function updateTime()
{
    if (stoped) return;
    timeSeg = timecred - Math.floor((+new Date() - timecr) / 1000);
    showtimer.innerHTML = Math.floor(timeSeg/60) +" : "+ timeSeg%60;//timeSeg.toString() + " SEG";
    if(timeSeg < 15){
        showtimer.style.color = 'red';
    }else{
        showtimer.style.color = 'var(--green-dark)';
    }
    if (timeSeg==0) {
        stoped = true;
        emoji.src = emojis.crying;
    }
    return;
}
function stargame(){
    if (playername.value == ""){
        alert("DIGITE SEU NOME DE JOGADOR");
        return false;
    }
    //muda a tela
    initPlay.style.display='none';
    gameplay.style.display='flex';
    //instancia o jogador e inicia o jogo
    sendstatus(playername.value);
    //play automatico na musica de fundo
    document.getElementById('background-music').play()
}
//quando é um novo jogador
function playerinit(){
    gamedates.setnameuser(playername.value);
    gamedates.setdescuser(playertag.value);
    gamedates.setTimeCred(60);
    playershowname.innerHTML = gamedates.getnameuser();
    playershowtag.innerHTML = gamedates.getdescuser();
    showtimer.innerHTML = gamedates.getTimeCred();
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
//envia requisição para salvar os dados no servidor
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
    emoji.src = emojis.sunglasses;
    applause.style.display = 'block';
    winLevel.play();
    stoped = true;
    let interval = setInterval(function(){
        gamedates.setTimeCred(timeSeg);
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
        stoped = false;
        restepositions();
        applause.style.display = 'none';
        emoji.src = emojis.thinking;
        clearTimeout(interval);
    },5000);//comemoração de 5 segundos antes de ir para o proximo nivel 
}
//envia requisição dos dados salvos do jogador
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
                gamedates.setTimeCred(data.timecred);
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

let moveabl1 = document.querySelectorAll('.moveable1');
let moveabl10 = document.querySelectorAll('.moveable10');
let moveabl100 = document.querySelectorAll('.moveable100');
let moveabl1000 = document.querySelectorAll('.moveable1000');
let alvo = document.getElementById('alvo1');

function movall1(){
    console.log('testedblclick')
    diftemp1 = gamedates.getaccValues()-gamedates.getOperResult();
    if (diftemp1 < 0) diftemp1 *= -1;
    for (let i=0 ; i<moveabl1.length; i++){
        let origin = moveabl1[i].parentElement;
        console.log(origin.id);
        if (origin.id != 'alvo1'){
            alvo.appendChild(moveabl1[i]);
            gamedates.incaccValues(1);
            operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
            console.log(gamedates.getaccValues());
        }
    }
    if (gamedates.getaccValues() == gamedates.getOperResult()){
        nextlevel();
    }else{
        diftemp2 = gamedates.getaccValues()-gamedates.getOperResult();
        if (diftemp2 < 0) diftemp2 *= -1;
        if (diftemp2 < diftemp1) emoji.src = emojis.smiley;
        else emoji.src = emojis.sadness;
    }
}
function movall10(){
    console.log('testedblclick')
    diftemp1 = gamedates.getaccValues()-gamedates.getOperResult();
    if (diftemp1 < 0) diftemp1 *= -1;
    for (let i=0 ; i<moveabl10.length; i++){
        let origin = moveabl10[i].parentElement;
        console.log(origin.id);
        if (origin.id != 'alvo1'){
            alvo.appendChild(moveabl10[i]);
            gamedates.incaccValues(10);
            operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
            console.log(gamedates.getaccValues());
        }
    }
    if (gamedates.getaccValues() == gamedates.getOperResult()){
        nextlevel();
    }else{
        diftemp2 = gamedates.getaccValues()-gamedates.getOperResult();
        if (diftemp2 < 0) diftemp2 *= -1;
        if (diftemp2 < diftemp1) emoji.src = emojis.smiley;
        else emoji.src = emojis.sadness;
    }
}
function movall100(){
    console.log('testedblclick')
    diftemp1 = gamedates.getaccValues()-gamedates.getOperResult();
    if (diftemp1 < 0) diftemp1 *= -1;
    for (let i=0 ; i<moveabl100.length; i++){
        let origin = moveabl100[i].parentElement;
        console.log(origin.id);
        if (origin.id != 'alvo1'){
            alvo.appendChild(moveabl100[i]);
            gamedates.incaccValues(100);
            operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
            console.log(gamedates.getaccValues());
        }
    }
    if (gamedates.getaccValues() == gamedates.getOperResult()){
        nextlevel();
    }else{
        diftemp2 = gamedates.getaccValues()-gamedates.getOperResult();
        if (diftemp2 < 0) diftemp2 *= -1;
        if (diftemp2 < diftemp1) emoji.src = emojis.smiley;
        else emoji.src = emojis.sadness;
    }
}
function movall1000(){
    console.log('testedblclick')
    diftemp1 = gamedates.getaccValues()-gamedates.getOperResult();
    if (diftemp1 < 0) diftemp1 *= -1;
    for (let i=0 ; i<moveabl1000.length; i++){
        let origin = moveabl1000[i].parentElement;
        console.log(origin.id);
        if (origin.id != 'alvo1'){
            alvo.appendChild(moveabl1000[i]);
            gamedates.incaccValues(1000);
            operationprint.innerHTML = gamedates.getOperOperation() + gamedates.getaccValues();
            console.log(gamedates.getaccValues());
        }
    }
    if (gamedates.getaccValues() == gamedates.getOperResult()){
        nextlevel();
    }else{
        diftemp2 = gamedates.getaccValues()-gamedates.getOperResult();
        if (diftemp2 < 0) diftemp2 *= -1;
        if (diftemp2 < diftemp1) emoji.src = emojis.smiley;
        else emoji.src = emojis.sadness;
    }
}

for (let i=0 ; i<moveabl1.length; i++){
    moveabl1[i].addEventListener('dblclick',movall1);
    moveabl10[i].addEventListener('dblclick',movall10);
    moveabl100[i].addEventListener('dblclick',movall100);
    moveabl1000[i].addEventListener('dblclick',movall1000);
}