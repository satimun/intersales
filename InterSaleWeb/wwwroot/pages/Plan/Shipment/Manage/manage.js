'use strict';
app.controller("shipmentManageController", function ($rootScope, $scope, $window, $q, $uibModal, $routeParams, common, intersales) {
    $rootScope.shipmentPlanID = $routeParams.shipmentplanid;

    $rootScope.isChange = false;

    var $shipmentManage = this;

    $scope.outStandLoaded = false;

    $rootScope.planData = {};
    $rootScope.OutStandData = {};
    $rootScope.containerList = [];

    $scope.loadData = function () {
        KSSClient.API.ShipmentPlanMain.GetPlan({
            data: {
                shipmentPlanMainID: $rootScope.shipmentPlanID
            },
            callback: function (res) {
                $scope.planCode = res.data.shipmentPlanMain.code;
                $scope.customerview = common.GetCodeDescription(res.data.shipmentPlanMain.customer);
                $scope.planType = res.data.shipmentPlanMain.planType === 'M' ? 'Monthly' : 'Weekly';
                $scope.planTypex = res.data.shipmentPlanMain.planType;
                $scope.planMonth = res.data.shipmentPlanMain.planMonth;
                $scope.planYear = res.data.shipmentPlanMain.planYear;
                $scope.customerCode = res.data.shipmentPlanMain.customer.code;

                $scope.ports = res.data.shipmentPlanMain.ports.join();

                res.data.shipmentPlanMoves = [];
                //$rootScope.shipmentStatus = res.data.shipmentPlanMain.status;

                $rootScope.hideBtn = false;
                for (var i = 0; i < res.data.shipmentPlanMain.shipmentPlanHs.length; i++) {
                    if (res.data.shipmentPlanMain.shipmentPlanHs[i].status !== 'P'
                        && res.data.shipmentPlanMain.shipmentPlanHs[i].status !== 'N'
                        && res.data.shipmentPlanMain.planType === 'M') {
                        for (var j = 0; j < res.data.shipmentPlanMain.shipmentPlanHs[i].shipmentPlanDs.length; j++) {
                            if (res.data.shipmentPlanMain.shipmentPlanHs[i].shipmentPlanDs[j].customer.id === res.data.shipmentPlanMain.customer.id) {
                                $rootScope.hideBtn = true;
                                break;
                            }
                        }
                        if ($rootScope.hideBtn) break;
                    }
                }

                $rootScope.shipmentWeeklyPlan = false;

                if (res.data.shipmentPlanMain.planType === 'W') {
                    $rootScope.hideBtn = false;
                    $rootScope.shipmentWeeklyPlan = true;
                }

                var d = new Date($scope.planYear, $scope.planMonth - 1, 1);
                var today = new Date(new Date().setHours(0, 0, 0, 0));
                $rootScope.planWeeks = [];
                for (var i = 31; i >= 28; i--) {
                    var d2 = angular.copy(d);
                    d2.setDate(i);
                    if (d2.getMonth() === d.getMonth()) {
                        var chk = true, fristDate = 1, no = 1, startDate = {};
                        for (var j = 1; j <= i; j++) {
                            var d3 = new Date($scope.planYear, $scope.planMonth - 1, j);
                            if (chk) { fristDate = j; chk = false; startDate = angular.copy(d3); }
                            if (d3.getDay() === 0) { chk = true }
                            if (j === i || chk) { $rootScope.planWeeks.push({ no: no++, start: fristDate, disabled: startDate.getTime() <= today.getTime(), startDate: startDate, end: j, endDate: angular.copy(d3), num: 1 }); }
                        }
                        break;
                    }
                }

                $rootScope.weekPlan = intersales.GetWeekPlan($scope.planMonth, $scope.planYear, res.data.shipmentPlanMain.shippingDay);

                $rootScope.planData = res.data;
                $rootScope.shipmentPlanOrderShippingList_setData();
            },
            error: function (res) {
                common.AlertMessage("Error", res.message, 'close');
            }
        });
    }

    KSSClient.API.ShipmentPlan.ListContainerSize({
        data: { },
        callback: function (res) {
            $rootScope.containerList = res.data.containers;
            $scope.loadData();
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });

    //var html = '<label>Please choose option for get Outstanding.</label>' +
    //    '<label class="alert-label"><input type="radio" name="valOption" value="1" checked/> Close By KPK</label><br/>' +
    //    '<label class="alert-label"><input type="radio" name="valOption" value="2"/> Close By KCI</label>'
    //var form = document.createElement("div");
    //form.style.textAlign = "left";
    //form.innerHTML = html;

    $scope.valOption = 0;
    $scope.customerData = [];

    $scope.loadOutStanding = function (customerCodes, ignoreAdmitDate) {
        var deferred = $q.defer();
        var customerChk = false;
        $scope.customerData.forEach((c) => { customerCodes.forEach((v) => { if (v !== c) { customerChk = true; return; } }); });
        $scope.customerData = angular.copy(customerCodes);

        if ($scope.valOption !== $rootScope.optionOutstand || customerChk || !$scope.outStandLoaded) {
            $scope.valOption = $rootScope.optionOutstand;
            var admitDateFrom = ($scope.planYear - 2) /* '2000'*/ + '-01-01';
            var admitDateTo = ($scope.planYear + 1) + '-' + $scope.planMonth + '-01';
            KSSClient.API.ShipmentPlan.SearchOutstanding({
                data: {
                    admitDateFrom: admitDateFrom
                    , admitDateTo: admitDateTo
                    , customerCodes: customerCodes
                    , option: $scope.valOption
                    , planMonth: $rootScope.planData.shipmentPlanMain.planMonth
                    , planYear: $rootScope.planData.shipmentPlanMain.planYear
                    , planType: $rootScope.planData.shipmentPlanMain.planType
                    , IgnoreAdmitDate: ignoreAdmitDate
                },
                callback: function (res) {
                    res.data.outstandings.forEach(function (row) {
                        $scope.outStandLoaded = true;
                        row.toBeShipped.valuetmp = [{ num: row.toBeShipped.value, code: row.currency.code }];
                        row.inventory.valuetmp = [{ num: row.inventory.value, code: row.currency.code }];
                        row.outstandingBalance.valuetmp = [{ num: row.outstandingBalance.value, code: row.currency.code }];
                    });
                    $rootScope.OutStandData = res.data.outstandings;
                    deferred.resolve('success');
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                    deferred.resolve('error');
                }
            });
        } else {
            deferred.resolve('success');
        }
        return deferred.promise;
    }

    $scope.PushOutStanding = function () {
        //$rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands = [];
        var admitDate = KSSClient.Engine.Common.CreateDateTime($scope.planYear + '-' + ($scope.planMonth + 2) + '-01');
        $rootScope.OutStandData.forEach(function (row) {
            if (KSSClient.Engine.Common.CreateDateTime(row.admitDate).getTime() < admitDate.getTime()) {
                row.customer.code = row.customer.code.trim();
                row.isAdd = true;
                row.status = 'A';
                $rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands.push(angular.copy(row));
            }
            $rootScope.isChange = true;
        });
        $rootScope.shipmentPlanOrderShippingList_setData();
    }

    $scope.SetOutstandingAuto = function (data) {
        $rootScope.ShipmentPlanRemove($rootScope.planData.shipmentPlanMain.shipmentPlanHs);
        $rootScope.OutStandRemove($rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands, data.map(x => x.id));
        $scope.loadOutStanding(data.map(x => x.code)).then(function (val) {
            if (val === 'success') { $scope.PushOutStanding(); }
        });
        $rootScope.isChange = true;
    }

    $shipmentManage.open = function (parentSelector) {
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalGetOutstanding',
            controllerAs: '$shipmentManage',
            size: 'lg',
            appendTo: parentElem,
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'ModalGetOutstandingContent.html'
        });

        modalInstance.result.then(function () {
            $rootScope.shipmentPlanOrderShippingList_setData();
            $rootScope.isChange = true;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $rootScope.optionOutstand = '1';

    $scope.GetOutstanding = function (option) {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalOptionGetOutstandingCtrl',
            resolve: { data: () => { return $rootScope.shipmentPlanOrderstanding_GetCustomer(); } },
            size: 'md',
            appendTo: '',
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'OptionGetOutstandingcontent.html'
        });

        modalInstance.result.then((data) => {
            if (option === 1) {
                $scope.loadOutStanding(data.map(x => x.code), true).then(function (val) { if (val === 'success') { $shipmentManage.open(); } });
            } else {
                if ($rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands.length) {
                    common.ConfirmDialog('Are you sure?', 'Auto Outstanding : \nOutstanding and current plans will be removed.', true).then((ok) => {  if (ok) { $scope.SetOutstandingAuto(data); } });
                } else { $scope.SetOutstandingAuto(data); }
            }
        }, () => { });
    };

    $scope.Save = function () {
        $rootScope.planData.shipmentPlanMain.shipmentPlanHs.forEach(function (row) {
            row.subGridOpt = {};
            row.tmp = {};
            if ($rootScope.shipmentWeeklyPlan) {
                if(row.status !== 'C') row.status = 'A';
            }
            row.shipmentPlanDs.forEach(function (row2) {
                row2.tmp = {};
            });
        });
        KSSClient.API.ShipmentPlanMain.SavePlan({
            data: {
                shipmentPlanMain: $rootScope.planData.shipmentPlanMain
            },
            callback: function (res) {
                if ($rootScope.planData.shipmentPlanMoves.length) {
                    $rootScope.planData.shipmentPlanMoves.forEach((data) => {
                        KSSClient.API.ShipmentPlanMain.SavePlan({
                            data: { shipmentPlanMain: data },
                            callback: function (res) { common.AlertMessage('Success', ''); $rootScope.isChange = false; $scope.loadData(); },
                            error: function (res) { common.AlertMessage("Error", res.message); $rootScope.shipmentPlanOrderShippingList_setData(); }
                        });
                    });
                } else { common.AlertMessage('Success', ''); $rootScope.isChange = false; $scope.loadData(); }
            },
            error: function (res) { common.AlertMessage("Error", res.message);  $rootScope.shipmentPlanOrderShippingList_setData(); }
        });
    }

    $scope.Close = function () {
        if ($rootScope.isChange) {
            common.ConfirmDialog('Data Change', 'Do you want to close window ?', true).then((ok) => { if (ok) { $window.close(); } });
        } else {
            $window.close();
        }
    }
});

