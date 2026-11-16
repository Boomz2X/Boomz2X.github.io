const pages=[...document.querySelectorAll('.page')];
function showPage(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));if(id==='battle')drawScene();}
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
let gold=1200, hp=100, enemyHp=100, practiceDone=false, claimed=false, turn='player';
const goldEl=document.getElementById('gold');
function updateGold(){goldEl.textContent=gold}
document.getElementById('quickPlay').onclick=()=>startBattle();
document.getElementById('exitBattle').onclick=()=>showPage('home');
function startBattle(){hp=100;enemyHp=100;turn='player';updateHUD();showPage('battle');drawScene();}
document.getElementById('upgrade').onclick=()=>{if(gold>=100){gold-=100;updateGold();alert('ฝึกฝนสำเร็จ! พลังโจมตีเพิ่มขึ้น (ตัวอย่าง)')}else alert('Gold ไม่เพียงพอ')};
document.getElementById('potion').onclick=()=>{hp=Math.min(100,hp+25);updateHUD();alert('ใช้ยาฟื้นพลังแล้ว (ตัวอย่าง)')};
document.querySelectorAll('.buy').forEach(b=>b.onclick=()=>{let c=+b.dataset.cost;if(gold>=c){gold-=c;updateGold();alert('ซื้อไอเทมสำเร็จ!')}else alert('Gold ไม่เพียงพอ')});
document.getElementById('claim').onclick=()=>{if(practiceDone&&!claimed){gold+=100;claimed=true;updateGold();document.getElementById('claim').textContent='รับรางวัลแล้ว'}else if(!practiceDone)alert('เล่นโหมดฝึกซ้อมให้สำเร็จก่อน')};
document.getElementById('angle').oninput=e=>document.getElementById('angleVal').textContent=e.target.value+'°';
document.getElementById('power').oninput=e=>document.getElementById('powerVal').textContent=e.target.value+'%';
function updateHUD(){document.getElementById('hp').textContent=hp;document.getElementById('enemyHp').textContent=enemyHp;document.getElementById('turn').textContent=turn==='player'?'ตาของคุณ — เล็งและยิง!':'คู่ต่อสู้กำลังเล็ง...'}
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
function drawScene(projectile=null){ctx.clearRect(0,0,900,420);let sky=ctx.createLinearGradient(0,0,0,420);sky.addColorStop(0,'#8fd0ec');sky.addColorStop(1,'#e5f3e6');ctx.fillStyle=sky;ctx.fillRect(0,0,900,420);
ctx.fillStyle='#78a95d';ctx.beginPath();ctx.moveTo(0,315);for(let x=0;x<=900;x+=30)ctx.lineTo(x,315+Math.sin(x/80)*18);ctx.lineTo(900,420);ctx.lineTo(0,420);ctx.fill();
ctx.fillStyle='#557c49';ctx.fillRect(0,350,900,70);
drawTank(135,300,'#2e536e');drawTank(750,300,'#8d4c50');
ctx.fillStyle='#fff';ctx.font='18px Tahoma';ctx.fillText('คุณ',115,275);ctx.fillText('คู่ต่อสู้',720,275);
if(projectile){ctx.fillStyle='#ff6d26';ctx.beginPath();ctx.arc(projectile.x,projectile.y,8,0,Math.PI*2);ctx.fill();}}
function drawTank(x,y,color){ctx.fillStyle=color;ctx.fillRect(x-30,y,60,22);ctx.fillStyle='#263748';ctx.fillRect(x-22,y+18,44,9);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,16,Math.PI,0);ctx.fill();ctx.strokeStyle='#263748';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x+22,y-18);ctx.stroke();}
function animateShot(angle,power,onHit){let rad=angle*Math.PI/180,v=power*0.16,vx=Math.cos(rad)*v,vy=-Math.sin(rad)*v,x=165,y=285,t=0;function frame(){t++;x+=vx*2.2;vy+=0.22;y+=vy*2.2;drawScene({x,y});if(x>735&&y>260){onHit();return}if(x<0||x>900||y>420){onHit();return}requestAnimationFrame(frame)}frame();}
document.getElementById('fire').onclick=()=>{if(turn!=='player')return;let a=+document.getElementById('angle').value,p=+document.getElementById('power').value;document.getElementById('fire').disabled=true;animateShot(a,p,()=>{let damage=Math.max(8,Math.round(p/5+Math.random()*10));enemyHp=Math.max(0,enemyHp-damage);turn='enemy';updateHUD();drawScene();setTimeout(()=>{if(enemyHp<=0){alert('ชนะแล้ว! ได้รับ 100 Gold');gold+=100;updateGold();practiceDone=true;document.getElementById('missionProgress').style.width='100%';document.getElementById('missionText').textContent='ความคืบหน้า 1/1';turn='player';updateHUD();document.getElementById('fire').disabled=false;return}let dmg=8+Math.floor(Math.random()*12);hp=Math.max(0,hp-dmg);if(hp<=0){alert('คุณแพ้! ลองใหม่อีกครั้ง');turn='player';hp=100;enemyHp=100}else turn='player';updateHUD();drawScene();document.getElementById('fire').disabled=false},700);});};
updateGold();drawScene();