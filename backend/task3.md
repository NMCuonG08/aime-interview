## Yêu cầu và đề bài: 
- Giả sử có 1 hệ thống đặt bàn cho 1 nhà hàng với yêu cầu sau:
    - Đơn hàng được tạo bởi người dùng không được trùng thời gian và số bàn với những đơn đặt hàng khác đang có trạng thái là Created hoặc Paid.
    - Khi đơn đặt bàn tạo ra sẽ có trạng thái mặc định là Created sau khi thanh toán sẽ được chuyển về Paid.
    - Sau khi đặt bàn 15 phút nếu Khách hàng không thực hiện thanh toán trước hoặc giao dịch thanh toán không thành công thì sẽ tự động chuyển trạng thái về Canceled để nhường chỗ cho người khác.

*Mô tả cách xử lý đặt hàng để đảm bảo không bị trùng và cách để hệ thống có thể update trạng thái các đơn đặt sau 15 phút. 
Viết câu query CSDL cho từng yêu cầu nếu có.*


## 1. Mô tả cách xử lý đặt hàng để đảm bảo không bị trùng 

Giả sử ta có bảng CSDL như sau: 

```sql
CREATE TABLE reservations (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL,
    table_id      INTEGER NOT NULL,
    reservation_time TIMESTAMP NOT NULL,  
    status        VARCHAR(20) CHECK (status IN ('Created', 'Paid', 'Canceled')),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- Ý tưởng là em sẽ sử dụng transaction để đảm bảo tính toàn vẹn của dữ liệu tránh có 2 bảng dữ liệu trùng nhau sẽ tự động hủy bỏ 

Và quy trình tạo đơn đặt bàn như sau: 

1. Bắt đầu transaction.
2. Kiểm tra xem đã có đơn nào trùng bàn + thời gian và đang ở trạng thái Created hoặc Paid chưa.
3. Nếu có → rollback và trả về lỗi “Bàn đã được đặt”.
4. Nếu không → INSERT đơn mới với status = Created.
5. Commit transaction.

```sql
BEGIN;

SELECT id 
FROM reservations 
WHERE table_id = $1 
  AND reservation_time = $2 
  AND status IN ('Created', 'Paid')
FOR UPDATE;  

INSERT INTO reservations (user_id, table_id, reservation_time, status)
VALUES ($3, $1, $2, 'Created')
RETURNING id;

COMMIT;
```
## 2. Cách để hệ thống có thể update trạng thái các đơn đặt sau 15 phút. 

- Em sẽ sử dụng background job để kiểm tra và update trạng thái các đơn đặt sau 15 phút.

- Đơn giản nhất với nodejs thì em sẽ sử dụng `node-cron` để tạo 1 cron job chạy sau mỗi 1 phút để kiểm tra và update trạng thái các đơn đặt sau 15 phút.

```sql
UPDATE reservations 
SET 
    status = 'Canceled',
    updated_at = CURRENT_TIMESTAMP
WHERE status = 'Created'
  AND created_at <= CURRENT_TIMESTAMP - INTERVAL '15 minutes';
```
- Lúc đầu em tính dùng  `Event Scheduler` nhưng nhận thấy nó không được ổn định và khó kiểm soát nên tốt nhất là dùng các thư viện để dễ kiểm soát và sửa chữa sau này.

### Ngoài ra, khi mà hệ thống lớn lên và server cần được ổn định nhất khi mà server bị crash lỗi dẫn đến mất hoặc hỏng dữ liệu thì em sẽ sử dụng BullMQ ( nó là 1 Message Queue của nodejs thường dụng ,theo em biết là thế ) và Redis để lưu các thông tin Background Job ( việc lưu trữ này sẽ không làm mất các job khi mà server bị gì ) .

- Ý tưởng sẽ như sau: 
BullMQ hoạt động theo mô hình Producer – Queue (Redis) – Worker:

    - Producer: Là nơi viết code đẩy lên tên job và thời gian cần xử lý lên trên redis.
    - Redis đóng vai trò là “hàng đợi thông minh” (Queue), lưu trữ các thông tin job.
    - Worker (do em dùng nodejs đơn luồng nên sẽ cần tự tạo các worker để xử lý song song) : Liên tục lấy job ra từ Redis để xử lý (ví dụ như update trạng thái đơn đặt bàn sau 15 phút).

