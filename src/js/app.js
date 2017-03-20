class Vector {

	constructor(x = 0, y = 0) {

		this.x = x;
		this.y = y;
	}

	get len() {

		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	set len(value) {

		const factor = value / this.len;
		this.x *= factor;
		this.y *= factor;
	}
}


class Rectangle {

	constructor(width, height) {
		
		this.position = new Vector();
		this.size = new Vector(width, height);
	}

	get left() {

		return this.position.x - this.size.x / 2;
	}

	get right() {

		return this.position.x + this.size.x / 2;
	}

	get top() {

		return this.position.y - this.size.y / 2;
	}

	get bottom() {

		return this.position.y + this.size.y / 2;
	}
}


class Sphere extends Rectangle {

	constructor(width, height) {

		super(width, height);
		this.velocity = new Vector();
	}
}


class Player extends Rectangle {

	constructor() {

		super(20, 100);
		this.score = 0;
	}
}


class Pong {

	constructor(canvas) {

		this.canvas  = canvas;
		this.context = canvas.getContext('2d');
		
		this.ball    = new Sphere(10, 10);
		this.players = [new Player(), new Player()];

		let lastTime;
		const animate = (millis) => {

			if(lastTime) {
				this.update((millis - lastTime) / 1000);
			}

			lastTime = millis;
			requestAnimationFrame(animate);
		};

		this.positioningPlayers();
		this.reset();
		animate();

		this.CHAR_PIXEL = 10;
		this.CHARS_BINARY = [

			'111101101101111',
			'010010010010010',
			'111001111100111',
			'111001111001111',
			'101101111001001',
			'111100111001111',
			'111100111101111',
			'111001001001001',
			'111101111101111',
			'111101111001111'

		].map( (binary) => {
			
			const canvas      = document.createElement('canvas');
			const context     = canvas.getContext('2d');
			canvas.height     = this.CHAR_PIXEL * 5;
			canvas.width      = this.CHAR_PIXEL * 3;
			context.fillStyle = '#fff';

			binary.split('').forEach( (bit, i) => {

				if(bit === '1') {

					context.fillRect(
						(i % 3) * this.CHAR_PIXEL,
						(i / 3 | 0) * this.CHAR_PIXEL,
						this.CHAR_PIXEL,
						this.CHAR_PIXEL
					);
				}
			});

			return canvas;
		});
	}


	drawRect(rect, color = '#fff') {

		this.context.fillStyle = color;
		this.context.fillRect(rect.left, rect.top, 
							  rect.size.x, rect.size.y);
	}


	drawPlayers() {

		this.players.forEach( (player) => this.drawRect(player, '#eee'));
	}


	drawScore() {

		const align = this.canvas.width / 3;
		const CHAR_WIDTH = this.CHAR_PIXEL * 4;

		this.players.forEach( (player, index) => {

			const scoreChars = player.score.toString().split('');
			const offset = 	align * 
							(index + 1) -
							(CHAR_WIDTH * scoreChars.length / 2) +
							this.CHAR_PIXEL / 2;

			scoreChars.forEach( (char, pos) => {

				this.context.drawImage(
					this.CHARS_BINARY[char|0],
					offset + pos * CHAR_WIDTH,
					20
				);
			});
		});

	}


	positioningPlayers() {

		this.players[0].position.x = 40;
		this.players[1].position.x = this.canvas.width - 40;
		this.players.forEach( (player) => {
			player.position.y = this.canvas.height / 2;
		});
	}


	collide(player, ball) {

		if(player.left < ball.right && player.right > ball.left &&
			player.top < ball.bottom && player.bottom > ball.top) {

			ball.velocity.x = -ball.velocity.x;
			// each collision augment the ball’s speed by 2%
			ball.velocity.len *= 1.02;
		}
	}


	reset() {

		// on reset reposition the ball to the middle
		this.ball.position.x = this.canvas.width / 2;
		this.ball.position.y = this.canvas.height / 2;
		// make the ball freez on the center
		this.ball.velocity.x = 0;
		this.ball.velocity.y = 0;
	}


	start() {

		if(this.ball.velocity.x === 0 && this.ball.velocity.y === 0) {

			// get the ball random direction en each start
			this.ball.velocity.x = 300 * (Math.random() > 0.5 ? 1 : -1);
			this.ball.velocity.y = 300 * (Math.random() * 2 - 1);
			// stabilize the ball's seed
			this.ball.velocity.len = 200;
		}
	}


	draw() {

		let pattern;
		let backgroundImage = new Image();
		backgroundImage.src = '../images/background.jpg';

		backgroundImage.onload = () => {

			pattern = this.context.createPattern(backgroundImage, 'repeat');
			this.context.fillStyle = pattern;
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		};

		this.drawRect(this.ball);
		this.drawPlayers();
		this.drawScore();
	}


	update(deltaTime) {

		this.ball.position.x += this.ball.velocity.x * deltaTime;
		this.ball.position.y += this.ball.velocity.y * deltaTime;

		if(this.ball.left < 0 || this.ball.right > this.canvas.width) {
			// if the ball hit the left wall, player[1] wins
			if(this.ball.left < 0) {
				this.players[1].score++;
				console.log('player 1 wins, score : ', this.players[1].score);
				this.reset();
			}
			// if the ball hit the right wall, player[0] wins
			if(this.ball.right > this.canvas.width) {
				this.players[0].score++;
				console.log('player 2 wins, score : ', this.players[0].score);
				this.reset();
			}

			this.ball.velocity.x = -this.ball.velocity.x;
		}

		if(this.ball.top < 0 || this.ball.bottom > this.canvas.height) {

			this.ball.velocity.y = -this.ball.velocity.y;
		}

		// That’s a little trick to cheat 
		this.players[1].position.y = this.ball.position.y;

		this.players.forEach( (player) => this.collide(player, this.ball));

		this.draw();
	}
}



window.addEventListener('load', function() {

	let canvas  = document.getElementById('pong');
	let pong = new Pong(canvas);
	console.info(pong);

	// make the first player (players[0]) controlled by the mouse
	canvas.addEventListener('mousemove', function(event) {

		const scale = event.offsetY / event.target.getBoundingClientRect().height;
		pong.players[0].position.y = canvas.height * scale;

	}, false);

	canvas.addEventListener('touchmove', function(event) {

		let playerY = pong.players[0].position.y;
		let touchmoveY = event.changedTouches[0].pageY;

		playerY = touchmoveY;

	}, false);

	canvas.addEventListener('click', function(){
		pong.start();
	}, false);


}, false);