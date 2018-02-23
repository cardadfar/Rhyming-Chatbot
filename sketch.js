var rm;
var voice;
var myRec;
var recentWords, prevWords;
var rhymeWord;
var compRes;
var sinceChange;
var spoken, second;
var spokenLines = [];
var capture;
var mute_button, bg, logo;
var itc;
var mousePos = [];

function preload() {
    itc = loadFont("brad.ttf");
}

function setup() {
    var width = 0.98*$(window).width();
    var height = 0.97*$(window).height();
    createCanvas(width, height);
    background(100);
    mute_button = loadImage("button_mute.png");
    logo = loadImage("logo.png");
    bg = loadImage("paper.jpg");
    myRec = new p5.SpeechRec();
    voice = new p5.Speech();
    myRec.continuous = true;
    myRec.interimResults = true;
    myRec.start();
    recentWords = '';
    prevWords = '';
    rhymeWord = [''];
    rm = new RiMarkov(3);
    rm.loadFrom("text.txt");
    compRes = '';
    sinceChange = 0;
    spoken = false;
    second = true;
    capture = 0;
    emptyLine = false;
    for(var i = 0; i < 5; i++)
        mousePos[i] = createVector(mouseX, mouseY);
}

function draw() {
    background(bg);
    script_line();
    image(logo, 25, 25);
    mute_button.resize(0.05*width, 0.05*width);

    if(!second) {
        image(mute_button, 25, height-25-0.05*width);
        fill(0);
        noStroke();
        textSize(25);
        text("don't speak.", 100, height-50);
    }
    
    if(myRec.resultValue==true && second==true) {
        recentWords = myRec.resultString;
        if(capture < 100)
            capture++;
        else {
            second = false;
            myRec.resultString = ' ';
            if(recentWords == '' || recentWords == ' ') {
                second = true;
                capture = -150;
            }
            else
                redo();
        }
     }

    fill(0);
    stroke(0);
    strokeWeight(2);
    textFont(itc);
    textSize(width/15);
    if(textWidth(recentWords) > 0.85*width)
        textSize(width/30);
    textStyle(BOLD);
    text(recentWords.toLowerCase(), width/2 - textWidth(recentWords)/2, 0.8*height);

    sinceChange++;
    var wait = 5*recentWords.length + 20;
    if(wait < 70)
        wait = 70;
    if(sinceChange == wait && spoken) {
        append(spokenLines, recentWords.toLowerCase());
        if(random() < 0.9) {
            voice.speak(compRes);
            recentWords = compRes;
            redo();
        }
        else {
            recentWords = '';
            append(spokenLines, ' ');
            second = true;
            capture = -150;
            spoken = false;
            sinceChange = 0;
        }
    }

    print_spokenLines();
}

function script_line() {
    for(var i = 0; i < mousePos.length-1; i++)
        mousePos[i] = mousePos[i+1];
    mousePos[mousePos.length] = createVector(mouseX, mouseY);

    stroke(0);
    strokeWeight(1);
    for(var i = 0; i < mousePos.length-1; i++)
        line(mousePos[i].x, mousePos[i].y, mousePos[i+1].x, mousePos[i+1].y)
}

function redo() {
    var newWords = split(recentWords, ' ');
    rhymeWord = RiTa.rhymes(newWords[newWords.length-1]);
    if(recentWords != prevWords) {
        sinceChange = 0;
        spoken = true;
        compRes = '';
        var tokenRes = rm.generateTokens(newWords.length-1);
        for(var i = 0; i < tokenRes.length; i++)
            set_compRes(tokenRes[i]);
        prevWords = recentWords;
        var temp = int(random(rhymeWord.length-1));
        compRes += rhymeWord[temp];
    }
}

function set_compRes(word) {
    if(word != '.' && word != ',' && word != ':' && word != '?' && word != "'" && word != "!") {
        compRes += word;
        compRes += ' ';
    }
    else {
        var temp = rm.generateTokens(1);
        set_compRes(temp);
    }
}

function print_spokenLines() {
    strokeWeight(1);
    var start = 0.65*height - 15*spokenLines.length;
    textSize(12);
    for(var i = 0; i < spokenLines.length; i++)
        text(spokenLines[i], width/2 - textWidth(spokenLines[i])/2, start + 15*(i+1));
}
