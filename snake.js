let gc = document.getElementById("mainc");
ctx = gc.getContext("2d");



gc.width =  300
gc.height = 300

//colors
const col1 = "#EAEAEA"
const col2 = "#CBC5EA"
const col3 = "#73628A"
const col4 = "#313D5A"
const col5 = "#F0A202"
const col6 = "#FF5A5F"

const playerheadcolor = col1
const applecolor = col6
const bodycolor = col2
const backgroundcolor = col4
const mapcolor = col3
const gridcolor = col4


//gc.style.background = mapcolor 
document.body.style.backgroundColor = backgroundcolor
let container = document.getElementById("container")
container.style.backgroundColor = backgroundcolor


var whole_step = 30
var g_size = 28
var offset = (whole_step-g_size)/2
let gameover = 0
let gameloopreq

var paused = 0
class Player{
	constructor(x,y,lastx, lasty,size,dir){
		this.x = x; //grid cell
		this.y = y; //grid cell
		this.lastx = lastx
		this.lasty = lasty
		this.size = size;
		this.dir = dir;
	}
}
//init of player
player = new Player(0,0,0,0,0,"right")

class BodyPart{
	constructor(x,y, lastx, lasty){
		this.x = x;
		this.y = y;
		this.lastx = lastx
		this.lasty = lasty
	}
}

let body = new Array()

class Apple{
	constructor(x,y){
		this.x = x
		this.y = y
	}
}

apple = new Apple(5,4)
//rand_pos()

addEventListener("keydown", (event) => {

		console.log(event.key)
	switch(event.key){
		case 'w':
			if(player.dir != "down") player.dir = "up"
			break;
		case 's':
			if(player.dir != "up")player.dir = "down"	
			break;
		case 'a':
			if(player.dir != "right")player.dir = "left"	
			break;
		case 'd':
			if(player.dir != "left")player.dir = "right"
			break;
		case 'Escape':
			if(!paused){
				window.cancelAnimationFrame(gameloopreq)
			}
			else if (paused){
				gameloopreq = window.requestAnimationFrame(gameLoop)
			}
			paused = !paused;
			break;
		case 'R':
			resetGame()	
			break; 
		case 't':
			gameover = 1	
			break; 
		default:
			break;
	}
});

function update_pos(){
	if(player.dir == "right") player.x+=1;
	if(player.dir == "left") player.x-=1;
	if(player.dir == "down") player.y+=1;
	if(player.dir == "up") player.y-=1;


	if(player.x>=10)player.x=0;
	if(player.x<0)player.x=10;
	if(player.y>=10)player.y=0;
	if(player.y<0)player.y=10;
}

function update_body() {
	
	if(body.length > 0){
		body[0].x=player.lastx;
		body[0].y=player.lasty;
		for(let i = 1; i<= body.length-1; i++){
			body[i].x=body[i-1].lastx;
			body[i].y=body[i-1].lasty;
		}

	}
	
}

function score_effect(){
    	let originalShadow = getComputedStyle(container).boxShadow;
	container.style.boxShadow = "0px 0px 30px 1px rgba(255,255,255,0.3)"
	container.addEventListener("transitionend", function resetShadow() {
        container.style.boxShadow = originalShadow;
    }, { once: true });
}

function pos_check(){

	if(player.x == apple.x && player.y == apple.y) {player.size++; body.push(new BodyPart(player.lastx, player.lasty)); rand_pos(); 
	score_effect()
	}

	if(body.length>0){
		for(let i = 1;i<=body.length-1;i++){
			if(player.x == body[i].x && player.y == body[i].y) gameover=1 
		}
	}
}
	
function draw_body(){
	if(body.length>0){
	ctx.fillStyle=bodycolor
	for(let i = 0; i<= body.length-1; i++){
		ctx.globalAlpha = 1 - (i / body.length) * 0.7;
		ctx.beginPath()
		ctx.roundRect((body[i].x*whole_step)+offset, (body[i].y*whole_step)+offset, g_size, g_size, [10]);
		ctx.fill()
		}
	}
 ctx.globalAlpha = 1;
}

