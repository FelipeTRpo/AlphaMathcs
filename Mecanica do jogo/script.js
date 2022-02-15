for(let i=0;i<9;i++){
    $("body").append(`<div class="moveable1" value=1 inside=0>1</div> `)
    $("body").append(`<div class="moveable10" value=10 inside=0>10</div> `)
    $("body").append(`<div class="moveable100" value=100 inside=0>100</div> `)
    $("body").append(`<div class="moveable1000" value=1000 inside=0>1000</div> `)
}
$(".moveable1").draggable({
    containment : "body"
});
$(".moveable10").draggable({
    containment : "body"
});
$(".moveable100").draggable({
    containment : "body"
});
$(".moveable1000").draggable({
    containment : "body"
});

let score = 0
$( "#alvo1" ).droppable({
    drop:function(event,ui){
        console.log("drop");
        score += Number(ui.draggable.attr("value"));
        $("#score").html(score);
        ui.draggable.attr("inside",1)
    },
    over: function (event, ui) {
        if(Number(ui.draggable.attr("inside"))){
            score -= Number(ui.draggable.attr("value"));
            $("#score").html(score);
        }
    },
    out: function (event, ui) {
        ui.draggable.attr("inside",0)
    }
});
