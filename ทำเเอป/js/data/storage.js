let AppStorage = {
  products: [],
  movements: [],
  returns: [],
  receives: [],  // เพิ่ม array สำหรับรับสินค้าเข้า
  
  loadData() {
    let storedProd = localStorage.getItem("corp_stock_products_v2");
    if(storedProd) this.products = JSON.parse(storedProd);
    let storedMov = localStorage.getItem("corp_stock_movements_v2");
    if(storedMov) this.movements = JSON.parse(storedMov);
    let storedRet = localStorage.getItem("corp_stock_returns_v2");
    if(storedRet) this.returns = JSON.parse(storedRet);
    let storedRec = localStorage.getItem("corp_stock_receives_v2");
    if(storedRec) this.receives = JSON.parse(storedRec);
    
    // อัปเดตข้อมูลเก่าให้มี field ใหม่
    this.migrateOldMovements();
  },
  
  saveData() {
    localStorage.setItem("corp_stock_products_v2", JSON.stringify(this.products));
    localStorage.setItem("corp_stock_movements_v2", JSON.stringify(this.movements));
    localStorage.setItem("corp_stock_returns_v2", JSON.stringify(this.returns));
    localStorage.setItem("corp_stock_receives_v2", JSON.stringify(this.receives));
  },
  
  initProducts() {
    const allProducts = [...ProductsData.rawProducts, ...ProductsData.extraProducts];
    allProducts.forEach(p => {
      let price = (p[4] !== "" && !isNaN(parseFloat(p[4]))) ? parseFloat(p[4]) : 0;
      this.products.push({
        id: p[1],
        itemcode: p[1],
        description: p[2],
        unit: p[3],
        price: price,
        quantity: Math.floor(Math.random() * 60) + 8,
        reorderPoint: 10
      });
    });
    this.saveData();
  },
  
  // ฟังก์ชันสำหรับอัปเดตข้อมูลเก่า (movements เดิม) ให้มี field ใหม่
  migrateOldMovements() {
    let updated = false;
    
    const typeLabels = {
      staff: "👥 แจกพนักงาน",
      sale: "💰 ขาย",
      event: "🎉 ใช้ในงาน",
      anniversary: "🎉 ชุดครบปี",
      probation: "📋 ชุดผ่านทดลองงาน",
      general: "👥 เบิกจ่ายพนักงานทั่วไป",
      newhire: "🆕 พนักงานใหม่"
    };
    
    // อัปเดต movements
    for(let i = 0; i < this.movements.length; i++) {
      let m = this.movements[i];
      
      if(!m.typeLabel && typeLabels[m.type]) {
        m.typeLabel = typeLabels[m.type];
        updated = true;
      }
      
      if(m.issuer === undefined) {
        m.issuer = "-";
        updated = true;
      }
      
      if(m.department === undefined) {
        m.department = "-";
        updated = true;
      }
      
      if(m.type === "staff" && !m.typeLabel) {
        m.type = "general";
        m.typeLabel = "👥 เบิกจ่ายพนักงานทั่วไป";
        updated = true;
      }
      if(m.type === "sale" && !m.typeLabel) {
        m.type = "general";
        m.typeLabel = "👥 เบิกจ่ายพนักงานทั่วไป";
        updated = true;
      }
      if(m.type === "event" && !m.typeLabel) {
        m.type = "anniversary";
        m.typeLabel = "🎉 ชุดครบปี";
        updated = true;
      }
    }
    
    // อัปเดต returns (เพิ่ม issuer)
    for(let i = 0; i < this.returns.length; i++) {
      let r = this.returns[i];
      if(r.issuer === undefined) {
        r.issuer = "-";
        updated = true;
      }
    }
    
    if(updated) {
      this.saveData();
      console.log("✅ อัปเดตข้อมูลเก่าเรียบร้อยแล้ว (เพิ่ม issuer, department, typeLabel)");
    }
  }
};