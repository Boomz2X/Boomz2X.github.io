function selectServer(name) {
    document.querySelectorAll('.server-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.getElementById('selected-server-text').innerText = `เซิร์ฟเวอร์: ${name}`;
}

function openSystemModal(title) {
    alert(`[ระบบ ${title}]: เปิดใช้งานฟังก์ชันเรียบร้อยแล้ว รองรับการเล่นบนทุกแพลตฟอร์ม`);
}

function sendPortalChat() {
    const input = document.getElementById('portal-chat-input');
    const text = input.value.trim();
    if(!text) return;
    const box = document.getElementById('portal-chat-box');
    box.innerHTML += `<div class="chat-msg"><span>[C A $ H]:</span> ${text}</div>`;
    box.scrollTop = box.scrollHeight;
    input.value = '';
}
