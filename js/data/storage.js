// js/data/storage.js
window.AppStorage = window.AppStorage || {
  products: [],
  movements: [],
  returns: [],
  receives: [],
  
  // โหลดข้อมูลจาก Firebase และ localStorage
  async loadData() {
    try {
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
          console.log(`Loaded from Firebase: ${this.products.length} products`);
        } else {
          console.log("No data in Firebase, loading from localStorage...");
          this.loadFromLocalStorage();
        }
      } else {
        console.log("Firebase not available, loading from localStorage...");
        this.loadFromLocalStorage();
      }
      
      if (this.products.length === 0) {
        console.log("No data found, initializing with sample data...");
        this.initProducts();
      } else {
        this.migrateOldMovements();
      }
      
      this.saveToLocalStorage();
      
    } catch(error) {
      console.error("Error loading from Firebase:", error);
      this.loadFromLocalStorage();
      
      if (this.products.length === 0) {
        this.initProducts();
      } else {
        this.migrateOldMovements();
      }
    }
  },
  
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
      
      console.log(`Loaded from localStorage: ${this.products.length} products`);
    } catch(error) {
      console.error("Error loading from localStorage:", error);
    }
  },
  
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
        console.log("✅ Data saved to Firebase successfully");
      }
    } catch(error) {
      console.error("❌ Error saving to Firebase:", error);
    }
  },
  
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