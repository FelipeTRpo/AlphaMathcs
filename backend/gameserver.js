const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const myModule = require('./componentes/modcadpessoas.js');
const mycalc = require('./componentes/modcalculator.js');
const myGames = require('./componentes/modgames.js');
let calca = new mycalc.calculadora;
const { ppid } = require('process');
const { stringify } = require('querystring');
//const cadastrofunc = require('./funcionarios.json');
const database = './database.json';
const dbgames = './gamesdatabase.json';
const cadastrofunc = require(database);
const gamescat = require(dbgames);
app.use(express.json());
app.use(cors());
//app.use(express.static('../frontend/src/'));
app.use('/funcionarios',express.static('../frontend/src/funcionarios'));
app.use('/calculadora',express.static('../frontend/src/calculadora'));
app.use('/games',express.static('../frontend/src/gamesmagazine'));

app.post("/view", (req, res) => {
    console.log("teste view");
    console.log(req.body);
    res.send(myModule.mostrarcadastro(cadastrofunc));
    return false;
});

app.post("/include", (req, res) => {
    console.log("teste include");
    console.log(req.body);
    //let obj = JSON.parse(req.body);
    //let obj = {};
    //let obj = req.body;
    //console.log(obj);
    if (req.body){
        res.send(myModule.incluir(cadastrofunc,req.body));
        var dbs = JSON.stringify(cadastrofunc);
        fs.writeFile(database, dbs, 'utf8', err=>{console.log(err)});
    } else {
        res.send("É necessário digitar os dados");
    }
    return false;
});
app.post("/birthday", (req, res) => {
    console.log("teste birthday");
    console.log(req.body.mes);
    if (req.body){
        res.send(myModule.aniversario(cadastrofunc,req.body.mes-1));
    } else {
        res.send("É necessário digitar o mes");
    }
    return false;
});
app.post("/setor", (req, res) => {
    console.log("teste setor");
    console.log(req.body.setor);
    if (req.body){
        res.send(myModule.setor(cadastrofunc,req.body.setor));
    } else {
        res.send("É necessário digitar o setor");
    }
    return false;
});
app.post("/ramais", (req, res) => {
    console.log("teste ramais");
    console.log(req.body);
    res.send(myModule.mostrarramais(cadastrofunc));
    return false;
});

app.get("/calc/", (req, res) => {
    console.log(req.query);
    if (req.query.ops && req.query.op1 && req.query.op2){
        calca.setOperation(req.query.ops);
        calca.setOperand1(parseFloat(req.query.op1));
        calca.setOperand2(parseFloat(req.query.op2));
        console.log(calca.getOperand1()+calca.getOperation()+calca.getOperand2()+" = "+calca.getResult());
        res.send([calca.getResult()]);
        return true;
    }else{
        res.send('falta de parametros');
    }
    return false;
});
app.post("/gameadd",(req,res) => {
    console.log(req.body);
    res.send(myGames.includes(gamescat,req.body));
    var dbs = JSON.stringify(gamescat);
    fs.writeFile(dbgames, dbs, 'utf8', err=>{console.log(err)});
    console.log(gamescat[gamescat.length-1]);
    return false;
});
app.get("/gamecat",(req,res) => {
    res.send(gamescat);
    console.log(gamescat);
    return false;
});
app.put("/gameput",(req,res) => {
    console.log(req.body);
    const editresult = myGames.edits(gamescat,req.body);
    res.send(editresult);
    if (editresult){
        var dbs = JSON.stringify(gamescat);
        fs.writeFile(dbgames, dbs, 'utf8', err=>{console.log(err)});
        console.log('game alterado:'+req.body);
    } else {console.log('jogo não encontrado: '+req.body);}
    return false;
});
app.delete("/gamedel",(req,res) => {
    console.log(req.query.id);
    const editresult = myGames.delet(gamescat,req.query.id);
    res.send(editresult);
    if (editresult){
        var dbs = JSON.stringify(gamescat);
        fs.writeFile(dbgames, dbs, 'utf8', err=>{console.log(err)});
        console.log('game removido:'+req.body);
    } else {console.log('jogo não encontrado: '+req.body);}
    return false;
});
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    app.listen(port, () =>{
        console.log(`listening: http://${add}:${port}/funcionarios`);
        console.log(`listening: http://${add}:${port}/calculadora`);
        console.log(`listening: http://${add}:${port}/games`);
        //console.log(err);
        //console.log(fam);
    });
    return true;
});