// Three.js 3D Battle Engine for LUNA & Starfall Abyss
let scene, camera, renderer, container;
let lunaMesh, bossMesh, projectileMesh;
let p1 = { x: -4, z: 0, hp: 100, maxHp: 100, angle: 45, power: 50 };
let ai = { x: 4, z: 0, hp: 100, maxHp: 100, angle: 135, power: 50 };
let wind = 0.0;
let turn = 'player';
let projectile = null;
let gameRunning = false;

function initThree() {
    container = document.getElementById('three-container');
    if(renderer) {
        container.innerHTML = '';
    }

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 280;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f19);
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.05);

    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 1, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Brightened lighting so it's never pitch black
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x67e8f9, 1.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const purpleLight = new THREE.PointLight(0xc084fc, 3, 20);
    purpleLight.position.set(4, 3, 2);
    scene.add(purpleLight);

    // Create Floating Island Platforms
    createTerrain();

    // Create 3D Models for Luna & Boss Starfall Abyss
    createLunaModel();
    createBossModel();

    window.addEventListener('resize', onWindowResize);
}

function createTerrain() {
    const cliffGeo = new THREE.BoxGeometry(4, 3, 3);
    const cliffMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const leftCliff = new THREE.Mesh(cliffGeo, cliffMat);
    leftCliff.position.set(-4, -1.5, 0);
    scene.add(leftCliff);

    const grassGeo = new THREE.BoxGeometry(4.2, 0.4, 3.2);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5 });
    const leftGrass = new THREE.Mesh(grassGeo, grassMat);
    leftGrass.position.set(-4, 0.2, 0);
    scene.add(leftGrass);

    const rightCliff = new THREE.Mesh(cliffGeo, cliffMat);
    rightCliff.position.set(4, -1.5, 0);
    scene.add(rightCliff);

    const rightGrass = new THREE.Mesh(grassGeo, grassMat);
    rightGrass.position.set(4, 0.2, 0);
    scene.add(rightGrass);
}

function createLunaModel() {
    lunaMesh = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.6), bodyMat);
    body.position.y = 0.8;
    lunaMesh.add(body);

    const skirtMat = new THREE.MeshStandardMaterial({ color: 0x065f46 });
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 0.6, 6), skirtMat);
    skirt.position.y = 0.2;
    lunaMesh.add(skirt);

    const headMat = new THREE.MeshStandardMaterial({ color: 0xfde047 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), headMat);
    head.position.y = 1.5;
    lunaMesh.add(head);

    const hairMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16), hairMat);
    hair.position.set(0, 1.55, -0.05);
    lunaMesh.add(hair);

    const leftTail = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), hairMat);
    leftTail.position.set(-0.5, 1.6, -0.2);
    lunaMesh.add(leftTail);
    const rightTail = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), hairMat);
    rightTail.position.set(0.5, 1.6, -0.2);
    lunaMesh.add(rightTail);

    const packMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), packMat);
    pack.position.set(0, 0.9, -0.4);
    lunaMesh.add(pack);

    const staffMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2), staffMat);
    staff.position.set(0.8, 1.0, 0.2);
    staff.rotation.z = -0.3;
    lunaMesh.add(staff);

    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x22d3ee, emissiveIntensity: 0.9 });
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), crystalMat);
    crystal.position.set(1.0, 1.9, 0.2);
    lunaMesh.add(crystal);

    lunaMesh.position.set(-4, 0.4, 0);
    scene.add(lunaMesh);
}

function createBossModel() {
    bossMesh = new THREE.Group();

    const portalMat = new THREE.MeshStandardMaterial({ color: 0x7e22ce, emissive: 0x581c87, roughness: 0.2 });
    const portal = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.9, 16), portalMat);
    portal.rotation.x = -Math.PI / 2;
    portal.position.y = 0.05;
    bossMesh.add(portal);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x311042 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.6), bodyMat);
    body.position.y = 1.0;
    bossMesh.add(body);

    const crystalMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x7e22ce, emissiveIntensity: 0.9 });
    const crys1 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 4), crystalMat);
    crys1.position.set(-0.6, 1.3, 0);
    crys1.rotation.z = 0.5;
    bossMesh.add(crys1);

    const crys2 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 4), crystalMat);
    crys2.position.set(0.6, 1.3, 0);
    crys2.rotation.z = -0.5;
    bossMesh.add(crys2);

    const headMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), headMat);
    head.position.y = 1.7;
    bossMesh.add(head);

    const hairMat = new THREE.MeshStandardMaterial({ color: 0x2e1065 });
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16), hairMat);
    hair.position.set(0, 1.75, -0.05);
    bossMesh.add(hair);

    const staffMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b });
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4), staffMat);
    staff.position.set(-0.9, 1.2, 0.2);
    staff.rotation.z = 0.3;
    bossMesh.add(staff);

    const vortexMat = new THREE.MeshStandardMaterial({ color: 0x581c87, emissive: 0x9333ea, emissiveIntensity: 1.0 });
    const vortex = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), vortexMat);
    vortex.position.set(-1.1, 2.1, 0.2);
    bossMesh.add(vortex);

    bossMesh.position.set(4, 0.6, 0);
    scene.add(bossMesh);
}

