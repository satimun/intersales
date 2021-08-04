'use strict';
app.controller("shipmentManagerApproveController", function ($rootScope, $scope, $filter, common, $timeout, intersales) {
    $rootScope.step2 = 3;
    $scope.IP_DB = $rootScope.IP_DB;

    // set datePlan
    var d = new Date();
    var m = d.getDate() > 15 ? d.getMonth() + 2 : d.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    $scope.datePlan = (m > 12 ? '01' : m) + '/' + (m > 12 ? d.getFullYear() + 1 : d.getFullYear());

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

    var firstLoad = true;

    // load RegionalZones
    $scope.regionalZonesID = '';
    $scope.regzoneList = [{ id: '', code: 'Total', description: 'Total', active: true }]; //regzoneCodes
    KSSClient.API.ShipmentPlan.ListRegionalZone({
        data: {},
        callback: function (res) {
            res.data.regionalZones.forEach(function (v) {
                $scope.regzoneList.push({ id: v.id, code: v.code, description: v.description, active: false });
            });
            $scope.$apply();
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });

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

    // set status
    $scope.status = {};
    KSSClient.API.ShipmentPlan.GetShipmentStatus({
        data: {},
        callback: function (res) {
            res.data.constantShipmentStatus.forEach(function (r) {
                r.view = common.GetCodeDescription(r);
            });
            $scope.status.list = $filter("filter")(res.data.constantShipmentStatus, function (value, index, array) {
                return (value.step >= $rootScope.step2);
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
            //$rootScope.shipmentManagerApproveController_LoadData();
            firstLoad = false;
        }
    }

    $scope.TabChange = function (id) {
        if (id === '') {
            $scope.regionalZonesID = '';
        } else {
            $scope.regionalZonesID = [id];
        }
       
        $scope.regzoneList.forEach(function (v) {
            if (v.id === id) {
                v.active = true;
                $rootScope.shipmentManagerApproveController_LoadData();
            } else {
                v.active = false;
            }
        });
    }

    $scope.GenData = function (data) {
        $scope.weekPlan = intersales.GetWeekPlan($scope.planMonth, $scope.planYear);

        //gen planH
        var tmpDataH = [];
        data.forEach(function (row, index) {
            row.customer_view = row.customers.map(x => x.code + ' : ' + x.description).join(", ");
            row.port_view = row.ports.map(x => x.code + ' : ' + x.description).join(", ");
            row.remark_view = common.GetCodeDescription(row.remark);
            row.planDate_view = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.planDate));
            row.lastAdmitDate_view = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.lastAdmitDate));
            row.salesApprove.datetime = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.salesApprove.datetime));
            row.regionalApprove.datetime = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.regionalApprove.datetime));
            row.managerApprove.datetime = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.managerApprove.datetime));

            row.paymentTerm_view = row.paymentTerm.join(", ");

            // set H sum currency week
            row.shipmentPlanDs.forEach((d) => {
                var chkH = true;
                tmpDataH.forEach((t, i) => {
                    if (t.planWeek === row.planWeek && t.currencyCode === d.shipmentPlanOrderStands.currency.code) {
                        t.quantity += d.planBalance.quantity;
                        t.bale += d.planBalance.bale;
                        t.weight += d.planBalance.weight;
                        t.values[0].num += d.planBalance.value;
                        t.valueTHB += d.valueTHB;
                        chkH = false;
                        return;
                    }
                });

                if (chkH) {
                    tmpDataH.push({
                        planWeek: row.planWeek
                        , quantity: d.planBalance.quantity
                        , bale: d.planBalance.bale
                        , weight: d.planBalance.weight
                        , values: [{ code: d.shipmentPlanOrderStands.currency.code, num: d.planBalance.value }]
                        , valueTHB: d.valueTHB
                        , currencyCode: d.shipmentPlanOrderStands.currency.code
                    });
                }
            });
            // end set H sum currency week

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
        tmpDataH.forEach(function (row, index) {
            row.disableSelect = true;
            $scope.weekPlan.forEach((w) => {
                if (w.weekNo === row.planWeek) {
                    var tmpDate = w.startDate.getDate();
                    tmpDate = (tmpDate < 10 ? '0' + tmpDate : tmpDate);
                    row.planWeek_view = 'Week ' + w.weekNo;
                    row.planWeek_vieworg = row.planWeek_view;
                    row.planWeek = 'W' + w.weekNo;
                    return;
                }
            });
        });

        var length = tmpDataH.length * 5;
        for (var i = 0; i < length; i++) { tmpDataH.push({ totalRow: true }); }
        $rootScope.shipmentManagerApproveGrid1Ctrl_SetData(tmpDataH);

        length = data.length * 4;
        for (var i = 0; i < length; i++) { data.push({ totalRow: true }); }
        $rootScope.shipmentManagerApproveGrid2Ctrl_SetData(data);
    }

    $rootScope.shipmentManagerApproveController_LoadData = function () {
        if (angular.isUndefined($scope.status.id)) { return false; }

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
        $scope.orgData = [];
        KSSClient.API.ShipmentPlanMain.GetPlanForApprove({
            data: {
                planMonth: $scope.planMonth
                , planYear: $scope.planYear
                , regionalManagerIDs: ''
                , saleEmployeeIDs: ''
                , regionalZoneIDs: $scope.regionalZonesID
                , zoneAccountIDs: $scope.zoneAccountIDs
                , customerIDs: $scope.customerIDs
                , countryIDs: ''
                , shipmentStatus: $scope.status.id
                , step: $rootScope.step2
            },
            callback: function (res) {
                console.log(res.data);
                $scope.orgData = angular.copy(res.data.shipmentPlanHs);
                $scope.GenData(res.data.shipmentPlanHs);
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    }

    $rootScope.shipmentManagerApproveController_UpdateData = function (newData) {
        $scope.dataH = [];
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
        if ($scope.status.id != null) {
            common.ObjArrDel($scope.orgData, delIndex);
        }
        $scope.GenData(angular.copy($scope.orgData));
    }


});

app.controller("shipmentManagerApproveGrid1Ctrl", function ($scope, $rootScope, $timeout, common) {

    var GridClass1 = function (grid, row) {
        if (row.entity.totalRow) {
            return 'bg-info font-bold';
        }
    }

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, showTotalGrouping2: true, showTotalCurrency: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planWeek', display: 'Week', width: { default: 195 }, format: { type: 'customText', showTotal: true }, grouping2: true, setclass: GridClass1, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'bale', display: 'Bales', width: { max: 100 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass1 }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'weight', display: 'Weight(KG)', width: { max: 150 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass1 }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'values', display: 'Values', width: { default: 250 }, format: { type: 'currency', scale: 2 }, setclass: GridClass1 }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'valueTHB', display: 'Value(THB)', width: { max: 150 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass1 }));

    $scope.SelectAll = function () {
        if ($scope.chkAll) {
            $scope.gridApi.selection.selectAllVisibleRows();
        }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        $scope.ChkChange();
    };

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") {
                if (myRow.entity.totalRow || myRow.entity.disableSelect) { return undefined; }
                else if (!myRow.entity.isInsert) { return true; }
            } else if (myCol.field === "planWeek") {
                if (myCol.colDef.grouping2) { return myRow.entity.planWeek_view; }
                else { return myRow.entity.planWeek; }
            }
        } 
        return false;
    };

    //$scope.SetGridLang = function () {
    //    KSSClient.API.Language.Dictionary({
    //        data: { lang: $rootScope.lang, group: "PLAN_SHIPMENT_PLANLIST" },
    //        callback: function (obj) {
    //            common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
    //        },
    //        error: function (res) { }
    //    });
    //}

    $scope.planWeek = '';

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_shipmentMGApprove01');
        //$scope.SetGridLang();
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            $scope.ChkChange();
        });

        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            //$scope.gridApi.selection.selectRow(newRowCol.row.entity);
            if (!oldRowCol || oldRowCol.row.uid !== newRowCol.row.uid) {
                if (!newRowCol.row.entity.totalRow) {
                    $scope.planWeek = newRowCol.row.entity.planWeek;
                } else {
                    $scope.planWeek = "";
                }
                $scope.ChkChange();
            }
        });
    };

    $rootScope.shipmentManagerApproveGrid1Ctrl_SetData = function (data) {
        $scope.gridOpt.data = [];
        if (data) $scope.gridOpt.data = data;
        if (data.length) {
            $timeout(function () {
                $scope.gridApi.cellNav.scrollToFocus($scope.gridApi.grid.options.data[0], $scope.gridApi.grid.options.columnDefs[1]);
                $scope.gridApi.core.scrollTo($scope.gridApi.grid.options.data[0], $scope.gridApi.grid.options.columnDefs[1]);
            }, 5);
        }
        $scope.gridApi.grid.refresh();
    }
    
    $scope.ChkChange = function () {
        $scope.selx = [];
        $timeout(function () {
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                $scope.selx.push(row);
            });
            $rootScope.shipmentManagerApproveGrid2Ctrl_ChangeFilter($scope.selx, $scope.planWeek);
        }, 5);
    }

});

