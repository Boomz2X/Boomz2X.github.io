# BOOMZ THAI EDITION — Game Design Document

## 1. วิสัยทัศน์
เกมยิงปืนใหญ่ 2D แบบผลัดตา ผู้เล่นเลือกมุมและแรงยิง คำนวณวิถีกระสุนจากแรงโน้มถ่วงและสภาพลม แข่งขันและสะสมอุปกรณ์ได้ ใช้ภาษาไทยเป็นภาษาหลัก

## 2. กลุ่มหน้าจอ
1. Splash / Loading — โลโก้เกม, แถบโหลด, ข่าวประกาศ
2. Login / Register — ชื่อผู้ใช้, รหัสผ่าน, ลืมรหัสผ่าน
3. Server Select — ภูมิภาค, สถานะเซิร์ฟเวอร์, จำนวนผู้เล่น
4. Lobby — ตัวละคร, เงิน, ข่าว, ปุ่มโหมดเกม
5. Character — เลเวล, EXP, HP, Attack, Defense, Skill
6. Inventory — อาวุธ, ชุด, หมวก, เครื่องประดับ, ยา
7. Shop — หมวดอาวุธ/แฟชั่น/ไอเทม, ราคา, ยืนยันซื้อ
8. Battle Room — สร้างห้อง, รายชื่อผู้เล่น, แผนที่, รหัสห้อง
9. Battle HUD — HP, ลม, มุม, แรงยิง, เวลา, สกิล, แชต
10. Result — ชนะ/แพ้, EXP, Gold, สถิติการยิง
11. Missions — รายวัน, รายสัปดาห์, Achievement
12. Guild — สร้าง/ค้นหา/สมาชิก/คลังกิลด์/สงครามกิลด์
13. Friends & Chat — เพิ่มเพื่อน, คำเชิญ, บล็อก/รายงาน
14. Ranking — รายสัปดาห์, ซีซัน, กิลด์
15. Mail — ของขวัญ, ประกาศ, รางวัลกิจกรรม
16. Settings — เสียง, ภาษา, กราฟิก, ปุ่มควบคุม, ความเป็นส่วนตัว

## 3. Core Gameplay
- ผู้เล่น 2–4 คนต่อแมตช์
- ผลัดกันเล่นตามลำดับ
- เล็งด้วยมุม 10–80 องศา และกำหนดแรงยิง 20–100%
- วิถีกระสุนใช้สมการพื้นฐาน x(t)=v cos(θ)t, y(t)=v sin(θ)t−½gt²
- ลมมีผลต่อความเร็วแนวราบ
- การโจมตีคิดความเสียหายจากอาวุธ, ระยะใกล้จุดตก, เกราะ และสกิล
- จบแมตช์เมื่อผู้เล่นฝ่ายหนึ่ง HP หมดหรือหมดเวลา

## 4. โหมดเกม
- ฝึกซ้อม: ผู้เล่น vs AI
- ดวล: 1v1
- ทีม: 2v2
- ห้องส่วนตัว: ตั้งรหัสห้องและเชิญเพื่อน
- PvE: ต่อสู้มอนสเตอร์/บอสตามด่าน
- Tournament: แข่งขันตามฤดูกาล (ระยะถัดไป)

## 5. เศรษฐกิจและความก้าวหน้า
- Gold: เงินจากภารกิจและแมตช์ ใช้ซื้อของทั่วไป
- Diamond: สกุลเงินพรีเมียม (ต้องมีระบบชำระเงินที่ปลอดภัยก่อนเปิดใช้)
- EXP: เพิ่มเลเวลและปลดล็อกคอนเทนต์
- อาวุธ: ค่าพลัง, ประเภทกระสุน, ความสามารถพิเศษ
- อุปกรณ์: โบนัสค่าสถานะที่สมดุล
- Pet: โบนัสสนับสนุนแบบไม่ทำลายสมดุล PvP
- ป้องกัน Pay-to-Win: ไอเทมแฟชั่นแยกจากค่าสถานะ และมีเพดานพลัง

