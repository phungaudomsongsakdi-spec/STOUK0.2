const ReportComponent = {
  render() {
    return `
      <div class="card">
        <div class="card-header">
          <h2><i class="fas fa-chart-line"></i> รายงานสินค้า</h2>
        </div>
        <div class="card-body">
          <!-- ส่วนเลือกสินค้า -->
          <div style="background:#f8fafc; border-radius: 24px; padding: 20px; margin-bottom: 24px;">
            <div class="form-row">
              <div class="form-group" style="flex: 2; position: relative;">
                <label>🔍 เลือกสินค้า (พิมพ์ค้นหา)</label>
                <input type="text" id="reportProductInput" placeholder="พิมพ์ Itemcode หรือ ชื่อสินค้า..." 
                       style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;"
                       autocomplete="off">
                <div id="reportDropdownList" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #cbd5e1; border-radius:16px; max-height:250px; overflow-y:auto; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1); margin-top:5px;">
                </div>
              </div>
              <div class="form-group"><label>ตั้งแต่</label><input type="date" id="reportDateFrom"></div>
              <div class="form-group"><label>ถึง</label><input type="date" id="reportDateTo"></div>
              <div class="form-group"><button id="searchReportBtn" class="btn btn-primary"><i class="fas fa-search"></i> ค้นหา</button></div>
            </div>
            <div id="selectedReportProductDisplay" style="margin-top: 12px; font-size:0.85rem; color:#1e4a6e; background:#eef2ff; padding:8px 16px; border-radius:20px; display:none;">
              <i class="fas fa-check-circle"></i> สินค้าที่เลือก: <span id="selectedReportProductName"></span>
            </div>
          </div>

          <!-- ส่วนรายละเอียดสินค้าที่เลือก -->
          <div id="productDetailSection" style="display:none;">
            <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 24px;">
              <div style="flex:1; background:#e0f2fe; border-radius: 20px; padding: 15px; text-align:center;">
                <div style="font-size: 2rem; font-weight: 800; color:#0284c7;" id="summaryReceiveQty">0</div>
                <div style="color:#0284c7;">📦 รับเข้า</div>
              </div>
              <div style="flex:1; background:#fef2f2; border-radius: 20px; padding: 15px; text-align:center;">
                <div style="font-size: 2rem; font-weight: 800; color:#dc2626;" id="summaryMovementQty">0</div>
                <div style="color:#dc2626;">📤 เบิก/แจก/ขาย</div>
              </div>
              <div style="flex:1; background:#fef2f2; border-radius: 20px; padding: 15px; text-align:center;">
                <div style="font-size: 2rem; font-weight: 800; color:#f59e0b;" id="summaryReturnQty">0</div>
                <div style="color:#f59e0b;">🔄 คืน/เปลี่ยน</div>
              </div>
              <div style="flex:1; background:#eef2ff; border-radius: 20px; padding: 15px; text-align:center;">
                <div style="font-size: 2rem; font-weight: 800; color:#1e4a6e;" id="summaryNetQty">0</div>
                <div style="color:#1e4a6e;">คงเหลือสุทธิ</div>
              </div>
            </div>

            <div style="margin-bottom: 24px;">
              <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                <button class="report-tab-btn active" data-type="all">📋 ทั้งหมด</button>
                <button class="report-tab-btn" data-type="receive">🚚 รับเข้า</button>
                <button class="report-tab-btn" data-type="movement">📤 เบิก/แจก/ขาย</button>
                <button class="report-tab-btn" data-type="return">🔄 คืน/เปลี่ยน</button>
              </div>
            </div>

            <div class="table-wrapper">
              <table style="min-width:1000px; border-collapse: collapse; width:100%;">
                <thead>
                  <tr style="border: 1px solid #ddd;">
                    <th style="width:10%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">วันที่</th>
                    <th style="width:12%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">ประเภท</th>
                    <th style="width:15%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">รายการ</th>
                    <th style="width:6%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">จำนวน</th>
                    <th style="width:10%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">ผู้ทำรายการ</th>
                    <th style="width:8%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">แผนก</th>
                    <th style="width:20%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">หมายเหตุ</th>
                    <th style="width:12%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">บันทึกเมื่อ</th>
                  </tr>
                </thead>
                <tbody id="reportHistoryTbody"></tbody>
              </table>
            </div>

            <div style="margin-top:20px; display: flex; justify-content: flex-end;">
              <button id="exportReportExcelBtn" class="btn btn-sm" style="background:#10b981; color:white;">
                <i class="fas fa-file-excel"></i> ส่งออก Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ส่วน Decision Helper -->
      <div class="card" style="margin-top: 20px;">
        <div class="card-header">
          <h2><i class="fas fa-robot"></i> Decision Helper | ช่วยตัดสินใจสั่งซื้อ</h2>
          <div class="filter-bar">
            <input type="date" id="decisionDateFrom" placeholder="ตั้งแต่">
            <input type="date" id="decisionDateTo" placeholder="ถึง">
            <button id="searchDecisionBtn" class="btn btn-primary btn-sm"><i class="fas fa-chart-line"></i> วิเคราะห์</button>
          </div>
        </div>
        <div class="card-body">
          <div id="summarySection" style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 25px;"></div>
          <div style="background:#f0fdf4; border-radius: 20px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #10b981;">
            <h3 style="color:#10b981; margin-bottom: 15px;"><i class="fas fa-shopping-cart"></i> 📈 แนะนำสั่งซื้อ (ขายดี + คงเหลือน้อย)</h3>
            <div id="topMoversList" style="max-height: 300px; overflow-y: auto;"></div>
          </div>
          <div style="background:#fef2f2; border-radius: 20px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
            <h3 style="color:#f59e0b; margin-bottom: 15px;"><i class="fas fa-ban"></i> 📉 แนะนำลดสั่ง / งดสั่ง (เบิกน้อย + คืนบ่อย)</h3>
            <div id="slowMoversList" style="max-height: 300px; overflow-y: auto;"></div>
          </div>
          <div style="background:#fef2f2; border-radius: 20px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #dc2626;">
            <h3 style="color:#dc2626; margin-bottom: 15px;"><i class="fas fa-exclamation-triangle"></i> ⚠️ สินค้าที่มีปัญหาคืนสูง (ควรตรวจสอบคุณภาพ)</h3>
            <div id="highReturnList" style="max-height: 300px; overflow-y: auto;"></div>
          </div>
          <div style="background:#f8fafc; border-radius: 20px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #6c86a3;">
            <h3 style="color:#6c86a3; margin-bottom: 15px;"><i class="fas fa-skull-crossbones"></i> 💀 Dead Stock (รับเข้ามาแล้วไม่ถูกเบิก)</h3>
            <div id="deadStockList" style="max-height: 300px; overflow-y: auto;"></div>
          </div>
        </div>
      </div>
    `;
  },

  selectedProduct: null,
  currentTabType: "all",

  formatDateToThai(dateStr) {
    if(!dateStr) return "-";
    let parts = dateStr.split('-');
    if(parts.length === 3) {
      let day = parts[2].padStart(2, '0');
      let month = parts[1].padStart(2, '0');
      let year = parseInt(parts[0]) + 543;
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  },

  formatTimestamp(timestamp) {
    if(!timestamp) return "-";
    let parts = timestamp.split(' ');
    if(parts.length >= 2) {
      let dateParts = parts[0].split('/');
      if(dateParts.length === 3) {
        let day = dateParts[0].padStart(2, '0');
        let month = dateParts[1].padStart(2, '0');
        let year = dateParts[2];
        return `${day}/${month}/${year} ${parts[1]}`;
      }
    }
    return timestamp;
  },

  updateReportDropdownList(searchText = "") {
    const products = AppStorage.products;
    let dropdown = document.getElementById("reportDropdownList");
    if(!dropdown) return;
    
    if(searchText.trim() === "") {
      dropdown.style.display = "none";
      return;
    }
    
    let filtered = products.filter(p => 
      p.itemcode.toLowerCase().includes(searchText.toLowerCase()) || 
      p.description.toLowerCase().includes(searchText.toLowerCase())
    );
    
    if(filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding: 12px; text-align:center; color:#999;">ไม่พบสินค้า</div>';
      dropdown.style.display = "block";
      return;
    }
    
    let html = "";
    filtered.slice(0, 15).forEach(p => {
      html += `
        <div class="report-dropdown-item" data-code="${p.itemcode}" data-name="${p.description}" style="padding: 10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;">
          <div><strong>${p.itemcode}</strong><br><span style="font-size:0.7rem;">${p.description.substring(0, 40)}</span></div>
          <div><span style="font-weight:600;">${p.quantity}</span> ชิ้น</div>
        </div>
      `;
    });
    
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    
    let self = this;
    document.querySelectorAll(".report-dropdown-item").forEach(item => {
      item.addEventListener("click", function() {
        let code = this.getAttribute("data-code");
        let name = this.getAttribute("data-name");
        
        self.selectedProduct = { itemcode: code, description: name };
        
        let input = document.getElementById("reportProductInput");
        if(input) {
          input.value = `${code} - ${name}`;
        }
        
        let displayDiv = document.getElementById("selectedReportProductDisplay");
        let selectedNameSpan = document.getElementById("selectedReportProductName");
        if(displayDiv && selectedNameSpan) {
          selectedNameSpan.innerHTML = `${code} - ${name}`;
          displayDiv.style.display = "block";
        }
        
        dropdown.style.display = "none";
        self.searchReport();
      });
    });
  },

  searchReport() {
    if(!this.selectedProduct) {
      alert("กรุณาเลือกสินค้า");
      return;
    }
    
    document.getElementById("productDetailSection").style.display = "block";
    
    let fromDate = document.getElementById("reportDateFrom").value;
    let toDate = document.getElementById("reportDateTo").value;
    
    if(!fromDate) {
      let d = new Date();
      d.setDate(1);
      fromDate = d.toISOString().slice(0,10);
    }
    if(!toDate) {
      toDate = Helpers.formatDate();
    }
    
    let allMovements = AppStorage.movements.filter(m => m.itemcode === this.selectedProduct.itemcode);
    let allReturns = AppStorage.returns.filter(r => r.oldItemcode === this.selectedProduct.itemcode);
    let allReceives = (AppStorage.receives || []).filter(r => r.itemcode === this.selectedProduct.itemcode);
    
    let movements = allMovements.filter(m => m.date >= fromDate && m.date <= toDate);
    let returns = allReturns.filter(r => r.date >= fromDate && r.date <= toDate);
    let receives = allReceives.filter(r => r.date >= fromDate && r.date <= toDate);
    
    let allTransactions = [];
    
    receives.forEach(r => {
      allTransactions.push({
        date: r.date,
        type: "receive",
        typeLabel: "🚚 รับเข้า",
        detail: `รับเข้า ${r.quantity} ชิ้น`,
        quantity: r.quantity,
        person: r.receiver || "-",
        department: r.department || "-",
        note: r.note || "-",
        timestamp: r.timestamp
      });
    });
    
    movements.forEach(m => {
      let typeLabels = {
        anniversary: "🎉 ชุดครบปี",
        probation: "📋 ชุดผ่านทดลองงาน",
        general: "👥 เบิกจ่ายทั่วไป",
        newhire: "🆕 พนักงานใหม่"
      };
      allTransactions.push({
        date: m.date,
        type: "movement",
        typeLabel: `📤 ${typeLabels[m.type] || m.type}`,
        detail: `เบิก/แจก ${m.quantity} ชิ้น`,
        quantity: -m.quantity,
        person: m.issuer || "-",
        department: m.department || "-",
        note: m.note || "-",
        timestamp: m.timestamp
      });
    });
    
    returns.forEach(r => {
      let typeText = r.type === "return" ? "↩️ คืนสินค้า" : "🔄 เปลี่ยนสินค้า";
      allTransactions.push({
        date: r.date,
        type: "return",
        typeLabel: typeText,
        detail: `${typeText === "↩️ คืนสินค้า" ? "คืน" : "คืนของเก่า"} ${r.oldQty} ชิ้น`,
        quantity: r.oldQty,
        person: r.type === "return" ? (r.returner || "-") : (r.changer || "-"),
        department: r.department || "-",
        note: r.note || "-",
        timestamp: r.timestamp
      });
      
      if(r.type === "exchange" && r.newItemcode === this.selectedProduct.itemcode) {
        allTransactions.push({
          date: r.date,
          type: "movement",
          typeLabel: `📤 เบิก (เปลี่ยน)`,
          detail: `เบิกสินค้าใหม่ ${r.newQty} ชิ้น`,
          quantity: -r.newQty,
          person: r.changer || "-",
          department: r.department || "-",
          note: r.note || "-",
          timestamp: r.timestamp
        });
      }
    });
    
    allTransactions.sort((a, b) => b.date.localeCompare(a.date));
    
    let receiveTotal = receives.reduce((sum, r) => sum + r.quantity, 0);
    let movementTotal = movements.reduce((sum, m) => sum + m.quantity, 0);
    let returnTotal = returns.reduce((sum, r) => sum + r.oldQty, 0);
    
    let movementsBefore = allMovements.filter(m => m.date < fromDate);
    let returnsBefore = allReturns.filter(r => r.date < fromDate);
    let receivesBefore = allReceives.filter(r => r.date < fromDate);
    
    let stockBefore = 0;
    receivesBefore.forEach(r => stockBefore += r.quantity);
    movementsBefore.forEach(m => stockBefore -= m.quantity);
    returnsBefore.forEach(r => stockBefore += r.oldQty);
    
    let netChange = receiveTotal - movementTotal + returnTotal;
    let currentStock = stockBefore + netChange;
    
    document.getElementById("summaryReceiveQty").innerText = receiveTotal;
    document.getElementById("summaryMovementQty").innerText = movementTotal;
    document.getElementById("summaryReturnQty").innerText = returnTotal;
    document.getElementById("summaryNetQty").innerText = currentStock;
    
    this.renderReportHistory(allTransactions);
  },

  renderReportHistory(transactions) {
    let filtered = [...transactions];
    
    if(this.currentTabType !== "all") {
      filtered = filtered.filter(t => t.type === this.currentTabType);
    }
    
    let tbody = document.getElementById("reportHistoryTbody");
    if(!tbody) return;
    if(filtered.length === 0) {
      tbody.innerHTML = "<tr><td colspan='8' style='text-align:center; padding:40px;'>ไม่มีรายการ</td</tr>";
      return;
    }
    
    let html = "";
    filtered.forEach(t => {
      let formattedDate = this.formatDateToThai(t.date);
      let formattedTimestamp = this.formatTimestamp(t.timestamp);
      let qtyDisplay = t.quantity > 0 ? `+${t.quantity}` : t.quantity;
      let qtyColor = t.quantity > 0 ? "#10b981" : (t.quantity < 0 ? "#dc2626" : "#f59e0b");
      
      html += `
        <tr style="border: 1px solid #ddd;">
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${formattedDate}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${t.typeLabel}</td>
          <td style="text-align:left; border:1px solid #ddd; padding:8px; white-space: normal;">${t.detail}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap; color:${qtyColor}; font-weight:600;">${qtyDisplay}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${t.person}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${t.department}</td>
          <td style="text-align:left; border:1px solid #ddd; padding:8px; white-space: normal;">${t.note}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${formattedTimestamp}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  },

  analyzeDecision(fromDate = "", toDate = "") {
    let products = AppStorage.products;
    let movements = [...AppStorage.movements];
    let returns = [...AppStorage.returns];
    let receives = AppStorage.receives || [];
    
    if(fromDate) {
      movements = movements.filter(m => m.date >= fromDate);
      returns = returns.filter(r => r.date >= fromDate);
      receives = receives.filter(r => r.date >= fromDate);
    }
    if(toDate) {
      movements = movements.filter(m => m.date <= toDate);
      returns = returns.filter(r => r.date <= toDate);
      receives = receives.filter(r => r.date <= toDate);
    }
    
    let productStats = [];
    let totalMovement = 0;
    let totalReturn = 0;
    let totalReceive = 0;
    
    products.forEach(product => {
      let movementTotal = movements.filter(m => m.itemcode === product.itemcode).reduce((sum, m) => sum + m.quantity, 0);
      let returnTotal = returns.filter(r => r.oldItemcode === product.itemcode).reduce((sum, r) => sum + r.oldQty, 0);
      let receiveTotal = receives.filter(r => r.itemcode === product.itemcode).reduce((sum, r) => sum + r.quantity, 0);
      let exchangeCount = returns.filter(r => r.oldItemcode === product.itemcode && r.type === "exchange").length;
      let returnCount = returns.filter(r => r.oldItemcode === product.itemcode && r.type === "return").length;
      
      let netMovement = movementTotal - returnTotal;
      
      totalMovement += movementTotal;
      totalReturn += returnTotal;
      totalReceive += receiveTotal;
      
      let reorderPoint = product.reorderPoint || 10;
      
      productStats.push({
        itemcode: product.itemcode,
        description: product.description,
        currentStock: product.quantity,
        reorderPoint: reorderPoint,
        netMovement: netMovement,
        returnTotal: returnTotal,
        receiveTotal: receiveTotal,
        exchangeCount: exchangeCount,
        returnCount: returnCount
      });
    });
    
    let topMovers = [...productStats].filter(p => p.netMovement > 0).sort((a, b) => b.netMovement - a.netMovement).slice(0, 10);
    let slowMovers = [...productStats].filter(p => p.netMovement > 0 && p.netMovement < 10).sort((a, b) => a.netMovement - b.netMovement).slice(0, 10);
    let highReturnProducts = productStats.filter(p => 
      (p.returnTotal > 0 && (p.returnTotal / (p.netMovement + p.returnTotal || 1)) > 0.2) || p.returnCount > 3 || p.exchangeCount > 3
    ).sort((a, b) => b.returnTotal - a.returnTotal).slice(0, 10);
    let deadStock = productStats.filter(p => 
      p.receiveTotal > 0 && p.netMovement === 0 && p.currentStock > 0
    ).slice(0, 10);
    let recommendToOrder = topMovers.filter(p => p.currentStock <= p.reorderPoint * 1.5).slice(0, 10);
    
    let endPeriodStock = products.reduce((sum, p) => sum + p.quantity, 0);
    
    this.renderSummary(totalReceive, totalMovement, totalReturn, endPeriodStock);
    this.renderRecommendToOrder(recommendToOrder);
    this.renderSlowMovers(slowMovers);
    this.renderHighReturn(highReturnProducts);
    this.renderDeadStock(deadStock);
  },
  
  renderSummary(totalReceive, totalMovement, totalReturn, endStock) {
    let section = document.getElementById("summarySection");
    if(!section) return;
    
    section.innerHTML = `
      <div style="flex:1; background:#e0f2fe; border-radius: 16px; padding: 12px; text-align:center;">
        <div style="font-size: 1.5rem; font-weight: bold; color:#0284c7;">${totalReceive}</div>
        <div style="font-size: 0.75rem;">📦 รับเข้าใหม่</div>
      </div>
      <div style="flex:1; background:#fef2f2; border-radius: 16px; padding: 12px; text-align:center;">
        <div style="font-size: 1.5rem; font-weight: bold; color:#dc2626;">${totalMovement}</div>
        <div style="font-size: 0.75rem;">📤 เบิก/แจก/ขาย</div>
      </div>
      <div style="flex:1; background:#fef2f2; border-radius: 16px; padding: 12px; text-align:center;">
        <div style="font-size: 1.5rem; font-weight: bold; color:#f59e0b;">${totalReturn}</div>
        <div style="font-size: 0.75rem;">🔄 คืน/เปลี่ยน</div>
      </div>
      <div style="flex:1; background:#eef2ff; border-radius: 16px; padding: 12px; text-align:center;">
        <div style="font-size: 1.5rem; font-weight: bold; color:#1e4a6e;">${endStock}</div>
        <div style="font-size: 0.75rem;">📊 คงเหลือปลายงวด</div>
      </div>
    `;
  },
  
  renderRecommendToOrder(products) {
    let container = document.getElementById("topMoversList");
    if(!container) return;
    
    if(products.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:#999;">ไม่มีสินค้าแนะนำให้สั่งซื้อ</div>';
      return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
    products.forEach((p, idx) => {
      let urgency = p.currentStock <= p.reorderPoint ? "ด่วน!" : "ควรพิจารณา";
      let urgencyColor = p.currentStock <= p.reorderPoint ? "#dc2626" : "#f59e0b";
      html += `
        <div style="background:white; border-radius: 12px; padding: 12px; border:1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div style="flex:2;">
              <div><strong>${p.itemcode}</strong> - ${p.description.substring(0, 50)}</div>
              <div style="font-size: 0.7rem; color:#666;">เบิกสุทธิ ${p.netMovement} ชิ้น | คงเหลือ ${p.currentStock} ชิ้น | รีไทม์ ${p.reorderPoint}</div>
            </div>
            <div style="text-align: right;">
              <span style="background:${urgencyColor}20; color:${urgencyColor}; padding:4px 12px; border-radius:20px; font-size:0.7rem;">${urgency}</span>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  },
  
  renderSlowMovers(products) {
    let container = document.getElementById("slowMoversList");
    if(!container) return;
    
    if(products.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:#999;">ไม่มีสินค้าในกลุ่ม Slow Movers</div>';
      return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
    products.forEach(p => {
      html += `
        <div style="background:white; border-radius: 12px; padding: 12px; border:1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div style="flex:2;">
              <div><strong>${p.itemcode}</strong> - ${p.description.substring(0, 50)}</div>
              <div style="font-size: 0.7rem; color:#666;">เบิกสุทธิ ${p.netMovement} ชิ้น | คงเหลือ ${p.currentStock} ชิ้น</div>
            </div>
            <div style="text-align: right;">
              <span style="background:#f59e0b20; color:#f59e0b; padding:4px 12px; border-radius:20px; font-size:0.7rem;">เบิกน้อย</span>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  },
  
  renderHighReturn(products) {
    let container = document.getElementById("highReturnList");
    if(!container) return;
    
    if(products.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:#999;">ไม่มีสินค้าที่มีปัญหาคืนสูง</div>';
      return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
    products.forEach(p => {
      let issue = p.exchangeCount > 0 ? `เปลี่ยน ${p.exchangeCount} ครั้ง` : `คืน ${p.returnCount} ครั้ง`;
      html += `
        <div style="background:white; border-radius: 12px; padding: 12px; border:1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div style="flex:2;">
              <div><strong>${p.itemcode}</strong> - ${p.description.substring(0, 50)}</div>
              <div style="font-size: 0.7rem; color:#666;">คืน ${p.returnTotal} ชิ้น | ${issue}</div>
            </div>
            <div style="text-align: right;">
              <span style="background:#dc262620; color:#dc2626; padding:4px 12px; border-radius:20px; font-size:0.7rem;">⚠️ ควรตรวจสอบ</span>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  },
  
  renderDeadStock(products) {
    let container = document.getElementById("deadStockList");
    if(!container) return;
    
    if(products.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:#999;">ไม่มีสินค้า Dead Stock</div>';
      return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
    products.forEach(p => {
      html += `
        <div style="background:white; border-radius: 12px; padding: 12px; border:1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div style="flex:2;">
              <div><strong>${p.itemcode}</strong> - ${p.description.substring(0, 50)}</div>
              <div style="font-size: 0.7rem; color:#666;">รับเข้า ${p.receiveTotal} ชิ้น แต่ไม่ถูกเบิก | คงเหลือ ${p.currentStock} ชิ้น</div>
            </div>
            <div style="text-align: right;">
              <span style="background:#6c86a320; color:#6c86a3; padding:4px 12px; border-radius:20px; font-size:0.7rem;">💀 ไม่ขยับ</span>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  },

  // ✅ exportToExcel ที่แก้ไขแล้ว (ไม่มีตัวเลขซ้ำซ้อน)
  exportToExcel() {
    if(!this.selectedProduct) {
      alert("กรุณาเลือกสินค้า");
      return;
    }
    
    let fromDate = document.getElementById("reportDateFrom").value;
    let toDate = document.getElementById("reportDateTo").value;
    
    if(!fromDate) {
      let d = new Date();
      d.setDate(1);
      fromDate = d.toISOString().slice(0,10);
    }
    if(!toDate) {
      toDate = Helpers.formatDate();
    }
    
    let allMovements = AppStorage.movements.filter(m => m.itemcode === this.selectedProduct.itemcode);
    let allReturns = AppStorage.returns.filter(r => r.oldItemcode === this.selectedProduct.itemcode);
    let allReceives = (AppStorage.receives || []).filter(r => r.itemcode === this.selectedProduct.itemcode);
    
    let movements = allMovements.filter(m => m.date >= fromDate && m.date <= toDate);
    let returns = allReturns.filter(r => r.date >= fromDate && r.date <= toDate);
    let receives = allReceives.filter(r => r.date >= fromDate && r.date <= toDate);
    
    let allTransactions = [];
    
    receives.forEach(r => {
      allTransactions.push({
        date: this.formatDateToThai(r.date),
        type: "🚚 รับเข้า",
        detail: `รับเข้า ${r.quantity} ชิ้น`,
        quantity: r.quantity,
        person: r.receiver || "-",
        department: r.department || "-",
        note: r.note || "-",
        timestamp: this.formatTimestamp(r.timestamp)
      });
    });
    
    movements.forEach(m => {
      let typeLabels = {
        anniversary: "ชุดครบปี",
        probation: "ชุดผ่านทดลองงาน",
        general: "เบิกจ่ายทั่วไป",
        newhire: "พนักงานใหม่"
      };
      allTransactions.push({
        date: this.formatDateToThai(m.date),
        type: "📤 เบิก/แจก/ขาย",
        detail: `เบิก/แจก ${m.quantity} ชิ้น (${typeLabels[m.type] || m.type})`,
        quantity: -m.quantity,
        person: m.issuer || "-",
        department: m.department || "-",
        note: m.note || "-",
        timestamp: this.formatTimestamp(m.timestamp)
      });
    });
    
    returns.forEach(r => {
      let typeText = r.type === "return" ? "↩️ คืนสินค้า" : "🔄 เปลี่ยนสินค้า";
      allTransactions.push({
        date: this.formatDateToThai(r.date),
        type: typeText,
        detail: `${typeText === "↩️ คืนสินค้า" ? "คืน" : "คืนของเก่า"} ${r.oldQty} ชิ้น`,
        quantity: r.oldQty,
        person: r.type === "return" ? (r.returner || "-") : (r.changer || "-"),
        department: r.department || "-",
        note: r.note || "-",
        timestamp: this.formatTimestamp(r.timestamp)
      });
      
      if(r.type === "exchange" && r.newItemcode === this.selectedProduct.itemcode) {
        allTransactions.push({
          date: this.formatDateToThai(r.date),
          type: "📤 เบิก/แจก/ขาย (เปลี่ยน)",
          detail: `เบิกสินค้าใหม่ ${r.newQty} ชิ้น`,
          quantity: -r.newQty,
          person: r.changer || "-",
          department: r.department || "-",
          note: r.note || "-",
          timestamp: this.formatTimestamp(r.timestamp)
        });
      }
    });
    
    allTransactions.sort((a, b) => b.date.localeCompare(a.date));
    
    // ✅ HTML สำหรับ Excel - ไม่มีตัวเลขสรุปซ้ำซ้อน
    let htmlContent = `
      <html>
      <head>
        <meta charset="UTF-8">
        <title>รายงานสินค้า - ${this.selectedProduct.itemcode}</title>
        <style>
          @page { size: A4; margin: 0.5cm; }
          body { 
            font-family: 'Sukhumvit Set', 'Tahoma', 'Angsana New', sans-serif; 
            margin: 20px; 
            padding: 0;
          }
          h2 { 
            color: #1e4a6e; 
            margin-bottom: 5px; 
            font-size: 16px;
          }
          .report-date { 
            margin-bottom: 20px; 
            color: #666; 
            font-size: 11px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            font-size: 11px;
            margin-top: 10px;
          }
          th { 
            background-color: #1e4a6e; 
            color: white; 
            padding: 10px 8px; 
            text-align: center; 
            border: 1px solid #4a6a8a;
            font-weight: bold;
          }
          td { 
            padding: 8px 6px; 
            border: 1px solid #cbd5e1;
            text-align: center;
          }
          td:nth-child(3) {
            text-align: left;
          }
          tr:nth-child(even) { 
            background-color: #f8fafc; 
          }
          .footer { 
            margin-top: 20px; 
            text-align: right; 
            font-size: 10px; 
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <h2>📊 รายงานสินค้า: ${this.selectedProduct.itemcode} - ${this.selectedProduct.description}</h2>
        <div class="report-date">
          สร้างเมื่อ: ${new Date().toLocaleString('th-TH')} | 
          ตั้งแต่: ${this.formatDateToThai(fromDate)} | 
          ถึง: ${this.formatDateToThai(toDate)}
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width:10%">วันที่</th>
              <th style="width:12%">ประเภท</th>
              <th style="width:30%">รายการ</th>
              <th style="width:8%">จำนวน</th>
              <th style="width:12%">ผู้ทำรายการ</th>
              <th style="width:8%">แผนก</th>
              <th style="width:15%">หมายเหตุ</th>
              <th style="width:10%">บันทึกเมื่อ</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    allTransactions.forEach(t => {
      let qtyDisplay = t.quantity > 0 ? `+${t.quantity}` : t.quantity;
      htmlContent += `
        <tr>
          <td style="text-align:center">${t.date}</td>
          <td style="text-align:center">${t.type}</td>
          <td style="text-align:left">${t.detail}</td>
          <td style="text-align:center">${qtyDisplay}</td>
          <td style="text-align:center">${t.person}</td>
          <td style="text-align:center">${t.department}</td>
          <td style="text-align:left">${t.note}</td>
          <td style="text-align:center">${t.timestamp}</td>
        </tr>
      `;
    });
    
    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          สร้างโดยระบบบริหารสต็อกองค์กร | จำนวนรายการ: ${allTransactions.length} รายการ
        </div>
      </body>
      </html>
    `;
    
    let blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
    let link = document.createElement("a");
    let url = URL.createObjectURL(blob);
    link.href = url;
    let now = new Date();
    let fileName = `report_${this.selectedProduct.itemcode}_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.xls`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert("✅ ส่งออก Excel สำเร็จ!");
  }
};