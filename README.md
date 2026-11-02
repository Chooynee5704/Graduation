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

## Sổ khách mời dành cho chủ thiệp

Mở `/admin` hoặc liên kết “Quản lý khách mời” ở cuối thiệp. Đăng nhập ChatGPT bằng tài khoản chủ thiệp `mainee5704@gmail.com`. Trang hiển thị tổng lượt xác nhận, tên và thời điểm gửi (giờ Việt Nam), tìm kiếm theo một phần tên, phân trang 50 dòng, làm mới và tải CSV theo bộ lọc. Không xóa hay sửa xác nhận.

API `/api/admin/attendance` kiểm tra identity do Sites cung cấp và allowlist email chủ thiệp trên server cho mỗi lần đọc hoặc xuất CSV. Khách ẩn danh nhận 401, tài khoản khác nhận 403, response không cache. Không có bí mật trong client, không đổi audience của Site. CSV có BOM UTF-8, escape dấu ngoặc kép và trung hòa công thức bảng tính. Giới hạn xuất 10.000 dòng mỗi bộ lọc; vượt giới hạn yêu cầu thu hẹp tìm kiếm thay vì cắt dữ liệu âm thầm.

Local preview cho phép identity mock `local_seedy / seedy@sites.test` chỉ khi `import.meta.env.DEV` bật. Bản production tắt nhánh này. Dùng đăng nhập local tại `/signin-with-chatgpt?return_to=%2Fadmin` để xem dữ liệu local. Không có tài khoản mock hoặc dữ liệu kiểm thử được tạo trên production.

`node --test tests/*.test.mjs`: 15 bài kiểm tra, gồm xác thực, quyền xuất CSV, SQL có bind, phân trang, công thức CSV, lỗi database và RSVP cũ.
