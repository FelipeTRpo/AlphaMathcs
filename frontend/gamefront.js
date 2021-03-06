//modulos externos (padrão node modules)
const fs = require('fs');
const express = require('express');
//app servidor da pagina
const app = express();
//porta de comunicação da pagina
const port = 80;
const portalternete = 8080;
//configura para servir arquivos estáticos
app.use(express.static('./src/'));
//informa uma url para acessar o jogo e passa a escutar a porta
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    app.listen(port, () =>{
        console.log(`para jogar acesse: http://${add}:${port}`);
        //console.log(err);
        //console.log(fam);
    });
    return true;
});
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    app.listen(portalternete, () =>{
        console.log(`alternativa: http://${add}:${portalternete}`);
        //console.log(err);
        //console.log(fam);
    });
});