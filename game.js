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
        projectile.vy += 0.25;
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;

        if (projectile.y >= 250) {
            checkHit();
            projectile = null;
        } else if (projectile.x < 0 || projectile.x > canvas.width) {
            projectile = null;
            endTurn();
        } else {
            let target = projectile.isPlayer ? ai : p1;
            let dist = Math.hypot(projectile.x - target.x, projectile.y - target.y);
            if (dist < 22) {
                applyDamage(target, 35 + Math.random() * 15);
                projectile = null;
            }
        }
    }
}

function checkHit() {
    let target = projectile.isPlayer ? ai : p1;
    let dist = Math.abs(projectile.x - target.x);
    if (dist < 32) {
        let dmg = Math.round(45 * (1 - dist / 32) + 15);
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
        alert((target === ai) ? "🎉 ยินดีด้วย คุณเอาชนะ LUNA, THE STARFALL ABYSS สำเร็จ!" : "💀 LUNA พ่ายแพ้ต่อพลังแห่งความมืด!");
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

// Draw Player: LUNA (Age 12, Crystal Staff, Blue Cape, Twin Tails)
function drawLuna(p) {
    ctx.save();
    ctx.translate(p.x, p.y);

    // Backpack & Outfit
    ctx.fillStyle = '#8b5a2b'; // leather backpack
    ctx.fillRect(-14, -12, 10, 16);
    ctx.fillStyle = '#1e3a8a'; // blue cape
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.lineTo(-22, 6);
    ctx.lineTo(-4, 2);
    ctx.closePath();
    ctx.fill();

    // Body / School Skirt
    ctx.fillStyle = '#b45309'; // brown vest
    ctx.fillRect(-10, -12, 20, 16);
    ctx.fillStyle = '#065f46'; // green plaid skirt
    ctx.fillRect(-10, 4, 20, 10);

    // Head & Twin Tails Hair (Brown with star clips)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, -20, 11, 0, Math.PI * 2);
    ctx.fill();
    // Twin tails left & right
    ctx.beginPath();
    ctx.arc(-14, -22, 6, 0, Math.PI * 2);
    ctx.arc(14, -22, 6, 0, Math.PI * 2);
    ctx.fill();

    // Face / Eyes (Green eyes)
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-4, -22, 3, 3);
    ctx.fillRect(2, -22, 3, 3);

    // Crystal Staff (Weapon)
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, 4);
    let rad = p.angle * Math.PI / 180;
    ctx.lineTo(8 + Math.cos(rad) * 20, 4 - Math.sin(rad) * 20);
    ctx.stroke();
    // Crystal tip (Blue glow)
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    let tipX = 8 + Math.cos(rad) * 20;
    let tipY = 4 - Math.sin(rad) * 20;
    ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
    ctx.fill();

    // HP bar above
    ctx.fillStyle = '#111';
    ctx.fillRect(-18, -36, 36, 5);
    ctx.fillStyle = '#4ecca3';
    ctx.fillRect(-18, -36, 36 * (p.hp / p.maxHp), 5);

    ctx.restore();
}

// Draw Boss: LUNA, THE STARFALL ABYSS (Corrupted floating form, dark crystals, vortex staff)
function drawStarfallAbyssLuna(b) {
    ctx.save();
    ctx.translate(b.x, b.y - 6); // slightly floating

    // Dark Void Portal Effect under feet
    ctx.fillStyle = 'rgba(126, 34, 206, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Corrupted Dark Crystals & Cape
    ctx.fillStyle = '#581c87'; // dark purple crystals
    ctx.beginPath();
    ctx.moveTo(-16, -18);
    ctx.lineTo(-28, -4);
    ctx.lineTo(-12, 6);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(16, -18);
    ctx.lineTo(28, -4);
    ctx.lineTo(12, 6);
    ctx.closePath();
    ctx.fill();

    // Body / Corrupted Vest
    ctx.fillStyle = '#311042';
    ctx.fillRect(-10, -12, 20, 16);

    // Head with Corrupted Glowing Purple Eyes
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(0, -20, 11, 0, Math.PI * 2);
    ctx.fill();
    // Twin tails with dark crystal tips
    ctx.beginPath();
    ctx.arc(-14, -22, 6, 0, Math.PI * 2);
    ctx.arc(14, -22, 6, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Purple Eyes
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(-4, -22, 3, 3);
    ctx.fillRect(2, -22, 3, 3);

    // Corrupted Vortex Staff (Weapon)
    ctx.strokeStyle = '#2e1065';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-8, 4);
    let rad = (180 - b.angle) * Math.PI / 180;
    ctx.lineTo(-8 - Math.cos(rad) * 20, 4 - Math.sin(rad) * 20);
    ctx.stroke();

    // Dark Vortex Tip
    ctx.fillStyle = '#7e22ce';
    let tipX = -8 - Math.cos(rad) * 20;
    let tipY = 4 - Math.sin(rad) * 20;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
    ctx.fill();

    // HP bar above
    ctx.fillStyle = '#111';
    ctx.fillRect(-18, -36, 36, 5);
    ctx.fillStyle = '#ff3366';
    ctx.fillRect(-18, -36, 36 * (b.hp / b.maxHp), 5);

    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Terrain Platforms
    ctx.fillStyle = '#78350f'; 
    ctx.fillRect(0, 250, 240, 90);
    ctx.fillStyle = '#065f46'; 
    ctx.fillRect(0, 250, 240, 8);

    ctx.fillStyle = '#78350f';
    ctx.fillRect(580, 250, 320, 90);
    ctx.fillStyle = '#065f46';
    ctx.fillRect(580, 250, 320, 8);

    drawLuna(p1);
    drawStarfallAbyssLuna(ai);

    if (projectile) {
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = projectile.isPlayer ? '#67e8f9' : '#c084fc';
        ctx.fill();
        ctx.strokeStyle = projectile.isPlayer ? '#0284c7' : '#7e22ce';
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
