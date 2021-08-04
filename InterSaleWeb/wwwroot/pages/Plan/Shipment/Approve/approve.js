'use strict';
app.controller("shipmentApproveController", function ($rootScope, $scope, $routeParams, $location, $window, $filter, common, intersales) {
    $rootScope.step = eval($routeParams.step);
    if ($rootScope.step === 1) { $scope.titlePage = "Send To Approve"; }
    else if ($rootScope.step === 2) { $scope.titlePage = "Regional Approve"; }
    /*else if ($rootScope.step === 3) { $scope.titlePage = "Manager Approve"; }*/
    else { $window.location.href = "/"; }
    
    var firstLoad = true;

    // set datePlan
    var d = new Date();
    var m = d.getDate() > 15 ? d.getMonth() + 2 : d.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    $scope.datePlan = (m > 12 ? '01' : m) + '/' + (m > 12 ? d.getFullYear() + 1 : d.getFullYear());
    // Load Sale emp
    $scope.employeesList = []; $scope.sales = [];
    $scope.regionalManagerList = []; $scope.regionalManager = [];
    KSSClient.API.Employee.SearchSale({
        data: { search: '', status: 'A' },
        callback: function (res) {
            $filter('filter')(res.data.employees, function (value, index, array) {
                return (value.position.code.trim() === 'E033' || value.position.code.trim() === 'E011' || value.position.code.trim() === 'GSCN');
            }).forEach(function (v) {
                $scope.regionalManagerList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
                if (parseInt($rootScope.username.split(' ')[0]) === v.id) {
                    $scope.regionalManager.push($scope.regionalManagerList[$scope.regionalManagerList.length - 1]);
                }
            });

            $filter('filter')(res.data.employees, function (value, index, array) {
                return (value.position.code.trim() !== 'E033' && value.position.code.trim() !== 'G021' && value.position.code.trim() !== 'E011' && value.position.code.trim() !== 'E011');
            }).forEach(function (v) {
                $scope.employeesList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
                if (parseInt($rootScope.username.split(' ')[0]) === v.id) {
                    $scope.sales.push($scope.employeesList[$scope.employeesList.length - 1]);
                }
            });
            //$rootScope.shipmentApproveController_LoadData();
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });

    // set regional sales
    $scope.LoadRegionalManager = function (query) {
        return $filter('filter')($scope.regionalManagerList, { 'text': query });
    };
    // set Sales
    $scope.LoadSales = function (query) {
        return $filter('filter')($scope.employeesList, { 'text': query });
    };

    // load RegionalZones
    $scope.regzoneList = []; //regzoneCodes
    KSSClient.API.ShipmentPlan.ListRegionalZone({
        data: {},
        callback: function (res) {
            res.data.regionalZones.forEach(function (v) {
                $scope.regzoneList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });
    // set LoadRegzone
    $scope.LoadRegzone = function (query) {
        return $filter('filter')($scope.regzoneList, { 'text': query });
    };

    // load LoadZones
    $scope.zoneList = [];
    KSSClient.API.ZoneAccount.Search({
        data: { search: '', status: 'A' },
        callback: function (res) {
            res.data.zoneAccounts.forEach(function (v) {
                $scope.zoneList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });
    // set LoadZones
    $scope.LoadZones = function (query) {
        return $filter('filter')($scope.zoneList, { 'text': query });
    };
    
    // load LoadCustomers
    $scope.customerList = [];
    KSSClient.API.Customer.Search({
        data: { search: '', status: 'A' },
        callback: function (res) {
            res.data.customers.forEach(function (v) {
                $scope.customerList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });
    // set LoadCustomers
    $scope.LoadCustomers = function (query) {
        return $filter('filter')($scope.customerList, { 'text': query });
    };

    $scope.IP_DB = $rootScope.IP_DB;

    $scope.tmpfn = function (date) {
        if (date) {
            var tmp = date.split('/');
            $scope.planMonth = parseInt(tmp[0]);
            $scope.planYear = parseInt(tmp[1]);
        } else {
            $scope.planMonth = undefined;
            $scope.planYear = undefined;
        }
    };

    // set status
    $scope.status = {};
    KSSClient.API.ShipmentPlan.GetShipmentStatus({
        data: {},
        callback: function (res) {
            res.data.constantShipmentStatus.forEach(function (r) {
                r.view = common.GetCodeDescription(r);
            });
            $scope.status.list = $filter("filter")(res.data.constantShipmentStatus, function (value, index, array) {
                return (value.step >= $scope.step);
            });
            if ($scope.status.list[1]) { $scope.status.view = $scope.status.list[1].view; }
            $scope.$apply();
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });

    $scope.status.SetID = function (id) {
        $scope.status.id = id;
        if (firstLoad) {
            //$rootScope.shipmentApproveController_LoadData();
            firstLoad = false;
        }
    }

    $scope.GenData = function (data) {
        $scope.weekPlan = intersales.GetWeekPlan($scope.planMonth, $scope.planYear);
        data.forEach((row) => {
            row.customer_view = row.customers.map(x => x.code + ' : ' + x.description).join(", ");
            row.port_view = row.ports.map(x => x.code + ' : ' + x.description).join(", ");
            row.remark_view = common.GetCodeDescription(row.remark);
            row.planDate_view = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.planDate));
            row.lastAdmitDate_view = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.lastAdmitDate));
            row.salesApprove.datetime = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.salesApprove.datetime));
            row.regionalApprove.datetime = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.regionalApprove.datetime));
            row.managerApprove.datetime = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.managerApprove.datetime));

            row.paymentTerm_view = row.paymentTerm.join(", ");

            $scope.weekPlan.forEach((w) => {
                if (w.weekNo === row.planWeek && w.month === $scope.planMonth) {
                    var tmpDate = w.startDate.getDate();
                    tmpDate = (tmpDate < 10 ? '0' + tmpDate : tmpDate);
                    row.planWeek_view = 'W' + w.weekNo + ' : ' + tmpDate + ' - ' + KSSClient.Engine.Common.GetDateView(w.endDate);
                    row.planWeek_vieworg = row.planWeek_view;
                    row.planWeek = 'W' + w.weekNo;
                    return;
                }
            });
        });
        var length = data.length * 4;
        for (var i = 0; i < length; i++) { data.push({ totalRow: true }); }
        $rootScope.shipmentApproveListCtrl_SetData(data);
        $rootScope.shipmentApproveDetailCtrl_SetData();
    }

    $rootScope.shipmentApproveController_LoadData = function () {
        if (angular.isUndefined($scope.status.id)) { return false; }
        $scope.regionalManagerIDs = [];
        if ($scope.regionalManager) {
            $scope.regionalManager.forEach(function (v) {
                $scope.regionalManagerIDs.push(v.id);
            });
        }

        $scope.saleEmployeeIDs = [];
        if ($scope.sales) {
            $scope.sales.forEach(function (v) {
                $scope.saleEmployeeIDs.push(v.id);
            });
        }

        $scope.regionalZoneIDs = [];
        if ($scope.regzone) {
            $scope.regzone.forEach(function (v) {
                $scope.regionalZoneIDs.push(v.id);
            });
        }

        $scope.zoneAccountIDs = [];
        if ($scope.zones) {
            $scope.zones.forEach(function (v) {
                $scope.zoneAccountIDs.push(v.id);
            });
        }

        $scope.customerIDs = [];
        if ($scope.customers) {
            $scope.customers.forEach(function (v) {
                $scope.customerIDs.push(v.id);
            });
        }

        $scope.countryIDs = [];
        if ($scope.country) {
            $scope.country.forEach(function (v) {
                $scope.countryIDs.push(v.id);
            });
        }
        $scope.orgData = [];
        KSSClient.API.ShipmentPlanMain.GetPlanForApprove({
            data: {
                planMonth: $scope.planMonth
                , planYear: $scope.planYear
                , regionalManagerIDs: $scope.regionalManagerIDs
                , saleEmployeeIDs: $scope.saleEmployeeIDs
                , regionalZoneIDs: $scope.regionalZoneIDs
                , zoneAccountIDs: $scope.zoneAccountIDs
                , customerIDs: $scope.customerIDs
                , countryIDs: /*$scope.countryIDs*/ ''
                , shipmentStatus: $scope.status.id
                , step: $rootScope.step
            },
            callback: function (res) {
                $scope.orgData = angular.copy(res.data.shipmentPlanHs);
                $scope.GenData(res.data.shipmentPlanHs);
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    }

    $rootScope.shipmentApproveController_UpdateData = function (newData) {
        var delIndex = [];
        $scope.orgData.forEach(function (row, index) {
            for (var i = 0; i < newData.length; i++) {
                if (newData[i].id === row.id) {
                    delIndex.push(index);
                    row.managerApprove = newData[i].managerApprove;
                    row.status = newData[i].status;
                }
            }
        });
        if ($scope.status.id !== null) {
            common.ObjArrDel($scope.orgData, delIndex);
        }
        $scope.GenData(angular.copy($scope.orgData));
    }

    
});

app.controller("shipmentApproveListCtrl", function ($rootScope, $scope, $filter, common, $timeout) {

    var GridClass = function (grid, row) {
        if (row.entity.totalRow) {
            return 'bg-info font-bold';
        }
        if (row.entity.status === 'S') {
            return 'text-primary';
        } else if (row.entity.status === 'W') {
            return 'text-warning';
        } else if (row.entity.status === 'A') {
            return 'text-success';
        } else if (row.entity.status === 'N') {
            return 'text-danger';
        }
    }

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, showTotalGrouping2: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planWeek', display: 'Week', width: { min: 150 }, setclass: GridClass, format: { type: 'customText' }, grouping2: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'no', display: 'No', width: { min: 55, max: 55 }, format: { type: 'text', align: 'center' }, setclass: GridClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer_view', display: 'Customer', width: { min: 300 }, format: { type: 'text', showTotal: true }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port_view', display: 'Port/ Country', width: { min: 200 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastAdmitDate_view', display: 'Last Admit Date', width: { min: 100 }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planDate_view', display: 'ETD (KKF)', width: { min: 100 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Transport', width: { min: 100 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.quantity', display: 'Quantity', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.weight', display: 'Weight(KG)', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.bale', display: 'Bale', width: { min: 60 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.volume', display: 'Volume', width: { min: 80 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'valuetmp', display: 'Values', width: { min: 130 }, setclass: GridClass, format: { type: 'currency', scale: 2 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'valueTHB', display: 'Value(THB)', width: { min: 130 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerm_view', display: 'Term', width: { min: 130 }, setclass: GridClass, group: { name: 'payment', display: 'Payment', langCode: '' }/*, visible: false, hiding: false*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'payAmount', display: 'Pay Amount', width: { default: 130 }, format: { type: 'currency', scale: 2 }, setclass: GridClass, group: { name: 'payment', display: 'Payment', langCode: '' }/*, visible: false, hiding: false*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stockVsPlan', display: '% Porduct Complete', width: { min: 85 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'stockMulti', divi: 'stockDivi' }, setclass: GridClass, multiLine: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark_view', display: 'Remark', width: { min: 250 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'weightPerContainer', display: '% Weight Per Container', width: { min: 85 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'weightMulti', divi: 'weightDivi' }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'volumePerContainer', display: '% Volume Per Container', width: { min: 85 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'volumeMulti', divi: 'volumeDivi' }, setclass: GridClass, multiLine: true }));
   

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'statusDetail', display: 'Status Shipment', width: { min: 160 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesApprove.flag', display: 'Flag', width: { min: 50 }, setclass: GridClass, format: { type: 'truefalse' }, group: { name: 'sendToApprove', display: 'Send To Approve', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesApprove.by', display: 'By', width: { min: 100 }, setclass: GridClass, group: { name: 'sendToApprove', display: 'Send To Approve', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesApprove.datetime', display: 'Date', width: { min: 100 }, setclass: GridClass, group: { name: 'sendToApprove', display: 'Send To Approve', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'regionalApprove.flag', display: 'Flag', width: { min: 50 }, setclass: GridClass, format: { type: 'truefalse' }, group: { name: 'regionalApprove', display: 'Regional Approve', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'regionalApprove.by', display: 'By', width: { min: 100 }, setclass: GridClass, group: { name: 'regionalApprove', display: 'Regional Approve', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'regionalApprove.datetime', display: 'Date', width: { min: 100 }, setclass: GridClass, group: { name: 'regionalApprove', display: 'Regional Approve', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'managerApprove.flag', display: 'Flag', width: { min: 50 }, setclass: GridClass, format: { type: 'truefalse' }, group: { name: 'managerApprove', display: 'Manager Approve', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'managerApprove.by', display: 'By', width: { min: 100 }, setclass: GridClass, group: { name: 'managerApprove', display: 'Manager Approve', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'managerApprove.datetime', display: 'Date', width: { min: 100 }, setclass: GridClass, group: { name: 'managerApprove', display: 'Manager Approve', langCode: '' } }));

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        $scope.ChkChange();
    };

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") {
                if (myRow.entity.totalRow) { return undefined; }
                else if (!myRow.entity.isInsert) { return true; }
            } else if (myCol.field === "planWeek") {
                if (myCol.colDef.grouping2) { return myRow.entity.planWeek_view; }
                else { return myRow.entity.planWeek; }
            } else if (myCol.field === "salesApprove.flag" && !myRow.entity.totalRow) {
                if (myRow.entity.salesApprove.flag === 'Y') { return 1; }
                else if (myRow.entity.salesApprove.flag === 'N') { return 2; }
            } else if (myCol.field === "regionalApprove.flag" && !myRow.entity.totalRow) {
                if (myRow.entity.regionalApprove.flag === 'Y') { return 1; }
                else if (myRow.entity.regionalApprove.flag === 'N') { return 2; }
            } else if (myCol.field === "managerApprove.flag" && !myRow.entity.totalRow) {
                if (myRow.entity.managerApprove.flag === 'Y') { return 1; }
                else if (myRow.entity.managerApprove.flag === 'N') { return 2; }
            } 
        }
        return false
    };

    $scope.SetGridLang = function () {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "PLAN_SHIPMENT_PLANLIST" },
            callback: function (obj) {
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) { }
        });
    }

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_shipmentApprove01');
        $scope.SetGridLang();
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            $scope.ChkChange();
        });

        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            //$scope.gridApi.selection.selectRow(newRowCol.row.entity);
            if (!oldRowCol || oldRowCol.row.uid !== newRowCol.row.uid) {
                $rootScope.shipmentApproveDetailCtrl_SetData(newRowCol.row.entity.shipmentPlanDs, newRowCol.row.entity.planWeek, newRowCol.row.entity.planDate_view, newRowCol.row.entity.customer_view);
            }
        });
    };

    $scope.btnAppr = true;
    $scope.btnNotAppr = true;
    $scope.btnCancelAppr = true; 

    $rootScope.shipmentApproveListCtrl_SetData = function (data) {
        $scope.btnAppr = true;
        $scope.btnNotAppr = true;
        $scope.btnCancelAppr = true; 
        $scope.gridOpt.data = [];
        if (data) $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
        if (data.length) {
            $timeout(function () {
                $scope.gridApi.cellNav.scrollToFocus($scope.gridApi.grid.options.data[0], $scope.gridApi.grid.options.columnDefs[1]);
                $scope.gridApi.core.scrollTo($scope.gridApi.grid.options.data[0], $scope.gridApi.grid.options.columnDefs[1]);
            }, 5);
        }
        
    }

    $scope.ChkChange = function () {
        $scope.selx = [];
        $scope.btnAppr = false;
        $scope.btnNotAppr = false;
        $scope.btnCancelAppr = false; 
        var chk = true;
        if ($scope.gridApi.selection.getSelectedRows().length !== 0) {
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                if (!row.totalRow) {
                    chk = false;
                    if ($rootScope.step === 1) {
                        if (row.status !== 'P') { $scope.btnAppr = true; }
                        if (row.status !== 'S') { $scope.btnCancelAppr = true; }
                    } else if ($rootScope.step === 2) {
                        if (row.status !== 'S') { $scope.btnAppr = true; $scope.btnNotAppr = true;}
                        if (row.status !== 'W') { $scope.btnCancelAppr = true; }
                    } else if ($rootScope.step === 3) {
                        if (row.status !== 'W') { $scope.btnAppr = true; $scope.btnNotAppr = true; }
                        if (row.status !== 'A') { $scope.btnCancelAppr = true; }
                    }
                    $scope.selx.push(row.id);
                }
            });
        }
        if (chk) { $scope.btnAppr = true; $scope.btnNotAppr = true; $scope.btnCancelAppr = true; }
    }

    $scope.StatusUpDate = function (action) {
       // var txtdel = '';
        //$scope.selx = [];
        //$scope.gridApi.selection.getSelectedRows().forEach(function (row) {
        //    //txtdel += '#' + (angular.isUndefined(row.no) ? '' : row.no) + ' ' + row.orderCode + ' ' + row.product.code + '\n';
        //    if (!row.totalRow) $scope.selx.push(row.id);
        //});
        var approve = 'N';
        if (action === 0) { // cancel approve
            approve = 'C';
        } else if (action === 1) { // approve
            approve = 'Y';
        } else if (action === 2) { // Not Approve
            approve = 'N';
        } 

        if ($rootScope.step === 1) {
            KSSClient.API.ShipmentPlan.SalesApprove({
                data: { shipmentHID: $scope.selx, approve: approve },
                callback: function (res) {
                    console.log(res);
                    $rootScope.shipmentApproveController_UpdateData(res.data.shipmentPlanHs);
                    common.AlertMessage("Success", '');
                },
                error: function (res) { common.AlertMessage("Error", res.message); }
            });
        } else if ($rootScope.step === 2) {
            KSSClient.API.ShipmentPlan.RegionalApprove({
                data: { shipmentHID: $scope.selx, approve: approve },
                callback: function (res) {
                    $rootScope.shipmentApproveController_UpdateData(res.data.shipmentPlanHs);
                    common.AlertMessage("Success", '');
                },
                error: function (res) { common.AlertMessage("Error", res.message); }
            });
        } 

        $scope.ChkChange();
        $scope.chkAll = false;

    };

});

