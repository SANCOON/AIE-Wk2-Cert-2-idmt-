var bullet = function(){
	this.sprite = document.createElement("img");
	this.sprite.src = "Static Resources/bullet.png"
}
bullet.prototype.update = function(vector2, deltaTime){
	this.position = new Vec2();
	this.position.set(vector2.x, vector2.y);
}
bullet.prototype.draw = function(){
	this.draw(context, this.position.x, this.position.y);
}