const ReportComponent = {
  render() {
    return `
      <div class="card">
        <div class="card-header">
          <h2><i class="fas fa-chart-line"></i> สรุปรายเดือน</h2>
          <div><input type="month" id="monthReportPicker" value="2025-02"></div>
        </div>
        <div class="card-body">
          <div class="table-wrapper">
            <table>
              <thead><tr><th>ประเภทการเคลื่อนไหว</th><th>จำนวนหน่วย</th><th>มูลค่ารวม (บาท)</th></tr></thead>
              <tbody id="summaryTbody"></tbody>
            </table>
          </div>
          <div style="margin-top:24px; background:#f0f9ff; border-radius: 24px; padding: 16px;">
            <h4><i class="fas fa-chart-simple"></i> สรุปภาพรวมเดือนนี้</h4>
            <p><strong>💰 ยอดรวมมูลค่าที่จ่าย/แจก:</strong> <span id="totalMonthValue">0</span> บาท</p>
            <p><strong>📦 จำนวนหน่วยที่เคลื่อนไหว:</strong> <span id="totalMonthUnits">0</span> ชิ้น</p>
            <p><strong>↩️ ยอดรวมมูลค่าที่คืน:</strong> <span id="totalReturnValue">0</span> บาท</p>
            <p><strong>📊 สุทธิ (จ่ายสุทธิ):</strong> <span id="netMonthValue">0</span> บาท</p>
          </div>
          <div style="margin-top:20px;"><button id="exportMonthCSV" class="btn"><i class="fas fa-download"></i> ส่งออกรายงาน (CSV)</button></div>
        </div>
      </div>
    `;
  },
  
  renderMonthlyReport() {
    let month = document.getElementById("monthReportPicker").value;
    if(!month) return;
    let [year, monthNum] = month.split("-");
    let filteredMovements = AppStorage.movements.filter(m => m.date.startsWith(`${year}-${monthNum}`));
    let filteredReturns = AppStorage.returns.filter(r => r.date.startsWith(`${year}-${monthNum}`));
    
    let summary = { staff: { qty: 0, val: 0 }, sale: { qty: 0, val: 0 }, event: { qty: 0, val: 0 } };
    filteredMovements.forEach(m => { summary[m.type].qty += m.quantity; summary[m.type].val += m.totalValue; });
    let totalReturnValue = filteredReturns.reduce((sum, r) => sum + r.valueWhenIssued, 0);
    
    let tbody = document.getElementById("summaryTbody");
    tbody.innerHTML = `
      <tr><td>👥 แจกพนักงาน</td><td>${summary.staff.qty}</td><td>${summary.staff.val.toFixed(2)}</td></tr>
      <tr><td>💰 ขายทั่วไป</td><td>${summary.sale.qty}</td><td>${summary.sale.val.toFixed(2)}</td></tr>
      <tr><td>🎉 ใช้ในงาน/งานประจำปี</td><td>${summary.event.qty}</td><td>${summary.event.val.toFixed(2)}</td></tr>`;
    
    let totalVal = summary.staff.val + summary.sale.val + summary.event.val;
    let totalUnits = summary.staff.qty + summary.sale.qty + summary.event.qty;
    document.getElementById("totalMonthValue").innerText = totalVal.toFixed(2);
    document.getElementById("totalMonthUnits").innerText = totalUnits;
    document.getElementById("totalReturnValue").innerText = totalReturnValue.toFixed(2);
    document.getElementById("netMonthValue").innerText = (totalVal - totalReturnValue).toFixed(2);
  },
  
  exportMonthCSV() {
    let month = document.getElementById("monthReportPicker").value;
    let [year, monthNum] = month.split("-");
    let filteredMovements = AppStorage.movements.filter(m => m.date.startsWith(`${year}-${monthNum}`));
    let filteredReturns = AppStorage.returns.filter(r => r.date.startsWith(`${year}-${monthNum}`));
    
    let csv = [["รายงานเดือน", month], [""], ["รายการเบิกจ่าย","","","","","",""], ["วันที่","ประเภท","Itemcode","สินค้า","จำนวน","ราคาต่อหน่วย","มูลค่า","หมายเหตุ"]];
    filteredMovements.forEach(m => { csv.push([m.date, m.type, m.itemcode, m.description, m.quantity, m.unitPrice, m.totalValue, m.note || ""]); });
    csv.push([""], ["รายการคืนสินค้า","","","","",""], ["วันที่คืน","Itemcode","สินค้า","จำนวน","มูลค่าตอนแจก","สาเหตุ"]);
    filteredReturns.forEach(r => { csv.push([r.date, r.itemcode, r.description, r.quantity, r.valueWhenIssued, r.reason]); });
    
    let content = csv.map(row => row.join(",")).join("\n");
    let blob = new Blob(["\uFEFF" + content], { type: "text/csv" });
    let a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `report_${month}.csv`; a.click();
  }
};