/*
I decided to implement a number of features for my project, some of them are within the rubic's instructions, some are not. I believe I have covered all 4 of the extensions. 

For your easier reference I will list all of them below:

1) Projectile attack system for player/enemy/boss(creating projectiles,collision boxes,reducing hp)
2) Pause screen, intro screen, epilogue screen
3) floating combat text (Of course it's necessary, I am a gamer)
4) creating a particle system for various graphics needs, albeit I only implemented it for when the player reaches 0 lives.
5) Platforms on billboards and billboards
6) Level progress bar (shows how many enemies left)
7) Life bar & lives left on top of the player
8) Helicopter scene (Instead of flagpole I suppose)
9) Logic for enemies && boss
10) Collidable enemies 
11) Sound
12) Do utility functions count? I went into a lot of thinking into how the level will be generated as you will see within the setup and startGame functions.

Comments on extensions:

A) Projectile attack system & enemies creation
I chose to comment on creating the projectile and enemy systems in general(Player's,enemies', boss') as it proved to be rather harder than I expected. 
The extension grants all three of them some sort of a ranged attack. :
	The player can direct his attacks via the mouse.  
	The enemy system auto targets constantly the player.  (Only the enemies will kill the player if collided)
	The boss spawns randomly does radial attacks.
Dealing with vectors programmatically was not something I had experienced much. Much of its difficulty stems through their mathematical nature but I was surprised when I finally got around it.
Also, figuring out some sort of logic to coordinate their attacks was a creative process and I really enjoyed it!

B) Creating a particle system (Graphics)
The particle system was an interesting process as I had to figure out how to use it for a certain amount of time.  
I think overall figuring out how to time things properly was one of the biggest challenges for me since I already have some coding knowledge and experience. 

Thanks for reading and I hope the rubric is satisfied, have a blast playing the game ! :D
*/
//variables
var widthBuilding;
var boss;
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var mouseVec;
var dir;
var frame; 
var boss_img
var roofPos;
var sideWalkY;
var roadSide;
var sideWalkUpY;
var backRoadY;
var prevBuild
var enemy_y;
var enemy_x;
var intro_time
var background_gradient
var hY = 0
var tY = 0
var progressTotal;
var progress_status;
var buildingScaleFactor
var splatter
var background_alpha
var alpha_flag=1
var back_alpha =0
var buildingScaleFactor =4 
var backGroundImg;
var lastBuildingA 
var lastBuildingB 
var helicopterGif
var intro_screen; 
var intro_timer

//flags
var isStart;
var isOver;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isJumping;
var isPaused = false
var intro = false   
var epilogue = false 
var isSetting= true 
var scoreCounter;
var lives;
var endX = 0
var jumpSound;
var preDeathSound;
var deathSound;
var walking_animations;
var floorPos_y;
var cTime;
var jumpSound;

//arrays 
var starsArray = []
var enemiesArray = []
var buildingsArray = [];
var backBuildingsArray = [];
var shootersArray = []
var collectiblesArray=[]
var collectiblesFound = []
var gapArray=[]
var enemyShootersArray = []
var platformsArray = []
var lightPostArray = []
var bBoardArray = []
var frontBuildingsArray= [];
var viruses = []
var bloodParticlesArray =[]

//objects
var roof_drawings;
var player_drawings;
var meme_list;
var spriteSheet;
var flagpole;
var epilogue_text = {
	text:`Congratulations! You vaccinated what was left of humanity.\n
	Now, while this is a fun game project with a slightly controversial \nissue hidden beneath, there are no harmful intentions,\n but merely a wish to provide food for thought to anyone who comes accross it.\n
	In reality, the medical community is not immune \nto biases or prejudices and even profiteering.\n 
	Their history has proven it.\n
	This of course is no excuse to either cultivate distrust nor to mock such concerns.\n Instead, it is a prompt to exercise critical thought.Should you \n still be interested to learn more, a good place to start would be\n the history of vaccines and their discovery. :)\n Thank you for playing!`,
	x:undefined,
	y:undefined,
}
var intro_text = {
	text:intro_text=`The year is 2023. What started as the Sars-CoV-19 pandemic took its toll on humanity.\n Plagued by the coronavirus, it disolved into chaos.\n Now, one crazy looking M.D. is its last chance for redemption...\n And survival.`,
	x:undefined,
	y:undefined,
	instruction_text:`Some urgent instructions just came in:\n
	Use the escape to pause. \n
	Press space to jump. \n
	Move with WAD. \n
	Collectibles decrease viral spawn rate. \n
	BillBoards have a platform you can climb on, use it wisely. \n
	The infected population has a ranged attack so be careful!\n
	You need to vaccinate all nonimmune population encountered and then\n
	get to the choppah!`
}
p5.disableFriendlyErrors = true; //for performance 

