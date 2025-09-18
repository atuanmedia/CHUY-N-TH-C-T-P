const Ticket = require("../models/Ticket");

exports.createTicket = async (req, res) => {
  const ticket = new Ticket(req.body);
  await ticket.save();
  res.status(201).json(ticket);
};

exports.getTickets = async (req, res) => {
  const tickets = await Ticket.find().populate("apartment").populate("assignee");
  res.json(tickets);
};

exports.getTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate("apartment").populate("assignee");
  if (!ticket) return res.status(404).json({ message: "Not found" });
  res.json(ticket);
};

exports.updateTicket = async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ticket);
};

exports.deleteTicket = async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
