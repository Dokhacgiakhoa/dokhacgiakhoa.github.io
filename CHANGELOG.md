# Changelog — dokhacgiakhoa.github.io

Nhật ký các đợt chỉnh sửa portfolio, ghi lại để xem lại lịch sử sau này. Mới nhất ở trên cùng.

---

## 2026-07-15 (tiếp 3) — Fix "Không tải được dữ liệu GitHub" (rate limit)

**Nguyên nhân:** trang gọi trực tiếp `api.github.com` từ trình duyệt người xem để lấy danh sách repo — GitHub giới hạn 60 lượt gọi/giờ **theo IP**, dùng chung cho tất cả người trên cùng mạng. Test nhiều lần hoặc nhiều người cùng wifi/công ty/trường xem trang là dễ cạn quota, trang báo lỗi không tải được.

**Sửa bằng 2 lớp:**
1. **`localStorage` cache 1 giờ** (`app.js`, hàm `fetchReposData`) — tải trang lại trong vòng 1h dùng thẳng cache, không gọi mạng.
2. **Snapshot tĩnh `data/repos.json`** — GitHub Actions (`.github/workflows/update-repos.yml`) tự chạy mỗi 6 tiếng, dùng `GITHUB_TOKEN` xác thực (quota 5000/giờ) để lấy dữ liệu và commit vào repo. Trang giờ đọc file này (cùng domain, không giới hạn nào) thay vì gọi thẳng GitHub API.
3. Gọi `api.github.com` trực tiếp từ trình duyệt giờ chỉ còn là **phương án cuối cùng** nếu file snapshot vì lý do gì đó chưa deploy được.
4. Bootstrap sẵn `data/repos.json` từ dữ liệu thật để cơ chế chạy được ngay, không cần chờ Action chạy lần đầu.
5. Xóa hẳn đoạn prefetch API cố định chạy mỗi lần tải trang (trước đây tốn 1 lượt gọi dù không cần thiết).

**Đã test:** tải trang lần đầu → chỉ gọi `data/repos.json`, không đụng `api.github.com`. Tải lại lần 2 → không gọi mạng gì cả, lấy từ cache. Không lỗi console.

---

## 2026-07-15 (tiếp 2) — Asset thật: 4 thumbnail + 3 icon AI Tools

Khoa tự tạo bằng Gemini (theo brief ở `Media/project-briefs/` và yêu cầu ở `Media/icon-requests.md`), báo cáo lại qua `REPORT_ASSET_UPDATE.md`. Claude đã review code + test trên trình duyệt, xác nhận đúng:

- **4 thumbnail còn thiếu** giờ đã có, lưu ở `Media/repo-thumbs/`: `multi-social-analytic-msa.png`, `vaic-2026-vibonymus.png`, `web-scraping-kai-labs.png`, `1000-hours-human-learning-with-ai.png`. Cả 7 dự án feature giờ đều có ảnh riêng, đúng phong cách Tron cyan/volumetric đã thống nhất.
- **3 icon AI Tools** không có logo chính thức ở đâu (AntiGravity, Codex, Nano Banana) — Khoa tự vẽ SVG vector riêng, lưu ở `Media/icons/`, thay thế icon Bootstrap tạm trong `index.html`.
- Đã kiểm tra: không ảnh/icon nào lỗi load (`naturalWidth` > 0, không broken), code khớp đúng báo cáo, không phát sinh lỗi console.
- Xóa `Media/icon-requests.md` — yêu cầu trong đó đã hoàn thành.

---

## 2026-07-15 (tiếp) — GSAP nâng cấp + song ngữ VI/EN

### 1. Nâng cấp animation GSAP
- **Flip filter dự án**: khi lọc repo theo ngôn ngữ, các card còn lại giờ trượt mượt vào vị trí mới (GSAP Flip plugin) thay vì chỉ fade tại chỗ.
- **Scramble/glitch hover cho nav-link**: hover vào menu (Về mình/Kỹ năng/Dự án/Liên hệ) chữ nhiễu loạn rồi ổn định lại — dùng chung hàm `scrambleText()` mới (refactor từ hiệu ứng eyebrow repos cũ).
- **Scanline pulse cho HUD panel**: sau khi thanh quét (`hud-panel-bar`) chạy xong lần đầu, nó nhấp nháy nhẹ liên tục (opacity yoyo) để tạo cảm giác "panel đang sống" thay vì đứng yên.

