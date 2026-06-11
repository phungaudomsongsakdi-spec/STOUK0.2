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
                  <th>📦เซฟตี้สต๊อก</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody id="stockTbody"></tbody>
            </table>
          </div>
          <div class="footer-note">
            <i class="fas fa-edit"></i> คลิกดินสอเพื่อปรับจำนวนสต็อก (รับเข้า) | 
            <i class="fas fa-bell"></i> คลิกตัวเลขรีไทม์เพื่อตั้งค่าจุดสั่งซื้อ
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
      let reorderPoint = (p.reorderPoint !== undefined && p.reorderPoint !== null) ? p.reorderPoint : 10;
      let needReorder = p.quantity <= reorderPoint;
      
      // สถานะเหลือแค่ 2 แบบ
      let statusHtml = '';
      if(needReorder && p.quantity > 0) {
        statusHtml = '<span class="badge-low" style="background:#fee2e2; color:#dc2626;">⚠️ ควรสั่งซื้อ</span>';
      } else {
        statusHtml = '<span style="color:#10b981;">✅ ปกติ</span>';
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
            ${needReorder ? '⚠️' : '🔔'} ${reorderPoint}
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
    
    // แก้ไข Reorder Point
    document.querySelectorAll(".reorder-value").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        let code = el.getAttribute("data-code");
        let product = AppStorage.products.find(p => p.itemcode === code);
        let currentValue = product.reorderPoint !== undefined ? product.reorderPoint : 10;
        let newValue = prompt("ตั้งค่ารีไทม์สั่งซื้อ (จำนวนขั้นต่ำที่แจ้งเตือน):", currentValue);
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
    let reorderCount = products.filter(p => p.quantity <= (p.reorderPoint || 10)).length;
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