function preload()
{
    soundFormats('mp3','wav');
	//load gifs
	helicopterGif = loadImage('./assets/Sprites/source.gif') //giphy.com && www.swisshelicopter.ch
	helicopterSound= loadSound('./assets/sounds/49481__lorenzosu__helicopterpassage-28sec.wav')
	//load  sounds here 
	helicopterSound.setVolume(0.1)
    jumpSound = loadSound('./assets/sounds/469367__pocosebas__11-persona-esforzandose.wav');
    playerHitSound = loadSound('./assets/sounds/369003__flying-deer-fx__getting-hit-eeeh-01-mouth-fx-man-voice.wav')
	enemyHitSound = loadSound('./assets/sounds/486943__matrixxx__human-aah.wav')
    aliveSound = loadSound('./assets/sounds/521965_kastenfrosch_funny-cheering-shout-5 (online-audio-converter.com).mp3')
	deathSound = loadSound('./assets/sounds/195954__minian89__death-blood-splatter.mp3');
	backgroundSound = loadSound('./assets/sounds/565016__josefpres__dark-loops-096-simple-mix-version-8-long-loop-60-bpm.wav')
	collectiblesound = loadSound('./assets/sounds/this_will_help.mp3')
	//all sounds loaded from https://freesound.org/, except collectibleSound which is my own voice.
	bossDeadSound = loadSound('./assets/sounds/523765__matrixxx__retro-enemy-eliminated.wav')
	meme_list = [
	]
	//load meme posters for billboards
	for(let i=0;i<8;i+=1)
	{
		meme_list.push(loadImage(`./assets/Posters/${i}.jpg`)) //memes were randomly picked from the internet wasnt able to find someone to credit them to
	}
	
	
	//Load your sprites here
	enemy_img = loadImage('./assets/Sprites/enemy_img_.png')
	enemy_icon = loadImage('./assets/Sprites/enemy_img_.png')
	poster_img = loadImage('./assets/anti-vaxxer for life.png')
	
	cat_smile = loadImage('./assets/Sprites/cat_smile.png')
	boss_img = loadImage('./assets/virus_drawing_boss_0.png')
	//load player animation objects(hard coded) alterations
	walking_animations = 
	{
		first:function(x,y) 
		{
			fill(0)
			stroke(0)
			strokeWeight(0.1)
			//back leg
			beginShape()
			vertex(x-5,y-20) //top left corner
			vertex(x-6.5,y-8) //knee corner
			vertex(x-10.5,y+1)  //bottom left corner
			vertex(x-0.5,y+3) // bottom  right foot corner
			vertex(x-7,y-2) //ankle angle 
			vertex(x-1,y-20) // top right corner
			endShape(CLOSE)
			
			//forward leg
			fill(0)
			beginShape()
			vertex(x+1,y-20)   //top left
			vertex(x+4,y-8)  //knee 
			vertex(x+3.5,y+2) // bottom left
			vertex(x+13,y+2)  //bottom right 
			vertex(x+5.5,y-2)   //ankle angle
			vertex(x+5,y-20)  //top right 
			endShape(CLOSE)    
					 
		},
		second:function(x,y)
		{

			// //second animation
			fill(0)
			stroke(0)
			strokeWeight(0.1)
			//back leg
			beginShape()
			vertex(x-3,y-20) //top left corner
			vertex(x-6,y-7.5) //knee

			vertex(x-13,y-3)  //bottom left corner

			vertex(x-5,y+3) // bottom  right foot corner

			vertex(x-8,y-2) // ankle angle

			vertex(x-3,y-5.5) //forward knee angle 
			vertex(x,y-20) // top right corner
			endShape(CLOSE)
			
			//forward leg
			fill(0)
			beginShape()
			vertex(x,y-20)   //top left
			vertex(x+3,y-8)  //knee 
			vertex(x+3.5,y+2) // bottom left
			vertex(x+13,y+2)  //bottom right 
			vertex(x+5.5,y-2)   //ankle angle
			vertex(x+5,y-20)  //top right 
			endShape(CLOSE)  
		},
		third:function(x,y)
		{

			//third animation
			fill(0)
			stroke(0)
			strokeWeight(0.1)
			

			//back leg  
			beginShape()
			vertex(x-5,y-20) // top left
			vertex(x-6,y+2)  //bottom left
			vertex(x+2.5,y+2)  //bottom right 
			vertex(x-4,y-2)  //ankle angle
			vertex(x-1,y-20)  //top right
			endShape(CLOSE)  
			
			
			//forward leg
			fill(0)
			beginShape()
			vertex(x,y-20)   //top left
			vertex(x+3,y-7.5)  //back knee 

			vertex(x-2,y-2) // bottom left
			vertex(x+7,y+2)  //bottom right 
			vertex(x+2.5,y-3) //ankle angle
			vertex(x+6,y-7.5)   //forward knee
			vertex(x+5,y-20)  //top right 
			endShape(CLOSE)    

		},
	}
	//load player drawing objects(hard coded )
	player_drawings= 
	{
		standing_f:function(x,y)
		{			
			
			stroke(255,206,180)
			fill(255,206,180)
			ellipse(x,y-50,22,22)
			//face
			//eyeglasses
			
			strokeWeight(0.5)
			stroke(0,0,0)
			fill(240)
			ellipse(x-3,y-51,4,4)
			ellipse(x+3,y-51,4,4)
			line(x-1,y-51,x+1,y-51)
			line(x-5,y-51,x-11,y-51)
			line(x+5,y-51,x+11,y-51)
			
			//mask
			noFill()
			fill(255,255,255)
			stroke(0,0,0)
			strokeWeight(0.5)
			beginShape()

			//top left
			vertex(x-8,y-48)
			//top right
			vertex(x+8,y-48)
			
			
			
			//bottom right
			vertex(x+8,y-41.5)
			//bottom middle
			vertex(x,y-40.0)
			//bottom left
			vertex(x-8,y-41.5)
			
			endShape(CLOSE)
			
			//mask strings
				strokeWeight(0.3)
				//bottom left
				beginShape()
				//bottom left inner
				vertex(x-7.5,y-43)
				//bottom left outer
				vertex(x-11,y-46)
				endShape()
				
				//top left
				beginShape()
				//top left inner
				vertex(x-6,y-46.5)
				//top left outer
				vertex(x-11,y-49.6)
				endShape()
				
				//bottom right
				beginShape()
				//bottom right inner
				vertex(x+7.5,y-43)
				//bottom right outer
				vertex(x+11,y-46)
				endShape()
				
				//top right
				beginShape()
				//top right inner
				vertex(x+8,y-46.5)
				//top right outer
				vertex(x+11,y-49.6)
				endShape()
				//Mask drawing
				image(cat_smile,x-6.5,y-47.0,13,6)
			
			//eyebrow
			noFill()
			
			strokeWeight(0.5)
			beginShape()
			vertex(x-5,y-53)
			vertex(x,y-53.6)
			
			endShape()
			beginShape()
			vertex(x+1,y-53) 
			vertex(x+5,y-53)
			endShape()
			strokeWeight(1)
			
			//hair

			//left part
			beginShape()
			noFill()
			noStroke()
			fill(255)
			strokeWeight(0.5)
			// fill(0,0,0)
			stroke(0,0,0)
			dy = 5
			dx = 10
			y = y + dy
			vertex(x-11,y-58)
			
			vertex(x-17,y-61)

			vertex(x-13,y-62)
			
			vertex(x-13,y-65)
			
			vertex(x-13,y-67)
			
			vertex(x-12,y-65)
			
			vertex(x-11,y-64)
			
			vertex(x-10,y-64) //
			
			vertex(x-9,y-68)// 
			
			vertex(x-8,y-66)//
			
			vertex(x-7,y-69)//
			
			vertex(x-6,y-70)  //
			
			vertex(x-5,y-68) //
			
			vertex(x,y-75)  //
			
			vertex(x,y-66)  //
			endShape()
			//right part
			beginShape()
			
			vertex(x,y-66)
			
			vertex(x,y-75)
			
			vertex(x+5,y-68)
			
			vertex(x+6,y-70)
			
			vertex(x+7,y-69)
			
			vertex(x+8,y-66)
			
			vertex(x+9,y-68)
			
			vertex(x+10,y-64)
			
			vertex(x+11,y-64)
			
			vertex(x+12,y-65)
			
			vertex(x+13,y-67)
			
			vertex(x+13,y-65)
			
			vertex(x+13,y-62)
			
			vertex(x+17,y-61)
			
			vertex(x+11,y-58)
			
			endShape()
			noFill()
			y = y -dy
			
			// stroke(255,0,255)
			// fill(255,0,255)
			//rect(x-13.5,y-40,25.5,20.5)
			// fill(128 ,128 ,128)
			stroke(128 ,128 ,128)
			//rect(x-10.5,y-20,20.5,5.5//)

			//arms
			//L- arm
			stroke(150)
			fill(150)
			beginShape()
			vertex(x-12,y-38)
			vertex(x-19,y-20.5)
			vertex(x-19,y-20.5)
			vertex(x-14,y-20.5)
			vertex(x-14,y-20.5)
			vertex(x-8,y-40)
			endShape()
			//R - arm
			fill(150)
			beginShape()
			vertex(x+12,y-39.5)
			vertex(x+19,y-20.5)
			vertex(x+19,y-20.5)
			vertex(x+14,y-20.5)
			vertex(x+14,y-20.5)
			vertex(x+8,y-39.5)
			endShape()
			noFill()
			//hands
			//L-hand
			noFill()
			strokeWeight(0.5)
			stroke(255,206,180)
			fill(255,206,180)
			beginShape()
			vertex(x-18.5,y-20)
			vertex(x-18.5,y-17)
			vertex(x-17,y-16.5)
			vertex(x-16,y-17)
			vertex(x-16,y-20)
			endShape()
			strokeWeight(1)
			//R-hand
			noFill()
			strokeWeight(0.5)
			fill(255,206,180)
			beginShape()
			vertex(x+18.5,y-20)
			vertex(x+18.5,y-17)
			vertex(x+17,y-16.5)
			vertex(x+16,y-17)
			vertex(x+16,y-20)
			endShape()
			strokeWeight(1)
			//legs
			//L - leg
			fill(0)
			stroke(0)
			beginShape()
			vertex(x-10,y-14)
			vertex(x-10,y+2)
			vertex(x-10,y+2)
			vertex(x-3,y+2)
			vertex(x-2,y+2)
			vertex(x-8,y-2)
			vertex(x-6,y-14)
			endShape(CLOSE)
			//R - leg
			fill(0)
			beginShape()
			vertex(x+5,y-14)
			vertex(x+5,y+2)
			vertex(x+13,y+2)
			vertex(x+7,y-2)
			vertex(x+9,y-14)
			endShape(CLOSE)
			//body
			// stroke(0)
			// fill(0)
			
			//upper body 
			fill(255)
			stroke(200)
			rect(x-8.5,y-39.5,18,19)

			//tie
			stroke(0)
			fill(0)
			beginShape()
			vertex(x,y-39)
			vertex(x-2,y-28)
			vertex(x-2,y-28)
			vertex(x-1,y-27)
			vertex(x-1,y-27)
			vertex(x,y-28)
			vertex(x,y-28)
			vertex(x+1,y-39)
			endShape(CLOSE)
			//lower body
			rect(x-10,y-25,19.5,10)
			stroke(136)
			fill(150)
			
			//body coat
			beginShape()
			
			//top left
			vertex(x-10.5,y-38)
			
			//bottom left-outer 
			vertex(x-10.5,y-5)
			
			//bottom left-inner
			vertex(x-4,y-4)
			
			//top left -inner
			vertex(x-4,y-40)
			
			vertex(x-10,y-39)
			endShape(CLOSE)
			
			
			beginShape()
			//bottom 
			vertex(x,y-7)
			
			//bottom right
			vertex(x+10,y-5)
			
			//top right-outer
			vertex(x+10,y-39.5)
			
			//top right-inner
			vertex(x+7,y-40)
			endShape()
			
		},
		jumping_f:function player_jumping_front(x,y) // done 
		{
		stroke(255,206,180)
		fill(255,206,180)
		ellipse(x,y-50,22,22)
		//face
		//EYES
		
		strokeWeight(0.5)
		stroke(0,0,0)
		fill(240)
		ellipse(x-3,y-51,4,4)
		ellipse(x+3,y-51,4,4)
		line(x-1,y-51,x+1,y-51)
		line(x-5,y-51,x-11,y-51)
		line(x+5,y-51,x+11,y-51)
		
		
		
		//mask
		noFill()
		fill(255,255,255)
		stroke(0,0,0)
		strokeWeight(0.5)
		beginShape()

		//top left
		vertex(x-8,y-48)
		//top right
		vertex(x+8,y-48)
		
		
		
		//bottom right
		vertex(x+8,y-41.5)
		//bottom middle
		vertex(x,y-40.0)
		//bottom left
		vertex(x-8,y-41.5)
		
		endShape(CLOSE)
		
		//mask strings
		strokeWeight(0.3)
		//bottom left
		beginShape()
		//bottom left inner
		vertex(x-7.5,y-43)
		//bottom left outer
		vertex(x-11,y-46)
		endShape()
		
		//top left
		beginShape()
		//top left inner
		vertex(x-6,y-46.5)
		//top left outer
		vertex(x-11,y-49.6)
		endShape()
		
		//bottom right
		beginShape()
		//bottom right inner
		vertex(x+7.5,y-43)
		//bottom right outer
		vertex(x+11,y-46)
		endShape()
		
		//top right
		beginShape()
		//top right inner
		vertex(x+8,y-46.5)
		//top right outer
		vertex(x+11,y-49.6)
		endShape()
		//Mask drawing
		image(cat_smile,x-6.5,y-47.0,13,6)
		strokeWeight(1)
		//eyebrow
		noFill()
		strokeWeight(0.5)
		beginShape()
		vertex(x-5,y-53)
		vertex(x,y-53.6)
		
		endShape()
		beginShape()
		vertex(x+1,y-53) 
		vertex(x+5,y-53)
		endShape()
		
		strokeWeight(1)
		//hair
		
		beginShape()
		noFill()
		noStroke()
		fill(255)
		strokeWeight(0.5)
		// fill(0,0,0)
		stroke(0,0,0)
		dy = 5
		dx = 10
		y = y + dy
		vertex(x-11,y-58)
		vertex(x-17,y-61)
		
		
		
		vertex(x-13,y-62)
		
		vertex(x-13,y-65)
		
		vertex(x-13,y-67)
		
		vertex(x-12,y-65)
		
		vertex(x-11,y-64)
		
		vertex(x-10,y-64) //
		
		vertex(x-9,y-68)// 
		
		vertex(x-8,y-66)//
		
		vertex(x-7,y-69)//
		
		vertex(x-6,y-70)  //
		
		vertex(x-5,y-68) //
		
		vertex(x,y-75)  //
		
		vertex(x,y-66)  //
		endShape()
		
		beginShape()
		
		vertex(x,y-66)
		
		vertex(x,y-75)
		
		vertex(x+5,y-68)
		
		vertex(x+6,y-70)
		
		vertex(x+7,y-69)
		
		vertex(x+8,y-66)
		
		vertex(x+9,y-68)
		
		vertex(x+10,y-64)
		
		vertex(x+11,y-64)
		
		vertex(x+12,y-65)
		
		vertex(x+13,y-67)
		
		vertex(x+13,y-65)
		
		vertex(x+13,y-62)
		
		vertex(x+17,y-61)
		
		vertex(x+11,y-58)
		
		
		endShape()
		noFill()
		y = y -dy
		
		stroke(128 ,128 ,128)
		
		
		//arms
		//L- arm
		stroke(150)
		fill(150)
		beginShape()
		vertex(x-8,y-38)
		
		vertex(x-32,y-40.5)
		
		vertex(x-32,y-40.5)
		
		vertex(x-29,y-41.5)
		
		vertex(x-29,y-41.5)
		
		vertex(x-8,y-40.5)
		endShape()
		//R - arm
		fill(150)
		beginShape()
		vertex(x+8,y-38)
		vertex(x+32,y-40.5)
		vertex(x+32,y-40.5)
		vertex(x+29,y-41.5)
		vertex(x+29,y-41.5)
		vertex(x+8,y-40.5)
		endShape()
		noFill()
		//hands
		//L-hand
		noFill()
		strokeWeight(0.5)
		stroke(255,206,180)
		fill(255,206,180)
		beginShape()
		vertex(x-31.5,y-40)
		vertex(x-31.5,y-37)
		vertex(x-30,y-36.5)
		vertex(x-29,y-37)
		vertex(x-29,y-40)
		endShape()
		strokeWeight(1)
		//R-hand
		noFill()
		strokeWeight(0.5)
		fill(255,206,180)
		beginShape()
		vertex(x+31.5,y-40)
		vertex(x+31.5,y-37)
		vertex(x+30,y-36.5)
		vertex(x+29,y-37)
		vertex(x+29,y-40)
		endShape()
		strokeWeight(1)
		//legs
		//L - leg
		fill(0)
		stroke(0)
		beginShape()
		vertex(x-10,y-14)
		vertex(x-10,y+1)
		vertex(x-10,y+1)
		vertex(x-3,y+2)
		vertex(x-2,y+2)
		vertex(x-8,y-2)
		vertex(x-6,y-14)
		endShape(CLOSE)
		//R - leg
		fill(0)
		beginShape()
		vertex(x+5,y-14)
		vertex(x+5,y+1)
		vertex(x+13,y+1)
		vertex(x+7,y-2)
		vertex(x+9,y-14)
		endShape(CLOSE)
		//body
		stroke(0)
		fill(0)
		
		//upper body 
		fill(255)
		stroke(200)
		rect(x-8.5,y-39.5,18,19)
		
		//tie
		stroke(0,0,0)
		fill(0,0,0)
		beginShape()
		vertex(x,y-39.5)
		vertex(x-2,y-28)
		vertex(x-2,y-28)
		vertex(x-1,y-27)
		vertex(x-1,y-27)
		vertex(x,y-28)
		vertex(x,y-28)
		vertex(x+1,y-39.5)
		endShape()
		//lower body
		rect(x-10,y-25,19.5,7)
		stroke(136)
		fill(150)
		
		//body coat
		beginShape()
		
		//top left
		vertex(x-10.5,y-38)
		
		//bottom left-outer 
		vertex(x-10.5,y-5)
		
		//bottom left-inner
		vertex(x-4,y-4)
		
		//top left -inner
		vertex(x-4,y-40)
		
		vertex(x-10,y-39)
		endShape(CLOSE)
		
		
		beginShape()
		//bottom 
		vertex(x,y-7)
		
		//bottom right
		vertex(x+10,y-5)
		
		//top right-outer
		vertex(x+10,y-39.5)
		
		//top right-inner
		vertex(x+7,y-40)
		endShape()
		},
		walking_r:function player_walking_right(x,y,step) 
		{

			//head
		
		stroke(255,206,180)
			fill(255,206,180)
		
		ellipse(x,y-50,20,20)
		
		//hair
		
		beginShape()
		fill(255)
		stroke(0)
		strokeWeight(0.3)
		
		vertex(x-9,y-49)
		
		vertex(x-18,y-53)
		
		vertex(x-12,y-53)
		
		vertex(x-15,y-57)
		
		vertex(x-11,y-55)
		
		vertex(x-10,y-56)
		
		vertex(x-14,y-60)
		
		vertex(x-9,y-58)
		
		vertex(x-7,y-66)
		
		vertex(x-5,y-62)
		
		
		
		vertex(x-5,y-62)
		
		vertex(x,y-71)
		
		vertex(x+6,y-58)
		endShape()
		
		
		
		//eyeglasses
		strokeWeight(0.4)
		fill(235)
		line(x,y-50.5,x+9,y-50)
		ellipse(x+10,y-50,2,4)
		
		
		//mask
		strokeWeight(0.3)
		line(x,y-50.5,x+8,y-48)
		line(x,y-47.5,x+5,y-44)
		push()
		translate(x+8,y-48)
		rotate(0.70)
		rect(0,0,3,5)
			pop()
		
		
		strokeWeight(0.4)
		//ear
		noFill()
		ellipse(x,y-49,2,3)
		
		
		
		//body
		
		stroke(0)
		fill(0)
		
		//upper body 
		fill(255)
		stroke(200)
		rect(x-5,y-40,10,20)
		
		//feet
		if(step%8<3)
			{
				walking_animations.first(x,y)
			}
		else if(step%8<5)
			{
				walking_animations.second(x,y)
			}
		else if(step%8<7) 
			{
				walking_animations.third(x,y)
			}
		
		//body coat
		fill(220)
			beginShape()
		//bottom 
		vertex(x+4,y-7)
		
		//bottom right
		vertex(x+15,y-5)
		
		//top right-outer
		vertex(x+5,y-38.5)
		
		//top right-inner
		vertex(x+4,y-40)
		endShape() 
		
		
		
		fill(150)
		beginShape()
		
		//top right
		vertex(x+3.7,y-40)
		
		//bottom right-outer 
		vertex(x+5,y-6)
		
		
		vertex(x,y-7)
		vertex(x-1,y-8)
		
		
		//bottom left-outer
		vertex(x-10,y-6)
		
		
		//top left -inner
		vertex(x-5,y-40)
		
		vertex(x-4.5,y-40)
		endShape()

		
		//right arm animation
		if(step%8<5)
		{
			push()

			scale(-1,1)
			translate(-x*2,1)
			fill(150)
			beginShape()
			//top right  
			vertex(x-2,y-40.5)
			vertex(x,y-40.5)
			
			vertex(x+2,y-39)
			//bottom right
			vertex(x+10,y-20.5)
			//bottom left
			vertex(x+10,y-20.5)
			
			vertex(x+5,y-20.5)
			
			vertex(x+5,y-20.5)
			
			//top left
			vertex(x-3,y-39.5)
			endShape(CLOSE)
			//right hand
			noFill()
			noStroke()
			// strokeWeight(0.5)
			fill(255,206,180)
			beginShape()
			vertex(x+9.5,y-20)
			vertex(x+9.5,y-17)
			vertex(x+8,y-16.5)
			vertex(x+6,y-17)
			vertex(x+6,y-20)
			endShape()
			strokeWeight(1) 
			noFill()
			pop()

		}
		else
		{
			fill(150)
			beginShape()
			//top right  
			vertex(x-2,y-40.5)
			vertex(x,y-40.5)
			
			vertex(x+2,y-39)
			//bottom right
			vertex(x+10,y-20.5)
			//bottom left
			vertex(x+10,y-20.5)
			
			vertex(x+5,y-20.5)
			
			vertex(x+5,y-20.5)
			
			//top left
			vertex(x-3,y-39.5)
			endShape(CLOSE)
			//right hand
			noFill()
			noStroke()
			// strokeWeight(0.5)
			fill(255,206,180)
			beginShape()
			vertex(x+9.5,y-20)
			vertex(x+9.5,y-17)
			vertex(x+8,y-16.5)
			vertex(x+6,y-17)
			vertex(x+6,y-20)
			endShape()
			strokeWeight(1) 
			noFill()
		}

		},
		jumping_r:function player_jumping_right(x,y) //done
		{
		//head
		
		stroke(255,206,180)
				fill(255,206,180)
				
				ellipse(x,y-50,20,20)
				
				//hair
				
				beginShape()
				fill(255)
				stroke(0)
				strokeWeight(0.3)
				
				vertex(x-9,y-49)
				
				vertex(x-18,y-53)
				
				vertex(x-12,y-53)
				
				vertex(x-15,y-57)
				
				vertex(x-11,y-55)
				
				vertex(x-10,y-56)
				
				vertex(x-14,y-60)
				
				vertex(x-9,y-58)
				
				vertex(x-7,y-66)
				
				vertex(x-5,y-62)
				
				
				
				vertex(x-5,y-62)
				
				vertex(x,y-71)
				
				vertex(x+6,y-58)
				endShape()
				
				
				
				//eyeglasses
				strokeWeight(0.4)
				fill(235)
				line(x,y-50.5,x+9,y-50)
				ellipse(x+10,y-50,2,4)
				
				
				//mask
				strokeWeight(0.3)
				line(x,y-50.5,x+8,y-48)
				line(x,y-47.5,x+5,y-44)
				push()
				translate(x+8,y-48)
				rotate(0.70)
				rect(0,0,3,5)
					pop()
				
				
				strokeWeight(0.4)
				//ear
				noFill()
				ellipse(x,y-49,2,3)
		
		
		
		
		
		
		
		
		
		
		
		//left leg - back
		fill(0)
		stroke(0)
		strokeWeight(0.1)
		beginShape()
		vertex(x-5,y-20)
		vertex(x-12,y+2)
		vertex(x-12,y+2)
		vertex(x-2,y+2)
		vertex(x-2,y+2)
		vertex(x-7.5,y-1)
		vertex(x-1,y-20)
		endShape(CLOSE)
		
		
		
		
		// body coat - inner
		fill(220)
		stroke(200)
		strokeWeight(0.5)
			beginShape()
		//bottom 
		vertex(x+13,y-7)
		
		//wrinkles
		vertex(x+6,y-3)
		vertex(x+5,y-6)
		
		
		//bottom right
		vertex(x-2,y-5)
		
		//top right-outer
		vertex(x-3,y-39.5)
		
		//top right-inner
		vertex(x+6.5,y-40)
		endShape(CLOSE) 
		
		
		//upper body 
		fill(255)
		stroke(200)
		rect(x-4.5,y-40,10,20)
		noFill()
		noStroke()
		
		//right leg - forward
		fill(0)
		stroke(0)
		strokeWeight(0.5)
		beginShape()
		vertex(x+1,y-20)
		vertex(x+5,y+2)
		vertex(x+13,y+1)
		vertex(x+7,y-1)
		vertex(x+5,y-20)
		endShape(CLOSE)  
		
		//lower body
		rect(x-6.5,y-20,12,6)
		stroke(136)
		fill(150)
		
		
		
		//body coat - outer
		fill(150)
		beginShape()
		
		//top right
		vertex(x+3,y-40)
		
		//bottom right-outer 
		vertex(x-3,y-6)
		
		
		vertex(x-10,y-7)
		vertex(x-11,y-8)
		
		
		//bottom left-outter
		vertex(x-20,y-6)
		
		
		//top left -inner
		vertex(x-4,y-40)
		
		vertex(x-5,y-39)
		endShape()
		
		
		//right arm
			
		beginShape()
		fill(150)
		//top right  
		vertex(x+2,y-39)
		vertex(x,y-40.5)
		vertex(x-5,y-40.5)
		
		vertex(x-25,y-30.5)
		//bottom right
		vertex(x-25,y-30.5)
		//bottom left
		vertex(x-25,y-30.5)
		
		vertex(x-20,y-30.5)
		
		vertex(x-20,y-30.5)
		
		//top left
		vertex(x+2,y-39)
		endShape(CLOSE)
		
		//right hand
		noFill()
		//noStroke()
		strokeWeight(0.5)
		fill(255,206,180)
		beginShape()
		vertex(x-25.5,y-30)
		vertex(x-25.5,y-27)
		vertex(x-23.5,y-26.5)
		vertex(x-22,y-27)
		vertex(x-22,y-30)
		endShape()
		strokeWeight(1) 
		noFill()
		
		},
		
	}

	//load rooftop variation drawing objects ( hard coded)
	roof_drawings = [
		roof_box= function (x,y,width,height,color)
		{
		var c = color 
		noStroke()
		fill(c)
		
		
		//smaller base
		fill(c)
		rect(x+2.5,y-35,width-5,height-34)
		
		
		//larger base
		fill(50)
		rect(x,y-20,width,height-30)
		
		//tower edge
		fill(130)
		//   triangle(
		// 	width/2-7,(y-35), //first 
		// 	width/2,y-100,    // second angle 
		// 	7+width/2,(y-35)) 
		},
		roof_triangle= function (x,y,width,height,color)
		{
		var c = color
			
		fill(200,0,0)
		if(second() % 2==0) circle(width/2+5,y-100,3)
		
		//middle triangle
		fill(c) 
		triangle(
			width/2+10,y, //bottom right 
			width/2+5,y-100,    // top 
			width/2,y) //bottom left 
		fill(100)
		stroke(0.5)
		stroke(c)
		strokeWeight(0.05)
		
			//right triangle 
		triangle(
			width/2+20,y, //bottom right 
			width/2+5,y-100,    // top 
			width/2+10,y) //bottom left 
			//left triangle 
		
			triangle(
				width/2,y, // bottom right  
				width/2+5,y-100,    // top
				width/2-10,y) //bottom left 
		},
		roof_clock=function (x,y,width,height,color)
		{
		var c = color 
		//smaller base
		fill(c)
		rect(x,y-14,width,height)
		
		fill(200,0,0)
		if(second() % 2==0) circle(width/2,y-61,2.5)
		//tower edge
		fill(100)
		triangle(
			x,y-13,    
			width/2,y-30,
			width,y-13)
		
		stroke(255)
		strokeWeight(1)
		line(width/2,y-30,width/2,y-60)
		fill(255)
		ellipse(width/2,y+5,50,50)
		},
		roof_box_2=function (x,y,width,height,color)
		{
			var c = color 
			noStroke()
			fill(c)
			
			
			//smaller base
			fill(c)
			rect(x+2.5,y-35,width-5,height-34)
			
			
			//larger base
			fill(50)
			rect(x,y-20,width,height-30)
		},
		roof_clockless= function(x,y,width,height,color)
		{
			var c = color 
			//smaller base
			fill(c)
			rect(x,y-14,width,height)

			//tower edge
			fill(100)
			triangle(
				x,y-13,    
				width/2,y-30,
				width,y-13)
			
			
			stroke(255)
			strokeWeight(1)
			line(width/2,y-30,width/2,y-60)
		},
		roof_no_antenna= function(x,y,width,height,color)
		{
			var c = color 
			//smaller base
			fill(c)
			rect(x,y-14,width,height)

			//tower edge
			fill(100)
			triangle(
				x,y-13,    
				width/2,y-30,
				width,y-13)
			
			
			
		},
		roof_base_triangle=function (x,y,width,height,color)
		{
			var c = color 
			noStroke()
			fill(c)

			//smaller base
			fill(c)
			rect(x+2.5,y-35,width-5,height-34)
			
			//larger base
			fill(50)
			rect(x,y-20,width,height-30)
			
			fill(c)

			//middle triangle
			triangle(
				width/2+10,y-35, //bottom right 
				width/2+5,y-100,    // top 
				width/2,y-35) //bottom left 
			fill(100)
			stroke(0.5)
			stroke(c)
			strokeWeight(0.05)
			
				//right triangle 
			triangle(
				width/2+15,y-35, //bottom right 
				width/2+5,y-100,    // top 
				width/2+5,y-35) //bottom left 
				
			
				
		
		}
	]

	//Background buildings
	let backBuildings = 30 //var to set backBuilding number 
	for(let i=0;i<backBuildings;i+=1) //backBuilding population loop
	{
		let x_pos = 0+i*450 // var to control x location 
		let h = random(400,500) //var to control building height
		let w = random(200,300) //var to control building width
		let roofNum = int(random(0,6)) //var to set randomly roof drawing
		backBuildingsArray.push
		(
			createBackBuilding(x_pos,1000,h,w,roofNum)
		)
	}
}

