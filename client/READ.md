<!-- Next.js problem với k8s --> 
Video 214 : Giải thích một luồng gửi vào nhận request của next.js khi tích hợp vào k8s, vấn đề xảy ra khi sử dụng getInitialProps trong Next.js khi triển khai trên k8s


- getInitialProps được thực thi trên server nhưng có một số trường hợp đặc biệt cần lưu ý.
getInitialProps được gọi trên server khi nào ? 
+ Khi bấm F5
+ Khi chúng ta click để redirect
+ Khi nhập URL vào address bar
getInitialProps được gọi trên client khi nào ?
+ Khi chúng ta điều hướng từ trang này sang trang khác trong web app

Video 216 : Giải thích cách giao tiếp giữa các pod khác namespace
Một số issue của vấn đề này ở video 219,220