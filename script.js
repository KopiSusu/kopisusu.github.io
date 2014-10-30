var canvas,
    ctx,
    width = 600,
    height = 600,
    ship_x = (width/2) - 25, ship_y = height - 75, ship_w = 50, ship_h = 50;
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false
    enemyTotal = 5,
    enemies = []
    enemy_x = 50,
    enemy_y = -45,
    enemy_w = 50,
    enemy_h = 50,
    speed = 3,
    score = 0,
    alive = true,
    lives = 3

var enemy, ship, starfield, starX = 0, starY = 0, starY2 = -600;

var laserTotal = 5, lasers = [];

function clearCanvas() {
  ctx.clearRect(0,0,width,height);
}

function drawShip() {
  if (rightKey) ship_x += 5;
  else if (leftKey) ship_x -= 5;
  if (upKey) ship_y -= 5;
  else if (downKey) ship_y += 5;
  if (ship_x <= 0) ship_x = 0;
  if ((ship_x + ship_w) >= width) ship_x = width - ship_w;
  if (ship_y <= 0) ship_y = 0;
  if ((ship_y + ship_h) >= height) ship_y = height - ship_h;
  ctx.drawImage(ship, ship_x, ship_y);
}

function drawLaser() {
  if (lasers.length)
    for (var i = 0; i < lasers.length; i++) {
      ctx.fillStyle = '#f00';
      ctx.fillRect(lasers[i][0],lasers[i][1],lasers[i][2],lasers[i][3])
    }
}

function moveLaser() {
  for (var i = 0; i < lasers.length; i++) {
    if (lasers[i][1] > -11) {
      lasers[i][1] -= 10;
    } else if (lasers[i][1] < -10) {
      lasers.splice(i, 1);
    }
  }
}

function hitTest() {
  var remove = false;
  for (var i = 0; i < lasers.length; i++) {
    for (var j = 0; j < enemies.length; j++) {
      if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
        remove = true;
        enemies.splice(j, 1);
        score += 10;
        enemies.push([(Math.random() * 500) + 50, -45, enemy_w, enemy_h, speed]);
      }
    }
    if (remove == true) {
      lasers.splice(i, 1);
      remove = false;
    }
  }
}

function scoreTotal() {
 ctx.font = 'bold 18px Arial';
 ctx.fillStyle = '#fff';
 ctx.fillText('Score: ', 490, 30);
 ctx.fillText(score, 550, 30);
 ctx.fillText('Lives:', 10, 30);
 ctx.fillText(lives, 68, 30);
 if (!alive) {
   ctx.fillText('Game Over!', 245, height / 2);
   ctx.fillRect((width / 2) - 53, (height / 2) + 10,100,40);
   ctx.fillStyle = '#000';
   ctx.fillText('Continue?', 252, (height / 2) + 35);
   canvas.addEventListener('click', continueButton, false);
   score = 0;
 }
}

function continueButton(e) {
 var cursorPos = getCursorPos(e);
 if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47 && cursorPos.y > (height / 2) + 10 && cursorPos.y < (height / 2) + 50) {
   alive = true;
   lives = 3;
   reset();
   canvas.removeEventListener('click', continueButton, false);
 }
}

function getCursorPos(e) {
 var x;
 var y;
 if (e.pageX || e.pageY) {
   x = e.pageX;
   y = e.pageY;
 } else {
   x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
   y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
 }
 x -= canvas.offsetLeft;
 y -= canvas.offsetTop;
 var cursorPos = new cursorPosition(x, y);
 return cursorPos;
}

function cursorPosition(x,y) {
 this.x = x;
 this.y = y;
}

function checkLives() {
 lives -= 1;
 if (lives > 0) {
   reset();
 } else if (lives == 0) {
   alive = false;
 }
}

for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_x += enemy_w + 60;
}

function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
  ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
  }
}

function moveEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i][1] < height) {
      enemies[i][1] += enemies[i][4];
    } else if (enemies[i][1] > height - 1) {
      enemies[i][1] = -45;
    }
  }
}

function shipCollision() {
  var ship_xw = ship_x + ship_w,
      ship_yh = ship_y + ship_h;
  for (var i = 0; i < enemies.length; i++) {
    if (ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
      checkLives();
    }
    if (ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0] && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
      checkLives();
    }
    if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w) {
      checkLives();
    }
    if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0]) {
      checkLives();
    }
  }
}

function reset() {
 var enemy_reset_x = 50;
 ship_x = (width / 2) - 25, ship_y = height - 75, ship_w = 50, ship_h = 57;
 for (var i = 0; i < enemies.length; i++) {
   enemies[i][0] = enemy_reset_x;
   enemies[i][1] = -45;
   enemy_reset_x = enemy_reset_x + enemy_w + 60;
 }
}

function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  enemy = new Image();
  enemy.src = 'http://www.clockworkchilli.com//assets/demos/shooter/images/enemy.png';
  ship = new Image();
  ship.src = 'http://www.pixeljoint.com/files/icons/spaceship1_final.png';
  setInterval(gameLoop, 25);
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
}

function keyDown(e) {
  if (e.keyCode == 39) rightKey = true;
  else if (e.keyCode == 37) leftKey = true;
  if (e.keyCode == 38) upKey = true;
  else if (e.keyCode == 40) downKey = true;
  if (e.keyCode == 88 && lasers.length <= laserTotal) lasers.push([ship_x + 25, ship_y - 20, 4, 20]);
}

function keyUp(e) {
  if (e.keyCode == 39) rightKey = false;
  else if (e.keyCode == 37) leftKey = false;
  if (e.keyCode == 38) upKey = false;
  else if (e.keyCode == 40) downKey = false;
}


function gameLoop() {
  clearCanvas();
  if (alive) {
    hitTest();
    shipCollision();
    moveLaser();
    moveEnemies();
    drawEnemies();
    drawShip();
    drawLaser();  
  }
  scoreTotal();
}

window.onload = init;