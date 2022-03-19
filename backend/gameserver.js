//modulos externos (padrão node modules)
const fs = require('fs');
const express = require('express');
const cors = require('cors');
//modulo com funções proprias da aplicação
const modGame = require('./componentes/modgame.js');
//app servidor de APIs RESTful
const app = express();
//porta de comunicação das APIs
const port = 3000;
//arquivos de dados salvos
const jsonplayes = './data/players.json';
const jsonscores = './data/scores.json';
const dbplayes = require(jsonplayes);
const dbscores = require(jsonscores);

//configura o servidor
app.use(express.json());
app.use(cors());

//registar dados do usuario a cada passagem de nivel
app.post("/register", (req, res) => {
    console.log("register:");
    console.log(req.body);
    //verifica se dados de usuario são validos e, se for o caso, executa registro
    if (modGame.validDate(req.body)){
        //inclui os dados na base de dados em memoria e salva o retorno (true/false)
        let resp = modGame.includes(req.body,dbplayes,dbscores)
        //grava os dados em disco
        fs.writeFile(jsonplayes, JSON.stringify(dbplayes), 'utf8', err=>{if(err)console.log(err)});
        fs.writeFile(jsonscores, JSON.stringify(dbscores), 'utf8', err=>{if(err)console.log(err)});
        //envia o retorno da inclusão
        res.send(resp);
        return true;
    }
    //caso os dados sejam invalidos envia menssagem de erro
    res.send("error");
    return false;
});
//responde a requicisão dos scores do ranking
app.get("/scores", (req, res) => {
    console.log("scores:");
    res.send(dbscores);
    return true;
});
//resgata os dados do usuario requicitado
app.get("/status", (req, res) => {
    console.log("status");
    console.log(req.query.name);
    //se existe o parametro "name" na requicisão resgata os dados do usuario
    if (req.query.name){
        //resgata e envia os dados do usuario
        res.send(modGame.status(req.query.name, dbplayes));
        return true;
    }
    //se não existe o parametro "name" na requicisão envia menssagem de erro
    res.send("error");
    return false;
});
//informa uma url para acessar o jogo e passa a escutar a porta
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    app.listen(port, () =>{
        console.log(`listening: http://${add}:${port}/`);
        //console.log(err);
        //console.log(fam);
    });
    return true;
});