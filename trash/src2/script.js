const music = new Audio("./assets/songs/audio1.wav")
$("#initGame").on("click", function() {
    music.play();
    $(".main_container").html("") 
    $(".cube").fadeIn("slow");
    $("#unidade").fadeIn("slow");
    $("#dezena").fadeIn("slow");
    $("#centena").fadeIn("slow");
    $("#milhar").fadeIn("slow");
})