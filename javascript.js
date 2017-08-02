function init(){
	
	//Array to keep track of all bugs and food currently in the game
	bugs_array = [];
	food_array = [];
	
	//index for the closest food for a given bug
	index = 0;
	current = 0;
	
	//Timer variable
	time = 0;
	
	//Boolean for pausing the game
	gamePaused = false; 
	
	//run add an event listener for pressing a key
	document.addEventListener("keydown", keyDown, false); 
	
	//generate the food
	generate_food();
	
	//run the draw function every 30 milliseconds
	game = setInterval(draw, 30); 
	
	//Make a bug every 1 - 3 seconds
	bug_creator = setInterval(generate_bug, Math.floor(Math.random()*2000)+1000);
	
	//Run timer every second
	game_timer = setInterval (timer, 1000);
}

//Bug class
function bug (x, y, index, type, shortest){
		this.x = x;
		this.y = y;
		this.index = index;
		this.type = type;
		this.shortest = shortest;
	}
	
//Food class
function food (x, y, index){
		this.x = x;
		this.y = y;
		this.index = index;
	}


//distance formula, not sure if it's working	
function distance (x1, y1, x2, y2){
	var a = x1 - x2;
	var b = y1 - y2;
	return Math.sqrt(a*a + b*b);
}

//get the index of the food that is closest to the bug
function shortest_to_bug(bug_x, bug_y, shortest){
	
	index = 0;
	current = distance(bug_x, bug_y, food_array[shortest].x, food_array[shortest].y);
	
	for (var i = 0; i < food_array.length; i++){
		if (distance(bug_x, bug_y, food_array[i].x, food_array[i].y) < current)
		{
			current = distance(bug_x, bug_y, food_array[i].x, food_array[i].y);
			index = i;
		}
	}
	return index;
}
	
//Create a new bug, will call this periodically
function generate_bug(){
	new_bug = new bug (Math.floor(Math.random()*(990 - 10 + 1)) + 10, 0, bugs_array.length, Math.floor(Math.random()*9), 0);
	new_bug.shortest = shortest_to_bug(new_bug.x, new_bug.y, 0);
	bugs_array.push(new_bug);
}

//Create the food, will only be called once at the beginning of the game
function generate_food(){
	for (var i = 0; i < 5; i++){
		new_food = new food(Math.floor(Math.random()*(990 - 10 + 1)) + 10, Math.floor(Math.random()*(580 - 100 + 1)) + 10, food_array.length);
		food_array.push(new_food);
	}
}

//Generate only one pieec of food for testing
function generate_food_test(){
	new_food = new food(Math.floor(Math.random()*(990 - 10 + 1)) + 10, Math.floor(Math.random()*(580 - 100 + 1)) + 10, food_array.length);
	food_array.push(new_food);
}

