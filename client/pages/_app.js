import "bootstrap/dist/css/bootstrap.min.css";
import buildClient from "../api/build-client";
import Headers from "../components/headers";
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Headers currentUser={currentUser}></Headers>
      <Component {...pageProps}></Component>
    </div>
  );
};
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    //Kiểm tra getInitialProps được gọi ở Page nào thì mới trigger
    pageProps = await appContext.Component.getInitialProps(appContext.ctx); // Đứng từ AppComponent có thể trigger getInitialProps của Page.
  }
  return {
    pageProps,
    ...data,
  };
  return {};
};
export default AppComponent;
// Mặc định _app.js dùng để tạo ra custom default component
// Next.js sẽ điều hướng dựa trên các file trong pages folder,  _app.js được tạo ra nhằm mục đích apply css của bootstrap cho tất cả các component, thay vì hiển thị component trong page thẳng ra màn hình luôn App(component _app.js) sẽ bọc component đó (component trong page) => đây là patternt HOC, mỗi component trong page sẽ là đối số (Component) và nhận pageProps làm props.
// => Component này sẽ bọc từng component trong pages
// Hàm GetInitialProps sẽ nhận đối số đầu vào là "context" nhưng giá trị của context đối với page sẽ khác với CustomApp component.
// - Page : context === {req,res}
// - AppComponent: context === {Component,ctx:{req,res}}

//  Có một lưu ý rằng khi đã gọi getInitialProps ở AppComponent rồi thì hàm getInitialProps ở các page sẽ không được tư động gọi nữa.
//  Để khắc phục vấn đề này chúng ta có thể call getInitalProps của page ở AppComponent và truyền dữ liệu xuống cho Page như props, điều này thực thi được là từ appContext (đối số của getInitialProps)  có thể truy cập được vào Page.
