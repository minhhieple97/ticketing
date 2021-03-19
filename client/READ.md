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


AppComponent ở _app.js sẽ chịu trách nhiệm render cho tất cả cách page mà chúng ta tạo ra. 

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Headers currentUser={currentUser}></Headers>
      <Component {...pageProps}></Component>
    </div>
  );
};

 AppComponent sẽ nhận Component là một prop, giống như một hàm nhận một hàm khác là làm tham số đầu vào.
 - Khi chúng tạo ra AppComponent ở file _app.js thì next.js sẽ render và gọi hàm getInitialProps ở AppComponent trước sau đó mới đến lượt trang đích vào gọi hàm getInitialProps ở trang đích đó, nếu chúng ta không triển khai AppComponent thì sẽ render ra thẳng trang đích và gọi hàm getInitialProps ở trang đích luôn.