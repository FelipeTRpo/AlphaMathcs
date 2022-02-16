$(document).ready(function(){
    $('#sendcep').on("click",function(){
        let cep = $('#cepin').val();
        const validacep = /^[0-9]{8}$/;
        if(validacep.test(cep)){
            $.ajax({url:"https://cep.awesomeapi.com.br/json/"+cep})
            .done((dados)=>{
                $('.output').eq(0).html(dados.address_type+" "+dados.address_name);
                $('.output').eq(1).html("Bairro: "+dados.district);
                $('.output').eq(2).html("Municipio: "+dados.city+"/"+dados.state);
                $('.output').eq(3).html("Latitude: "+dados.lat);
                $('.output').eq(4).html("Longitude: "+dados.lng);
                $('.output').eq(5).html("DDD: ("+dados.ddd+") 0000-0000");
                $('.output').eq(6).html("IBGE: "+dados.city_ibge);
                $('.output').eq(7).html("CEP: "+dados.cep);
                plotarmapa(dados);
            }).fail(function() {alert( "Error na tentativa de consulta\nVerifique o CEP digitado" );});
        }else{
            alert("Formato de CEP incorreto\ndigite apenas 8 algarismos numericos.")
        }
    });
    function plotarmapa(dados){
        const urlmap = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD9aYWJbEoJOUJ-3OE5JsemY1IotoZdyXo&q=${dados.cep}&center=${dados.lat},${dados.lng}&zoom=18`;
        console.log(urlmap);
        $('iframe').attr('src',urlmap);
    }
});

