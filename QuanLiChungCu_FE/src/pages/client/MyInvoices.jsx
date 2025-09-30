import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/MyInvoices.css";
import { FaFileInvoiceDollar, FaRegCalendarAlt } from "react-icons/fa";

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get(`/invoices/resident/${user._id}`);
        setInvoices(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvoices();
  }, [user._id]);

  const handlePayment = (invoiceId) => {
    // Logic to handle payment
    console.log(`Processing payment for invoice ${invoiceId}`);
  };

  return (
    <div className="my-invoices">
      <h2><FaFileInvoiceDollar /> Hóa Đơn Của Tôi</h2>
      <div className="invoice-list">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <div key={invoice._id} className="invoice-card">
              <div className="invoice-card-header">
                <span>Hóa đơn #{invoice.invoiceNumber}</span>
                <span className={`status status-${invoice.status.toLowerCase()}`}>
                  {invoice.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
              <div className="invoice-card-body">
                <p>
                  <strong>Số tiền:</strong>
                  <span>{invoice.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </p>
                <p>
                  <strong>Ngày hết hạn:</strong>
                  <span>
                    <FaRegCalendarAlt style={{ marginRight: '8px' }} />
                    {invoice.dueAt ? new Date(invoice.dueAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </p>
              </div>
              {invoice.status.toLowerCase() === 'unpaid' && (
                <div className="invoice-card-footer">
                  <button 
                    className="pay-button" 
                    onClick={() => handlePayment(invoice._id)}
                  >
                    Thanh Toán
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Không tìm thấy hóa đơn nào.</p>
        )}
      </div>
    </div>
  );
}