const MovementComponent = {
  render() {
    return `
      <div class="card">
        <div class="card-header">
          <h2><i class="fas fa-people-arrows"></i> บันทึกการเบิกจ่าย</h2>
        </div>
        <div class="card-body">
          <div style="background:#f8fafc; border-radius: 24px; padding: 20px; margin-bottom: 24px;">
            <div class="form-row">
              <div class="form-group" style="flex: 2; position: relative;">
                <label>🔍 เลือกสินค้า (พิมพ์ค้นหา)</label>
                <input type="text" id="movementProductInput" placeholder="พิมพ์ Itemcode หรือ ชื่อสินค้า..." 
                       style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;"
                       autocomplete="off">
                <div id="movementDropdownList" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #cbd5e1; border-radius:16px; max-height:250px; overflow-y:auto; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1); margin-top:5px;">
                </div>
              </div>
              <div class="form-group"><label>จำนวนจ่าย</label><input type="number" id="movementQty" min="1" value="1"></div>
              <div class="form-group"><label>ประเภท</label><select id="movementType">
                <option value="anniversary">🎉 ชุดครบปี</option>
                <option value="probation">📋 ชุดผ่านทดลองงาน</option>
                <option value="general">👥 เบิกจ่ายพนักงานทั่วไป</option>
                <option value="newhire">🆕 พนักงานใหม่</option>
              </select></div>
              <div class="form-group"><label>วันที่</label><input type="date" id="movementDate"></div>
            </div>
            <div class="form-row" style="margin-top: 12px;">
              <div class="form-group"><label>ผู้จ่าย</label><input type="text" id="movementIssuer" placeholder="ชื่อผู้จ่าย"></div>
              <div class="form-group" style="position: relative;">
                <label>🔍 แผนก (พิมพ์ค้นหา)</label>
                <input type="text" id="movementDeptInput" placeholder="พิมพ์ชื่อแผนก..." 
                       style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;"
                       autocomplete="off">
                <div id="movementDeptDropdownList" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #cbd5e1; border-radius:16px; max-height:200px; overflow-y:auto; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1); margin-top:5px;">
                </div>
              </div>
              <div class="form-group"><label>ส่วนงานที่เบิก</label><input type="text" id="movementNote" placeholder="ส่วนงานที่เบิก"></div>
              <div class="form-group" style="flex: 0.5;"><button id="recordMovementBtn" class="btn btn-primary" style="margin-top: 24px;"><i class="fas fa-check-circle"></i> บันทึก</button></div>
            </div>
            <div id="selectedProductDisplay" style="margin-top: 12px; font-size:0.85rem; color:#1e4a6e; background:#eef2ff; padding:8px 16px; border-radius:20px; display:none;">
              <i class="fas fa-check-circle"></i> เลือก: <span id="selectedProductName"></span>
            </div>
            <div id="selectedDeptDisplay" style="margin-top: 8px; font-size:0.85rem; color:#1e4a6e; background:#eef2ff; padding:8px 16px; border-radius:20px; display:none;">
              <i class="fas fa-building"></i> แผนก: <span id="selectedDeptName"></span>
            </div>
          </div>
          
          <div class="filter-bar">
            <i class="fas fa-filter"></i> <span>กรองประวัติ:</span>
            <input type="text" id="historySearch" placeholder="ค้นหาทั้งหมด...">
            <select id="historyTypeFilter" style="padding: 6px 12px; border-radius: 20px; border: 1px solid #cbd5e1;">
              <option value="">📌 ทุกประเภท</option>
              <option value="anniversary">🎉 ชุดครบปี</option>
              <option value="probation">📋 ชุดผ่านทดลองงาน</option>
              <option value="general">👥 เบิกจ่ายพนักงานทั่วไป</option>
              <option value="newhire">🆕 พนักงานใหม่</option>
            </select>
            <input type="text" id="historyDeptInput" placeholder="🏢 ค้นหาแผนก..." style="padding: 6px 12px; border-radius: 20px; border: 1px solid #cbd5e1; width: 120px;">
            <input type="date" id="historyDateFrom" placeholder="จากวันที่">
            <input type="date" id="historyDateTo" placeholder="ถึงวันที่">
            <button id="resetHistoryBtn" class="btn btn-sm">รีเซ็ต</button>
            <button id="exportHistoryExcelBtn" class="btn btn-sm" style="background:#10b981; color:white;">
              <i class="fas fa-file-excel"></i> ส่งออก Excel
            </button>
          </div>
          
          <div class="table-wrapper">
            <table style="min-width:1100px; border-collapse: collapse; width:100%;">
              <thead>
                <tr style="border: 1px solid #ddd;">
                  <th style="width:8%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">วันที่</th>
                  <th style="width:15%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">ประเภท</th>
                  <th style="width:10%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">Itemcode</th>
                  <th style="width:20%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">สินค้า</th>
                  <th style="width:5%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">จำนวนจ่าย</th>
                  <th style="width:7%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">ราคา/หน่วย</th>
                  <th style="width:7%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">มูลค่า</th>
                  <th style="width:10%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">ผู้จ่าย</th>
                  <th style="width:6%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">แผนก</th>
                  <th style="width:10%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">ส่วนงานที่รับ</th>
                  <th style="width:12%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">บันทึกเมื่อ</th>
                </tr>
              </thead>
              <tbody id="historyTbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  selectedProduct: null,
  selectedDepartment: "",
  departments: ["PA", "SCM", "DC", "AC", "PC", "GA", "HR", "TM", "PS", "RC", "OVEN", "QC", "SS", "RK", "ND"],

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

  updateDeptDropdownList(searchText = "") {
    let dropdown = document.getElementById("movementDeptDropdownList");
    if(!dropdown) return;
    
    if(searchText.trim() === "") {
      dropdown.style.display = "none";
      return;
    }
    
    let filtered = this.departments.filter(dept => 
      dept.toLowerCase().includes(searchText.toLowerCase())
    );
    
    if(filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding: 12px; text-align:center; color:#999;">ไม่พบแผนก</div>';
      dropdown.style.display = "block";
      return;
    }
    
    let html = "";
    filtered.forEach(dept => {
      html += `
        <div class="dept-dropdown-item" data-dept="${dept}" 
             style="padding: 10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;">
          <div><strong>🏢 ${dept}</strong></div>
          <div style="color:#1e4a6e;">เลือก ➔</div>
        </div>
      `;
    });
    
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    
    document.querySelectorAll(".dept-dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        let dept = item.getAttribute("data-dept");
        this.selectedDepartment = dept;
        
        let input = document.getElementById("movementDeptInput");
        if(input) input.value = dept;
        
        let displayDiv = document.getElementById("selectedDeptDisplay");
        let selectedDeptSpan = document.getElementById("selectedDeptName");
        if(displayDiv && selectedDeptSpan) {
          selectedDeptSpan.innerHTML = dept;
          displayDiv.style.display = "block";
        }
        
        dropdown.style.display = "none";
      });
    });
  },

  updateDropdownList(searchText = "") {
    const products = AppStorage.products;
    let dropdown = document.getElementById("movementDropdownList");
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
      let reorderPoint = p.reorderPoint || 10;
      let needReorder = p.quantity <= reorderPoint;
      let warningIcon = needReorder ? '⚠️ ' : '📦 ';
      let stockColor = needReorder ? 'color:#dc2626;' : 'color:#10b981;';
      
      html += `
        <div class="dropdown-item" data-code="${p.itemcode}" data-name="${p.description}" data-price="${p.price}" data-stock="${p.quantity}" 
             style="padding: 10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="font-family:monospace;">${warningIcon}${p.itemcode}</strong><br>
            <span style="font-size:0.7rem;">${p.description.substring(0, 40)}</span>
          </div>
          <div style="text-align:right;">
            <span style="font-weight:600; ${stockColor}">${p.quantity}</span> ชิ้น<br>
            <span style="font-size:0.65rem;">${p.unit}</span>
          </div>
        </div>
      `;
    });
    
    if(filtered.length > 15) {
      html += `<div style="padding: 10px; text-align:center; background:#f8fafc; font-size:0.7rem; color:#666;">พบ ${filtered.length} รายการ แสดง 15 รายการแรก</div>`;
    }
    
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    
    document.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        let code = item.getAttribute("data-code");
        let name = item.getAttribute("data-name");
        let price = parseFloat(item.getAttribute("data-price"));
        let stock = parseInt(item.getAttribute("data-stock"));
        
        this.selectedProduct = {
          itemcode: code,
          description: name,
          price: price,
          quantity: stock
        };
        
        let input = document.getElementById("movementProductInput");
        if(input) {
          input.value = `${code} - ${name.substring(0, 50)} (เหลือ ${stock})`;
        }
        
        let displayDiv = document.getElementById("selectedProductDisplay");
        let selectedNameSpan = document.getElementById("selectedProductName");
        if(displayDiv && selectedNameSpan) {
          selectedNameSpan.innerHTML = `${code} - ${name} (เหลือ ${stock} ชิ้น)`;
          displayDiv.style.display = "block";
        }
        
        dropdown.style.display = "none";
      });
    });
  },

  recordMovement() {
    if(!this.selectedProduct) { 
      alert("กรุณาเลือกสินค้าจากการค้นหา"); 
      return; 
    }
    
    if(!this.selectedDepartment) { 
      alert("กรุณาเลือกแผนก"); 
      return; 
    }
    
    let qty = parseInt(document.getElementById("movementQty").value);
    if(isNaN(qty) || qty <= 0){ alert("จำนวนต้องมากกว่า0"); return; }
    
    if(this.selectedProduct.quantity < qty) { 
      alert(`สต็อกไม่พอ! คงเหลือ ${this.selectedProduct.quantity}`); 
      return; 
    }
    
    let type = document.getElementById("movementType").value;
    let date = document.getElementById("movementDate").value;
    if(!date) date = Helpers.formatDate();
    let issuer = document.getElementById("movementIssuer").value.trim();
    let note = document.getElementById("movementNote").value.trim();
    
    let totalVal = this.selectedProduct.price * qty;
    
    let product = AppStorage.products.find(p => p.itemcode === this.selectedProduct.itemcode);
    if(product) {
      product.quantity -= qty;
    }
    
    let typeLabels = {
      anniversary: "🎉 ชุดครบปี",
      probation: "📋 ชุดผ่านทดลองงาน",
      general: "👥 เบิกจ่ายพนักงานทั่วไป",
      newhire: "🆕 พนักงานใหม่"
    };
    
    let movementRecord = {
      date, 
      type: type, 
      typeLabel: typeLabels[type],
      itemcode: this.selectedProduct.itemcode, 
      description: this.selectedProduct.description, 
      quantity: qty,
      unitPrice: this.selectedProduct.price, 
      totalValue: totalVal, 
      issuer: issuer || "-",
      department: this.selectedDepartment,
      note: note || "-",
      timestamp: Helpers.getCurrentTimestamp()
    };
    AppStorage.movements.push(movementRecord);
    AppStorage.saveData();
    
    StockComponent.renderStockTable(document.getElementById("stockSearch")?.value || "");
    this.renderMovementsHistory(
      document.getElementById("historySearch")?.value || "",
      document.getElementById("historyTypeFilter")?.value || "",
      document.getElementById("historyDeptInput")?.value || "",
      document.getElementById("historyDateFrom")?.value || "",
      document.getElementById("historyDateTo")?.value || ""
    );
    Helpers.updateStats();
    if(StockComponent.updateReorderCount) StockComponent.updateReorderCount();
    
    document.getElementById("movementQty").value = "1";
    document.getElementById("movementIssuer").value = "";
    document.getElementById("movementNote").value = "";
    document.getElementById("movementProductInput").value = "";
    document.getElementById("movementDeptInput").value = "";
    this.selectedProduct = null;
    this.selectedDepartment = "";
    
    let displayDiv = document.getElementById("selectedProductDisplay");
    if(displayDiv) displayDiv.style.display = "none";
    let deptDisplayDiv = document.getElementById("selectedDeptDisplay");
    if(deptDisplayDiv) deptDisplayDiv.style.display = "none";
    
    alert(`บันทึกสำเร็จ: ${typeLabels[type]} ${qty} ชิ้น มูลค่า ${totalVal.toFixed(2)} บาท (แผนก: ${this.selectedDepartment})`);
  },
  
  renderMovementsHistory(filterText = "", typeFilter = "", deptFilter = "", fromDate = "", toDate = "") {
    let filtered = [...AppStorage.movements];
    
    if(filterText) {
      filtered = filtered.filter(m => 
        (m.itemcode || "").toLowerCase().includes(filterText.toLowerCase()) || 
        (m.description || "").toLowerCase().includes(filterText.toLowerCase()) || 
        (m.note || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (m.issuer || "").toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    if(typeFilter) {
      filtered = filtered.filter(m => m.type === typeFilter);
    }
    
    if(deptFilter) {
      filtered = filtered.filter(m => (m.department || "").toLowerCase().includes(deptFilter.toLowerCase()));
    }
    
    if(fromDate) filtered = filtered.filter(m => m.date >= fromDate);
    if(toDate) filtered = filtered.filter(m => m.date <= toDate);
    
    filtered.sort((a, b) => b.date.localeCompare(a.date));
    
    let tbody = document.getElementById("historyTbody");
    if(!tbody) return;
    if(filtered.length === 0) { 
      tbody.innerHTML = "<tr><td colspan='11' style='text-align:center; padding:40px;'>ไม่มีประวัติ</td</tr>";
      return; 
    }
    
    let typeClass = {
      anniversary: "type-event",
      probation: "type-staff",
      general: "type-staff",
      newhire: "type-staff"
    };
    
    let html = "";
    filtered.forEach(m => {
      let typeText = m.typeLabel || m.type;
      let badgeClass = typeClass[m.type] || "type-staff";
      
      let formattedDate = this.formatDateToThai(m.date);
      let formattedTimestamp = this.formatTimestamp(m.timestamp);
      
      html += `
        <tr style="border: 1px solid #ddd;">
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${formattedDate}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;"><span class="type-badge ${badgeClass}">${typeText}</span></td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${m.itemcode}</td>
          <td style="text-align:left; border:1px solid #ddd; padding:8px; white-space: normal;">${m.description}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${m.quantity}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${(m.unitPrice || 0).toFixed(2)}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${(m.totalValue || 0).toFixed(2)}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${m.issuer || "-"}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${m.department || "-"}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${m.note || "-"}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${formattedTimestamp}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  },

  exportToExcel() {
    try {
      let filtered = [...AppStorage.movements];
      
      let filterText = document.getElementById("historySearch")?.value || "";
      let typeFilter = document.getElementById("historyTypeFilter")?.value || "";
      let deptFilter = document.getElementById("historyDeptInput")?.value || "";
      let fromDate = document.getElementById("historyDateFrom")?.value || "";
      let toDate = document.getElementById("historyDateTo")?.value || "";
      
      if(filterText) {
        filtered = filtered.filter(m => 
          (m.itemcode || "").toLowerCase().includes(filterText.toLowerCase()) || 
          (m.description || "").toLowerCase().includes(filterText.toLowerCase()) || 
          (m.note || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (m.issuer || "").toLowerCase().includes(filterText.toLowerCase())
        );
      }
      
      if(typeFilter) {
        filtered = filtered.filter(m => m.type === typeFilter);
      }
      
      if(deptFilter) {
        filtered = filtered.filter(m => (m.department || "").toLowerCase().includes(deptFilter.toLowerCase()));
      }
      
      if(fromDate) filtered = filtered.filter(m => m.date >= fromDate);
      if(toDate) filtered = filtered.filter(m => m.date <= toDate);
      
      filtered.sort((a, b) => b.date.localeCompare(a.date));
      
      let typeLabels = {
        anniversary: "ชุดครบปี",
        probation: "ชุดผ่านทดลองงาน",
        general: "เบิกจ่ายพนักงานทั่วไป",
        newhire: "พนักงานใหม่"
      };
      
      let htmlContent = `
        <html>
        <head>
          <meta charset="UTF-8">
          <title>รายงานการเบิกจ่ายสินค้า</title>
          <style>
            @page {
              size: A4;
              margin: 0.5cm;
            }
            body { 
              font-family: 'Sukhumvit Set', 'Tahoma', 'Angsana New', sans-serif; 
              margin: 0;
              padding: 10px;
            }
            h2 { 
              color: #1e4a6e; 
              margin-bottom: 8px; 
              font-size: 16px;
            }
            .report-date { 
              margin-bottom: 15px; 
              color: #666; 
              font-size: 10px; 
            }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              font-size: 10px;
            }
            th {
              background-color: #1e4a6e;
              color: white;
              padding: 6px 4px;
              text-align: center;
              border: 1px solid #ddd;
              font-weight: bold;
              white-space: nowrap;
            }
            td {
              padding: 5px 4px;
              border: 1px solid #ddd;
              text-align: center;
              white-space: nowrap;
            }
            td:nth-child(4) { 
              text-align: left; 
              white-space: normal;
            }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { 
              margin-top: 15px; 
              text-align: right; 
              font-size: 9px; 
              color: #999; 
            }
            .total-row {
              background-color: #eef2ff;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h2>รายงานการเบิกจ่ายสินค้า</h2>
          <div class="report-date">
            สร้างเมื่อ: ${new Date().toLocaleString('th-TH')}
            ${filterText ? ` | ค้นหา: ${filterText}` : ''}
            ${typeFilter ? ` | ประเภท: ${typeLabels[typeFilter] || typeFilter}` : ''}
            ${deptFilter ? ` | แผนก: ${deptFilter}` : ''}
            ${fromDate ? ` | วันที่เริ่มต้น: ${this.formatDateToThai(fromDate)}` : ''}
            ${toDate ? ` | วันที่สิ้นสุด: ${this.formatDateToThai(toDate)}` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th style="width:8%">วันที่</th>
                <th style="width:15%">ประเภท</th>
                <th style="width:10%">Itemcode</th>
                <th style="width:20%">สินค้า</th>
                <th style="width:5%">จำนวนจ่าย</th>
                <th style="width:7%">ราคา/หน่วย</th>
                <th style="width:7%">มูลค่า</th>
                <th style="width:10%">ผู้จ่าย</th>
                <th style="width:6%">แผนก</th>
                <th style="width:10%">ส่วนงานที่รับ</th>
                <th style="width:12%">บันทึกเมื่อ</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      let totalQty = 0;
      let totalValue = 0;
      
      filtered.forEach(m => {
        let formattedDate = this.formatDateToThai(m.date);
        let formattedTimestamp = this.formatTimestamp(m.timestamp);
        let typeText = m.typeLabel || typeLabels[m.type] || m.type;
        
        totalQty += m.quantity;
        totalValue += (m.totalValue || 0);
        
        htmlContent += `
              <tr>
                <td style="text-align:center">${formattedDate}</td>
                <td style="text-align:center">${typeText}</td>
                <td style="text-align:center">${m.itemcode}</td>
                <td style="text-align:left">${m.description}</td>
                <td style="text-align:center">${m.quantity}</td>
                <td style="text-align:center">${(m.unitPrice || 0).toFixed(2)}</td>
                <td style="text-align:center">${(m.totalValue || 0).toFixed(2)}</td>
                <td style="text-align:center">${m.issuer || "-"}</td>
                <td style="text-align:center">${m.department || "-"}</td>
                <td style="text-align:center">${m.note || "-"}</td>
                <td style="text-align:center">${formattedTimestamp}</td>
              </tr>
        `;
      });
      
      htmlContent += `
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="4" style="text-align:right;"><strong>รวมทั้งสิ้น</strong></td>
                <td style="text-align:center;"><strong>${totalQty}</strong></td>
                <td colspan="1"></td>
                <td style="text-align:center;"><strong>${totalValue.toFixed(2)}</strong></td>
                <td colspan="4"></td>
              </tr>
            </tfoot>
          </table>
          <div class="footer">
            สร้างโดยระบบบริหารสต็อกองค์กร | จำนวนรายการ: ${filtered.length} รายการ
          </div>
        </body>
        </html>
      `;
      
      let blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
      let link = document.createElement("a");
      let url = URL.createObjectURL(blob);
      link.href = url;
      let now = new Date();
      let fileName = `movement_report_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.xls`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert("✅ ส่งออก Excel สำเร็จ! ไฟล์อยู่ในโฟลเดอร์ Downloads");
    } catch(error) {
      console.error("Export Error:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  }
};