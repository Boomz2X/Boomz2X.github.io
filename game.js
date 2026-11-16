const canvas = document.getElementById('battleCanvas');
const ctx = canvas.getContext('2d');

let p1 = { x: 80, y: 220, hp: 100, maxHp: 100, angle: 45, power: 50 };
let ai = { x: 720, y: 220, hp: 100, maxHp: 100, angle: 135, power: 50 };
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
    p1.x = 80; ai.x = 720;
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
}

function updateHUD() {
    document.getElementById('p1-hp').innerText = p1.hp;
    document.getElementById('ai-hp').innerText = ai.hp;
    document.getElementById('val-angle').innerText = p1.angle;
    document.getElementById('val-power').innerText = p1.power;
}

function fireBullet() {
    if (turn !== 'player') return;
    turn = 'animating';
    document.getElementById('game-msg').innerText = "กำลังยิงกระสุนวิถีโค้ง...";

    let rad = p1.angle * Math.PI / 180;
    let v = p1.power * 0.28;
    projectile = {
        x: p1.x + 15,
        y: p1.y - 10,
        vx: Math.cos(rad) * v,
        vy: -Math.sin(rad) * v,
        isPlayer: true
    };
}

function aiTurn() {
    if (!gameRunning) return;
    document.getElementById('game-msg').innerText = "บอทกำลังคำนวณมุมยิงสวนกลับ...";
    setTimeout(() => {
        if (!gameRunning || ai.hp <= 0) return;
        let dist = Math.abs(p1.x - ai.x);
        ai.angle = Math.round(135 + (Math.random() * 10 - 5));
        ai.power = Math.min(90, Math.max(30, dist * 0.25 + (Math.random() * 10 - 5)));

        let rad = (180 - ai.angle) * Math.PI / 180;
        let v = ai.power * 0.28;
        projectile = {
            x: ai.x - 15,
            y: ai.y - 10,
            vx: -Math.cos(rad) * v,
            vy: -Math.sin(rad) * v,
            isPlayer: false
        };
        turn = 'animating';
        document.getElementById('game-msg').innerText = "บอทส่องยิงมาแล้ว!";
    }, 1000);
}

function update() {
    if (projectile) {
        projectile.vx += wind * 0.02;
        projectile.vy += 0.25; // gravity
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;

        // Ground hit (y = 230)
        if (projectile.y >= 230) {
            checkHit();
            projectile = null;
        } else if (projectile.x < 0 || projectile.x > canvas.width) {
            document.getElementById('game-msg').innerText = "ยิงออกนอกจอ!";
            projectile = null;
            endTurn();
        } else {
            let target = projectile.isPlayer ? ai : p1;
            let dist = Math.hypot(projectile.x - target.x, projectile.y - target.y);
            if (dist < 18) {
                applyDamage(target, 35 + Math.random() * 15);
                projectile = null;
            }
        }
    }
}

function checkHit() {
    let target = projectile.isPlayer ? ai : p1;
    let dist = Math.abs(projectile.x - target.x);
    if (dist < 28) {
        let dmg = Math.round(45 * (1 - dist / 28) + 10);
        applyDamage(target, dmg);
    } else {
        document.getElementById('game-msg').innerText = "พลาดเป้า! ตกพื้น";
        endTurn();
    }
}

function applyDamage(target, dmg) {
    target.hp = Math.max(0, Math.round(target.hp - dmg));
    updateHUD();
    let name = (target === ai) ? "บอทศัตรู" : "คุณ";
    document.getElementById('game-msg').innerText = `${name}โดนดาเมจ ${Math.round(dmg)}!`;

    if (target.hp <= 0) {
        turn = 'gameover';
        gameRunning = false;
        document.getElementById('game-msg').innerText = (target === ai) ? "🎉 ยินดีด้วย คุณชนะแล้ว!" : "💀 พ่ายแพ้ในสนามรบ!";
        setTimeout(() => {
            exitGameRoom();
        }, 3000);
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
        document.getElementById('game-msg').innerText = "ตาของคุณ! เล็งยิงเลย";
    }
}

function drawTank(t, isRight) {
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.fillStyle = isRight ? '#4ecca3' : '#ff3366';
    ctx.fillRect(-12, -8, 24, 12);
    ctx.beginPath();
    ctx.arc(0, 6, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();

    // Barrel
    ctx.strokeStyle = isRight ? '#4ecca3' : '#ff3366';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    let angleVal = isRight ? t.angle : (180 - t.angle);
    let rad = angleVal * Math.PI / 180;
    ctx.lineTo((isRight ? 1 : -1) * Math.cos(rad) * 16, -4 - Math.sin(rad) * 16);
    ctx.stroke();

    // HP bar above tank
    ctx.fillStyle = '#111';
    ctx.fillRect(-16, -22, 32, 4);
    ctx.fillStyle = isRight ? '#4ecca3' : '#ff3366';
    ctx.fillRect(-16, -22, 32 * (t.hp / t.maxHp), 4);

    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ground platform
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 230, canvas.width, 50);
    ctx.fillStyle = '#4ecca3';
    ctx.fillRect(0, 230, canvas.width, 3);

    drawTank(p1, true);
    drawTank(ai, false);

    if (projectile) {
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.fill();
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
