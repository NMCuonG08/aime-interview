# Task 2: Rain Water Trap Visualization

Trực quan hóa thuật toán hứng nước mưa bằng mảng số nguyên.

### Cách làm:
- Thuật toán: Dùng 2 mảng lưu giá trị lớn nhất bên trái và bên phải (Prefix/Suffix Max) để tính lượng nước đọng tại mỗi cột với độ phức tạp O(n).
- Hiển thị: Dùng Canvas API để vẽ.
- Logic vẽ: 
  - Vẽ các cột tường (đen) dưới dạng các ô vuông riêng biệt có khoảng cách.
  - Vẽ nước (xanh) thành khối liền mạch nhưng vẫn giữ khoảng cách với các khối tường.
  - Canvas tự động tính toán lại kích thước mỗi khi input thay đổi để không bị tràn.

### Cách chạy:
Mở file `index.html` bằng trình duyệt.
