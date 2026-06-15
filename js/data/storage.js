// js/data/storage.js
window.AppStorage = window.AppStorage || {
  products: [],
  movements: [],
  returns: [],
  receives: [],
  
  // ========== โหลดข้อมูลจาก Firebase เป็นหลัก ==========
  async loadData() {
    try {
      const db = window.db;
      const dbRef = window.firebaseRef;
      const getData = window.firebaseGet;
      
      if (db && dbRef && getData) {
        console.log("🔄 Loading data from Firebase...");
        const snapshot = await getData(dbRef(db, 'stock-data'));
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.products = data.products || [];
          this.movements = data.movements || [];
          this.returns = data.returns || [];
          this.receives = data.receives || [];
          console.log(`✅ Loaded ${this.products.length} products from Firebase`);
          
          // บันทึก localStorage เป็นแค่ cache
          this.saveToLocalStorage();
        } else {
          console.log("⚠️ No data in Firebase, checking localStorage...");
          this.loadFromLocalStorage();
          
          if (this.products.length === 0) {
            console.log("📦 No data at all, initializing...");
            this.initProducts();
            await this.saveData();
          }
        }
      } else {
        console.log("❌ Firebase not available, using localStorage only");
        this.loadFromLocalStorage();
        
        if (this.products.length === 0) {
          this.initProducts();
        }
      }
      
      this.migrateOldMovements();
      
    } catch(error) {
      console.error("Error loading from Firebase:", error);
      this.loadFromLocalStorage();
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
  
  // ========== บันทึกข้อมูลลง Firebase ==========
  async saveData() {
    this.saveToLocalStorage();
    
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
        console.log("☁️ Data saved to Firebase");
      }
    } catch(error) {
      console.error("❌ Error saving to Firebase:", error);
    }
  },
  
  // ========== บังคับโหลดจาก Firebase (ใช้ตอนกดปุ่มรีเฟรช) ==========
  async forceReloadFromFirebase() {
    console.log("🔄 Force reloading from Firebase...");
    const db = window.db;
    const dbRef = window.firebaseRef;
    const getData = window.firebaseGet;
    
    if(db && dbRef && getData) {
      const snapshot = await getData(dbRef(db, 'stock-data'));
      if(snapshot.exists()) {
        const data = snapshot.val();
        this.products = data.products || [];
        this.movements = data.movements || [];
        this.returns = data.returns || [];
        this.receives = data.receives || [];
        this.saveToLocalStorage();
        console.log(`✅ Reloaded ${this.products.length} products from Firebase`);
        return true;
      }
    }
    return false;
  },
  
  // ========== สร้างสินค้าเริ่มต้น ==========
  initProducts() {
    console.log("📦 Creating initial products from ProductsData...");
    
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
        quantity: Math.floor(Math.random() * 60) + 8,
        reorderPoint: 10
      });
    });
    
    console.log(`✅ Created ${this.products.length} products`);
    this.saveData();
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
    
    for(let i = 0; i < this.returns.length; i++) {
      let r = this.returns[i];
      if(r.issuer === undefined) {
        r.issuer = "-";
        updated = true;
      }
    }
    
    if(updated) {
      this.saveData();
      console.log("✅ Migrated old data");
    }
  }
};