app.controller('ModalOptionGetOutstandingCtrl', function ($scope, $rootScope, $uibModalInstance, data, common, $filter) {

    if (!data.length) {
        data.push($rootScope.planData.shipmentPlanMain.customer.code);
    }
    // load LoadCustomers
    $scope.customers = [];
    $scope.customerList = [];
    KSSClient.API.Customer.Search({
        data: { search: '', status: 'A' },
        callback: function (res) {
            res.data.customers.forEach(function (v) {
                $scope.customerList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
                if (data.find((c) => { return c === v.code; })) {
                    $scope.customers.push($scope.customerList[$scope.customerList.length - 1]);
                }
            });
            $scope.$apply();
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });
    // set LoadCustomers
    $scope.LoadCustomers = function (query) {
        return $filter('filter')($scope.customerList, { 'text': query });
    };

    $scope.radio = {};
    $scope.radio.value = $rootScope.optionOutstand;

    $scope.ok = function () {
        if (!$scope.customers.length) {
            common.AlertMessage('Warning', 'Please select a customer.');
        } else {
            $rootScope.optionOutstand = $scope.radio.value;
            $uibModalInstance.close($scope.customers);
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ModalGetOutstanding', function ($scope, common, $rootScope, $uibModalInstance) {
    var $shipmentManage = this;

    var GridClass = function (grid, row, col) {
        var cellClass = '';
        if (row.entity.urgentFlag) { cellClass += 'text-danger '; }
        return cellClass;
    };

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, setclass: GridClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'orderCode', display: 'Order No.', width: { min: 130 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'itemno', display: 'PI Item No.', width: { min: 60 }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'urgentFlag', display: 'Urgent', width: { min: 60 }, format: { type: 'truefalse' }, setclass: GridClass, multiLine: true, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer.code', display: 'Customer', width: { default: 100 }, format: { type: 'distinct', show: 'item'/*'count'*/ }, setclass: GridClass, hiding: false, visible: !$rootScope.showOnlyCustomer }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.code', display: 'Code', width: { min: 140 }, group: { name: 'product', display: 'Product', langCode: '' }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.description', display: 'Description', width: { min: 300 }, group: { name: 'product', display: 'Product', langCode: '' }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'admitDate', display: 'Admit Date', width: { min: 140 }, format: { type: 'datetime' }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'deliveryDescription', display: 'Delivery Type', width: { min: 140 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstandingBalance.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, group: { name: 'outstandingAmount', display: 'Outstanding Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstandingBalance.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'outstandingAmount', display: 'Outstanding Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstandingBalance.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, group: { name: 'outstandingAmount', display: 'Outstanding Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstandingBalance.volume', display: 'Volume', width: { min: 80 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'outstandingAmount', display: 'Outstanding Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstandingBalance.valuetmp', display: 'Values', width: { min: 130 }, format: { type: 'currency', scale: 2 }, setclass: GridClass, group: { name: 'outstandingAmount', display: 'Outstanding Amount', langCode: '' } }));


    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, group: { name: 'inventory', display: 'Inventory', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'inventory', display: 'Inventory', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, setclass: GridClass, group: { name: 'inventory', display: 'Inventory', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.volume', display: 'Volume', width: { min: 80 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'inventory', display: 'Inventory', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.valuetmp', display: 'Values', width: { min: 130 }, format: { type: 'currency', scale: 2 }, setclass: GridClass, group: { name: 'inventory', display: 'Inventory', langCode: '' } }));
    
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'comparisonPercent.inventory', display: 'Inventory', width: { min: 130 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'comparisonToProdorma', display: 'Comparison To Proforma', langCode: '' }, visible: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'comparisonPercent.notYetDelivered', display: 'Not Yet Delivered', width: { min: 130 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'comparisonToProdorma', display: 'Comparison To Proforma', langCode: '' }, visible: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'comparisonPercent.notYetFinished', display: 'Not Yet Finished', width: { min: 130 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'comparisonToProdorma', display: 'Comparison To Proforma', langCode: '' }, visible: false }));
        
    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { return true; }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid === row.uid) { numRow = (index + 1); }
                });
                return numRow;
            } else if (myCol.field === "admitDate") {
                return KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(myRow.entity.admitDate));
            } else if (myCol.field === "maxAdmitDate") {
                return KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(myRow.entity.maxAdmitDate));
            } else if (myCol.field === "urgentFlag") {
                if (myRow.entity.urgentFlag) { return 1; }
                return 2;
            }
        }
        return false
    };

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); $scope.chkSel = true; }
        else { $scope.gridApi.selection.clearSelectedRows(); $scope.chkSel = false; }
    };
    $scope.FilterGetOutstanding = function (renderableRows) {
        renderableRows.forEach(function (row) {
            $rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands.forEach(function (o) {
                if (o.itemno === row.entity.itemno && o.orderCode === row.entity.orderCode && o.product.code === row.entity.product.code && o.status !== 'C') {
                    row.visible = false;
                }
            });
            var admitDate = KSSClient.Engine.Common.CreateDateTime(row.entity.admitDate);
            var match = false;
            if ($scope.dtpFrom !== undefined && $scope.dtpTo !== undefined) {
                if ($scope.dtpFrom <= admitDate && $scope.dtpTo >= admitDate) { match = true; }
            } else if ($scope.dtpFrom !== undefined) {
                if ($scope.dtpFrom <= admitDate) { match = true; }
            } else if ($scope.dtpTo !== undefined) {
                if ($scope.dtpTo >= admitDate) { match = true; }
            } else {
                match = true;
            }
            if (!match) { row.visible = false; }
        });
        return renderableRows;
    };

    $scope.filter = function () {
        $scope.gridApi.selection.clearSelectedRows();
        $scope.gridApi.grid.refresh();
    }

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_manage01');
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
           //console.log(row);
        });
        gridApi.grid.registerRowsProcessor($scope.FilterGetOutstanding, 200);
        $scope.loadData();
    };

    $scope.loadData = function () {
        //$scope.gridApi.grid.options.columnDefs
        $scope.gridOpt.data = $rootScope.OutStandData;
        $scope.gridApi.grid.refresh();
    }
    
    $shipmentManage.ok = function () {

        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            row.customer.code = row.customer.code.trim();
            row.isAdd = true;
            row.status = 'A';
            $rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands.push(angular.copy(row));
        });
        $uibModalInstance.close();
    };

    $shipmentManage.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller("shipmentPlanOrderShippingListController", function ($rootScope, $scope, $uibModal, uiGridConstants, common, $timeout) {
    var modal = this; 
    var GridClass = function (grid, row, col) {
        var cellClass = '';
        var tmp = col.name.split('.');
        var obj = angular.copy(row.entity);
        for (var i = 0; i < tmp.length; i++) {
            if (i === tmp.length - 1) {
                if (obj) {
                    if (obj[tmp[i] + 'org'] && obj[tmp[i] + 'org'] !== obj[tmp[i]]) {
                        cellClass += 'bg-warning ';
                    }
                }
            } else {
                obj = obj[tmp[i]];
            }
        }
        if (row.entity.tmp.status === 'P') {
            cellClass += 'text-primary ';
        } else if(row.entity.tmp.status === 'E') {
            cellClass += 'text-warning ';
        } else if (row.entity.tmp.status === 'C') {
            cellClass += 'text-success ';
        }
        if (row.entity.urgentFlag) { cellClass += 'text-danger '; }
        return cellClass;
    }

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name:'priority', display:'Priority', width: { min: 70 }, format: { type: 'priority', func: 'PriorityAction' }, sort: false, filter: false, colMenu: false, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, setclass: GridClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'orderCode', display: 'Order No.', width: { min: 130 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'itemno', display: 'PI Item No.', width: { min: 60 }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'urgentFlag', display: 'Urgent', width: { min: 60 }, format: { type: 'truefalse' }, setclass: GridClass, multiLine: true, filter: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name:'product.code', display:'Code', width: { min: 140 }, setclass: GridClass, group:{ name: 'product', display: 'Product', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name:'product.description', display:'Description', width: { min: 300 }, setclass: GridClass, group:{ name: 'product', display: 'Product', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name:'customer.code', display: 'Customer', width: { default: 100 }, format: { type: 'distinct', show: 'item'/*'count'*/ }, setclass: GridClass, hiding: false, visible: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name:'customer.portCode', display:'Port', width: { default: 80 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name:'admitDate', display:'Admit Date', width: { min: 80 }, format: { type:'datetime' }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name:'deliveryDescription', display:'Delivery Type', width:{ min: 70 }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name:'contianerCode', display:'Container', width:{ min: 90 }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'saleUnitCode', display: 'Sale Unit', width: { min: 60 }, setclass: GridClass, multiLine: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'toBeShipped.quantity', display: 'Quantity', edit: true, width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'toBeShipped', display: 'To Be Shipped', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'toBeShipped.weight', display: 'Weight(KG)', edit: true, width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'To Be Shipped', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'toBeShipped.bale', display: 'Bales', edit: true, width: { min: 60 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'toBeShipped', display: 'To Be Shipped', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'toBeShipped.volume', display: 'Volume', width: { min: 80 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'To Be Shipped', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'toBeShipped.valuetmp', display: 'Values', width: { min: 130 }, setclass: GridClass, format: { type: 'currency', scale: 2 }, group: { name: 'toBeShipped', display: 'To Be Shipped', langCode: '' } }));
    
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.quantity', display: 'Quantity', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'beingPlannedAmount', display: 'Being Planed Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.weight', display: 'Weight(KG)', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planed Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.bale', display: 'Bales', width: { min: 60 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'beingPlannedAmount', display: 'Being Planed Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.volume', display: 'Volume', width: { min: 80 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planed Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.valuetmp', display: 'Values', width: { min: 130 }, setclass: GridClass, format: { type: 'currency', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planed Amount', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.quantity', display: 'Quantity', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'inventory', display: 'Inventory', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.weight', display: 'Weight(KG)', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'inventory', display: 'Inventory', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.bale', display: 'Bales', width: { min: 60 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'inventory', display: 'Inventory', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.volume', display: 'Volume', width: { min: 80 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'inventory', display: 'Inventory', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.valuetmp', display: 'Values', width: { min: 130 }, setclass: GridClass, format: { type: 'currency', scale: 2 }, group: { name: 'inventory', display: 'Inventory', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstandingBalance.quantity', display: 'Quantity', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'outstandingAmount', display: 'Outstanding Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstandingBalance.weight', display: 'Weight(KG)', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'outstandingAmount', display: 'Outstanding Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstandingBalance.bale', display: 'Bales', width: { min: 60 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'outstandingAmount', display: 'Outstanding Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstandingBalance.volume', display: 'Volume', width: { min: 80 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'outstandingAmount', display: 'Outstanding Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstandingBalance.valuetmp', display: 'Values', width: { min: 130 }, setclass: GridClass, format: { type: 'currency', scale: 2 }, group: { name: 'outstandingAmount', display: 'Outstanding Amount', langCode: '' } }));

    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'comparisonPercent.inventory', display: 'Inventory', width: { min: 130 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'comparisonToProdorma', display: 'Comparison To Proforma', langCode: '' }, visible:false }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'comparisonPercent.notYetDelivered', display: 'Not Yet Delivered', width: { min: 130 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'comparisonToProdorma', display: 'Comparison To Proforma', langCode: '' }, visible: false }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'comparisonPercent.notYetFinished', display: 'Not Yet Finished', width: { min: 130 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'comparisonToProdorma', display: 'Comparison To Proforma', langCode: '' }, visible: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.statusDetail', display: 'Status', width: { min: 220 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.plans', display: 'Plans', width: { min: 250 }, format: { type: 'customText' }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'closeByCI', display: 'Close By KCI', width: { min: 80 }, format: { type: 'truefalse' }, setclass: GridClass, multiLine: true, filter: false }));
  
    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { return true; }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            } else if (myCol.field === "admitDate") {
                return KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(myRow.entity.admitDate));
            } else if (myCol.field === "tmp.plans") {
                var tmp = '';
                if (myRow.entity.tmp.plans && angular.isArray(myRow.entity.tmp.plans)) {
                    myRow.entity.tmp.plans.forEach(function (v, i) {
                        if (myRow.entity.tmp.plans.length - 1 === i) { tmp += v; }
                        else { tmp += v + ', '; }
                    });
                }
                return tmp;
            } else if (myCol.field === "priority") {
                if (myRow.entity.favoriteFlag) {
                    if (myRow.entity.favoriteFlag === 'Y') {
                        return myRow.entity.favoriteFlag;
                    }
                }
                return false;
            } else if (myCol.field === "closeByCI") {
                if (myRow.entity.closeByCI) {
                    if (myRow.entity.closeByCI === 'Y') {
                        return 1;
                    }
                }
                return 2;
            } else if (myCol.field === "urgentFlag") {
                if (myRow.entity.urgentFlag) { return 1; }
                return 2;
            }
        }
        return false
    };

    $scope.SelectAll = function () {
        if ($scope.chkAll) {
            //$scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach((r) => { r.isSelected = true; });
            $scope.gridApi.selection.selectAllVisibleRows();
        }
        else {
            //if ($scope.gridApi.grid.options.enableFiltering) {
            //    $scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach((r) => { r.isSelected = false; });
            //    //console.log($scope.gridApi.grid.renderContainers.body.visibleRowCache);
            //}
            //else { $scope.gridApi.selection.clearSelectedRows(); }
            $scope.gridApi.selection.clearSelectedRows();
        }
        $scope.ChkChange();
    };

    $scope.PriorityAction = function (row, ptr) {
        var index = $scope.gridApi.grid.options.data.indexOf(row.entity);
        if (row.entity.favoriteFlag === "N" || row.entity.favoriteFlag === null || row.entity.favoriteFlag === '') {
            $scope.gridApi.grid.options.data[index].favoriteFlag = "Y";
        } else {
            $scope.gridApi.grid.options.data[index].favoriteFlag = "N";
        }
        $rootScope.isChange = true;
    }

    $rootScope.FilterOrder = function (renderableRows) {
        renderableRows.forEach(function (row) {
            if ((row.entity.customer.code !== $rootScope.planData.shipmentPlanMain.customer.code && $rootScope.shipmentPlanShowOnlyCustomer) || row.entity.status !== 'A') {
                row.visible = false;
            }
        });
        return renderableRows;
    };
    
    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_manage02');
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            //console.log(row);
            $scope.ChkChange();
        });
        gridApi.grid.registerRowsProcessor($scope.FilterOrder, 200);

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $rootScope.isChange = true;
            var x = 0;
            var keys = rowEntity.inventory.quantity > 0 ? 'inventory' : 'outstandingBalance';
            if (colDef.name === 'toBeShipped.quantity') {
                x = common.GetObjVal(keys + '.quantity', rowEntity) <= 0 ? 1 : newValue / common.GetObjVal(keys + '.quantity', rowEntity);
                if (newValue !== oldValue) { rowEntity.toBeShipped.quantityold = oldValue; }
            } else if (colDef.name === 'toBeShipped.weight') {
                x = common.GetObjVal(keys + '.weight', rowEntity) <= 0 ? 1 : newValue / common.GetObjVal(keys + '.weight', rowEntity);
                if (newValue !== oldValue) { rowEntity.toBeShipped.weightold = oldValue; }
            } else if (colDef.name === 'toBeShipped.bale') {
                x = common.GetObjVal(keys + '.bale', rowEntity) <= 0 ? 1 : parseInt(newValue) / common.GetObjVal(keys + '.bale', rowEntity);
                if (newValue !== oldValue) { rowEntity.toBeShipped.baleold = oldValue; }
            } 
            
            rowEntity.toBeShipped.quantity = parseInt(common.GetObjVal(keys + '.quantity', rowEntity) * x);
            rowEntity.toBeShipped.weight = common.GetObjVal(keys + '.weight', rowEntity) * x;
            rowEntity.toBeShipped.bale = Math.ceil(common.GetObjVal(keys + '.bale', rowEntity) * x);
            //console.log('toBeShiped', x);
            //rowEntity.toBeShipped.volume = common.GetObjVal(keys + '.volume', rowEntity) * x;
            rowEntity.toBeShipped.value = common.GetObjVal(keys + '.value', rowEntity) * x;
            rowEntity.toBeShipped.valuetmp = [{ num: rowEntity.toBeShipped.value, code: rowEntity.currency.code }];

            //quantity = quantity;
            //rowEntity.toBeShipped.bale = parseInt(quantity * rowEntity.valuePerUnit.qpb);

            //quantity = parseFloat(rowEntity.toBeShipped.bale / rowEntity.valuePerUnit.qpb).toFixed(2);

            //rowEntity.toBeShipped.quantity = quantity;
            //rowEntity.toBeShipped.weight = parseFloat((quantity * rowEntity.valuePerUnit.qpw).toFixed(2));
            ////rowEntity.toBeShipped.bale = Math.ceil(quantity * rowEntity.valuePerUnit.qpb);
            //rowEntity.toBeShipped.volume = parseFloat((rowEntity.toBeShipped.bale * rowEntity.valuePerUnit.bpl).toFixed(2));
            //rowEntity.toBeShipped.value = parseFloat((quantity * rowEntity.valuePerUnit.qpv).toFixed(2));
            //rowEntity.toBeShipped.valuetmp = [{ num: rowEntity.toBeShipped.value, code: rowEntity.currency.code }];
            $scope.$apply();
            $rootScope.shipmentPlanOrderShippingList_refesh();
        });
    };
    
    $rootScope.shipmentPlanOrderShippingList_setData = function (opt) {
        $scope.chkAll = false;
        $scope.gridApi.selection.clearSelectedRows();
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        $scope.ChkChange();

        $rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands.forEach(function (row) {

            //if ($rootScope.planData.shipmentPlanMain.customer.id !== row.customer.id) {
            //    $rootScope.shipmentPlanShowOnlyCustomer = false;
            //    $rootScope.shipmentPlanManageController_changeChk(false);
            //}

            row.customer.port = {};
            row.customer.port.view = row.customer.portCode + ' : ' + row.customer.portDescriotion;
            row.tmp = {};
            row.tmp.quantity = 0;
            row.tmp.weight = 0;
            row.tmp.bale = 0;
            row.tmp.value = 0;

            row.tmp.status = '';
            row.tmp.statusDetail = [];
            row.tmp.plans = [];
            //console.log(row);

            //row.tmp.inventory = angular.copy(row.inventory);

            row.toBeShipped.quantityorg = row.toBeShipped.quantity;
            row.toBeShipped.quantityold = row.toBeShipped.quantity;

            row.toBeShipped.weightorg = row.toBeShipped.weight;
            row.toBeShipped.weightold = row.toBeShipped.weight;

            row.toBeShipped.baleorg = row.toBeShipped.bale;
            row.toBeShipped.baleold = row.toBeShipped.bale;

            //row.toBeShipped.volumeorg = row.toBeShipped.volume;
            //row.toBeShipped.valueorg = row.toBeShipped.value;

            row.toBeShipped.valuetmp = [{ num: row.toBeShipped.value, code: row.currency.code }];
            row.tmp.valuetmp = [{ num: row.tmp.value, code: row.currency.code }];
            row.inventory.valuetmp = [{ num: row.inventory.value, code: row.currency.code }];
            row.outstandingBalance.valuetmp = [{ num: row.outstandingBalance.value, code: row.currency.code }];
            
            row.enableEdit = true;
        });
        $scope.gridOpt.data = $rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands;
        $rootScope.shipmentPlanOrderShippingList_refesh();
        if(!opt) $rootScope.shipmentPlanManage_SetData();
    }

    $rootScope.shipmentPlanOrderstanding_GetCustomer = () => {
        var customerCodes = [];
        $scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach((r) => {
            var chk = true;
            customerCodes.forEach((c) => { if (c === r.entity.customer.code) { chk = false; return;} });
            if (chk) { customerCodes.push(r.entity.customer.code); }
        });
        return customerCodes;
    }

    $rootScope.shipmentPlanOrderShippingList_refesh = function () {

        if (!$rootScope.shipmentPlanShowOnlyCustomer) {
            $scope.gridOpt.columnDefs.forEach((c) => {
                if (c.field === 'customer.code') { c.visible = true; return; }
            });
        }
        $scope.gridApi.grid.options.data.forEach(function (row) {
            row.tmp.statusDetail = [];
            var chk = true;

            row.tmp.valuetmp = [{ num: row.tmp.value, code: row.currency.code }];

            if (row.tmp.quantity === 0 || row.toBeShipped.quantity <= 0) {
                row.tmp.status = 'N';
                chk = false;
                row.tmp.statusDetail.push('No shipment plan created.');
            }

            if (row.saleUnitIsWei === 'Y') {
                if (row.inventory.weight < row.tmp.weight) {
                    chk = false;
                    row.tmp.status = 'P';
                    row.tmp.statusDetail.push('Production in process.');
                }
            } else {
                if (row.inventory.quantity < row.tmp.quantity) {
                    chk = false;
                    row.tmp.status = 'P';
                    row.tmp.statusDetail.push('Production in process.');
                }
            }

            var x = 0;
            if (row.saleUnitIsWei === 'Y') {
                x = (row.outstandingBalance.weight + (row.proformaBalance.weight * (row.percentClose / 100)));
                if (row.toBeShipped.weight > x) {
                    chk = false;
                    row.tmp.status = 'E';
                    row.tmp.statusDetail.push('% Shipment plan exceeded % lot closing ' + Math.round(x) + ' kg');
                }
            } else {
                x = (row.outstandingBalance.quantity + (row.proformaBalance.quantity * (row.percentClose / 100)));
                if (row.toBeShipped.quantity > x) {
                    chk = false;
                    row.tmp.status = 'E';
                    row.tmp.statusDetail.push('% Shipment plan exceeded % lot closing ' + Math.round(x) + ' qty');
                }
            }
            
            
            if (row.tmp.quantity > row.toBeShipped.quantity) {
                chk = false;
                row.tmp.status = 'E';
                row.tmp.statusDetail.push('Shipment plan exceeded target.');
            }

            if (chk && row.toBeShipped.quantity > 0) {
                row.tmp.status = 'C';
                row.tmp.statusDetail.push('Shipment plan completed.');
            }
            row.tmp.statusDetail = row.tmp.statusDetail.join(', ');

        });
        
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        $scope.gridApi.grid.refresh();
    }

    $scope.ChkChange = function () {
        if ($scope.gridApi.selection.getSelectedRows().length !== 0) {
            $scope.chkSel = true;
        } else { $scope.chkSel = false; }
    }

    ////-----------------------OutStandRemove
    $rootScope.OutStandRemove = function (obj, customerIds) {
        var tmpObj = [];
        obj.forEach(function (row) {
            if (row.isAdd) {
                tmpObj.push($scope.gridApi.grid.options.data.indexOf(row));
            } else {
                if (angular.isArray(customerIds)) {
                    if (customerIds.find((c) => { return c === row.customer.id; })) row.status = 'C';
                } else {
                    row.status = 'C';
                }
            }
        });
        for (var i = tmpObj.length - 1; i >= 0; i--) {
            $scope.gridApi.grid.options.data.splice(tmpObj[i], 1);
        }
        $scope.gridApi.selection.clearSelectedRows();
        $scope.gridApi.grid.refresh();
        $scope.ChkChange();
        $scope.chkAll = false;
        // gen data
        $rootScope.shipmentPlanManage_SetData();
    }

    $scope.OutStand_ShipmentDRemove = function (outstand) {        
        $rootScope.planData.shipmentPlanMain.shipmentPlanHs.forEach(function (shipmentH) {
            var tmpObj = [];
            shipmentH.shipmentPlanDs.forEach(function (shipmentD, index) {
                outstand.forEach(function (osd) {
                    if (osd.id === shipmentD.shipmentPlanOrderStandID) {
                        if (shipmentD.isAdd) {
                            tmpObj.push(index);
                        } else {
                            shipmentD.status = 'C';
                        }
                    }
                });
            });
            for (var i = tmpObj.length - 1; i >= 0; i--) {
                shipmentH.shipmentPlanDs.splice(tmpObj[i], 1);
            }
        });
        
        $scope.gridApi.selection.clearSelectedRows();
        $scope.gridApi.grid.refresh();
        $scope.ChkChange();
        $scope.chkAll = false;
        // gen data
        $rootScope.shipmentPlanManage_SetData();
    }

    $scope.StatusUpDate = function (action) {
        var txtdel = '';
        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            txtdel += '#' + (angular.isUndefined(row.no) ? '': row.no) + ' ' + row.orderCode + ' ' + row.product.code + '\n';
        });
        if (action === 0) { // auto plan
            modal.ClientAutoShipmentPlan();
        } else if (action === 1) { // plan manage
            modal.InsertShipmentPlan();
        } else if (action === 2) { // remove outstand & plan
            swal({
                title: "Are you sure?",
                text: "Remove OutStanding List :\n" + txtdel,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    $rootScope.isChange = true;
                    $rootScope.OutStandRemove($scope.gridApi.selection.getSelectedRows());
                }
            });
        } else if (action === 3) { // remove plan
            swal({
                title: "Are you sure?",
                text: "Remove OutStanding From Plan : \n" + txtdel,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    $rootScope.isChange = true;
                    $scope.OutStand_ShipmentDRemove($scope.gridApi.selection.getSelectedRows());
                }
            });
        } 
        $scope.ChkChange();
        $scope.chkAll = false;

    };

    modal.ClientAutoShipmentPlan = function (parentSelector) {
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalClientAutoShipmentPlanCtrl',
            size: 'md',
            appendTo: parentElem,
            resolve:
            {
                data: function () { return $rootScope.planWeeks }
                , selectData: function () { return $scope.gridApi.selection.getSelectedRows() }
            },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'ClientAutoShipmentPlanContent.html'
        });

        modalInstance.result.then(function (data) {
            var limit = [], containerCode = [], containerVolume = [], containerCalcType = [];
            data.forEach(function (v) {
                limit.push(v.num === null ? 0 : v.num);
                containerCode.push(v.container.id);
                containerVolume.push(v.container.volume === null ? 0 : v.container.volume);
                containerCalcType.push('V');
            });
            var tmpdata = {};
            tmpdata.id = $rootScope.planData.shipmentPlanMain.id;
            tmpdata.code = $rootScope.planData.shipmentPlanMain.code;
            tmpdata.planType = $rootScope.planData.shipmentPlanMain.planType;
            tmpdata.planMonth = $rootScope.planData.shipmentPlanMain.planMonth;
            tmpdata.planYear = $rootScope.planData.shipmentPlanMain.planYear;
            tmpdata.customer = angular.copy($rootScope.planData.shipmentPlanMain.customer);
            tmpdata.shipmentPlanOrderStands = [];
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                if (row.status !== 'C') {
                    if (
                        !(row.toBeShipped.quantity - row.tmp.quantity <= 0
                            /*|| row.toBeShipped.weight - row.tmp.weight <= 0
                            || row.toBeShipped.bale - row.tmp.bale <= 0
                            || row.toBeShipped.value - row.tmp.value <= 0*/)
                    ) {
                        var tmp = angular.copy(row);
                        tmp.customer = { id: row.customer.id };
                        tmp.id = row.id;
                        tmp.mainID = tmpdata.id;
                        tmp.toBeShipped.quantity = row.toBeShipped.quantity - row.tmp.quantity;
                        tmp.toBeShipped.weight = row.toBeShipped.weight - row.tmp.weight;
                        tmp.toBeShipped.bale = row.toBeShipped.bale - row.tmp.bale;
                        tmp.toBeShipped.volume = row.toBeShipped.volume - row.tmp.volume;
                        tmp.toBeShipped.value = row.toBeShipped.value - row.tmp.value;
                        tmpdata.shipmentPlanOrderStands.push(tmp);
                    }
                }
            });
            KSSClient.API.ShipmentPlan.ClientAutoPlan({
                data: {
                    limitContainerOfWeeks: limit
                    , containerCodeOfWeek: containerCode
                    , shipmentPlanMain: tmpdata
                    , containerVolumeOfWeek: containerVolume
                    , containerCalcTypeOfWeek: containerCalcType
                },
                callback: function (res) {
                    if (res.data.shipmentPlanHs.length !== 0) {
                        res.data.shipmentPlanHs.forEach(function (row) {
                            row.isAdd = true;
                            $rootScope.planData.shipmentPlanMain.shipmentPlanHs.push(row);
                        });
                        $rootScope.shipmentPlanOrderShippingList_setData();
                        $rootScope.isChange = true;
                        common.AlertMessage('Success', 'Auto Plan ' + res.data.shipmentPlanHs.length + ' Plan Success.')
                    } else {
                        common.AlertMessage('Warning', 'Auto Plan Fail.')
                    }
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });

        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    modal.InsertShipmentPlan = function (parentSelector) {
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalInsertShipmentPlanCtrl',
            size: 'lg',
            appendTo: parentElem,
            backdrop: 'static',
            keyboard: false,
            resolve:
            {
                data: function () {
                    return $scope.gridApi.selection.getSelectedRows();
                }
            },
            templateUrl: 'InsertShipmentPlanContent.html'
        });

        modalInstance.result.then(function () {
            $rootScope.isChange = true;
            $rootScope.shipmentPlanOrderShippingList_setData();
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.showOutStand = true;
    $scope.textHide = "Hide";

    $scope.HideOutStand = function () {
        $scope.showOutStand = !$scope.showOutStand;
        if ($scope.showOutStand) {
            $scope.textHide = "Hide";
            $scope.gridApi.grid.refresh();
        } else {
            $scope.textHide = "Show";
        }
    }

    var htmlHelp = '<table class="table table-striped">' +
        '<tr><th>สี</th><th>คำอธิบาย</th></tr>' +
        '<tr><td >ดำ</td><td>ยังไม่จัดแผน</td></tr>' +
        '<tr><td class="text-success">เขียว</td><td>จัดแผนเสร็จ</td></tr>' +
        '<tr><td class="text-warning">ส้ม</td><td>จัดแผนเกิน Outstanding จาก % ปิด Lot</td></tr>' +
        '<tr><td class="text-warning">ส้ม</td><td>จัดแผนเกินจากเป้าหมาย</td></tr>' +
        '<tr><td class="text-primary">น้ำเงิน</td><td>รอสินค้าเข้าคลัง</td></tr>' +
        '<tr><td class="text-danger">แดง</td><td>Urgent Item</td></tr>' +
        '</table>';

    $scope.help1 = [
        { head: 'คำอธิบายสีใน Grid', html: htmlHelp }
    ];

});

