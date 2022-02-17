//constantes
const NUMBERRANKING = 10;//numero de usuarios no ranking
//função que verifica se o objeto de usuario tem formato valido
function validDate(data){
    if ((typeof data.name == 'string') &&
    (typeof data.description == 'string') &&
    (data.score != '') &&
    (data.level != '')){
        return true;
    }
    return false;
}
//inclue dados do usuario no cadastro
function includes(data,playes,scores){
    data.level = parseInt(data.level);
    data.score = parseInt(data.score);
    let index;
    //verifica se o usuario já está cadastrado
    index = playes.findIndex(function(item){
        return item.name == data.name;
    });
    //atualiza os dados caso o usuario já esteja no cadastro
    if (index>=0){
        playes[index].description = data.description;
        if (data.score > playes[index].score)
            playes[index].score = data.score;
        if (data.level > playes[index].level)
            playes[index].level = data.level;
    }else{
        //adciona usuario caso não esteja cadastrado
        playes.push(data);
    }
    //verifica se o usuario já está no ranking
    index = scores.findIndex(function(item){
        return item.name == data.name;
    });
    if (index<0){
        scores.push({"name": data.name, "score": data.score});
    }else{
        scores[index].score = data.score;
    }
    scores.sort((a, b) => b.score - a.score);
    if (scores.length>NUMBERRANKING){
        scores.pop();
    }
    return true;
}
//verifica os dados do usuario
function status(name, playres){
    let index;
    //verifica se o usuario já está cadastrado
    index = playres.findIndex(function(item){
        return item.name == name;
    });
    //retorna os dados do usuario caso esteja no cadastro
    if (index>=0){
        return playres[index];
    }
    return false;
}
//exportação das funções
module.exports = {validDate,includes, status};