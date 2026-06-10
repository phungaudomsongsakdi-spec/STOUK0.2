const Helpers = {
  formatDate(dateStr) {
    if(!dateStr) return new Date().toISOString().slice(0,10);
    return dateStr;
  },
  
  getCurrentTimestamp() {
    return new Date().toLocaleString('th-TH');
  },
  
  updateStats() {
    const products = AppStorage.products;
    document.getElementById("totalItemsStat").innerText = products.length;
    document.getElementById("totalStockStat").innerText = products.reduce((s,p)=>s+p.quantity,0);
    document.getElementById("lowStockStat").innerText = products.filter(p=>p.quantity<=5).length;
  },
  
  updateProductSelects() {
    let select1 = document.getElementById("movementProductSelect");
    let select2 = document.getElementById("returnProductSelect");
    let options = '<option value="">--เลือกสินค้า--</option>' + 
      AppStorage.products.map(p => `<option value="${p.itemcode}" data-price="${p.price}">${p.itemcode} - ${p.description} (คงเหลือ ${p.quantity})</option>`).join("");
    if(select1) select1.innerHTML = options;
    if(select2) select2.innerHTML = options;
  }
};