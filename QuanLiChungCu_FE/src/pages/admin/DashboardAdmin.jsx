import React from "react";

function DashboardAdmin() {
  // Tạm thời dữ liệu cứng — sẽ đổi sang fetch từ API sau
  const stats = [
    { id: 1, label: "Căn hộ", value: 1 },
    { id: 2, label: "Cư dân", value: 1 },
    { id: 3, label: "Dịch vụ", value: 1 },
    { id: 4, label: "Phản ánh", value: 1 },
  ];

  return (
    <div>
      <div className="header">
        <div>
          <h1>Tổng quan</h1>
          <div className="sub muted">Bảng điều khiển quản trị hệ thống</div>
        </div>
      </div>

      <section className="cards" aria-label="summary-cards">
            {stats.map((s) => (
              <div className="card" key={s.id}>
                <div className="card-left">
                  <div className="value">{s.value}</div>
                  <div className="label">{s.label}</div>
                </div>
                <div className="avatar">{s.label.charAt(0)}</div>
              </div>
            ))}
          </section>

      <section className="table-section">
            <h3>Hóa đơn gần đây</h3>
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Căn hộ</th>
                  <th>Khách hàng</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#INV-001</td>
                  <td>A101</td>
                  <td>Nguyễn Văn A</td>
                  <td>1,200,000</td>
                  <td><span className="tag paid">Đã thanh toán</span></td>
                </tr>
              </tbody>
            </table>
          </section>
    </div>
  );
}

export default DashboardAdmin;
