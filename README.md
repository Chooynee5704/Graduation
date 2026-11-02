# Phương Mai — The human behind the code

Thiệp mời tốt nghiệp ngày **07.11.2026** tại Đại học FPT. Giữ nguyên thông tin liên hệ, địa chỉ, lời mời và backend xác nhận tham dự bằng D1.

## Chạy local

```sh
npm install
npm run dev
npm run build
npm start -- --port 5174
node --test tests/rsvp.test.mjs
```

`index.html` là nguồn nội dung, `scripts/prepare-experience.mjs` sinh `app/experience.html` trước dev/build. CSS được import trong layout để SSR và trong client để Vinext dev tải đúng stylesheet.

## Thiết kế ngày 02.11.2026

- Hero ảnh thật, typography lớn và chuyển động parallax nhẹ theo pointer.
- The source: đoạn code tượng trưng và thanh “Compiling memories” tiến theo cuộn.
- The becoming: tám dải màn trập mở luân phiên để lộ ảnh giơ mũ; cuộn ngược đảo chiều.
- The memories: album ảnh ngang điều khiển bằng cuộn dọc tự nhiên.
- The invitation: thiệp trang trọng và form xác nhận tham dự.

GSAP + ScrollTrigger + Lenis (một smooth-scroll engine). Không tải world Three.js cũ; ảnh và chuyển động DOM là trọng tâm. Không có vòng render WebGL hoặc animation nền vô hạn. Animation dùng transform và clip-path.

`?motion=reduce` hoặc tùy chọn reduced motion của hệ điều hành hiển thị ảnh tĩnh và album dọc. Không có JavaScript vẫn đọc đủ nội dung theo luồng tài liệu. Xem `DESIGN.md` cho nguồn ảnh, ý tưởng và token; `qa/cinematic-2026-11-02.md` cho kiểm tra hiện tại.

## Hosting và dữ liệu

Site identity giữ nguyên trong `.openai/hosting.json`. Bản Worker production nằm trong `dist/`. Không đổi quyền truy cập khi cập nhật.

Form `/api/rsvp` chỉ lưu tên, mã chống gửi trùng và thời điểm gửi vào `attendance`. Danh sách không có API đọc công khai. Chủ Site xem dữ liệu trong Sites Settings → Database. Không đưa dữ liệu test lên production.

Follow-up: the invitation now includes **10:00–12:30**. Portrait alpha cutout, continuous warm-black background and responsive photograph masks are in `src/cinematic.css`; see `DESIGN.md` for image-edit provenance and motion changes.
