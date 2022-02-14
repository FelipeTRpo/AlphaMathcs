const fs = require('fs');
const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('./src/'));

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    app.listen(port, () =>{
        console.log(`para jogar acesse: http://${add}:${port}`);
    });
    return true;
});