function onWindowResize() {
    if(!container || !renderer || !camera) return;
    let w = container.clientWidth || window.innerWidth;
    let h = container.clientHeight || 280;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

function enterGameRoom() {
    document.getElementById('portal-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Use setTimeout to ensure container has rendered dimensions before Three.js initializes
    setTimeout(() => {
        if(!renderer) {
            initThree();
        } else {
            onWindowResize();
        }
        initBattle();
    }, 50);
}

function exitGameRoom() {
    gameRunning = false;
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('portal-screen').classList.remove('hidden');
}

function initBattle() {
    p1.hp = 100; ai.hp = 100;
    wind = (Math.random() - 0.5) * 0.4;
    turn = 'player';
    gameRunning = true;
    updateHUD();
    animate();
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
    document.getElementById('val-angle').innerText = p1.angle;
    document.getElementById('val-power').innerText = p1.power;
    document.getElementById('force-bar-fill').style.width = p1.power + '%';
    document.getElementById('force-dial').innerText = p1.power;
    
    let bossPercent = (ai.hp / ai.maxHp) * 100;
    document.getElementById('boss-hp-fill').style.width = bossPercent + '%';

    let pDot = document.getElementById('minimap-player');
    let eDot = document.getElementById('minimap-enemy');
    if(pDot && eDot) {
        pDot.style.left = '25%';
        eDot.style.left = '75%';
    }
}

function fireBullet() {
    if (turn !== 'player') return;
    turn = 'animating';

    const projGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const projMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x00f0ff, emissiveIntensity: 1 });
    projectileMesh = new THREE.Mesh(projGeo, projMat);
    
    let rad = p1.angle * Math.PI / 180;
    let v = p1.power * 0.03;
    
    projectile = {
        x: -4, y: 1.5, z: 0,
        vx: Math.cos(rad) * v,
        vy: Math.sin(rad) * v,
        isPlayer: true
    };
    
    projectileMesh.position.set(projectile.x, projectile.y, projectile.z);
    scene.add(projectileMesh);
}

function aiTurn() {
    if (!gameRunning) return;
    setTimeout(() => {
        if (!gameRunning || ai.hp <= 0) return;
        
        const projGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const projMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x7e22ce, emissiveIntensity: 1 });
        projectileMesh = new THREE.Mesh(projGeo, projMat);

        let v = 0.7 + Math.random() * 0.2;
        projectile = {
            x: 4, y: 1.5, z: 0,
            vx: -v * 0.8,
            vy: 0.4,
            isPlayer: false
        };

        projectileMesh.position.set(projectile.x, projectile.y, projectile.z);
        scene.add(projectileMesh);
        turn = 'animating';
    }, 1000);
}

function updateGameLogic() {
    if (projectile) {
        projectile.vy -= 0.015;
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;
        
        if(projectileMesh) {
            projectileMesh.position.set(projectile.x, projectile.y, projectile.z);
        }

        let targetX = projectile.isPlayer ? 4 : -4;
        let dist = Math.abs(projectile.x - targetX);

        if (projectile.y <= 0.4 || dist < 0.6) {
            let target = projectile.isPlayer ? ai : p1;
            let dmg = Math.round(35 + Math.random() * 20);
            target.hp = Math.max(0, target.hp - dmg);
            updateHUD();

            if(projectileMesh) {
                scene.remove(projectileMesh);
                projectileMesh = null;
            }
            projectile = null;

            if (target.hp <= 0) {
                turn = 'gameover';
                gameRunning = false;
                alert(projectile.isPlayer ? "🎉 ยินดีด้วย คุณเอาชนะ LUNA, THE STARFALL ABYSS สำเร็จ!" : "💀 LUNA พ่ายแพ้ต่อพลังแห่งความมืด!");
                setTimeout(exitGameRoom, 1500);
                return;
            }

            if (projectile && projectile.isPlayer) {
                turn = 'ai';
                aiTurn();
            } else {
                turn = 'player';
            }
        }
    }
}

function animate() {
    if (!gameRunning) return;
    requestAnimationFrame(animate);
    
    if(bossMesh) {
        bossMesh.position.y = 0.6 + Math.sin(Date.now() * 0.003) * 0.1;
    }

    updateGameLogic();
    if(renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}
