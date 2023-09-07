'use strict';
app.controller("shipmentPlanListController", function ($rootScope, $scope, $window, $filter, $uibModal, $interval, oauth, common) {

    var $shipmentPlanList = this;

    // set datePlan
    var d = new Date();
    var m = d.getDate() > 15 ? d.getMonth() + 2 : d.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    $scope.datePlan = (m > 12 ? '01' : m) + '/' + (m > 12 ? d.getFullYear() + 1 : d.getFullYear());

    // load Sales
    $scope.employeesList = []; $scope.sales = [];
    KSSClient.API.Employee.SearchSale({
        data: { search: '', status: 'A' },
        callback: function (res) {
            $filter('filter')(res.data.employees, function (value, index, array) {
                return (value.position.code.trim() !== 'E033' && value.position.code.trim() !== 'G021' && value.position.code.trim() !== 'E011' && value.position.code.trim() !== 'E011');
            }).forEach(function (v) {
                $scope.employeesList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
                if (parseInt($rootScope.username.split(' ')[0]) === v.id) {
                    $scope.sales.push($scope.employeesList[$scope.employeesList.length - 1]);
                }
            });
            //$scope.LoadData();
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });
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

    //load container size 
    KSSClient.API.ShipmentPlan.ListContainerSize({
        data: {},
        callback: function (res) {
            $rootScope.containerList1 = res.data.containers;
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });

    $scope.IP_DB = $rootScope.IP_DB;

    var GridClass = function (grid, row) {
        if (row.entity.shipmentPlanMain) {
            if (row.entity.shipmentPlanMain.progress.alertMessage != '') {
                return 'text-danger';
            }
            if (row.entity.shipmentPlanMain.monthlyAmount == row.entity.shipmentPlanMain.monthlyApprove) {
                return 'text-success';
            }
            if (row.entity.shipmentPlanMain.ports.length != 0) {
                return 'text-primary';
            } else {
                return 'text-warning';
            }
        }
    };

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actionRow', width: { min: 80, max: 80 }, format: { type: 'actionRow', func: 'GridAction' }, setclass: GridClass, sort: false, filter: false, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, setclass: GridClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'view', display: 'Customer', width: { min: 300 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'zoneAccount.code', display: 'Zone', width: { min: 100 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'country.view', display: 'Country', width: { min: 160 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanMain.ports', display: 'Port', width: { min: 100 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstanding.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, group: { name: 'outstanding', display: 'Outstanding Balance', langCode: '' }, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstanding.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'outstanding', display: 'Outstanding Balance', langCode: '' }, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstanding.volume', display: 'Volume', width: { min: 80 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'outstanding', display: 'Outstanding Balance', langCode: '' }, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstanding.bale', display: 'Bales', width: { min: 80 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, group: { name: 'outstanding', display: 'Outstanding Balance', langCode: '' }, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstanding.values', display: 'Values', width: { min: 130 }, format: { type: 'currency', scale: 2 }, setclass: GridClass, group: { name: 'outstanding', display: 'Outstanding Balance', langCode: '' }, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, group: { name: 'inv', display: 'Inventory', langCode: '' }, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'inv', display: 'Inventory', langCode: '' }, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.volume', display: 'Volume', width: { min: 80 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'inv', display: 'Inventory', langCode: '' }, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.bale', display: 'Bales', width: { min: 80 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, group: { name: 'inv', display: 'Inventory', langCode: '' }, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.values', display: 'Values', width: { min: 130 }, format: { type: 'currency', scale: 2 }, setclass: GridClass, group: { name: 'inv', display: 'Inventory', langCode: '' }, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanMain.monthlyAmount', display: 'Amount', width: { min: 80 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, group: { name: 'Monthly', display: 'Monthly Shipment', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanMain.monthlyApprove', display: 'Approve', width: { min: 80 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, group: { name: 'Monthly', display: 'Monthly Shipment', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanMain.weeklyAmount', display: 'Weekly Shipment', width: { min: 80 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, multiLine: true }));

    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanMain.monthlyStatusDescription', display: 'Monthly Status', width: { min: 145 }, setclass: GridClass }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanMain.weeklyStatusDescription', display: 'Weekly Status', width: { min: 145 }, setclass: GridClass }));

    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanMain.progress.stockVSPlan', display: '% Stock vs Plan', width: { min: 80 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'stockQty', divi: 'planQty' }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentPlanMain.progress.alertMessage', display: 'Alert Message', width: { min: 300 }, setclass: GridClass }));

    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'end', display: '', width: { max: 9, min: 9 }, hiding: false, sort: false, filter: false, colMenu: false}));
    
    $scope.SetGridLang = function () {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "PLAN_SHIPMENT_PLANLIST" },
            callback: function (obj) {
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) { }
        });
    }
    
    $scope.GridAction = function (row, type) {
        if (type !== 0) {
            if (row.entity.shipmentPlanMain.status === 'O') {
                common.AlertMessage('Warning', 'Items is processing.');
                return false;
            }
        }
        switch (type) {
            case 0:
                var planMonth = undefined;
                var planYear = undefined;
                if ($scope.datePlan) {
                    var tmp = $scope.datePlan.split('/');
                    planMonth = parseInt(tmp[0]);
                    planYear = parseInt(tmp[1]);
                }
                
                $scope.mainID = undefined;
                KSSClient.API.ShipmentPlanMain.InsertMonthlyInit({
                    data: {
                        customerID: row.entity.id
                        , planMonth: planMonth
                        , planYear: planYear
                    },
                    callback: function (res) {
                        $scope.mainID = res.data.shipmentPlanMain.id;
                    },
                    error: function (res) {
                        common.AlertMessage("Error", res.message);
                    }
                });
                var stop = $interval(function () {
                    if ($scope.mainID) {
                        $interval.cancel(stop);
                        $window.open($rootScope.IP_URL + 'plan/shipment/planlist/manage/' + $scope.mainID, '_blank');
                        $scope.LoadData();
                    }
                }, 10);
                break;
            case 1:
                $window.open($rootScope.IP_URL + 'plan/shipment/planlist/manage/' + row.entity.shipmentPlanMain.monthlyID, '_blank');
                break;
            case 2:
                $window.open($rootScope.IP_URL + 'plan/shipment/planlist/manage/' + row.entity.shipmentPlanMain.weeklyID, '_blank');
                break;
            //case 3:
            //    $window.open($rootScope.IP_URL + 'plan/shipment/report/?type=' + row.entity.shipmentPlanMain.planType + '&date=' + $scope.datePlan + '&zone=' + row.entity.zoneAccount.id, '_blank');
            //    break;
        }
    }

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        $scope.ChkChange();
    };

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field == "actionRow") {
                if (myRow.entity.shipmentPlanMain) {
                    if (myRow.entity.shipmentPlanMain.weeklyID != 0 && myRow.entity.shipmentPlanMain.monthlyID != 0) { return 3; }
                    else if (myRow.entity.shipmentPlanMain.monthlyID != 0) { return 1; }
                    else if (myRow.entity.shipmentPlanMain.weeklyID != 0) { return 2; }
                }
                return 0;
            } else if (myCol.field == "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid == row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            }
        }
        return false
    };

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

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_planlist01');
        $scope.SetGridLang();
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            console.log(row);
            $scope.ChkChange();
        });
        $scope.ChangeChk();
    };

    $scope.LoadData = function () {
        $scope.gridOpt.data = [];
        $scope.chkAll = false;
        $scope.ChkChange();
        $scope.gridApi.grid.refresh();

        $scope.saleEmployeeIDs = [];
        if ($scope.sales) {
            $scope.sales.forEach(function (v) {
                $scope.saleEmployeeIDs.push(v.id);
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

        $scope.regionalZoneIDs = [];
        if ($scope.regzone) {
            console.log($scope.regzone);
            $scope.regzone.forEach(function (v) {
                $scope.regionalZoneIDs.push(v.id);
            });
        }

        KSSClient.API.ShipmentPlan.SearchPlan({
            data: {
                planMonth: $scope.planMonth,
                planYear: $scope.planYear,
                saleEmployeeIDs: $scope.saleEmployeeIDs,
                zoneAccountIDs: $scope.zoneAccountIDs,
                customerIDs: $scope.customerIDs,
                regionalZoneIDs: $scope.regionalZoneIDs
                , option: $scope.option.value
                , showOutstand: $scope.showSummary
            },
            callback: (res) => {
                res.data.customers.forEach(function (row) {
                    row.view = common.GetCodeDescription(row);
                    row.country.view = common.GetCodeDescription(row.country);
                    row.zoneAccount.view = common.GetCodeDescription(row.zoneAccount);
                    row.btnActionEnable = true;
                    if (row.shipmentPlanMain) {
                        row.shipmentPlanMain.ports = row.shipmentPlanMain.ports.join(", ");
                        if (row.shipmentPlanMain.status === 'O') {
                            row.shipmentPlanMain.progress.alertMessage = 'Auto Processing ...';
                        } else {
                            row.shipmentPlanMain.progress.alertMessage = row.shipmentPlanMain.progress.alertMessage.join(', ');
                        }
                    }
                });
                $scope.gridOpt.data = res.data.customers;
                $scope.gridApi.grid.refresh();
                $scope.ChkAutoProcess();
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });

        //KSSClient.API.ShipmentPlanMain.SearchProgress({
        //    data: {
        //        planMonth: $scope.planMonth
        //        , planYear: $scope.planYear
        //        , saleEmployeeIDs: $scope.saleEmployeeIDs
        //        , zoneAccountIDs: $scope.zoneAccountIDs
        //        , customerIDs: $scope.customerIDs
        //        , monthlyStatus: $scope.monthlyStatusIDs
        //        , weeklyStatus: $scope.weeklyStatusIDs
        //        , regionalZoneIDs: $scope.regionalZoneIDs
        //    },
        //    callback: function (res) {
        //        //console.log(res);
        //        res.data.customers.forEach(function (row) {
        //            row.view = common.GetCodeDescription(row);
        //            row.customerGroup.view = common.GetCodeDescription(row.customerGroup);
        //            row.country.view = common.GetCodeDescription(row.country);
        //            row.saleEmployee.view = common.GetCodeDescription(row.saleEmployee);
        //            row.zoneAccount.view = common.GetCodeDescription(row.zoneAccount);
        //            row.btnActionEnable = true;
        //            if (row.shipmentPlanMain) {
        //                row.stockQty = row.shipmentPlanMain.progress.stockQty;
        //                row.planQty = row.shipmentPlanMain.progress.planQty;
        //                row.shipmentPlanMain.ports = row.shipmentPlanMain.ports.join(", ");
        //                if (row.shipmentPlanMain.status === 'O') {
        //                    row.shipmentPlanMain.progress.alertMessage = 'Auto Processing ...';
        //                } else {
        //                    row.shipmentPlanMain.progress.alertMessage = row.shipmentPlanMain.progress.alertMessage.join(', ');
        //                }
        //            } else {
        //                row.stockQty = 0;
        //                row.planQty = 0;
        //            }
        //        });
        //        $scope.gridOpt.data = res.data.customers;
        //        $scope.gridApi.grid.refresh();
        //        $scope.ChkAutoProcess();
        //    },
        //    error: function (res) {
        //        common.AlertMessage("Error", res.message);
        //    }
        //});

    }

    $scope.selx = [];

    $scope.ChkChange = function () {
        if ($scope.gridApi.selection.getSelectedRows().length !== 0) {
            var autoPlan = true, removePlan = true;
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                if (row.shipmentPlanMain) {
                    autoPlan = false;
                    if (row.shipmentPlanMain.waitApprove === 'Y') {
                         removePlan = false;
                    }
                } else {
                    if (autoPlan) { autoPlan = true; }
                    removePlan = false;
                }
            }); $scope.autoPlan = autoPlan; $scope.removePlan = removePlan;
        } else { $scope.autoPlan = false; $scope.removePlan = false; }
    }

    $scope.StatusUpDate = function (action) {
        // get sel id
        $scope.selx = [];
        $scope.txtSel = '';
        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            if (row.shipmentPlanMain) {
                $scope.selx.push(row.shipmentPlanMain.monthlyID);
                $scope.txtSel += '#' + row.no + ' ' + row.view + '\n';
            }
        });
        function ChkUpdateStatus(res) {
            common.AlertMessage("Success", '');
            $scope.LoadData();
        }

        if (action === 3) {
            swal({
                title: "Are you sure ?",
                text: "remove plan :\n" + $scope.txtSel,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    KSSClient.API.ShipmentPlanMain.Remove({
                        data: { shipmentPlanMainIDs: $scope.selx },
                        callback: ChkUpdateStatus,
                        error: function (res) {
                            common.AlertMessage("Error", res.message);
                        }
                    });
                } 
            });
        } 
        $scope.gridApi.selection.clearSelectedRows();
        $scope.ChkChange();
    };

    $scope.AutoPlanAction = function () {
        $shipmentPlanList.open();
    };

    $rootScope.ShipmentPlanGetStatus = undefined;

    $scope.ChkAutoProcess = function () {
        if ($rootScope.ShipmentPlanGetStatus === undefined) {
            $rootScope.ShipmentPlanGetStatus = $interval(function () {
                var mainID = [];
                var objTmp = [];
                $scope.gridApi.grid.options.data.forEach(function (row) {
                    if (row.shipmentPlanMain) {
                        if (row.shipmentPlanMain.status === 'O') {
                            mainID.push(row.shipmentPlanMain.id);
                            objTmp.push(row);
                        }
                    }
                });
                if (mainID.length === 0) {
                    $interval.cancel($rootScope.ShipmentPlanGetStatus);
                    $rootScope.ShipmentPlanGetStatus = undefined;
                    return true;
                }
                KSSClient.API.ShipmentPlanMain.GetStatus({
                    data: {
                        shipmentPlanMainID: mainID
                        , planMonth: $scope.planMonth
                        , planYear: $scope.planYear
                        , saleEmployeeIDs: $scope.saleEmployeeIDs
                        , zoneAccountIDs: $scope.zoneAccountIDs
                        , customerIDs: $scope.customerIDs
                        , regionalZoneIDs: $scope.regionalZoneIDs
                    },
                    callback: function (res) {
                        if (res.data.shipmentPlanMain.length !== 0) {
                            objTmp.forEach(function (row) {
                                res.data.shipmentPlanMain.forEach(function (s) {
                                    if (row.shipmentPlanMain.id === s.id) {
                                        s.ports = angular.isArray(s.prorts) ? s.ports.join(", ") : "";
                                        if (s.progress) {
                                            s.progress.alertMessage = angular.isArray(s.progress.alertMessage) ? s.progress.alertMessage.join(", ") : "";
                                        }
                                        row.shipmentPlanMain = s;
                                        if (s.status === 'C') {
                                            row.shipmentPlanMain = undefined;
                                            var msg = "\n" + "ไม่พบ Setup รอบส่งออกลูกค้ารหัส ";
                                            msg += "\n" + row.view;
                                            common.AlertMessage("Error", "Auto Plan Fail." + msg + '\nData Outstanding have problems. \nPlease contact MIS or TeamDev.');
                                        }
                                    }
                                });
                            });
                            $scope.gridApi.grid.refresh();
                        }
                        if (res.data.shipmentPlanMain.length === mainID.length) {
                            $interval.cancel($rootScope.ShipmentPlanGetStatus);
                            $rootScope.ShipmentPlanGetStatus = undefined;
                        }
                    },
                    error: function (res) {
                        common.AlertMessage("Error", res.message);
                    }
                });
                
            }, 3000);
        }
    }
    
    //------------------------------------------------ modal ------------------------------------------//

    $shipmentPlanList.open = function (parentSelector) {
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalPlanListCtrl',
            controllerAs: '$shipmentPlanList',
            size: 'md',
            appendTo: parentElem,
            resolve:
            {
                data: function () { return $scope.datePlan; }
                , select: function () { return $scope.gridApi.selection.getSelectedRows(); }
            },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'myModalContent.html'
        });

        modalInstance.result.then(function (data) {
            var cusID = [];
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                cusID.push(row.id);
            });
            var limit = [], containerCode = [], containerVolume = [], containerCalcType = [];
            data.weeks.forEach(function (v) {
                limit.push(v.num == null ? 0 : v.num);
                containerCode.push(v.container.id);
                containerVolume.push(v.container.volume == null ? 0 : v.container.volume);
                containerCalcType.push('V');
            });
            var planMonth = undefined;
            var planYear = undefined;
            if ($scope.datePlan) {
                var tmp = $scope.datePlan.split('/');
                planMonth = parseInt(tmp[0]);
                planYear = parseInt(tmp[1]);
            }
            KSSClient.API.ShipmentPlan.AutoPlan({
                data: { planMonth: planMonth, planYear: planYear, customerIDs: cusID, limitContainerPerWeeks: limit, containerCodeOfWeek: containerCode, option: data.option, containerVolumeOfWeek: containerVolume, merge: data.merge, containerCalcTypeOfWeek: containerCalcType },
                callback: function (res) {
                    $scope.LoadData();
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                    $scope.LoadData();
                }
            });
            
            $scope.gridApi.selection.clearSelectedRows();

            $scope.ChkAutoProcess();

        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    var patt1 = new RegExp("outstanding");
    var patt2 = new RegExp("inventory");

    $scope.ChangeChk = () => {
        if ($scope.showSummary) {
            $scope.LoadData();
            $scope.gridOpt.columnDefs.forEach((c) => {
                if (patt1.test(c.field) || patt2.test(c.field)) {
                    c.visible = true;
                }
            });
        } else {
            $scope.gridOpt.columnDefs.forEach((c) => {
                if (patt1.test(c.field) || patt2.test(c.field)) {
                    c.visible = false;
                }
            });
            $scope.gridApi.grid.refresh();
        }
    };
    $scope.showSummary = false;
    $scope.option = {};
    $scope.option.value = '1';
    
});

