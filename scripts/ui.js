


// ui object will contain all the methods for ui manipulation
var ui = {};

/*	Open Player Num Modal Dialog */
ui.showPlayerNumModal = function showPlayerNumModal(){
	$('#player-num-modal').modal("show");
};

/*	hide Player Num Modal Dialog */
ui.hidePlayerNumModal = function hidePlayerNumModal(){
	$('#player-num-modal').modal("show");
};

/*	Open Marker Modal Dialog */
ui.showMarkerModal = function showMarkerModal(){
	$('#marker-modal').modal("show");
};

/*	hide Marker Modal Dialog */
ui.hideMarkerModal = function hideMarkerModal(){
	$('#marker-modal').modal("hide");
}

/*	Open AI Modal Dialog */
ui.showAIModal = function showAIModal(){
	$('#AI-modal').modal("show");
}
/*	hide AI Modal Dialog */
ui.hideAIModal = function hideAIModal(){
	$('#AI-modal').modal('hide');
}

ui.switchViewTo = function switchViewTo(view){
	switch(view){
		case "playerOne":
			$('.turnIndicator').html('Your Turn');
			break;
		case "playerTwo":
			$('.turnIndicator').html('Computer\'s turn');
			break;
		case "won":
			console.log("won");
			break;
		case "lost":
			console.log("lost");
			break;
		case "draw":
			console.log("draw");
			break;
	}
}

/*
	Applies the pulsate effect on the given cells
	@param array contains the cell number of the winning moves or all the cell number in the case of a tie
*/
ui.pulsate = function(array){
	array.map(function(id){
		addEffect('#cell-'+id, 'pulsate', 3, 1200);
	});
	/*
	for (let i=0; i<array.length; i++){
		addEffect('#cell-'+i, 'pulsate', 3, 1200);
	}
	*/
}

//insert marker at the specified position in the board
ui.insertAt = function insertAt(pos, turn){
	var cellNum = "#cell-"+pos;
	var turnHTML = "<h1 class='marker'>" + turn + "</h1>";
	$(cellNum).addClass("occupied").html(turnHTML);
}

ui.setPlayers = function(){
	$('.match-up').html("Player 1 vs Computer");
}


$(document).ready(function(){
	ui.showMarkerModal();
});