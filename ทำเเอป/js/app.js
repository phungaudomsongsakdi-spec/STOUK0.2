let App = {
  currentTab: "stock",
  
  init() {
    AppStorage.loadData();
    if(AppStorage.products.length === 0) {
      AppStorage.initProducts();
    }
    
    this.loadTabContent();
    this.bindEvents();
    this.onTabChange();
  },
  
  loadTabContent() {
    document.getElementById("stockPane").innerHTML = StockComponent.render();
    document.getElementById("movementPane").innerHTML = MovementComponent.render();
    document.getElementById("returnPane").innerHTML = ReturnComponent.render();
    document.getElementById("receivePane").innerHTML = ReceiveComponent.render();
    document.getElementById("reportsPane").innerHTML = ReportComponent.render();
  },
  
  bindEvents() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active-pane"));
        document.getElementById(btn.dataset.tab + "Pane").classList.add("active-pane");
        this.currentTab = btn.dataset.tab;
        this.onTabChange();
      });
    });
  },
  
  onTabChange() {
    Helpers.updateStats();
    Helpers.updateProductSelects();
    
    if(StockComponent.updateReorderCount) {
      StockComponent.updateReorderCount();
    }
    
    switch(this.currentTab) {
      case "stock":
        StockComponent.renderStockTable("");
        let stockSearch = document.getElementById("stockSearch");
        if(stockSearch) {
          let newStockSearch = stockSearch.cloneNode(true);
          stockSearch.parentNode.replaceChild(newStockSearch, stockSearch);
          newStockSearch.addEventListener("input", e => StockComponent.renderStockTable(e.target.value));
        }
        break;
        
      case "movement":
        MovementComponent.renderMovementsHistory("", "", "", "", "");
        
        let productInput = document.getElementById("movementProductInput");
        let dropdownList = document.getElementById("movementDropdownList");
        
        if(productInput) {
          let newProductInput = productInput.cloneNode(true);
          productInput.parentNode.replaceChild(newProductInput, productInput);
          newProductInput.addEventListener("input", (e) => {
            MovementComponent.updateDropdownList(e.target.value);
          });
        }
        
        document.addEventListener("click", (e) => {
          if(dropdownList && productInput && !dropdownList.contains(e.target) && e.target !== productInput) {
            dropdownList.style.display = "none";
          }
        });
        
        let deptInput = document.getElementById("movementDeptInput");
        let deptDropdownList = document.getElementById("movementDeptDropdownList");
        
        if(deptInput) {
          let newDeptInput = deptInput.cloneNode(true);
          deptInput.parentNode.replaceChild(newDeptInput, deptInput);
          newDeptInput.addEventListener("input", (e) => {
            MovementComponent.updateDeptDropdownList(e.target.value);
          });
        }
        
        document.addEventListener("click", (e) => {
          if(deptDropdownList && deptInput && !deptDropdownList.contains(e.target) && e.target !== deptInput) {
            deptDropdownList.style.display = "none";
          }
        });
        
        let recordBtn = document.getElementById("recordMovementBtn");
        if(recordBtn) {
          let newRecordBtn = recordBtn.cloneNode(true);
          recordBtn.parentNode.replaceChild(newRecordBtn, recordBtn);
          newRecordBtn.addEventListener("click", () => MovementComponent.recordMovement());
        }
        
        let movementDate = document.getElementById("movementDate");
        if(movementDate) movementDate.value = Helpers.formatDate();
        
        let historySearch = document.getElementById("historySearch");
        if(historySearch) {
          let newHistorySearch = historySearch.cloneNode(true);
          historySearch.parentNode.replaceChild(newHistorySearch, historySearch);
          newHistorySearch.addEventListener("input", () => {
            MovementComponent.renderMovementsHistory(
              newHistorySearch.value,
              document.getElementById("historyTypeFilter")?.value || "",
              document.getElementById("historyDeptInput")?.value || "",
              document.getElementById("historyDateFrom")?.value || "",
              document.getElementById("historyDateTo")?.value || ""
            );
          });
        }
        
        let historyTypeFilter = document.getElementById("historyTypeFilter");
        if(historyTypeFilter) {
          let newHistoryTypeFilter = historyTypeFilter.cloneNode(true);
          historyTypeFilter.parentNode.replaceChild(newHistoryTypeFilter, historyTypeFilter);
          newHistoryTypeFilter.addEventListener("change", () => {
            MovementComponent.renderMovementsHistory(
              document.getElementById("historySearch")?.value || "",
              newHistoryTypeFilter.value,
              document.getElementById("historyDeptInput")?.value || "",
              document.getElementById("historyDateFrom")?.value || "",
              document.getElementById("historyDateTo")?.value || ""
            );
          });
        }
        
        let historyDeptInput = document.getElementById("historyDeptInput");
        if(historyDeptInput) {
          let newHistoryDeptInput = historyDeptInput.cloneNode(true);
          historyDeptInput.parentNode.replaceChild(newHistoryDeptInput, historyDeptInput);
          newHistoryDeptInput.addEventListener("input", () => {
            MovementComponent.renderMovementsHistory(
              document.getElementById("historySearch")?.value || "",
              document.getElementById("historyTypeFilter")?.value || "",
              newHistoryDeptInput.value,
              document.getElementById("historyDateFrom")?.value || "",
              document.getElementById("historyDateTo")?.value || ""
            );
          });
        }
        
        let historyDateFrom = document.getElementById("historyDateFrom");
        if(historyDateFrom) {
          let newHistoryDateFrom = historyDateFrom.cloneNode(true);
          historyDateFrom.parentNode.replaceChild(newHistoryDateFrom, historyDateFrom);
          newHistoryDateFrom.addEventListener("change", () => {
            MovementComponent.renderMovementsHistory(
              document.getElementById("historySearch")?.value || "",
              document.getElementById("historyTypeFilter")?.value || "",
              document.getElementById("historyDeptInput")?.value || "",
              newHistoryDateFrom.value,
              document.getElementById("historyDateTo")?.value || ""
            );
          });
        }
        
        let historyDateTo = document.getElementById("historyDateTo");
        if(historyDateTo) {
          let newHistoryDateTo = historyDateTo.cloneNode(true);
          historyDateTo.parentNode.replaceChild(newHistoryDateTo, historyDateTo);
          newHistoryDateTo.addEventListener("change", () => {
            MovementComponent.renderMovementsHistory(
              document.getElementById("historySearch")?.value || "",
              document.getElementById("historyTypeFilter")?.value || "",
              document.getElementById("historyDeptInput")?.value || "",
              document.getElementById("historyDateFrom")?.value || "",
              newHistoryDateTo.value
            );
          });
        }
        
        let resetHistoryBtn = document.getElementById("resetHistoryBtn");
        if(resetHistoryBtn) {
          let newResetHistoryBtn = resetHistoryBtn.cloneNode(true);
          resetHistoryBtn.parentNode.replaceChild(newResetHistoryBtn, resetHistoryBtn);
          newResetHistoryBtn.addEventListener("click", () => {
            let searchInput = document.getElementById("historySearch");
            let typeSelect = document.getElementById("historyTypeFilter");
            let deptSearch = document.getElementById("historyDeptInput");
            let dateFrom = document.getElementById("historyDateFrom");
            let dateTo = document.getElementById("historyDateTo");
            
            if(searchInput) searchInput.value = "";
            if(typeSelect) typeSelect.value = "";
            if(deptSearch) deptSearch.value = "";
            if(dateFrom) dateFrom.value = "";
            if(dateTo) dateTo.value = "";
            
            MovementComponent.renderMovementsHistory("", "", "", "", "");
          });
        }
        
        let exportHistoryExcelBtn = document.getElementById("exportHistoryExcelBtn");
        if(exportHistoryExcelBtn) {
          let newExportBtn = exportHistoryExcelBtn.cloneNode(true);
          exportHistoryExcelBtn.parentNode.replaceChild(newExportBtn, exportHistoryExcelBtn);
          newExportBtn.addEventListener("click", () => {
            console.log("Click Export Movement");
            MovementComponent.exportToExcel();
          });
        }
        break;
        
      case "return":
        ReturnComponent.renderReturnHistory("", "");
        
        let radioButtons = document.querySelectorAll('input[name="exchangeMode"]');
        radioButtons.forEach(radio => {
          let newRadio = radio.cloneNode(true);
          radio.parentNode.replaceChild(newRadio, radio);
          newRadio.addEventListener("change", (e) => {
            ReturnComponent.toggleMode(e.target.value);
          });
        });
        ReturnComponent.toggleMode("return");
        
        let returnDeptInput = document.getElementById("returnDeptInput");
        let returnDeptDropdown = document.getElementById("returnDeptDropdownList");
        if(returnDeptInput) {
          let newReturnDeptInput = returnDeptInput.cloneNode(true);
          returnDeptInput.parentNode.replaceChild(newReturnDeptInput, returnDeptInput);
          newReturnDeptInput.addEventListener("input", (e) => {
            ReturnComponent.updateDeptDropdownList(e.target.value);
          });
        }
        
        document.addEventListener("click", (e) => {
          if(returnDeptDropdown && returnDeptInput && !returnDeptDropdown.contains(e.target) && e.target !== returnDeptInput) {
            returnDeptDropdown.style.display = "none";
          }
        });
        
        let exchangeDeptInput = document.getElementById("exchangeDeptInput");
        let exchangeDeptDropdown = document.getElementById("exchangeDeptDropdownList");
        if(exchangeDeptInput) {
          let newExchangeDeptInput = exchangeDeptInput.cloneNode(true);
          exchangeDeptInput.parentNode.replaceChild(newExchangeDeptInput, exchangeDeptInput);
          newExchangeDeptInput.addEventListener("input", (e) => {
            ReturnComponent.updateExchangeDeptDropdownList(e.target.value);
          });
        }
        
        document.addEventListener("click", (e) => {
          if(exchangeDeptDropdown && exchangeDeptInput && !exchangeDeptDropdown.contains(e.target) && e.target !== exchangeDeptInput) {
            exchangeDeptDropdown.style.display = "none";
          }
        });
        
        let returnProductInput = document.getElementById("returnProductInput");
        let returnDropdownList = document.getElementById("returnDropdownList");
        if(returnProductInput) {
          let newReturnProductInput = returnProductInput.cloneNode(true);
          returnProductInput.parentNode.replaceChild(newReturnProductInput, returnProductInput);
          newReturnProductInput.addEventListener("input", (e) => {
            ReturnComponent.updateReturnDropdownList(e.target.value);
          });
        }
        
        document.addEventListener("click", (e) => {
          if(returnDropdownList && returnProductInput && !returnDropdownList.contains(e.target) && e.target !== returnProductInput) {
            returnDropdownList.style.display = "none";
          }
        });
        
        let exchangeOldInput = document.getElementById("exchangeOldProductInput");
        let exchangeOldDropdown = document.getElementById("exchangeOldDropdownList");
        if(exchangeOldInput) {
          let newExchangeOldInput = exchangeOldInput.cloneNode(true);
          exchangeOldInput.parentNode.replaceChild(newExchangeOldInput, exchangeOldInput);
          newExchangeOldInput.addEventListener("input", (e) => {
            ReturnComponent.updateOldDropdownList(e.target.value);
          });
        }
        
        document.addEventListener("click", (e) => {
          if(exchangeOldDropdown && exchangeOldInput && !exchangeOldDropdown.contains(e.target) && e.target !== exchangeOldInput) {
            exchangeOldDropdown.style.display = "none";
          }
        });
        
        let exchangeNewInput = document.getElementById("exchangeNewProductInput");
        let exchangeNewDropdown = document.getElementById("exchangeNewDropdownList");
        if(exchangeNewInput) {
          let newExchangeNewInput = exchangeNewInput.cloneNode(true);
          exchangeNewInput.parentNode.replaceChild(newExchangeNewInput, exchangeNewInput);
          newExchangeNewInput.addEventListener("input", (e) => {
            ReturnComponent.updateNewDropdownList(e.target.value);
          });
        }
        
        document.addEventListener("click", (e) => {
          if(exchangeNewDropdown && exchangeNewInput && !exchangeNewDropdown.contains(e.target) && e.target !== exchangeNewInput) {
            exchangeNewDropdown.style.display = "none";
          }
        });
        
        let exchangeOldQty = document.getElementById("exchangeOldQty");
        let exchangeNewQty = document.getElementById("exchangeNewQty");
        if(exchangeOldQty) {
          let newExchangeOldQty = exchangeOldQty.cloneNode(true);
          exchangeOldQty.parentNode.replaceChild(newExchangeOldQty, exchangeOldQty);
          newExchangeOldQty.addEventListener("input", () => ReturnComponent.updateExchangeSummary());
        }
        if(exchangeNewQty) {
          let newExchangeNewQty = exchangeNewQty.cloneNode(true);
          exchangeNewQty.parentNode.replaceChild(newExchangeNewQty, exchangeNewQty);
          newExchangeNewQty.addEventListener("input", () => ReturnComponent.updateExchangeSummary());
        }
        
        let returnDate = document.getElementById("returnDate");
        if(returnDate) returnDate.value = Helpers.formatDate();
        
        let exchangeDate = document.getElementById("exchangeDate");
        if(exchangeDate) exchangeDate.value = Helpers.formatDate();
        
        let recordReturnBtn = document.getElementById("recordReturnBtn");
        if(recordReturnBtn) {
          let newRecordReturnBtn = recordReturnBtn.cloneNode(true);
          recordReturnBtn.parentNode.replaceChild(newRecordReturnBtn, recordReturnBtn);
          newRecordReturnBtn.addEventListener("click", () => ReturnComponent.recordReturn());
        }
        
        let recordExchangeBtn = document.getElementById("recordExchangeBtn");
        if(recordExchangeBtn) {
          let newRecordExchangeBtn = recordExchangeBtn.cloneNode(true);
          recordExchangeBtn.parentNode.replaceChild(newRecordExchangeBtn, recordExchangeBtn);
          newRecordExchangeBtn.addEventListener("click", () => ReturnComponent.recordReturn());
        }
        
        let returnHistorySearch = document.getElementById("returnHistorySearch");
        if(returnHistorySearch) {
          let newReturnHistorySearch = returnHistorySearch.cloneNode(true);
          returnHistorySearch.parentNode.replaceChild(newReturnHistorySearch, returnHistorySearch);
          newReturnHistorySearch.addEventListener("input", (e) => {
            ReturnComponent.renderReturnHistory(
              e.target.value, 
              document.getElementById("historyExchangeTypeFilter")?.value || ""
            );
          });
        }
        
        let historyExchangeTypeFilter = document.getElementById("historyExchangeTypeFilter");
        if(historyExchangeTypeFilter) {
          let newHistoryExchangeTypeFilter = historyExchangeTypeFilter.cloneNode(true);
          historyExchangeTypeFilter.parentNode.replaceChild(newHistoryExchangeTypeFilter, historyExchangeTypeFilter);
          newHistoryExchangeTypeFilter.addEventListener("change", () => {
            ReturnComponent.renderReturnHistory(
              document.getElementById("returnHistorySearch")?.value || "", 
              newHistoryExchangeTypeFilter.value
            );
          });
        }
        
        let resetReturnHistoryBtn = document.getElementById("resetReturnHistoryBtn");
        if(resetReturnHistoryBtn) {
          let newResetReturnHistoryBtn = resetReturnHistoryBtn.cloneNode(true);
          resetReturnHistoryBtn.parentNode.replaceChild(newResetReturnHistoryBtn, resetReturnHistoryBtn);
          newResetReturnHistoryBtn.addEventListener("click", () => {
            let returnSearch = document.getElementById("returnHistorySearch");
            let typeFilter = document.getElementById("historyExchangeTypeFilter");
            if(returnSearch) returnSearch.value = "";
            if(typeFilter) typeFilter.value = "";
            ReturnComponent.renderReturnHistory("", "");
          });
        }
        
        let exportReturnHistoryExcelBtn = document.getElementById("exportReturnHistoryExcelBtn");
        if(exportReturnHistoryExcelBtn) {
          let newExportBtn = exportReturnHistoryExcelBtn.cloneNode(true);
          exportReturnHistoryExcelBtn.parentNode.replaceChild(newExportBtn, exportReturnHistoryExcelBtn);
          newExportBtn.addEventListener("click", () => {
            console.log("Click Export Return");
            ReturnComponent.exportToExcel();
          });
        }
        break;
        
      case "receive":
        ReceiveComponent.renderReceiveHistory("", "", "");
        
        let receiveProductInput = document.getElementById("receiveProductInput");
        let receiveDropdownList = document.getElementById("receiveDropdownList");
        if(receiveProductInput) {
          let newReceiveProductInput = receiveProductInput.cloneNode(true);
          receiveProductInput.parentNode.replaceChild(newReceiveProductInput, receiveProductInput);
          newReceiveProductInput.addEventListener("input", (e) => {
            ReceiveComponent.updateReceiveDropdownList(e.target.value);
          });
        }
        
        document.addEventListener("click", (e) => {
          if(receiveDropdownList && receiveProductInput && !receiveDropdownList.contains(e.target) && e.target !== receiveProductInput) {
            receiveDropdownList.style.display = "none";
          }
        });
        
        // ========== จัดการ dropdown ผู้จัดส่ง (อื่นๆ) ==========
        let supplierSelect = document.getElementById("receiveSupplier");
        let supplierOther = document.getElementById("receiveSupplierOther");
        if(supplierSelect) {
          let newSupplierSelect = supplierSelect.cloneNode(true);
          supplierSelect.parentNode.replaceChild(newSupplierSelect, supplierSelect);
          newSupplierSelect.addEventListener("change", (e) => {
            if(e.target.value === "อื่นๆ") {
              supplierOther.style.display = "block";
              supplierOther.focus();
            } else {
              supplierOther.style.display = "none";
              supplierOther.value = "";
            }
          });
        }
        
        let receiveDate = document.getElementById("receiveDate");
        if(receiveDate) receiveDate.value = Helpers.formatDate();
        
        let recordReceiveBtn = document.getElementById("recordReceiveBtn");
        if(recordReceiveBtn) {
          let newRecordReceiveBtn = recordReceiveBtn.cloneNode(true);
          recordReceiveBtn.parentNode.replaceChild(newRecordReceiveBtn, recordReceiveBtn);
          newRecordReceiveBtn.addEventListener("click", () => ReceiveComponent.recordReceive());
        }
        
        let receiveHistorySearch = document.getElementById("receiveHistorySearch");
        if(receiveHistorySearch) {
          let newReceiveHistorySearch = receiveHistorySearch.cloneNode(true);
          receiveHistorySearch.parentNode.replaceChild(newReceiveHistorySearch, receiveHistorySearch);
          newReceiveHistorySearch.addEventListener("input", (e) => {
            ReceiveComponent.renderReceiveHistory(
              e.target.value,
              document.getElementById("receiveHistoryDateFrom")?.value || "",
              document.getElementById("receiveHistoryDateTo")?.value || ""
            );
          });
        }
        
        let receiveHistoryDateFrom = document.getElementById("receiveHistoryDateFrom");
        if(receiveHistoryDateFrom) {
          let newReceiveHistoryDateFrom = receiveHistoryDateFrom.cloneNode(true);
          receiveHistoryDateFrom.parentNode.replaceChild(newReceiveHistoryDateFrom, receiveHistoryDateFrom);
          newReceiveHistoryDateFrom.addEventListener("change", () => {
            ReceiveComponent.renderReceiveHistory(
              document.getElementById("receiveHistorySearch")?.value || "",
              newReceiveHistoryDateFrom.value,
              document.getElementById("receiveHistoryDateTo")?.value || ""
            );
          });
        }
        
        let receiveHistoryDateTo = document.getElementById("receiveHistoryDateTo");
        if(receiveHistoryDateTo) {
          let newReceiveHistoryDateTo = receiveHistoryDateTo.cloneNode(true);
          receiveHistoryDateTo.parentNode.replaceChild(newReceiveHistoryDateTo, receiveHistoryDateTo);
          newReceiveHistoryDateTo.addEventListener("change", () => {
            ReceiveComponent.renderReceiveHistory(
              document.getElementById("receiveHistorySearch")?.value || "",
              document.getElementById("receiveHistoryDateFrom")?.value || "",
              newReceiveHistoryDateTo.value
            );
          });
        }
        
        let resetReceiveHistoryBtn = document.getElementById("resetReceiveHistoryBtn");
        if(resetReceiveHistoryBtn) {
          let newResetReceiveHistoryBtn = resetReceiveHistoryBtn.cloneNode(true);
          resetReceiveHistoryBtn.parentNode.replaceChild(newResetReceiveHistoryBtn, resetReceiveHistoryBtn);
          newResetReceiveHistoryBtn.addEventListener("click", () => {
            let receiveSearch = document.getElementById("receiveHistorySearch");
            let dateFrom = document.getElementById("receiveHistoryDateFrom");
            let dateTo = document.getElementById("receiveHistoryDateTo");
            if(receiveSearch) receiveSearch.value = "";
            if(dateFrom) dateFrom.value = "";
            if(dateTo) dateTo.value = "";
            ReceiveComponent.renderReceiveHistory("", "", "");
          });
        }
        
        let exportReceiveHistoryExcelBtn = document.getElementById("exportReceiveHistoryExcelBtn");
        if(exportReceiveHistoryExcelBtn) {
          let newExportBtn = exportReceiveHistoryExcelBtn.cloneNode(true);
          exportReceiveHistoryExcelBtn.parentNode.replaceChild(newExportBtn, exportReceiveHistoryExcelBtn);
          newExportBtn.addEventListener("click", () => {
            console.log("Click Export Receive");
            ReceiveComponent.exportToExcel();
          });
        }
        break;
        
      case "reports":
        ReportComponent.renderMonthlyReport();
        
        let monthPicker = document.getElementById("monthReportPicker");
        if(monthPicker) {
          let newMonthPicker = monthPicker.cloneNode(true);
          monthPicker.parentNode.replaceChild(newMonthPicker, monthPicker);
          newMonthPicker.addEventListener("change", () => ReportComponent.renderMonthlyReport());
        }
        
        let exportBtn = document.getElementById("exportMonthCSV");
        if(exportBtn) {
          let newExportBtn = exportBtn.cloneNode(true);
          exportBtn.parentNode.replaceChild(newExportBtn, exportBtn);
          newExportBtn.addEventListener("click", () => ReportComponent.exportMonthCSV());
        }
        break;
    }
  }
};

// เริ่มต้นแอปเมื่อโหลดหน้าเสร็จ
document.addEventListener("DOMContentLoaded", () => App.init());