var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_JUMP_RIGHT = 4;
var ANIM_IDLE_RIGHT = 3;
var ANIM_WALK_RIGHT = 5;
var ANIM_CLIMB = 6;
var ANIM_MAX = 6;

var Player = function() {	

	this.sprite = new Sprite("Animation Resources/ChuckNorris.png");
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [8, 9, 10, 11, 12]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [52, 53, 54, 55, 56, 57, 58, 59]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [60, 61, 62, 63, 64]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);

	for(var i=0; i<ANIM_MAX; i++){
		this.sprite.setAnimationOffset(i,-70,-87);
	}
	this.lives = 3
	this.isAlive = true
	
	this.startPos = new Vec2();
	this.startPos.set = (5*TILE, 0*TILE);
	this.position = new Vec2();
	this.position.set(this.startPos.x, this.startPos.y)
	
	this.width = 159;
	this.height = 163;	
	
	this.velocity = new Vec2();
	
	this.falling = true;
	this.jumping = false;
	
	this.direction = LEFT;
};

Player.prototype.update = function(deltaTime){		
	this.sprite.update(deltaTime);
	
	var left = false;
	var right = false;
	var jump = false;
	var climb = false;
	var descend = false
	
	var wasLeft = this.velocity.x <0;
	var wasRight = this.velocity.x >0;
	var falling = this.falling
	var ddx =0;
	var ddy = GRAVITY;
	
	//code for collision detect
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE;
	var ny = (this.position.y)%TILE;
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx-1, ty+1);
	var cellladderdown = cellAtTileCoord(LAYER_LADDER, tx, ty);
	
	//check keypress events
	if (keyboard.isKeyDown(keyboard.KEY_A) == true){
		left = true;
		this.direction=LEFT
		if (this.sprite.currentAnimation != ANIM_WALK_LEFT && !this.jumping && !this.falling && !cellladderdown){
			this.sprite.setAnimation(ANIM_WALK_LEFT);
		}
	}else if (keyboard.isKeyDown(keyboard.KEY_D) == true){
		right = true;
		this.direction = RIGHT
		if (this.sprite.currentAnimation != ANIM_WALK_RIGHT && !this.jumping && !this.falling && !cellladderdown){
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
		}
	}else{
		if (this.direction == LEFT && !this.jumping && !this.falling && (this.sprite.currentAnimation != ANIM_IDLE_LEFT) && !cellladderdown){
			this.sprite.setAnimation(ANIM_IDLE_LEFT);
		}else{ 
		if(this.direction == RIGHT && !this.jumping && !this.falling&&(this.sprite.currentAnimation != ANIM_IDLE_RIGHT)&& !cellladderdown)
			this.sprite.setAnimation(ANIM_IDLE_RIGHT);
		}
	}
	
	
	
	if (keyboard.isKeyDown(keyboard.KEY_S) == true){
		descend = true
	}
	

	
	if (left){
		ddx = ddx - ACCEL;
	} else if (wasLeft){
		ddx = ddx + FRICTION;
	}
	
	if (right){
		ddx = ddx + ACCEL;
	} else if(wasRight){
		ddx = ddx - FRICTION;
	}
	
	if (keyboard.isKeyDown(keyboard.KEY_W) == true){
		jump = true;
		climb = true;
		
	}
	
	if (jump && !this.jumping && !falling){
		ddy = ddy - JUMP;
		this.jumping = true;
		if ((this.direction==LEFT) && (!cellladderdown) ){
			this.sprite.setAnimation(ANIM_JUMP_LEFT);
		}else if (this.direction == RIGHT && !cellladderdown){
			this.sprite.setAnimation(ANIM_JUMP_RIGHT);
		}
	}
	
	if (cellladderdown && !climb){
		if (this.direction == LEFT && this.sprite.currentAnimation != ANIM_IDLE_LEFT){
			this.sprite.setAnimation(ANIM_IDLE_LEFT)
		} else if (this.direction == RIGHT && this.sprite.currentAnimation != ANIM_IDLE_RIGHT){
			this.sprite.setAnimation(ANIM_IDLE_RIGHT)
		}
	}
	
	
	
	// calculate the new pos amd vec
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x +(deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocity.y =  bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
	
	if ((wasLeft && (this.velocity.x > 0)) || (wasRight && (this.velocity.x < 0))){
		// clamp velocity = 0 to stop jiggle
	this.velocity.x = 0;
	}
	
	//if player has vertical velocity, check to see if they hit a platform below or above, if true then stop vertical velocity & clamp y pos
	if (this.velocity.y > 0){
		if (cellladderdown && !descend){
			this.velocity.y = 0
		}else if (cellladderdown && climb){
			this.velocity.y = 0
			this.position.y -= 100*deltaTime
		}
		if ((celldown && !cell)||(celldiag && !cellright && nx)){
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
			this.falling = false;
			this.jumping = false;
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
	
	if (this.velocity.x > 0){
		if ((cellright && !cell) || (celldiag && !celldown && ny)){
			//clamp x pos to stop moving into platform we just hit
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0; //stop x movement
		}
	}else if (this.velocity.x < 0) {
		if ((cell && !cellright)|| (celldown && !celldiag && ny)){
		//clamp x pos to stop moving into platform
		this.position.x = tileToPixel(tx +1);
		this.velocity.x = 0; // stop x movement
		}
	}
	
	if (this.position.y > canvas.height){
		this.onDeath();
	}
	
	var bullets =[];
	
	if (keyboard.isKeyDown(keyboard.KEY_SPACE)){
		var Bullet = new bullet
		Bullet.update(this.position, deltaTime)
		Bullet.draw()
	}
}

Player.prototype.respawn=  function(){
	this.position.set(this.startPos.x, this.startPos.y)
}

Player.prototype.onDeath= function(){
	this.lives --;
	
	if (this.lives >= 0){
	this.respawn();
	}else{
		this.isAlive=false
		this.lives=0
	}
}


Player.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x, this.position.y)
}