function setup() 
{
	
	frameRate(45)
	// backgroundSound.play()
	createCanvas(1680,980)
	intro_text.x=0
	intro_text.y = 0
	epilogue_text.x =0
	epilogue_text.y =0
	
	intro_screen = createGraphics(width,height) //creates a graphics object for intro screen

	flagpole =  //sets the flagpole object properties
		{
			isReached:false,
			x:0,
			y:0,
			height:100,
			width:2.5,
			flagIcon:undefined,
			off_x: undefined,
			off_y: undefined,
		}
	scoreCounter=0 //sets the score to 0
	//variables to control dimensions within the canvas 
	floorPos_y = 1250 
	roofPos= 580
	backRoadY = 700
	sideWalkY = 695
	sideWalkUpY=693
	
    let particleSize = 4 //variable to control particle size 
    splatter = new SplatterAnimation(particleSize)	//instantiates SplatterAnimation object
	//spawns boss and player 
 	boss = new Boss(100,100,50,boss_img,100)
	player = new Player(player_drawings,0,roofPos+80)
	//sets intro_timer only for the first time played
	intro_timer = new Date()
    //backgroundSound.play()
	noFill()
	startGame()
}

function draw()
{
	if(isPaused) //pause flag for pause screen
	{
		textSize(50)
		text('Game Paused.\nPress escape to continue.',width/2,height/2)
	}
	else 
	{
		
		background(color(25,25,112))
		//back road
		fill(30)
		rect(0,backRoadY,width,100)
		
		//sideWalk
		fill(100)
		rect(0,sideWalkY,width,5)
		
		//sideWalkUp
		fill(150)
		rect(0,sideWalkUpY,width,2)
		fill(30)

		//frontRoad
		rect(0,backRoadY+130,width,150)
		
		//sideWalk
		fill(100)
		rect(0,sideWalkY+105,width,30)
		
		//sideWalkUp
		fill(150)
		rect(0,sideWalkUpY+105,width,20)

		//backRoad lines
		fill(255,255,255,150) 
		for(i=0;i<(width/10);i+=1)
	{	  
		rect(i*50,backRoadY+45,15,3)
		}
		
		//draw stars & moon
		drawStars(starsArray)
		drawMoon(50,50)
		push()
		translate(-scrollPos,0)

		for(i=0;i<backBuildingsArray.length;i+=1) //draws backBuildings
		{
			if(backBuildingsArray[i].off_x*buildingScaleFactor<gameChar_world_x && i>2) continue //skip some Backbuildings for performance 
			push()
			translate(backBuildingsArray[i].off_x,backBuildingsArray[i].off_y*1.5)
			scale(buildingScaleFactor-2.5)
			backBuildingsArray[i].draw()
			pop()		
		}

		for(i=0;i<buildingsArray.length;i+=1) //draws main buildings
		{
			if(buildingsArray[i].off_x*buildingScaleFactor*1.5<gameChar_world_x&& i>2) continue //skip some buildings for performance 
			push()
			scale(buildingScaleFactor)
			translate(buildingsArray[i].off_x,buildingsArray[i].off_y)
			buildingsArray[i].draw()
			pop()
		}
		
		for(i=0;i<bBoardArray.length;i+=1) //draws billboards && platforms
		{
			if(bBoardArray[i].off_x*buildingScaleFactor< gameChar_world_x && i>1) continue //skip some bBoards for performance 
			push()
			translate(bBoardArray[i].off.x*buildingScaleFactor,bBoardArray[i].off.y) 
			bBoardArray[i].draw()
			platformsArray[i].draw()
			pop()
		}

		for(i=0;i<shootersArray.length;i+=1) //Player projectiles checking & drawing
		{
			if(shootersArray)
			{		
				if(boss.mutation) var bossHit = projectileChecking( //flag for final encounter, checking if projectiles hit boss
					shootersArray[i].position.x,
					shootersArray[i].position.y,
					shootersArray[i].width,
					shootersArray[i].height,
					boss.pos.x, 
					boss.pos.y,
					boss.size,
					boss.size,
					)

				if(shootersArray[i].ttl>0 && shootersArray[i].isAlive) //if projectile is still alive draw and update
				{
					shootersArray[i].draw()
					shootersArray[i].update()
					
					if(bossHit) //if the boss is hit reduce its hp and remove the projectile from the array
					{
						boss.checkDamage()
						shootersArray[i].destroy()
						
					}
					
					for(j=0;j<enemiesArray.length;j+=1)  //loops through enemies to check for projectile contact
					{
						if(boss.mutation) break //stops the loop if in final encounter
						if(shootersArray[i]==undefined) continue  //guard condition to avoid bugs 
						
						var inVacContact=  //flag for enemy hit checking
						projectileChecking(
							shootersArray[i].position.x,
							shootersArray[i].position.y,
							shootersArray[i].width,
							shootersArray[i].height,
							enemiesArray[j].off.x,
							enemiesArray[j].off.y,
							enemiesArray[j].size,enemiesArray[j].size)
						
						if(!inVacContact) continue  //if not hit, continue to the next shooter
						
						shootersArray[i].destroy() //if hit, destroy the shooter 
						if(!shootersArray[i].isAlive) shootersArray.splice(i,1)
						
						enemiesArray[j].checkDamage() //if hit, reduce hit enemy hp 
						if(!enemiesArray[j].isAlive) enemiesArray.splice(j,1) 
					}
						
				}
			}
			else
			{
				break 
			}
		}
		
		for(let i =0;i<collectiblesArray.length;i+=1) //collectibles drawing & checking
		{
			push()
			translate(collectiblesArray[i].off.x,collectiblesArray[i].off.y)
			scale(collectiblesArray[i].rotation,3)
			collectiblesArray[i].draw()
			pop()
			var collectibleFound = 
			collectiblesArray[i].checkCollectable(gameChar_world_x,player.char_y)
			
			if(collectibleFound) 
			{
				collectiblesound.play()
				scoreCounter+=1 //increase score for each collectible
				boss.timer+=10 //collectibles increase boss' timer for attack
				collectiblesArray =collectiblesArray.filter(collectible => collectible.isFound==false)
				continue //remove collectibles found from the array
			}	
		}
		//enemies drawing & collision checking with player
		let enemyOffsetY = 80//var to set enemyOffsetY for targetting
		for(let i=0;i< enemiesArray.length;i+=1) 	
		{
			let d = int(dist(enemiesArray[i].off.x,enemiesArray[i].off.y,gameChar_world_x,player.char_y)) // distance measuring from player

			//guard functions to avoid bugs
			if(enemiesArray[i]==undefined) break
			if(enemiesArray[i].hp<=0) continue
			if(!enemiesArray[i].isAlive) continue 
			if(i%2==0 && abs(d)<=250)enemiesArray[i].attack(1,gameChar_world_x,player.char_y-enemyOffsetY) // Enemy condition attacking within given distance
	
			let enemyContact = enemiesArray[i].checkContact(gameChar_world_x,player.char_y-enemyOffsetY) // collision with enemies checking flag 

			if(enemyContact) player.checkDamage() //if collided, reduce player HP
			push()
			translate(enemiesArray[i].off.x,enemiesArray[i].off.y)
			enemiesArray[i].update()
			enemiesArray[i].draw()
			pop()
		}

		//enemy projectile checking and drawing
		if (enemyShootersArray) 
			{
				for(let i=0;i<enemyShootersArray.length;i+=1)
				{
					if(enemyShootersArray[i]==undefined) continue //guard condition 

					enemyShootersArray[i].draw()
					enemyShootersArray[i].update()

					var contact = projectileChecking( //projectile collision flag 
						enemyShootersArray[i].posterPos.x,
						enemyShootersArray[i].posterPos.y+enemyOffsetY,
						enemyShootersArray[i].width,
						enemyShootersArray[i].height,
						gameChar_world_x,
						player.char_y,60,110)

					if(contact) //if enemy projectile hits player reduce hp and remove enemy projectile from its loop
					{
						player.checkDamage()
						enemyShootersArray[i].destroy() 
						player.isDamaged = false 
					}
					if(!enemyShootersArray[i].isAlive) enemyShootersArray.splice(i,1)
				}
			}
		
		//boss projectile loop
		if(viruses.length>0)
		{
			for(i=0;i<viruses.length;i+=1)
			{
				if(!viruses[i].isAlive) continue //guard conditions
				if(viruses[i]==undefined) continue
				if(viruses[i].position.y < 0) continue //skip some checking for performance
				
				viruses[i].update()
				viruses[i].draw()
				
				let inContact= projectileChecking( //collision with player checking flag 
					viruses[i].position.x,
					viruses[i].position.y,
					viruses[i].size,
					viruses[i].size,
					gameChar_world_x,
					player.char_y-80,
					50,
					110)
				if (!inContact) continue  //if not hit, continue 
				if (inContact) //if a virus particle touches player reduce hp
				{
					player.infectedDamage() //player damage
					viruses[i].destroy() //set the particle to be removed 
				}
				if(viruses[i].ttl<=0 || !viruses[i].isAlive) viruses.splice(i,1) //remove particle from array
				
			}
		}

		push()
		scale(buildingScaleFactor)
		translate(flagpole.off_x+10,flagpole.off_y)
		renderFlagpole(flagpole)
		pop()

		//update & draw boss
		boss.draw()
		boss.update()
		//plays epilogue screen 
		if(epilogue) 
		{
			hY+=2 //var to control text height 
			hY =constrain(hY,0,roofPos-200)
			playEpilogue(hY)
		}
		if(player.lives<=0) //if player reaches 0 lives play splatter animation
		{
			textSize(30)
			stroke(255,0,0)
			text(`You failed.\nHumanity is doomed.\nPress space to continue`,width/2,height/2)
			splatter.addParticles(gameChar_world_x,player.char_y,2,0.05,-0.5)
			splatter.animate()
		}
		pop()
		//update, draw and check if player dies
		player.update()
		player.draw()
		player.checkPlayerDeath()
		//Falling check
		for(i=0;i<gapArray.length;i+=1)
		{
			if(gapArray[i].checkGap(gameChar_world_x,player.char_y))
				{
					player.isPlummeting = true 
					break
				}
		}
		//increase world player x location
		gameChar_world_x = player.char_x + scrollPos;
		//update and draw level progress bar 
		push()
		translate(width/2,0)
		levelProgressBar(enemiesArray.length)
		pop()
		//flag to start epilogue 
		if(gameChar_world_x>=(endX-buildingsArray[buildingsArray.length-1].width*buildingScaleFactor) && !boss.isAlive) epilogue = true
		
		//framerate text
		textSize(30)  
		fill(255)
		text(int(frameRate()),150,50)
		//flag to start final encounter
		if(
			gameChar_world_x>=buildingsArray[buildingsArray.length-1].		off_x*buildingScaleFactor && 
			enemiesArray.length==0
		  ) boss.mutation=true 
		//check for intro play screen
		if(intro)
		{
			playIntro(intro_timer)
		}
		
	}
}

