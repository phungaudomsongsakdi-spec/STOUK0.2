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
              <div class="form-group"><label>ผู้จัดส่ง</label><input type="text" id="receiveSupplier" placeholder="ชื่อผู้จัดส่ง"></div>
              <div class="form-group"><label>ผู้รับสินค้า</label><input type="text" id="receiveReceiver" placeholder="ชื่อผู้รับสินค้า"></div>
              <div class="form-group" style="position: relative;">
                <label>🔍 แผนก (พิมพ์ค้นหา)</label>
                <input type="text" id="receiveDeptInput" placeholder="พิมพ์ชื่อแผนก..." 
                       style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;"
                       autocomplete="off">
                <div id="receiveDeptDropdownList" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #cbd5e1; border-radius:16px; max-height:200px; overflow-y:auto; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1); margin-top:5px;">
                </div>
              </div>
              <div class="form-group" style="flex: 0.5;"><button id="recordReceiveBtn" class="btn btn-primary" style="margin-top: 24px;"><i class="fas fa-save"></i> บันทึก</button></div>
            </div>
            <div class="form-group" style="margin-top: 12px;">
              <label>หมายเหตุ</label>
              <input type="text" id="receiveNote" placeholder="หมายเหตุเพิ่มเติม" style="width:100%; padding: 10px; border-radius: 28px; border: 1px solid #cbd5e1;">
            </div>
            <div id="selectedReceiveProductDisplay" style="margin-top: 12px; font-size:0.85rem; color:#0284c7; background:#e0f2fe; padding:8px 16px; border-radius:20px; display:none;">
              <i class="fas fa-check-circle"></i> เลือก: <span id="selectedReceiveProductName"></span>
            </div>
            <div id="selectedReceiveDeptDisplay" style="margin-top: 8px; font-size:0.85rem; color:#1e4a6e; background:#eef2ff; padding:8px 16px; border-radius:20px; display:none;">
              <i class="fas fa-building"></i> แผนก: <span id="selectedReceiveDeptName"></span>
            </div>
          </div>

          <!-- ประวัติ -->
          <div class="filter-bar">
            <i class="fas fa-filter"></i> <span>กรองประวัติ:</span>
            <input type="text" id="receiveHistorySearch" placeholder="ค้นหาทั้งหมด...">
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
                  <th style="width:10%; text-align:center; border:1px solid #ddd; padding:10px;">วันที่</th>
                  <th style="width:12%; text-align:center; border:1px solid #ddd; padding:10px;">Itemcode</th>
                  <th style="width:25%; text-align:center; border:1px solid #ddd; padding:10px;">สินค้า</th>
                  <th style="width:7%; text-align:center; border:1px solid #ddd; padding:10px;">จำนวน</th>
                  <th style="width:8%; text-align:center; border:1px solid #ddd; padding:10px;">มูลค่า</th>
                  <th style="width:15%; text-align:center; border:1px solid #ddd; padding:10px;">ผู้จัดส่ง</th>
                  <th style="width:15%; text-align:center; border:1px solid #ddd; padding:10px;">ผู้รับ</th>
                  <th style="width:8%; text-align:center; border:1px solid #ddd; padding:10px;">แผนก</th>
                  <th style="width:15%; text-align:center; border:1px solid #ddd; padding:10px;">หมายเหตุ</th>
                  <th style="width:15%; text-align:center; border:1px solid #ddd; padding:10px;">บันทึกเมื่อ</th>
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

  updateReceiveDeptDropdownList(searchText = "") {
    let dropdown = document.getElementById("receiveDeptDropdownList");
    if(!dropdown) return;
    if(searchText.trim() === "") { dropdown.style.display = "none"; return; }
    let filtered = this.departments.filter(dept => dept.toLowerCase().includes(searchText.toLowerCase()));
    if(filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding: 12px; text-align:center; color:#999;">ไม่พบแผนก</div>';
      dropdown.style.display = "block";
      return;
    }
    let html = "";
    filtered.forEach(dept => {
      html += `<div class="dept-dropdown-item" data-dept="${dept}" style="padding: 10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;"><div><strong>🏢 ${dept}</strong></div><div style="color:#1e4a6e;">เลือก ➔</div></div>`;
    });
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    document.querySelectorAll(".dept-dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        let dept = item.getAttribute("data-dept");
        this.selectedDepartment = dept;
        let input = document.getElementById("receiveDeptInput");
        if(input) input.value = dept;
        let displayDiv = document.getElementById("selectedReceiveDeptDisplay");
        let selectedDeptSpan = document.getElementById("selectedReceiveDeptName");
        if(displayDiv && selectedDeptSpan) {
          selectedDeptSpan.innerHTML = dept;
          displayDiv.style.display = "block";
        }
        dropdown.style.display = "none";
      });
    });
  },

  updateReceiveDropdownList(searchText = "") {
    const products = AppStorage.products;
    let dropdown = document.getElementById("receiveDropdownList");
    if(!dropdown) return;
    if(searchText.trim() === "") { dropdown.style.display = "none"; return; }
    let filtered = products.filter(p => p.itemcode.toLowerCase().includes(searchText.toLowerCase()) || p.description.toLowerCase().includes(searchText.toLowerCase()));
    if(filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding: 12px; text-align:center; color:#999;">ไม่พบสินค้า</div>';
      dropdown.style.display = "block";
      return;
    }
    let html = "";
    filtered.slice(0, 15).forEach(p => {
      html += `<div class="dropdown-item" data-code="${p.itemcode}" data-name="${p.description}" data-price="${p.price}" data-stock="${p.quantity}" style="padding: 10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;"><div><strong>${p.itemcode}</strong><br><span style="font-size:0.7rem;">${p.description.substring(0, 40)}</span></div><div><span style="font-weight:600;">${p.quantity}</span> ชิ้น</div></div>`;
    });
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    document.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        let code = item.getAttribute("data-code");
        let name = item.getAttribute("data-name");
        let price = parseFloat(item.getAttribute("data-price"));
        let stock = parseInt(item.getAttribute("data-stock"));
        this.selectedProduct = { itemcode: code, description: name, price: price, quantity: stock };
        let input = document.getElementById("receiveProductInput");
        if(input) input.value = `${code} - ${name.substring(0, 50)} (เหลือ ${stock})`;
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

  recordReceive() {
    if(!this.selectedProduct) { alert("กรุณาเลือกสินค้าที่จะรับเข้า"); return; }
    let qty = parseInt(document.getElementById("receiveQty").value);
    if(isNaN(qty) || qty <= 0){ alert("จำนวนต้องมากกว่า0"); return; }
    let supplier = document.getElementById("receiveSupplier").value.trim();
    let receiver = document.getElementById("receiveReceiver").value.trim();
    let department = this.selectedDepartment;
    let date = document.getElementById("receiveDate").value;
    let note = document.getElementById("receiveNote").value.trim();
    if(!supplier) { alert("กรุณากรอกชื่อผู้จัดส่ง"); return; }
    if(!receiver) { alert("กรุณากรอกชื่อผู้รับสินค้า"); return; }
    if(!department) { alert("กรุณาเลือกแผนก"); return; }
    if(!date) date = Helpers.formatDate();
    let totalValue = this.selectedProduct.price * qty;
    let product = AppStorage.products.find(p => p.itemcode === this.selectedProduct.itemcode);
    if(product) product.quantity += qty;
    let receiveRecord = { date, itemcode: this.selectedProduct.itemcode, description: this.selectedProduct.description, quantity: qty, unitPrice: this.selectedProduct.price, totalValue: totalValue, supplier: supplier, receiver: receiver, department: department, note: note || "รับสินค้าเข้า", timestamp: Helpers.getCurrentTimestamp() };
    AppStorage.receives = AppStorage.receives || [];
    AppStorage.receives.push(receiveRecord);
    AppStorage.saveData();
    alert(`✅ รับสินค้าเข้าสำเร็จ: ${this.selectedProduct.itemcode} ${qty} ชิ้น`);
    document.getElementById("receiveProductInput").value = "";
    document.getElementById("receiveQty").value = "1";
    document.getElementById("receiveSupplier").value = "";
    document.getElementById("receiveReceiver").value = "";
    document.getElementById("receiveDeptInput").value = "";
    document.getElementById("receiveNote").value = "";
    this.selectedProduct = null;
    this.selectedDepartment = "";
    document.getElementById("selectedReceiveProductDisplay").style.display = "none";
    document.getElementById("selectedReceiveDeptDisplay").style.display = "none";
    StockComponent.renderStockTable(document.getElementById("stockSearch")?.value || "");
    this.renderReceiveHistory(
      document.getElementById("receiveHistorySearch")?.value || "",
      document.getElementById("receiveHistoryDateFrom")?.value || "",
      document.getElementById("receiveHistoryDateTo")?.value || ""
    );
    Helpers.updateStats();
    if(StockComponent.updateReorderCount) StockComponent.updateReorderCount();
  },

  renderReceiveHistory(filterText = "", fromDate = "", toDate = "") {
    let receives = AppStorage.receives || [];
    let filtered = [...receives];
    if(filterText) {
      filtered = filtered.filter(r => (r.itemcode || "").toLowerCase().includes(filterText.toLowerCase()) || (r.description || "").toLowerCase().includes(filterText.toLowerCase()) || (r.supplier || "").toLowerCase().includes(filterText.toLowerCase()) || (r.receiver || "").toLowerCase().includes(filterText.toLowerCase()) || (r.note || "").toLowerCase().includes(filterText.toLowerCase()));
    }
    if(fromDate) filtered = filtered.filter(r => r.date >= fromDate);
    if(toDate) filtered = filtered.filter(r => r.date <= toDate);
    filtered.sort((a, b) => b.date.localeCompare(a.date));
    let tbody = document.getElementById("receiveHistoryTbody");
    if(!tbody) return;
    if(filtered.length === 0) { tbody.innerHTML = "<tr><td colspan='10' style='text-align:center; padding:40px;'>ไม่มีประวัติ</td</tr>"; return; }
    let html = "";
    filtered.forEach(r => {
      let formattedDate = this.formatDateToThai(r.date);
      let formattedTimestamp = this.formatTimestamp(r.timestamp);
      html += `<tr style="border:1px solid #ddd;"><td style="text-align:center; border:1px solid #ddd; padding:10px;">${formattedDate}</td><td style="text-align:center; border:1px solid #ddd; padding:10px;">${r.itemcode}</td><td style="text-align:left; border:1px solid #ddd; padding:10px;">${r.description}</td><td style="text-align:center; border:1px solid #ddd; padding:10px;">${r.quantity}</td><td style="text-align:right; border:1px solid #ddd; padding:10px;">${(r.totalValue || 0).toFixed(2)}</td><td style="text-align:left; border:1px solid #ddd; padding:10px;">${r.supplier || '-'}</td><td style="text-align:left; border:1px solid #ddd; padding:10px;">${r.receiver || '-'}</td><td style="text-align:center; border:1px solid #ddd; padding:10px;">${r.department || '-'}</td><td style="text-align:left; border:1px solid #ddd; padding:10px;">${r.note || '-'}</td><td style="text-align:center; border:1px solid #ddd; padding:10px;">${formattedTimestamp}</td></tr>`;
    });
    tbody.innerHTML = html;
  }
};