app.controller('ModalClientAutoShipmentPlanCtrl', function ($scope, $rootScope, $uibModalInstance, data, selectData, intersales) {
    if (selectData) {
        var tmpC = [];
        selectData.forEach((d) => {
            var chk = true;
            tmpC.forEach((c) => { if (c === d.customer.code) { chk = false; return; } });
            if (chk) { tmpC.push(d.customer.code); }
        });
        $scope.customerSelect = tmpC.join(', ');
    }
    if (data) {
        $scope.txtMonth = data[0].startDate.toLocaleString("en-us", { month: "long" });

        $scope.items = [{ id: '', label: 'auto', volume: null }];
        $rootScope.containerList.forEach(function (row) {
            $scope.items.push({ id: row.code, label: row.code, volume: row.maxSizeVolume, vmin: 0, vmax: row.maxSizeVolume * 1.2 });
        });

        var tmpd = new Date(new Date().setHours(0, 0, 0, 0));
        var currentweek = intersales.GetWeekPlan(tmpd.getMonth(), tmpd.getFullYear(), 0).find(x => { return x.startDate.getTime() <= tmpd.getTime() && x.endDate >= tmpd.getTime(); });

        $scope.weeks = angular.copy(data);
        $scope.weeks.forEach(function (v) {
            if (v.disabled) { v.num = 0; }
            v.container = $scope.items[0];
        });
    } else {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.VolumeChange = (v) => {
        if (!v.container.volume) {
            common.AlertMessage('Warning', 'Container Size : ' + v.container.label + ' volume adjustment range : ' + v.container.vmin + ' - ' + v.container.vmax).then((ok) => {
                v.container.volume = $rootScope.containerList1.find((x) => { return x.code === v.container.id }).maxSizeVolume;
            });
        }
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.weeks);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ModalInsertShipmentPlanCtrl', function ($scope, $rootScope, $filter, $uibModalInstance, data, common, intersales) {
    var GridClass = function (grid, row, col) {
        var cellClass = '';
        if (row.entity.planBalance.quantity <= 0 && col.name === 'planBalance.quantity') {
            cellClass += 'text-danger ';
        } else if (row.entity.planBalance.weight <= 0 && col.name === 'planBalance.weight') {
            cellClass += 'text-danger ';
        } else if (row.entity.planBalance.bale <= 0 && col.name === 'planBalance.bale') {
            cellClass += 'text-danger ';
        } else if (row.entity.planBalance.volume <= 0 && col.name === 'planBalance.volume') {
            cellClass += 'text-danger ';
        }
        if (row.entity.tmp.urgentFlag) { cellClass += 'text-danger '; }
        return cellClass;
    };

    $scope.gridOpt = common.CreateGrid2({ });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.orderCode', display: 'Order No', width: { min: 130 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.itemno', display: 'PI Item No.', width: { min: 60 }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.urgentFlag', display: 'Urgent', width: { min: 60 }, format: { type: 'truefalse' }, setclass: GridClass, multiLine: true, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.productCode', display: 'Code', width: { min: 140 }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.productDescription', display: 'Description', width: { min: 300 }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' } }));
    
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.quantity', display: 'Quantity', edit: true, width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'shipment', display: 'Shipment', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.weight', display: 'Weight(KG)', edit: true, width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'shipment', display: 'Shipment', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.bale', display: 'Bales', edit: true, width: { min: 60 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'shipment', display: 'Shipment', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.volume', display: 'Volume', width: { min: 80 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'shipment', display: 'Shipment', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.valuetmp', display: 'Values', width: { min: 130 }, setclass: GridClass, format: { type: 'currency', scale: 2 }, group: { name: 'shipment', display: 'Shipment', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.contianerCode', display: 'Container', width: { min: 90 }, setclass: GridClass }));
    

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "tmp.urgentFlag") {
                if (myRow.entity.tmp.urgentFlag) { return 1; }
                return 2;
            }
        }
        return false;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_manage03');
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            var x = 0;
            var keys = 'tmp.toBeShipped';
            if (colDef.name === 'planBalance.quantity') {
                x = common.GetObjVal(keys + '.quantity', rowEntity) <= 0 ? 1 : newValue / common.GetObjVal(keys + '.quantity', rowEntity);
            } else if (colDef.name === 'planBalance.weight') {
                x = common.GetObjVal(keys + '.weight', rowEntity) <= 0 ? 1 : newValue / common.GetObjVal(keys + '.weight', rowEntity);
            } else if (colDef.name === 'planBalance.bale') {
                x = common.GetObjVal(keys + '.bale', rowEntity) <= 0 ? 1 : parseInt(newValue) / common.GetObjVal(keys + '.bale', rowEntity);
            } 

            rowEntity.planBalance.quantity = parseInt(common.GetObjVal(keys + '.quantity', rowEntity) * x);
            rowEntity.planBalance.weight = common.GetObjVal(keys + '.weight', rowEntity) * x;
            rowEntity.planBalance.bale = Math.ceil(common.GetObjVal(keys + '.bale', rowEntity) * x);
            rowEntity.planBalance.volume = common.GetObjVal(keys + '.volume', rowEntity) * x;
            rowEntity.planBalance.value = common.GetObjVal(keys + '.value', rowEntity) * x;
            rowEntity.planBalance.valuetmp = [{ num: rowEntity.planBalance.value, code: rowEntity.tmp.currency }];

            $scope.$apply();
            $scope.gridApi.grid.refresh();
        });
        $scope.loadData();
    };

    $scope.containers = [];
    $rootScope.containerList.forEach(function (row) {
        $scope.containers.push({ id: row.code, label: row.code });
    });
    $scope.container = {};
    

    $scope.startDate = KSSClient.Engine.Common.GetDateString($rootScope.weekPlan[0].startDate);
    $scope.endDate = KSSClient.Engine.Common.GetDateString($rootScope.weekPlan[$rootScope.weekPlan.length - 1].endDate);

    $scope.months = [];
    $scope.month = {};
    for (var i = $rootScope.weekPlan[0].month; i <= 12; i++) {
        var date = new Date($rootScope.weekPlan[0].year, i - 1, 1);
        $scope.months.push({ month: i, label: date.toLocaleString("en-us", { month: "long" }) });
    }
    $scope.month.val = $scope.months[0];

    $scope.week = {}; $scope.dtpPlan = {};
    $scope.SetWeek = function (month, dateChange) {
        $scope.weeks = [];
        var chk = false;
        for (var i = 0; i < $rootScope.weekPlan.length; i++) {
            if ($rootScope.weekPlan[i].month === month) {
                $scope.weeks.push(angular.copy($rootScope.weekPlan[i]));
                chk = true;
            } else { if (chk) break; }
        }
        chk = true;
        if (angular.isObject($scope.week.val)) {
            for (var i = 0; i < $scope.weeks.length; i++) {
                if ($scope.week.val.weekNo === $scope.weeks[i].weekNo) {
                    $scope.week.val = $scope.weeks[i];
                    chk = false;
                    break;
                }
            }
        }
        if (chk) { $scope.week.val = $scope.weeks[0]; }
        if (dateChange) $scope.weekChange($scope.week.val);
    }

    //$scope.GetWeek = function (month) {
    //    $scope.weeks = [];
    //    var chk = false;
    //    for (var i = 0; i < $rootScope.weekPlan.length; i++) {
    //        if ($rootScope.weekPlan[i].month === month) {
    //            $scope.weeks.push(angular.copy($rootScope.weekPlan[i]));
    //            chk = true;
    //        } else { if (chk) break; }
    //    }
    //}

    $scope.loadData = function () {
        var chk = true;
        $scope.gridOpt.data = [];
        data.forEach(function (row) {
            // set container code
            if (chk) {
                for (var i = 0; i < $scope.containers.length; i++) {
                    if ($scope.containers[i].label === row.contianerCode) {
                        $scope.container.val = $scope.containers[i];
                        chk = false;
                        break;
                    } else {
                        $scope.container.val = $scope.containers[0];
                    }
                }
            }
            
            var obj = {};
            obj.id = null;
            obj.shipmentPlanMainID = $rootScope.planData.shipmentPlanMain.id;
            obj.shipmentPlanOrderStandID = row.id;
            obj.status = 'A';
            obj.customer = angular.copy(row.customer);
            obj.planBalance = {};
            obj.planBalance.quantity = row.toBeShipped.quantity - row.tmp.quantity;
            obj.planBalance.weight = row.toBeShipped.weight - row.tmp.weight;
            obj.planBalance.bale = row.toBeShipped.bale - row.tmp.bale;
            obj.planBalance.volume = row.toBeShipped.volume - row.tmp.volume;
            obj.planBalance.value = row.toBeShipped.value - row.tmp.value;

            obj.planBalance.valuetmp = [{ num: obj.planBalance.value, code: row.currency.code }];

            obj.tmp = {};
            obj.tmp.toBeShipped = row.toBeShipped;
            obj.tmp.orderCode = row.orderCode;
            obj.tmp.itemno = row.itemno;
            obj.tmp.productCode = row.product.code;
            obj.tmp.productDescription = row.product.description;
            obj.tmp.contianerCode = row.contianerCode;
            obj.tmp.valuePerUnit = angular.copy(row.valuePerUnit);
            obj.tmp.currency = row.currency.code;
            obj.tmp.urgentFlag = row.urgentFlag;
            obj.enableEdit = true;
            obj.isAdd = true;
            $scope.gridOpt.data.push(obj);
        });
        $scope.gridApi.grid.refresh();
        
        $scope.shipmentHs = [];
        var obj = {};
        obj.index = -1;
        obj.sort = '001';
        obj.massage = 'Merge & Append';
        $scope.shipmentHs.push(obj);
        $scope.option.index = '-1';
        $scope.btnOk = true;
        $rootScope.planData.shipmentPlanMain.shipmentPlanHs.forEach(function (v, i) {
            var date = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(v.planDate));
            if (!v.isRemove && v.tmp.visible) {
                var obj = {};
                obj.no = v.no;
                obj.index = i;
                obj.week = 'W' + v.planWeek + ': ' + date;
                obj.sort = (v.no < 10 ? '0' + v.no : v.no) + '-' + v.planDate + '-' + v.planWeek;
                obj.customer = v.tmp.customer;
                obj.port = v.tmp.port;
                obj.containerCode = v.containerCode;
                obj.status = v.tmp.statusDetail;
                obj.massage = 'Merge & Insert to plan ';
                $scope.shipmentHs.push(obj);
            }
        });
    }

    $scope.btnOk = true;

    $scope.option = {};
    $scope.option.index = '-1';

    $scope.monthChange = function (month) {
        $scope.SetWeek(month.month, true);
    }

    $scope.weekChange = function (week) {
        $scope.dtpPlan.val = angular.copy(week.shippingDay);
    }

    $scope.dtpChange = function (date) {
        $scope.btnOk = false;
        try {
            var planDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            for (var i = 0; i < $scope.months.length; i++) {
                if ($scope.months[i].month === date.getMonth() + 1) {
                    $scope.month.val = $scope.months[i];
                    $scope.SetWeek($scope.month.val.month, false);
                    break;
                }
            }
            for (var i = 0; i < $scope.weeks.length; i++) {
                if ($scope.weeks[i].startDate <= planDate && $scope.weeks[i].endDate >= planDate) {
                    $scope.week.val = $scope.weeks[i];
                    $scope.btnOk = true;
                    break;
                }
            }
            if (!$scope.btnOk) {
                $scope.week.val = [];
            }
        } catch (ex) {
            $scope.btnOk = false;
        }
    }

    $scope.SetWeek($scope.month.val.month, true);
    $scope.btnOk = false;

    $scope.ok = function () {
        //console.log($rootScope.weekPlan);
        ////return;

        var tmpd = new Date(new Date().setHours(0, 0, 0, 0));
        var currentweek = intersales.GetWeekPlan(tmpd.getMonth(), tmpd.getFullYear(), 0).find(x => { return x.startDate.getTime() <= tmpd.getTime() && x.endDate >= tmpd.getTime(); });
        //$rootScope.weekPlan.find(x => { return x.startDate.getTime() <= tmpd.getTime() && x.endDate >= tmpd.getTime(); });
        
        var warningchk = false;
        if (parseInt($scope.option.index) === -1 || $scope.option.index === undefined) {
            var planDate = new Date($scope.dtpPlan.val.getFullYear(), $scope.dtpPlan.val.getMonth(), $scope.dtpPlan.val.getDate());
            var objH = {};
            objH.id = null;
            
            objH.planDate = KSSClient.Engine.Common.GetDateString(planDate);
            objH.planWeek = $scope.week.val.weekNo;
            objH.containerCode = $scope.container.val.id;
            
            if (currentweek && (currentweek.weekNo < objH.planWeek || currentweek.month < $scope.week.val.month || currentweek.year < $scope.week.val.year )) {
                objH.shipmentPlanDs = [];
                objH.isAdd = true;
                objH.isRemove = false;
                objH.remark = { id: null, code: null, description: null, view: '' };
                objH.status = 'P';
                $scope.gridApi.grid.options.data.forEach(function (row) {
                    if (row.planBalance.quantity <= 0) {
                        warningchk = true;
                    } else {
                        objH.shipmentPlanDs.push(angular.copy(row));
                    }
                });
                $rootScope.planData.shipmentPlanMain.shipmentPlanHs.push(objH);
            } else {
                common.AlertMessage('Error', 'Cannot insert shipment plan.'); /* \n The shipment week must be greater than the current week. */
                return;
            }            
        } else {
            if ($rootScope.planData.shipmentPlanMain.shipmentPlanHs[parseInt($scope.option.index)].status === 'P'
                || $rootScope.planData.shipmentPlanMain.shipmentPlanHs[parseInt($scope.option.index)].status === 'N' || $rootScope.shipmentWeeklyPlan) {
                $scope.gridApi.grid.options.data.forEach(function (row) {
                    if (row.planBalance.quantity <= 0) {
                        warningchk = true;
                    } else {
                        $rootScope.planData.shipmentPlanMain.shipmentPlanHs[parseInt($scope.option.index)].shipmentPlanDs.push(angular.copy(row));
                    }
                });
                if (!warningchk && $rootScope.planData.shipmentPlanMain.shipmentPlanHs[parseInt($scope.option.index)].status === 'N') {
                    $rootScope.planData.shipmentPlanMain.shipmentPlanHs[parseInt($scope.option.index)].status = 'P';
                    $rootScope.planData.shipmentPlanMain.shipmentPlanHs[parseInt($scope.option.index)].shipmentPlanDs.forEach(function (n) {
                        n.id = null;
                    });
                }
            } else {
                common.AlertMessage('Warning', 'Can not Insert to Shipment Plan. Status: Approve, Pending for Approve.');
            }
        }  
        if (warningchk) {
            common.AlertMessage('Warning', 'Shipment Item is Quantity = 0, Will not be inserted.');
        }

        $uibModalInstance.close();
    };
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller("shipmentPlanManageController", function ($rootScope, $scope, $filter, $timeout, common, uiGridConstants, $uibModal, $q, intersales) {
    var modal = this;
    $scope.showOnlyCustomer = true;
    $rootScope.shipmentPlanShowOnlyCustomer = true;
    $rootScope.shipmentPlanManageController_changeChk = (show) => { $scope.showOnlyCustomer = show; }

    $scope.ChangeChk = function () {
        $rootScope.shipmentPlanShowOnlyCustomer = $scope.showOnlyCustomer;
        $scope.gridApi.selection.clearSelectedRows();
        $scope.chkAll = false;
        $scope.ChkChange();
        $scope.gridApi.grid.refresh();
        $rootScope.shipmentPlanOrderShippingList_refesh();

    }

    var GridClass = function (grid, row, col) {
        if (row.entity.tmp.status === 'O') {
            return 'text-danger';
        } else if (row.entity.tmp.status === 'F') {
            return 'text-primary';
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

    var expandable = '<div class="sub-grid none-multi-line" ui-grid="row.entity.subGridOpt" ui-grid-exporter ui-grid-selection ui-grid-move-columns ui-grid-cell-selection ui-grid-pinning ui-grid-edit ui-grid-cellNav ui-grid-resize-columns ui-grid-auto-resize style="max-height:300px; width: auto;"' +
        'ng-hide="row.entity.subGridOpt.data.length === 0" ng-style="{ height: row.entity.subGridOpt.height + \'px\', width: row.entity.subGridOpt.width + \'px\', \'margin-left\': row.entity.subGridOpt.margin + \'px\'}"></div>';

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, expandable: expandable, footer: true, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, setclass: GridClass, sort: false, filter: false, pinnedLeft: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planDate', display: 'Week', width: { min: 110 }, format: { type: 'customText' }, setclass: GridClass }));
    $scope.gridOpt.columnDefs[2].sort = { direction: uiGridConstants.ASC, priority: 0, };
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.lastAdmitDate', display: 'Last Admit Date', width: { min: 100 }, format: { type: 'datetime' }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs[3].sort = { direction: uiGridConstants.ASC, priority: 1, };
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.customer', display: 'Customers', width: { min: 100 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.port', display: 'Port', width: { min: 100 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Container', width: { min: 90 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.quantity', display: 'Quantity', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'toBeShipped', display: 'Being Planned Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.weight', display: 'Weight(KG)', width: { min: 100 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Being Planned Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.bale', display: 'Bales', width: { min: 60 }, setclass: GridClass, format: { type: 'decimal', scale: 0 }, group: { name: 'toBeShipped', display: 'Being Planned Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.volume', display: 'Volume', width: { min: 80 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Being Planned Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.value', display: 'Values', width: { min: 130 }, setclass: GridClass, format: { type: 'currency', scale: 2 }, group: { name: 'toBeShipped', display: 'Being Planned Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.valueBHT', display: 'Value(THB)', width: { min: 130 }, setclass: GridClass, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Being Planned Amount', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.paymentTerm', display: 'Term', width: { min: 130 }, setclass: GridClass, group: { name: 'payment', display: 'Payment', langCode: '' }/*, visible: false, hiding: false*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.payAmount', display: 'Pay Amount', width: { default: 130 }, format: { type: 'currency', scale: 2 }, setclass: GridClass, group: { name: 'payment', display: 'Payment', langCode: '' }/*, visible: false, hiding: false*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'portLoading.id', display: 'Booking Transport', width: { min: 95 }, format: { type: 'truefalse' }, setclass: GridClass, multiLine: true, filter: false, visible: false, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.stockVsPlan', display: '% Product Complete', width: { min: 95 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'tmpMulti', divi: 'tmpDivi' }, setclass: GridClass, multiLine: true/*, visible: false, hiding: false*/ }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark.view', display: 'Remark', edit: true, width: { min: 250 }, setclass: GridClass, format: { type: 'modal', func: 'RemarkPopup' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'volumeAdj', display: 'Volume', width: { min: 80 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'calAdj', display: 'Calculate ADJ', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'weightAdj', display: 'Weight', width: { min: 80 }, format: { type: 'decimal', scale: 2 }, setclass: GridClass, group: { name: 'calAdj', display: 'Calculate ADJ', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'calculateType', display: 'Auto Calculate By', width: { min: 100 }, setclass: GridClass, format: { type: 'customText' }, multiLine: true }));


    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.weightPerContainer', display: '% Weight Per Container', width: { min: 85 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'weightMulti', divi: 'weightDivi' }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.volumePerContainer', display: '% Volume Per Container', width: { min: 85 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'volumeMulti', divi: 'volumeDivi' }, setclass: GridClass, multiLine: true }));
   
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'statusApprove', display: 'Status Shipment', width: { min: 150 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.statusDetail', display: 'Status', width: { min: 300 }, setclass: GridClass }));
    
    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { return true; }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1);}
                });
                return numRow;
            } else if (myCol.field === "planDate") {
                return 'W' + myRow.entity.planWeek + ' : ' + KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(myRow.entity.planDate));
            } else if (myCol.field === "tmp.lastAdmitDate") {
                return KSSClient.Engine.Common.GetDateView(myRow.entity.tmp.lastAdmitDate);
            }
            else if (myCol.field === "tmp.statusDetail") {
                var tmp = '';
                if (myRow.entity.tmp.statusDetail && angular.isArray(myRow.entity.tmp.statusDetail)) {
                    myRow.entity.tmp.statusDetail.forEach(function (v, i) {
                        if (myRow.entity.tmp.statusDetail.length - 1 === i) { tmp += v; }
                        else { tmp += v + ', '; }
                    });
                }
                return tmp;
            } else if (myCol.field === "portLoading.id") {
                if (myRow.entity.portLoading) {
                    if (myRow.entity.portLoading.id) return 1;
                }
                return 2;
            } else if (myCol.field === "calculateType") {
                var tmp = null;
                if (myRow.entity.calculateType === 'V') { tmp = 'Volume'; }
                else if (myRow.entity.calculateType === 'W') { tmp = 'Weight'; }
                return tmp; 
            }
        }
        return false;
    };

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        $scope.ChkChange();
    };

    modal.ModalRemarkPopup = function (parentSelector) {
        var deferred = $q.defer();
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalRemarkPopupCtrl',
            size: 'md',
            appendTo: parentElem,
            //resolve: { remarkGroupData: function () { return $scope.remarkGroupData; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'RemarkPopupContent.html'
        });
        modalInstance.result.then((data) => { deferred.resolve(data); }, () => { deferred.resolve(); });
        return deferred.promise;
    };

    $scope.RemarkPopup = (row) => {
        modal.ModalRemarkPopup().then((data) => {
            var tmp = $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.indexOf(row.entity)];
            if (data) {
                tmp.remark = { id: data.id, code: data.code, description: data.description };
                tmp.remark.view = common.GetCodeDescription(data);
            } else {
                tmp.remark = { id: null, code: null, description: null, view: ''};
            }
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $rootScope.isChange = true;
        });
    }

    // --------------------------------------- subGrid -------------------------------------------------------

    var SubClassGrid = function (grid, row, col) {
        var cellClass = '';
        var tmp = col.name.split('.');
        var obj = angular.copy(row.entity);
        for (var i = 0; i < tmp.length; i++) {
            if (i === tmp.length - 1) {
                if (obj) {
                    if (obj[tmp[i] + 'org'] && obj[tmp[i] + 'org'] !== obj[tmp[i]]) {
                        cellClass += 'bg-warning ';
                    }
                }
            } else {
                obj = obj[tmp[i]];
            }
        }
        if (row.entity.tmp.status === 'N') {
            cellClass += 'text-danger ';
        }
        if (row.entity.tmp.orderStand.urgentFlag) { cellClass += 'text-danger '; }
        return cellClass;
    };

    $scope.subGridOpt = common.CreateGrid2({ mSelect: true, footer: true, checkAll: false, enableGridEdit: true });
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, setclass: SubClassGrid, sort: false, filter: false }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.orderCode', display: 'Order No', width: { min: 130 }, setclass: SubClassGrid }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.orderStand.itemno', display: 'PI Item No.', width: { min: 60 }, setclass: SubClassGrid, multiLine: true }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.orderStand.urgentFlag', display: 'Urgent', width: { min: 60 }, format: { type: 'truefalse' }, setclass: SubClassGrid, multiLine: true, filter: false }));

    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.productCode', display: 'Code', width: { min: 140 }, setclass: SubClassGrid, group: { name: 'product', display: 'Product', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.productDescription', display: 'Description', width: { min: 300 }, setclass: SubClassGrid, group: { name: 'product', display: 'Product', langCode: '' } }));

    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.quantity', display: 'Quantity', edit: true, width: { min: 100 }, setclass: SubClassGrid, format: { type: 'decimal', scale: 0 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.weight', display: 'Weight(KG)', edit: true, width: { min: 100 }, setclass: SubClassGrid, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.bale', display: 'Bales', edit: true, width: { min: 60 }, setclass: SubClassGrid, format: { type: 'decimal', scale: 0 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.volume', display: 'Volume', width: { min: 80 }, setclass: SubClassGrid, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.valuetmp', display: 'Values', width: { min: 130 }, setclass: SubClassGrid, format: { type: 'currency', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.valueBHT', display: 'Value(THB)', width: { min: 130 }, setclass: SubClassGrid, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being Planned Amount', langCode: '' } }));

    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.stockVsPlan', display: '% Stock vs Plan', width: { min: 85 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'tmpMulti', divi: 'tmpDivi' }, setclass: SubClassGrid, multiLine: true }));

    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.admitDate', display: 'Admit Date', width: { min: 100 }, format: { type: 'datetime' }, setclass: SubClassGrid, multiLine: true }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.maxAdmitDate', display: 'Max Admit Date', width: { min: 100 }, format: { type: 'datetime' }, setclass: SubClassGrid, multiLine: true }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'customer.code', display: 'Customer', width: { min: 100 }, setclass: SubClassGrid}));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.orderStand.deliveryDescription', display: 'Deliver Type', width: { min: 70 }, setclass: SubClassGrid, multiLine: true })); 

    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.statusDetail', display: 'Status', width: { min: 150 }, setclass: SubClassGrid }));
    
    $scope.subGridOpt.appScopeProvider = {
        cumulative: function (grid, myRow, myCol) {
            if (myCol.field === "headRow") { return true; }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            } else if (myCol.field === "tmp.admitDate") {
                if (myRow.entity.tmp) { return KSSClient.Engine.Common.GetDateView(myRow.entity.tmp.admitDate); }
                return '';
            } else if (myCol.field === "tmp.maxAdmitDate") {
                if (myRow.entity.tmp) { return KSSClient.Engine.Common.GetDateView(myRow.entity.tmp.maxAdmitDate); }
                return '';
            } else if (myCol.field === "tmp.orderStand.urgentFlag") {
                if (myRow.entity.tmp.orderStand.urgentFlag) { return 1; }
                return 2;
            }
            return false;
        }
        , orderAutoComplete: {
            value: ''
            , list: [{ id: 1, code: '1', description: 'aa' }, { id: 2, code: '2', description: 'bb' }]
            , func: function (key) {
                var tmp = $filter('filter')($scope.subGridOpt.appScopeProvider.orderAutoComplete.list, { 'code': key });
                if (tmp.length === 1) {
                    key = tmp[0].code;
                } 
            }
        }
        , AddRow: function (grid) {
            // add
            var obj = {};
            obj.id = null;
            obj.shipmentPlanMainID = null;
            obj.shipmentPlanOrderStandID = null;
            obj.customer = null;
            obj.planBalance = {};
            obj.planBalance.quantity = 0;
            obj.planBalance.weight = 0;
            obj.planBalance.bale = 0;
            obj.planBalance.value = 0;
            obj.status = 'A';
            obj.enableEdit = true;
            obj.isAdd = true;
            grid.options.data.push(obj);
            for (var i = 0; i < $scope.gridApi.grid.options.data.length; i++) {
                if ($scope.gridApi.grid.options.data[i].subGridOpt.subGridApi.grid.id === grid.id) {
                    $timeout(function () {
                        $scope.gridApi.grid.rows[i].entity.subGridOpt.subGridApi.cellNav.scrollToFocus(
                            $scope.gridApi.grid.options.data[i].subGridOpt.subGridApi.grid.options.data[$scope.gridApi.grid.options.data[i].subGridOpt.subGridApi.grid.options.data.length - 1]
                            , $scope.gridApi.grid.rows[i].entity.subGridOpt.subGridApi.grid.options.columnDefs[1]);
                        $scope.gridApi.grid.options.data[i].subGridOpt.subGridApi.core.scrollTo(
                            $scope.gridApi.grid.options.data[i].subGridOpt.subGridApi.grid.options.data[$scope.gridApi.grid.options.data[i].subGridOpt.subGridApi.grid.options.data.length - 2]
                            , $scope.gridApi.grid.options.data[i].subGridOpt.subGridApi.grid.options.columnDefs[1]);
                    }, 5);
                    break;
                }
            }
            grid.api.grid.refresh();
        }
    };

    $scope.FilterD = function (renderableRows) {
        renderableRows.forEach(function (row) {
            if (row.entity.status !== 'A') {
                row.visible = false;
            }
        });
        return renderableRows;
    };

    $scope.subGridOpt.onRegisterApi = function (gridApi) {
        $scope.subgridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_manage04');

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            for (var i = 0; i < $scope.gridApi.grid.rows.length; i++) {
                if ($scope.gridApi.grid.options.data[i].subGridOpt.subGridApi) {
                    if ($scope.gridApi.grid.options.data[i].subGridOpt.subGridApi.grid.id === gridApi.grid.id) {
                        if (gridApi.selection.getSelectedRows().length === gridApi.grid.rows.length) {
                            $scope.gridApi.grid.rows[i].isSelected = true;
                        } else {
                            $scope.gridApi.grid.rows[i].isSelected = false;
                        }
                        break;
                    }
                }
            }
            $scope.ChkChange();
        });

        gridApi.grid.registerRowsProcessor($scope.FilterD, 200);

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $rootScope.isChange = true;
            if (rowEntity.tmp.orderStand) {
                var x = 0;
                var keys = 'tmp.orderStand.toBeShipped';
                if (colDef.name === 'planBalance.quantity') {
                    x = common.GetObjVal(keys + '.quantity', rowEntity) <= 0 ? 1 : newValue / common.GetObjVal(keys + '.quantity', rowEntity);
                } else if (colDef.name === 'planBalance.weight') {
                    x = common.GetObjVal(keys + '.weight', rowEntity) <= 0 ? 1 : newValue / common.GetObjVal(keys + '.weight', rowEntity);
                } else if (colDef.name === 'planBalance.bale') {
                    x = common.GetObjVal(keys + '.bale', rowEntity) <= 0 ? 1 : parseInt(newValue) / common.GetObjVal(keys + '.bale', rowEntity);
                }

                rowEntity.planBalance.quantity = parseInt(common.GetObjVal(keys + '.quantity', rowEntity) * x);
                rowEntity.planBalance.weight = common.GetObjVal(keys + '.weight', rowEntity) * x;
                rowEntity.planBalance.bale = Math.ceil(common.GetObjVal(keys + '.bale', rowEntity) * x);
                rowEntity.planBalance.volume = common.GetObjVal(keys + '.volume', rowEntity) * x;
                rowEntity.planBalance.value = common.GetObjVal(keys + '.value', rowEntity) * x;
                rowEntity.planBalance.valuetmp = [{ num: rowEntity.planBalance.value, code: rowEntity.tmp.orderStand.currency.code }];
            }
            
            $scope.$apply();
            $scope.GenShipmentPlanData($scope.gridApi.grid.options.data);
            //$rootScope.shipmentPlanManage_SetData();
        });

    };
    
    //----------------------------- end subGrid --------------------------------//

    $scope.FilterH = function (renderableRows) {
        renderableRows.forEach(function (row) {
            if (row.entity.isRemove || row.entity.status === 'C') {
                row.visible = false;
            } else if ($scope.showOnlyCustomer) {
                var chk = true;
                if (angular.isArray(row.entity.tmp.customerIDs)) {
                    row.entity.tmp.customerIDs.forEach(function (v) {
                        if ($rootScope.planData.shipmentPlanMain) {
                            if (v === $rootScope.planData.shipmentPlanMain.customer.id) {
                                chk = false;
                            }
                        }
                    });
                }
                if (chk) { row.visible = false; row.entity.tmp.visible = false; }
            } else {
                var index = $scope.gridApi.grid.options.data.indexOf(row.entity);
                if ($scope.gridApi.grid.options.data[index].tmp) {
                    $scope.gridApi.grid.options.data[index].tmp.visible = true;
                }
            }
        });
        return renderableRows;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_manage05');
        // config grid
        $scope.gridApi.grid.headerHeight = 60;

        // grid action
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            //console.log(row);
            try {
                if (row.isSelected) {
                    $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.indexOf(row.entity)].subGridOpt.subGridApi.selection.selectAllRows();
                }
                else {
                    $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.indexOf(row.entity)].subGridOpt.subGridApi.selection.clearSelectedRows();
                }
            } catch (ex) {}
            $scope.ChkChange();
        });

        gridApi.grid.registerRowsProcessor($scope.FilterH, 200);

        $scope.$watch('gridApi.grid.gridWidth', function () {
            $scope.gridApi.grid.renderContainers.body.renderedRows.forEach(function (row) {
                if (row.isExpanded === true) {
                    row.entity.subGridOpt.width = $scope.gridApi.grid.gridWidth - ($scope.gridApi.grid.renderContainers.left.canvasWidth + 22);
                }
            });
        });

        $scope.$watch('gridApi.grid.renderContainers.body.prevScrollLeft', function () {
            $scope.gridApi.grid.renderContainers.body.renderedRows.forEach(function (row) {
                if (row.isExpanded === true) {
                    row.entity.subGridOpt.margin = ($scope.gridApi.grid.renderContainers.body.prevScrollLeft - $scope.gridApi.grid.renderContainers.body.columnOffset);
                    if (($scope.gridApi.grid.renderContainers.body.prevScrollLeft + row.entity.subGridOpt.width + 2) > $scope.gridApi.grid.renderContainers.body.canvasWidth) {
                        row.entity.subGridOpt.margin = $scope.gridApi.grid.renderContainers.body.canvasWidth - (row.entity.subGridOpt.width + $scope.gridApi.grid.renderContainers.body.columnOffset + 2);
                    }
                }
            });
        });

        gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
            if (!row.expandedRendered) {
                row.expandedRowHeight = 0;
                row.entity.subGridOpt.height = 0;
                row.entity.subGridOpt.width = row.grid.gridWidth - (row.grid.renderContainers.left.canvasWidth + 22);
                row.entity.subGridOpt.margin = (row.grid.renderContainers.body.prevScrollLeft - row.grid.renderContainers.body.columnOffset);

                var dataCount = 0;
                row.entity.subGridOpt.data.forEach(function (v) {
                    if (v.status === 'A') {
                        dataCount++;
                    }
                });
                row.expandedRowHeight = dataCount === 0 ? 0 : 64 + (dataCount * 30) + 18 + 30;
                if (row.expandedRowHeight > 300) {
                    row.expandedRowHeight = 300;
                }

                row.entity.subGridOpt.height = 63 + (dataCount * 30) + 18 + 30;
                $timeout(function () {
                    var index = $scope.gridApi.grid.options.data.indexOf(row.entity);
                    $scope.gridApi.grid.options.data[index].subGridOpt.subGridApi = $scope.subgridApi;
                    if (row.isSelected) {
                        $scope.gridApi.grid.options.data[index].subGridOpt.subGridApi.selection.selectAllRows();
                    }
                    $scope.gridApi.grid.options.data[index].subGridOpt.subGridApi.grid.refresh();
                }, 50);
            }
        });
    };

    $scope.GenShipmentPlanData = function (data) {
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        $scope.gridOpt.data = data;
        $rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands.forEach(function (row) {
            if (row.tmp) {
                row.tmp.plans = [];
                row.tmp.quantity = 0;
                row.tmp.weight = 0;
                row.tmp.bale = 0;
                row.tmp.volume = 0;
                row.tmp.value = 0;
                row.tmp.inventory = 0;
                if (row.saleUnitIsWei === 'Y') {
                    row.tmp.inventory = row.inventory.weight;
                } else if (row.saleUnitIsWei === 'N') {
                    row.tmp.inventory = row.inventory.quantity;
                }
            }
        });
        data.forEach(function (dataH) {
            var c_lastAdmitDate = undefined;
            var l_lastAdmitDate = undefined;
            dataH.tmp = {};
            dataH.tmp.visible = true;
            dataH.tmp.lastAdmitDate = '';
            dataH.tmp.customer = [];
            dataH.tmp.customerIDs = [];
            dataH.tmp.port = [];
            dataH.tmp.currency = [];
            dataH.tmp.quantity = 0;
            dataH.tmp.weight = 0;
            dataH.tmp.bale = 0;
            dataH.tmp.volume = 0;
            dataH.tmp.value = [];
            dataH.tmp.valueBHT = 0;
            dataH.tmp.planVsStock = 0;
            dataH.tmp.status = '';
            dataH.tmp.payAmount = [];
            dataH.tmp.paymentTerm = '';

            //*------------- chk D Dup ----------------//
            var dupIndex = [];
            dataH.shipmentPlanDs.forEach(function (dataD, index) {
                if (dataD.status === 'A' && !dataH.isRemove) {
                    var tmpIndex = [index];
                    for (var i = index + 1; i < dataH.shipmentPlanDs.length; i++) {
                        if (dataD.shipmentPlanOrderStandID === dataH.shipmentPlanDs[i].shipmentPlanOrderStandID && dataH.shipmentPlanDs[i].status === 'A') {
                            tmpIndex.push(i);
                        }
                    }
                    if (tmpIndex.length > 1) {
                        dupIndex.push(tmpIndex);
                    }
                }
            });
            dupIndex.forEach(function (v) {
                v.forEach(function (x, i) {
                    if (i !== 0) {
                        dataH.shipmentPlanDs[v[0]].planBalance.quantity += dataH.shipmentPlanDs[x].planBalance.quantity;
                        dataH.shipmentPlanDs[v[0]].planBalance.weight += dataH.shipmentPlanDs[x].planBalance.weight;
                        dataH.shipmentPlanDs[v[0]].planBalance.bale += dataH.shipmentPlanDs[x].planBalance.bale;
                        dataH.shipmentPlanDs[v[0]].planBalance.volume += dataH.shipmentPlanDs[x].planBalance.volume;
                        dataH.shipmentPlanDs[v[0]].planBalance.value += dataH.shipmentPlanDs[x].planBalance.value;
                        dataH.shipmentPlanDs[x].status = 'C';
                    }
                });
            });

            var isRemove = true, chkVolume = true, dMulti = 0, dDivi = 0, tmpIndexDel = [], tmpPaymentTerm = [], tmpPayAmount = [];
            dataH.shipmentPlanDs.forEach(function (dataD, index) {
                dataD.customer.view = common.GetCodeDescription(dataD.customer);
                dataD.enableEdit = true;
                dataD.tmp = {};
                var chk = false;
                if (dataD.status === 'A' && !dataH.isRemove) {
                    var orderStand = $filter('filter')($rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands, { status: 'A' }, true);
                    for (var i = 0; i < orderStand.length; i++) {
                        if (dataD.shipmentPlanOrderStandID === orderStand[i].id) {
                            dataD.tmp.orderStand = {};
                            dataD.tmp.orderStand = orderStand[i];
                            dataD.tmp.orderCode = dataD.tmp.orderStand.orderCode;
                            dataD.tmp.productCode = dataD.tmp.orderStand.product.code;
                            dataD.tmp.productDescription = dataD.tmp.orderStand.product.description;
                            dataD.tmp.admitDate = KSSClient.Engine.Common.CreateDateTime(dataD.tmp.orderStand.admitDate);
                            dataD.tmp.maxAdmitDate = KSSClient.Engine.Common.CreateDateTime(dataD.tmp.orderStand.maxAdmitDate);
                            dataD.tmp.valueBHT = dataD.planBalance.value * dataD.tmp.orderStand.valuePerUnit.cpb;

                            dataD.tmp.orderStand.tmp.quantity += dataD.planBalance.quantity;
                            dataD.tmp.orderStand.tmp.weight += dataD.planBalance.weight;
                            dataD.tmp.orderStand.tmp.bale += dataD.planBalance.bale;
                            dataD.tmp.orderStand.tmp.volume += dataD.planBalance.volume;
                            dataD.tmp.orderStand.tmp.value += dataD.planBalance.value;

                            dataD.planBalance.valuetmp = [{ num: dataD.planBalance.value, code: dataD.tmp.orderStand.currency.code }];

                            var chkPayment = true;
                            tmpPaymentTerm.forEach((p) => {
                                if (dataD.tmp.orderStand.paymentTerm === p) { chkPayment = false; }
                            });
                            if (chkPayment) { tmpPaymentTerm.push(dataD.tmp.orderStand.paymentTerm); }

                            chkPayment = true;
                            tmpPayAmount.forEach((p) => {
                                if (dataD.tmp.orderStand.piCode === p.piCode) { chkPayment = false; }
                            });
                            if (chkPayment) { tmpPayAmount.push({ piCode: dataD.tmp.orderStand.piCode, payAmount: dataD.tmp.orderStand.payAmount}); }

                            // chk volume
                            if (dataD.planBalance.volume <= 0) {
                                chkVolume = false;
                            }

                            dataD.tmpMulti = dataD.tmp.orderStand.tmp.inventory;
                            dMulti += dataD.tmp.orderStand.tmp.inventory;
                            var inv = 0;
                            if (dataD.tmp.orderStand.saleUnitIsWei === 'Y') {
                                inv = dataD.tmp.orderStand.tmp.inventory / dataD.planBalance.weight;
                                dataD.tmpDivi = dataD.planBalance.weight;
                                dDivi += dataD.planBalance.weight;
                                dataD.tmp.orderStand.tmp.inventory = (dataD.tmp.orderStand.tmp.inventory - dataD.planBalance.weight < 0 ? 0 : dataD.tmp.orderStand.tmp.inventory - dataD.planBalance.weight);
                            } else if (dataD.tmp.orderStand.saleUnitIsWei === 'N') {
                                inv = dataD.tmp.orderStand.tmp.inventory / dataD.planBalance.quantity;
                                dataD.tmpDivi = dataD.planBalance.quantity;
                                dDivi += dataD.planBalance.quantity;
                                dataD.tmp.orderStand.tmp.inventory = (dataD.tmp.orderStand.tmp.inventory - dataD.planBalance.quantity < 0 ? 0 : dataD.tmp.orderStand.tmp.inventory - dataD.planBalance.quantity);
                            }
                            //if (inv > 1) { inv = 1; }
                            dataD.tmp.stockVsPlan = inv * 100;

                            dataD.tmp.status = 'Y';
                            dataD.tmp.statusDetail = 'Can be arranged.';

                            var tmpP = 'W' + dataH.planWeek + ' : ' + KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(dataH.planDate));
                            if (dataD.tmp.orderStand.tmp.plans.length === 0) {
                                dataD.tmp.orderStand.tmp.plans.push(tmpP);
                            } else {
                                dataD.tmp.orderStand.tmp.plans.forEach(function (p) {
                                    if (p !== tmpP) { dataD.tmp.orderStand.tmp.plans.push(tmpP); }
                                });
                            }

                            if (
                                dataD.tmp.orderStand.toBeShipped.quantity < dataD.planBalance.quantity
                                || dataD.tmp.orderStand.toBeShipped.weight < dataD.planBalance.weight
                                || dataD.tmp.orderStand.toBeShipped.bale < dataD.planBalance.bale
                                || dataD.tmp.orderStand.toBeShipped.volume < dataD.planBalance.volume
                                || dataD.tmp.orderStand.toBeShipped.value < dataD.planBalance.value
                            ) {
                                dataD.tmp.status = 'N';
                                dataD.tmp.statusDetail = 'Can not be arranged.';
                            }

                            //set H

                            if (dataD.tmp.orderStand.deliveryType === 'L') {
                                var d = KSSClient.Engine.Common.CreateDateTime(dataD.tmp.orderStand.maxAdmitDate);
                                if (l_lastAdmitDate === undefined || l_lastAdmitDate < d) {
                                    l_lastAdmitDate = d;
                                }
                            } else if (dataD.tmp.orderStand.deliveryType === 'C') {
                                var d = KSSClient.Engine.Common.CreateDateTime(dataD.tmp.orderStand.admitDate);
                                if (c_lastAdmitDate === undefined || c_lastAdmitDate < d) {
                                    c_lastAdmitDate = d;
                                }
                            }

                            //dataH.tmp.port = dataD.tmp.orderStand.customer.portCode;
                            var tmpPort = dataD.tmp.orderStand.customer.portCode;
                            if (dataH.tmp.port.length === 0) {
                                dataH.tmp.port.push(tmpPort);
                            } else {
                                var chk = true;
                                dataH.tmp.port.forEach(function (c) { if (c === tmpPort) { chk = false; } });
                                if (chk) { dataH.tmp.port.push(tmpPort); }
                            }

                            var tmpCustomer = dataD.customer.code;
                            if (dataH.tmp.customer.length === 0) {
                                dataH.tmp.customer.push(tmpCustomer);
                                dataH.tmp.customerIDs.push(dataD.customer.id);
                            } else {
                                var chk = true;
                                dataH.tmp.customer.forEach(function (c) {
                                    if (c === tmpCustomer) { chk = false; }
                                });
                                if (chk) {
                                    dataH.tmp.customer.push(tmpCustomer);
                                    dataH.tmp.customerIDs.push(dataD.customer.id);
                                }
                            }

                            dataH.tmp.valueBHT += dataD.tmp.valueBHT;

                            var tmpCurrency = dataD.tmp.orderStand.currency.code;
                            if (dataH.tmp.currency.length === 0) {
                                dataH.tmp.currency.push(tmpCurrency);
                            } else {
                                var chk = true;
                                dataH.tmp.currency.forEach(function (c) {
                                    if (c === tmpCurrency) { chk = false; }
                                });
                                if (chk) {
                                    dataH.tmp.currency.push(tmpCurrency);
                                }
                            }

                            dataH.tmp.quantity += dataD.planBalance.quantity;
                            dataH.tmp.weight += dataD.planBalance.weight;
                            dataH.tmp.bale += dataD.planBalance.bale;
                            dataH.tmp.volume += dataD.planBalance.volume;

                            if (dataH.tmp.value.length === 0) {
                                dataH.tmp.value.push({ num: dataD.planBalance.value, code: dataD.tmp.orderStand.currency.code });
                            } else {
                                var chkxxx = true;
                                for (var ix = 0; ix < dataH.tmp.value.length; ix++) {
                                    if (dataH.tmp.value[ix].code === dataD.tmp.orderStand.currency.code) {
                                        dataH.tmp.value[ix].num += dataD.planBalance.value;
                                        chkxxx = false;
                                        break;
                                    }
                                }
                                if (chkxxx) {
                                    dataH.tmp.value.push({ num: dataD.planBalance.value, code: dataD.tmp.orderStand.currency.code });
                                }
                            }

                            chk = true;
                            isRemove = false;
                            break;
                        }
                    }
                }
                if (!chk) {
                    if (dataD.isAdd) {
                        tmpIndexDel.push(index);
                    }
                    dataD.status = 'C';
                }
            });
            
            for (var j = tmpIndexDel.length - 1; j >= 0; j--) {
                dataH.shipmentPlanDs.splice(tmpIndexDel[j], 1);
            }
            
            if (isRemove) {
                dataH.isRemove = true;
                dataH.status = 'C';
            }

            //set join array
            dataH.tmp.customer = dataH.tmp.customer.join(', ');
            dataH.tmp.port = dataH.tmp.port.join(', ');
            
            var containerSizeWeight = 0;
            var containerSizeVolume = 0;
            for (var i = 0; i < $rootScope.containerList.length; i++) {
                if (dataH.containerCode === $rootScope.containerList[i].code) {
                    containerSizeWeight = $rootScope.containerList[i].maxSizeKg;
                    containerSizeVolume = $rootScope.containerList[i].maxSizeVolume;
                    break;
                }
            }
            var sumSize = (dataH.tmp.weight / containerSizeWeight);
            if (chkVolume) {
                sumSize = (dataH.tmp.volume / containerSizeVolume);
            } 
            dataH.tmp.statusDetail = [];
            if (sumSize >= 0.95 && sumSize <= 1.05) {
                dataH.tmp.status = 'F';
                dataH.tmp.statusDetail.push('Full container.');
            } else if (sumSize <= 0.95) {
                dataH.tmp.status = 'N';
                dataH.tmp.statusDetail.push('Not full container.');
            } else if (sumSize >= 1.05) {
                dataH.tmp.status = 'O';
                dataH.tmp.statusDetail.push('Volume/Weight exceeded container.');
            } 

            // Set Status

            if (dataH.status === 'P') {
                dataH.statusApprove = 'Work In Progress.';
            } else if (dataH.status === 'S') {
                dataH.statusApprove = 'Pending for Approval by RG.MNG';
            } else if (dataH.status === 'W') {
                dataH.statusApprove = 'Pending for Approval by MNG';
            } else if (dataH.status === 'A') {
                dataH.statusApprove = 'Approved.';
            } else if (dataH.status === 'N') {
                dataH.statusApprove = 'Not Approved.';
            } else {
                dataH.statusApprove = 'Remove.';
            }

            // h % set
            dataH.weightMulti = dataH.tmp.weight;
            dataH.weightDivi = containerSizeWeight;
            dataH.tmp.weightPerContainer = (dataH.weightMulti / dataH.weightDivi) * 100;

            dataH.volumeMulti = dataH.tmp.volume;
            dataH.volumeDivi = containerSizeVolume;
            dataH.tmp.volumePerContainer = (dataH.volumeMulti / dataH.volumeDivi) * 100;

            dataH.tmpMulti = dMulti;
            dataH.tmpDivi = dDivi;
            dataH.tmp.stockVsPlan = (dMulti / dDivi) * 100;

            if (dataH.tmp.weightPerContainer > 100) {
                dataH.tmp.statusDetail.push('Weight exceeded container.');
            } 

            if (dataH.tmp.volumePerContainer > 100) {
                dataH.tmp.statusDetail.push('Volume exceeded container.');
            } else if (dataH.tmp.volumePerContainer <= 0) {
                dataH.tmp.statusDetail.push('Volume Per Container = 0.');
            }

            dataH.tmp.statusDetail = dataH.tmp.statusDetail.join(", ");

            // set pay Amount
            tmpPayAmount.forEach((p) => {
                if (angular.isArray(p.payAmount)) {
                    p.payAmount.forEach((c) => {
                        var chk = true;
                        dataH.tmp.payAmount.forEach((n) => {
                            if (n.code === c.code) {
                                n.num += c.num;
                                chk = false;
                                return;
                            }
                        });
                        if (chk) { dataH.tmp.payAmount.push(c); }
                    });
                }
            });

            // set paymentTerm
            dataH.tmp.paymentTerm = tmpPaymentTerm.join(", "); 

            if (l_lastAdmitDate !== undefined && c_lastAdmitDate !== undefined) {
                if (l_lastAdmitDate > c_lastAdmitDate) { dataH.tmp.lastAdmitDate = l_lastAdmitDate; }
                else { dataH.tmp.lastAdmitDate = c_lastAdmitDate; }
            } else if (l_lastAdmitDate !== undefined) { dataH.tmp.lastAdmitDate = l_lastAdmitDate; }
            else if (c_lastAdmitDate !== undefined) { dataH.tmp.lastAdmitDate = c_lastAdmitDate; }
            else { dataH.tmp.lastAdmitDate = ''; }

            if (dataH.status === 'P' || dataH.status === 'N' || $rootScope.shipmentWeeklyPlan) {
                dataH.enableEdit = true;
            }
            if(dataH.remark) dataH.remark.view = common.GetCodeDescription(dataH.remark);
            if (dataH.tmp.customerIDs.length > 1) {
                $scope.showOnlyCustomer = false;
            }
        });
        // reload gird datachang
        //$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

        if (!$scope.showOnlyCustomer) $scope.ChangeChk();
        else $rootScope.shipmentPlanOrderShippingList_refesh();

        $scope.ChkChange();
        
    }

    $rootScope.shipmentPlanManage_SetData = function () {

        if ($rootScope.shipmentWeeklyPlan) {
            $scope.gridApi.grid.options.columnDefs.forEach((c) => {
                if (c.field === 'portLoading.id') {
                    c.visible = true;
                    c.enableHiding = true;
                    return;
                }
            });
        }

        $scope.chkAll = false;
        $scope.ChkChange();
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.rows.forEach(function (row) {
            row.isExpanded = false;
            row.isSelected = false;
        });
        $rootScope.planData.shipmentPlanMain.shipmentPlanHs.forEach(function (row) {
            row.isRemove = false;
            row.subGridOpt = angular.copy($scope.subGridOpt);
            row.shipmentPlanDs.forEach(function (d) {
                d.planBalance.quantityorg = d.planBalance.quantity;
                d.planBalance.weightorg = d.planBalance.weight;
                d.planBalance.baleorg = d.planBalance.bale;
                d.planBalance.valueorg = d.planBalance.value;
            });
            row.subGridOpt.data = row.shipmentPlanDs;
        });
        $scope.GenShipmentPlanData($rootScope.planData.shipmentPlanMain.shipmentPlanHs);

        $timeout(function () {
            $scope.gridOpt.data = $rootScope.planData.shipmentPlanMain.shipmentPlanHs;
            $scope.gridApi.grid.refresh();
        }, 5);
    }

    $scope.btnReplace = false;

    $scope.ChkChange = function () {
        try {
            $scope.btnReplace = false;
            if ($scope.gridApi.selection.getSelectedRows().length === 1) $scope.btnReplace = true;
            if ($scope.gridApi.selection.getSelectedRows().length !== 0) {
                $scope.chkSel = true;
            } else {
                $scope.chkSel = false;
                for (var i = 0; i < $scope.gridApi.grid.rows.length; i++) {
                    if ($scope.gridApi.grid.rows[i].isExpanded) {
                        if ($scope.gridApi.grid.rows[i].entity.subGridOpt.subGridApi.selection.getSelectedRows().length !== 0) {
                            $scope.chkSel = true;
                        }
                    }
                }
            }
        } catch (ex) {}
        //$scope.gridApi.grid.refresh();  
    }

    $scope.RemovePlan = function () {
        var txtdel = '', chk = false;
        $scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach(function (row, i) {
            if (row.isSelected) {
                if (!row.entity.isRemove) {
                    if (!(row.entity.status === 'P' || row.entity.status === 'N' || $rootScope.shipmentWeeklyPlan)) { chk = true; }
                    txtdel += '#' + row.entity.no + ' ' + 'W' + row.entity.planWeek + ' : ' + KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.entity.planDate)) + '\n';
                }
            }
            else {
                if ($scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi) {
                    $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.selection.getSelectedRows().forEach(function (d) {
                        if (!(row.entity.status === 'P' || row.entity.status === 'N' || $rootScope.shipmentWeeklyPlan)) { chk = true; }
                        txtdel += '   ' + d.tmp.orderCode + ' ' + d.tmp.productCode + '\n';
                    });
                }
            }
        });

        if (chk) {
            common.AlertMessage('Warning', 'Can not Remove Plan. Status: Approve, Pending for Approve.');
            return false;
        }

        swal({
            title: "Are you sure?",
            text: "Remove Plan : \n" + txtdel,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                $rootScope.isChange = true;
                var chk = false;
                $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                    var index = $scope.gridApi.grid.options.data.indexOf(row);
                    if ($scope.gridApi.grid.options.data[index].isAdd) {
                        $scope.gridApi.grid.options.data.splice(index, 1);
                    } else {
                        var tmpIndex = [];
                        $scope.gridApi.grid.options.data[index].isRemove = true;
                        $scope.gridApi.grid.options.data[index].status = 'C';
                        $scope.gridApi.grid.options.data[index].shipmentPlanDs.forEach(function (d, i) {
                            if (d.isAdd) {
                                tmpIndex.push(i);
                            }
                            d.status = 'C';
                        });
                        for (var j = tmpIndex.length - 1; j >= 0; j--) {
                            $scope.gridApi.grid.options.data[index].shipmentPlanDs.splice(tmpIndex[j], 1);
                        }
                    }
                    chk = true;
                });
                $scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (row.isSelected) row.isSelected = false;
                });
                
                for (var i = 0; i < $scope.gridApi.grid.renderContainers.body.visibleRowCache.length; i++) {
                    var chkNotAppv = false;
                    if ($scope.gridApi.grid.renderContainers.body.visibleRowCache[i].isExpanded) {
                        var tmpIndex = [];
                        $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.selection.getSelectedRows().forEach(function (row) {
                            if ($scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.status === 'N') {
                                $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.status = 'P';
                                chkNotAppv = true;
                            } 
                            var index = $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.grid.options.data.indexOf(row);
                            var obj = $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.grid.options.data[index];
                            if (obj.isAdd) {
                                tmpIndex.push(index);
                            } else {
                                obj.status = 'C';
                            }
                            chk = true;
                        });
                        for (var j = tmpIndex.length - 1; j >= 0; j--) {
                            $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.grid.options.data.splice(tmpIndex[j], 1);
                        }
                        //$scope.gridApi.grid.rows[i].entity.subGridOpt.subGridApi.grid.refresh();
                    }
                    if (chkNotAppv) {
                        $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.grid.options.data.forEach(function (d) {
                            d.id = null;
                        });
                    }
                }
                
                $scope.gridApi.selection.clearSelectedRows();
                //$scope.GenShipmentPlanData($scope.gridApi.grid.options.data);
                $rootScope.shipmentPlanManage_SetData();
                $scope.ChkChange();
            }
        });
    }

    $rootScope.ShipmentPlanRemove = function (obj) {
        var tmpIndex1 = [];
        obj.forEach(function (row, index) {
            var iDel = $scope.gridApi.grid.options.data.indexOf(row);
            if (row.isAdd) {
                tmpIndex1.push(iDel);
            } else {
                row.isRemove = true;
                var tmpIndex2 = [];
                $scope.gridApi.grid.options.data[iDel].shipmentPlanDs.forEach(function (d, i) {
                    if (d.isAdd) {
                        tmpIndex2.push(i);
                    } else {
                        //if ($rootScope.planData.shipmentPlanMain.customer.id === d.customer.id) {
                            d.status = 'C';
                        //}
                    }
                });
                for (var j = tmpIndex2.length - 1; j >= 0; j--) {
                    $scope.gridApi.grid.options.data[iDel].shipmentPlanDs.splice(tmpIndex2[j], 1);
                }
            }
        });
        for (var j = tmpIndex1.length - 1; j >= 0; j--) {
            $scope.gridApi.grid.options.data.splice(tmpIndex1[j], 1);
        }
        $scope.ChkChange();
    }

    $rootScope.ShipmentPlanRemove2 = function (row) {
        var iDel = $scope.gridApi.grid.options.data.indexOf(row);
        if (row.isAdd) {
            $scope.gridApi.grid.options.data.splice(iDel, 1);
        } else {
            //row.isRemove = true;
            var tmpIndex = [];
            $scope.gridApi.grid.options.data[iDel].shipmentPlanDs.forEach(function (d, i) {
                if (d.isAdd) {
                    tmpIndex.push(i);
                    
                } else {
                    d.status = 'C';
                }
            });
            for (var j = tmpIndex.length - 1; j >= 0; j--) {
                $scope.gridApi.grid.options.data[iDel].shipmentPlanDs.splice(tmpIndex[j], 1);
            }
        }
    }
    
    $scope.GenSelect = function () {
        var selData = [];
        $scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach(function (row, i) {
            var chk = false;
            var obj = {};
            obj.no = row.entity.no;
            obj.week = 'W' + row.entity.planWeek + ' : ' + KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.entity.planDate));
            obj.containerCode = row.entity.containerCode;
            obj.shipmentPlanDs = [];
            if (row.isSelected) {
                chk = true;
                var index = $scope.gridApi.grid.options.data.indexOf(row.entity);
                $scope.gridApi.grid.options.data[index].shipmentPlanDs.forEach(function (d) {
                    if (d.status === 'A') {
                        obj.shipmentPlanDs.push(d);
                    }
                });
            }
            else {
                if ($scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi) {
                    $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.selection.getSelectedRows().forEach(function (d) {
                        chk = true;
                        obj.shipmentPlanDs.push(d);
                    });
                }
            }
            if (chk) {
                selData.push(obj);
            }
        });
        return selData;
    }

    $scope.MoveShipmentPlan = function (dataH, append, nextMonth) {
        var chkAppv = false;
        $scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach(function (row, i) {
            var chk = false;
            var tmpD = [];
            if (row.isSelected) {
                //if (row.entity.status === 'P' || row.entity.status === 'N' || $rootScope.shipmentWeeklyPlan) {
                    
                    var index = $scope.gridApi.grid.options.data.indexOf(row.entity);
                    $scope.gridApi.grid.options.data[index].shipmentPlanDs.forEach(function (d) {
                        if (d.status === 'A') {
                            var objD = angular.copy(d);
                            objD.id = null;
                            /*if (row.entity.status === 'N') {
                                objD.id = null;
                            }*/
                            tmpD.push(objD);
                        }
                    });
                    $rootScope.ShipmentPlanRemove2($scope.gridApi.grid.options.data[index]);
                    chk = true;
                //} else {
                //    chkAppv = true;
                //}
            }
            else {
                if ($scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi) {
                    $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.selection.getSelectedRows().forEach(function (d) {
                        if (row.entity.status === 'P' || row.entity.status === 'N' || $rootScope.shipmentWeeklyPlan) {
                            var index = $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.grid.options.data.indexOf(d);
                            var obj = $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.grid.options.data[index];
                            var objD = angular.copy(obj);
                            objD.id = null;
                            //if (row.entity.status === 'N') {
                            //    objD.id = null;
                            //}
                            tmpD.push(objD);
                            if (obj.isAdd) {
                                $scope.gridApi.grid.renderContainers.body.visibleRowCache[i].entity.subGridOpt.subGridApi.grid.options.data.splice(index, 1);
                            } else {
                                obj.status = 'C';
                            }
                            chk = true;
                        } else {
                            chkAppv = true;
                        }
                        
                    });
                }
            }
            if (chk) {
                if (append) {
                    dataH.shipmentPlanDs = angular.copy(tmpD);
                    if (angular.isUndefined(nextMonth)) $rootScope.planData.shipmentPlanMain.shipmentPlanHs.push(angular.copy(dataH));
                    else nextMonth.shipmentPlanHs.push(angular.copy(dataH));
                } else {
                    tmpD.forEach(function (v) {
                        dataH.shipmentPlanDs.push(v);
                    });
                }
            }
        });
        if (chkAppv) {
            common.AlertMessage('Warning', 'Can not Move to Plan. Status: Approve, Pending for Approve.');
            return false;
        } 
        $scope.gridApi.selection.clearSelectedRows();
        return true;
    }

    modal.ModalMoveShipmentPlan = function (parentSelector) {
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalMoveShipmentPlanCtrl',
            size: 'lg',
            appendTo: parentElem,
            resolve:
            {
                data: function () {
                    return $scope.GenSelect();
                }
            },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'MoveShipmentPlanContent.html'
        });

        modalInstance.result.then(function (data) {
            $rootScope.isChange = true;
            var chk = false;
            var tmpd = new Date(new Date().setHours(0, 0, 0, 0));

            var currentweek = intersales.GetWeekPlan(tmpd.getMonth(), tmpd.getFullYear(), 0).find(x => { return x.startDate.getTime() <= tmpd.getTime() && x.endDate >= tmpd.getTime(); });

            if (data.option.index < 0) {
                var planDate = new Date(data.planDate.getFullYear(), data.planDate.getMonth(), data.planDate.getDate());
                chk = true;

                var tmp0 = new Date(2000, 1, 1);
                $scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach(function (row, i) {
                    if (row.isSelected) {
                        var tmp1 = KSSClient.Engine.Common.CreateDateTime(row.entity.planDate);
                        if (tmp0.getTime() < tmp1.getTime()) {
                            tmp0 = tmp1;
                        }
                    }
                });
                var SourceWeek = $rootScope.weekPlan.find(x => { return x.startDate.getTime() <= tmp0.getTime() && x.endDate >= tmp0.getTime(); });

                if (SourceWeek && (currentweek.weekNo < SourceWeek.weekNo || currentweek.month < SourceWeek.month) && (currentweek.weekNo < data.week.weekNo || currentweek.month < data.week.month ) ) {
                    var objH = {}; //destination
                    objH.id = null;
                    objH.planDate = KSSClient.Engine.Common.GetDateString(planDate);
                    objH.planWeek = data.week.weekNo;
                    objH.containerCode = data.container.id;
                    objH.shipmentPlanDs = [];
                    objH.isAdd = true;
                    objH.isRemove = false;
                    objH.remark = { id: null, code: null, description: null, view: '' };
                    objH.status = 'P';

                    var nextMonth = undefined;
                    if (data.planDate.getMonth() + 1 !== $rootScope.planData.shipmentPlanMain.planMonth) {
                        $rootScope.planData.shipmentPlanMoves.forEach((v) => {
                            if (v.planMonth === data.planDate.getMonth() + 1 && v.planYear === data.planDate.getFullYear()) {
                                nextMonth = v;
                                return;
                            }
                        });
                        if (!nextMonth) {
                            nextMonth = { id: 0, planType: 'M', planMonth: data.planDate.getMonth() + 1, planYear: data.planDate.getFullYear(), shipmentPlanHs: [], shipmentPlanOrderStands: [] };
                            $rootScope.planData.shipmentPlanMoves.push(nextMonth);
                        }
                    }
                    if (data.index === -2) {
                        $scope.MoveShipmentPlan(objH, true, nextMonth);
                    } else {
                        if (angular.isUndefined(nextMonth)) $rootScope.planData.shipmentPlanMain.shipmentPlanHs.push(objH);
                        else nextMonth.shipmentPlanHs.push(objH);
                        $scope.MoveShipmentPlan(objH);
                    }
                    if (!angular.isUndefined(nextMonth)) {
                        objH.shipmentPlanDs.forEach((o) => {
                            nextMonth.shipmentPlanOrderStands.push(angular.copy(o.tmp.orderStand));
                            o.tmp = {};
                        });
                    }  
                    
                } else {
                    common.AlertMessage('Error', 'Cannot move shipment plan.');
                    return;
                }
            } else {
                if ($rootScope.planData.shipmentPlanMain.shipmentPlanHs[data.option.index].status === 'P'
                    || $rootScope.planData.shipmentPlanMain.shipmentPlanHs[data.option.index].status === 'N' || $rootScope.shipmentWeeklyPlan) {

                    if ($scope.MoveShipmentPlan($rootScope.planData.shipmentPlanMain.shipmentPlanHs[data.option.index])) {
                        if ($rootScope.planData.shipmentPlanMain.shipmentPlanHs[data.option.index].status === 'N') {
                            $rootScope.planData.shipmentPlanMain.shipmentPlanHs[data.option.index].status = 'P';
                            $rootScope.planData.shipmentPlanMain.shipmentPlanHs[data.option.index].shipmentPlanDs.forEach(function (n) {
                                n.id = null;
                            });
                        }
                    }

                } else {
                    common.AlertMessage('Warning', 'Can not Move to Plan. Status: Approve, Pending for Approve.');
                }
            }
            $rootScope.shipmentPlanManage_SetData();
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.MovePlan = function () {
        modal.ModalMoveShipmentPlan();
    }

    $scope.ReplacePlan = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ReplacePlanCtrl',
            size: 'lg',
            appendTo: undefined,
            //resolve: { remarkGroupData: function () { return $scope.remarkGroupData; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'ReplacePlanContent.html'
        });
        modalInstance.result.then((data) => {
            var chk = true;
            if (data.containerCode) {
                data.containerCode = data.containerCode.trim();
                $rootScope.containerList.forEach((c) => { if (c.code === data.containerCode) { chk = false; return;}  });
            }
            if (chk) { data.containerCode = undefined; }

            $scope.gridApi.selection.getSelectedRows().forEach((h) => {
                h.planWeek = data.shipmentWeek;
                h.planDate = data.shipmentDate;
                if (!angular.isUndefined(data.containerCode)) {
                    h.containerCode = data.containerCode ;
                }
                h.shipmentPlanDs.forEach((v) => {
                    v.status = 'C';
                });
                data.shipmentDs.forEach((v) => {
                    h.shipmentPlanDs.push({
                        customer: angular.copy(v.customer)
                        , enableEdit: true
                        , isAdd: true
                        , id: null
                        , planBalance: angular.copy(v.packList)
                        , shipmentPlanMainID: $rootScope.planData.shipmentPlanMain.id
                        , shipmentPlanOrderStandID: v.tmp.orderStand.id
                        , status: 'A'
                    });
                });
            });
            $rootScope.isChange = true;
            $rootScope.shipmentPlanOrderShippingList_setData();
        }, () => { });
    };

    $scope.RecalculateAction = () => {
        var tmp = $scope.gridApi.selection.getSelectedRows();
        
        if (tmp.length) {
            tmp = tmp[tmp.length - 1];
            if ($rootScope.shipmentWeeklyPlan || tmp.status === 'P') {
                $scope.Recalculate();
            } else {
                common.AlertMessage('Warning', 'Can not Recalculate Plan. Status: Approve, Pending for Approve.');
            }
        }
    }

    $scope.Recalculate = () => {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ShipmentRecalculatePlanCtrl',
            size: 'smc',
            appendTo: undefined,
            resolve: { data: function () { return $scope.gridApi.selection.getSelectedRows(); } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'RecalculatePlanContent.html'
        });
        modalInstance.result.then((data) => {

            var sel = $scope.gridApi.selection.getSelectedRows();
            sel = sel[sel.length - 1];

            var tmp = [];

            var chk = false;
            $scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach((row, i) => {
                if (row.entity.$$hashKey === sel.$$hashKey) { chk = true; }
                if (chk && row.entity.planDate >= sel.planDate && ($rootScope.shipmentWeeklyPlan || row.entity.status === 'P') ) { tmp.push(row.entity); }
            });

            tmp = $filter('orderBy')(tmp, 'planDate');

            var tmpdata = {}, tmpOutstanding = [];
            tmpdata.id = $rootScope.planData.shipmentPlanMain.id;
            tmpdata.code = $rootScope.planData.shipmentPlanMain.code;
            tmpdata.planType = $rootScope.planData.shipmentPlanMain.planType;
            tmpdata.planMonth = $rootScope.planData.shipmentPlanMain.planMonth;
            tmpdata.planYear = $rootScope.planData.shipmentPlanMain.planYear;
            tmpdata.customer = angular.copy($rootScope.planData.shipmentPlanMain.customer);
            tmpdata.shipmentPlanOrderStands = [];
            tmpdata.shipmentPlanHs = [];

            tmp.forEach((h, i) => {
                tmpdata.shipmentPlanHs.push({
                    planDate: h.planDate
                    , planWeek: h.planWeek
                    , portLoading: h.portLoading
                    , refID: h.refID
                    , containerCode: i === 0 ? data.container : h.containerCode
                    , calculateType: i === 0 ? data.calc : h.calculateType
                    , volumeAdj: i === 0 ? data.volume : h.volumeAdj
                    , weightAdj: i === 0 ? data.weight : h.weightAdj
                    , status: h.status
                    , remark: h.remark
                    , customerIDs: h.tmp.customerIDs
                    //, shipmentPlanDs: h.shipmentPlanDs
                });

                h.shipmentPlanDs.forEach((d) => {
                    if (d.status === 'A') {
                        d.tmp.orderStand.tmp.quantity -= d.planBalance.quantity;
                        d.tmp.orderStand.tmp.weight -= d.planBalance.weight;
                        d.tmp.orderStand.tmp.bale -= d.planBalance.bale;
                        d.tmp.orderStand.tmp.volume -= d.planBalance.volume;
                        d.tmp.orderStand.tmp.value -= d.planBalance.value;
                    }
                });
            });
            
            $rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands.forEach(function (row) {
                if (row.status === 'A') {
                    if (!(row.toBeShipped.quantity - row.tmp.quantity <= 0 /*|| row.toBeShipped.weight - row.tmp.weight <= 0 || row.toBeShipped.bale - row.tmp.bale <= 0*/) ) {
                        var tmp = angular.copy(row);
                        tmp.customer = { id: row.customer.id };
                        tmp.id = row.id;
                        tmp.mainID = tmpdata.id;
                        tmp.toBeShipped.quantity = row.toBeShipped.quantity - row.tmp.quantity;
                        tmp.toBeShipped.weight = row.toBeShipped.weight - row.tmp.weight;
                        tmp.toBeShipped.bale = row.toBeShipped.bale - row.tmp.bale;
                        tmp.toBeShipped.volume = row.toBeShipped.volume - row.tmp.volume;
                        tmp.toBeShipped.value = row.toBeShipped.value - row.tmp.value;
                        tmpdata.shipmentPlanOrderStands.push(tmp);
                    }
                }
            });

            //console.log(tmpdata);
            KSSClient.API.ShipmentPlan.RecalculatePlan({
                data: { shipmentPlanMain: tmpdata },
                callback: (res) => {
                    if (res.data.shipmentPlanHs.length) {
                        tmp.forEach((h) => { $rootScope.ShipmentPlanRemove2(h); });
                        res.data.shipmentPlanHs.forEach(function (row) {
                            row.isAdd = true;
                            $rootScope.planData.shipmentPlanMain.shipmentPlanHs.push(row);
                        });
                        $rootScope.shipmentPlanManage_SetData();
                        $rootScope.isChange = true;
                        common.AlertMessage('Success', 'Recalculate Plan Success.');
                    } else {
                        common.AlertMessage('Warning', 'Recalculate Plan Fail.');
                    }
                },
                error: (res) => { common.AlertMessage('Error', res.message); }
            });
        }, () => { });
    }

    var htmlHelp = '<table class="table table-striped">' +
        '<tr><th>สี</th><th>คำอธิบาย</th></tr>' +
        '<tr><td >ดำ</td><td>ไม่เต็มตู้</td></tr>' +
        '<tr><td class="text-success">เขียว</td><td>อนุมัติแล้ว</td></tr>' +
        '<tr><td class="text-warning">ส้ม</td><td>ปริมาตร หรือ น้ำหนัก เกินขนาดตู้</td></tr>' +
        '<tr><td class="text-danger">แดง</td><td>ปริมาตร และ น้ำหนัก เกินขนาดตู้</td></tr>' +
        '<tr><td class="text-primary">น้ำเงิน</td><td>เต็มตู้</td></tr>' +
        '</table>';

    $scope.help1 = [
        { head: 'คำอธิบายสีใน Grid', html: htmlHelp }
    ];
});