function createPlatform(x,y,p_width,p_height)//creates platform objects
{
	platform=
	{
		x:undefined,
		y:undefined,
		p_width:undefined,
		p_height:undefined,
		setup:function(x,y,p_width,p_height)
		{
			this.x = 0
			this.y = 0
			this.off = createVector(x,y)
			this.p_width = p_width 
			this.p_height = p_height 
			this.bottomSpan = 100
			this.topSpan = 90 
			this.color = (152,172,195)
		},
		draw:function()
		{
		
			//platform base 
			stroke(100)
			strokeWeight(0.8)
			fill(this.color)
			rect(this.x,this.y+180,this.p_width,this.p_height)
		},
		checkContact:function(targetX,targetY,scaleX=1)
		{
			if(
				targetX> (this.off.x*scaleX) && 
				targetX < (this.off.x*scaleX)+this.p_width
				)
				{
						var d = int(this.off.y+165 - targetY)
						if(d >= 0 && d <5)return true
				}
				else return false 
		}
	}
		platform.setup(x,y,p_width,p_height)
		return platform 
}	

function levelProgressBar(enemiesLeft) //draws the level progress on top, according to how many enemies are left
{
	
	if(epilogue) return 
	fill(0,250,0)
	textSize(30)
	let txt = 'Nonimmune population: '
	text(txt,-320,25)
	push()
	for(i=enemiesLeft;i>0;i-=1)
	{
		image(enemy_icon,0+i*30,5,20,20)
	}
	pop()
}

