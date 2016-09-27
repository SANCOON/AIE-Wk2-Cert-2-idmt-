
var Player = function() {	
	this.image = document.createElement("img");
	this.position = new Vec2();
	this.position.set(5*TILE, 0*TILE);
	
	this.width = 159;
	this.height = 163;	
	
	this.offset = new Vec2();
	this.offset.set(-55, -87);
	
	this.velocity = new Vec2();
	
	this.falling = true;
	this.jumping = false;
	
	this.rotation = 0; // hang on, where did this variable come from!

	this.image.src = "hero.png";   
};

Player.prototype.update = function(deltaTime){		
	var left = false;
	var right=false;
	var jump= false;
	var climb = false;
	var descend =false
	//check keypress events
	if (keyboard.isKeyDown(keyboard.KEY_A)==true){
		left=true;
	}
	if (keyboard.isKeyDown(keyboard.KEY_D)==true){
		right = true;
	}
	if (keyboard.isKeyDown(keyboard.KEY_W)==true){
		jump = true;
		climb = true;
	}
	if (keyboard.isKeyDown(keyboard.KEY_S)==true){
		descend=true
	}
	
	var wasLeft = this.velocity.x <0;
	var wasRight = this.velocity.x >0;
	var falling = this.falling
	var ddx =0;
	var ddy = GRAVITY;
	
	if (left){
		ddx=ddx-ACCEL;
	} else if (wasLeft){
		ddx = ddx+FRICTION;
	}
	
	if (right){
		ddx= ddx + ACCEL;
	} else if(wasRight){
		ddx = ddx - FRICTION;
	}
	
	if (jump && !this.jumping && !falling){
		ddy = ddy - JUMP;
		this.jumping=true
	}
	
	
	// calculate the new pos amd vec
	this.position.y = Math.floor(this.position.y + (deltaTime* this.velocity.y));
	this.position.x = Math.floor(this.position.x +(deltaTime*this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime*ddx), -MAXDX, MAXDX);
	this.velocity.y =  bound(this.velocity.y + (deltaTime*ddy), -MAXDY, MAXDY);
	
	if ((wasLeft && (this.velocity.x >0)) || (wasRight && (this.velocity.x<0))){
		// clamp velocity = 0 to stop jiggle
	this.velocity.x =0;
	}
	
		
		//code for collision detect
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE;
	var ny = (this.position.y)%TILE;
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx-1, ty+1);
	var cellladderup = cellAtTileCoord(LAYER_LADDER, tx, ty+1);
	var cellladderdown = cellAtTileCoord(LAYER_LADDER, tx, ty);
	
	//if player has vertical velocity, check to see if they hit a platform below or above, if true then stop vertical velocity & clamp y pos
	if (this.velocity.y >0){
		if (cellladderdown && !descend){
			this.velocity.y=0
		}else if (cellladderdown && climb){
			this.velocity.y = 0
			this.position.y -= 50*deltaTime
		}
		if ((celldown && !cell)||(celldiag && !cellright && nx)){
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
			this.falling=false;
			this.jumping=false;
			ny = 0;
		}
	}else if(this.velocity.y <0) {
		if ((cell && !celldown) || (cellright && !celldiag && nx)){
			this.position.y = tileToPixel(ty+1);
			this.velocity.y = 0; //stop y velocity
			//player is nolonger in that cell, we clamped to cell below
			cell = celldown;
			cellright = celldiag;
			ny = 0;
		}
	}
	 if (cellladderdown && climb && ty >= 0){
		 this.position.y -= 50*deltaTime
	 }
	
	if (this.velocity.x>0){
		if ((cellright && !cell) || (celldiag && !celldown && ny)){
			//clamp x pos to stop moving into platform we just hit
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0; //stop x movement
		}
	}else if (this.velocity.x <0) {
		if ((cell && !cellright)|| (celldown && !celldiag && ny)){
		//clamp x pos to stop moving into platform
		this.position.x = tileToPixel(tx +1);
		this.velocity.x =0; // stop x movement
		}
	}
}


Player.prototype.draw = function()
{
	context.save();			
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);	
	context.restore();	
}