function rand_pos(){
	let isValid = false;
  let x, y;

  // Keep trying until we find valid coordinates
  while (!isValid) {
    // Generate random coordinates between 0 and 10
    x = Math.floor(Math.random() * 10); // x between 0 and 10
    y = Math.floor(Math.random() * 10); // y between 0 and 10

    // Check if the apple collides with any body part or player position
    isValid = true;

    // Check if apple position is the same as player or any body part
    if ((player.x === x && player.y === y)) {
      isValid = false; // Collision with player
    } else {
      for (let part of body) {
        if (part.x === x && part.y === y) {
          isValid = false; // Collision with body part
          break;
        }
      }
    }
	
}
apple.x = x;
apple.y = y;
}

function update(){
	//update player
	update_pos()

	//update body
	update_body();

	pos_check()

	player.lastx = player.x
	player.lasty = player.y
	if(body.length > 0){
		for(let i = 0; i<= body.length-1; i++){
			body[i].lastx = body[i].x
			body[i].lasty = body[i].y
		}
	}


}

function draw(){
	ctx.clearRect(0,0,gc.width,gc.height);

	//draw grid
	ctx.fillStyle = gridcolor
	for(let i = 0; i<=gc.width; i+=whole_step){
		for(let j = 0; j<=gc.height; j+=whole_step){
			if((i==0 && j==0) || (i==0 && j==gc.height) || (i==gc.width && j==0) || (i ==gc.width && j==gc.height)){continue}
		ctx.fillRect((i-offset),(j-offset),2*offset,2*offset)
		}
	}
	//draw player
	ctx.fillStyle=playerheadcolor
	ctx.beginPath()
	ctx.roundRect((player.x*whole_step)+offset, (player.y*whole_step)+offset, g_size, g_size, [10]);
	ctx.fill()


	//draw apple
	ctx.fillStyle = applecolor
	ctx.beginPath()
	ctx.roundRect((apple.x*whole_step)+offset, (apple.y*whole_step)+offset, g_size, g_size, [10]);
	ctx.fill()

	draw_body()
}



// The proper game loop
let lastTime = 0; // To track the last time the frame was updated
let frameRate = 6; // Desired frame rate (frames per second)
let frameDuration = 1000 / frameRate; // Duration of each frame in millisecondswindow.
gameloopreq = requestAnimationFrame(gameLoop);

function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime; // Calculate time difference from last frame
    
    if (deltaTime >= frameDuration) {
        // If enough time has passed, update the game state and render
        lastTime = timeStamp; // Update lastTime to current time
        update(); // Your game update logic here
        draw(); // Your game drawing logic here



    }
    // Continue the loop, without updating every time.
    if(!gameover){gameloopreq = window.requestAnimationFrame(gameLoop);}
	else{gameOver()}
	
}


function gameOver(){
	//alert("game over")
	//window.cancelAnimationFrame(gameloopreq)
	ctx.fillStyle = "rgba(0,0,0,0.5)" 
	ctx.beginPath()	
	ctx.roundRect(0,0,gc.width,gc.height,[10])
	ctx.fill()

	ctx.fillStyle = "white"
	ctx.font = "48px consolas";
	ctx.fillText("game over", 32,gc.height/2+10);

	ctx.font = "24px consolas"
	ctx.fillText("score: "+player.size , 32, gc.height/2+50)
	ctx.fillText("'R' to restart" , 32, gc.height/2+80)

}


function resetGame(){
	player.x = 0
	player.y = 0
	player.lastx=0
	player.lasty=0
	player.size = 0
	player.dir="right"

	apple.x=5
	apple.y=4

	paused=0
	gameover=0

	body = []

	gameloopreq = window.requestAnimationFrame(gameLoop)
}