app.controller("shipmentManagerApproveGrid2Ctrl", function ($scope, $rootScope, common) {

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
    };

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, showTotalGrouping2: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planWeek', display: 'Week', width: { min: 150 }, setclass: GridClass, format: { type: 'customText' }, grouping2: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'no', display: 'No', width: { min: 55, max: 55 }, format: { type: 'text', align: 'center' }, setclass: GridClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer_view', display: 'Customer', width: { min: 300 }, format: { type: 'text', showTotal: true }, setclass: GridClass  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port_view', display: 'Port/ Country', width: { min: 200 }, setclass: GridClass }));    

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastAdmitDate_view', display: 'Last Admit Date', width: { min: 100 }, setclass: GridClass, sort: false, filter: false, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planDate_view', display: 'ETD (KKF)', width: { min: 100 }, setclass: GridClass  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Transport', width: { min: 100 }, setclass: GridClass  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.quantity', display: 'Quantity', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.weight', display: 'Weight(KG)', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.bale', display: 'Bales', width: { min: 60 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.volume', display: 'Volume', width: { min: 80 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'valuetmp', display: 'Values', width: { min: 130 }, setclass: GridClass, format: { type: 'currency', scale: 2 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'valueTHB', display: 'Value(THB)', width: { min: 130 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Planning Amount', langCode: '' }  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerm_view', display: 'Term', width: { min: 130 }, setclass: GridClass, group: { name: 'payment', display: 'Payment', langCode: '' }/*, visible: false, hiding: false*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'payAmount', display: 'Pay Amount', width: { default: 130 }, format: { type: 'currency', scale: 2 }, setclass: GridClass, group: { name: 'payment', display: 'Payment', langCode: '' }/*, visible: false, hiding: false*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stockVsPlan', display: '% Product Complete', width: { min: 85 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'stockMulti', divi: 'stockDivi' }, setclass: GridClass, multiLine: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark_view', display: 'Remark', width: { min: 250 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'weightPerContainer', display: '% Weight Per Container', width: { min: 85 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'weightMulti', divi: 'weightDivi' }, setclass: GridClass, multiLine: true  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'volumePerContainer', display: '% Volume Per Container', width: { min: 85 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'volumeMulti', divi: 'volumeDivi' }, setclass: GridClass, multiLine: true  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'statusDetail', display: 'Status Shipment', width: { min: 160 }, setclass: GridClass  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesApprove.flag', display: 'Flag', width: { min: 50 }, setclass: GridClass, format: { type: 'truefalse' }, group: { name: 'sendToApprove', display: 'Send To Approve', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesApprove.by', display: 'By', width: { min: 100 }, setclass: GridClass, group: { name: 'sendToApprove', display: 'Send To Approve', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesApprove.datetime', display: 'Date', width: { min: 100 }, setclass: GridClass, group: { name: 'sendToApprove', display: 'Send To Approve', langCode: '' }  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'regionalApprove.flag', display: 'Flag', width: { min: 50 }, setclass: GridClass, format: { type: 'truefalse' }, group: { name: 'regionalApprove', display: 'Regional Approve', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'regionalApprove.by', display: 'By', width: { min: 100 }, setclass: GridClass, group: { name: 'regionalApprove', display: 'Regional Approve', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'regionalApprove.datetime', display: 'Date', width: { min: 100 }, setclass: GridClass, group: { name: 'regionalApprove', display: 'Regional Approve', langCode: '' }  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'managerApprove.flag', display: 'Flag', width: { min: 50 }, setclass: GridClass, format: { type: 'truefalse' }, group: { name: 'managerApprove', display: 'Manager Approve', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'managerApprove.by', display: 'By', width: { min: 100 }, setclass: GridClass, group: { name: 'managerApprove', display: 'Manager Approve', langCode: '' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'managerApprove.datetime', display: 'Date', width: { min: 100 }, setclass: GridClass, group: { name: 'managerApprove', display: 'Manager Approve', langCode: '' }  }));

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

    //$scope.SetGridLang = function () {
    //    KSSClient.API.Language.Dictionary({
    //        data: { lang: $rootScope.lang, group: "PLAN_SHIPMENT_PLANLIST" },
    //        callback: function (obj) {
    //            common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
    //        },
    //        error: function (res) { }
    //    });
    //}

    $scope.allWeek = true;
    $scope.planWeek = "";
    $rootScope.shipmentManagerApproveGrid2Ctrl_ChangeFilter = function (data_select, PlanWeek_focus) {
        $scope.planWeek = PlanWeek_focus;
        $scope.gridApi.selection.clearSelectedRows();

        data_select.forEach(function (row) {
            $scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach(function (v) {
                if (v.entity.planWeek === row.planWeek) {
                    v.isSelected = true;
                }
            });
        });

        $scope.gridApi.grid.refresh();
        $scope.ChkChange();
    }

    $scope.WeekFilter = function (renderableRows) {
        renderableRows.forEach(function (row) {
            if (!$scope.allWeek && (row.entity.planWeek !== $scope.planWeek)) {

                row.visible = false;
            }
        });
        return renderableRows;
    };

    $scope.AllWeekChange = function () {
        $scope.gridApi.grid.refresh();
    }

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_shipmentMGApprove02');
        //$scope.SetGridLang();
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            $scope.ChkChange();
        });
        gridApi.grid.registerRowsProcessor($scope.WeekFilter, 200);
    };

    $scope.btnAppr = true;
    $scope.btnNotAppr = true;
    $scope.btnCancelAppr = true;

    $rootScope.shipmentManagerApproveGrid2Ctrl_SetData = function (data) {
        $scope.btnAppr = true;
        $scope.btnNotAppr = true;
        $scope.btnCancelAppr = true;

        $scope.gridOpt.data = [];
        if (data) $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
    }

    $scope.ChkChange = function () {
        $scope.btnAppr = false;
        $scope.btnNotAppr = false;
        $scope.btnCancelAppr = false;
        $scope.selx = [];
        var chk = true;
        if ($scope.gridApi.selection.getSelectedRows().length != 0) {
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                if (!row.totalRow) {
                    chk = false;
                    if ($rootScope.step2 === 3) {
                        if (row.status != 'W') { $scope.btnAppr = true; $scope.btnNotAppr = true; }
                        if (row.status != 'A') { $scope.btnCancelAppr = true; }
                    }
                    $scope.selx.push(row.id);
                }
            });
        }
        if (chk) { $scope.btnAppr = true; $scope.btnNotAppr = true; $scope.btnCancelAppr = true; }
    }

    $scope.StatusUpDate = function (action) {
        var approve = 'N';
        if (action === 0) { // cancel approve
            approve = 'C';
        } else if (action === 1) { // approve
            approve = 'Y';
        } else if (action === 2) { // Not Approve
            approve = 'N';
        }

        KSSClient.API.ShipmentPlan.ManagerApprove({
            data: { shipmentHID: $scope.selx, approve: approve },
            callback: function (res) {
                $rootScope.shipmentManagerApproveController_UpdateData(res.data.shipmentPlanHs);
                common.AlertMessage("Success", '');
            },
            error: function (res) { common.AlertMessage("Error", res.message); }
        });

        $scope.ChkChange();
        $scope.chkAll = false;

    };

});