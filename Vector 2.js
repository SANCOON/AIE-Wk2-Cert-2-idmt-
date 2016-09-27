var Vec2 = function(){
	this.x =0;
	this.y =0;
}

Vec2.prototype.copy = function(){
	var newVec = new Vec2();
	newVec.x = this.x;
	newVec.y = this.y;
	return newVec;
}

Vec2.prototype.set = function(x,y){
	this.x = x;
	this.y=y;
}

Vec2.prototype.zero = function(){
	this.x=0;
	this.y=0;
}

Vec2.prototype.normalize = function(){
	var magnitude = (this.x * this.x) + (this.y * this.y);
	if (magnitude !=0){
		var oneOverMag = 1 / Math.sqrt(magnitude);
		this.x = oneOverMag;
		this.y = oneOverMag;
	}
}

Vec2.prototype.add = function(v2) {
	this.x += v2.x;
	this.y += v2.y;
}

Vec2.prototype.subtract = function(v2){
	this.x -= v2.x;
	this.y -= v2.y;
}

Vec2.prototype.multiplyScalar = function(F){
	this.x *= F;
	this.y *= F;
}