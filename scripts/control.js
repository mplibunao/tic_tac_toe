"use strict"

/*      control.js      */

/*
 * object to contain all items accessable to all control functions
 */
var globals = {};


/*
    Event Listener for choosing marker (onclick .marker)
    Sets playerOne and playerTwo properties of globals object
*/
$('.marker-buttons').on('click', function(){
    var marker = $(this).attr('id');
    if (marker === "X"){
        globals.playerOne = "X";
        globals.playerTwo = "O";
    } else{
        globals.playerOne = "O";
        globals.playerTwo = "X";
    }

    ui.hideMarkerModal();
    ui.showAIModal();
});


/*
    Event Listener for choosing difficulty level
*/
$('.difficulty').on('click', function(){
    var difficultyLevel = $(this).attr('id');
    //ai.level = difficultyLevel;
    globals.difficulty = difficultyLevel;

    ui.hideAIModal();
    ui.loadingScreen();
    //add timeout to prevent modal hide from lagging
    setTimeout(startGame, 500);
});


/*
 * start game (onclick div.start) behavior and control
 * when start is clicked and a level is chosen, the game status changes to "running"
 * and UI view to swicthed to indicate that it's human's trun to play
 */

var startGame = function start(){
    var selectedDifficulty = globals.difficulty;
    //console.log(selectedDifficulty);
    var playerOne = globals.playerOne;
    var playerTwo = globals.playerTwo;
    
    //var aiPlayer = new AI(selectedDiffeculty);
    var aiPlayer = Object.create(AI);
    aiPlayer.initAI(selectedDifficulty);

    //globals.game = new Game(aiPlayer);
    globals.game = Object.create(Game);
    globals.game.initGame(aiPlayer);
    
    //new step: initialize markers first
    globals.game.initMarkers(playerOne, playerTwo);

    //new step: initialize number of players first (Coming soon)

    aiPlayer.plays(globals.game);
    ui.setPlayers();

    globals.game.start();

}



$('.player-num').on('click', function(){
    var playerNum = $(this).attr('id');
    if (playerNum === "onePlayer"){
        //set AI
    } else{
        //dont set AI
    }
});





/*
 * choosing difficulty level (onclick span.level) behavior and control
 * when a level is clicked, it becomes highlighted and the "ai.level" variable
 * is set to the chosen level
 */
$(".level").each(function() {
    var $this = $(this);
    $this.click(function() {
        $('.selected').toggleClass('not-selected');
        $('.selected').toggleClass('selected');
        $this.toggleClass('not-selected');
        $this.toggleClass('selected');

        //SETS ai.level PROPERTY HERE WHATEVER IT IS.
        ai.level = $this.attr("id");
    });
});

/*
 * start game (onclick div.start) behavior and control
 * when start is clicked and a level is chosen, the game status changes to "running"
 * and UI view to swicthed to indicate that it's human's trun to play
 */
$(".start").click(function() {
    var selectedDiffeculty = $('.selected').attr("id");
    if(typeof selectedDiffeculty !== "undefined") {

        // CONSTRUCTOR CALL HERE. INITIALIZING OBJECTS WHEN YOU PRESS STARTTTT

        //var aiPlayer = new AI(selectedDiffeculty);
        var aiPlayer = Object.create(AI);
        aiPlayer.initAI(selectedDiffeculty);

        //globals.game = new Game(aiPlayer);
        globals.game = Object.create(Game);
        globals.game.initGame(aiPlayer);

        aiPlayer.plays(globals.game);

        globals.game.start();
    }
});

/*
 * click on cell (onclick div.cell) behavior and control
 * if an empty cell is clicked when the game is running and its the human player's trun
 * get the indecies of the clickd cell, craete the next game state, upadet the UI, and
 * advance the game to the new created state
 */
 $(".cell").each(function() {
     var $this = $(this);
     $this.click(function() {
         if(globals.game.status === "running" && globals.game.currentState.turn === globals.game.p1 && !$this.hasClass('occupied')) {
             
             var cellNum = $this.attr('id').slice(-1);
             var indx = parseInt(cellNum);

             //var next = new State(globals.game.currentState);
             var next = Object.create(State);
             next.newState(globals.game.currentState)
             
             next.board[indx] = globals.game.p1;

             ui.insertAt(indx, globals.game.p1);

             next.advanceTurn();

             globals.game.advanceTo(next);

         }
     })
 });

/*      end control.js      */