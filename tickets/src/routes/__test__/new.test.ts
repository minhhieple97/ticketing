import request from "supertest";
import app from "../../app";
import Ticket from "../../models/ticket";
import { natsWrapper } from '../../nats-wrapper';


it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status equal 401 if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets")
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 20 });
  expect(response.status).toEqual(201);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app).post('/api/tickets').set('Cookie', global.signin())
    .send({ title: '', price: 10 }).expect(400)
});

it("returns an error if an invalid price is provided", async () => {
  await request(app).post('/api/tickets').set('Cookie', global.signin())
    .send({ title: 'asdf', price: -23 }).expect(400)

  await request(app).post('/api/tickets').set('Cookie', global.signin())
    .send({ title: 'wrqwe' }).expect(400)
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0)
  await request(app).post('/api/tickets').set('Cookie', global.signin())
    .send({ title: 'asdf', price: 10 }).expect(201);
  // tickets = await Ticket.find({});
  // expect(tickets.length).toEqual(1);
  // expect(tickets[0].price).toEqual(10);
  // expect(tickets[0].title).toEqual('asdf');
});

it('publishes an event', async () => {
  const title = 'asldkfj';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});