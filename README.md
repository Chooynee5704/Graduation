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
