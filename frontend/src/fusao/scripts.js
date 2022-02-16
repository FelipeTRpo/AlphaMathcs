const url = 'http://localhost:3000/';
let bStart = document.getElementById('bStart');
let initPlay = document.getElementById('initPlay');
let playername = document.getElementById('playername');
let playertag = document.getElementById('playertag');
let gameplay = document.getElementById('gameplay');
let playershowname = document.getElementById('playershowname');
let playershowtag = document.getElementById('playershowtag');
let playershowdate = document.getElementById('playershowdate');
let scoresvalues = document.querySelectorAll('.points');
let accValues = 0;
let user = {
    "name": "",
    "description": "",
    "score": 0,
    "level": 0
}
function stargame(){
    initPlay.style.display='none';
    gameplay.style.display='flex';
    user.name = playername.value;
    user.description = playertag.value;
    playershowname.innerHTML = user.name;
    playershowtag.innerHTML = user.description;
    playershowdate.innerHTML = `Nivel:${user.level} Pontos:${user.score}`;
}

bStart.addEventListener('click',stargame);

function showScores(data){
    scoresvalues.forEach((item,index)=>{
        item.innerHTML = `${(index+1)}.${data[index].name}       ${data[index].score}`;
    })
}

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
            //recebers.innerHTML = data;
            console.log(data);
            console.log('Records recebidos');
            showScores(data);
        });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    });  
}

sendscores();

for(let i=0;i<9;i++){
    $("#maingame").append(`<div class="moveable1" value=1 inside=0>1</div> `)
    $("#maingame").append(`<div class="moveable10" value=10 inside=0>10</div> `)
    $("#maingame").append(`<div class="moveable100" value=100 inside=0>100</div> `)
    $("#maingame").append(`<div class="moveable1000" value=1000 inside=0>1000</div> `)
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

$( "#alvo1" ).droppable({
    drop:function(event,ui){
        console.log("drop");
        accValues += Number(ui.draggable.attr("value"));
        console.log(accValues);
        //$("#score").html(score);
        ui.draggable.attr("inside",1)
    },
    over: function (event, ui) {
        if(Number(ui.draggable.attr("inside"))){
            accValues -= Number(ui.draggable.attr("value"));
            console.log(accValues);
            //$("#score").html(score);
        }
    },
    out: function (event, ui) {
        ui.draggable.attr("inside",0)
    }
});