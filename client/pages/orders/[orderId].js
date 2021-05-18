import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
const OrderShow = ({ order, currentUser }) => {
  // const [timeLeft, setTimeLeft] = useState(new Date(order.expiresAt) - new Date())
  // useEffect(() => {
  //     const timeLeft = msLeft - 1;
  //     setMsLeft(timeLeft);
  // }, [])
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      Router.push("/orders");
    },
  });
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timeId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div>
      Time left to pay: {timeLeft} seconds 
      <br />
      <StripeCheckout
        token={(token) => doRequest({ token })}
        stripeKey="pk_test_51HvGXbK1Wneh2vLA9lbRwjrLK7u6awJHYZjEWwFdrjQu1GSLezMKgIW57AD95dnBThSTtKmSRdVUOhPsluL65NuO00FWpPGuFk"
        amount={order.ticket.price}
        email={currentUser.email}
      ></StripeCheckout>
      
      {errors}
    </div>
  );
};
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};
export default OrderShow;
