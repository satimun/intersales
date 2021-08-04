app.controller("shipmentPlanRemarkCtrl", function ($rootScope, $scope, $location, $filter, $q, $timeout, $uibModal, uiGridConstants, common, intersales) {

    $scope.IP_DB = $rootScope.IP_DB + 'sxtShipmentPlanH, sxtShipmentPlanD, sxtShipmentPlanOrderStand, sxtShipmentPlanRemark, [saleex].dbo.STKTRN, [saleex].dbo.sxsConditionPayH, [saleex].dbo.EARNESTMST, [saleex].dbo.EARNESTTRN';

    // set datePlan
    var d = new Date();
    var m = /*d.getDate() > 15 ? d.getMonth() + 2 :*/ d.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    $scope.planDate = (m > 12 ? '01' : m) + '/' + (m > 12 ? d.getFullYear() + 1 : d.getFullYear());

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
    };

    // set reportType
    $scope.reportType = {};
    $scope.reportType.list = [{ id: 'M', view: 'Monthly Plan' }, { id: 'W', view: 'Weekly Plan' }];
    $scope.reportType.view = 'Monthly Plan';
    $scope.reportType.SetID = function (id) { $scope.reportType.id = id; };

    // load LoadZones
    $scope.zoneList = [];
    $scope.zones = [];
    KSSClient.API.ZoneAccount.Search({
        data: { search: '', status: 'A' },
        callback: function (res) {
            res.data.zoneAccounts.forEach(function (v) {
                $scope.zoneList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
                if ($location.search().zone === v.id) {
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

    // load & set Sales
    $scope.emp = {};
    $scope.emp.list = [];
    $scope.emp.view = '';
    $scope.emp.id = '';
    $scope.emp.SetID = function (id) {
        $scope.emp.id = id;
    };
    var empID = parseInt($rootScope.username.split(' ')[0]);

    KSSClient.API.Employee.SearchSale({
        data: { search: '', status: 'A' },
        callback: function (res) {
            var tmp = [];
            res.data.employees.forEach(function (v) {
                tmp.push({ id: v.id, view: common.GetCodeDescription(v) });
                if (v.id === empID) { $scope.emp.view = common.GetCodeDescription(v); }
            });
            $scope.emp.list = tmp;
        },
        error: function (res) {  common.AlertMessage("Error", res.message); }
    });

    $scope.GenData = (data) => {
        $scope.weekPlan = intersales.GetWeekPlan($scope.planMonth, $scope.planYear);
        data.forEach((row, i) => {
            row.customerCodes = row.customers.map(x => x.code).join(", ");
            row.customerNames = row.customers.map(x => x.description).join(", ");
            row.plan.date = KSSClient.Engine.Common.CreateDateTime(row.plan.date);
            row.actual.date = KSSClient.Engine.Common.CreateDateTime(row.actual.date);
            row.remark.view = row.remark.vieworg = common.GetCodeDescription(row.remark);

            row.paymentTerm_view = row.paymentTerms.join(', ');
            row.ciCodes = row.ciCode.join(', ');

            $scope.weekPlan.forEach((w) => {
                if (w.weekNo === row.planWeek && w.month === $scope.planMonth) {
                    var tmpDate = w.startDate.getDate();
                    tmpDate = (tmpDate < 10 ? '0' + tmpDate : tmpDate);
                    row.planWeek_view = 'W' + w.weekNo + ' : ' + tmpDate + ' - ' + KSSClient.Engine.Common.GetDateView(w.endDate);
                    row.planWeek_vieworg = row.planWeek_view;
                    //row.planWeek = 'W' + w.weekNo;
                    return;
                }
            });
            row.enableEdit = true;
        });
        return data;
    };

    $scope.LoadData = function () {
        $scope.isChange = false;
        $scope.SetGroupDisplay($scope.reportType.view);

        var zoneAccountIDs = [];
        $scope.zones.forEach((v) => { zoneAccountIDs.push(v.id); });

        KSSClient.API.ShipmentPlan.GetRemark({
            data: {
                planType: $scope.reportType.id
                , planMonth: $scope.planMonth
                , planYear: $scope.planYear
                , saleEmployeeID: $scope.emp.id
                , zoneAccountIDs: zoneAccountIDs
                , option: 1
            },
            callback: function (res) {
                $scope.SetData($scope.GenData(res.data.planRemarks));
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
        $scope.SetData([]);
    };



    var SetClass = function (grid, row, col) {
        var cellClass = '';

        if (col.colDef.enableCellEdit) {
            if (common.GetObjVal(col.name, row.entity) !== common.GetObjVal(col.name + 'org', row.entity)) { cellClass += 'bg-warning '; }
            if (common.GetObjVal(col.name + 'err', row.entity)) cellClass = 'bg-danger ';
        }
        if (row.entity.totalRow) {
            cellClass += 'bg-info font-bold';
        }
        if (row.entity.status === 'S') {
            cellClass += 'text-success';
        } else if (row.entity.status === 'R') {
            cellClass += 'text-danger';
        } else if (row.entity.status === 'M') {
            cellClass += 'text-warning';
        } else if (row.entity.status === 'N') {
            cellClass += 'text-primary';
        } else if (row.entity.status === 'C') {
            cellClass += 'text-pink';
        }
        return cellClass;
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 55 }, format: { type: 'numRow' }, setclass: SetClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planWeek_view', display: 'Week', width: { min: 130 }, setclass: SetClass, sort: false, filter: false/*, format: { type: 'customText' }, grouping2: true*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customerCodes', display: 'Code', width: { min: 150 }, setclass: SetClass, group: { name: 'customers', display: 'Customers', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customerNames', display: 'Name', width: { min: 300 }, setclass: SetClass, group: { name: 'customers', display: 'Customers', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'ciCodes', display: 'Order Number (PI/CI)', width: { min: 130 }, setclass: SetClass, multiLine: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'plan.date', display: 'ETD (KKF)', width: { min: 115 }, format: { type: 'customText' }, setclass: SetClass, group: { name: 'plan', display: 'Monthly Plan', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'plan.containerCode', display: 'Transport', width: { min: 90 }, setclass: SetClass, group: { name: 'plan', display: 'Monthly Plan', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.date', display: 'ETD (KKF)', width: { min: 115 }, format: { type: 'customText' }, setclass: SetClass, group: { name: 'actual', display: 'Actual', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.containerCode', display: 'Transport', width: { min: 90 }, setclass: SetClass, group: { name: 'actual', display: '', langCode: 'Actual' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark.view', display: 'Remark', edit: true, width: { min: 300 }, setclass: SetClass, format: { type: 'modal', func: 'RemarkPopup' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerm_view', display: 'Term', width: { min: 130 }, setclass: SetClass, group: { name: 'payment', display: 'Payment', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'payAmounts', display: 'Pay Amount', width: { default: 130 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, group: { name: 'payment', display: 'Payment', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productComplete', display: '% Product Complete', width: { default: 100 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'stockAmount', divi: 'planAmount' }, setclass: SetClass, multiLine: true }));

    $scope.SetGroupDisplay = (val) => {
        $scope.gridApi.grid.options.columnDefs.forEach((c) => {
            if (c.field === 'plan.date' || c.field === 'plan.containerCode') { c.group.display = val; }
        });
    };

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            } else if (myCol.field === "plan.date") {
                return KSSClient.Engine.Common.GetDateView(myRow.entity.plan.date);
            } else if (myCol.field === "actual.date") {
                return KSSClient.Engine.Common.GetDateView(myRow.entity.actual.date);
            }
        }
        return false;
    };

    $scope.ModalRemarkPopup = function (parentSelector) {
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
        $scope.ModalRemarkPopup().then((data) => {
            var tmp = $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.indexOf(row.entity)];
            if (data) {
                tmp.remark.id = data.id;
                tmp.remark.code = data.code;
                tmp.remark.description = data.description;
                tmp.remark.view = common.GetCodeDescription(data);
            } else {
                tmp.remark.id = null;
                tmp.remark.code = null;
                tmp.remark.description = null;
                tmp.remark.view = '';
            }
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $scope.ChkDataChange();
        });
    }

   

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_ShipmentPlanRemark01');

        $scope.gridApi.grid.registerRowsProcessor((renderableRows) => {
            renderableRows.forEach((row) => {
                if (row.entity.status !== $scope.option.value && $scope.option.value !== '') {
                    row.visible = false;
                }
            });
            return renderableRows;
        }, 200);

    };

    $scope.SetData = (data) => {
        $scope.gridOpt.data = [];
        if (data) { $scope.gridOpt.data = data; }
        $scope.gridApi.grid.refresh();
    };

    $scope.ChkDataChange = () => {
        var chk = false;
        $scope.gridApi.grid.options.data.forEach((d) => { if (d.remark.view !== d.remark.vieworg) { chk = true; return; } });
        $scope.isChange = chk;
    };

    $scope.Save = () => {
        var data = [];
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.remark.view !== d.remark.vieworg) {
                data.push({
                    planWeek: d.planWeek
                    , customer: d.customer
                    , ciCode: d.ciCode
                    , plan: d.plan
                    , actual: d.actual
                    , remark: d.remark
                });
            }
        });
        KSSClient.API.ShipmentPlan.SaveRemark({
            data: { planRemarks: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $scope.LoadData(); });
            },
            error: (res) => {
                var msg = '';
                if (res.data) {
                    $scope.GenData(res.data.planRemarks).forEach((d) => {
                        if (d._result._status === 'F') { msg += d.planWeek_view + ' |  ' + d.customerCodes + ' : ' + d._result._message + '\n'; }
                    });
                }
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    }

    $scope.option = { value: '' };

    $scope.ChangeChk = () => {
        $scope.gridApi.grid.refresh();
    }

    var htmlHelp = '<table class="table table-striped">' +
        '<tr><th>สี</th><th>คำอธิบาย</th></tr>' +
        '<tr><td class="text-success">เขียว</td><td>แผนถูกต้อง/ตรงกัน</td></tr>' +
        '<tr><td class="text-danger">แดง</td><td>เลื่อนแผน นอกเดือน</td></tr>' +
        '<tr><td class="text-warning">ส้ม</td><td>เลื่อนแผน ในเดือน ตัวที่ล่องใหม่ในเดือนนั้น</td></tr>' +
        '<tr><td >ดำ</td><td>เลื่อนแผน ในเดือน ตัวที่ถูกเลื่อนในเดือนนั้น</td></tr>' +
        '<tr><td class="text-pink">ชมพู</td><td>เปลี่ยนขนาดตู้</td></tr>' +
        '<tr><td class="text-primary">น้ำเงิน</td><td>แผนเพิ่มใหม่</td></tr>' +
        '</table>';

    $scope.help1 = [
        { head: 'คำอธิบายสีใน Grid', html: htmlHelp }
    ];

});