### 2. Song ngữ VI/EN + nút toggle
- Thêm nút chuyển ngôn ngữ **VI / EN** trong header (desktop) và menu mobile.
- Cơ chế: mỗi phần tử cần dịch giữ nguyên tiếng Việt làm nội dung gốc + thuộc tính `data-en` chứa bản tiếng Anh. Khi chuyển sang EN, JS backup HTML gốc vào `data-vi-backup` rồi thay bằng `data-en`; chuyển lại VI thì phục hồi từ backup — không cần viết tay bản sao tiếng Việt.
- Dịch toàn bộ: nav, hero, about (kể cả câu triết lý làm việc), 6 nhóm Skills (tên + mô tả), K.AI Labs & Vnonymus, Repos (heading/intro/CTA + **mô tả 7 dự án động** qua `REPO_DESCRIPTIONS_EN`), Contact, Footer.
- Lựa chọn ngôn ngữ lưu vào `localStorage`, load lại trang vẫn giữ nguyên.
- Repo card (render động từ GitHub API) đổi mô tả + định dạng ngày ("Cập nhật"/"Updated", `vi-VN`/`en-US`) theo ngôn ngữ hiện tại mà không cần fetch lại API — cache `repos` vào biến `cachedRepos`.

### 3. Dọn dẹp
- Xóa CSS chết còn sót: `.contact-items`, `.contact-item`, `.contact-icon` (không còn dùng sau khi đổi cấu trúc Contact section ở đợt trước).

### 4. Đã test
- Toggle VI↔EN qua JS lẫn click chuột thật — nội dung, markup lồng (`<span class="c-gold">`, `<strong>`), mô tả repo động, filter "Tất cả"/"All" đều đúng và khôi phục chính xác 2 chiều.
- Flip filter repos hoạt động không lỗi console.
- Không phát sinh lỗi/warning nào trong suốt quá trình test.

---

## 2026-07-15 — Dọn dẹp, viết lại nội dung VI, mở rộng Skills, sửa Contact

### 1. Dọn dẹp file thừa
- Xóa `style.css`, `reset.css` (không còn được `index.html` load, dư từ trước khi có `style1.css`).
- Xóa `assets/css/bootstrap.min.css`, `assets/js/bootstrap.bundle.min.js` (Bootstrap local không dùng, trang chỉ dùng bootstrap-icons qua CDN).
- Xóa 5 file `.md` kế hoạch cũ ở root: `ANTIGRAVITY_TASK_PLAN.md`, `GSAP_PLAN.md`, `TRON_PLAN.md`, `REVIEW_AND_NEXT_PLAN.md`, `COMPLETION_REPORT.md`.

### 2. Rà soát & chốt danh sách dự án GitHub hiển thị
- Đối chiếu GitHub API thật với thumbnail đang có trong `Media/repo-thumbs/`.
- Loại: `courierxpress`, `moltbot` (không còn tồn tại/đổi tên), `Office-box-Academy`, `git-page-3d-infographic` (không liên quan AI).
- Chốt 7 dự án AI-related được feature: `Agent-skills-setup-for-AntiGravity`, `khoa-hoc-tam-linh`, `videos-by-AI`, `Web-Scraping-by-K.AI-Labs`, `Multi-Social-Analytic-MSA`, `VAIC-2026-Vibonymus-prepare`, `1000-hours-Human-Learning-with-AI`.
- Viết 7 file brief chi tiết tại `Media/project-briefs/*.md` — dùng làm căn cứ tạo prompt ảnh Gemini (không phải prompt viết sẵn, mà là brief mô tả + gợi ý ẩn dụ hình ảnh).

