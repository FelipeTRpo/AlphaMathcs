//constantes
const NUMBERRANKING = 10;//numero de usuarios no ranking
//função que verifica se o objeto de usuario tem formato valido
function validDate(data){
    if ((typeof data.name == 'string') &&
    (typeof data.description == 'string') &&
    (typeof data.score == 'number') &&
    (typeof data.level == 'number')){
        return true;
    }
    return false;
}
//inclue dados do usuario no cadastro
function includes(data,playes,scores){
    let index;
    let resp = false;
    //verifica se o usuario já está cadastrado
    index = playes.findIndex(function(){
        this.name == data.name;
    });
    //atualiza os dados caso o usuario já esteja no cadastro
    if (index>=0){
        playes[index].description = data.description;
        if (playes.score > playes[index].score)
            playes[index].score = playes.score;
        if (playes.level > playes[index].level)
            playes[index].level = playes.level;
    }else{
        //adciona usuario caso não esteja cadastrado
        playes.push(data);
    }
    //verifica se o usuario já está no ranking
    index = scores.findIndex(function(){
        this.name == data.name;
    });
    //atualiza os dados caso o usuario já esteja no ranking
    if (index>=0){
        if (data.score > scores[index].score)
            playes[index].score = playes.score;
    }else{
        //caso o usuario não esteja no ranking, verifica se superou o ultimo do ranking
        if(data.score > scores[NUMBERRANKING-1].score){
            scores.push({"name": data.name, "score": data.score});
            scores.sort((a,b) = a-b);
            scores.pop();
            resp = true;
        }
    }
    return resp;
}
//verifica os dados do usuario
function status(name, playres){
    let index;
    //verifica se o usuario já está cadastrado
    index = playes.findIndex(function(){
        this.name == name;
    });
    //retorna os dados do usuario caso esteja no cadastro
    if (index>=0){
        return playres[index];
    }
    return false;
}
//exportação das funções
module.exports = {validDate,includes, status};