import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'
const OrderShow = ({ order, currentUser }) => {
    // const [timeLeft, setTimeLeft] = useState(new Date(order.expiresAt) - new Date())
    // useEffect(() => {
    //     const timeLeft = msLeft - 1;
    //     setMsLeft(timeLeft);
    // }, [])
    const [timeLeft, setTimeLeft] = useState(0)
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => {
            Router.push('/orders')
        }
    })
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000))
        }
        findTimeLeft()
        const timeId = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(timeId)
        }
    }, [])
    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }
    return <div>
        Time left to pay: {timeLeft} seconds
         <StripeCheckout
            token={(token) => doRequest({ token })}
            stripeKey='sk_test_51HvGXbK1Wneh2vLAZrE1NFiEjCdflyl9wVeQFkt5ZM2p7GrHnV9IiUi338rqKA9eu39Nxcpr7VLIi9Kth20LORBJ00ClLG8LGe'
            amount={order.ticket.price}
            email={currentUser.email}
        ></StripeCheckout>
        {errors}
    </div>
}
OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data }
}
export { OrderShow }