app.controller('ModalPlanListCtrl', function ($scope, $rootScope, $uibModalInstance, data, select, common) {
    var Month = 0, Year = 0;
    if (data) {
        var tmp = data.split('/');
        Month = parseInt(tmp[0]) - 1;
        Year = parseInt(tmp[1]);

        var d = new Date(Year, Month, 1);

        $scope.merge = { enable: false, value: false };
        $scope.customerSelect = select.map(x => x.code).join(', ');

        if (select.length > 1) {
            $scope.merge.enable = true;
            //KSSClient.API.ShipmentPlan.GetCustomerGroup({
            //    data: { customerIDs: select.map(x => x.id) },
            //    callback: (res) => {
            //        console.log(res);
            //        var chk = false, tmp = '';
            //        res.data.customerGroups.forEach((d, i) => {
            //            if (!d.customerGroup.id) { chk = false; return; }
            //            if (i === 0) { chk = true; tmp = d.customerGroup.id; }
            //            if (d.customerGroup.id !== tmp) { chk = false; return; }
            //        });
            //        $scope.merge.enable = chk;
            //    },
            //    error: (res) => { common.AlertMessage("Error", res.message); }
            //});
        }

        $scope.radio = {};
        $scope.radio.value = "1";

        $scope.items = [{ id: '', label: 'auto', volume: null }];
        $rootScope.containerList1.forEach(function (row) {
            $scope.items.push({ id: row.code, label: row.code, volume: row.maxSizeVolume, vmin: 0, vmax: row.maxSizeVolume * 1.2 });
        });

        $scope.VolumeChange = (v) => {
            if (!v.container.volume) {
                common.AlertMessage('Warning', 'Container Size : ' + v.container.label + ' volume adjustment range : ' + v.container.vmin + ' - ' + v.container.vmax).then((ok) => {
                    v.container.volume = $rootScope.containerList1.find((x) => { return x.code == v.container.id }).maxSizeVolume;
                });
            }
        }

        $scope.MergeAction = () => {
            $scope.disable = !$scope.merge.value;
        }

        $scope.txtMonth = d.toLocaleString("en-us", { month: "long" });
        $scope.weeks = [];
        var today = new Date(new Date().setHours(0, 0, 0, 0))
        for (var i = 31; i >= 28; i--) {
            var d2 = angular.copy(d);
            d2.setDate(i);
            if (d2.getMonth() === d.getMonth()) {
                var chk = true, fristDate = 1, no = 1, startDate = {};
                for (var j = 1; j <= i; j++) {
                    var d3 = new Date(Year, Month, j);
                    if (chk) { fristDate = j; chk = false; startDate = angular.copy(d3); }
                    if (d3.getDay() === 0) { chk = true }
                    
                    if (j === i || chk) {
                        var chk2 = startDate.getTime() <= today.getTime();
                        $scope.weeks.push({ no: no++, start: fristDate, disabled: chk2, startDate: startDate, end: j, endDate: angular.copy(d3), num: chk2 ? 0 : 1, container: $scope.items[0] });
                    }
                }
                break;
            }
        }
        //for (var i = 31; i >= 28; i--) {
        //    var d2 = angular.copy(d);
        //    d2.setDate(i);
        //    if (d2.getMonth() == d.getMonth()) {
        //        var chk = true, fristDate = 1, no = 1;
        //        for (var j = 1; j <= i; j++) {
        //            var d3 = new Date(Year, Month, j);
        //            if (chk) { fristDate = j; chk = false; }
        //            if (d3.getDay() == 0) { chk = true }
        //            if (j == i || chk) { $scope.weeks.push({ no: no++, start: fristDate, end: j, num: 1, container: $scope.items[0] }); }
        //        }
        //        break;
        //    }
        //}
        console.log($scope.weeks);
    } else {
        $uibModalInstance.dismiss('cancel');
    }
    
    $scope.ok = function () {
        var data = { weeks: $scope.weeks, option: $scope.radio.value, merge: $scope.merge.value };
        $uibModalInstance.close(data);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});