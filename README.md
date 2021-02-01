# ticketing
Vấn đề phát sinh với cách thiết kế Microservice
+ Giả sử chúng ta có nhiều service mỗi service được viết bằng các ngôn ngữ khác nhau, trong một trường hợp cụ thể VD:
ở service Auth chúng ta dùng express-validator để handle lỗi => khi của response không thỏa mãn validate của express-validator thì nó sẽ bằn ra lỗi cho client với một lỗi là một object cụ thể do exress-validator quy định vấn đề nảy sinh ở đây là nếu một service khác không sử dụng node => nó sẽ không dùng để express-validator => React (client) phải xử lý lỗi theo một cách khác do lỗi trả về ở service này không đúng cấu trúc object của express-validator nữa
=> Để giải quyết trường hợp này chúng ta phải cấu trúc các response trả về cho client được thống nhất với nhau cho tất cả các service

- Vấn đề xác thực của client-side-render và server-side-render
=> CSR: luồng cơ bản sẽ là trình duyệt sẽ gửi yêu cầu đến nginx để nginx cung cấp một file index.html, trong file index.html này được nhúng các file script.js, trình duyệt sẽ tiếp tục tải các file script về tiếp đó mới gửi các request đến server để lấy data từ đó render ra giao diện trang web
=> SSR: đối với SSR mọi thứ sẽ khác một chút, ở trong next.js nó sẽ render cho chúng ta một trang web hoàn chỉnh ở server luôn, trình duyệt gửi request và nhận file index.html hoàn chỉnh chỉ việc hiển thị ra ngoài màn hình => vấn đề phát sinh là server 