function createBuilding(x,y,height,width) //creates main building objects
{
	building =
	{
		x_pos:undefined,
		y_pos:undefined,
		height:undefined,
		width:undefined,
		

		setup: function(x,y,height,width)
		{
			this.off_x = x
			this.off_y = y
			this.x_pos = 0
			this.y_pos = 0
			this.height = height
			
			this.width = width
			this.windowPaddingTop=5
			this.windowPaddingSide = 5
			this.windowWidth= 10
			this.windowHeight= 10
			this.windowSide= this.windowWidth+ (this.windowPaddingSide*2)
			this.windowTop = this.windowHeight + (this.windowPaddingTop*2)
			this.pallete=[
				color(43,48,50), //gunmetal
				color(122,163,167), 
				color(221,222,222),
				color('#464e4d'),
				color('#778583')
			]
            this.sidePallete = [
                color(80,25,33)
            ]

			this.sideColor = this.sidePallete[int(random(0,0))] 
			this.color = this.pallete[int(random(0,3))]
			
		}, 
		draw:function()
		{
			//frame
			fill(this.color)
			stroke(0)
			rect(this.x_pos,this.y_pos-this.height,this.width,this.height)
			noStroke()

			//windows
			stroke(0)
			strokeWeight(0.2)
			noFill()
			let windowRow = int((this.height-50) / this.windowTop)
			let windowCol = int((this.width)/this.windowSide )
			for(k=0;k<windowRow;k+=1) 
				{
					
				for(j=0;j<windowCol;j+=1)
				{
					c = color(255,214,170)
					fill(c)
					rect(
						
						(this.x_pos+5)+j*this.windowSide, //x of window 
						(this.y_pos-this.height+5)+k*this.windowTop, //y of window
						this.windowWidth,//width of window
						this.windowHeight// height of window 
						) 
				}
			}
			
		//roof
			
			//floor
			fill(70)
			rect(
				this.y_pos-15,this.x_pos-this.height-20,
				this.width+30,55
				)
			//top side shader
			fill(60)
			

			//left side shader
				rect
				(
					this.y_pos-12.5,this.x_pos-this.height-20,
					1.5,50
				)
			
			//right side shader
			rect
            (
                this.y_pos+this.width+10.5,this.x_pos-this.height-20,
                1.5,50
            )		
			//bottom shader
			rect(
				this.x_pos-15,this.y_pos-this.height+24,
				this.width+30,5
				)
			
				rect(
					this.y_pos-15,this.x_pos-this.height-20,
					this.width+30,5)

			fill(this.sideColor)
			
			//bottom side border
			rect(
					this.x_pos-15,this.y_pos-this.height+25,
					this.width+30,10
					)
			//left side border
            
            noStroke()
            fill(this.sideColor)
            rect
            (
                this.y_pos-15,this.x_pos-this.height-20,
                2.5,50
            )
            //right side border 
            rect
            (
                this.y_pos+this.width+12.5,this.x_pos-this.height-20,
                2.5,50
            )
			//top side border
			
			fill(this.sideColor)
			rect( this.x_pos-15,this.y_pos-this.height-25,this.width+30,5)
            
           
		},	
	}
	building.setup(x,y,height,width)
	return building 
}

function createBackBuilding(x,y,height,width,roofNum) // creates BackBuilding objects
{
	backBuilding =
	{
		
		x:undefined,
		y:undefined,
		height:undefined,
		width:undefined,
		roofNum:undefined,

		setup: function(x,y,height,width,roofNum)
		{
			this.off_x = x
			this.off_y = y
			this.x_pos = 0
			this.y_pos = 0
			this.height = height
			this.width = width
			this.windowPaddingTop=5
			this.windowPaddingSide = 5
			this.windowWidth= 10
			this.windowHeight= 10
			this.windowSide= this.windowWidth+ (this.windowPaddingSide*2)
			this.windowTop = this.windowHeight + (this.windowPaddingTop*2)
			this.pallete=[
				color(43,48,50), //gunmetal
				color(122,163,167), 
				color(221,222,222),
				color('#464e4d'),
				color('#778583')
			]
            this.sidePallete = [
                color(80,25,33)
            ]
			
			this.roofNum = roofNum
			this.sideColor = this.sidePallete[int(random(0,0))] 
			this.color = this.pallete[int(random(0,3))]
			
		}, 
		draw:function()
		{
			//frame

			fill(this.color)
			stroke(0)
			rect(this.x_pos,this.y_pos-this.height,this.width,this.height)
			noStroke()
			
			
			//windows
			let windowRow = int((this.height-50) / this.windowTop)
			let windowCol = int((this.width)/this.windowSide  )
			stroke(0)
			strokeWeight(0.2)
			noFill()
			for(k=0;k<windowRow;k+=1) 
				{
					
				for(j=0;j<windowCol;j+=1)
				{
					//fill(255,214,170)
					
					if( ((k+j) / 2)%3==0)
					{
						c = color(255,214,170)
					}
					else if(((k+j) / 2) %2==0)
					{
						c = color(160,200,220)
						
						fill(c)
						
					}
					else 
					{
						c = color(50)
					}
					fill(c)
					
					
					rect(
						//k*18+buildingsArray[i].x_pos+5, // x_pos
						(this.x_pos+5)+j*this.windowSide,
						//j*50+(buildingsArray[i].y_pos-400), // y_pos
						(this.y_pos-this.height+5)+k*this.windowTop,
						this.windowWidth,//width of window
						this.windowHeight// height of window 
						) 
				}}
			

			//Roof
			noFill()
			noStroke()
			roof_drawings[this.roofNum](
				0,
				-this.height,
				this.width,
				50,
				this.color        
				)
		},
		
		
	}
	backBuilding.setup(x,y,height,width,roofNum)
	return backBuilding 
}

function createBboard(x,y,height,width,iconList,scale) //creates BillBoard objects
{
    Bboard =
    {
        x:undefined,
        y:undefined,
        height:undefined,
        iconList:undefined,
        width:undefined,
		scale:undefined,

        setup:function(x,y,width,height,iconList,scale)
        {
            this.x = 0 
            this.y = 0
			this.off = createVector(x,y)
            this.height = height 
            this.width = width 
            this.icon =undefined  
			this.pallete
			this.color = 150
			this,iconList = iconList
			this.sc = scale 
			this.meme = iconList[int(random(0,iconList.length))]
			this.bb_width  = width *4
			this.bb_height = height 
			this.p_width; 
			this.p_height; 
			this.bottomSpan; 
			this.topSpan; 
			this.bottomSpan = 100
			this.topSpan = 90

			//post fields
			this.postY = this.y + this.bb_height - 120
			this.postHeight = 140
			this.postWidth = 12
			this.bb_bottom 
        },
        draw: function()
        {
			
			//column bases
			strokeWeight(5)
			fill(this.color-50)
			stroke(this.color)
			
			rect(this.x,this.postY,this.postWidth,this.postHeight)               //left post 
			rect(this.x+this.bb_width/2,this.postY,this.postWidth,this.postHeight )  //middle post 
			rect(this.x+this.bb_width-12.5,this.postY,this.postWidth,this.postHeight )  //right post 

		
			
			strokeWeight(3)
			stroke(100)
			line(this.x+this.postWidth,
				this.postY+50, // left 
				
				this.x+this.bb_width/2,
				this.postY-this.postHeight+140) // right 

			line(this.x+this.postWidth, this.postY,//left 
				
				this.x+this.bb_width/2,this.postY+50) //right 
				


			line(this.x+this.bb_width/2+this.postWidth,
					this.postY+50, // left 
					
					this.x+this.bb_width-this.postWidth,
					this.postY-this.postHeight+140) // right 
	
			line(this.x+this.postWidth+this.bb_width/2, this.postY,//left 
					
					this.x+this.bb_width-this.postWidth,this.postY+50) //right 
			
			strokeWeight(4)
			stroke(100)
			//left spotlight stand 
			line(this.x,this.postY, this.x-15,this.postY+50)	 
			//right spotlight stand
			line(this.bb_width,this.postY,
				this.bb_width+15,this.postY+50)
			
			angleMode(RADIANS)
			//left spotlight box
			arc(this.x-12,this.postY+45,30,30,1,3.5,CHORD)
			//right spotlight box
			arc(this.bb_width+12,this.postY+45,30,30,-0.4,-3.9,CHORD)

			stroke(this.color)
			strokeWeight(4)

			fill(255)
			//frame 
			rect(this.x,this.y-120,this.bb_width,this.bb_height)
			
			noFill()
			image(this.meme,this.x,this.y-120,this.bb_width,this.bb_height)

			noStroke(0)
			fill(255,245,210,30)
			//left spotlight source
			triangle(
				this.x-12,this.postY+45, // spotlight source  
				this.x+this.bb_width,this.postY-this.bb_height, //right corner 
				this.x+10,this.postY-this.bb_height   //left corner
					)
				
			//right spotlight source
			triangle(
				this.bb_width+12,this.postY+45, // spotlight source  
				this.x,this.postY-this.bb_height, //right corner 
				this.bb_width-10,this.postY-this.bb_height   //left corner
					)
			
			angleMode(DEGREES)
        }
		
}
    Bboard.setup(x,y,height,width,iconList)
    return Bboard  
}

function projectileChecking(projectileX,projectileY,projectileWidth,projectileHeight,targetX,targetY,targetWidth,targetHeight)//collision checking function for projectiles with a simple rectangle box  
{
		var projectileBox = 
		{
			x:projectileX,
			y:projectileY,
			height:projectileHeight,
			width:projectileWidth,
		}
		var collisionBox = 
		{
			x:targetX,
			y:targetY,
			height:targetHeight,
			width:targetWidth
		} 
		
		if(
			(projectileBox.x+projectileBox.width) > collisionBox.x && 
			(projectileBox.x+projectileBox.width)  < (collisionBox.x+collisionBox.width) && 
			(projectileBox.y+projectileBox.height) > collisionBox.y &&
			(projectileBox.y+projectileBox.height) < (collisionBox.y+collisionBox.height)
		  ) return true 
		return false 

}

function createEnemies(x,y,size,img,hp)
{
	var enemy = new Enemy(x,y,size,img,hp)
	return enemy 
}

function drawStars(starsArray) //instead of clouds 
{
	for(i=0;i < starsArray.length;i+=1)
	{

		fill(255)
		ellipse(
					starsArray[i].x_pos,starsArray[i].y_pos,
					starsArray[i].size,starsArray[i].size
				)
	
	
	}
}

function drawMoon(x,y)   
{
	noStroke()
	fill(255)
	ellipse(x,y,100,100,10)
}

