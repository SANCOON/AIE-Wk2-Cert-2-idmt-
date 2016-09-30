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
	this.position.set(600, 356);
	//this.position.set(100,100);
	
	this.velocity = new Vec2();
	this.moveRight= true;
	this.pauseTimer = 0;
	this.alive = true
	this.deathByBullet = false
	this.deathTime=0
	this.health = 50
}
var ddx =0;
var ddy = 35*9.8*6

Enemy.prototype.update = function(deltaTime){
	var currentTime = Date.now()
	var deathByFalling = false
	if (this.pauseTimer>0){
		this.pauseTimer -= deltaTime
	}else{
		var ddx =0;
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE
		var ny=(this.position.y)%TILE
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx,ty);
		var cellRight = cellAtTileCoord(LAYER_PLATFORMS, tx+1,ty);
		var cellDown = cellAtTileCoord(LAYER_PLATFORMS, tx,ty+1);
		var cellDiag = cellAtTileCoord(LAYER_PLATFORMS, tx+1,ty+1);
		
		console.log("Enemy cell height: " + ty);
		console.log("Enemy cell x: " + tx);
		
		if(this.moveRight){
			if(cellDiag &&!cellRight){
				ddx=ddx+ACCEL;
			}else{
				this.velocity.x=0
				this.moveRight=false
				this.pause = 1;
			}
		}
		if(!this.moveRight ){
			if(cellDown&&!cell&& tx !=0){
				ddx = ddx-ACCEL
			}else{
				this.velocity.x = 0
				this.moveRight = true
				this.pause = 1
			}
		}
		this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
		this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
		this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
		this.velocity.y = bound(this.velocity.y + (deltaTime*ddy), -MAXDY, MAXDY)
		if (cellDown){
			this.velocity.y =0
		}
		if (this.position.y > canvas.height){
			this.alive=false;
			deathByFalling = true;
		}
	}
	if (!this.alive && deathByFalling){
		this.position.set(600,356)
		deathByFalling=false
		this.alive=true
	}
	if (!this.alive && this.deathByBullet && currentTime-this.deathTime>5000){
		this.position.set(600,356)
		deathByFalling=false
		deathByBullet=false
		this.alive=true
		this.health = 50
	}
}

Enemy.prototype.draw = function(){
	if (this.alive){
	if (this.moveRight){
		context.drawImage(this.spriteRight, this.position.x -59-worldOffSetX, this.position.y-83)
	}else{
		context.drawImage(this.spriteLeft, this.position.x-59-worldOffSetX, this.position.y-83)
	}
}}