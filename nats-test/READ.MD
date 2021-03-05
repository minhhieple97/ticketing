trong nats-streaming-server có một khái niệm được gọi là queueGroup

- Vấn đề xảy ra khi chúng ta muốn scale một hệ thống lên trong trường hợp chọn cách nhân bản một service thành nhiều service giúp có thể handle được nhiều request hơn phát sinh vấn đề đó là Nats sẽ gửi các message đến tất cả các service này (do các service này giống hệt nhau nên chúng lắng nghe chung 1 channel) => giải quyết vấn đề này bằng QueueGroup => khi cách service đã cùng subcribe vào 1 channel => chúng ta có thể join chúng vào cùng một QueueGroup => Nats sẽ lựa chọn ngẫu nhiên các Service trong QueueGroup để gửi message => Khắc phục được vấn đề trùng lặp dữ liệu giữa các service giống hệt nhau => Nếu chúng ta không join nó vào QueueGroup thì mặc định các service subcribe chung một chanel sẽ cùng nhận được một message của channel đó.

<!-- Xác nhận việc gửi message có thành công hay không của Nats-streaming-server -->

Theo cấu hình mặc định, khi Nats-server gửi message và stan(client) nhận được nó thì Nats sẽ coi message đó đã được gửi thành công nhưng vấn đề phát sinh khi client xử lý message đó bị lỗi (ví dụ trong trường hợp client không connect được tới database) cần rollback ngược lại thì phải làm sao ? để khác phục vấn đề này Nats cung cấp một loại cấu hình giúp dev xác định rõ ràng thời điểm message được xử lý thành công đó là cấu hình setManualAckMode, với cấu hình này khi nào client gọi hàm .ack() thì Nats mới coi message đó được nhận thành công nếu client không gọi thì Nats sẽ điều hướng message đó sang các client khác cùng listen channel sau mỗi 30s, nếu không có client nào thì Nats sẽ liên tục gửi message sau mỗi 30s.

<!-- Cách thức Nats-server xác định client còn hoạt động hay không  -->
- Trên môi trường development khi chúng ta refresh lại code của file listener thì sẽ tạo ra một stan(client) mới, Nats-server đang connect đến stan cũ theo mặc định nó sẽ cho rằng stan đang ngưng hoạt động hoặc có vấn đề gì đó nên sẽ không ngắt kết nối với client này mà chỉ chuyển nó sang trạng thái offline mà thôi, Nats-server sẽ hold message và sẽ gửi lại messge đến stan cũ nếu sau 30s stan cũ không hoạt động trở lại thì Nats-server sẽ gửi đến stan mới được tạo ra => điều này lý giải tại sao khi refresh code ở listener thì message không được gửi ngay lập tức đến stan mới, để khắc phục vấn đề này chúng ta sẽ gửi một thông báo từ client cho nats-server trước khi client stop

<!-- Một số option cần chú ý của Nats -->
setDeliverAllAvailable : Stan sẽ nhận được tất cả các message đã được xuất bản của channel mà nó subcribe trước khi Stan này được tạo ra. 
setManualAckMode : Theo mặc định Nats-server sẽ coi Stan nhận được message thì message đó đã được xử lý nhưng nếu chúng ta muốn trì hoãn hoặc hoặc đẩy nhanh quá trình xác nhận một message thì có thể sử dụng option này đi kèm với setAckWait(time) , sau khoảng thời gian time thì Nats-server sẽ gửi lại.
<!-- Một số vấn đề phát sinh khi scale, nhân bản các service  -->
- Một service được nhân bản để phục vụ quá trình scale 