function Player(playerDrawings,spawn_x,spawn_y) 
{
	this.images = playerDrawings 
	this.char_x = spawn_x
	this.char_y = spawn_y 
	this.isInfected= false 
	this.isFalling = false 
	this.isJumping= false 
	this.isRight = false 
	this.isLeft = false 
	this.isPlummeting = false
	this.isOnPlatform= false 
	this.isDamaged= false 
    this.isOnRoof = true 
	this.dt = 1.2
	this.dy=0
	this.dx=0
	this.ax = 1
	this.ay = 1.3
	this.off_y = 30
	this.off_x = 0
    this.step=0
	this.timeStep = 0 
	this.size = 30
	this.hpBarWidth = 50
	this.lives = 3
	this.hp = 100
	this.damage = 10
	this.player_scale = 1.7
	this.draw = function() 
	{
		
		if(this.hp<=0 || this.lives==0) return //guard function returning when player is dead or without lives

		//Score display
		if(!epilogue)
		{
			fill(0,200,0)
			text(`Score: ${scoreCounter}`,0,height-10)
			noFill()
		}
		
		//floating damage text
		if(this.isDamaged )
		{
			if(second() % 3!=0) //allows text to float for 1-2 seconds
			{
				this.floatingText.x += 0.1
				this.floatingText.y -= 1
				push()
				translate(this.char_x-30,this.char_y-100)		
				fill(255)
				textSize(32)
				text(`-${this.damage}`,this.floatingText.x,this.floatingText.y) 
				pop()
			}
			
		}
		else 
		{
			this.isDamaged= false 
		}
		
		if(this.isRight&&this.isFalling)
		{
			push()
			translate(this.char_x+this.off_x,this.char_y+this.off_y)
			scale(this.player_scale)
			this.images.jumping_r(0,0)
			pop()
		}
		else if(this.isFalling && this.isLeft)
		{
			
			push()
			translate(this.char_x+this.off_x,this.char_y+this.off_y)
			scale(-this.player_scale,this.player_scale) // player drawings are hard coded so mirror flipping is easier 
			this.images.jumping_r(0,0)
			pop()
		}
		else if(this.isLeft)
		{
			
			this.step+= 0.5 // step counter for animated walk
			push()
			translate(this.char_x+this.off_x,this.char_y+this.off_y)
			scale(-this.player_scale,this.player_scale) // player drawings are hard coded so mirror flipping is easier 
			this.images.walking_r(0,0,this.step)
			pop()
		}
		else if(this.isRight)
		{
			this.step+= 0.5 // step counter for animated walk
			push()
			translate(this.char_x+this.off_x,this.char_y+this.off_y)
			scale(this.player_scale)
			this.images.walking_r(0,0,this.step) 
			pop()
			
		}
			
		else if(this.isFalling || this.isPlummeting)
		{
			
			push()
			translate(this.char_x+this.off_x,this.char_y+this.off_y)
			scale(this.player_scale)
			this.images.jumping_f(0,0)
			pop()
		}
		
		else 
		{
			push()
			translate(this.char_x+this.off_x,this.char_y+this.off_y)
			scale(this.player_scale)
			this.images.standing_f(0,0)
			pop()
		}

	}
	this.update = function () 
	{
		if(intro) return 
		if(this.hp<=0 || this.lives==0) return //guard function returning when player is dead or without lives
		if(this.isJumping)
		{	
			if(this.isOnPlatform)
			{
				this.char_y += this.dy * this.dt
			}
			else 
			{
				this.dx+= (this.ax*this.dt) 
				this.char_y += (this.dy * this.dt)
				this.char_y = constrain(this.char_y,0,roofPos+80)
				this.char_x += (this.dx * this.dt)  	
			}
		}
		if(this.isLeft)
		{
			if(gameChar_world_x<=0) return //guard function returning when player is at the left edge of the level
			if(this.char_x>width * 0.4)
			{
				this.dx+= this.ax * this.dt 
				this.char_x -= (this.dx*this.dt)
				this.dx = constrain(this.dx,0,6)
			}
			else 
			{
				this.dx+= this.ax * this.dt
				this.dx = constrain(this.dx,0,10) 
				scrollPos-= this.dx
			}
		}
		if(this.isRight)
		{
			if(gameChar_world_x>=endX) return  //guard function returning when player is at the right edge of the level
			if(this.char_x < width * 0.6)
			{
				this.dx+= this.ax * this.dt 
				this.char_x += (this.dx*this.dt)
				this.dx = constrain(this.dx,0,6)
			}
			else
			{
				this.dx+= this.ax * this.dt 
				this.dx = constrain(this.dx,0,10)
				scrollPos+= this.dx 
				
			}
		}
		if(this.char_y < roofPos+80)//gravity and platform collision 
		{
			for(var i =0;i<platformsArray.length;i+=1)
			{
				this.isOnPlatform = false
				var platformCheck = platformsArray[i].checkContact(gameChar_world_x,this.char_y,buildingScaleFactor)
				
				if(platformCheck)
				{
					this.isOnPlatform = true
				
					break 
				}
				else 
				{
					
					this.isOnPlatform=false 
					continue
				}
				
			}

			if(!this.isOnPlatform )
			
			{
				this.dy+= (this.ay * this.dt)  
				this.char_y += (this.dy *this.dt) 
				this.char_y = constrain(this.char_y,0,roofPos+80)
				this.isFalling = true
				this.isJumping=false 
			}
			else 
			{
				this.char_y = constrain(this.char_y,0,roofPos+80)
				this.isFalling=false 
			}

		}
		else 
		{
			this.isFalling= false 
		}
		if(this.isPlummeting)
		{ 
			this.dy+= this.ay * this.dt 
			this.char_y  += this.dy + this.ay
		}
	}
	this.checkPlayerDeath= function() 
	{
		if(this.char_y > roofPos+500 || this.hp<=0)  // checks whether player has fallen and reduces lives
		{
			
			this.lives -=1
			this.lives = constrain(this.lives,0,3)
			if(this.lives>0)
			{	
				deathSound.play()
				resetGame(this.lives) //resets game if player dies
				return true  
			}
		}
		else  // drawing and updating hp Bar and life tokens above player
		{
			let hpHeight = 5
			let hpLeft=(this.hpBarWidth * this.hp ) /100
			push()
			translate(this.char_x-25,this.char_y-100)		
			fill(0,200,0) //green 
			rect(0,0,hpLeft,hpHeight)
			pop()

			//drawing syrringes as live tokens 
			//loop contains transformations within 
			for(i=0;i<this.lives;i+=1)
			{
				push()
				translate(this.char_x-25+i*25,this.char_y-125)
				rotate(90)
				noFill()
				stroke(0)
				fill(0)
				//body
				fill(0,100,0)
				rect(0+1,0,10,5)	
				noFill()
				//needle
				rect(0+10,0+2,10,1)
				//piston
				rect(0-1,0-2.5,1,10)
				rect(0-9,0+2,7,1)
				rect(0-11,0,1,5)
				pop()	
						
			}
			return false 
		}
	}
	this.vaccinate= function(playerV,mouseV) // attacking object constructor 
	{
		vaccine = {
			
			mouseV:undefined,
			position:undefined,
			dir:undefined,
			ttl:undefined,
			isAlive:undefined,
			velocity:undefined,

			setup:function(playerV,mouseV)
			{
				this.mouseV = mouseV  //target vector 
				this.position = createVector(playerV.x,playerV.y) //spawn position vector
				this.dir = p5.Vector.sub(this.mouseV,this.position) //rotation vector
				this.dir.normalize()
				this.velocity = this.dir.copy()
				this.velocity.mult(7)
				this.ttl = 140    //time to live 
				this.isAlive = true  
				this.width= 10 
				this.height = 5
				
			},
			draw:function()  
			{
				if(!this.isAlive || this.ttl <=0) return 
				push()
				angleMode(DEGREES)
				translate(this.position.x,this.position.y) 
				rotate(this.dir.heading())   //rotates to cursor location
				noFill()
				stroke(0)
				fill(0)
			//body
				fill(0,100,0)
				rect(0+1,0,10,5)	
				noFill()
			//needle
				rect(0+10,0+2,10,1)
				//piston
				rect(0-1,0-2.5,1,10)
				rect(0-9,0+2,7,1)
				rect(0-11,0,1,5)
				pop()
			},
			update: function() 
			{
				if(this.ttl==0) return this.isAlive = false  // guard condition 

				if(this.isAlive)
				{
					this.ttl-=1
					this.position.add(this.velocity)
				} 
				
			},
			
			destroy: function() //called explicitly within main draw() loop to make sure projectile gets removed
			{
				this.isAlive = false  
				delete(this)
			}
	}
	vaccine.setup(playerV,mouseV)
	return vaccine 
	}

	this.checkDamage = function() 
	{
		
		if(this.lives<=0) return //guard condition
		this.hp-=this.damage	
		playerHitSound.play()
		//floating damage text
		this.floatingText = createVector(0,0)
		this.floatingText.x += 0.1
		this.floatingText.y -= 1
		
		if(this.floatingText.y < this.char_y-100)  // condition limits text Y location  
		{
			push()
			translate(gameChar_world_x,this.char_y-100)		
			fill(255)
			textSize(32)
			text(`-${this.damage}`,this.floatingText.x,this.floatingText.y) 
			pop()
		}
			
		
	}
	this.infectedDamage = function() //called when damaged from boss
		{
			this.floatingTextDot = createVector(0,0)
			this.floatingTextDot.x -= 0.1
			this.floatingTextDot.y -= 1
			let damage = 1
			this.hp-=damage
			push()
			translate(gameChar_world_x,this.char_y-100)		 
			textSize(32)
			text(`-${damage}`,this.floatingTextDot.x,this.floatingTextDot.y)
			pop()
		}
	
}

function Enemy(x,y,size,icon,hp) //enemy constructor function
{
	this.off= createVector(x,y);
	this.pos= createVector(0,0)
	this.size = size 
	this.icon = icon 
	this.isAlive = true 
	this.hp = hp 
	this.sc = 3
	this.targetV
	this.icon.width = this.size*0.9
	this.icon.height = this.size 
	
	this.draw = function() //draws enemy
	{
		if(!this.isAlive || this.hp<=0) return //guard condition
		image(this.icon,this.pos.x,this.pos.y-20)
		
	}
	this.update = function() //updates location
	{
		if(!this.isAlive || this.hp<0) return //guard condition
		this.pos.x +=random(-1,1)
		this.pos.x = constrain(this.pos.x,this.pos.x,this.pos.x+10) //constrains enemies on the roof
	}	
	this.checkDamage = function() //check for damage and reduce hp
	{
		this.hp-=50
		enemyHitSound.play()
		this.icon.filter(INVERT) //inverts color when hit 
		if(this.hp ==0) return this.isAlive=false 	//guard condition if hp ==0
	}
		
	this.checkContact = function(inputX,inputY) //checks whether player is collided with enemy
	{
		if(!this.isAlive) return  // guard condition if already dead
		let d = int(dist(inputX,inputY,this.off.x,this.off.y)) 
		if(d <80 ) return true 
		return false 
		
}
	this.attack = function(numberOfAttacks,x,y) //pushes poster attack objects to array
	{
		let targetX = random(x-50,x+50)  //gives a little randomness for targeting can be reduced to make game harder
		let targetY = random(y-50,y+50)  // as above 
		if(enemyShootersArray.length<5)   
		{
			for(i=numberOfAttacks;i>0;i-=1)
			{
				enemyShootersArray.push(posterAttack(targetX,targetY,this.off.x,this.off.y))
			}
		}
	}
	this.destroy = function() //makes sure enemy is flagged dead 
	{
		if(!this.isAlive) delete(this)
	}
}