## 6. ระบบหลังบ้านที่ต้องพัฒนา
- Authentication: สมัคร/เข้าสู่ระบบ, token, reset password
- Player Service: โปรไฟล์, เลเวล, inventory
- Matchmaking: คิว, ห้อง, reconnect
- Realtime Game Server: authoritative turn state, validation, physics
- Economy Service: ตรวจสอบยอดเงินและธุรกรรมแบบ atomic
- Mission Service: progress และ reward claim ป้องกันรับซ้ำ
- Social Service: friend, guild, chat, report
- Admin Panel: จัดการผู้เล่น, item catalog, event, moderation
- Logging/Analytics: crash, match result, economy audit

## 7. โครงสร้างข้อมูลเบื้องต้น
User(id, username, password_hash, created_at)
Player(user_id, nickname, level, exp, gold, diamond)
Inventory(id, player_id, item_id, quantity, equipped)
Item(id, name_th, type, stats_json, price_gold, price_diamond)
Match(id, mode, map_id, status, started_at, ended_at)
MatchPlayer(match_id, player_id, team, hp, result)
Mission(id, title_th, target, reward_gold, active_from, active_to)
MissionProgress(player_id, mission_id, progress, claimed)
Guild(id, name, owner_id, level)
GuildMember(guild_id, player_id, role)

## 8. Storyboard: บทนำ (ประมาณ 90 วินาที)
ฉาก 1 (0–8s): จอมืด มีเสียงลมและเสียงโลหะ ก่อนโลโก้เกมปรากฏ
ฉาก 2 (8–18s): กล้องเคลื่อนผ่านดินแดนลอยฟ้า เมือง และสนามฝึก
ฉาก 3 (18–28s): ตัวละครฝึกหัดพบอาวุธปืนใหญ่เก่าที่ถูกทิ้งไว้
ฉาก 4 (28–40s): สัญญาณเตือนดังขึ้น ศัตรูบุกเข้ามาจากเนินเขา
ฉาก 5 (40–52s): ผู้บัญชาการสอนวิธีปรับมุมและแรงยิง
ฉาก 6 (52–65s): ตัวละครยิงกระสุนแรก วิถีกระสุนโค้งผ่านท้องฟ้า
ฉาก 7 (65–78s): เกิดแรงระเบิด ฝุ่นควันกระจาย ศัตรูถอย
ฉาก 8 (78–90s): ขึ้นข้อความ “การผจญภัยเริ่มต้นขึ้นแล้ว” และปุ่มเริ่มเกม

## 9. Storyboard: Tutorial Battle
1. แนะนำ HUD: HP, ลม, มุม, แรงยิง
2. ไฮไลต์แถบมุมยิงและสอนเลื่อน
3. ไฮไลต์แรงยิงและสอนปรับ
4. แสดงเส้นวิถีกระสุนแบบเส้นประ
5. ผู้เล่นกดยิง กระสุนพุ่งและระเบิด
6. AI ตอบโต้ ผู้เล่นเรียนรู้การหลบ/ใช้ไอเทม
7. ผู้เล่นชนะ รับ EXP และ Gold
8. เปิดหน้าสรุปผลและชี้ไปยังภารกิจแรก

## 10. Roadmap
Phase 1: UI + playable local prototype (ไฟล์ที่แนบ)
Phase 2: แยกโมดูล gameplay, ระบบแผนที่/อาวุธ/AI, save ด้วย localStorage
Phase 3: Backend, account, database, inventory server-side
Phase 4: Multiplayer realtime, matchmaking, chat, guild
Phase 5: Admin, anti-cheat, security test, load test, deploy
Phase 6: Mobile responsive, QA, localization, launch

## 11. เกณฑ์ทดสอบก่อนเปิดจริง
- คำนวณวิถีกระสุนตรงกันทั้ง client/server
- ผู้เล่นแก้ไข Gold/ผลแมตช์จาก browser ไม่ได้
- reward claim ซ้ำไม่ได้
- reconnect แล้วสถานะแมตช์ไม่เสีย
- ทดสอบ latency, disconnect, concurrent matches
- มีระบบรายงาน/บล็อกผู้เล่นและ moderation
