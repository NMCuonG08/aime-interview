# Aimesoft Recruitment Test - Nguyễn Mạnh Cường

Bộ bài làm gồm 4 task (2 Frontend, 2 Backend) .

---

##  FRONTEND

### Task 1: Text Analyzer (Drag & Drop)
- **Công nghệ:** HTML/CSS, JS, Web Worker.
- **Mô tả:** 
  - Xử lý tác vụ nặng qua Web Worker để đảm bảo UI không bị block.
  - Validate đầu vào (chỉ Alphabet, dấu chấm/phẩy/khoảng trắng).
  - Xử lý các case: file không đủ số lượng từ, file chứa số hoặc ký tự lạ.

### Task 2: Rain Water Trap Visualization
- **Công nghệ:** Canvas API.
- **Mô tả:** 
  - Triển khai giải thuật Trapping Rain Water.
  - Trực quan hóa các khối tường và mực nước đọng lại theo thời gian thực từ input của người dùng.

---

##  BACKEND

### Task 3: Reservation System Design
- **Giải quyết:** Bài toán trùng lịch và tự động hủy đơn sau 15p.
- **Mô tả:** 
  - Sử dụng SQL Transaction + `FOR UPDATE` để đảm bảo tính toàn vẹn dữ liệu khi đặt bàn.
  - Đề xuất giải pháp scale: Dùng `node-cron` cho máy chủ đơn lẻ hoặc `BullMQ + Redis` cho hệ thống phân tán để quản lý Background Jobs hiệu quả.

### Task 4: Call Logs Analysis
- **Nội dung:** Thiết kế ERD quản lý cuộc gọi và viết các câu query SQL phức tạp.
- **Mô tả:** 
  - Sử dụng `DENSE_RANK()` để xử lý trường hợp nhiều người cùng xếp hạng 2 về thời lượng (đúng yêu cầu đề bài).
  - Tối ưu hóa JOIN và điều kiện thời gian.

---

## Cách chạy dự án
1. **Frontend:** Mở trực tiếp file [index.html](cci:7://file:///e:/Project/aime-interview/frontend/task1/index.html:0:0-0:0) trong thư mục `task1` hoặc `task2`.
2. **Backend:** Xem chi tiết mô tả logic và mã nguồn SQL trong thư mục `backend/` (file `.md`).
