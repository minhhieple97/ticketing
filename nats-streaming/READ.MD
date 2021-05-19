=> Sử dụng một thư việc là node-nats-streaming để kết nối với Nats Streaming Server, mỗi service kết nối với với Nast Streaming Service chúng ta gọi nó là Stan
<!-- Mô tả quá trình hoạt động của NATS Streaming -->
- Khi một Publisher bắn một event, event này sẽ được lưu lại trong channel của Nats Streaming (gọi đơn giản là Event History)
do listener lắng nghe channel nó đã subcribe, nên nó được Nast đẩy cho event nhưng bản thân Nast cũng sẽ giữ một bản copy của event đó. 
Trong nats-streaming-server có một khái niệm được gọi là queueGroup

- Vấn đề xảy ra khi chúng ta muốn scale một hệ thống lên trong trường hợp chọn cách nhân bản một service thành nhiều service giúp có thể handle được nhiều request hơn phát sinh vấn đề đó là Nats sẽ gửi các message đến tất cả các service này (do các service này giống hệt nhau nên chúng lắng nghe chung 1 channel) => giải quyết vấn đề này bằng QueueGroup => khi cách service đã cùng subcribe vào 1 channel => chúng ta có thể join chúng vào cùng một QueueGroup => Nats sẽ lựa chọn ngẫu nhiên các Service trong QueueGroup để gửi message => Khắc phục được vấn đề trùng lặp dữ liệu giữa các service giống hệt nhau => Nếu chúng ta không join nó vào QueueGroup thì mặc định tất cả các service subcribe chung một chanel sẽ cùng nhận được một message của channel đó.

<!-- Xác nhận việc gửi message có thành công hay không của Nats-streaming-server -->

Theo cấu hình mặc định, khi Nats-server gửi message và stan(client) nhận được nó thì Nats sẽ coi message đó đã được gửi thành công nhưng vấn đề phát sinh khi client xử lý message đó bị lỗi (ví dụ trong trường hợp client không connect được tới database) cần rollback ngược lại thì phải làm sao ? để khác phục vấn đề này Nats cung cấp một loại cấu hình giúp dev xác định rõ ràng thời điểm message được xử lý thành công đó là cấu hình setManualAckMode, với cấu hình này khi nào client gọi hàm .ack() thì Nats mới coi message đó được nhận thành công nếu client không gọi thì Nats sẽ điều hướng message đó sang các client khác cùng listen channel sau mỗi 30s, nếu không có client nào thì Nats sẽ liên tục gửi message sau mỗi 30s.

<!-- Cách thức Nats-server xác định client còn hoạt động hay không  -->

- Trên môi trường development khi chúng ta refresh lại code của file listener thì sẽ tạo ra một stan(client) mới, Nats-server đang connect đến stan cũ theo mặc định nó sẽ cho rằng stan đang ngưng hoạt động hoặc có vấn đề gì đó nên sẽ không ngắt kết nối với client này mà chỉ chuyển nó sang trạng thái offline mà thôi, Nats-server sẽ hold message và sẽ gửi lại messge đến stan cũ nếu sau 30s stan cũ không hoạt động trở lại thì Nats-server sẽ gửi đến stan mới được tạo ra => điều này lý giải tại sao khi refresh code ở listener thì message không được gửi ngay lập tức đến stan mới, để khắc phục vấn đề này chúng ta sẽ gửi một thông báo từ client cho nats-server trước khi client stop

<!-- Một số option cần chú ý của Nats -->

