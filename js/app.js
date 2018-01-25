// Enemies our player must avoid
var Enemy = function() {

  this.x = 1;
  this.y = 1;
  this.movement = 1;
  this.sprite = 'images/enemy-bug.png';

};

//Randomly set the offscreen starting point of the enemy.
Enemy.prototype.setVariables = function() {
  let x = Math.floor(Math.random() * Math.floor(3)) + 1;
  let y = Math.floor(Math.random() * Math.floor(3)) + 1;
  let movement = Math.floor(Math.random() * Math.floor(2)) + 1;

  // assigns x to one of 4 presets 1=-101, 2=-202, 3=-303 4=-404.
  switch (x) {
    case 1:
      this.x = -101;
      break;
    case 2:
      this.x = -202;
      break;
    case 3:
      this.x = -303;
      break;
    case 4:
      this.x = -404;
      break;
  };

  // assigns y to one of the three lanes. 1=63(Top lane), 2=146(middle lane) 3=229(bottom lane).
  switch (y) {
    case 1:
      this.y = 63;
      break;
    case 2:
      this.y = 146;
      break;
    case 3:
      this.y = 229;
      break;
  };

  // assigns movement to one of four presets. 1=101, 2=202, 3=303 and 4=404.
  switch (movement) {
    case 1:
      this.movement = 101;
      break;
    case 2:
      this.movement = 202;
      break;
    case 3:
      this.movement = 303;
      break;
    case 4:
      this.movement = 404;
      break;
  };
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.movement * dt);
    if (this.x > 505) {
      this.setVariables();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player function
var Player = function() {
  this.x = 202; // start 0 + 101 per column.
  this.y = 373.5;// Start -41.5 + 83 per row.
  this.sprite = 'images/char-cat-girl.png';
  this.lives = 3;
  this.livesDisplay = document.getElementById('lives');
};

// Updates the player. Collision detection.
Player.prototype.update = function(dt) {
  allEnemies.forEach(function(enemy) {
    if ((player.y + 21.5) === enemy.y){
      // Body (not head) width of player seems to 33 and enemy is close to 100.
      if ((player.x + 35 <= enemy.x + 98) && (player.x + 69 >= enemy.x + 2)) {
        player.removeLife();
        player.reset();
      }
    }
  });
};

//Render the image.
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Moves the player via keypress.
Player.prototype.handleInput = function(keycode) {
  switch(keycode) {
    case 'left':
      if (!((this.x - 101) < 0)) {
        this.x = this.x - 101;
      };
      break;
    case 'right':
      if (!((this.x + 101) > 404)) {
        this.x = this.x + 101;
      }
      break;
    case 'up':
      if (!((this.y - 83) < 0)) {
        this.y = this.y - 83;
      } else {
        this.y = this.y - 83;
        player.gameOver();
      }
      break;
    case 'down':
      if (!((this.y + 83) > 415)) {
        this.y = this.y + 83;
      }
      break;
  }
};

// Resets the player to a start screen.
Player.prototype.reset = function() {
  this.x = 202;
  this.y = 373.5;
}

//Shows lives of Player.
Player.prototype.showLives = function () {
  let livesEles = document.getElementsByClassName('liveimg');
  let liveDisplay = document.getElementById('lives');
  console.log(livesEles.length);
  if (livesEles.length != 0) {
    for (let i = 0; i <= livesEles.length; i++) {
      liveDisplay.removeChild(livesEles[i]);
    }
  }
  for (let i = 0; i < this.lives; i++) {
    let livesImg = document.createElement('img');
    livesImg.setAttribute('src', this.sprite);
    livesImg.setAttribute('alt', 'Life');
    livesImg.classList.add('liveimg');
    this.livesDisplay.appendChild(livesImg);
  };
}

Player.prototype.removeLife = function () {
  this.lives--;
  let aLife = this.livesDisplay.firstElementChild;
  this.livesDisplay.removeChild(aLife);
  if (this.lives === 0) {
    console.log("Game Over!");
    player.gameOver();
  }
}

Player.prototype.gameOver = function () {
  let getOver = document.getElementById('gameOver');
  let gameOverMsg = document.getElementById('gameOverMsg');
  if (this.lives > 0) {
    gameOverMsg.textContent = "You've Won!";
  } else {
    gameOverMsg.textContent = "You've Lost!"
  }
  gameOver.classList.toggle("hidden");
  gameOver.classList.toggle("shown");
}

//Instatiate player and enemies.
var player = new Player();
player.showLives();
var allEnemies = [];
var totalEnemies = 3;
for (let i = 0; i < totalEnemies; i++) {
  let enemy = new Enemy();
  enemy.setVariables();
  allEnemies.push(enemy);
};
var gameOverBtn = document.getElementById('gameOverBtn');
gameOverBtn.addEventListener('click', function() {
  player.lives = 3;
  player.reset();
  player.showLives();
  let gameOverBrd = document.getElementById('gameOver');
  gameOverBrd.classList.toggle('hidden');
  gameOverBrd.classList.toggle('shown');
});
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
