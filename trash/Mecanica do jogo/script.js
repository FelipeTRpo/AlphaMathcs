let bodydoc = document.querySelector('body');
let alvo = document.getElementById('alvo');
bodydoc.setAttribute('ondrop',"drop(event)");
bodydoc.setAttribute('ondragover',"allowDrop(event)");
for(let i=0;i<9;i++){
    mv1 = document.createElement('div');
    mv1.classList.add("moveable1");
    mv1.setAttribute('value', '1');
    mv1.setAttribute('inside', '0');
    mv1.setAttribute('draggable', 'true');
    mv1.addEventListener('dragstart',function(){drag(event);});
    mv10 = document.createElement('div');
    mv10.classList.add("moveable10");
    mv10.setAttribute('value', 1);
    mv10.setAttribute('inside', 0);
    mv10.draggable = true;
    mv10.addEventListener('dragstart',function(){drag(event);});
    mv100 = document.createElement('div');
    mv100.classList.add("moveable100");
    mv100.setAttribute('value', 1);
    mv100.setAttribute('inside', 0);
    mv100.draggable = true;
    mv100.addEventListener('dragstart',function(){drag(event);});
    mv1000 = document.createElement('div');
    mv1000.classList.add("moveable1000");
    mv1000.setAttribute('value', 1);
    mv1000.setAttribute('inside', 0);
    mv1000.draggable = true;
    mv1000.addEventListener('dragstart',function(){drag(event);});
    bodydoc.append(mv1);
    bodydoc.append(mv10);
    bodydoc.append(mv100);
    bodydoc.append(mv1000);
}
alvo.setAttribute('ondrop',"drop(event)");
alvo.setAttribute('ondragover',"allowDrop(event)");
/*
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
*/
let score = 0
function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

//alvo.addEventListener('drop',function(){drop(event);});
//alvo.addEventListener('dragover',function(){allowDrop(event);});



/*$( "#alvo1" ).droppable({
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
});*/
