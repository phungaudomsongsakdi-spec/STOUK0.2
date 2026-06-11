const ReceiveComponent = {
  render() {
    return `
      <div class="card">
        <div class="card-header">
          <h2><i class="fas fa-truck-loading"></i> รับสินค้าเข้า</h2>
        </div>
        <div class="card-body">
          <div style="background:#e0f2fe; border-radius: 24px; padding: 20px; margin-bottom: 24px;">
            <div class="form-row">
              <div class="form-group" style="flex: 2; position: relative;">
                <label>🔍 เลือกสินค้าที่จะรับเข้า (พิมพ์ค้นหา)</label>
                <input type="text" id="receiveProductInput" placeholder="พิมพ์ Itemcode หรือ ชื่อสินค้า..." 
                       style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;"
                       autocomplete="off">
                <div id="receiveDropdownList" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #cbd5e1; border-radius:16px; max-height:250px; overflow-y:auto; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1); margin-top:5px;">
                </div>
              </div>
              <div class="form-group"><label>จำนวนที่รับเข้า</label><input type="number" id="receiveQty" min="1" value="1"></div>
              <div class="form-group"><label>วันที่รับ</label><input type="date" id="receiveDate"></div>
            </div>
            <div class="form-row" style="margin-top: 12px;">
              <div class="form-group" style="flex: 2;">
                <label>ผู้จัดส่ง</label>
                <div style="position: relative;">
                  <select id="receiveSupplierSelect" style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;">
                    <option value="บริษัท ครอกโคไดล์ เอ็นเตอร์ไพรส์ จำกัด (ชุด uniform)">🏢 บริษัท ครอกโคไดล์ เอ็นเตอร์ไพรส์ จำกัด (ชุด uniform)</option>
                    <option value="บริษัท กสิพันธารัต จำกัด (รองเท้า)">👟 บริษัท กสิพันธารัต จำกัด (รองเท้า)</option>
                    <option value="OTHER">✏️ อื่นๆ (พิมพ์เอง)</option>
                  </select>
                  <input type="text" id="receiveSupplierOther" placeholder="พิมพ์ชื่อผู้จัดส่ง..." 
                         style="display:none; width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1; margin-top: 8px;">
                </div>
              </div>
              <div class="form-group"><label>ผู้รับสินค้า</label><input type="text" id="receiveReceiver" placeholder="ชื่อผู้รับสินค้า" style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;"></div>
              <div class="form-group" style="flex: 0.5;"><button id="recordReceiveBtn" class="btn btn-primary" style="margin-top: 24px;"><i class="fas fa-save"></i> บันทึก</button></div>
            </div>
            <div class="form-group" style="margin-top: 12px;">
              <label>หมายเหตุ</label>
              <input type="text" id="receiveNote" placeholder="หมายเหตุเพิ่มเติม" style="width:100%; padding: 10px; border-radius: 28px; border: 1px solid #cbd5e1;">
            </div>
            <div id="selectedReceiveProductDisplay" style="margin-top: 12px; font-size:0.85rem; color:#0284c7; background:#e0f2fe; padding:8px 16px; border-radius:20px; display:none;">
              <i class="fas fa-check-circle"></i> เลือก: <span id="selectedReceiveProductName"></span>
            </div>
          </div>

          <!-- กรองประวัติ -->
          <div class="filter-bar">
            <i class="fas fa-filter"></i> <span>กรองประวัติ:</span>
            <input type="text" id="receiveHistorySearch" placeholder="ค้นหาทั้งหมด...">
            <select id="receiveHistorySupplierFilter" style="padding: 6px 12px; border-radius: 20px; border: 1px solid #cbd5e1;">
              <option value="">📌 ผู้จัดส่งทั้งหมด</option>
              <option value="บริษัท ครอกโคไดล์ เอ็นเตอร์ไพรส์ จำกัด (ชุด uniform)">🏢 บริษัท ครอกโคไดล์ ฯ (ชุด uniform)</option>
              <option value="บริษัท กสิพันธารัต จำกัด (รองเท้า)">👟 บริษัท กสิพันธารัต ฯ (รองเท้า)</option>
              <option value="OTHER">✏️ อื่นๆ</option>
            </select>
            <input type="date" id="receiveHistoryDateFrom" placeholder="จากวันที่">
            <input type="date" id="receiveHistoryDateTo" placeholder="ถึงวันที่">
            <button id="resetReceiveHistoryBtn" class="btn btn-sm">รีเซ็ต</button>
            <button id="exportReceiveHistoryExcelBtn" class="btn btn-sm" style="background:#10b981; color:white;">
              <i class="fas fa-file-excel"></i> ส่งออก Excel
            </button>
          </div>
          
          <div class="table-wrapper">
            <table style="min-width:1000px; border-collapse: collapse; width:100%;">
              <thead>
                <tr style="border: 1px solid #ddd;">
                  <th style="width:10%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">วันที่</th>
                  <th style="width:12%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">Itemcode</th>
                  <th style="width:22%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">สินค้า</th>
                  <th style="width:6%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">จำนวน</th>
                  <th style="width:8%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">มูลค่า</th>
                  <th style="width:18%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">ผู้จัดส่ง</th>
                  <th style="width:12%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">ผู้รับ</th>
                  <th style="width:12%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">หมายเหตุ</th>
                  <th style="width:15%; text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">บันทึกเมื่อ</th>
                </tr>
              </thead>
              <tbody id="receiveHistoryTbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  selectedProduct: null,

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

  updateReceiveDropdownList(searchText = "") {
    const products = AppStorage.products;
    let dropdown = document.getElementById("receiveDropdownList");
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
      let needReorder = p.quantity <= (p.reorderPoint || 10);
      let warningIcon = needReorder ? '⚠️ ' : '📦 ';
      html += `
        <div class="dropdown-item" data-code="${p.itemcode}" data-name="${p.description}" data-price="${p.price}" data-stock="${p.quantity}" 
             style="padding: 10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="font-family:monospace;">${warningIcon}${p.itemcode}</strong><br>
            <span style="font-size:0.7rem;">${p.description.substring(0, 40)}</span>
          </div>
          <div style="text-align:right;">
            <span style="font-weight:600;">${p.quantity}</span> ชิ้น<br>
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
    
    let self = this;
    document.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", function() {
        let code = this.getAttribute("data-code");
        let name = this.getAttribute("data-name");
        let price = parseFloat(this.getAttribute("data-price"));
        let stock = parseInt(this.getAttribute("data-stock"));
        
        self.selectedProduct = {
          itemcode: code,
          description: name,
          price: price,
          quantity: stock
        };
        
        let input = document.getElementById("receiveProductInput");
        if(input) {
          input.value = `${code} - ${name.substring(0, 50)} (เหลือ ${stock})`;
        }
        
        let displayDiv = document.getElementById("selectedReceiveProductDisplay");
        let selectedNameSpan = document.getElementById("selectedReceiveProductName");
        if(displayDiv && selectedNameSpan) {
          selectedNameSpan.innerHTML = `${code} - ${name} (เหลือ ${stock} ชิ้น)`;
          displayDiv.style.display = "block";
        }
        
        dropdown.style.display = "none";
      });
    });
  },

  getSupplier() {
    let select = document.getElementById("receiveSupplierSelect");
    let otherInput = document.getElementById("receiveSupplierOther");
    
    if(select.value === "OTHER") {
      return otherInput.value.trim();
    }
    return select.value;
  },

  recordReceive() {
    if(!this.selectedProduct) { 
      alert("กรุณาเลือกสินค้าที่จะรับเข้า"); 
      return; 
    }
    
    let qty = parseInt(document.getElementById("receiveQty").value);
    if(isNaN(qty) || qty <= 0){ alert("จำนวนต้องมากกว่า0"); return; }
    
    let supplier = this.getSupplier();
    if(!supplier) { 
      alert("กรุณาเลือกหรือกรอกชื่อผู้จัดส่ง"); 
      return; 
    }
    
    let receiver = document.getElementById("receiveReceiver").value.trim();
    let date = document.getElementById("receiveDate").value;
    let note = document.getElementById("receiveNote").value.trim();
    
    if(!receiver) { alert("กรุณากรอกชื่อผู้รับสินค้า"); return; }
    if(!date) date = Helpers.formatDate();
    
    let totalValue = this.selectedProduct.price * qty;
    
    let product = AppStorage.products.find(p => p.itemcode === this.selectedProduct.itemcode);
    if(product) {
      product.quantity += qty;
    }
    
    let receiveRecord = {
      date: date,
      itemcode: this.selectedProduct.itemcode,
      description: this.selectedProduct.description,
      quantity: qty,
      unitPrice: this.selectedProduct.price,
      totalValue: totalValue,
      supplier: supplier,
      receiver: receiver,
      note: note || "รับสินค้าเข้า",
      timestamp: Helpers.getCurrentTimestamp()
    };
    AppStorage.receives = AppStorage.receives || [];
    AppStorage.receives.push(receiveRecord);
    AppStorage.saveData();
    
    alert(`✅ รับสินค้าเข้าสำเร็จ: ${this.selectedProduct.itemcode} ${qty} ชิ้น (ผู้จัดส่ง: ${supplier})`);
    
    // เคลียร์ฟอร์ม
    document.getElementById("receiveProductInput").value = "";
    document.getElementById("receiveQty").value = "1";
    document.getElementById("receiveSupplierSelect").value = "บริษัท ครอกโคไดล์ เอ็นเตอร์ไพรส์ จำกัด (ชุด uniform)";
    document.getElementById("receiveSupplierOther").value = "";
    document.getElementById("receiveSupplierOther").style.display = "none";
    document.getElementById("receiveReceiver").value = "";
    document.getElementById("receiveNote").value = "";
    this.selectedProduct = null;
    document.getElementById("selectedReceiveProductDisplay").style.display = "none";
    
    StockComponent.renderStockTable(document.getElementById("stockSearch")?.value || "");
    this.renderReceiveHistory(
      document.getElementById("receiveHistorySearch")?.value || "",
      document.getElementById("receiveHistorySupplierFilter")?.value || "",
      document.getElementById("receiveHistoryDateFrom")?.value || "",
      document.getElementById("receiveHistoryDateTo")?.value || ""
    );
    Helpers.updateStats();
    if(StockComponent.updateReorderCount) StockComponent.updateReorderCount();
  },

  renderReceiveHistory(filterText = "", supplierFilter = "", fromDate = "", toDate = "") {
    let receives = AppStorage.receives || [];
    let filtered = [...receives];
    
    if(filterText) {
      filtered = filtered.filter(r => 
        (r.itemcode || "").toLowerCase().includes(filterText.toLowerCase()) || 
        (r.description || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.supplier || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.receiver || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.note || "").toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    // กรองตามผู้จัดส่ง
    if(supplierFilter) {
      if(supplierFilter === "OTHER") {
        filtered = filtered.filter(r => 
          r.supplier !== "บริษัท ครอกโคไดล์ เอ็นเตอร์ไพรส์ จำกัด (ชุด uniform)" && 
          r.supplier !== "บริษัท กสิพันธารัต จำกัด (รองเท้า)"
        );
      } else {
        filtered = filtered.filter(r => r.supplier === supplierFilter);
      }
    }
    
    if(fromDate) filtered = filtered.filter(r => r.date >= fromDate);
    if(toDate) filtered = filtered.filter(r => r.date <= toDate);
    
    filtered.sort((a, b) => b.date.localeCompare(a.date));
    
    let tbody = document.getElementById("receiveHistoryTbody");
    if(!tbody) return;
    if(filtered.length === 0) { 
      tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; padding:40px;'>ไม่มีประวัติ</td</tr>";
      return; 
    }
    
    let html = "";
    filtered.forEach(r => {
      let formattedDate = this.formatDateToThai(r.date);
      let formattedTimestamp = this.formatTimestamp(r.timestamp);
      html += `
        <tr style="border: 1px solid #ddd;">
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${formattedDate}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${r.itemcode}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: normal;">${r.description}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${r.quantity}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${(r.totalValue || 0).toFixed(2)}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: normal;">${r.supplier || '-'}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: normal;">${r.receiver || '-'}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: normal;">${r.note || '-'}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:8px; white-space: nowrap;">${formattedTimestamp}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  },

  exportToExcel() {
    try {
      let receives = AppStorage.receives || [];
      let filtered = [...receives];
      let filterText = document.getElementById("receiveHistorySearch")?.value || "";
      let supplierFilter = document.getElementById("receiveHistorySupplierFilter")?.value || "";
      let fromDate = document.getElementById("receiveHistoryDateFrom")?.value || "";
      let toDate = document.getElementById("receiveHistoryDateTo")?.value || "";
      
      if(filterText) {
        filtered = filtered.filter(r => 
          (r.itemcode || "").toLowerCase().includes(filterText.toLowerCase()) || 
          (r.description || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (r.supplier || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (r.receiver || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (r.note || "").toLowerCase().includes(filterText.toLowerCase())
        );
      }
      
      if(supplierFilter) {
        if(supplierFilter === "OTHER") {
          filtered = filtered.filter(r => 
            r.supplier !== "บริษัท ครอกโคไดล์ เอ็นเตอร์ไพรส์ จำกัด (ชุด uniform)" && 
            r.supplier !== "บริษัท กสิพันธารัต จำกัด (รองเท้า)"
          );
        } else {
          filtered = filtered.filter(r => r.supplier === supplierFilter);
        }
      }
      
      if(fromDate) filtered = filtered.filter(r => r.date >= fromDate);
      if(toDate) filtered = filtered.filter(r => r.date <= toDate);
      filtered.sort((a, b) => b.date.localeCompare(a.date));
      
      let totalQty = 0;
      let totalValue = 0;
      filtered.forEach(r => {
        totalQty += r.quantity;
        totalValue += (r.totalValue || 0);
      });
      
      let htmlContent = `
        <html>
        <head>
          <meta charset="UTF-8">
          <title>รายงานการรับสินค้าเข้า</title>
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
          <h2>รายงานการรับสินค้าเข้า</h2>
          <div class="report-date">
            สร้างเมื่อ: ${new Date().toLocaleString('th-TH')}
            ${filterText ? ` | ค้นหา: ${filterText}` : ''}
            ${supplierFilter ? ` | ผู้จัดส่ง: ${supplierFilter === "OTHER" ? "อื่นๆ" : supplierFilter}` : ''}
            ${fromDate ? ` | วันที่เริ่มต้น: ${this.formatDateToThai(fromDate)}` : ''}
            ${toDate ? ` | วันที่สิ้นสุด: ${this.formatDateToThai(toDate)}` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th style="width:10%">วันที่</th>
                <th style="width:12%">Itemcode</th>
                <th style="width:22%">สินค้า</th>
                <th style="width:6%">จำนวน</th>
                <th style="width:8%">มูลค่า</th>
                <th style="width:18%">ผู้จัดส่ง</th>
                <th style="width:12%">ผู้รับ</th>
                <th style="width:12%">หมายเหตุ</th>
                <th style="width:15%">บันทึกเมื่อ</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      filtered.forEach(r => {
        let formattedDate = this.formatDateToThai(r.date);
        let formattedTimestamp = this.formatTimestamp(r.timestamp);
        htmlContent += `
              <tr>
                <td style="text-align:center">${formattedDate}</td>
                <td style="text-align:center">${r.itemcode}</td>
                <td style="text-align:center">${r.description}</td>
                <td style="text-align:center">${r.quantity}</td>
                <td style="text-align:center">${(r.totalValue || 0).toFixed(2)}</td>
                <td style="text-align:center">${r.supplier || '-'}</td>
                <td style="text-align:center">${r.receiver || '-'}</td>
                <td style="text-align:center">${r.note || '-'}</td>
                <td style="text-align:center">${formattedTimestamp}</td>
              </tr>
        `;
      });
      
      htmlContent += `
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3" style="text-align:right;"><strong>รวมทั้งสิ้น</strong></td>
                <td style="text-align:center;"><strong>${totalQty}</strong></td>
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
      let fileName = `receive_report_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.xls`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert("✅ ส่งออก Excel สำเร็จ! ไฟล์อยู่ในโฟลเดอร์ Downloads");
    } catch(e) { 
      console.error("Export Error:", e);
      alert("เกิดข้อผิดพลาด: " + e.message); 
    }
  }
};