function draw(){
	//Get the canvas DOM
	var c = document.getElementById("myCanvas"); 
	var ctx = c.getContext("2d");

	//Clearing the entire canvas
	ctx.clearRect(0, 0, 1000, 600); 
	
	for (var i = 0; i < bugs_array.length; i++){
		if (bugs_array[i].type < 3){ //Black bug
			ctx.fillStyle = 'black';
			ctx.fillRect(bugs_array[i].x, bugs_array[i].y, 10, 40);
			
			if (bugs_array[i].x < food_array[bugs_array[i].shortest].x){ //Bug movement
				bugs_array[i].x += 3;
			}
			if (bugs_array[i].x > food_array[bugs_array[i].shortest].x){
				bugs_array[i].x -= 3;
			}
			if (bugs_array[i].y < food_array[bugs_array[i].shortest].y){
				bugs_array[i].y += 3;
			}
			if (bugs_array[i].y > food_array[bugs_array[i].shortest].y){
				bugs_array[i].y -= 3;
			}	
		}
		
		else if (bugs_array[i].type >= 3 && bugs_array[i].type < 6){ //Red bug
			ctx.fillStyle = 'red';
			ctx.fillRect(bugs_array[i].x, bugs_array[i].y, 10, 40);
			
			if (bugs_array[i].x < food_array[bugs_array[i].shortest].x){ //Bug movement
				bugs_array[i].x += 2;
			}
			if (bugs_array[i].x > food_array[bugs_array[i].shortest].x){
				bugs_array[i].x -= 2;
			}
			if (bugs_array[i].y < food_array[bugs_array[i].shortest].y){
				bugs_array[i].y += 2;
			}
			if (bugs_array[i].y > food_array[bugs_array[i].shortest].y){
				bugs_array[i].y -= 2;
			}	
		}
		else if (bugs_array[i].type >= 6 && bugs_array[i].type < 10){ //Orange bug
			ctx.fillStyle = 'orange';
			ctx.fillRect(bugs_array[i].x, bugs_array[i].y, 10, 40);
			
			if (bugs_array[i].x < food_array[bugs_array[i].shortest].x){ //Bug movement
				bugs_array[i].x += 1;
			}
			if (bugs_array[i].x > food_array[bugs_array[i].shortest].x){
				bugs_array[i].x -= 1;
			}
			if (bugs_array[i].y < food_array[bugs_array[i].shortest].y){
				bugs_array[i].y += 1;
			}
			if (bugs_array[i].y > food_array[bugs_array[i].shortest].y){
				bugs_array[i].y -= 1;
			}			
		}
		
		if (bugs_array[i].x <= food_array[bugs_array[i].shortest].x + 3 && bugs_array[i].x >= food_array[bugs_array[i].shortest].x - 3 && 
			bugs_array[i].y <= food_array[bugs_array[i].shortest].y + 3 && bugs_array[i].y >= food_array[bugs_array[i].shortest].y - 3) //If bug eats food
			{
				food_array.splice(bugs_array[i].shortest, 1);
				
				if (food_array.length == 0){ //Check to see if the last food has been eaten, if it has, run the game_over function to signal the player has lost
					game_over();
					return;
				}
				
				for (var j = 0; j < bugs_array.length; j++){
					bugs_array[j].shortest = shortest_to_bug(bugs_array[j].x, bugs_array[j].y, 0);					
				}
			}
	}

	for (var i = 0; i < food_array.length; i++){
		ctx.beginPath();
		ctx.arc(food_array[i].x,food_array[i].y,10,0,2*Math.PI);
		
		//Testing distance formula by color coding the circle with their index 
		
		if (i == 0){
			ctx.fillStyle="black";
			ctx.fill();
		}
		if (i == 1){
			ctx.fillStyle="red";
			ctx.fill();
		}
		if (i == 2){
			ctx.fillStyle="blue";
			ctx.fill();
		}
		if (i == 3){
			ctx.fillStyle="green";
			ctx.fill();
		}
		if (i == 4){
			ctx.fillStyle="orange";
			ctx.fill();
		}
	}
}

//Game over kill screen, need to implement a way to restart the game
function game_over(){
	game = clearInterval(game);
	game_timer = clearInterval(game_timer);
	
	var c = document.getElementById("myCanvas"); 
	var ctx = c.getContext("2d");
	
	ctx.clearRect(0, 0, 1000, 600);
	
	ctx.font="100px Georgia";
	ctx.fillText("Game Over!",220,300);
}

//Function for the timer
function timer(){
	document.getElementById("myTimer").innerHTML = "Time: " + time;
	time++;
	if (time == 60){
		game_win();
	}
}

function game_win(){
	game = clearInterval(game);
	game_timer = clearInterval(game_timer);
	
	var c = document.getElementById("myCanvas"); 
	var ctx = c.getContext("2d");
	
	ctx.clearRect(0, 0, 1000, 600);
	
	ctx.font="100px Georgia";
	ctx.fillText("You win!",220,300);
}

//Experimental Pause Feature taken from http://atomicrobotdesign.com/blog/web-development/pause-your-html5-canvas-game/
//Works so far

function keyDown(e) {
	//If the p key is pressed run pauseGame
  if (e.keyCode == 80) {
	  pauseGame();
  }
}

function pauseGame() {
	//If the game is not paused, we pause the game by clearing the delay. Set pause boolean to true
  if (!gamePaused) {
    game = clearInterval(game);
	bug_creator = clearInterval(bug_creator)
	game_timer = clearInterval(game_timer);
    gamePaused = true;
	//If the game is already paused, we unpause it by setting the interval again with the draw function. Set pause boolean to false
  } else{
    game = setInterval(draw, 30);
	bug_creator = setInterval(generate_bug, Math.floor(Math.random()*2000)+1000);
	game_timer = setInterval(timer, 1000);
    gamePaused = false;
  }
}

window.onload = init;