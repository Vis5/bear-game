// const io = require("socket.io-client");
const socket = io();
var prng = new Math.seedrandom('hello.');
var roomName = new Date().getTime();

window.onload = function() {
    socket.emit("join", roomName);
    socket.on("startRace", function(seed) {
        prng = new Math.seedrandom(seed);
    });

};

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  
  var bear1 = document.querySelector("#bear-1");
  var bear2 = document.querySelector("#bear-2");
  var bear3 = document.querySelector("#bear-3");
  var bear4 = document.querySelector("#bear-4");
  var allBear = document.querySelectorAll('[id^=bear-]');

  var bear1anim;
      var bear2anim;
      var bear3anim;
      var bear4anim;

    var bear1animation = {
        container: bear1,
        renderer: 'svg',
        loop: true,
        autoplay: false,   /*MAKE SURE THIS IS FALSE*/
        rendererSettings: {
            progressiveLoad: false},
        path: 'lottie/bear1-new.json',
        name: 'bear1Animation',
    };
    var bear2animation = {
        container: bear2,
        renderer: 'svg',
        loop: true,
        autoplay: false,   /*MAKE SURE THIS IS FALSE*/
        rendererSettings: {
            progressiveLoad: false},
        path: '../lottie/bear2-new.json',
        name: 'bear2Animation',
    };
    var bear3animation = {
        container: bear3,
        renderer: 'svg',
        loop: true,
        autoplay: false,   /*MAKE SURE THIS IS FALSE*/
        rendererSettings: {
            progressiveLoad: false},
        path: '../lottie/bear3-new.json',
        name: 'bear3Animation',
    };
    var bear4animation = {
        container: bear4,
        renderer: 'svg',
        loop: true,
        autoplay: false,   /*MAKE SURE THIS IS FALSE*/
        rendererSettings: {
            progressiveLoad: false},
        path: '../lottie/bear4-new.json',
        name: 'bear4Animation',
    };
    bear1anim = lottie.loadAnimation(bear1animation);
    bear2anim = lottie.loadAnimation(bear2animation);
    bear3anim = lottie.loadAnimation(bear3animation);
    bear4anim = lottie.loadAnimation(bear4animation);
  
    var b1Speed;
    var b2Speed;
    var b3Speed;
    var b4Speed;
    // function randomSpeed(){
    //     b1Speed = getRandomArbitrary(0.5,3);
    //     b2Speed = getRandomArbitrary(0.5,3);
    //     b3Speed = getRandomArbitrary(0.5,3);
    //     b4Speed = getRandomArbitrary(0.5,3);
    // }
    bear1anim.goToAndPlay(1, true);
    bear2anim.goToAndPlay(1, true);
    bear3anim.goToAndPlay(1, true);
    bear4anim.goToAndPlay(1, true);

  function gameRace(){

    socket.emit("dev:start", roomName);
    var b1Speed = getRandomArbitrary(0.5,3);
    var b2Speed = getRandomArbitrary(0.5,3);
    var b3Speed = getRandomArbitrary(0.5,3);
    var b4Speed = getRandomArbitrary(0.5,3);

    gsap.to(".racing-bear", {
        x: function() {
            var r =  Math.floor(prng() * 130 - 10);
            return "+=" + r
        },
        repeat: 20,
        transformOrigin: "left center",
        repeatRefresh: true,
        onUpdate: function(){
            let tween = this
            this.targets().forEach(function(el){
                
                if(gsap.getProperty(el, "x") > 650){
                    gsap.to(el, {scale:1.2, repeat:12, yoyo:true, duration:0.1})
                    // console.log(el.dataset.amount, el.dataset.label);
                    winner.amount = el.dataset.amount,
                    winner.label = el.dataset.label;
                    winner.bear = el.id;
                    if(winner.amount == 0){
                        alert( "You lost !!! \n" + "Winner bear: " + winner.bear +"\n")
                    }else{
                        alert( "You Win !!! \n" + "Winner bear: " + winner.bear +"\n" + "Win Amount: " + winner.amount +"000 P" +"\n" + "Winner Label: " + winner.label)
                    }
                    tween.pause()
                    allBear.forEach(function(i){
                        i.children[0].style.display = "block"
                        i.children[1].style.display = "none"
                    })
                }
            })
        }
    })

        // bear1anim.setSpeed(1 * b1Speed);
        // bear2anim.setSpeed(1 * b2Speed);
        // bear3anim.setSpeed(1 * b3Speed);
        // bear4anim.setSpeed(1 * b4Speed);

        allBear.forEach(function(i){
            i.children[0].style.display = "none"
            i.children[1].style.display = "block"
        })
    }
    var winner = {
        bear: null,
        amount: 0,
        label: null,
        total: 0
    }
    var players = document.querySelectorAll(".choose-from-plalyer .player");
    var colors = document.querySelectorAll(".choose-from-color .label");
    var labelRed = document.querySelectorAll('[data-label="red"]');
    var labelBlue = document.querySelectorAll('[data-label="blue"]');
    
    var player1 = document.querySelectorAll(".choose-player")[0];
    var player2 = document.querySelectorAll(".choose-player")[1];
    var player3 = document.querySelectorAll(".choose-player")[2];
    var player4 = document.querySelectorAll(".choose-player")[3];

    var color1 = document.querySelectorAll(".choose-label")[0];
    var color2 = document.querySelectorAll(".choose-label")[1];
    var player1Amount = 0;
    var player2Amount = 0;
    var player3Amount = 0;
    var player4Amount = 0;
    var coloRed = 0;
    var colorBlue = 0;
    player1.innerHTML = player1Amount + " P";
    player2.innerHTML = player2Amount + " P";
    player3.innerHTML = player3Amount + " P";
    player4.innerHTML = player4Amount + " P";

    function amountResult(){
        bear1.setAttribute("data-amount", player1Amount);
        bear2.setAttribute("data-amount", player2Amount);
        bear3.setAttribute("data-amount", player3Amount);
        bear4.setAttribute("data-amount", player4Amount);
    }

    color1.innerHTML = coloRed + " P";
    color2.innerHTML = colorBlue + " P";

    players.forEach(function(el, i){
        // console.log(i, el)
        el.addEventListener("click", function(item){
            // console.log(item.target.id)
            if(item.target.id == "first"){
                player1Amount ++ ;
                player1.innerHTML = player1Amount + "000 p"
                if(player1Amount >= 10){
                    player1Amount -- ;
                } else {
                bear1.setAttribute("data-amount", parseInt(bear1.dataset.amount)+1);
                }
            }
            if(item.target.id == "second"){
                player2Amount ++ ;
                player2.innerHTML = player2Amount + "000 p"
                if(player2Amount >= 10){
                    player2Amount -- ;
                }
                else {
                    bear2.setAttribute("data-amount", parseInt(bear2.dataset.amount)+1);
                    }
                // bear2.setAttribute("data-amount", + player2Amount);
            }
            if(item.target.id == "third"){
                player3Amount ++ ;
                player3.innerHTML = player3Amount + "000 p"
                if(player3Amount >= 10){
                    player3Amount -- ;
                }
                else {
                    bear3.setAttribute("data-amount", parseInt(bear3.dataset.amount)+1);
                    }
                // bear3.setAttribute("data-amount", + player3Amount);
            }
            if(item.target.id == "fourth"){
                player4Amount ++ ;
                player4.innerHTML = player4Amount + "000 p"
                if(player4Amount >= 10){
                    player4Amount -- ;
                }
                else {
                    bear4.setAttribute("data-amount", parseInt(bear4.dataset.amount)+1);
                    }
                // bear4.setAttribute("data-amount", + player4Amount);
            }
            // amountResult()
        });
    })

    colors.forEach(function(el, i){
        // console.log(i, el)
        el.addEventListener("click", function(item){
            // console.log(item.target.id)
            if(item.target.id == "red"){
                coloRed ++ ;
                color1.innerHTML = coloRed + "000 p"
                if(coloRed >= 10){
                    coloRed -- ;
                } else {
                labelRed.forEach(function(el,i){
                    el.setAttribute("data-amount", parseInt(el.dataset.amount)+1);
                });
                }
            }
            if(item.target.id == "blue"){
                colorBlue ++ ;
                color2.innerHTML = colorBlue + "000 p"
                if(colorBlue >= 10){
                    colorBlue -- ;
                }else {
                    labelBlue.forEach(function(el,i){
                        el.setAttribute("data-amount", parseInt(el.dataset.amount)+1);
                    });
                    }
            }
        });
    })