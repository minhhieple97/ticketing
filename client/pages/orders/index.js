const OrderIndex = ({ orders }) => {
    return (
        <ul class="list-group" >
            {orders.map((order) => {
                let status = null;
                switch (order.status) {
                    case 'created':
                        status = 'badge-primary'
                        break;
                    case 'cancelled':
                        status = 'badge-dark'
                        break;
                    case 'complete':
                        status = 'badge-success'
                        break;

                    case 'awaiting:payment':
                        status = 'badge-warning'
                        break;

                    default:
                        status = 'badge-secondary'
                        break;
                }
                return (
                    <li class="list-group-item d-flex justify-content-between align-items-center" key={order.id}>
                        {order.ticket.title} - <span class={`badge ${status} badge-pill`}>  {order.status}</span>
                    </li>
                );
            })}
        </ul>
    );
};
OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
    return { orders: data };
};
export default OrderIndex;
