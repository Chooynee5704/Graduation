# Phương Mai — Hello, future.

Thiệp mời tốt nghiệp cinematic 3D, cam–đen, dành cho Nguyễn Thị Phương Mai.

```sh
npm install
npm run dev
npm run build
npm run preview
```

Ngày: **07.11.2026**. Địa chỉ: **Đường D1, Khu Công nghệ cao, Tăng Nhơn Phú, TP HCM**. Chưa có giờ tổ chức nên không tự thêm.

## Bản dựng hiện tại

Một world Three.js xuyên suốt với mũ tốt nghiệp có vật liệu vải, tua cam, dải đồng xoắn, terminal/code trong chiều sâu, hạt mũ tách rồi tụ lại và camera điều khiển bằng native scroll. GSAP + ScrollTrigger + Lenis. Background là shader realtime sử dụng ảnh ImageGen làm chất liệu; không phải video AI.

Nội dung: `index.html`. Responsive: `src/style.css`. DOM motion và scroll conductor: `src/main.js`. Scene, camera và shader: `src/world.js`.

Đọc [WORLD.md](WORLD.md) cho scene/camera/material/asset/lifecycle ledgers, [SKILLS-REVIEW.md](SKILLS-REVIEW.md) cho khảo sát 61 skill đầy đủ của project, và `qa/` cho bằng chứng kiểm thử.

`?motion=reduce` mở bản tĩnh để kiểm tra fallback. Hệ điều hành bật reduced motion cũng nhận bản này tự động. Nút pause chỉ tạm dừng chuyển động nền tự động, vẫn giữ điều hướng cuộn.

## Hosting

Site identity trong `.openai/hosting.json`, bản production trong `dist/`. Giữ nguyên Site và quyền truy cập của bản trước. Chạy lại build trước khi đóng gói hoặc publish.

## Xác nhận tham dự

Website hiện chạy bằng Sites Vinext Worker để lưu xác nhận vào Cloudflare D1 (`DB`), bảng `attendance`. Chỉ lưu tên, mã chống gửi trùng và thời điểm gửi. Danh sách không có API đọc công khai. Chủ website có thể xem bảng trong Sites Settings → Database, hoặc yêu cầu Codex đọc danh sách qua công cụ Sites database.

`index.html` vẫn là nguồn nội dung. `npm run build` trích phần body thành `app/experience.html`, giữ nguyên cảnh cinematic và build client + server. Khi sửa nội dung trước dev, chạy `node scripts/prepare-experience.mjs`.

```sh
npm run db:generate
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_luxuriant_wither.sql
npm start -- --port 5173
node --test tests/rsvp.test.mjs
```

Chỉ áp dụng migration local một lần cho mỗi database local. Sites áp dụng migration production khi deploy. Dữ liệu kiểm thử chỉ nằm local và không được đưa lên production. Link hiện giữ nguyên quyền truy cập của Site; cần quyền chia sẻ phù hợp để khách truy cập và gửi tên.
