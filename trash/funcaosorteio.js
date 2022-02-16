//função de sorteio
function sortOP(level, sublevel=0){
    let op = {
        "operation" : "operação",
        "result" : 0
    }
    let temp1 = 0;
    let temp2 = 0;
    let tempop = 0;
    let min = 0;
    let max = 9999;
    //sub-funções que sorteiam os termos de cada tipo de operação
    //termos da soma
    function sum(max, min){
        const temp1 = Math.floor(Math.random()*(max-min))+(min);
        max -= temp1;//a soma dos termos não pode ser maior que o limite
        const temp2 = Math.floor(Math.random()*(max-min))+(min);
        return [temp1, temp2];
    }
    //termos da subtração
    function subtraction(max, min){
        const temp1 = Math.floor(Math.random()*(max-min))+(min);
        max = temp1;//o segundo termo não pode ser maior que o primeiro
        const temp2 = Math.floor(Math.random()*(max-min))+(min);
        return [temp1, temp2];
    }
    //termos da multiplicação
    function multiply(max, min){
        if (max > 10) max = max/10;//a multiplicação usa termos mais baixos que a soma
        if (min == 0) min = 1;//na multiplicação nenhum termo pode ser zero
        const temp1 = Math.floor(Math.random()*(max-min))+(min);
        const temp2 = Math.floor(Math.random()*(max-min))+(min);
        return [temp1, temp2];
    }
    //termos da divisão
    function division(max,min){
        let maxdiv = 20;//o divisor não pode ser maior que 20
        if (max < 200) maxdiv = 10;//para numeros baixos não pode ser maior que 10
        min = 1;//não pode ter divisão por zero
        const temp2 = Math.floor(Math.random()*(maxdiv-min))+(min);
        const temp1 = temp2 * (Math.floor(Math.random()*(maxdiv-min))+(min));
        return [temp1, temp2];
    }
    //verifca o nivel do jogador e escolhe a operação de acordo
    switch (level) {
        case 0://somente um numero - sublevel condiz com numero de digitos dos numeros
            if (sublevel >= 4) {
                min = Math.pow(10,sublevel-1);
                max = Math.pow(10,sublevel);
            }else{
                min = Math.pow(10,sublevel);
                max = Math.pow(10,sublevel+1);
            }
            temp1 = Math.floor(Math.random()*(max-min))+(min);
            op.operation = `${temp1} =`;
            op.result = temp1;
            break;
        case 1://somas - sublevel condiz com numero maximo de digitos dos numeros
            if (sublevel >= 3) {max = Math.pow(10,sublevel-1);
            }else if(sublevel >= 1){max = Math.pow(10,sublevel);
            }else{max = Math.pow(10,1);}
            [temp1,temp2] = sum(max,min);
            op.operation = `${temp1} + ${temp2} =`;
            op.result = temp1+temp2;
            break;
        case 2://somas e subtrações de numeros de 0 a 1000 - sublevel não é mais necessario
            max = 1000;
            tempop = Math.round(Math.random());//0 = subtração, 1 = adição
            if(tempop == 0){//caso seja uma subtração
                [temp1,temp2] = subtraction(max,min);
                op.operation = `${temp1} - ${temp2} =`;
                op.result = temp1-temp2;
            }else{//caso seja adição
                [temp1,temp2] = sum(max,min);
                op.operation = `${temp1} + ${temp2} =`;
                op.result = temp1+temp2;
            }
            break;
        case 3://multiplicações conforme sublevel (maximo até 100)
            if (sublevel<3) max = 10;
            else max = 100;
            [temp1,temp2] = multiply(max,min);
            op.operation = `${temp1} * ${temp2} =`;
            op.result = temp1*temp2;
            break;
        case 4://soma, subtração e multiplicação, conforme sublevel (maximo até 100)
            if (sublevel<3) max = 10;
            else max = 100;
            tempop = Math.round(Math.random()*2);//0 = subtração, 1 = adição, 2 = multipicação
            if (tempop == 1){//caso seja adição
                [temp1,temp2] = sum(max,min);
                op.operation = `${temp1} + ${temp2} =`;
                op.result = temp1+temp2;
            }else if(tempop == 0){//caso seja subtração
                [temp1,temp2] = subtraction(max,min);
                op.operation = `${temp1} - ${temp2} =`;
                op.result = temp1-temp2;
            }else if(tempop == 2){//caso seja multiplicação
                [temp1,temp2] = multiply(max,min);
                op.operation = `${temp1} * ${temp2} =`;
                op.result = temp1*temp2;
            }
            break;
        case 5://divisão conforme o conforme sublevel
            min = 1;
            max = (sublevel+1)*10;
            [temp1,temp2] = division(max,min);
            op.operation = `${temp1} / ${temp2} =`;
            op.result = temp1/temp2;
            break
        default://mistura todos os casos possiveis - sublevel não é mais necessario
            tempop = Math.round(Math.random()*3);//0 = subtração, 1 = adição, 2 = multipicação, 3 = divisão
            if (tempop == 1){//caso seja adição
                [temp1,temp2] = sum(max,min);
                op.operation = `${temp1} + ${temp2} =`;
                op.result = temp1+temp2;
            }else if(tempop == 0){//caso seja subtração
                [temp1,temp2] = subtraction(max,min);
                op.operation = `${temp1} - ${temp2} =`;
                op.result = temp1-temp2;
            }else if(tempop == 2){//caso seja multiplicação
                max = 500;
                [temp1,temp2] = multiply(max,min);
                op.operation = `${temp1} * ${temp2} =`;
                op.result = temp1*temp2;
            }else if(tempop == 3){//caso seja divisão
                [temp1,temp2] = division(max,min);
                op.operation = `${temp1} / ${temp2} =`;
                op.result = temp1/temp2;
            }
            break;
    }
    //retorna um objeto com a operação montada em um string e o resultado em um inteiro
    return op;
}

//testes
for(let level=0; level<10; level++){
    for(let sublevel=0; sublevel<5; sublevel++){
        console.log(`Level: ${level} - Sublevel: ${sublevel}`);
        console.log(sortOP(level, sublevel));
    }
}