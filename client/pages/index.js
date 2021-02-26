import axios from 'axios'
import buildClient from '../api/build-client'
const LandingPage = ({ color }) => {
  console.log("I am in the component", color)
  return <h2>Landing page</h2>;
};
LandingPage.getInitialProps = ({ req }) => {
  if (typeof window === 'undefined') {
    const { data } = await axios.get(
      `http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/curreentuser`,
      {
        headers: req.headers
      })
  }
  else {
    const { data } = await axios.get('/api/users/currentuser')
    return data
  }

}
export default LandingPage