app.controller("shipmentApproveDetailCtrl", function ($rootScope, $scope, $filter, oauth, common) {

    var GridClass = function (grid, row) {
        var cellClass = '';
        if (row.entity.shipmentPlanOrderStands.urgentFlag) { cellClass += 'text-danger '; }
        return cellClass;
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, setclass: GridClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanOrderStands.orderCode', display: 'Order No', width: { min: 115 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanOrderStands.product.code', display: 'Code', width: { min: 140 }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanOrderStands.product.description', display: 'Description', width: { min: 300 }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanOrderStands.urgentFlag', display: 'Urgent', width: { min: 60 }, format: { type: 'truefalse' }, setclass: GridClass, multiLine: true, filter: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.quantity', display: 'Quantity', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.weight', display: 'Weight(KG)', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.bale', display: 'Bale', width: { min: 60 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.volume', display: 'Volume', width: { min: 80 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'valuetmp', display: 'Values', width: { min: 130 }, setclass: GridClass, format: { type: 'currency', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'valueTHB', display: 'Value(THB)', width: { min: 130 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stockVsPlan', display: '% Stock vs Plan', width: { min: 85 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'tmpMulti', divi: 'tmpDivi' }, setclass: GridClass, multiLine: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'admitDate_view', display: 'Admit Date', width: { min: 100 }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'maxAdmitDate_view', display: 'Max Admit Date', width: { min: 100 }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer.code', display: 'Customer', width: { min: 100 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanOrderStands.deliveryDescription', display: 'Deliver Type', width: { min: 70 }, setclass: GridClass, multiLine: true }));

    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.statusDetail', display: 'Status', width: { min: 150 }, setclass: GridClass }));

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        $scope.ChkChange();
    };

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field === "actionRow") {
                if (myRow.entity.shipmentPlanMain) {
                    if (myRow.entity.shipmentPlanMain.planType === 'M') { return 1 }
                    else if (myRow.entity.shipmentPlanMain.planType === 'W') { return 2 }
                }
                return 0;
            } else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            } else if (myCol.field === "shipmentPlanOrderStands.urgentFlag") {
                if (myRow.entity.shipmentPlanOrderStands.urgentFlag) { return 1; }
                return 2;
            }
        }
        return false
    };

    $scope.SetGridLang = function () {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "PLAN_SHIPMENT_PLANLIST" },
            callback: function (obj) {
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) { }
        });
    }

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_shipmentApprove02');
        $scope.SetGridLang();
    };

    $rootScope.shipmentApproveDetailCtrl_SetData = function (data, week, planDate, customer) {
        $scope.week = week === undefined ? "" : week;
        $scope.planDate = planDate === undefined ? "" : planDate;
        $scope.customer = customer === undefined ? "" : customer;
        $scope.gridOpt.data = [];
        if (data) {
            data.forEach(function (row) {
                row.admitDate_view = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.shipmentPlanOrderStands.admitDate));
                row.maxAdmitDate_view = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.shipmentPlanOrderStands.maxAdmitDate));
            });
            $scope.gridOpt.data = data;
        }
        $scope.gridApi.grid.refresh();
    }

});