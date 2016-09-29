var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var LAYER_COUNT = 4;
var LAYER_PLATFORMS = 0;
var LAYER_LADDER = 1;
var MAP =  {tw: 60, th:15};
var TILE = 35;
//images are twice the size as our map's grid so we have to multiply to get a usable size
var TILESET_TILE = TILE*2;

var TILESET_PADDING=2;
var TILESET_SPACING =2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var tileset = document.createElement("img");
tileset.src = "Level and Tileset/tileset.png"

function cellAtPixelCoord(layer, x,y){
	if ( x>SCREEN_WIDTH || y<0){
		return 1;
		//let the player drop off the bottom of screen
	}
	if (y>SCREEN_HEIGHT){
		return 0;
	}
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx,ty){
	if( tx>MAP.tw || ty<0){
		return 1;
	}
	if (ty>= MAP.th){
		return 0;
	}
	return cells[layer][ty][tx];
};

function tileToPixel(tile){
	return tile*TILE;
};
function pixelToTile(pixel){
	return Math.floor(pixel/TILE);
}

function bound(value, min, max){
	if (value<min){
		return min;
	};
	
	if (value> max){
		return max;
	};
	return value
}
var worldOffSetX=0
function drawMap(){
	
	var startX = -1;
	var maxTiles = Math.floor(SCREEN_WIDTH/TILE)+2;
	var tileX = pixelToTile(player.position.x);
	var offsetX = TILE + Math.floor(player.position.x % TILE);
	
	startX = tileX - Math.floor(maxTiles/2);
	
	if (startX<-1){
		startX = 0
		offsetX = 0;
	}
	if (startX> MAP.tw - maxTiles){
		startX = MAP.tw - maxTiles +1
		offsetX=TILE
	}
	
	worldOffSetX = startX*TILE+offsetX;
	
	for(var layerIdx=0; layerIdx<LAYER_COUNT;layerIdx++){
		for (var y =0; y<level1.layers[layerIdx].height; y++){
			var idx= y*level1.layers[layerIdx].width + startX
			for (var x=startX; x<level1.layers[layerIdx].width; x++){
				if (level1.layers[layerIdx].data[idx] !=0){
					// the tiles in the mat are base 1(value of zero), so subtract one from the tileset ID
					//to get the correct tile
					var tileIndex = level1.layers[layerIdx].data[idx]-1;
					var sx = TILESET_PADDING +(tileIndex%TILESET_COUNT_X)*(TILESET_TILE+TILESET_PADDING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex/TILESET_COUNT_X))*(TILESET_TILE +TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE,TILESET_TILE, (x-startX) *TILE - offsetX, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}

var player;
var keyboard = new Keyboard();

var cells = []; //the array that holds our simplified collision data

var musicBackground
var sfxShoot

function initialize(){
	for (var layerIdx = 0; layerIdx < LAYER_COUNT ; layerIdx++){	// initialize collision map
		cells[layerIdx] = [];
		var idx =0;
		for (var y =0; y < level1.layers[layerIdx].height; y++){
			cells [layerIdx][y]=[];
			for (var x=0; x <level1.layers[layerIdx].width; x++){
				if (level1.layers[layerIdx].data[idx] !=0){
					// for each tile we find in the layer data we ned to create 4 collisions bec collision squrs are 35*35 and tiles are 70*70
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1]= 1;
					cells[layerIdx][y][x+1] = 1;
				}else if(cells[layerIdx][y][x] !=1){
					//if a cell hasnt been set a value we give it a zero
					cells[layerIdx][y][x] = 0;
				}
				idx++
			}
		}
	} player = new Player();
	
	musicBackground = new Howl({
		urls: ["Audio Resources/background.ogg"],
		loop: true,
		buffer: true,
		volume: 0.5
	});
	musicBackground.play();
	
	sfxShoot = new Howl({
		urls: ["Audio Resources/fireEffect.ogg"],
		loop: false,
		bufffer:false,
		volume: 0.75
	})
	
}

// load an image to draw
var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";

var METER = TILE;
var GRAVITY = METER*9.8*6;
var MAXDX = METER*10;
var MAXDY = METER*15;
var ACCEL = MAXDX*2;
var FRICTION = MAXDX*6;
var JUMP = METER*1500;

var heartImage = document.createElement("img")
heartImage.src = "Static Resources/heart.png"

function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	player.update(deltaTime);
	player.draw();
	drawMap();
	
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	
	context.font = "Bold Italic 24px Arial";
	context.fillText("Lives:", 5,35,100)
	
	for (var i = 0; i< player.lives; i++){
		context.drawImage(heartImage, 80 +((heartImage.width+2)*i),10)
	}
}

initialize();
//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
