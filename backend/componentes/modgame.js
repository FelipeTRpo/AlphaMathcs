//constantes
const NUMBERRANKING = 10;//numero de usuarios no ranking
//função que verifica se o objeto de usuario tem formato valido
function validDate(data){
    if ((typeof data.name == 'string') &&
    (typeof data.description == 'string') &&
    (typeof data.score == 'string') &&
    (typeof data.level == 'string')){
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
    //atualiza os dados caso o usuario já esteja no ranking
    if (index>=0){
        if (data.score > scores[index].score)
            playes[index].score = playes.score;
    }else{
        //caso o usuario não esteja no ranking, verifica se superou o ultimo do ranking
        if(data.score > scores[NUMBERRANKING-1].score){
            scores.push({"name": data.name, "score": data.score});
            scores.sort();
            scores.pop();
            console.log(data);
        }
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