- setDeliverAllAvailable : Stan sẽ nhận được tất cả các event mà nó từng được nhận, tính năng này rất hữu ích mỗi khi chúng ta cần khởi động lại, deploy hoặc server bị lỗi tránh được tình trạng missing dữ liệu nhưng nó phát sinh ra một vấn đề rất lớn về mặt hiệu năng do service có thể phải xử lý một lượng event cực lớn.
- setManualAckMode : Theo mặc định Nats-server sẽ coi Stan nhận được message thì message đó đã được xử lý nhưng nếu chúng ta muốn trì hoãn hoặc hoặc đẩy nhanh quá trình xác nhận một message thì có thể sử dụng option này đi kèm với setAckWait(time) , sau khoảng thời gian time thì Nats-server sẽ gửi lại.
- setDurableName: với thiết lập setDeliverAllAvailable, listener sẽ nhận được tất cả các message từng được push vào channel mà nó subcribe, điều này trong thực tế dẫn đến lượng tin nhắn mà listener sẽ nhận được rất lớn gây ảnh hưởng tới hiệu năng và có thể phát sinh trùng lặp dữ liệu => sử dụng option setDurableName sẽ tạo ra một DurableSubcription trong channel mà client(Stan) lắng nghe, mỗi khi có một message được push vào channel => Stan nhận được => service xử lý xong thì sẽ đánh dấu message này đã được xử lý xong trong DurableSucription => Nếu listener xử lý message thất bại thì sẽ đánh dấu xử lý thất bại trong DurableSubcription => Trong trường hợp Stan bị lỗi, khởi động lại, deploy thì Stan sẽ chỉ nhận được những message xử lý lỗi trong DurableSubcription
=> Nên sử dụng option setDurableName với bất kì listener nào.
<!-- Một số vấn đề phát sinh khi scale, nhân bản các service  -->

- Một service được nhân bản để phục vụ quá trình scale, mô phỏng một tính năng của ngân hàng đó là gửi và rút tiền

* service account chịu trách nhiệm tăng giảm số tiền của user, kiểm tra tra số tiền của mỗi user (account table)
* service transaction chịu trách nhiệm tạo ra các yêu cầu nạp, rút tiền của user (account transaction)
* publisher có nhiệm vụ tạo action (tăng,giảm)
* Nats-streaming, quản lý các channel, publisher, listenner, điều phối các message

- => Luồng cơ bản một user có các action theo thứ tự
  1: gửi 50$ (action1)
  2: gửi 60$ (action2)
  3: rút 100$ (action3)

* Nếu luồng này hoạt động đúng thứ tự thì không có gì để nói, nhưng trong thực tế sẽ có rất nhiều trường hợp luồng này không thể chạy đúng thứ tự.
  => Giả sử nhân bản 2 service account để phục vụ quá trình scale gọi là account1 và account2

  <!-- Một số rất nhiều trường hợp có thể xảy ra lỗi -->

- Trường hợp 1
  Nếu account1 nhận được action1 nhưng trong trường hợp có lỗi xảy ra ở account1 (có thể db bị lỗi connect)
  => Theo mặc định Nats sẽ đợi sau 30s nếu account1 không gọi ack() thì nó sẽ gửi lại action1, nếu như account2 vẫn hoạt động bình thường và action2 và action3 lần lượt được publish thì rõ ràng quá trình này sẽ phát sinh lỗi do số dư tài khoản của user tại thời điểm gửi yêu cầu rút này không đủ.

- Trường hợp 2
  Giả sử không có lỗi nào xảy ra action1 và action2 đều được handle nhưng ở action3 db xử lý bị trễ, giả sử quá trình ghi vào db mất 29.99999s, ghi vào db xong (đã trừ 100$) chưa kịp gọi hàm ack báo thành công thì đã sang giây thứ 30, lúc này theo mặc định Nats-streaming-server sẽ gửi lại message cho service account để xử lý => lệnh bị fail do không đủ số tiền.


<!-- => Cách giải quyết:  -->

+ Giả sử: với mỗi yêu cầu withdraw, deposit ta lưu vào bảng Transaction, với mỗi bản ghi của từng user chúng ta sẽ tạo thêm một field mới đó là number, nó thể hiện thứ tự trước sau của bản ghi được tạo, với mỗi lần một sự kiện nạp, rút tiền phát ra thì sẽ kèm theo thông tin của transaction đó (bao gồm number - thứ tự của transaction).
+ Ở table account, có một trường đó là lastTransactionNumber thể hiện number transaction gần nhất mà service xử lý. 
=> Khi có một transaction cần xử lý ở service account nó sẽ gần check thứ tự (so sánh number và lastTransactionNumber) =>  Nếu có bất kì sự cố nào khi xử lý các transaction gây ảnh hưởng đến thứ tự service account xử lý transaction điều này sẽ handle lỗi đó, nếu không đúng thứ tự đơn giản chúng ta chỉ cần reject event đó để Nats phân phối lại chúng.