function posterAttack(targetX,targetY,fromX,fromY) //constructor function for enemy attack projectile objects
{
		var poster =
		{
			targetX:undefined,
			targetY:undefined,
			fromX:undefined,
			fromY:undefined,
			
			setup: function(targetX,targetY,fromX,fromY,memes)
			{

				this.targetVec = createVector(targetX,targetY) //target vector 
				this.targetVec.y = this.targetVec.y -30 	//offset to aim towards player head
				this.velocity = p5.Vector.random2D() // random velocity 
				this.posterPos = createVector(fromX,fromY) // spawn location of object 
				this.dir= p5.Vector.sub(this.targetVec,this.posterPos) //auto targets player 
				this.image = poster_img
				this.width = 50
				this.height= 50
				this.speed=4.5
				this.isAlive= true 
				this.ttl=100
				this.dir.x = this.dir.x + random(this.dir.x-20,this.dir.x+20) //more randomness to reduce difficulty
				this.dir.y = this.dir.y + random(this.dir.y-20,this.dir.y+20) //as above
				this.dir.normalize()				
				this.dir.mult(this.speed)
			},     
			
			draw: function() //draws poster
			{
				if(!this.isAlive && this.ttl<=0) return   //makes sure poster projectile is alive before drawn
				fill(0)
				image(this.image,this.posterPos.x,this.posterPos.y,50,50)
				
			},		
			
			update: function() //updates poster projectile location
			{
				if(this.ttl<=0) 
				{
					this.destroy(); // make sure object is flagged dead 
					return
				}  
				if(this.ttl<=0 && !this.isAlive) return  //guard condition
				this.ttl-=1
				this.posterPos.add(this.dir)
			},
			
			// checkContact: function(targetX,targetY)
			// {
			// 	let d = int(dist(targetX,targetY,this.posterPos.x,this.posterPos.y))
			// 	if(d < 51 && !this.isAlive) return true 
			// 	// {
			// 	// 	this.isAlive=false 
			// 	// 	return true 
			// 	// }
				
			// 	return false 
				
			// },
			
			destroy: function() //function  ensures object is flagged dead 
			{	
				this.isAlive = false 
			},
		}
		poster.setup(targetX,targetY,fromX,fromY)
		return poster
}
    

function Boss(x,y,size,icon,hp) //Boss function
{
	this.pos = createVector(x,y)
	this.icon = icon 
	this.isAlive = true 
	this.hp = hp 
	this.isAttacking = false 
	this.target;
	this.timer = 150
	this.velocity = createVector(random(-1,1),random(-1,1))
	this.mutation = false  //flag for final encounter 
	this.damage = 10      //how much damage will be received
	this.size = size 
	this.draw = function()
	{
		if(this.hp<=0) return //ensures no drawing when dead

		this.size= this.mutation==false ? size : size + 200 //conditional variable ensures boss' size will increase when flagged for final encounter
		
		if(this.timer<30 && second() %5!=0) // drawing only for a few seconds before attacking
		{	
			this.icon.filter(INVERT)
			image(this.icon,this.pos.x,this.pos.y,this.size,this.size)
		}
		
	} 
	this.update= function()
	{
		
		if(this.hp<=0) return this.isAlive = false;   // guard condition
		if(this.mutation)   // flag for final encounter
		{
			this.mutatedAttack(  //final encounter attack function
				(buildingsArray[buildingsArray.length-1].off_x*buildingScaleFactor)+
				(buildingsArray[buildingsArray.length-1].width*(buildingScaleFactor-1)) 
			    ,roofPos) //arguments are the desired boss' final encounter static location in relation
			this.timer-=1 // var to time attacks correctly
			return 
		}
		
		this.target = p5.Vector.sub(createVector(gameChar_world_x,player.char_y),this.pos) // target vector to follow player 
		this.target.normalize()
		  //as above 
		
		if(!player.dx==0) this.timer-=1   //timer reduces every time player moves
		
		if(this.timer==0) {  //when timer reaches 0, attack
			this.pos.y+=1
			this.callAttack(50)
		}
	
		this.pos.x += int(random(-150,250))    //randomly changes position so player wont expect a steady attack
		this.pos.y += int(random(-10,10))		//as above 
		this.pos.x = constrain(this.pos.x,gameChar_world_x-500,gameChar_world_x+500) // constrains boss' location close to player
		this.pos.y = constrain(this.pos.y,player.char_y-600,player.char_y)
	}
	this.attack = function(directionV,spawnV) // attack projectiles constructor function
	{
		virus = 
		{
			directionV:undefined,
			spawnV:undefined,

			setup:function(directionV,spawnV)
			{
				this.directionV = directionV
				this.spawnV = spawnV 
				this.position = createVector(spawnV.x,spawnV.y)
				this.ttl = 200
				this.isAlive = true
				this.directionV.normalize()
				this.directionV.mult(5)
				this.size = 10
			},
			draw:function() //draws projectile
			{
				if(this.ttl==0) return // guard condition 
				image(boss_img,this.position.x,this.position.y,this.size,this.size)
			},
			update:function() //updates projectile location  
			{
				if(this.ttl<=0) return this.isAlive=false //guard condition if particle despawned
				this.ttl-=1 //reduces life time
				this.position.add(this.directionV)
			},
			destroy:function() //function  ensures object is flagged dead 
			{
				this.isAlive=false 
			}
			
		}
		virus.setup(directionV,spawnV)
		return virus 
	}
	this.callAttack = function(numAt) // Attack calling function, receives argument for number of projectiles
	{
		if(this.hp<=0) return // guard condition returning if boss is dead
		bossRadialAttack(numAt) 
		this.timer = 150 // resets attack timer 
	}
	this.mutatedAttack = function(staticX,staticY) //attack function for final encounter
	{
		
		if(this.hp<=0) return //ensures no attacks if dead 
		if(second()%5==0 & this.timer<30) this.callAttack(200) //attacks every 5 seconds if the timer is less than 30
		this.pos.x = constrain(this.pos.x,staticX,staticX)     //limits movement to Y axis 
		this.pos.y = constrain(this.pos.y,staticY-500,staticY+300) 
		this.pos.y+= int(random(-10,10))                 
	}
	this.checkDamage = function() //reduces hp if damage received
	{
		if(!this.mutation) return //no damage received if not in final encounter
		this.hp -= this.damage 
		bossDeadSound.play()
	}
}

function collectible(x,y) // collectible object constructor function
{
   var collectible = 
   {
      
    	off:undefined,
    	setup: function(x,y)
		{
			this.x= 0
			this.y = 0
			this.isFound = false
			this.off = createVector(x,y)
			this.angle = 0
			this.rotation = 0
			this.width = 13 
			this.height = 6
		},
		draw:function() //draws and rotates collectible
		{
			this.rotation= cos(this.angle)*3
			noFill()
			fill(255,255,255)
			stroke(0,0,0)
			strokeWeight(0.5)
			image(cat_smile,this.x-6.5,this.y-47,this.width,this.height)
			this.angle +=1
		},
		checkCollectable:function(targetX,targetY) // checks whether collectible was found
		{
			let d = int(dist(targetX,targetY+160,this.off.x,this.off.y))
			if (d<=25)
				{
					this.isFound = true;
					return true 
				}
				else 
				{
					return false 
				}
					
		}
} 
	collectible.setup(x,y)	
  	return collectible
}


function bossRadialAttack(numAt) // boss' projectile array population function, receives number of projectiles as arg
{
	for(let i=1;i<numAt;i+=1)
		{
			let spawnV = boss.pos.copy()
			let radius = boss.size
			let angle = (((360 / numAt) * i) * PI) / 180 //changes spawn location per projectile depending on their number
			//makes sure projectiles are spawned radially 
			spawnV.x += radius*Math.sin(angle)
			spawnV.y += radius*Math.cos(angle)
			dirVector = p5.Vector.fromAngle(degrees(angle),10)   
			viruses.push(boss.attack(dirVector,spawnV))
		}
}


function enemyAttack(enemyObj,numberOfAttacks) //enemy projectile attack call function. Populates enemyShooters array
{	
	for(i=numberOfAttacks;i>0;i-=1)
	{
		enemyShootersArray.push(enemyObj.attack())
	}
}

function keyPressed()
{	
	if(key == 'A' || keyCode == 65)
	{	
		if(player.char_y<=roofPos+100) player.isLeft = true 
	}
	if(key == 'D' || keyCode == 68)
	{
		if(player.char_y<=roofPos+100) player.isRight=true	
	}
	
	if (keyCode==32) 
	{
		if(player.lives==0) return window.location.reload() // when player is dead refreshes the window to reset game
		if(!player.isFalling && !player.isPlummeting)
		{		
			player.isJumping = true 
			player.dy = -30
			jumpSound.play();
		}
        
	}
	if(keyCode== 27) //sets pause flag when pressing escape
	{
		if(isPaused)  isPaused = false 
		else 
		{
			isPaused = true 
		}
		
	}	
}

function keyReleased()
{	
	
	if(key == 'A' || keyCode == 65)
	{
		player.isLeft=false
		player.step = 0
		player.dx = 0
	}

	if(key == 'D' || keyCode == 68)
	{
		player.isRight=false
		player.step = 0
		player.dx =0 
	} 
}

function mousePressed() //creates player attack projectiles 
{
	if(intro) return 
	mouseV = createVector(mouseX+window.scrollPos,mouseY) //mouse vector to find direction 
	playerV = createVector(gameChar_world_x,player.char_y-50) //player vector to measure direction
	shootersArray.push
	(
		player.vaccinate(playerV,mouseV)
	)
	
}

function createGap(x,y,width) //creates 'gap' objects between buildings for falling checks. Instead of canyons.
{
    gap = 
    {
        x:undefined,
        y:undefined,
        width:undefined,
        setup:function(x,y,width)
        {
            this.x= 0 
            this.y = 0
            this.off_x = x
            this.off_y = y 
            this.width = width
            this.isOver = false  
        },
        checkGap:function(targetX,targetY) // function to check whether player is above and within falling distance 
        {
            if
			(
				int(targetX/buildingScaleFactor) > this.off_x && 
				int(targetX/buildingScaleFactor) < this.off_x+this.width-35
			)
            {
				let d = int(targetY - (this.off_y)  )  
				if(d >= 0 && d<=30 )
				{
					return true 
				}
            }
			else 
			{
				return false 
			}

        }
    }
    gap.setup(x,y,width)
    return gap
}

function playIntro(intro_timer) //plays intro screen for defined time amount
{
	
	let timer = abs((intro_timer - Date.now()) / 1000) // measures time passed between when called and run
	intro_screen.background(0)
	intro_screen.textAlign(CENTER,CENTER)
	intro_screen.textSize(32)
	intro_screen.stroke(255)
	intro_screen.fill(200,200,0,)

	if(timer <=15) // plays first intro screen for about 15 seconds
	{
		intro_screen.text(intro_text.text,intro_screen.width/2,intro_screen.height/2)
		image(intro_screen,intro_text.x,intro_text.y, width,height)
	} 
	else if(timer>= 15 && timer <= 25)	// plays second intro screen for about 10 seconds
	{
		intro_screen.text(intro_text.instruction_text,intro_screen.width/2,intro_screen.height/2)
		image(intro_screen,intro_text.x,intro_text.y, width,height)
	}
	
	else //stops intro by setting flag to false when display time ends for both screens
	{
		intro = false
	}
}

function playEpilogue(hY) //plays epilogue helicopter animation and stage
{
	if(hY != roofPos-200)  //when helicopter reaches roof position, epilogue screen plays
	{
		push()
		translate(buildingsArray[buildingsArray.length-1].off_x*buildingScaleFactor+100,hY)
		image(helicopterGif,0,0,600,300)
		helicopterGif.play()
		helicopterSound.play()
		pop()
	}
	else // plays epilogue text
	{
		helicopterSound.stop()
		helicopterGif.pause()
		createCanvas(width,height)
		background(0)
		drawStars(starsArray)
		epilogue_text.y-=1
		push()
		fill(200,200,0)
		textSize(42)
		translate(width/2,height+500)
		textAlign(CENTER,CENTER)
		text(epilogue_text.text,epilogue_text.x,epilogue_text.y)
		pop()
		return 
	}
}

