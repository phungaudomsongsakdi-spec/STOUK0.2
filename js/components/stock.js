const StockComponent = {
  render() {
    return `
      <div class="card">
        <div class="card-header">
          <h2><i class="fas fa-boxes"></i> สินค้าทั้งหมด</h2>
          <div class="search-box"><i class="fas fa-search"></i><input type="text" id="stockSearch" placeholder="Itemcode หรือ ชื่อสินค้า..."></div>
        </div>
        <div class="card-body">
          <div class="table-wrapper">
            <table style="min-width:900px">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Itemcode</th>
                  <th>รายละเอียดสินค้า</th>
                  <th>หน่วย</th>
                  <th>ราคา(฿)</th>
                  <th>สต็อก</th>
                  <th>สถานะ</th>
                  <th>เซฟตี้สต๊อก</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody id="stockTbody"></tbody>
            </table>
          </div>
          <div class="footer-note">
            <i class="fas fa-edit"></i> คลิกดินสอเพื่อปรับจำนวนสต็อก (รับเข้า) | 
            <i class="fas fa-bell"></i> คลิกตัวเลขเซฟตี้สต๊อกเพื่อตั้งค่าจุดสั่งซื้อ
          </div>
        </div>
      </div>
    `;
  },
  
  renderStockTable(filter = "") {
    const products = AppStorage.products;
    let filtered = products.filter(p => p.itemcode.includes(filter) || p.description.toLowerCase().includes(filter.toLowerCase()));
    let tbody = document.getElementById("stockTbody");
    if(!tbody) return;
    
    if(filtered.length === 0) {
      tbody.innerHTML = "<tr><td colspan='9'>ไม่มีสินค้า</td></tr>";
      return;
    }
    
    let html = "";
    filtered.forEach((p, idx) => {
      // ✅ ใช้ reorderPoint = 0 ถ้าไม่มีค่า
      let reorderPoint = (p.reorderPoint !== undefined && p.reorderPoint !== null) ? p.reorderPoint : 0;
      // ✅ เตือนเมื่อ reorderPoint > 0 และ quantity <= reorderPoint
      let needReorder = reorderPoint > 0 && p.quantity <= reorderPoint;
      
      // สถานะ
      let statusHtml = '';
      if(needReorder) {
        statusHtml = '<span class="badge-low" style="background:#fee2e2; color:#dc2626;">⚠️ ควรสั่งซื้อ</span>';
      } else {
        statusHtml = '<span style="color:#10b981;">✅ ปกติ</span>';
      }
      
      // ✅ ไอคอนเซฟตี้สต๊อก
      let iconDisplay = '📌';
      if(reorderPoint > 0 && needReorder) {
        iconDisplay = '⚠️';
      } else if(reorderPoint > 0 && !needReorder) {
        iconDisplay = '🔔';
      }
      
      html += `<tr>
        <td style="text-align:left;">${idx+1}</td>
        <td style="font-family: monospace; text-align:left;">${p.itemcode}</td>
        <td style="max-width:250px; overflow-x:auto; text-align:left;">${p.description}</td>
        <td style="text-align:left;">${p.unit}</td>
        <td style="text-align:left;">${p.price.toFixed(2)}</td>
        <td style="font-weight:600; ${needReorder ? 'color:#dc2626;' : ''} text-align:left;">${p.quantity}</td>
        <td style="white-space: nowrap; text-align:left;">${statusHtml}</td>
        <td class="reorder-cell" style="text-align:left;">
          <span class="reorder-value" data-code="${p.itemcode}" style="cursor:pointer; background:${needReorder ? '#fee2e2' : '#f1f5f9'}; padding:6px 14px; border-radius:20px; font-size:0.75rem; font-weight:600; display:inline-block;">
            ${iconDisplay} ${reorderPoint}
          </span>
        </td>
        <td class="action-icons" style="text-align:left;">
          <i class="fas fa-edit edit-stock" data-code="${p.itemcode}" style="cursor:pointer;"></i>
        </td>
      </tr>`;
    });
    tbody.innerHTML = html;
    
    // แก้ไขสต็อก
    document.querySelectorAll(".edit-stock").forEach(btn => {
      btn.addEventListener("click", () => {
        let code = btn.getAttribute("data-code");
        let product = AppStorage.products.find(p => p.itemcode === code);
        let newQty = prompt("ปรับจำนวนสต็อก (รับเข้า/ปรับปรุง):", product.quantity);
        if(newQty !== null && !isNaN(parseInt(newQty)) && parseInt(newQty) >= 0) {
          product.quantity = parseInt(newQty);
          AppStorage.saveData();
          this.renderStockTable(document.getElementById("stockSearch")?.value || "");
          Helpers.updateStats();
          this.updateReorderCount();
        }
      });
    });
    
    // แก้ไข Reorder Point (เซฟตี้สต๊อก)
    document.querySelectorAll(".reorder-value").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        let code = el.getAttribute("data-code");
        let product = AppStorage.products.find(p => p.itemcode === code);
        let currentValue = product.reorderPoint !== undefined ? product.reorderPoint : 0;
        let newValue = prompt("ตั้งค่าเซฟตี้สต๊อก (จำนวนขั้นต่ำที่แจ้งเตือน):", currentValue);
        if(newValue !== null && !isNaN(parseInt(newValue)) && parseInt(newValue) >= 0) {
          product.reorderPoint = parseInt(newValue);
          AppStorage.saveData();
          this.renderStockTable(document.getElementById("stockSearch")?.value || "");
          Helpers.updateStats();
          this.updateReorderCount();
        }
      });
    });
    
    this.updateReorderCount();
  },
  
  updateReorderCount() {
    const products = AppStorage.products;
    // ✅ นับเฉพาะที่ reorderPoint > 0 และ quantity <= reorderPoint
    let reorderCount = products.filter(p => {
      let reorderPoint = (p.reorderPoint !== undefined && p.reorderPoint !== null) ? p.reorderPoint : 0;
      return reorderPoint > 0 && p.quantity <= reorderPoint;
    }).length;
    let lowStockStat = document.getElementById("lowStockStat");
    if(lowStockStat) {
      lowStockStat.innerText = reorderCount;
      let statLabel = lowStockStat.nextElementSibling;
      if(statLabel && statLabel.classList.contains("stat-label")) {
        statLabel.innerText = "⚠️ ควรสั่งซื้อ";
      }
    }
  }
};