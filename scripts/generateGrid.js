generateGrid = function(scene){

	this.size = 200;
	this.displayGroundXZ = true;
	this.displayGroundYZ = true;
	this.displayGroundXY = true;

	this.scene = scene;
	
	this.groundMaterial = new BABYLON.GridMaterial("this.groundMaterial", this.scene);
	this.groundMaterial.gridRatio = 1;
	this.groundMaterial.backFaceCulling = false;
	this.groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
	this.groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
	this.groundMaterial.opacity = 0.9;

	//Cria os três planos e seta o material para ser grid (como se fosse uma textura)
	this.groundXZ = BABYLON.Mesh.CreateGround("groundXZ", this.size,
			this.size, 2, this.scene);
	this.groundXZ.material = this.groundMaterial;
	this.groundYZ = BABYLON.Mesh.CreateGround("groundYZ", this.size,
			this.size, 2, this.scene);
	this.groundYZ.material = this.groundMaterial;
	this.groundYZ.rotation.z = Math.PI / 2;
	this.groundXY = BABYLON.Mesh.CreateGround("groundXY", this.size,
			this.size, 2, this.scene);
	this.groundXY.material = this.groundMaterial;
	this.groundXY.rotation.x = -Math.PI / 2;
};

generateGrid.prototype.updateGrid = function() {
	this.groundXZ.scaling = new BABYLON.Vector3(this.size/200, this.size/200, this.size/200);
	this.groundYZ.scaling = new BABYLON.Vector3(this.size/200, this.size/200, this.size/200);
	this.groundXY.scaling = new BABYLON.Vector3(this.size/200, this.size/200, this.size/200);
};

generateGrid.prototype.showGroundXZ = function() {
	if (this.displayGroundXZ == false)
		this.groundXZ.dispose();
	else {
		this.size = 200;
		this.groundXZ = BABYLON.Mesh.CreateGround("groundXZ", this.size,
			this.size, 2, this.scene);
		this.groundXZ.material = this.groundMaterial;
	}
};

generateGrid.prototype.showGroundYZ = function() {
	if (this.displayGroundYZ == false)
		this.groundYZ.dispose();
	else {
		this.size = 200;
		this.groundYZ = BABYLON.Mesh.CreateGround("groundYZ", this.size,
			this.size, 2, this.scene);
		this.groundYZ.material = this.groundMaterial;
		this.groundYZ.rotation.z = Math.PI / 2;
	}
};

generateGrid.prototype.showGroundXY = function() {
	if (this.displayGroundXY == false)
		this.groundXY.dispose();
	else {
		this.size = 200;
		this.groundXY = BABYLON.Mesh.CreateGround("groundXY", this.size,
			this.size, 2, this.scene);
		this.groundXY.material = this.groundMaterial;
		this.groundXY.rotation.x = -Math.PI / 2;
	}
};