function startGame()
{
	//spawns boss and player objects
	boss = new Boss(100,100,50,boss_img,100)
	player = new Player(player_drawings,0,570)
	
	//building, billboard,enemy,collectibles array population loop
	let buildingsNumber = 15  //var to control how many buildings will spawn
	for(i=0;i<buildingsNumber;i+=1)
	{
		var x_pos = 0+(i*250)   //var to set distance between buildings 
		var widthBuilding= int(random(150,200)) //var to set width of each building
		if(prevBuild!=undefined)    //guard condition when spawning the first building
		{
			if( prevBuild.width+prevBuild.off_x > x_pos) // if previous building's width is more than the set distance between buildings make sure the set distance changes according to previous building's dimensions
			{
				x_pos = prevBuild.width+prevBuild.off_x          
			}
		}

		//buildings
		let buildingHeight = 200 // var to set building Height
		if(i<buildingsNumber-1) buildingsArray.push(createBuilding(x_pos,roofPos-200,buildingHeight,widthBuilding)) // if the last building has not been reached, populate the array with normal buildings

		if(i==buildingsNumber-1) buildingsArray.push(createLastBuilding(buildingsArray[i-1].off_x+250,roofPos-250,200,400,true)) //if the last building has been reached , populate the array with the last hospital building
		
		//billboards
		if(i%2==0) //populate every other building with a billboard
		{
			if(i>= (buildingsNumber-1)) break   //if its the last building no billboard
			let bBoardHeight = 300 //var to set billboard height 
			bBoardArray.push( createBboard(x_pos,roofPos-280,buildingsArray[i].width,bBoardHeight,meme_list,buildingScaleFactor)) //populate billboard according to existing buildings 
		}
		//gaps 
		if(prevBuild!=undefined)  //if there exists no previous building, dont make a gap
		{
			gapArray.push   //populates the gapArray with gaps according to existing buildings
			(				//automatically adjusts the gap width 
				createGap(
					prevBuild.off_x+prevBuild.width+10,
					roofPos+50,
					buildingsArray[i].off_x - (prevBuild.off_x+prevBuild.width-10) 
					)
			)}
	
		prevBuild = buildingsArray[i] // var assigns the prevBuild for measurements of the next building
	}
	
	let buildingsLength = buildingsArray.length -1			//var to hold the buildingsArray length, used in populating enemies,collectibles etc
	endX = 															//var to measure end of level									
	(buildingsArray[buildingsLength].off_x * buildingScaleFactor)+
	(buildingsArray[buildingsLength].width*buildingScaleFactor)
	
	flagpole.off_x = //sets flagpole object's location
	buildingsArray[buildingsLength].off_x + buildingsArray[buildingsLength].width
	
	flagpole.off_y = buildingsArray[buildingsLength].off_y-buildingsArray[buildingsLength].height	//as above

	// //enemy & collectibles creation
	let enemiesPerBuilding= 2  // var to set enemy number per building
	let enemySize = 140			//var to set enemy size 
	let enemyHp = 100			//var to set enemy HP 
	buildingScaleFactor = 4		//var to hold building scale, used for measurements collision checking etc
	let collectiblesY = roofPos+240 //var to set collectible Y location
	
	for(i=0;i<buildingsArray.length;i+=1) //enemy array population loop
	{
		if(buildingsArray.length<2) return //guard condition to avoid 
		if(i==buildingsLength) break //guard condition to stop spawning before last building

		if(i %2==0) //spawn enemies && collectibles every other building
		{
			for(j=enemiesPerBuilding; j>0; j-=1)
			{

				enemy = new Enemy(
					(buildingsArray[i].off_x+buildingsArray[i].width/2)*buildingScaleFactor,
					roofPos,
					enemySize,
					enemy_img,
					enemyHp)
				enemiesArray.push(enemy) 
				collectiblesArray.push(
					collectible((
						buildingsArray[i].off_x+buildingsArray[i].width/2)*buildingScaleFactor+(j*60),
						collectiblesY))
			} 
		}
	}
	//platforms creation on billboards
	let platformY = bBoardArray[0].off.y // var to set platform location Y on billboards
	let p_height = 15 // var to set platform height 
	for(let i=0;i<bBoardArray.length;i+=1) //platform population loop
	{
		let p_width = bBoardArray[i].width*buildingScaleFactor //var to set platform width according to which billboard is assigned
		let platformX = bBoardArray[i].off.x  //var to set platform locationx according to which billboard it is assigned
		platformsArray.push(createPlatform(platformX,platformY,p_width,p_height))
	}
	// Variable to control the background scrolling.
	scrollPos = 0;
	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = player.char_x + scrollPos;
	starsArray = [
	{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},
	{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},
	{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},
	{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	},{
		x_pos:random(0,width)
		,y_pos:random(0,400),
		size:5
	}
	] //stars array holds star locations
	progressTotal = enemiesArray.length //var to measure level progress
	backgroundSound.play()
}

function resetGame(lives) //resets game when player dies, takes in lives left as argument
{
	if(lives) player.lives = lives //sets player lives 
	//resets locations, timers, hp and plummeting flag in case player fell
	
	boss.pos.x = 100
	boss.pos.y = 100
	boss.timer = 100
	player.char_y = roofPos + 80 
	player.char_x = 0 
	player.hp = 100
	gameChar_world_x = 0 
	scrollPos = 0 
	player.isPlummeting=false 
}

function bloodParticle(x,y,xSpeed,ySpeed,size) //bloodparticle constructor function
{
	var bloodParticle = 
	{
		x:undefined,
		y:undefined,
		ySpeed:undefined,
		xSpeed:undefined,
		size:undefined,
		setup:function(x,y,xSpeed,ySpeed,size)
		{
			this.pos = createVector(0,0)
			this.off = createVector(x,y)
			this.ttl = random(50,100)
			this.velocity = createVector(random(-1,1),random(-1,0))
			this.acceleration = createVector(xSpeed,ySpeed)
			this.color = color(255,0,0)
			this.size = size 
		},
		draw:function() //draws the particle
		{
			fill(this.color)
			ellipse(this.pos.x,this.pos.y,this.size,this.size)
		},
		update:function() //updates the particle and its ttl
		{
			this.ttl-=1
			this.velocity.add(this.acceleration)
			this.pos.add(this.velocity) 
			
		},
		checkParticle:function() //checker function for particle ttl
		{
			
			if(this.ttl<=0) return true
		}
	}
	bloodParticle.setup(x,y,xSpeed,ySpeed,size)
	return bloodParticle
}

function SplatterAnimation(particleSize) //function to animate bloodparticles when player falls with a last life token
										//takes in particle size as argument
{
	this.particles = []
	this.timer = 65
	this.particleSize = particleSize
	
	this.animate = function() //animates bloodparticles 
	{
		for(i=0;i<this.particles.length;i+=1) //particle drawing loop
		{
			push()
			translate(this.particles[i].off.x,this.particles[i].off.y)
			this.particles[i].draw()
			this.particles[i].update()
			pop()	
			if(this.particles[i].checkParticle()) //if particle expired remove from array
			{
				this.particles.splice(i,1) 
				continue
			}
		}
	}
	this.addParticles = function(initX,initY,size,xSpeed,ySpeed) //function to add more particles, expires when timer reaches 0
	{
		if(this.timer<=0) return 
		this.xSpeed = xSpeed 
		this.ySpeed = ySpeed 
		this.initialPos = createVector(initX,initY,)
		this.particleSize =size
		if(this.timer>=35) this.particles.push(   //adds different sized particles if timer >=35
												bloodParticle(this.initialPos.x,this.initialPos.y,this.xSpeed/2,this.ySpeed/2,this.particleSize*3)
												)
		
		if(this.timer<=35)this.particles.push( //as above, if timer <=35
											  bloodParticle(this.initialPos.x,this.initialPos.y,this.xSpeed/2,this.ySpeed/2,this.particleSize)
											 )
		this.timer-=1
	}
}

function createLastBuilding(x,y,height,width,roofTop) //constructor function for hospital Building. Receives a roofTop flag to change the layout
{
	building =
	{
		x_pos:undefined,
		y_pos:undefined,
		height:undefined,
		width:undefined,
		roofTop:false,

		setup: function(x,y,height,width,roofTop)
		{
			this.off_x = x
			this.off_y = y
			this.x_pos = 0
			this.y_pos = 0
			this.height = height
			this.roofTop = roofTop 
			this.width = width
			this.windowPaddingTop=5
			this.windowPaddingSide = 5
			this.windowWidth= 20
			this.windowHeight= 10
			this.windowSide= this.windowWidth+ (this.windowPaddingSide*2)
			this.windowTop = this.windowHeight + (this.windowPaddingTop*2)
			this.pallete=[
				// color(43,48,50), //gunmetal
				// color(122,163,167), 
				// color(221,222,222),
				// color('#464e4d'),
				// color('#778583'),
				color(255)
			]
            this.sidePallete = [
                color(80,25,33),
				color(130)
            ]
			this.sideColor = this.sidePallete[1]
			this.color = this.pallete[0]
		}, 
		draw:function() // hospital building drawing function 
		{
			//frame
			fill(this.color)
			strokeWeight(0.5)
			stroke(200)
			rect(this.x_pos,this.y_pos-this.height,this.width,this.height)
			noStroke()
			fill(255)

			//windows
			stroke(0)
			strokeWeight(0.2)
			noFill(0)
			let windowRow = int((this.height-50) / this.windowTop)
			let windowCol = int((this.width)/this.windowSide )
			let c1 = color(225,254,250)	
			let c2 = color(0,143,255)
			let stripeOffset = 75.5
			for(k=0;k<windowRow;k+=1) //window drawing loop
				{
					if(k<3) continue 
					
					noStroke()
					fill(c2)
					if(k%2==0)
					rect(this.x_pos,
						(this.y_pos-this.height)+stripeOffset+(k*10),
						this.width,
						9
						)
						stroke(1)
				for(j=0;j<windowCol;j+=1)
				{
					if(j%3==0) continue 
					fill(c1)
					
					//fill(255,214,170)
					//c = color(225,254,250)	
					//c = color(255,214,170)
					
					
					
					
					rect(
						//k*18+buildingsArray[i].x_pos+5, // x_pos
						(this.x_pos+5)+j*this.windowSide,
						//j*50+(buildingsArray[i].y_pos-400), // y_pos
						(this.y_pos-this.height+5)+k*this.windowTop,
						this.windowWidth,//width of window
						this.windowHeight// height of window 
						) 
					
				}}

		//roof
		
			//floor
			noStroke()
			fill(130)
			rect(
				this.y_pos-15,this.x_pos-this.height-20,
				this.width+30,130
				)
			//top side shader
			noStroke()
			fill(80)
			//left side shader
			rect
			(
				this.y_pos-12.5,this.x_pos-this.height-20,
				1.5,120
			)
			//right side shader
			rect
            (
                this.y_pos+this.width+10.5,
				this.x_pos-this.height-20,
                1.5,
				120
            )		
			rect(
					this.y_pos-11,this.x_pos-this.height-20,
					this.width+23,5)

			//bottom side border
			fill(200)
			rect(
					this.x_pos-15,this.y_pos-this.height+100,
					this.width+30,10
					)
			//left side border
            fill(200)
            noStroke()
           
            rect
            (
                this.y_pos-15,this.x_pos-this.height-20,
                2.5,120
            )
			fill(200)
            //right side border 
            rect
            (
                this.y_pos+this.width+12.5,this.x_pos-this.height-20,
                2.5,120
            )
			//top side border
			fill(200)
			rect( this.x_pos-15,this.y_pos-this.height-25,this.width+30,5)
			
			//helipad 
			let helliPadY = 50
			if(this.roofTop) 
			{
				fill(255)
				rect(
					this.x_pos+this.width-37,
					this.y_pos-this.height-45,
					50,
					50
					)
				fill(c1)
				stroke(100)
				rect(this.x_pos+this.width-20,
					this.y_pos-this.height-20,
					15,
					25)
				fill(255,0,0)
				textSize(50)
				text('H',this.x_pos+this.width/2-17.5,-this.height+helliPadY+15)
				noFill()
				strokeWeight(3)
				stroke(255)
				circle(this.x_pos+this.width/2,-this.height+helliPadY,70)
			}
		}
	}
	building.setup(x,y,height,width,roofTop)
	return building 
}

function renderFlagpole(flagpole) // Not used as initially shown. Has aesthetic role instead. Hopefully, the helicopter condition-animation satisfied you :)									
{	
	//pole
	noStroke()
	fill(150)
	rect(flagpole.x,flagpole.y,flagpole.width,flagpole.height)
	//flag
	textSize(32)
	fill(255)
	rect(flagpole.x,flagpole.y,25,25)
	fill(255,0,0)
	text('+',flagpole.x+4,flagpole.y+22)
}
