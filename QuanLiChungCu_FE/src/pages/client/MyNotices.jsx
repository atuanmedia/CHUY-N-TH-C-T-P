import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/MyNotices.css";
import { FaBell, FaRegCalendarAlt } from "react-icons/fa";

export default function MyNotices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/notices");
        setNotices(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="my-notices">
      <h2><FaBell /> Thông Báo Của Tôi</h2>
      <div className="notice-list">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div key={notice._id} className="notice-card">
              <div className="notice-card-header">{notice.title}</div>
              <div className="notice-card-body">
                <p>{notice.content}</p>
              </div>
              <div className="notice-card-footer">
                <span className="notice-date">
                  <FaRegCalendarAlt />
                  {new Date(notice.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>Không tìm thấy thông báo nào.</p>
        )}
      </div>
    </div>
  );
}