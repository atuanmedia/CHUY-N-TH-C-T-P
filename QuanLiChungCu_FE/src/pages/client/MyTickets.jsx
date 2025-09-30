import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/MyTickets.css";
import { FaTicketAlt, FaPlus, FaRegCalendarAlt } from "react-icons/fa";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get(`/tickets/resident/${user._id}`);
        setTickets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, [user._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/tickets", {
        title,
        content,
        resident: user._id,
      });
      setTickets([res.data.ticket, ...tickets]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const translateStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'Mở';
      case 'in-progress':
        return 'Đang xử lý';
      case 'closed':
        return 'Đã đóng';
      default:
        return status;
    }
  };

  return (
    <div className="my-tickets">
      <h2><FaTicketAlt /> Yêu Cầu Của Tôi</h2>

      <div className="create-ticket-form">
        <h3><FaPlus /> Tạo Yêu Cầu Mới</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Nội dung</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn-submit">
            Gửi Yêu Cầu
          </button>
        </form>
      </div>

      <div className="ticket-list">
        <h3>Yêu Cầu Đã Gửi</h3>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <div className="ticket-card-header">{ticket.title}</div>
              <div className="ticket-card-body">
                <p>{ticket.content}</p>
              </div>
              <div className="ticket-card-footer">
                <span className="ticket-date">
                  <FaRegCalendarAlt />
                  {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                </span>
                <span className={`status status-${ticket.status.toLowerCase()}`}>
                  {translateStatus(ticket.status)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>Không tìm thấy yêu cầu nào.</p>
        )}
      </div>
    </div>
  );
}