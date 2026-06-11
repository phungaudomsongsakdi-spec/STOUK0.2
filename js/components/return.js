const ReturnComponent = {
  render() {
    return `
      <div class="card">
        <div class="card-header">
          <h2><i class="fas fa-undo-alt"></i> คืน / เปลี่ยนสินค้า</h2>
        </div>
        <div class="card-body">
          <div style="background:#f8fafc; border-radius: 24px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; gap: 20px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 16px; border-radius: 40px; background:#fef2f2;">
                <input type="radio" name="exchangeMode" value="return" checked> 
                <span><i class="fas fa-undo-alt"></i> คืนสินค้า</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 16px; border-radius: 40px;">
                <input type="radio" name="exchangeMode" value="exchange"> 
                <span><i class="fas fa-exchange-alt"></i> เปลี่ยนสินค้า</span>
              </label>
            </div>

            <!-- โหมดคืนสินค้า -->
            <div id="returnModeDiv">
              <div class="form-row">
                <div class="form-group" style="flex: 2; position: relative;">
                  <label>🔍 เลือกสินค้าที่จะคืน (พิมพ์ค้นหา)</label>
                  <input type="text" id="returnProductInput" placeholder="พิมพ์ Itemcode หรือ ชื่อสินค้า..." 
                         style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;">
                  <div id="returnDropdownList" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #cbd5e1; border-radius:16px; max-height:250px; overflow:auto; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                  </div>
                </div>
                <div class="form-group"><label>จำนวน</label><input type="number" id="returnQty" min="1" value="1"></div>
                <div class="form-group"><label>วันที่</label><input type="date" id="returnDate"></div>
              </div>
              <div class="form-row" style="margin-top: 12px;">
                <div class="form-group"><label>ผู้รับคืน</label><input type="text" id="returnReceiver" placeholder="ชื่อผู้รับคืน"></div>
                <div class="form-group"><label>ผู้คืน</label><input type="text" id="returnReturner" placeholder="ชื่อผู้คืน"></div>
                <div class="form-group" style="position: relative;">
                  <label>🔍 แผนก (พิมพ์ค้นหา)</label>
                  <input type="text" id="returnDeptInput" placeholder="พิมพ์ชื่อแผนก..." 
                         style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;">
                  <div id="returnDeptDropdownList" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #cbd5e1; border-radius:16px; max-height:200px; overflow:auto; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                  </div>
                </div>
                <div class="form-group"><button id="recordReturnBtn" class="btn btn-primary" style="margin-top: 24px;"><i class="fas fa-save"></i> บันทึก</button></div>
              </div>
              <div class="form-group"><label>หมายเหตุ</label><input type="text" id="returnNote" placeholder="เหตุผล" style="width:100%; padding: 10px; border-radius: 28px; border:1px solid #cbd5e1;"></div>
              <div id="selectedReturnProductDisplay" style="margin-top: 12px; font-size:0.85rem; color:#1e4a6e; background:#eef2ff; padding:8px 16px; border-radius:20px; display:none;">
                ✅ เลือก: <span id="selectedReturnProductName"></span>
              </div>
              <div id="selectedReturnDeptDisplay" style="margin-top: 8px; font-size:0.85rem; color:#1e4a6e; background:#eef2ff; padding:8px 16px; border-radius:20px; display:none;">
                🏢 แผนก: <span id="selectedReturnDeptName"></span>
              </div>
            </div>

            <!-- โหมดเปลี่ยนสินค้า -->
            <div id="exchangeModeDiv" style="display:none;">
              <div style="border-left: 3px solid #f59e0b; padding-left: 15px; margin-bottom: 20px;">
                <label style="font-weight:600; color:#f59e0b;">📦 สินค้าที่คืน (ของเก่า)</label>
                <div class="form-row" style="margin-top: 8px;">
                  <div class="form-group" style="flex:2; position:relative;">
                    <input type="text" id="exchangeOldProductInput" placeholder="พิมพ์ Itemcode หรือ ชื่อสินค้า..." 
                           style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;">
                    <div id="exchangeOldDropdownList" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #cbd5e1; border-radius:16px; max-height:200px; overflow:auto; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                    </div>
                  </div>
                  <div class="form-group"><label>จำนวน</label><input type="number" id="exchangeOldQty" min="1" value="1"></div>
                </div>
                <div id="selectedOldProductDisplay" style="margin-top:8px; font-size:0.8rem; color:#dc2626; background:#fee2e2; padding:6px 12px; border-radius:16px; display:none;">📦 คืน: <span id="selectedOldProductName"></span></div>
              </div>

              <div style="border-left: 3px solid #10b981; padding-left: 15px; margin-bottom: 20px;">
                <label style="font-weight:600; color:#10b981;">🚚 สินค้าที่เบิกใหม่ (ของใหม่)</label>
                <div class="form-row" style="margin-top: 8px;">
                  <div class="form-group" style="flex:2; position:relative;">
                    <input type="text" id="exchangeNewProductInput" placeholder="พิมพ์ Itemcode หรือ ชื่อสินค้า..." 
                           style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;">
                    <div id="exchangeNewDropdownList" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #cbd5e1; border-radius:16px; max-height:200px; overflow:auto; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                    </div>
                  </div>
                  <div class="form-group"><label>จำนวน</label><input type="number" id="exchangeNewQty" min="1" value="1"></div>
                </div>
                <div id="selectedNewProductDisplay" style="margin-top:8px; font-size:0.8rem; color:#10b981; background:#dcfce7; padding:6px 12px; border-radius:16px; display:none;">🚚 เบิก: <span id="selectedNewProductName"></span></div>
              </div>

              <div class="form-row">
                <div class="form-group"><label>ผู้รับเปลี่ยน</label><input type="text" id="exchangeReceiver" placeholder="ชื่อผู้รับเปลี่ยน"></div>
                <div class="form-group"><label>ผู้เปลี่ยน</label><input type="text" id="exchangeChanger" placeholder="ชื่อผู้เปลี่ยน"></div>
                <div class="form-group" style="position:relative;">
                  <label>🔍 แผนก (พิมพ์ค้นหา)</label>
                  <input type="text" id="exchangeDeptInput" placeholder="พิมพ์ชื่อแผนก..." 
                         style="width:100%; padding: 12px; border-radius: 28px; border: 1px solid #cbd5e1;">
                  <div id="exchangeDeptDropdownList" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #cbd5e1; border-radius:16px; max-height:200px; overflow:auto; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                  </div>
                </div>
                <div class="form-group"><label>วันที่</label><input type="date" id="exchangeDate"></div>
                <div class="form-group"><button id="recordExchangeBtn" class="btn btn-primary" style="margin-top:24px;"><i class="fas fa-save"></i> บันทึก</button></div>
              </div>
              <div class="form-group"><label>หมายเหตุ</label><input type="text" id="exchangeNote" placeholder="เหตุผล" style="width:100%; padding:10px; border-radius:28px; border:1px solid #cbd5e1;"></div>
              <div id="selectedExchangeDeptDisplay" style="margin-top:8px; font-size:0.85rem; color:#1e4a6e; background:#eef2ff; padding:8px 16px; border-radius:20px; display:none;">🏢 แผนก: <span id="selectedExchangeDeptName"></span></div>
              <div id="exchangeSummary" style="margin-top:15px; background:#eef2ff; border-radius:16px; padding:10px; display:none;">📋 <span id="exchangeSummaryText"></span></div>
            </div>
          </div>

          <!-- กรองประวัติ -->
          <div class="filter-bar">
            <i class="fas fa-filter"></i> <span>กรองประวัติ:</span>
            <input type="text" id="returnHistorySearch" placeholder="ค้นหาทั้งหมด...">
            <select id="historyExchangeTypeFilter" style="padding: 6px 12px; border-radius: 20px; border: 1px solid #cbd5e1;">
              <option value="">📌 ทุกประเภท</option>
              <option value="return">↩️ คืนสินค้า</option>
              <option value="exchange">🔄 เปลี่ยนสินค้า</option>
            </select>
            <button id="resetReturnHistoryBtn" class="btn btn-sm">รีเซ็ต</button>
            <button id="exportReturnHistoryExcelBtn" class="btn btn-sm" style="background:#10b981; color:white;">
              <i class="fas fa-file-excel"></i> ส่งออก Excel
            </button>
          </div>
          
          <div class="table-wrapper">
            <table style="min-width:1300px; border-collapse: collapse; width:100%;">
              <thead>
                <tr style="border: 1px solid #ddd;">
                  <th style="width:8%; text-align:center; border:1px solid #ddd; padding:10px;">วันที่</th>
                  <th style="width:10%; text-align:center; border:1px solid #ddd; padding:10px;">ประเภท</th>
                  <th style="width:10%; text-align:center; border:1px solid #ddd; padding:10px;">Itemcode(คืน)</th>
                  <th style="width:18%; text-align:center; border:1px solid #ddd; padding:10px;">สินค้าที่คืน</th>
                  <th style="width:5%; text-align:center; border:1px solid #ddd; padding:10px;">จำนวนที่คืน</th>
                  <th style="width:10%; text-align:center; border:1px solid #ddd; padding:10px;">Itemcode(เบิก)</th>
                  <th style="width:18%; text-align:center; border:1px solid #ddd; padding:10px;">สินค้าที่เบิก</th>
                  <th style="width:5%; text-align:center; border:1px solid #ddd; padding:10px;">จำนวนเบิก</th>
                  <th style="width:10%; text-align:center; border:1px solid #ddd; padding:10px;">ผู้รับคืน/ผู้รับเปลี่ยน</th>
                  <th style="width:10%; text-align:center; border:1px solid #ddd; padding:10px;">ผู้คืน/ผู้เปลี่ยน</th>
                  <th style="width:7%; text-align:center; border:1px solid #ddd; padding:10px;">แผนก</th>
                  <th style="width:12%; text-align:center; border:1px solid #ddd; padding:10px;">หมายเหตุ</th>
                  <th style="width:12%; text-align:center; border:1px solid #ddd; padding:10px;">บันทึกเมื่อ</th>
                </td>
              </thead>
              <tbody id="returnHistoryTbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  selectedProduct: null,
  selectedOldProduct: null,
  selectedNewProduct: null,
  selectedDepartment: "",
  selectedExchangeDepartment: "",
  exchangeMode: "return",
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
    let dropdown = document.getElementById("returnDeptDropdownList");
    if(!dropdown) return;
    if(searchText.trim() === "") { dropdown.style.display = "none"; return; }
    let filtered = this.departments.filter(d => d.toLowerCase().includes(searchText.toLowerCase()));
    if(filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding: 12px; text-align:center; color:#999;">ไม่พบแผนก</div>';
      dropdown.style.display = "block";
      return;
    }
    let html = "";
    filtered.forEach(d => {
      html += `<div class="dept-dropdown-item" data-dept="${d}" style="padding:10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;"><div><strong>🏢 ${d}</strong></div><div style="color:#1e4a6e;">เลือก ➔</div></div>`;
    });
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    document.querySelectorAll(".dept-dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        this.selectedDepartment = item.dataset.dept;
        document.getElementById("returnDeptInput").value = item.dataset.dept;
        document.getElementById("selectedReturnDeptDisplay").style.display = "block";
        document.getElementById("selectedReturnDeptName").innerHTML = item.dataset.dept;
        dropdown.style.display = "none";
      });
    });
  },

  updateExchangeDeptDropdownList(searchText = "") {
    let dropdown = document.getElementById("exchangeDeptDropdownList");
    if(!dropdown) return;
    if(searchText.trim() === "") { dropdown.style.display = "none"; return; }
    let filtered = this.departments.filter(d => d.toLowerCase().includes(searchText.toLowerCase()));
    if(filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding: 12px; text-align:center; color:#999;">ไม่พบแผนก</div>';
      dropdown.style.display = "block";
      return;
    }
    let html = "";
    filtered.forEach(d => {
      html += `<div class="exchange-dept-dropdown-item" data-dept="${d}" style="padding:10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;"><div><strong>🏢 ${d}</strong></div><div style="color:#1e4a6e;">เลือก ➔</div></div>`;
    });
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    document.querySelectorAll(".exchange-dept-dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        this.selectedExchangeDepartment = item.dataset.dept;
        document.getElementById("exchangeDeptInput").value = item.dataset.dept;
        document.getElementById("selectedExchangeDeptDisplay").style.display = "block";
        document.getElementById("selectedExchangeDeptName").innerHTML = item.dataset.dept;
        dropdown.style.display = "none";
      });
    });
  },

  updateReturnDropdownList(searchText = "") {
    const products = AppStorage.products;
    let dropdown = document.getElementById("returnDropdownList");
    if(!dropdown) return;
    if(searchText.trim() === "") { dropdown.style.display = "none"; return; }
    let filtered = products.filter(p => p.itemcode.toLowerCase().includes(searchText.toLowerCase()) || p.description.toLowerCase().includes(searchText.toLowerCase()));
    if(filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding: 12px; text-align:center; color:#999;">ไม่พบสินค้า</div>';
      dropdown.style.display = "block";
      return;
    }
    let html = "";
    filtered.slice(0,15).forEach(p => {
      let needReorder = p.quantity <= (p.reorderPoint || 10);
      let warningIcon = needReorder ? '⚠️ ' : '📦 ';
      html += `<div class="return-dropdown-item" data-code="${p.itemcode}" data-name="${p.description}" data-price="${p.price}" data-stock="${p.quantity}" style="padding:10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;"><div><strong>${warningIcon}${p.itemcode}</strong><br><span style="font-size:0.7rem;">${p.description.substring(0,40)}</span></div><div style="text-align:right;"><span style="font-weight:600;">${p.quantity}</span> ชิ้น</div></div>`;
    });
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    
    let self = this;
    document.querySelectorAll(".return-dropdown-item").forEach(item => {
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
        
        document.getElementById("returnProductInput").value = `${code} - ${name.substring(0,50)} (เหลือ ${stock})`;
        document.getElementById("selectedReturnProductDisplay").style.display = "block";
        document.getElementById("selectedReturnProductName").innerHTML = `${code} - ${name} (เหลือ ${stock} ชิ้น)`;
        dropdown.style.display = "none";
      });
    });
  },

  updateOldDropdownList(searchText = "") {
    const products = AppStorage.products;
    let dropdown = document.getElementById("exchangeOldDropdownList");
    if(!dropdown) return;
    if(searchText.trim() === "") { dropdown.style.display = "none"; return; }
    let filtered = products.filter(p => p.itemcode.toLowerCase().includes(searchText.toLowerCase()) || p.description.toLowerCase().includes(searchText.toLowerCase()));
    if(filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding: 12px; text-align:center; color:#999;">ไม่พบสินค้า</div>';
      dropdown.style.display = "block";
      return;
    }
    let html = "";
    filtered.slice(0,15).forEach(p => {
      html += `<div class="exchange-old-dropdown-item" data-code="${p.itemcode}" data-name="${p.description}" data-price="${p.price}" data-stock="${p.quantity}" style="padding:10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;"><div><strong>${p.itemcode}</strong><br><span style="font-size:0.7rem;">${p.description.substring(0,40)}</span></div><div style="text-align:right;"><span style="font-weight:600;">${p.quantity}</span> ชิ้น</div></div>`;
    });
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    
    let self = this;
    document.querySelectorAll(".exchange-old-dropdown-item").forEach(item => {
      item.addEventListener("click", function() {
        let code = this.getAttribute("data-code");
        let name = this.getAttribute("data-name");
        let price = parseFloat(this.getAttribute("data-price"));
        let stock = parseInt(this.getAttribute("data-stock"));
        
        self.selectedOldProduct = {
          itemcode: code,
          description: name,
          price: price,
          quantity: stock
        };
        
        document.getElementById("exchangeOldProductInput").value = `${code} - ${name.substring(0,50)} (เหลือ ${stock})`;
        document.getElementById("selectedOldProductDisplay").style.display = "block";
        document.getElementById("selectedOldProductName").innerHTML = `${code} - ${name} (เหลือ ${stock} ชิ้น)`;
        dropdown.style.display = "none";
        self.updateExchangeSummary();
      });
    });
  },

  updateNewDropdownList(searchText = "") {
    const products = AppStorage.products;
    let dropdown = document.getElementById("exchangeNewDropdownList");
    if(!dropdown) return;
    if(searchText.trim() === "") { dropdown.style.display = "none"; return; }
    let filtered = products.filter(p => p.itemcode.toLowerCase().includes(searchText.toLowerCase()) || p.description.toLowerCase().includes(searchText.toLowerCase()));
    if(filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding: 12px; text-align:center; color:#999;">ไม่พบสินค้า</div>';
      dropdown.style.display = "block";
      return;
    }
    let html = "";
    filtered.slice(0,15).forEach(p => {
      html += `<div class="exchange-new-dropdown-item" data-code="${p.itemcode}" data-name="${p.description}" data-price="${p.price}" data-stock="${p.quantity}" style="padding:10px 15px; cursor:pointer; border-bottom:1px solid #edf2f7; display:flex; justify-content:space-between; align-items:center;"><div><strong>${p.itemcode}</strong><br><span style="font-size:0.7rem;">${p.description.substring(0,40)}</span></div><div style="text-align:right;"><span style="font-weight:600;">${p.quantity}</span> ชิ้น</div></div>`;
    });
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    
    let self = this;
    document.querySelectorAll(".exchange-new-dropdown-item").forEach(item => {
      item.addEventListener("click", function() {
        let code = this.getAttribute("data-code");
        let name = this.getAttribute("data-name");
        let price = parseFloat(this.getAttribute("data-price"));
        let stock = parseInt(this.getAttribute("data-stock"));
        
        self.selectedNewProduct = {
          itemcode: code,
          description: name,
          price: price,
          quantity: stock
        };
        
        document.getElementById("exchangeNewProductInput").value = `${code} - ${name.substring(0,50)} (เหลือ ${stock})`;
        document.getElementById("selectedNewProductDisplay").style.display = "block";
        document.getElementById("selectedNewProductName").innerHTML = `${code} - ${name} (เหลือ ${stock} ชิ้น)`;
        dropdown.style.display = "none";
        self.updateExchangeSummary();
      });
    });
  },

  updateExchangeSummary() {
    let summary = document.getElementById("exchangeSummary");
    let text = document.getElementById("exchangeSummaryText");
    if(this.selectedOldProduct && this.selectedNewProduct) {
      let oldQty = parseInt(document.getElementById("exchangeOldQty")?.value) || 1;
      let newQty = parseInt(document.getElementById("exchangeNewQty")?.value) || 1;
      text.innerHTML = `คืน ${this.selectedOldProduct.itemcode} ${oldQty} ชิ้น → เบิก ${this.selectedNewProduct.itemcode} ${newQty} ชิ้น`;
      summary.style.display = "block";
    } else {
      summary.style.display = "none";
    }
  },

  toggleMode(mode) {
    this.exchangeMode = mode;
    document.getElementById("returnModeDiv").style.display = mode === "return" ? "block" : "none";
    document.getElementById("exchangeModeDiv").style.display = mode === "exchange" ? "block" : "none";
  },

  recordReturn() {
    if(this.exchangeMode === "return") {
      if(!this.selectedProduct) { 
        alert("กรุณาเลือกสินค้าที่จะคืน"); 
        return; 
      }
      let receiver = document.getElementById("returnReceiver").value.trim();
      let returner = document.getElementById("returnReturner").value.trim();
      let department = this.selectedDepartment;
      let date = document.getElementById("returnDate").value;
      let note = document.getElementById("returnNote").value.trim();
      if(!receiver) { alert("กรุณากรอกผู้รับคืน"); return; }
      if(!returner) { alert("กรุณากรอกผู้คืน"); return; }
      if(!department) { alert("กรุณาเลือกแผนก"); return; }
      if(!date) date = Helpers.formatDate();
      let qty = parseInt(document.getElementById("returnQty").value);
      if(isNaN(qty) || qty <= 0){ alert("จำนวนต้องมากกว่า0"); return; }
      let product = AppStorage.products.find(p => p.itemcode === this.selectedProduct.itemcode);
      if(product) product.quantity += qty;
      let record = {
        type: "return", date,
        oldItemcode: this.selectedProduct.itemcode,
        oldDescription: this.selectedProduct.description,
        oldQty: qty,
        newItemcode: "-", newDescription: "-", newQty: 0,
        receiver: receiver, returner: returner,
        department: department, note: note || "คืนสินค้า",
        timestamp: Helpers.getCurrentTimestamp()
      };
      AppStorage.returns.push(record);
      AppStorage.saveData();
      alert("✅ บันทึกสำเร็จ");
      this.clearReturnForm();
      this.renderReturnHistory();
      StockComponent.renderStockTable();
      Helpers.updateStats();
      if(StockComponent.updateReorderCount) StockComponent.updateReorderCount();
    } else {
      if(!this.selectedOldProduct) { 
        alert("กรุณาเลือกสินค้าที่จะคืน (ของเก่า)"); 
        return; 
      }
      if(!this.selectedNewProduct) { 
        alert("กรุณาเลือกสินค้าที่จะเบิก (ของใหม่)"); 
        return; 
      }
      let receiver = document.getElementById("exchangeReceiver").value.trim();
      let changer = document.getElementById("exchangeChanger").value.trim();
      let department = this.selectedExchangeDepartment;
      let date = document.getElementById("exchangeDate").value;
      let note = document.getElementById("exchangeNote").value.trim();
      if(!receiver) { alert("กรุณากรอกผู้รับเปลี่ยน"); return; }
      if(!changer) { alert("กรุณากรอกผู้เปลี่ยน"); return; }
      if(!department) { alert("กรุณาเลือกแผนก"); return; }
      if(!date) date = Helpers.formatDate();
      let oldQty = parseInt(document.getElementById("exchangeOldQty").value);
      let newQty = parseInt(document.getElementById("exchangeNewQty").value);
      if(isNaN(oldQty) || oldQty <= 0){ alert("จำนวนที่คืนต้องมากกว่า0"); return; }
      if(isNaN(newQty) || newQty <= 0){ alert("จำนวนที่เบิกต้องมากกว่า0"); return; }
      if(this.selectedNewProduct.quantity < newQty) {
        alert(`สต็อก ${this.selectedNewProduct.itemcode} ไม่พอ! คงเหลือ ${this.selectedNewProduct.quantity}`);
        return;
      }
      let oldProduct = AppStorage.products.find(p => p.itemcode === this.selectedOldProduct.itemcode);
      let newProduct = AppStorage.products.find(p => p.itemcode === this.selectedNewProduct.itemcode);
      if(oldProduct) oldProduct.quantity += oldQty;
      if(newProduct) newProduct.quantity -= newQty;
      let record = {
        type: "exchange", date,
        oldItemcode: this.selectedOldProduct.itemcode,
        oldDescription: this.selectedOldProduct.description,
        oldQty: oldQty,
        newItemcode: this.selectedNewProduct.itemcode,
        newDescription: this.selectedNewProduct.description,
        newQty: newQty,
        receiver: receiver, changer: changer,
        department: department, note: note || "เปลี่ยนสินค้า",
        timestamp: Helpers.getCurrentTimestamp()
      };
      AppStorage.returns.push(record);
      AppStorage.saveData();
      alert("✅ บันทึกสำเร็จ");
      this.clearExchangeForm();
      this.renderReturnHistory();
      StockComponent.renderStockTable();
      Helpers.updateStats();
      if(StockComponent.updateReorderCount) StockComponent.updateReorderCount();
    }
  },

  clearReturnForm() {
    document.getElementById("returnProductInput").value = "";
    document.getElementById("returnQty").value = "1";
    document.getElementById("returnReceiver").value = "";
    document.getElementById("returnReturner").value = "";
    document.getElementById("returnDeptInput").value = "";
    document.getElementById("returnNote").value = "";
    this.selectedProduct = null;
    this.selectedDepartment = "";
    document.getElementById("selectedReturnProductDisplay").style.display = "none";
    document.getElementById("selectedReturnDeptDisplay").style.display = "none";
  },

  clearExchangeForm() {
    document.getElementById("exchangeOldProductInput").value = "";
    document.getElementById("exchangeNewProductInput").value = "";
    document.getElementById("exchangeOldQty").value = "1";
    document.getElementById("exchangeNewQty").value = "1";
    document.getElementById("exchangeReceiver").value = "";
    document.getElementById("exchangeChanger").value = "";
    document.getElementById("exchangeDeptInput").value = "";
    document.getElementById("exchangeNote").value = "";
    this.selectedOldProduct = null;
    this.selectedNewProduct = null;
    this.selectedExchangeDepartment = "";
    document.getElementById("selectedOldProductDisplay").style.display = "none";
    document.getElementById("selectedNewProductDisplay").style.display = "none";
    document.getElementById("exchangeSummary").style.display = "none";
    document.getElementById("selectedExchangeDeptDisplay").style.display = "none";
  },

  renderReturnHistory(filterText = "", typeFilter = "") {
    let filtered = [...AppStorage.returns];
    if(filterText) {
      filtered = filtered.filter(r => 
        (r.oldItemcode || "").toLowerCase().includes(filterText.toLowerCase()) || 
        (r.oldDescription || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.newItemcode || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.newDescription || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.note || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.receiver || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.returner || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.changer || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.department || "").toLowerCase().includes(filterText.toLowerCase())
      );
    }
    if(typeFilter) filtered = filtered.filter(r => r.type === typeFilter);
    filtered.sort((a, b) => b.date.localeCompare(a.date));
    let tbody = document.getElementById("returnHistoryTbody");
    if(!tbody) return;
    if(filtered.length === 0) {
      tbody.innerHTML = "<tr><td colspan='13' style='text-align:center; padding:40px;'>ไม่มีประวัติ</td</tr>";
      return;
    }
    let html = "";
    filtered.forEach((r, idx) => {
      let typeText = r.type === "return" ? "คืนสินค้า" : "เปลี่ยนสินค้า";
      let typeColor = r.type === "return" ? "#dc2626" : "#f59e0b";
      let formattedDate = this.formatDateToThai(r.date);
      let formattedTimestamp = this.formatTimestamp(r.timestamp);
      let receiverPerson = r.type === "return" ? (r.receiver || "-") : (r.receiver || "-");
      let changerPerson = r.type === "return" ? (r.returner || "-") : (r.changer || "-");
      
      html += `
        <tr style="border: 1px solid #ddd;">
          <td style="text-align:center; border:1px solid #ddd; padding:10px;">${formattedDate}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:10px;"><span style="background:${typeColor}20; color:${typeColor}; padding:4px 10px; border-radius:20px; display:inline-block;">${typeText}</span></td>
          <td style="text-align:center; border:1px solid #ddd; padding:10px;">${r.oldItemcode}</td>
          <td style="text-align:left; border:1px solid #ddd; padding:10px;">${r.oldDescription}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:10px;">${r.oldQty}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:10px;">${r.newItemcode !== "-" ? r.newItemcode : "-"}</td>
          <td style="text-align:left; border:1px solid #ddd; padding:10px;">${r.newDescription !== "-" ? r.newDescription : "-"}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:10px;">${r.newQty > 0 ? r.newQty : "-"}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:10px;">${receiverPerson}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:10px;">${changerPerson}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:10px;">${r.department || "-"}</td>
          <td style="text-align:left; border:1px solid #ddd; padding:10px;">${r.note || "-"}</td>
          <td style="text-align:center; border:1px solid #ddd; padding:10px;">${formattedTimestamp}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  },

  exportToExcel() {
    try {
      let filtered = [...AppStorage.returns];
      let filterText = document.getElementById("returnHistorySearch")?.value || "";
      let typeFilter = document.getElementById("historyExchangeTypeFilter")?.value || "";
      
      if(filterText) {
        filtered = filtered.filter(r => 
          (r.oldItemcode || "").toLowerCase().includes(filterText.toLowerCase()) || 
          (r.oldDescription || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (r.newItemcode || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (r.newDescription || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (r.note || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (r.receiver || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (r.returner || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (r.changer || "").toLowerCase().includes(filterText.toLowerCase()) ||
          (r.department || "").toLowerCase().includes(filterText.toLowerCase())
        );
      }
      
      if(typeFilter) filtered = filtered.filter(r => r.type === typeFilter);
      filtered.sort((a, b) => b.date.localeCompare(a.date));
      
      let htmlContent = `
        <html>
        <head>
          <meta charset="UTF-8">
          <title>รายงานการคืน/เปลี่ยนสินค้า</title>
          <style>
            body { font-family: 'Sukhumvit Set', 'Tahoma', 'Angsana New', sans-serif; margin: 20px; }
            h2 { color: #1e4a6e; margin-bottom: 10px; }
            .report-date { margin-bottom: 20px; color: #666; font-size: 12px; }
            table { border-collapse: collapse; width: 100%; font-size: 13px; }
            th { background-color: #1e4a6e; color: white; padding: 12px 8px; text-align: center; border: 1px solid #ddd; font-weight: bold; }
            td { padding: 10px 8px; border: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 20px; text-align: right; font-size: 11px; color: #999; }
          </style>
        </head>
        <body>
          <h2>รายงานการคืน/เปลี่ยนสินค้า</h2>
          <div class="report-date">
            สร้างเมื่อ: ${new Date().toLocaleString('th-TH')}
            ${filterText ? ` | ค้นหา: ${filterText}` : ''}
            ${typeFilter ? ` | ประเภท: ${typeFilter === "return" ? "คืนสินค้า" : "เปลี่ยนสินค้า"}` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th style="width:8%">วันที่</th>
                <th style="width:10%">ประเภท</th>
                <th style="width:10%">Itemcode(คืน)</th>
                <th style="width:18%">สินค้าที่คืน</th>
                <th style="width:5%">จำนวน</th>
                <th style="width:10%">Itemcode(เบิก)</th>
                <th style="width:18%">สินค้าที่เบิก</th>
                <th style="width:5%">จำนวนเบิก</th>
                <th style="width:10%">ผู้รับคืน/ผู้รับเปลี่ยน</th>
                <th style="width:10%">ผู้คืน/ผู้เปลี่ยน</th>
                <th style="width:7%">แผนก</th>
                <th style="width:12%">หมายเหตุ</th>
                <th style="width:12%">บันทึกเมื่อ</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      filtered.forEach(r => {
        let formattedDate = this.formatDateToThai(r.date);
        let typeText = r.type === "return" ? "คืนสินค้า" : "เปลี่ยนสินค้า";
        let receiverPerson = r.type === "return" ? (r.receiver || "-") : (r.receiver || "-");
        let changerPerson = r.type === "return" ? (r.returner || "-") : (r.changer || "-");
        let formattedTimestamp = this.formatTimestamp(r.timestamp);
        
        htmlContent += `
              <tr>
                <td style="text-align:center">${formattedDate}</td>
                <td style="text-align:center">${typeText}</td>
                <td style="text-align:center">${r.oldItemcode}</td>
                <td style="text-align:left">${r.oldDescription}</td>
                <td style="text-align:center">${r.oldQty}</td>
                <td style="text-align:center">${r.newItemcode !== "-" ? r.newItemcode : "-"}</td>
                <td style="text-align:left">${r.newDescription !== "-" ? r.newDescription : "-"}</td>
                <td style="text-align:center">${r.newQty > 0 ? r.newQty : "-"}</td>
                <td style="text-align:center">${receiverPerson}</td>
                <td style="text-align:center">${changerPerson}</td>
                <td style="text-align:center">${r.department || "-"}</td>
                <td style="text-align:left">${r.note || "-"}</td>
                <td style="text-align:center">${formattedTimestamp}</td>
              </tr>
        `;
      });
      
      htmlContent += `
            </tbody>
          </table>
          <div class="footer">สร้างโดยระบบบริหารสต็อกองค์กร | จำนวนรายการ: ${filtered.length} รายการ</div>
        </body>
        </html>
      `;
      
      let blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
      let link = document.createElement("a");
      let url = URL.createObjectURL(blob);
      link.href = url;
      let now = new Date();
      let fileName = `return_report_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.xls`;
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