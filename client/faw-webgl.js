//
// webgl
//

function FawGame() {
    this.table = null; // Toutes les lettres
    this.table3d = null; // Initialisation de toutes les positions des lettres
    this.meshes = []; // THREE.Mesh de toutes les lettres créées
    this.myword = ''; // mot courant input
    this.mywordMeshes = []; // lettres input
    this.statsMeshes = []; // lettres stats
}

FawGame.prototype = {
    // creation du canvas webgl
    startGame: function(length) {
	var myThis = this;
	socket.on("start", function(data) {
	    if (document.getElementById("webglCanvas").hasChildNodes() == false) {
		myThis.table = data.table;
		// initialise les positions 3D
		myThis.create3DPositions();
	    }
	});
    },

    // creer un tableau a n dimensions
    createArray: function(length) {
        var arr = new Array(length || 0);
        var i = length;
        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
        }
        return arr;
    },

    // ajoute les positions prédéfinis a this.positions et lance la partie
    create3DPositions: function() {
	this.table3d = this.createArray(5, 10);

	// 1ere ligne
	var positions = {};
	positions.x = 0; 
	positions.y = 8;
	positions.z = 0;
	this.table3d[0][0] = positions;

	var positions = {};
	positions.x = 2; 
	positions.y = 8;
	positions.z = 0;
	this.table3d[0][1] = positions;

	var positions = {};
	positions.x = 4; 
	positions.y = 8;
	positions.z = 0;
	this.table3d[0][2] = positions;

	var positions = {};
	positions.x = 6; 
	positions.y = 8;
	positions.z = 0;
	this.table3d[0][3] = positions;

	var positions = {};
	positions.x = 8; 
	positions.y = 8;
	positions.z = 0;
	this.table3d[0][4] = positions;

	var positions = {};
	positions.x = 10; 
	positions.y = 8;
	positions.z = 0;
	this.table3d[0][5] = positions;

	var positions = {};
	positions.x = 12; 
	positions.y = 8;
	positions.z = 0;
	this.table3d[0][6] = positions;

	var positions = {};
	positions.x = 14; 
	positions.y = 8;
	positions.z = 0;
	this.table3d[0][7] = positions;

	var positions = {};
	positions.x = 16; 
	positions.y = 8;
	positions.z = 0;
	this.table3d[0][8] = positions;

	var positions = {};
	positions.x = 18; 
	positions.y = 8;
	positions.z = 0;
	this.table3d[0][9] = positions;

	// 2eme ligne
	var positions = {};
	positions.x = 0; 
	positions.y = 6;
	positions.z = 0;
	this.table3d[1][0] = positions;

	var positions = {};
	positions.x = 2; 
	positions.y = 6;
	positions.z = 0;
	this.table3d[1][1] = positions;

	var positions = {};
	positions.x = 4; 
	positions.y = 6;
	positions.z = 0;
	this.table3d[1][2] = positions;

	var positions = {};
	positions.x = 6; 
	positions.y = 6;
	positions.z = 0;
	this.table3d[1][3] = positions;

	var positions = {};
	positions.x = 8; 
	positions.y = 6;
	positions.z = 0;
	this.table3d[1][4] = positions;

	var positions = {};
	positions.x = 10; 
	positions.y = 6;
	positions.z = 0;
	this.table3d[1][5] = positions;

	var positions = {};
	positions.x = 12; 
	positions.y = 6;
	positions.z = 0;
	this.table3d[1][6] = positions;

	var positions = {};
	positions.x = 14; 
	positions.y = 6;
	positions.z = 0;
	this.table3d[1][7] = positions;

	var positions = {};
	positions.x = 16; 
	positions.y = 6;
	positions.z = 0;
	this.table3d[1][8] = positions;

	var positions = {};
	positions.x = 18; 
	positions.y = 6;
	positions.z = 0;
	this.table3d[1][9] = positions;

	// 3eme ligne
	var positions = {};
	positions.x = 0; 
	positions.y = 4;
	positions.z = 0;
	this.table3d[2][0] = positions;

	var positions = {};
	positions.x = 2; 
	positions.y = 4;
	positions.z = 0;
	this.table3d[2][1] = positions;

	var positions = {};
	positions.x = 4; 
	positions.y = 4;
	positions.z = 0;
	this.table3d[2][2] = positions;

	var positions = {};
	positions.x = 6; 
	positions.y = 4;
	positions.z = 0;
	this.table3d[2][3] = positions;

	var positions = {};
	positions.x = 8; 
	positions.y = 4;
	positions.z = 0;
	this.table3d[2][4] = positions;

	var positions = {};
	positions.x = 10; 
	positions.y = 4;
	positions.z = 0;
	this.table3d[2][5] = positions;

	var positions = {};
	positions.x = 12; 
	positions.y = 4;
	positions.z = 0;
	this.table3d[2][6] = positions;

	var positions = {};
	positions.x = 14; 
	positions.y = 4;
	positions.z = 0;
	this.table3d[2][7] = positions;

	var positions = {};
	positions.x = 16; 
	positions.y = 4;
	positions.z = 0;
	this.table3d[2][8] = positions;

	var positions = {};
	positions.x = 18; 
	positions.y = 4;
	positions.z = 0;
	this.table3d[2][9] = positions;

	// 4eme ligne
	var positions = {};
	positions.x = 0; 
	positions.y = 2;
	positions.z = 0;
	this.table3d[3][0] = positions;

	var positions = {};
	positions.x = 2; 
	positions.y = 2;
	positions.z = 0;
	this.table3d[3][1] = positions;

	var positions = {};
	positions.x = 4; 
	positions.y = 2;
	positions.z = 0;
	this.table3d[3][2] = positions;

	var positions = {};
	positions.x = 6; 
	positions.y = 2;
	positions.z = 0;
	this.table3d[3][3] = positions;

	var positions = {};
	positions.x = 8; 
	positions.y = 2;
	positions.z = 0;
	this.table3d[3][4] = positions;

	var positions = {};
	positions.x = 10; 
	positions.y = 2;
	positions.z = 0;
	this.table3d[3][5] = positions;

	var positions = {};
	positions.x = 12; 
	positions.y = 2;
	positions.z = 0;
	this.table3d[3][6] = positions;

	var positions = {};
	positions.x = 14; 
	positions.y = 2;
	positions.z = 0;
	this.table3d[3][7] = positions;

	var positions = {};
	positions.x = 16; 
	positions.y = 2;
	positions.z = 0;
	this.table3d[3][8] = positions;

	var positions = {};
	positions.x = 18; 
	positions.y = 2;
	positions.z = 0;
	this.table3d[3][9] = positions;

	// 5eme ligne
	var positions = {};
	positions.x = 0; 
	positions.y = 0;
	positions.z = 0;
	this.table3d[4][0] = positions;

	var positions = {};
	positions.x = 2; 
	positions.y = 0;
	positions.z = 0;
	this.table3d[4][1] = positions;

	var positions = {};
	positions.x = 4; 
	positions.y = 0;
	positions.z = 0;
	this.table3d[4][2] = positions;

	var positions = {};
	positions.x = 6; 
	positions.y = 0;
	positions.z = 0;
	this.table3d[4][3] = positions;

	var positions = {};
	positions.x = 8; 
	positions.y = 0;
	positions.z = 0;
	this.table3d[4][4] = positions;

	var positions = {};
	positions.x = 10; 
	positions.y = 0;
	positions.z = 0;
	this.table3d[4][5] = positions;

	var positions = {};
	positions.x = 12; 
	positions.y = 0;
	positions.z = 0;
	this.table3d[4][6] = positions;

	var positions = {};
	positions.x = 14; 
	positions.y = 0;
	positions.z = 0;
	this.table3d[4][7] = positions;

	var positions = {};
	positions.x = 16; 
	positions.y = 0;
	positions.z = 0;
	this.table3d[4][8] = positions;

	var positions = {};
	positions.x = 18; 
	positions.y = 0;
	positions.z = 0;
	this.table3d[4][9] = positions;

	// lance la canvas webgl
	this.fawGame();
    },

    // ajoute et positionne une lettre
    addLetter: function(letter, i, j) {
	var material = new THREE.MeshPhongMaterial({
	    color: 0xdddddd
	});
	var textGeom = new THREE.TextGeometry(letter, {
	    size: 1,
	    height: 0.3,
	    weight: 'bold',
	    font: 'libre baskerville'
	});
	var textMesh = new THREE.Mesh(textGeom, material);
	textMesh.position.set(
	    this.table3d[i][j].x, 
	    this.table3d[i][j].y, 
	    this.table3d[i][j].z
	);
	return textMesh;
    },

    // affiche les lettres du tableau sur le canvas
    tableToCanvas: function(scene) {
	var nbItem = 0;
	for(var i = 0; i < 5; i++){
	    for(var j = 0; j < 10; j++){
		var mesh = this.addLetter(this.table[i][j], i, j);
		mesh.name = this.table[i][j];
		mesh.positionTableI = i; 
		mesh.positionTableJ = j;
		mesh.positionMeshes = nbItem;
		nbItem++;
		this.meshes.push(mesh);
		scene.add(mesh);
	    }
	}
    },

    // fonction principal webgl
    fawGame: function() {
	// chargement des textures
	var scoreTotalTexture = THREE.ImageUtils.loadTexture("images/score-total.png"); 
	var enchainementTexture = THREE.ImageUtils.loadTexture("images/enchainement-sans-erreurs.png"); 
	var bonsMotsTexture = THREE.ImageUtils.loadTexture("images/bon-mots.png"); 
	var mauvaisMotsTexture = THREE.ImageUtils.loadTexture("images/mauvais-mots.png"); 

	var myThis = this;
	var container = document.getElementById('webglCanvas');
	var viewWidth = container.offsetWidth;
	var viewHeight = container.offsetHeight;
	var projector = new THREE.Projector();

	var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setSize( 800, 600 );
	container.appendChild(renderer.domElement);

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(
            85,             // Field of view
            800/600,      // Aspect ratio
            0.1,            // Near plane
            10000        // Far plane
        );
	// camera face sur l'axe y
	camera.position.set(9.5, 1, 10);

	// creation et affichage des lettres
	this.tableToCanvas(scene);

	// eclairage
	var light = new THREE.PointLight(0xFFFF00);
	light.position.set(9, 10, 25);
	scene.add(light);

	// rendu initial apres chargement de la texture du bouton submit
	var submitTexture = THREE.ImageUtils.loadTexture('images/green_boxCheckmark.png', {}, function() {
	    // creation et affichage du bouton valider
	    var submitMaterial = new THREE.MeshBasicMaterial({map: submitTexture});
	    var submitGeometry = new THREE.PlaneGeometry(1, 1);
	    var submitMesh = new THREE.Mesh(submitGeometry, submitMaterial);
	    submitMesh.name = 'submit';
	    submitMesh.position.set(21, -3, 0);
	    scene.add(submitMesh);
	    myThis.meshes.push(submitMesh);
	    renderer.render(scene, camera);
	});

	// sprite score total
	var Material = new THREE.SpriteMaterial({ 
	    map: scoreTotalTexture, 
	    color: 0xFFFF00, 
	    fog: true 
	});
	var sprite = new THREE.Sprite(Material);
	sprite.position.x = 5;
	sprite.position.y = -4.5;
	sprite.scale.x = 4;
	sprite.scale.y = 1;
	scene.add(sprite);

	// sprite enchainement de bons mots
	var Material = new THREE.SpriteMaterial({ 
	    map: enchainementTexture, 
	    color: 0xFFFFFF, 
	    fog: true 
	});	    
	var sprite = new THREE.Sprite(Material);
	sprite.position.x = 2.5;
	sprite.position.y = -5.5;
	sprite.scale.x = 9;
	sprite.scale.y = 1;
	scene.add(sprite);

	// sprite bons mots
	var Material = new THREE.SpriteMaterial({ 
	    map: bonsMotsTexture, 
	    color: 0xFFFFFF, 
	    fog: true 
	});	    
	var sprite = new THREE.Sprite(Material);
	sprite.position.x = 5.5;
	sprite.position.y = -6.5;
	sprite.scale.x = 3;
	sprite.scale.y = 1;
	scene.add(sprite);
	
	// sprite mauvais mots
	var Material = new THREE.SpriteMaterial({ 
	    map: mauvaisMotsTexture, 
	    color: 0xffffff, 
	    fog: true 
	});
	var sprite = new THREE.Sprite(Material);
	sprite.position.x = 4.5;
	sprite.position.y = -7.5;
	sprite.scale.x = 5;
	sprite.scale.y = 1;
	scene.add(sprite);

	renderer.render(scene, camera);

	//
	// fonctions
	//

	// affiche le mot dans le input
	function updateInput() {
	    // si myThis.mywordMeshes est defini
	    if (!_.isUndefined(myThis.mywordMeshes)) {
		scene.remove(myThis.mywordMeshes[0]);
		delete(myThis.mywordMeshes[0]);
	    }

	    var inputMaterial = new THREE.MeshPhongMaterial({color: 0x99FF00});
	    var inputGeometry = new THREE.TextGeometry(myThis.myword, {
		size: 0.6,
		height: 0.1,
		font: 'libre baskerville'
	    });
	    var inputMesh = new THREE.Mesh(inputGeometry, inputMaterial);
	    inputMesh.position.set(-2, -3.4, 0);
	    scene.add(inputMesh);
	    myThis.mywordMeshes[0] = inputMesh;
	    //console.log(myThis.myword);
	    renderer.render(scene, camera);
	}

	// detecte quand la souris click sur un objet
	function onDocumentMouseDown(event) {
	    event.preventDefault();
	    var rect = container.getBoundingClientRect();                                
	    var offsetX = rect.left;
	    var offsetY = rect.top;
	    var mouse3D = new THREE.Vector3( (event.clientX - offsetX) /  viewWidth * 2 - 1,
                                             -(event.clientY - offsetY) /  viewHeight * 2 + 1,
                                             0.5);
	    projector.unprojectVector(mouse3D, camera);
	    mouse3D.sub(camera.position);                
            mouse3D.normalize()
	    var raycaster = new THREE.Raycaster(camera.position, mouse3D);
            var intersects = raycaster.intersectObjects(myThis.meshes);
	    if (intersects.length > 0) {
		if (intersects[0].object.name != 'submit') {
		    sendLetter(intersects[0].object.name, 
			       intersects[0].object.positionTableI,
			       intersects[0].object.positionTableJ,
			       intersects[0].object.positionMeshes
			      );
		    // afficher la lettre dans le input
		    if (myThis.myword.length < 25) {
			myThis.myword += intersects[0].object.name;
			updateInput();			
		    }
		}
		else {
		    //console.log('submit');
		    if (myThis.myword.length > 0) {
			submitWord();
		    }
		}
	    }
	    renderer.render(scene, camera);
	}

	// affiche les stats selon leur type (score total, enchainement, bons mots, mauvais mots)
	function updateStats(data) {
	    if (!_.isUndefined(myThis.statsMeshes)) {	    
		scene.remove(myThis.statsMeshes[0]);
		scene.remove(myThis.statsMeshes[1]);
		scene.remove(myThis.statsMeshes[2]);
		scene.remove(myThis.statsMeshes[3]);
		renderer.render(scene, camera);
	    }

	    // data.stats.score
	    var statsMaterial = new THREE.MeshPhongMaterial({color: 0x99FF00});
	    var statsGeometry = new THREE.TextGeometry(data.stats.score, {
		size: 0.6,
		height: 0.1,
		font: 'libre baskerville'
	    });
	    var statsMesh = new THREE.Mesh(statsGeometry, statsMaterial);
	    statsMesh.position.set(10, -4.7, 0);
	    scene.add(statsMesh);
	    myThis.statsMeshes[0] = statsMesh;
	    // data.stats.highestWordStreak
	    var statsMaterial = new THREE.MeshPhongMaterial({color: 0x99FF00});
	    var statsGeometry = new THREE.TextGeometry(data.stats.highestWordStreak, {
		size: 0.6,
		height: 0.1,
		font: 'libre baskerville'
	    });
	    var statsMesh = new THREE.Mesh(statsGeometry, statsMaterial);
	    statsMesh.position.set(10, -5.7, 0);
	    scene.add(statsMesh);
	    myThis.statsMeshes[1] = statsMesh;
	    // data.stats.success
	    var statsMaterial = new THREE.MeshPhongMaterial({color: 0x99FF00});
	    var statsGeometry = new THREE.TextGeometry(data.stats.success, {
		size: 0.6,
		height: 0.1,
		font: 'libre baskerville'
	    });
	    var statsMesh = new THREE.Mesh(statsGeometry, statsMaterial);
	    statsMesh.position.set(10, -6.7, 0);
	    scene.add(statsMesh);
	    myThis.statsMeshes[2] = statsMesh;
	    // data.stats.errors
	    var statsMaterial = new THREE.MeshPhongMaterial({color: 0x99FF00});
	    var statsGeometry = new THREE.TextGeometry(data.stats.errors, {
		size: 0.6,
		height: 0.1,
		font: 'libre baskerville'
	    });
	    var statsMesh = new THREE.Mesh(statsGeometry, statsMaterial);
	    statsMesh.position.set(10, -7.7, 0);
	    scene.add(statsMesh);
	    myThis.statsMeshes[3] = statsMesh;
	    renderer.render(scene, camera);
	}

	//
	// event listeners
	//
	document.addEventListener('mousedown', onDocumentMouseDown, false);

	//
	// socket listeners
	//

	// socket listen quand mot == 25
	socket.on("clearInput", function(data) { 
	    console.log(data.clear);
	    console.log(data.score);
	    if (data.clear == true) {
		myThis.myword = '';
		scene.remove(myThis.mywordMeshes[0]);
		delete(myThis.mywordMeshes[0]);
		renderer.render(scene, camera);
	    }
	});

	// socket listen une fois le submit validé
	socket.on("score", function(data) { 
	    console.log(data.score);
	    myThis.myword = '';
	    scene.remove(myThis.mywordMeshes[0]);
	    delete(myThis.mywordMeshes[0]);
	    

	    // TODO afficher score +XX -XX
	    
	    renderer.render(scene, camera);
	});

	// socket listen toute demande de maj de lettres
	socket.on("updateLetter", function(data) {
	    console.log(data);
	    // on enleve l'ancienne lettre de la scene
	    scene.remove(myThis.meshes[data.meshesPos]);
	    renderer.render(scene, camera);
	    // on cree la nouvelle lettre
	    var mesh = myThis.addLetter(data.letter, data.i, data.j);
	    mesh.name = data.letter;
	    mesh.positionTableI = data.i; 
	    mesh.positionTableJ = data.j; 
	    mesh.positionMeshes = data.meshesPos;
	    // on enleve l'ancienne et on ajoute la nouvelle lettre dans le tableau des meshes
	    myThis.meshes.splice(data.meshesPos, 1, mesh);
	    // on l'affiche sur la scene apres 0.8 sec
	    setTimeout(function(){
		scene.add(mesh);
		renderer.render(scene, camera);
	    }, 800);
	});

	// affichage des statistiques du joueur connecté
	socket.on("stats", function(data) {
/*
	    console.log(data.stats);
	    document.getElementById("stats").innerHTML = 'Statistiques: Score Total: ' + data.stats.score + ' highest Word Streak: ' + data.stats.highestWordStreak + ' Bon mots: ' + data.stats.success + ' Mauvais mots: ' + data.stats.errors;
*/ 
	    updateStats(data);
	});
    }
};