app.controller('ModalMoveShipmentPlanCtrl', function ($scope, $uibModalInstance, data, $rootScope) {
    $scope.data = [];
    $scope.containers = [];
    $rootScope.containerList.forEach(function (row) {
        $scope.containers.push({ id: row.code, label: row.code });
    });
    $scope.container = {};
    $scope.container.val = $scope.containers[0];

    data.forEach(function (h) {
        var obj = {};
        obj.no = h.no;
        obj.week = h.week;
        obj.detail = [];
        for (var i = 0; i < $scope.containers.length; i++) {
            if (h.containerCode === $scope.containers[i].label) {
                $scope.container.val = $scope.containers[i];
                break;
            }
        }
        h.shipmentPlanDs.forEach(function (d) {
            var tmp = {};
            tmp.no = d.no;
            tmp.o = d.tmp.orderCode;
            tmp.p = d.tmp.productCode;
            tmp.q = d.planBalance.quantity;
            tmp.w = d.planBalance.weight;
            tmp.b = d.planBalance.bale;
            tmp.vol = d.planBalance.volume;
            tmp.v = d.planBalance.value;
            tmp.currency = d.tmp.orderStand.currency.code;
            tmp.urgentFlag = d.tmp.orderStand.urgentFlag;
            tmp.admit = KSSClient.Engine.Common.GetDateView(d.tmp.admitDate);
            obj.detail.push(tmp);
        });
        $scope.data.push(obj);
    });
    
    $scope.startDate = KSSClient.Engine.Common.GetDateString($rootScope.weekPlan[0].startDate);
    $scope.endDate = KSSClient.Engine.Common.GetDateString($rootScope.weekPlan[$rootScope.weekPlan.length - 1].endDate);

    $scope.months = [];
    $scope.month = {};
    for (var i = $rootScope.weekPlan[0].month; i <= 12; i++) {
        var date = new Date($rootScope.weekPlan[0].year, i - 1, 1);
        $scope.months.push({ month: i, label: date.toLocaleString("en-us", { month: "long" })});
    }
    $scope.month.val = $scope.months[0];

    $scope.week = {}; $scope.dtpPlan = {};
    $scope.SetWeek = function (month, dateChange) {
        $scope.weeks = [];
        var chk = false;
        for (var i = 0; i < $rootScope.weekPlan.length; i++) {
            if ($rootScope.weekPlan[i].month === month) {
                $scope.weeks.push(angular.copy($rootScope.weekPlan[i]));
                chk = true;
            } else { if (chk) break; }
        }
        chk = true;
        if (angular.isObject($scope.week.val)) {
            for (var i = 0; i < $scope.weeks.length; i++) {
                if ($scope.week.val.weekNo === $scope.weeks[i].weekNo) {
                    $scope.week.val = $scope.weeks[i];
                    chk = false;
                    break;
                }
            }
        }
        if (chk) { $scope.week.val = $scope.weeks[0]; }
        if(dateChange) $scope.weekChange($scope.week.val);
    }
    
    $scope.loadData = function () {
        $scope.shipmentHs = [];
        var obj = {};
        obj.index = -2;
        obj.sort = '001';
        obj.massage = 'Append';
        $scope.shipmentHs.push(obj);

        var obj = {};
        obj.index = -1;
        obj.sort = '002';
        obj.massage = 'Merge & Append';
        $scope.shipmentHs.push(obj);
        $scope.btnOk = true;

        $rootScope.planData.shipmentPlanMain.shipmentPlanHs.forEach(function (v, i) {
            var date = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(v.planDate));
            if (!v.isRemove && v.tmp.visible) {
                var obj = {};
                obj.no = v.no;
                obj.index = i;
                obj.week = 'W' + v.planWeek + ': ' + date;
                obj.sort = (v.no < 10 ? '0' + v.no : v.no) + '-' + v.planDate + '-' + v.planWeek;
                obj.customer = v.tmp.customer;
                obj.port = v.tmp.port;
                obj.containerCode = v.containerCode;
                obj.status = v.tmp.statusDetail;
                obj.massage = 'Merge & Insert to plan ';
                $scope.shipmentHs.push(obj);
            }
        });
    }
    $scope.loadData();

    $scope.btnOk = true;

    $scope.option = {};
    $scope.option.index = '-2';

    $scope.monthChange = function (month) {
        $scope.SetWeek(month.month, true);
    }

    $scope.weekChange = function (week) {
        $scope.dtpPlan.val = angular.copy(week.shippingDay);
    }

    $scope.dtpChange = function (date) {
        $scope.btnOk = false;
        try {
            var planDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            for (var i = 0; i < $scope.months.length; i++) {
                if ($scope.months[i].month === date.getMonth() + 1) {
                    $scope.month.val = $scope.months[i];
                    $scope.SetWeek($scope.month.val.month, false);
                    break;
                }
            }
            for (var i = 0; i < $scope.weeks.length; i++) {
                if ($scope.weeks[i].startDate <= planDate && $scope.weeks[i].endDate >= planDate) {
                    $scope.week.val = $scope.weeks[i];
                    $scope.btnOk = true;
                    break;
                }
            }
            if (!$scope.btnOk) {
                $scope.week.val = [];
            }
        } catch (ex) {
            $scope.btnOk = false;
        }
    }

    $scope.SetWeek($scope.month.val.month, true);
    $scope.btnOk = true;
    
    $scope.ok = function () {
        $uibModalInstance.close({ planDate: $scope.dtpPlan.val, option: $scope.option, week: $scope.week.val, container: $scope.container.val });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ReplacePlanCtrl', function ($scope, common, $rootScope, $uibModalInstance, $filter) {

    $scope.gridOpt = common.CreateGrid2({ mSelect: false, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'pkno', display: 'PackList No', width: { min: 115 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shipmentDate', display: 'Week', width: { min: 110 }, format: { type: 'customText' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.lastAdmitDate', display: 'Last Admit Date', width: { min: 100 }, format: { type: 'datetime' }, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.customer', display: 'Customer', width: { min: 100 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.port', display: 'Port', width: { min: 100 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Container', width: { min: 90 } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, group: { name: 'toBeShipped', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, group: { name: 'toBeShipped', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.volume', display: 'Volume', width: { min: 80 }, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.value', display: 'Values', width: { min: 130 }, format: { type: 'currency', scale: 2 }, group: { name: 'toBeShipped', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tmp.valueBHT', display: 'Value(THB)', width: { min: 130 }, format: { type: 'decimal', scale: 2 }, group: { name: 'toBeShipped', display: 'Being PackList Amount', langCode: '' } }));


    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_manage07');
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) { $scope.btnOk = true; $scope.Grid2_SetDate(row.entity.shipmentDs); }
            else { $scope.btnOk = false; $scope.Grid2_SetDate(); }
        });
        $scope.LoadData();
    };

    var GetCustomerIDs = () => {
        var customerIDs = [];
        $rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands.forEach((d) => {
            var chk = true;
            customerIDs.forEach((c) => { if (c === d.customer.id) { chk = false; return; } });
            if (chk) { customerIDs.push(d.customer.id); }
        });
        return customerIDs;
    }

    $scope.LoadData = function () {
        KSSClient.API.ShipmentPlan.GetPackList({
            data: { planMonth: $rootScope.planData.shipmentPlanMain.planMonth, planYear: $rootScope.planData.shipmentPlanMain.planYear, customerIDs: GetCustomerIDs() },
            callback: (res) => {
                var tmpOrdercodes = [], tmpProductCodes = [], tmpPacklistCodes = [], tmpCustomerCodes = [];
                res.data.shipmentHs.forEach((row) => {
                    row.shipmentDs.forEach((d) => {
                        var chk = true;
                        var orderStand = $filter('filter')($rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands, { orderCode: d.orderCode, product: { code: d.productCode }, customer: { code: d.customer.code }, status: 'A' }, true);
                        if (!orderStand.length) {
                            var chk = true;
                            tmpPacklistCodes.forEach((v) => { if (v === row.pkno) { chk = false; return;} });
                            if (chk) { tmpPacklistCodes.push(row.pkno); }
                            chk = true;
                            tmpOrdercodes.forEach((v) => { if (v === d.orderCode) { chk = false; return;} });
                            if (chk) { tmpOrdercodes.push(d.orderCode); }
                            chk = true;
                            tmpProductCodes.forEach((v) => { if (v === d.productCode) { chk = false; return; } });
                            if (chk) { tmpProductCodes.push(d.productCode); }   
                            chk = true;
                            tmpCustomerCodes.forEach((v) => { if (v === d.customer.code) { chk = false; return; } });
                            if (chk) { tmpCustomerCodes.push(d.customer.code); }
                        }
                    });
                });
                $scope.dataH = res.data.shipmentHs;
                if (tmpOrdercodes.length) {
                    var admitDateFrom = /*($rootScope.planData.shipmentPlanMain.planYear - 2)*/ '2000' + '-01-01';
                    var admitDateTo = ($rootScope.planData.shipmentPlanMain.planYear + 1) + '-' + $rootScope.planData.shipmentPlanMain.planMonth + '-01';
                    KSSClient.API.ShipmentPlan.GetOutstanding({
                        data: {
                            admitDateFrom: admitDateFrom
                            , admitDateTo: admitDateTo
                            , customerCodes: tmpCustomerCodes
                            , orderCodes: tmpOrdercodes
                            , productCodes: tmpProductCodes
                            , packlistCodes: tmpPacklistCodes
                        },
                        callback: (res) => {
                            res.data.outstandings.forEach((row) => {
                                var chk = false;
                                $scope.dataH.forEach((h) => {
                                    h.shipmentDs.forEach((d) => { 
                                        if (d.orderCode === row.orderCode && d.productCode === row.product.code && d.customer.id === d.customer.id) {
                                            row.status = 'A';
                                            $rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands.push(row);
                                            $rootScope.isChange = true;
                                            return;
                                        }
                                    });    
                                    if(chk) return;
                                });
                            });
                            $rootScope.shipmentPlanOrderShippingList_setData(true);
                            $scope.GenPackListData($scope.dataH);
                            $scope.gridOpt.data = $scope.dataH;
                            $scope.gridApi.grid.refresh();
                        },
                        error: (res) => { common.AlertMessage("Error", res.message); }
                    });
                } else {
                    $scope.GenPackListData($scope.dataH);
                    $scope.gridOpt.data = $scope.dataH;
                    $scope.gridApi.grid.refresh();
                }
            },
            error: (res) => { common.AlertMessage("Error", res.message);}
        });
    }

    $scope.GenPackListData = function (data) {
        data.forEach(function (dataH) {
            var c_lastAdmitDate = undefined;
            var l_lastAdmitDate = undefined;
            dataH.tmp = {};
            dataH.tmp.visible = true;
            dataH.tmp.lastAdmitDate = '';
            dataH.tmp.customer = [];
            dataH.tmp.port = [];
            dataH.tmp.currency = [];
            dataH.tmp.quantity = 0;
            dataH.tmp.weight = 0;
            dataH.tmp.bale = 0;
            dataH.tmp.volume = 0;
            dataH.tmp.value = [];
            dataH.tmp.valueBHT = 0;
;
            dataH.shipmentDs.forEach(function (dataD, index) {
                dataD.customer.view = common.GetCodeDescription(dataD.customer);
                dataD.tmp = {};
                var chk = true;
                var orderStand = $filter('filter')($rootScope.planData.shipmentPlanMain.shipmentPlanOrderStands, { orderCode: dataD.orderCode, product: { code: dataD.productCode }, customer: { code: dataD.customer.code }, status: 'A' }, true);
                if (orderStand.length) {
                    //console.log('true');
                    chk = false;
                    dataD.tmp.orderStand = {};
                    dataD.tmp.orderStand = orderStand[0];
                    //dataD.packList.value = dataD.packList.quantity * dataD.tmp.orderStand.valuePerUnit.qpv;
                    //dataD.packList.volume = dataD.packList.bale * dataD.tmp.orderStand.valuePerUnit.bpl;

                    dataD.tmp.orderCode = angular.copy(dataD.tmp.orderStand.orderCode);
                    dataD.tmp.productCode = angular.copy(dataD.tmp.orderStand.product.code);
                    dataD.tmp.productDescription = angular.copy(dataD.tmp.orderStand.product.description);
                    dataD.tmp.admitDate = KSSClient.Engine.Common.CreateDateTime(dataD.tmp.orderStand.admitDate);
                    dataD.tmp.maxAdmitDate = KSSClient.Engine.Common.CreateDateTime(dataD.tmp.orderStand.maxAdmitDate);
                    dataD.tmp.valueBHT = dataD.packList.value * dataD.tmp.orderStand.valuePerUnit.cpb;

                    dataD.packList.valuetmp = [{ num: dataD.packList.value, code: dataD.tmp.orderStand.currency.code }];

                    //set H
                    if (dataD.tmp.orderStand.deliveryType === 'L') {
                        var d = KSSClient.Engine.Common.CreateDateTime(dataD.tmp.orderStand.maxAdmitDate);
                        if (l_lastAdmitDate === undefined || l_lastAdmitDate < d) {
                            l_lastAdmitDate = d;
                        }
                    } else if (dataD.tmp.orderStand.deliveryType === 'C') {
                        var d = KSSClient.Engine.Common.CreateDateTime(dataD.tmp.orderStand.admitDate);
                        if (c_lastAdmitDate === undefined || c_lastAdmitDate < d) {
                            c_lastAdmitDate = d;
                        }
                    }

                    var tmpPort = dataD.tmp.orderStand.customer.portCode;
                    if (dataH.tmp.port.length === 0) {
                        dataH.tmp.port.push(tmpPort);
                    } else {
                        var chk = true;
                        dataH.tmp.port.forEach(function (c) { if (c === tmpPort) { chk = false; } });
                        if (chk) { dataH.tmp.port.push(tmpPort); }
                    }

                    var tmpCustomer = dataD.customer.code;
                    if (dataH.tmp.customer.length === 0) {
                        dataH.tmp.customer.push(tmpCustomer);
                    } else {
                        var chk = true;
                        dataH.tmp.customer.forEach(function (c) {
                            if (c === tmpCustomer) { chk = false; }
                        });
                        if (chk) {
                            dataH.tmp.customer.push(tmpCustomer);
                        }
                    }

                    dataH.tmp.valueBHT += dataD.tmp.valueBHT;

                    var tmpCurrency = dataD.tmp.orderStand.currency.code;
                    if (dataH.tmp.currency.length === 0) {
                        dataH.tmp.currency.push(tmpCurrency);
                    } else {
                        var chk = true;
                        dataH.tmp.currency.forEach(function (c) {
                            if (c === tmpCurrency) { chk = false; }
                        });
                        if (chk) {
                            dataH.tmp.currency.push(tmpCurrency);
                        }
                    }

                    dataH.tmp.quantity += dataD.packList.quantity;
                    dataH.tmp.weight += dataD.packList.weight;
                    dataH.tmp.bale += dataD.packList.bale;
                    dataH.tmp.volume += dataD.packList.volume;

                    if (dataH.tmp.value.length === 0) {
                        dataH.tmp.value.push({ num: dataD.packList.value, code: dataD.tmp.orderStand.currency.code });
                    } else {
                        var chkxxx = true;
                        for (var ix = 0; ix < dataH.tmp.value.length; ix++) {
                            if (dataH.tmp.value[ix].code === dataD.tmp.orderStand.currency.code) {
                                dataH.tmp.value[ix].num += dataD.packList.value;
                                chkxxx = false;
                                break;
                            }
                        }
                        if (chkxxx) {
                            dataH.tmp.value.push({ num: dataD.packList.value, code: dataD.tmp.orderStand.currency.code });
                        }
                    }

                } 
            });

            //set join array
            dataH.tmp.customer = dataH.tmp.customer.join(', ');
            dataH.tmp.port = dataH.tmp.port.join(', ');

            if (l_lastAdmitDate !== undefined && c_lastAdmitDate !== undefined) {
                if (l_lastAdmitDate > c_lastAdmitDate) { dataH.tmp.lastAdmitDate = l_lastAdmitDate; }
                else { dataH.tmp.lastAdmitDate = c_lastAdmitDate; }
            } else if (l_lastAdmitDate !== undefined) { dataH.tmp.lastAdmitDate = l_lastAdmitDate; }
            else if (c_lastAdmitDate !== undefined) { dataH.tmp.lastAdmitDate = c_lastAdmitDate; }
            else { dataH.tmp.lastAdmitDate = ''; }
        });
    }

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { return true; }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            } else if (myCol.field === "shipmentDate") {
                return 'W' + myRow.entity.shipmentWeek + ' : ' + KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(myRow.entity.shipmentDate));
            } else if (myCol.field === "tmp.lastAdmitDate") {
                return KSSClient.Engine.Common.GetDateView(myRow.entity.tmp.lastAdmitDate);
            } 
        } else if (grid.id === $scope.gridApi2.grid.id) {
            if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            } else if (myCol.field === "tmp.admitDate") {
                if (myRow.entity.tmp) { return KSSClient.Engine.Common.GetDateView(myRow.entity.tmp.admitDate); }
                return '';
            } else if (myCol.field === "tmp.maxAdmitDate") {
                if (myRow.entity.tmp) { return KSSClient.Engine.Common.GetDateView(myRow.entity.tmp.maxAdmitDate); }
                return '';
            } 
        }
        return false;
    };

    //----------------------------------------- grid 2 -----------------------------------//

    $scope.gridOpt2 = common.CreateGrid2({ footer: true });
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, sort: false, filter: false }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'orderCode', display: 'Order No', width: { min: 130 } }));

    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'productCode', display: 'Code', width: { min: 140 }, group: { name: 'product', display: 'Product', langCode: '' } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'tmp.productDescription', display: 'Description', width: { min: 300 }, group: { name: 'product', display: 'Product', langCode: '' } }));

    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'packList.quantity', display: 'Quantity', edit: true, width: { min: 100 }, format: { type: 'decimal', scale: 0 }, group: { name: 'beingPlannedAmount', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'packList.weight', display: 'Weight(KG)', edit: true, width: { min: 100 }, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'packList.bale', display: 'Bales', edit: true, width: { min: 60 }, format: { type: 'decimal', scale: 0 }, group: { name: 'beingPlannedAmount', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'packList.volume', display: 'Volume', width: { min: 80 }, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'packList.valuetmp', display: 'Values', width: { min: 130 }, format: { type: 'currency', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'tmp.valueBHT', display: 'Value(THB)', width: { min: 130 }, format: { type: 'decimal', scale: 2 }, group: { name: 'beingPlannedAmount', display: 'Being PackList Amount', langCode: '' } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'tmp.admitDate', display: 'Admit Date', width: { min: 100 }, format: { type: 'datetime' }, multiLine: true }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'tmp.maxAdmitDate', display: 'Max Admit Date', width: { min: 100 }, format: { type: 'datetime' }, multiLine: true }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'customer.code', display: 'Customer', width: { min: 100 } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'tmp.orderStand.deliveryDescription', display: 'Deliver Type', width: { min: 70 }, multiLine: true }));

    $scope.gridOpt2.onRegisterApi = function (gridApi) {
        $scope.gridApi2 = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_manage08');
    };

    $scope.Grid2_SetDate = (data) => {
        $scope.gridOpt2.data = [];
        if (data) {
            $scope.gridOpt2.data = data;
        }
        $scope.gridApi2.grid.refresh();
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.gridApi.selection.getSelectedRows()[0]);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ShipmentRecalculatePlanCtrl', ($scope, $uibModalInstance, data, $rootScope, common) => {

    if (!data.length) $uibModalInstance.dismiss('cancel');
    data = data[data.length - 1];
    $scope.containers = [];
    $scope.container = {};
    $rootScope.containerList.forEach(function (row) {
        $scope.containers.push({ id: row.code, label: row.code, volume: row.maxSizeVolume, weight: row.maxSizeKg, vmin: 0, vmax: row.maxSizeVolume * 1.2, wmin: 0, wmax: row.maxSizeKg * 1.2 });
        if (row.code === data.containerCode) $scope.container.val = $scope.containers[$scope.containers.length - 1];
    });

    //$scope.container.val = $scope.containers.find((v) => { return data.containerCode === v.code });

    var obj = {};
    obj.no = data.no;
    obj.week = 'W' + data.planWeek + ': ' + KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(data.planDate));
    obj.customer = data.tmp.customer;
    obj.port = data.tmp.port;
    obj.containerCode = data.containerCode;
    obj.status = data.tmp.statusDetail;
    obj.volume = data.tmp.volume;
    obj.weight = data.tmp.weight;
    $scope.shipmentHs = obj;

    $scope.vol = !data.volumeAdj ? $scope.container.val.volume : data.volumeAdj;
    $scope.wei = !data.weightAdj ? $scope.container.val.weight : data.weightAdj;

    $scope.type = { value: !data.calculateType ? 'V' : data.calculateType };

    $scope.ContainerChange = () => {
        if ($scope.container.val.id === data.contianerCode) {
            $scope.vol = !data.volumeAdj ? $scope.container.val.volume : data.volumeAdj;
            $scope.wei = !data.weightAdj ? $scope.container.val.weight : data.weightAdj;
        } else {
            $scope.vol = $scope.container.val.volume;
            $scope.wei = $scope.container.val.weight;
        }
    }

    $scope.VolumeChange = (v, out) => {
        if (!$scope.vol && out) {
            common.AlertMessage('Warning', 'Container Size : ' + $scope.container.val.label + ' volume adjustment range : ' + $scope.container.val.vmin + ' - ' + $scope.container.val.vmax).then((ok) => {
                $scope.vol = !data.volumeAdj ? $scope.container.val.volume : data.volumeAdj;
                $scope.wei = ($scope.container.val.weight * $scope.vol) / $scope.container.val.volume;
            });
        }
        $scope.wei = ($scope.container.val.weight * $scope.vol) / $scope.container.val.volume;
    }

    $scope.WeightChange = (v, out) => {
        if (!$scope.wei && out) {
            common.AlertMessage('Warning', 'Container Size : ' + $scope.container.val.label + ' weight adjustment range : ' + $scope.container.val.wmin + ' - ' + $scope.container.val.wmax).then((ok) => {
                $scope.wei = !data.weightAdj ? $scope.container.val.weight : data.weightAdj;
                $scope.vol = ($scope.container.val.volume * $scope.wei) / $scope.container.val.weight;
            });
        }
        $scope.vol = ($scope.container.val.volume * $scope.wei) / $scope.container.val.weight;
    }

    $scope.ok = function () {
        $uibModalInstance.close({ container: $scope.container.val.id, volume: $scope.vol, weight: $scope.wei, calc: $scope.type.value });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});