// js/utils/helpers.js
const Helpers = {
  formatDate(dateStr) {
    if(!dateStr) {
      const now = new Date();
      return now.toISOString().slice(0,10);
    }
    return dateStr;
  },
  
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
    if(timestamp.includes(' ')) {
      let parts = timestamp.split(' ');
      if(parts.length >= 2) {
        return parts[0] + ' ' + parts[1];
      }
    }
    return timestamp;
  },
  
  getCurrentTimestamp() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear() + 543;
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  },
  
  updateStats() {
    const products = AppStorage.products;
    
    if(!products || products.length === 0) {
      console.log("No products to display stats");
      return;
    }
    
    // ✅ จำนวนสินค้าทั้งหมด
    const totalItems = products.length;
    document.getElementById("totalItemsStat").innerText = totalItems;
    
    // ✅ จำนวนสินค้าที่สต็อกปกติ (quantity > reorderPoint)
    const normalStockCount = products.filter(p => {
      const reorderPoint = (p.reorderPoint !== undefined && p.reorderPoint !== null) ? p.reorderPoint : 10;
      return p.quantity > reorderPoint;
    }).length;
    document.getElementById("normalStockStat").innerText = normalStockCount;
    
    // ✅ จำนวนสินค้าที่ควรสั่งซื้อ (quantity <= reorderPoint)
    const lowStockCount = products.filter(p => {
      const reorderPoint = (p.reorderPoint !== undefined && p.reorderPoint !== null) ? p.reorderPoint : 10;
      return p.quantity <= reorderPoint;
    }).length;
    document.getElementById("lowStockStat").innerText = lowStockCount;
    
    console.log(`📊 Stats: Total=${totalItems}, Normal=${normalStockCount}, Low=${lowStockCount}`);
  },
  
  updateProductSelects() {
    let select1 = document.getElementById("movementProductSelect");
    let select2 = document.getElementById("returnProductSelect");
    let options = '<option value="">--เลือกสินค้า--</option>' + 
      AppStorage.products.map(p => `<option value="${p.itemcode}" data-price="${p.price}">${p.itemcode} - ${p.description} (คงเหลือ ${p.quantity})</option>`).join("");
    if(select1) select1.innerHTML = options;
    if(select2) select2.innerHTML = options;
  },
  
  // ฟังก์ชันช่วยเหลือเพิ่มเติม
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  
  calculateTotalValue(products) {
    return products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  }
};