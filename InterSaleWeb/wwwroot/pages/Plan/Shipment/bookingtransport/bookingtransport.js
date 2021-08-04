app.controller("shipmentMarkBookingTransportCtrl", function ($rootScope, $scope, $location, $filter, $q, $timeout, $uibModal, uiGridConstants, common, intersales) {

    $scope.IP_DB = $rootScope.IP_DB + 'sxtShipmentPlanH, sxtShipmentPlanD, sxtShipmentPlanOrderStand, sxsPortLoading, [saleex].dbo.STKTRN, [saleex].dbo.sxsConditionPayH, [saleex].dbo.EARNESTMST, [saleex].dbo.EARNESTTRN';

    // set datePlan
    if ($location.search().date) {
        $scope.planDate = $location.search().date;
    } else {
        var d = new Date();
        var m = /*d.getDate() > 15 ? d.getMonth() + 2 :*/ d.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        $scope.planDate = (m > 12 ? '01' : m) + '/' + (m > 12 ? d.getFullYear() + 1 : d.getFullYear());
    }

    // Set Week
    $scope.weeks = [];
    $scope.weekList = [];
    $scope.LoadWeeks = function (query) {
        return $filter('filter')($scope.weekList, { 'text': query });
    };

    $scope.SetDate = function (date) {
        $scope.weekList = [];
        if (date) {
            var tmp = date.split('/');
            $scope.planMonth = parseInt(tmp[0]);
            $scope.planYear = parseInt(tmp[1]);
            $filter('filter')(intersales.GetWeekPlan($scope.planMonth, $scope.planYear, 0), { 'month': $scope.planMonth }, true).forEach(function (v) {
                $scope.weekList.push({ id: v.weekNo, code: 'W' + v.weekNo, text: 'Week ' + v.weekNo });
            });

        } else {
            $scope.planMonth = undefined;
            $scope.planYear = undefined;
        }
    }
    
    // load RegionalZones
    $scope.regzone = [];
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
    $scope.zones = [];
    KSSClient.API.ZoneAccount.Search({
        data: { search: '', status: 'A' },
        callback: function (res) {
            res.data.zoneAccounts.forEach(function (v) {
                $scope.zoneList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
                if ($location.search().zone == v.id) {
                    $scope.zones.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
                }
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
    $scope.customers = [];
    KSSClient.API.Customer.Search({
        data: { search: '', status: 'A' },
        callback: function (res) {
            res.data.customers.forEach(function (v) {
                $scope.customerList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        },
        error: function (res) { common.AlertMessage("Error", res.message); }
    });
    // set LoadCustomers
    $scope.LoadCustomers = function (query) {
        return $filter('filter')($scope.customerList, { 'text': query });
    };

    $scope.GenData = (data) => {
        $scope.weekPlan = intersales.GetWeekPlan($scope.planMonth, $scope.planYear);
        data.forEach((row, i) => {
            row.customer = row.customers.map(x => x.code + ' : ' + x.description).join(", ");
            row.port = row.ports.map(x => x.code + ' : ' + x.description).join(", ");
            row.planDate_view = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.planDate));
            row.portLoadingUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.portLoadingUpdate.datetime)) + ' : ' + row.portLoadingUpdate.by
            if (row.portLoading == null) row.portLoading = { id: null, code: null, description: null, view: '' };
            row.portLoading.view = row.portLoading.vieworg = common.GetCodeDescription(row.portLoading);
            row.portLoading.idorg = row.portLoading.id;

            row.paymentTerm_view = row.paymentTerm.join(', ');
            
            $scope.weekPlan.forEach((w) => {
                if (w.weekNo == row.planWeek && w.month === $scope.planMonth) {
                    var tmpDate = w.startDate.getDate();
                    tmpDate = (tmpDate < 10 ? '0' + tmpDate : tmpDate);
                    row.planWeek_view = 'W' + w.weekNo + ' ' + tmpDate + ' - ' + KSSClient.Engine.Common.GetDateView(w.endDate);
                    return;
                }
            });
            row.enableEdit = true;
        });

        return data;
    }
    
    $scope.LoadData = function () {

        $scope.isChange = false;

        var zoneAccountIDs = [];
        $scope.zones.forEach((v) => { zoneAccountIDs.push(v.id); });

        var regionalZoneIDs = [];
        $scope.regzone.forEach((v) => { regionalZoneIDs.push(v.id) });

        var customerIDs = [];
        $scope.customers.forEach((v) => { customerIDs.push(v.id) })

        var weeks = [];
        $scope.weeks.forEach((v) => { weeks.push(v.id); });

        KSSClient.API.ShipmentPlan.BookingTransport({
            data: {
                planMonth: $scope.planMonth
                , planYear: $scope.planYear
                , zoneAccountIDs: zoneAccountIDs
                , regionalZoneIDs: regionalZoneIDs
                , weeks: weeks
                , customerIDs: customerIDs
            },
            callback: function (res) {
                console.log(res);
                $scope.SetData($scope.GenData(res.data.bookings));
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    } 



    var SetClass = function (grid, row, col) {
        var cellClass = '';
        if (col.colDef.enableCellEdit) {
            if (common.GetObjVal(col.name, row.entity) !== common.GetObjVal(col.name + 'org', row.entity)) { cellClass += 'bg-warning '; }
            if (common.GetObjVal(col.name + 'err', row.entity)) cellClass = 'bg-danger ';
        }

        //if (row.entity.status == 'I') cellClass += ' text-primary';
        //else if (row.entity.status == 'C') cellClass += ' text-danger';
        return cellClass;
    }

    $scope.gridOpt = common.CreateGrid2({ footer: true, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 55 }, format: { type: 'numRow' }, setclass: SetClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planWeek_view', display: 'Week', width: { default: 130 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planDate_view', display: 'ETD (KKF)', width: { default: 115 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer', display: 'Customer', width: { default: 300 }, setclass: SetClass }));
   
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerm_view', display: 'Term', width: { min: 130 }, setclass: SetClass, group: { name: 'payment', display: 'Payment', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'payAmount', display: 'Pay Amount', width: { default: 130 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, group: { name: 'payment', display: 'Payment', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'packListCode', display: 'PackList No.', width: { default: 130 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'portLoading.view', display: 'Port of Loading', edit: true, width: { min: 250 }, setclass: SetClass, format: { type: 'modal', func: 'PortLoadingPopup' }, group: { name: 'booking', display: 'Booking Transport', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Container', width: { default: 100 }, format: { type: 'text', align: 'center' }, setclass: SetClass, group: { name: 'booking', display: 'Booking Transport', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port', display: 'Port of Destination', width: { min: 150 }, setclass: SetClass, group: { name: 'booking', display: 'Booking Transport', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productComplete', display: '% Product Complete', width: { default: 100 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'stockAmount', divi: 'planAmount' }, setclass: SetClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'portLoadingUpdate_view', display: 'Last Update Port of Loading', width: { min: 300 } }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid == row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            }
        }
        return false
    };

    $scope.PortLoadingPopup = (row) => {
        $scope.PortLoadingModal().then((data) => {
            var tmp = $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.indexOf(row.entity)];
            if (data) {
                tmp.portLoading.id = data.id;
                tmp.portLoading.code = data.code;
                tmp.portLoading.description = data.description;
                tmp.portLoading.view = common.GetCodeDescription(data);
            } else {
                tmp.portLoading.id = null;
                tmp.portLoading.code = null;
                tmp.portLoading.description = null;
                tmp.portLoading.view = '';
            }
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $scope.ChkDataChange();
        });
    }

    $scope.PortLoadingModal = function (parentSelector) {
        var deferred = $q.defer();
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'PortLoadingModalCtrl',
            size: 'md',
            appendTo: parentElem,
            //resolve: { remarkGroupData: function () { return $scope.remarkGroupData; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'PortLoadingModalContent.html'
        });
        modalInstance.result.then((data) => { deferred.resolve(data); }, () => { deferred.resolve(); });
        return deferred.promise;
    };

    $scope.ChkDataChange = () => {
        var chk = false;
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.portLoading.view !== d.portLoading.vieworg) { chk = true; return;}
        });
        $scope.isChange = chk;
    }

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_ShipmentPlanBooking01');
    };

    $scope.SetData = (data) => {
        $scope.gridOpt.data = [];
        if (data) { $scope.gridOpt.data = data; }
        $scope.gridApi.grid.refresh();
    }

    $scope.Save = () => {
        var data = [];
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.portLoading.id !== d.portLoading.idorg) {
                data.push(d);
            }
        });
        KSSClient.API.ShipmentPlan.MarkBookigTransport({
            data: { bookings: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => {
                    $scope.isChange = false;
                    $scope.GenData(res.data.bookings).forEach((d) => {
                        $scope.gridApi.grid.options.data.forEach((r, i) => {
                            if (d.planHID === r.planHID) { $scope.gridApi.grid.options.data[i] = d; return; }
                        });
                    });
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                });
                $scope.$apply();
            },
            error: (res) => {
                var msg = '';
                if (res.data) {
                    $scope.GenData(res.data.bookings).forEach((d) => {
                        if (d._result._status === 'F') { msg += d.planWeek_view + ' | ' + d.planDate_view + ' | ' + d.customer + ' : ' + d._result._message + '\n'; }
                    });
                }
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    }

    $scope.Cancel = () => {
        $scope.gridApi.grid.options.data.forEach((d) => { d.portLoading.id = d.portLoading.idorg; d.portLoading.view = d.portLoading.vieworg; });
        $scope.isChange = false;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    }
    
    
});

app.controller('PortLoadingModalCtrl', function ($scope, common, $rootScope, $uibModalInstance, $filter) {

    $scope.gridOpt = common.CreateGrid2({ mSelect: false, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Code', width: { default: 80 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description', width: { min: 150 } }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { return true; }
        }
        return false
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_ShipmentPlanBooking02');
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) { $scope.btnOk = true; }
            else { $scope.btnOk = false; }
        });
        $scope.LoadData();
    };

    $scope.LoadData = function () {
        KSSClient.API.PortLoading.Search({
            data: { ids: [], search: angular.isUndefined($scope.txtFind) ? '' : $scope.txtFind, status: ['A'] },
            callback: (res) => {
                $scope.gridOpt.data = res.data.portLoadings;
                $scope.gridApi.grid.refresh();
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });

    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.gridApi.selection.getSelectedRows()[0]);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
