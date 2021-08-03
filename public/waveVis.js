var audio = document.getElementById("mp3");
audio.volume = 0.5;

let wave = new Wave();
options = {
    type:"web", 
    colors: ["black", "black", "white"]
};
wave.fromElement("mp3", "visualCanvas", options);
