\video 167 setup env cho project
 
Video 216 : Giải thích cách giao tiếp giữa các pod khác namespace
Một số issue của vấn đề này ở video 219,220

Video 275 : ở phút cuối chỉ ra cách để expose nats-streaming-server cho server khác truy cập

Video 282: Ở file deploy của Nats chúng ta expose 2 port của Nats-server 1 port 4222 để client(stan) connect, 1 port 8222 để monitoring(giúp trực quan hóa hoạt động của hệ thống Nats), publish port 8222 của Nats ra để check tại sao lại có hiện tượng message không gửi đến client ngay lập tức. sử dụng url localhost:8222/streaming để nhìn thấy được các thống kê của Nats
- sử dụng localhost:8222/streaming/channelsz để xem thông tin về các channel được tạo (trả về một mảng)
- sử dụng localhost:8222/streaming/channelsz?subs=1 

Xem lại video 284,285,286,287 nói về vấn đề giao tiếp giữa các service khi thiết kế hệ thống dựa trên mô hình microservice 

- chạy lại test thoe hướng dẫn ở video 379 từ phút thứ 15


- chạy lại để test ở video 411 