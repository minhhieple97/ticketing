const OrderIndex = ({ orders }) => {
  return (
    <ul className="list-group list-group-flush">
      {orders.length > 0 ? (
        orders.map((order) => {
          return (
            <li key={order.id} className="list-group-item">
              {order.ticket.title} - {order.status}
            </li>
          );
        })
      ) : (
        <h2 style={{ textAlign: "center" }}>No order found</h2>
      )}
    </ul>
  );
};
OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};
export default OrderIndex;
