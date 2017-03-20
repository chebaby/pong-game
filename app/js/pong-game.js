/*!
 * pong game
 * Simple pong game
 * 
 * 
 * @author Nour-Eddine ECH-CHEBABY
 * @version 1.0.0
 * @version https://github.com/chebaby/pong-game
 * 
 * 
 * Copyright 2017. ISC licensed.
 * 
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector = function () {
	function Vector() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		_classCallCheck(this, Vector);

		this.x = x;
		this.y = y;
	}

	_createClass(Vector, [{
		key: 'len',
		get: function get() {

			return Math.sqrt(this.x * this.x + this.y * this.y);
		},
		set: function set(value) {

			var factor = value / this.len;
			this.x *= factor;
			this.y *= factor;
		}
	}]);

	return Vector;
}();

var Rectangle = function () {
	function Rectangle(width, height) {
		_classCallCheck(this, Rectangle);

		this.position = new Vector();
		this.size = new Vector(width, height);
	}

	_createClass(Rectangle, [{
		key: 'left',
		get: function get() {

			return this.position.x - this.size.x / 2;
		}
	}, {
		key: 'right',
		get: function get() {

			return this.position.x + this.size.x / 2;
		}
	}, {
		key: 'top',
		get: function get() {

			return this.position.y - this.size.y / 2;
		}
	}, {
		key: 'bottom',
		get: function get() {

			return this.position.y + this.size.y / 2;
		}
	}]);

	return Rectangle;
}();

var Sphere = function (_Rectangle) {
	_inherits(Sphere, _Rectangle);

	function Sphere(width, height) {
		_classCallCheck(this, Sphere);

		var _this = _possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this, width, height));

		_this.velocity = new Vector();
		return _this;
	}

	return Sphere;
}(Rectangle);

var Player = function (_Rectangle2) {
	_inherits(Player, _Rectangle2);

	function Player() {
		_classCallCheck(this, Player);

		var _this2 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, 20, 100));

		_this2.score = 0;
		return _this2;
	}

	return Player;
}(Rectangle);

var Pong = function () {
	function Pong(canvas) {
		var _this3 = this;

		_classCallCheck(this, Pong);

		this.canvas = canvas;
		this.context = canvas.getContext('2d');

		this.ball = new Sphere(10, 10);
		this.players = [new Player(), new Player()];

		var lastTime = void 0;
		var animate = function animate(millis) {

			if (lastTime) {
				_this3.update((millis - lastTime) / 1000);
			}

			lastTime = millis;
			requestAnimationFrame(animate);
		};

		this.positioningPlayers();
		this.reset();
		animate();

		this.CHAR_PIXEL = 10;
		this.CHARS_BINARY = ['111101101101111', '010010010010010', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001001001001', '111101111101111', '111101111001111'].map(function (binary) {

			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			canvas.height = _this3.CHAR_PIXEL * 5;
			canvas.width = _this3.CHAR_PIXEL * 3;
			context.fillStyle = '#fff';

			binary.split('').forEach(function (bit, i) {

				if (bit === '1') {

					context.fillRect(i % 3 * _this3.CHAR_PIXEL, (i / 3 | 0) * _this3.CHAR_PIXEL, _this3.CHAR_PIXEL, _this3.CHAR_PIXEL);
				}
			});

			return canvas;
		});
	}

	_createClass(Pong, [{
		key: 'drawRect',
		value: function drawRect(rect) {
			var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#fff';


			this.context.fillStyle = color;
			this.context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
		}
	}, {
		key: 'drawPlayers',
		value: function drawPlayers() {
			var _this4 = this;

			this.players.forEach(function (player) {
				return _this4.drawRect(player, '#eee');
			});
		}
	}, {
		key: 'drawScore',
		value: function drawScore() {
			var _this5 = this;

			var align = this.canvas.width / 3;
			var CHAR_WIDTH = this.CHAR_PIXEL * 4;

			this.players.forEach(function (player, index) {

				var scoreChars = player.score.toString().split('');
				var offset = align * (index + 1) - CHAR_WIDTH * scoreChars.length / 2 + _this5.CHAR_PIXEL / 2;

				scoreChars.forEach(function (char, pos) {

					_this5.context.drawImage(_this5.CHARS_BINARY[char | 0], offset + pos * CHAR_WIDTH, 20);
				});
			});
		}
	}, {
		key: 'positioningPlayers',
		value: function positioningPlayers() {
			var _this6 = this;

			this.players[0].position.x = 40;
			this.players[1].position.x = this.canvas.width - 40;
			this.players.forEach(function (player) {
				player.position.y = _this6.canvas.height / 2;
			});
		}
	}, {
		key: 'collide',
		value: function collide(player, ball) {

			if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {

				ball.velocity.x = -ball.velocity.x;
				// each collision augment the ball’s speed by 2%
				ball.velocity.len *= 1.02;
			}
		}
	}, {
		key: 'reset',
		value: function reset() {

			// on reset reposition the ball to the middle
			this.ball.position.x = this.canvas.width / 2;
			this.ball.position.y = this.canvas.height / 2;
			// make the ball freez on the center
			this.ball.velocity.x = 0;
			this.ball.velocity.y = 0;
		}
	}, {
		key: 'start',
		value: function start() {

			if (this.ball.velocity.x === 0 && this.ball.velocity.y === 0) {

				// get the ball random direction en each start
				this.ball.velocity.x = 300 * (Math.random() > 0.5 ? 1 : -1);
				this.ball.velocity.y = 300 * (Math.random() * 2 - 1);
				// stabilize the ball's seed
				this.ball.velocity.len = 200;
			}
		}
	}, {
		key: 'draw',
		value: function draw() {
			var _this7 = this;

			var pattern = void 0;
			var backgroundImage = new Image();
			backgroundImage.src = '../images/background.jpg';

			backgroundImage.onload = function () {

				pattern = _this7.context.createPattern(backgroundImage, 'repeat');
				_this7.context.fillStyle = pattern;
				_this7.context.fillRect(0, 0, _this7.canvas.width, _this7.canvas.height);
			};

			this.drawRect(this.ball);
			this.drawPlayers();
			this.drawScore();
		}
	}, {
		key: 'update',
		value: function update(deltaTime) {
			var _this8 = this;

			this.ball.position.x += this.ball.velocity.x * deltaTime;
			this.ball.position.y += this.ball.velocity.y * deltaTime;

			if (this.ball.left < 0 || this.ball.right > this.canvas.width) {
				// if the ball hit the left wall, player[1] wins
				if (this.ball.left < 0) {
					this.players[1].score++;
					console.log('player 1 wins, score : ', this.players[1].score);
					this.reset();
				}
				// if the ball hit the right wall, player[0] wins
				if (this.ball.right > this.canvas.width) {
					this.players[0].score++;
					console.log('player 2 wins, score : ', this.players[0].score);
					this.reset();
				}

				this.ball.velocity.x = -this.ball.velocity.x;
			}

			if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {

				this.ball.velocity.y = -this.ball.velocity.y;
			}

			// That’s a little trick to cheat 
			this.players[1].position.y = this.ball.position.y;

			this.players.forEach(function (player) {
				return _this8.collide(player, _this8.ball);
			});

			this.draw();
		}
	}]);

	return Pong;
}();

window.addEventListener('load', function () {

	var canvas = document.getElementById('pong');
	var pong = new Pong(canvas);
	console.info(pong);

	// make the first player (players[0]) controlled by the mouse
	canvas.addEventListener('mousemove', function (event) {

		var scale = event.offsetY / event.target.getBoundingClientRect().height;
		pong.players[0].position.y = canvas.height * scale;
	}, false);

	canvas.addEventListener('touchmove', function (event) {

		var playerY = pong.players[0].position.y;
		var touchmoveY = event.changedTouches[0].pageY;

		playerY = touchmoveY;
	}, false);

	canvas.addEventListener('click', function () {
		pong.start();
	}, false);
}, false);