### 3. Viết lại toàn bộ nội dung sang tiếng Việt
- Hero, About, Skills, Contact, Footer, nav, meta SEO — chuyển từ tiếng Anh sang tiếng Việt, giọng văn gần gũi theo yêu cầu.
- Thêm section mới **K.AI Labs & Vnonymus** (giữa Skills và Repos) — giới thiệu K.AI Labs (phòng lab AI, kailabs.io.vn), Vnonymus (đội nòng cốt), Vibonymus (đội thi 6 người, Vietnam AI Innovation Hackathon 2026, Khoa làm đội trưởng).
- Slogan **"Code less. Build more."** gắn vào hero eyebrow (hiệu ứng gõ chữ) và triết lý làm việc ở About — làm rõ ý nghĩa: dùng AI làm thay việc lặp lại nhưng vẫn kiểm soát được AI, không phó mặc.
- Repos section: bỏ fetch/hiện toàn bộ GitHub API, chỉ hiện 7 dự án đã chọn (`FEATURED_REPOS` whitelist trong `app.js`), mô tả tiếng Việt tự viết (`REPO_DESCRIPTIONS`) thay vì description rỗng từ GitHub.
- Contact: bỏ form liên hệ (Formspree placeholder chưa từng hoạt động), thay bằng danh sách kênh liên hệ.

### 4. Mở rộng Skills — 6 nhóm đầy đủ
- AI Tools & Models: Gemini, Google AntiGravity, Claude, GPT (OpenAI), Codex, Nano Banana.
- Ngôn ngữ lập trình: Python, JavaScript, TypeScript, Java, C#, PHP.
- Framework & Thư viện: React, Node.js, FastAPI, Tailwind CSS, Bootstrap, pandas.
- Database: MySQL, PostgreSQL.
- Công cụ & Apps: Git, Docker, VS Code, n8n, Google Cloud/Vercel.
- Icon: devicon (đầy đủ màu) cho các mục có sẵn; simple-icons (đổi màu trắng qua CSS filter) cho Gemini/Claude/GPT/n8n; Bootstrap Icons làm fallback tạm cho AntiGravity/Codex/Nano Banana (không có logo chính thức ở bất kỳ nguồn nào) — yêu cầu tìm/tải logo thật ghi ở `Media/icon-requests.md`.

### 5. Sửa lỗi phát sinh trong lúc test
- **Social row vô hình vĩnh viễn**: `gsap.from()` bắt nhầm trạng thái hiện tại (đã bị set opacity:0 từ trước) làm điểm đến, nên tween chạy "từ 0 tới 0" — sửa bằng `gsap.fromTo()` chỉ định rõ điểm đến.
- **ScrollTrigger lệch vị trí**: `ScrollTrigger.refresh()` chỉ chạy 1 lần cố định sau 600ms, nhưng repos load bất đồng bộ có thể trễ hơn — thêm `ScrollTrigger.refresh()` sau khi repos render xong.
- **Icon email bị méo**: animation xoay 180° trên icon phong bì không đối xứng, xoay dở dang trông méo — bỏ rotation, chỉ giữ scale-in.
- **Icon email lệch tâm**: circle dựa vào padding co giãn theo glyph — đổi sang kích thước cố định 56×56px + flex-center.
- **Heading tiếng Việt vỡ dấu**: font Orbitron không có glyph tiếng Việt đầy đủ — đổi `.sec-heading` sang Be Vietnam Pro (giữ Orbitron cho phần chỉ có chữ Latin: logo, số liệu).

### 6. Contact section — icon = nút chọn, không phải link
- Gộp Email vào chung hàng icon với GitHub/LinkedIn/Facebook/YouTube/K.AI Labs.
- Đổi toàn bộ icon từ `<a>` sang `<button type="button">` (chỉ là selector, không tự điều hướng).
- Thêm khung `.contact-preview` phía trên hàng icon — hiển thị label + link thật (có thể click) của kênh đang được chọn, cập nhật qua JS khi click icon.
- Icon K.AI Labs đổi từ `bi-flask` sang `bi-globe2` (icon website).

---

## Việc còn tồn đọng (chưa làm)
- [x] ~~4 ảnh thumbnail còn thiếu~~ — đã có đủ, xem mục "Asset thật" bên trên.
- [x] ~~Logo thật cho AntiGravity/Codex/Nano Banana~~ — đã có, xem mục "Asset thật" bên trên.
- [ ] Commit các thay đổi vào git (hiện toàn bộ vẫn ở working tree, chưa commit)
