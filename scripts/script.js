// variaveis
var matrix = [];
var keyWord = '[ARESTAS]';
var stats;
var gui;

//Função para ler o arquivo
function readSingleFile(evt) {
	var f = evt.target.files[0];

	if (f) {
		matrix = [];
		var r = new FileReader();
		var contents = 'empty';
		r.onload = function(e) {
			contents = e.target.result;
			var pastKey = false;
			contents.split('\n').forEach(function(line, i) {
				if (pastKey) {
					var vals = line.trim().split(' ');
					if (vals.length > 2) {
						matrix.push(vals);
					}
				}
				if (line.trim() === keyWord) {
					pastKey = true;
				}
			})
			update();
		}
		r.readAsText(f);
	} else {
		alert("Failed");
	}
}

document.getElementById('fileinput').addEventListener('change', readSingleFile, false);

window.addEventListener('DOMContentLoaded', function() {
	update();
});

// get the canvas DOM element
var canvas = document.getElementById('renderCanvas');

// load the 3D engine
var engine = new BABYLON.Engine(canvas, true);
//var engine = new BABYLON.Engine(canvas, false,{ antialias: false, preserveDrawingBuffer: true, limitDeviceRatio:1.0, generateDepthBuffer: false, generateMipMaps: false, samplingMode: 2 },false);
	
//Função que sobrescreve a função de câmera para que o zoom passe da origem sem inverter a mesma
/*
BABYLON.ArcRotateCamera.prototype._getViewMatrix = function() {
	// Compute
	var cosa = Math.cos(this.alpha);
	var sina = Math.sin(this.alpha);
	var cosb = Math.cos(this.beta);
	var sinb = Math.sin(this.beta);

	if (sinb === 0) {
		sinb = 0.0001;
	}

	var target = this._getTargetPosition();
	target.addToRef(new BABYLON.Vector3(this.radius * cosa * sinb,
			this.radius * cosb, this.radius * sina * sinb),
			this._newPosition);
	if (this.getScene().collisionsEnabled && this.checkCollisions) {
		this._collider.radius = this.collisionRadius;
		this._newPosition.subtractToRef(this.position,
				this._collisionVelocity);
		this._collisionTriggered = true;
		this.getScene().collisionCoordinator.getNewPosition(
				this.position, this._collisionVelocity,
				this._collider, 3, null,
				this._onCollisionPositionChange, this.uniqueId);
	} else {
		this.position.copyFrom(this._newPosition);
		var up = this.upVector;
		if (this.allowUpsideDown && this.beta < 0) {
			up = up.clone();
			up = up.negate();
		}
		if (this.radius < 0) {
			var vec = this.position.subtract(target);
			vec.normalize();

			BABYLON.Matrix.LookAtLHToRef(this.position,
					this.position.add(vec), up, this._viewMatrix);
		} else {
			BABYLON.Matrix.LookAtLHToRef(this.position, target, up,
					this._viewMatrix);
		}
		this._viewMatrix.m[12] += this.targetScreenOffset.x;
		this._viewMatrix.m[13] += this.targetScreenOffset.y;
	}
	return this._viewMatrix;
};
*/

//Função do DAT.GUI
var initGui = function(axis, grid, cluster){
	if (gui)
		gui.destroy();
	//Inicia
	gui = new dat.GUI();
	//Cria uma pasta
	var folder = gui.addFolder('Axis options');
	//Mantem a pasta aberta no inicio
	folder.open();
	//Adiciona à pasta as opções
	folder.add(axis, 'size', 10, 1000).name("Axis size").step(10).onChange(function(){
		axis.updateAxis();
	});
	folder.add(axis, 'displayAxisX').name("Show axis X").onChange(function(){
		axis.showAxisX();
	});
	folder.add(axis, 'displayAxisY').name("Show axis Y").onChange(function(){
		axis.showAxisY();
	});
	folder.add(axis, 'displayAxisZ').name("Show axis Z").onChange(function(){
		axis.showAxisZ();
	});

	//Cria outra pasta
	folder = gui.addFolder('Plane options');
	//Mantem a pasta aberta no inicio
	folder.open();
	//Adiciona à pasta as opções
	folder.add(grid, 'size', 20, 2000).name("Plane size").step(20).onChange(function(){
		grid.updateGrid();
	});
	folder.add(grid, 'displayGroundXZ').name('Show XZ plane').onChange(function(){
		grid.showGroundXZ();
	});
	folder.add(grid, 'displayGroundYZ').name('Show YZ plane').onChange(function(){
		grid.showGroundYZ();
	});
	folder.add(grid, 'displayGroundXY').name('Show XY plane').onChange(function(){
		grid.showGroundXY();
	});
	folder.add(grid, 'gridOpacity', 0.05, 0.95).name('Grid Opacity').step(0.05).onChange(function(){
		grid.updateGridOpacity();
	});

	//Cria outra pasta 
	folder = gui.addFolder('Cluster options');
	folder.open();
	folder.add(cluster, 'sphereRadius', 2, 20).name("Sphere Radius").step(1).onChange(function(){
		cluster.updateSphere();
	});
	folder.add(cluster, 'cylinderRadius', 1, 10).name("Cylinder Radius").step(1).onChange(function(){
		cluster.updateCylinder();
	});
	folder.add(cluster, 'displayCylinder').name("Show Cylinders").onChange(function(){
		cluster.showCylinder();
	});
}
	
var initStats = function(){
	//if (stats)
	//	stats = null;
	stats = new Stats();
	stats.setMode( 1 );
	document.body.appendChild( stats.domElement );
}

function update() {
	//Função que cria a cena e retorna a mesma
	var createScene = function() {
		//Cria a cena
		var scene = new BABYLON.Scene(engine);
		//scene.debugLayer.show();

		//Cria uma camera e seta a posição da mesma
		var camera = new BABYLON.ArcRotateCamera("camera1",
				Math.PI / 12, 5 * Math.PI / 20, 10 * Math.PI,
				new BABYLON.Vector3(100, 100, 100), scene);
		//Seta a camera para olhar para a origem
		camera.setTarget(BABYLON.Vector3.Zero());

		//Controle da camera
		camera.attachControl(canvas, false);

		//Cria a iluminação apontando para 0, 1, 0 (vindo do eixo y)
		var light = new BABYLON.HemisphericLight('light1',
				camera.position, scene);
		
		//Chama as classes que desenham o eixo, grid e clusters
		var axis = new generateAxis(scene);
		var grid = new generateGrid(scene);
		var cluster = new generateCluster(scene, matrix);

		//Inicializa o dat.GUI
		initGui(axis, grid, cluster);
		
		//Inicializa o Stats
		initStats();

		matrix = null;

		//Retorna a cena
		return scene;
	}
	
	//Chama função que cria a cena
	var scene = createScene();

	//Roda o loop de renderização
	engine.runRenderLoop(function() {
		scene.render();
		stats.update();
	});

	//A janela/canvas faz um resize dependendo do tamanho da tela
	window.addEventListener('resize', function() {
		engine.resize();
	});
}
