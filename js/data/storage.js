// js/data/storage.js
window.AppStorage = window.AppStorage || {
  products: [],
  movements: [],
  returns: [],
  receives: [],
  
  // ========== โหลดข้อมูลหลักจาก Firebase ==========
  async loadData() {
    try {
      const db = window.db;
      const dbRef = window.firebaseRef;
      const getData = window.firebaseGet;
      
      if (db && dbRef && getData) {
        console.log("🔄 Loading data from Firebase...");
        const snapshot = await getData(dbRef(db, 'stock-data'));
        
        if (snapshot.exists()) {
          // ✅ มีข้อมูลใน Firebase แล้ว → โหลดมาใช้
          const data = snapshot.val();
          this.products = data.products || [];
          this.movements = data.movements || [];
          this.returns = data.returns || [];
          this.receives = data.receives || [];
          console.log(`✅ Loaded ${this.products.length} products from Firebase`);
          
          // อัปเดต localStorage เป็น cache
          this.saveToLocalStorage();
        } else {
          // ❌ ไม่มีข้อมูลใน Firebase → สร้างจาก products.js แล้วอัปโหลด
          console.log("⚠️ No data in Firebase, creating initial data from products.js...");
          this.initProducts(); // สร้างสินค้าจาก ProductsData
          await this.saveData(); // อัปโหลดไป Firebase
          console.log(`✅ Created and uploaded ${this.products.length} products to Firebase`);
        }
      } else {
        // Firebase ไม่พร้อม → ใช้ localStorage แทน
        console.log("❌ Firebase not available, using localStorage");
        this.loadFromLocalStorage();
        
        // ถ้า localStorage ก็ไม่มี → สร้างใหม่
        if (this.products.length === 0) {
          this.initProducts();
          this.saveToLocalStorage();
        }
      }
      
      // อัปเดตข้อมูลเก่าให้มี field ใหม่
      this.migrateOldMovements();
      
    } catch(error) {
      console.error("Error loading from Firebase:", error);
      this.loadFromLocalStorage();
      
      if (this.products.length === 0) {
        this.initProducts();
      }
    }
  },
  
  // ========== โหลดจาก localStorage (สำรอง) ==========
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
      
      console.log(`📦 Loaded from localStorage: ${this.products.length} products`);
    } catch(error) {
      console.error("Error loading from localStorage:", error);
    }
  },
  
  // ========== บันทึก localStorage ==========
  saveToLocalStorage() {
    try {
      localStorage.setItem("corp_stock_products_v2", JSON.stringify(this.products));
      localStorage.setItem("corp_stock_movements_v2", JSON.stringify(this.movements));
      localStorage.setItem("corp_stock_returns_v2", JSON.stringify(this.returns));
      localStorage.setItem("corp_stock_receives_v2", JSON.stringify(this.receives));
      console.log("💾 Saved to localStorage");
    } catch(error) {
      console.error("Error saving to localStorage:", error);
    }
  },
  
  // ========== บันทึกข้อมูลลง Firebase + localStorage ==========
  async saveData() {
    // บันทึก localStorage เสมอ
    this.saveToLocalStorage();
    
    // บันทึก Firebase
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
        console.log("☁️ Data saved to Firebase successfully");
      }
    } catch(error) {
      console.error("❌ Error saving to Firebase:", error);
    }
  },
  
  // ========== สร้างสินค้าจาก ProductsData (products.js) ==========
  initProducts() {
    console.log("📦 Creating initial products from ProductsData...");
    
    // รวมสินค้าทั้งหมด
    const allProducts = [...ProductsData.rawProducts, ...ProductsData.extraProducts];
    
    this.products = [];
    allProducts.forEach(p => {
      let price = (p[4] !== "" && !isNaN(parseFloat(p[4]))) ? parseFloat(p[4]) : 0;
      this.products.push({
        id: p[1],
        itemcode: p[1],
        description: p[2],
        unit: p[3],
        price: price,
        quantity: Math.floor(Math.random() * 60) + 8, // สุ่มสต็อกเริ่มต้น 8-68 ชิ้น
        reorderPoint: 10
      });
    });
    
    console.log(`✅ Created ${this.products.length} products from products.js`);
  },
  
  // ========== อัปเดตข้อมูลเก่า ==========
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
  
  // ========== ฟังก์ชันช่วยเหลือ ==========
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