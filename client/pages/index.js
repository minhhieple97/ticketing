const LandingPage = ({ color }) => {
  console.log("I am in the component", color)
  return <h2>Landing page</h2>;
};
LandingPage.getInitialProps = () => {
  console.log('I am on the server!');
  return { color: 'red' }
}
export default LandingPage