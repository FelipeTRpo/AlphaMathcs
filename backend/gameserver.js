const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const modGame = require('./componentes/modgame.js');
const jsonplayes = './data/players.json';
const jsonscores = './data/scores.json';
const dbplayes = require(jsonplayes);
const dbscores = require(jsonscores);
app.use(express.json());
app.use(cors());

//registar dados do usuario a cada passagem de nivel
app.post("/register", (req, res) => {
    console.log("teste register");
    console.log(req.body);
    console.log(modGame.validDate(req.body));
    if (modGame.validDate(req.body)){
        let resp = modGame.includes(req.body,dbplayes,dbscores)
        fs.writeFile(jsonplayes, JSON.stringify(dbplayes), 'utf8', err=>{if(err)console.log(err)});
        fs.writeFile(jsonscores, JSON.stringify(dbscores), 'utf8', err=>{if(err)console.log(err)});
        res.send(resp);
        return true;
    }
    res.send("error");
    return false;
});
//responde a requicisão dos scores do ranking
app.get("/scores", (req, res) => {
    console.log("teste scores");
    res.send(dbscores);
    return true;
});
//resgata os dados do usuario requicitado
app.get("/status", (req, res) => {
    console.log("teste status");
    console.log(req.query.name);
    if (req.query.name){
        res.send(modGame.status(req.query.name, dbplayes));
        return true;
    }
    res.send("error");
    return false;
});
//informa uma url para acessar o jogo
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    app.listen(port, () =>{
        console.log(`listening: http://${add}:${port}/`);
        //console.log(err);
        //console.log(fam);
    });
    return true;
});