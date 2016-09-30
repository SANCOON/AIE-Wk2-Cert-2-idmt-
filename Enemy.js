var Enemy = function(x,y){
	
	//define the source for enemy sprite
	this.spriteLeft = document.createElement('img');
	this.spriteLeft.src = "Static Resources/baddie.png";
	//this.spriteLeft.offSet(-59,-83);
	
	this.spriteRight = document.createElement('img');
	this.spriteRight.src = "Static Resources/baddie - Right.png";
	//this.spriteRight.offSet(-59,-83);
	//define variables for where enemy spawns and direction
	this.position = new Vec2();
	this.position.set(1578, 356);
	
	this.velocity = new Vec2();
	this.moveRight= true;
	this.pauseTimer = 0;
}
var ddx =0;
Enemy.prototype.update = function(deltaTime){
	var movespeed = 200;
	if (this.pauseTimer > 0){
		this.pauseTimer-=deltaTime;
	}else{
		var accelX = 0
		
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		
		//platform collision
		cell = cellAtCoord(LAYER_PLATFORMS, tx, ty)
		cellRight = cellAtCoord(LAYER_PLATFORMS, tx +1, ty)
		cellDown = cellAtCoord(LAYER_PLATFORMS, tx, ty+1)
		cellDiag = cellAtCoord(LAYER_PLATFORMS, tx-1 , ty+1)
		
		if (this.moveRight){
			if(cellDiag && !cellRight){
				ddx+=ACCEL
			}else{
				this.velocity.zero()
				ddx =0
				this.pauseTimer = 500
				this.moveRight=false
		}
	}
	
	if (!moveRight){
		if (!cellDown && !cell){
			ddx -= ACCEL
		}else{
			this.velocity.zero()
			this.pauseTimer = 200
			ddx = 0
			this.moveRight= true
		}
		
		this.position.y= Math.floor(this.position.y + (deltaTime*this.velocity.y))
		this.position.x= Math.floor(this.position.x + (deltaTime*this.velocity.x))
		this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDY)
	}
}
}

Enemy.prototype.draw = function(){
	//if (this.moveRight){
		//context.drawImage(this.spriteRight, this.position.x -59, this.position.y-83)
	//}else{
		context.drawImage(this.spriteLeft, this.position.x-59, this.position.y-83)
	//}
}