import 'bootstrap/dist/css/bootstrap.min.css';
export default ({ Component, pageProps }) => {
    return <Component {...pageProps} ></Component>
}
// Mặc định _app.js dùng để tạo ra custom default component
// Next.js sẽ điều hướng dựa trên các file trong pages folder,  _app.js được tạo ra nhằm mục đích apply css của bootstrap cho tất cả các component, thay vì hiển thị component trong page thẳng ra màn hình luôn App(component _app.js) sẽ bọc component đó (component trong page) => đây là patternt HOC, mỗi component trong page sẽ là đối số (Component) và nhận pageProps làm props.
// => Component này sẽ bọc từng component trong pages