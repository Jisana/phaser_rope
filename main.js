// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
		 // Load the bird sprite
		game.load.image('bird', 'assets/bird.png'); 
		game.load.image('pipe', 'assets/pipe.png');
		game.load.image('rope', 'assets/red.png');
    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.  
	  // Change the background color of the game to blue
		game.stage.backgroundColor = '#71c5cf';

		// Set the physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Display the bird at the position x=100 and y=245
		this.bird = game.add.sprite(100, 350, 'bird');
		this.rope = game.add.sprite(100, 350, 'rope');
		// Add physics to the bird
		// Needed for: movements, gravity, collisions, etc.
		game.physics.arcade.enable(this.bird);
		game.physics.arcade.enable(this.rope);

		// Add gravity to the bird to make it fall
		this.bird.body.gravity.y = 1000;  
		//this.rope.body.gravity.y = -350;  

		// Call the 'jump' function when the spacekey is hit
		var spaceKey = game.input.keyboard.addKey(
						Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);     
		
		// Create an empty group
		this.pipes = game.add.group(); 
		
		this.addRowOfPipes();

		var updown = false;
		
		this.xspeed = 1;
		
		this.timer = game.time.events.loop(1500*this.xspeed,this.speeder, this); 

		
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  
		
    },
	
	speeder:function(){
		this.xspeed += 0.2;
	
	},
	
	flipflop:function(o){
		game.world.bringToTop(o);
		this.score += 1;
		this.labelScore.text = this.score;  
		
	},
    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   
		 if (this.bird.y < 0 || this.bird.y > 490)  this.restartGame();
		 if(this.bird.y >= 400 && this.rope.y >=400) this.restartGame();
		game.physics.arcade.overlap(this.bird, this.pipes);
		if(this.bird.body.touching.down){
				this.bird.body.y=400;
				this.bird.body.velocity.y=0;
				
		}
		
		if(!this.updown){

			this.rope.body.y+=1*this.xspeed;
			if(this.rope.y>400){this.updown = true; this.flipflop(this.bird);}
		}
				
		if(this.updown){
			
			this.rope.body.y+=-1*this.xspeed;
			if(this.rope.y<350){this.updown = false;game.world.bringToTop(this.rope);}
		}
		
		
		
		
		
		
		
    },
	
	// Make the bird jump 
	jump: function() {
		// Add a vertical velocity to the bird
		this.bird.body.velocity.y = -340;
	},

	// Restart the game
	restartGame: function() {
		// Start the 'main' state, which restarts the game
		game.state.start('main');
	
		
	},
	
	addOnePipe: function(x, y) {
			// Create a pipe at the position x and y
			var pipe = game.add.sprite(x, y, 'pipe');

			// Add the pipe to our previously created group
			this.pipes.add(pipe);

			// Enable physics on the pipe 
			game.physics.arcade.enable(pipe);

			// Automatically kill the pipe when it's no longer visible 
			pipe.checkWorldBounds = true;
			pipe.outOfBoundsKill = true;
		},
			
		addRowOfPipes: function() {
			// Add the 6 pipes 
			// With one big hole at position 'hole' and 'hole + 1'
			for (var i = 0; i < 8; i++){
					this.addOnePipe( i * 50, 450);   }
		},
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');

