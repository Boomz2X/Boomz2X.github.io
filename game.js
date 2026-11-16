const canvas = document.getElementById('battleCanvas');
const ctx = canvas.getContext('2d');

let p1 = { x: 100, y: 240, hp: 100, maxHp: 100, angle: 45, power: 50 };
let ai = { x: 780, y: 240, hp: 100, maxHp: 100, angle: 135, power: 50 };
let wind = 0.0;
let turn = 'player';
let projectile = null;
let gameRunning = false;

function enterGameRoom() {
    document.getElementById('portal-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    initBattle();
}

function exitGameRoom() {
    gameRunning = false;
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('portal-screen').classList.remove('hidden');
}

function initBattle() {
    p1.hp = 100; ai.hp = 100;
    p1.x = 100; ai.x = 780;
    wind = (Math.random() - 0.5) * 0.4;
    turn = 'player';
    projectile = null;
    gameRunning = true;
    updateHUD();
    requestAnimationFrame(gameLoop);
}

function adjustAngle(val) {
    if (turn !== 'player') return;
    p1.angle = Math.max(0, Math.min(90, p1.angle + val));
    updateHUD();
}

function adjustPower(val) {
    if (turn !== 'player') return;
    p1.power = Math.max(10, Math.min(100, p1.power + val));
    updateHUD();
    document.getElementById('force-bar-fill').style.width = p1.power + '%';
    document.getElementById('force-dial').innerText = p1.power;
}

function updateHUD() {
    document.getElementById('p1-hp').innerText = p1.hp;
    document.getElementById('val-angle').innerText = p1.angle;
    document.getElementById('val-power').innerText = p1.power;
    document.getElementById('force-bar-fill').style.width = p1.power + '%';
    document.getElementById('force-dial').innerText = p1.power;
    
    // Update Boss HP & Minimap
    let bossPercent = (ai.hp / ai.maxHp) * 100;
    document.getElementById('boss-hp-fill').style.width = bossPercent + '%';

    let pDot = document.getElementById('minimap-player');
    let eDot = document.getElementById('minimap-enemy');
    if(pDot && eDot) {
        pDot.style.left = (p1.x / canvas.width * 100) + '%';
        eDot.style.left = (ai.x / canvas.width * 100) + '%';
    }
}

function fireBullet() {
    if (turn !== 'player') return;
    turn = 'animating';

    let rad = p1.angle * Math.PI / 180;
    let v = p1.power * 0.28;
    projectile = {
        x: p1.x + 15,
        y: p1.y - 12,
        vx: Math.cos(rad) * v,
        vy: -Math.sin(rad) * v,
        isPlayer: true
    };
}

function aiTurn() {
    if (!gameRunning) return;
    setTimeout(() => {
        if (!gameRunning || ai.hp <= 0) return;
        let dist = Math.abs(p1.x - ai.x);
        ai.angle = Math.round(135 + (Math.random() * 10 - 5));
        ai.power = Math.min(90, Math.max(30, dist * 0.25 + (Math.random() * 10 - 5)));

        let rad = (180 - ai.angle) * Math.PI / 180;
        let v = ai.power * 0.28;
        projectile = {
            x: ai.x - 15,
            y: ai.y - 12,
            vx: -Math.cos(rad) * v,
            vy: -Math.sin(rad) * v,
            isPlayer: false
        };
        turn = 'animating';
    }, 1000);
}

function update() {
    if (projectile) {
        projectile.vx += wind * 0.02;
        projectile.vy += 0.25; // gravity
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;

        // Ground hit (y = 250)
        if (projectile.y >= 250) {
            checkHit();
            projectile = null;
        } else if (projectile.x < 0 || projectile.x > canvas.width) {
            projectile = null;
            endTurn();
        } else {
            let target = projectile.isPlayer ? ai : p1;
            let dist = Math.hypot(projectile.x - target.x, projectile.y - target.y);
            if (dist < 20) {
                applyDamage(target, 35 + Math.random() * 15);
                projectile = null;
            }
        }
    }
}

function checkHit() {
    let target = projectile.isPlayer ? ai : p1;
    let dist = Math.abs(projectile.x - target.x);
    if (dist < 30) {
        let dmg = Math.round(45 * (1 - dist / 30) + 15);
        applyDamage(target, dmg);
    } else {
        endTurn();
    }
}

function applyDamage(target, dmg) {
    target.hp = Math.max(0, Math.round(target.hp - dmg));
    updateHUD();

    if (target.hp <= 0) {
        turn = 'gameover';
        gameRunning = false;
        alert((target === ai) ? "🎉 ยินดีด้วย คุณพิชิตบอส Gulu สำเร็จ!" : "💀 พ่ายแพ้ในสนามรบ!");
        setTimeout(() => {
            exitGameRoom();
        }, 1500);
        return;
    }
    endTurn();
}

function endTurn() {
    if (turn === 'gameover' || !gameRunning) return;
    wind = (Math.random() - 0.5) * 0.4;
    if (projectile && projectile.isPlayer) {
        turn = 'ai';
        aiTurn();
    } else {
        turn = 'player';
    }
}

function drawTank(t, isRight, isBoss) {
    ctx.save();
    ctx.translate(t.x, t.y);

    if (isBoss) {
        // Draw Cute Gulu Boss & Slime
        ctx.fillStyle = '#ff8c00';
        ctx.beginPath();
        ctx.arc(0, -10, 22, Math.PI, 0, false);
        ctx.lineTo(22, 10);
        ctx.lineTo(-22, 10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#c9a845';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(-8, -16, 6, 8);
        ctx.fillRect(2, -16, 6, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(-6, -14, 3, 4);
        ctx.fillRect(4, -14, 3, 4);

        // Cute Blue Slime companion
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(-30, 4, 10, Math.PI, 0, false);
        ctx.lineTo(-20, 14);
        ctx.lineTo(-40, 14);
        ctx.closePath();
        ctx.fill();
    } else {
        // Player Character (Chibi Red Hat Tank)
        ctx.fillStyle = '#4ecca3';
        ctx.fillRect(-12, -10, 24, 14);
        
        // Head / Hat
        ctx.fillStyle = '#ff3366';
        ctx.fillRect(-8, -24, 16, 14);
        
        // Wheels
        ctx.beginPath();
        ctx.arc(0, 8, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.stroke();

        // Barrel
        ctx.strokeStyle = '#4ecca3';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        let rad = t.angle * Math.PI / 180;
        ctx.cos = Math.cos(rad);
        ctx.sin = Math.sin(rad);
        ctx.lineTo(Math.cos(rad) * 18, -6 - Math.sin(rad) * 18);
        ctx.stroke();
    }

    // HP bar above
    ctx.fillStyle = '#111';
    ctx.fillRect(-18, -34, 36, 5);
    ctx.fillStyle = isBoss ? '#ff3366' : '#4ecca3';
    ctx.fillRect(-18, -34, 36 * (t.hp / t.maxHp), 5);

    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Platform / Terrain (DDTank style floating cliff on left and right/center)
    ctx.fillStyle = '#8b5a2b'; // cliff brown
    ctx.fillRect(0, 250, 240, 90);
    ctx.fillStyle = '#22c55e'; // grass top
    ctx.fillRect(0, 250, 240, 8);

    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(580, 250, 320, 90);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(580, 250, 320, 8);

    drawTank(p1, true, false);
    drawTank(ai, false, true);

    if (projectile) {
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.fill();
        ctx.strokeStyle = '#ff8c00';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function gameLoop() {
    if (!gameRunning) return;
    update();
    draw();
    if (turn !== 'gameover') {
        requestAnimationFrame(gameLoop);
    }
}
