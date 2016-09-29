var bullet = function(direction,vector2){
	if (direction==LEFT){
	this.sprite = document.createElement("img");
	this.sprite.src = "Static Resources/bullet - left.png"
	this.face= 1
	}else{
		this.face = 0
		this.sprite = document.createElement("img");
	this.sprite.src = "Static Resources/bullet - right.png"
	}
	
	this.position = new Vec2();
	this.position.set(vector2.x, vector2.y - 20);
}
bullet.prototype.update = function(deltaTime, direction){
	var bulletSpeed= 1000
	if (this.face==1){
		this.position.x -= bulletSpeed*deltaTime
	}else{
		this.position.x += bulletSpeed*deltaTime
	}
}
bullet.prototype.draw = function(){
	context.drawImage(this.sprite, this.position.x - worldOffSetX, this.position.y);
} 