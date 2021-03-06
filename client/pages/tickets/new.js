import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const handleOnBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  });
  const handleOnSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };
  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={handleOnSubmit}>
        <div className="form-group">
          <label for="exampleInputEmail1">Title</label>
          <input
            className="form-control"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={price}
            placeholder="Enter price"
            onBlur={handleOnBlur}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
