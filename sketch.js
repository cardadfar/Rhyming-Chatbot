var rm;
var myRec;
var recentWords, prevWords;
var rhymeWord;
var compRes;

function setup() {
    var width = $(window).width();
    var height = $(window).height();
    createCanvas(width, height);
    background(100);
    myRec = new p5.SpeechRec();
    myRec.continuous = true;
    myRec.interimResults = true;
    myRec.start();
    recentWords = '';
    prevWords = '';
    rhymeWord = [''];
    rm = new RiMarkov(3);
    rm.loadFrom("text.txt");
    compRes = '';
}

function draw() {
    background('#a8daff');
    ellipse(mouseX, mouseY, 20, 20);
    if(myRec.resultValue==true) {
        recentWords = myRec.resultString;
        var newWords = split(recentWords, ' ');
        rhymeWord = RiTa.rhymes(newWords[newWords.length-1]);
        if(recentWords != prevWords) {
            compRes = '';
            var tokenRes = rm.generateTokens(newWords.length-1);
            for(var i = 0; i < tokenRes.length; i++)
                set_compRes(tokenRes[i]);
            prevWords = recentWords;
        }
    }
    fill(0);
    noStroke();
    textSize(width/15);
    textFont('Helvetica');
    textStyle(BOLD);
    text(recentWords, width/2 - textWidth(recentWords)/2, 0.2*height);
    text(rhymeWord[0], width/2 + textWidth(compRes)/2 - textWidth(rhymeWord[0])/2, 0.7*height);
    text(compRes, width/2 - textWidth(compRes)/2 - textWidth(rhymeWord[0])/2, 0.7*height);

    textSize(width/60);
    var words = split(recentWords, ' ');
    if(words.length == 1)
        var wordLength = words.length + ' word';
    else
        var wordLength = words.length + ' words';
    text(wordLength, width/2 - textWidth(wordLength)/2, height/2);
}

function set_compRes(word) {
    if(word != '.' && word != ',' && word != ':' && word != '?') {
        compRes += word.toLowerCase();
        compRes += ' ';
    }
    else {
        var temp = rm.generateTokens(1);
        set_compRes(temp);
    }
}