//
// websocket
//

var socket = io('/faw-namespace');

// messages informatif
socket.on("title", function (data) {
    if (data.message == 1) {
	document.getElementById("faw-title").innerHTML = '<div id="title" class="alert alert-info" role="alert">Le jeu est en attente d\'un joueur pour commencer la partie.</div>';
//	var canvass = document.getElementById("webglCanvas");
//	if (canvass.hasChildNodes() == true) {
//	    canvass.removeChild(canvass.firstChild);
//	    document.getElementById("stats").innerHTML = '';
//	    console.log(faw);
/*
	    faw.table = null;
	    faw.table3d = null;
	    faw.meshes = [];
	    faw.myword = '';
	    faw.mywordMeshes = [];
	    console.log(faw);
*/
//	}
    }
    else if (data.message == 2) {
	document.getElementById("faw-title").innerHTML = '<div id="title" class="alert alert-success" role="alert">La partie est en cours</div>';
	if (typeof faw === 'undefined') {
	    //console.log(typeof faw);
	    faw = new FawGame();
	    //console.log(faw);
	    faw.startGame();
	    //console.log(faw);
	}
/*
	else {
	    console.log('faw exist deja');
	    console.log(faw);
	}
*/  
    }

});

// liste des joueurs connectés
socket.on("playersList", function(data) {
    document.getElementById("faw-players-list").innerHTML = 'Liste des joueurs connectés :<br>' + data.playersList;
});




// envoyer une lettre vers le serveur
function sendLetter(letter, posX, posY, meshesPos) {
    socket.emit("addLetter", { 
	letter: letter,
	x: posX,
	y: posY,
	meshesPos: meshesPos
    });
}

// valider un mot
function submitWord() {
    socket.emit("submit", {});
}
