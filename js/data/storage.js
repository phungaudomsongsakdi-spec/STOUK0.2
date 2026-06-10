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
};// js/data/storage.js
let AppStorage = {
  products: [],
  movements: [],
  returns: [],
  receives: [],
  
  // โหลดข้อมูลจาก Firebase และ localStorage
  async loadData() {
    try {
      // ตรวจสอบว่า Firebase พร้อมใช้งานหรือไม่
      const db = window.db;
      const dbRef = window.firebaseRef;
      const getData = window.firebaseGet;
      
      if (db && dbRef && getData) {
        console.log("Loading data from Firebase...");
        const snapshot = await getData(dbRef(db, 'stock-data'));
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.products = data.products || [];
          this.movements = data.movements || [];
          this.returns = data.returns || [];
          this.receives = data.receives || [];
          console.log(`Loaded from Firebase: ${this.products.length} products, ${this.movements.length} movements`);
        } else {
          console.log("No data in Firebase, loading from localStorage...");
          this.loadFromLocalStorage();
        }
      } else {
        console.log("Firebase not available, loading from localStorage...");
        this.loadFromLocalStorage();
      }
      
      // ถ้ายังไม่มีข้อมูลเลย ให้สร้างข้อมูลเริ่มต้น
      if (this.products.length === 0) {
        console.log("No data found, initializing with sample data...");
        this.initProducts();
      } else {
        this.migrateOldMovements();
      }
      
      // บันทึกข้อมูลลง localStorage เพื่อใช้เป็น cache
      this.saveToLocalStorage();
      
    } catch(error) {
      console.error("Error loading from Firebase:", error);
      console.log("Falling back to localStorage...");
      this.loadFromLocalStorage();
      
      if (this.products.length === 0) {
        this.initProducts();
      } else {
        this.migrateOldMovements();
      }
    }
  },
  
  // โหลดข้อมูลจาก localStorage
  loadFromLocalStorage() {
    try {
      let storedProd = localStorage.getItem("corp_stock_products_v2");
      if(storedProd) this.products = JSON.parse(storedProd);
      
      let storedMov = localStorage.getItem("corp_stock_movements_v2");
      if(storedMov) this.movements = JSON.parse(storedMov);
      
      let storedRet = localStorage.getItem("corp_stock_returns_v2");
      if(storedRet) this.returns = JSON.parse(storedRet);
      
      let storedRec = localStorage.getItem("corp_stock_receives_v2");
      if(storedRec) this.receives = JSON.parse(storedRec);
      
      console.log(`Loaded from localStorage: ${this.products.length} products, ${this.movements.length} movements`);
    } catch(error) {
      console.error("Error loading from localStorage:", error);
    }
  },
  
  // บันทึกข้อมูลลง localStorage
  saveToLocalStorage() {
    try {
      localStorage.setItem("corp_stock_products_v2", JSON.stringify(this.products));
      localStorage.setItem("corp_stock_movements_v2", JSON.stringify(this.movements));
      localStorage.setItem("corp_stock_returns_v2", JSON.stringify(this.returns));
      localStorage.setItem("corp_stock_receives_v2", JSON.stringify(this.receives));
    } catch(error) {
      console.error("Error saving to localStorage:", error);
    }
  },
  
  // บันทึกข้อมูลลง Firebase และ localStorage
  async saveData() {
    // บันทึกลง localStorage ก่อนเสมอ
    this.saveToLocalStorage();
    
    // บันทึกลง Firebase (แบบไม่ต้องรอ)
    try {
      const db = window.db;
      const setData = window.firebaseSet;
      const dbRef = window.firebaseRef;
      
      if (db && setData && dbRef) {
        await setData(dbRef(db, 'stock-data'), {
          products: this.products,
          movements: this.movements,
          returns: this.returns,
          receives: this.receives,
          lastUpdated: new Date().toISOString()
        });
        console.log("✅ Data saved to Firebase successfully");
      } else {
        console.log("Firebase not available, data saved to localStorage only");
      }
    } catch(error) {
      console.error("❌ Error saving to Firebase:", error);
      // ไม่ต้องแจ้งเตือนผู้ใช้ เพราะข้อมูลบันทึกใน localStorage แล้ว
    }
  },
  
  // สร้างข้อมูลสินค้าเริ่มต้น
  initProducts() {
    console.log("Initializing products...");
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
    console.log(`✅ Initialized ${this.products.length} products`);
  },
  
  // อัปเดตข้อมูลเก่าให้มี field ใหม่
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
    
    // อัปเดต returns
    for(let i = 0; i < this.returns.length; i++) {
      let r = this.returns[i];
      if(r.issuer === undefined) {
        r.issuer = "-";
        updated = true;
      }
    }
    
    if(updated) {
      this.saveData();
      console.log("✅ Migrated old data (added issuer, department, typeLabel)");
    }
  },
  
  // ฟังก์ชันเพิ่มเติมสำหรับ debugging
  async syncWithFirebase() {
    console.log("Manual syncing with Firebase...");
    await this.saveData();
    console.log("Sync completed");
  },
  
  clearAllData() {
    if(confirm("⚠️ คุณต้องการลบข้อมูลทั้งหมดใช่หรือไม่? การกระทำนี้ไม่สามารถกู้คืนได้")) {
      this.products = [];
      this.movements = [];
      this.returns = [];
      this.receives = [];
      this.saveData();
      location.reload();
    }
  },
  
  getStats() {
    return {
      totalProducts: this.products.length,
      totalStock: this.products.reduce((sum, p) => sum + p.quantity, 0),
      lowStock: this.products.filter(p => p.quantity <= (p.reorderPoint || 10)).length,
      totalMovements: this.movements.length,
      totalReturns: this.returns.length,
      totalReceives: this.receives.length
    };
  }
};