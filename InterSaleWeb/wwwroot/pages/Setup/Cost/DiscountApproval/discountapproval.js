'use strict';
app.controller("DiscountApprovalCtrl", function ($rootScope, $scope, common, $filter, API) {

    $scope.dtpFrom = new Date();
    $scope.dtpFrom.setDate($scope.dtpFrom.getDate() - 30);
    $scope.dtpTo = new Date();
    $scope.dtpTo.setDate($scope.dtpTo.getDate() + 30);

    // customer
    $scope.customer = {
        list: []
        , selected: []
        , filter: (query) => { return $filter('filter')($scope.customer.list, { 'text': query }); }
    };

    API.Customer.Search({
        data: { status: 'A' },
        callback: (res) => {
            res.data.customers.forEach((v) => {
                $scope.customer.list.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        },
        error: (res) => { common.AlertMessage("Error", res.message); }
    });

    API.StatusFlag.GetForApproval({
        data: { tableID: 2 },
        callback: (res) => {
            $scope.statusFlag.list.push({ id: null, view: 'All Status.' });
            var tmp = $filter('filter')(res.data.statusFlags, { groupFlag: 'D' }, true).map(x => x.updateFlag.id + '' + x.id);
            $scope.statusFlag.list.push({
                id: !tmp.length ? -1 : tmp
                , view: 'For Approval.'
            });
            $scope.statusFlag.view = 'For Approval.';
            $filter('filter')(res.data.statusFlags, { groupFlag: 'A' }, true).forEach((d) => {
                $scope.statusFlag.list.push({ id: d.id, view: common.GetCodeDescription(d) });
            });
        },
        error: (res) => { common.AlertMessage("Error", res.message); }
    });

    // status flag
    $scope.statusFlag = { list: [], view: '', id: '', SetID: (id) => { $scope.statusFlag.id = id; } };

    $scope.IP_DB = $rootScope.IP_DB + 'sxsDiscountStdMain, sxsDiscountStdEffectiveDate';

    $scope.gridOpt = common.CreateGrid2({ mSelect: false, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 65 }, format: { type: 'numRow' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'countryGroup_view', display: 'Country Group', width: { min: 150 }, multiLine: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer_view', display: 'Customer', width: { min: 150 }, multiLine: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountStdEffectiveDate.code', display: 'Code', width: { default: 70 }, group: { name: 'effective', display: 'Effective', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateFrom_view', display: 'Date From', width: { min: 90 }, format: { type: 'date' }, group: { name: 'effective', display: 'Effective', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateTo_view', display: 'Date To', width: { min: 90 }, format: { type: 'date' }, group: { name: 'effective', display: 'Effective', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Table No.', width: { min: 100 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tableType', display: 'Table Type', width: { min: 100 }, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productType_view', display: 'Product Type', width: { min: 100 }, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productGrade_view', display: 'Product Quality', width: { min: 100 }, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'currency_view', display: 'Currency', width: { min: 100 }, multiLine: true }));

    $scope.cumulative = function (grid, myRow, myCol, option = 0) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => {
                    if (myRow.uid === row.uid) { numRow = index + 1; row.entity.no = index + 1; return; }
                });
                return numRow;
            } else if (myCol.field === "effectiveDateFrom_view") {
                if (option === 1) { if (myRow.entity.effectiveOldDateFrom) { return true; } }
                else if (option === 2) { if (myRow.entity.effectiveOldDateFrom) { return common.GetDateView(new Date(myRow.entity.effectiveOldDateFrom)); } }
                else { return KSSClient.Engine.Common.GetDateView(myRow.entity.effectiveDateFrom_view); }
            }
            else if (myCol.field === "effectiveDateTo_view") {
                if (option === 1) { if (myRow.entity.effectiveOldDateTo) { return true; } }
                else if (option === 2) { if (myRow.entity.effectiveOldDateTo) { return common.GetDateView(new Date(myRow.entity.effectiveOldDateTo)); } }
                else { return common.GetDateView(myRow.entity.effectiveDateTo_view); }
            }
        }
        return false;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, (row) => { });
        gridApi.cellNav.on.navigate($scope, (newRowCol, oldRowCol) => {
            if (!oldRowCol || oldRowCol.row.uid !== newRowCol.row.uid) {
                var flag = 0;
                if (newRowCol.row.entity.type === 'R') {
                    if (newRowCol.row.entity.productGroupType === 'N') { flag = 1; }
                    else { flag = 2; }
                }
                $rootScope.DiscountApprovalGridDetailCtrl_SetGrid(flag);
                $rootScope.DiscountApprovalGridDetailCtrl_SetData(newRowCol.row.entity, $scope.statusFlag.id);
            }
        });

    };

    $scope.LoadData = () => {
        API.DiscountStd.SearchHeader({
            data: { customerIDs: $scope.customer.selected.map(x => x.id), dateFrom: common.GetDateString($scope.dtpFrom), dateTo: common.GetDateString($scope.dtpTo), status: $scope.statusFlag.id },
            callback: (res) => {
                res.data.discountHeaders.forEach((d) => {
                    d.effectiveDateFrom_view = common.CreateDateTime(d.effectiveDateFrom);
                    d.effectiveDateTo_view = common.CreateDateTime(d.effectiveDateTo);

                    d.effectiveOldDateFrom = common.CreateDateTime(d.effectiveOldDateFrom);
                    d.effectiveOldDateTo = common.CreateDateTime(d.effectiveOldDateTo);

                    d.customer_view = common.GetCodeDescription(d.customer);

                    d.countryGroup_view = common.GetCodeDescription(d.countryGroup);

                    d.tableType = common.GetCodeDescription(d.tableType);

                    d.productType_view = common.GetCodeDescription(d.productType);
                    d.productGrade_view = common.GetCodeDescription(d.productGrade);
                    d.currency_view = common.GetCodeDescription(d.currency);
                });
                $scope.gridOpt.data = res.data.discountHeaders;
                $scope.gridApi.grid.refresh();
                $rootScope.DiscountApprovalGridDetailCtrl_SetData();
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };
});

app.controller("DiscountApprovalGridDetailCtrl", function ($rootScope, $scope, common, dialog, API) {

    var GridClass = (grid, row) => {
        if (row.entity.approved.statusFlag.code === 'MA') {
            return 'text-primary';
        } else if (row.entity.approved.statusFlag.code === 'WA') {
            return 'text-warning';
        } else if (row.entity.approved.statusFlag.code === 'AA') {
            return 'text-success';
        } else if (row.entity.approved.statusFlag.code === 'AN' || row.entity.approved.statusFlag.code === 'MN') {
            return 'text-danger';
        }
    };

    $scope.IP_DB = $rootScope.IP_DB + 'sxsDiscountStdRangH, sxsDiscountStdRangD, sxsDiscountStdProd, sxsDiscountStdValue';

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 65 }, format: { type: 'numRow' }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'seq', display: 'Seq', width: { min: 40 }, setclass: GridClass, format: { type: 'decimal', scale: 0, summary: 'none' } }));

    // P
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.code', display: 'Code', width: { min: 150 }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.description', display: 'Description', width: { min: 330 }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.detail', display: 'Detail', width: { min: 60 }, format: { type: 'btnPopup', func: 'ShowProductDetail' }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' }, sort: false, filter: false }));

    // R
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'minTwineSize.code', display: 'From', width: { min: 50 }, setclass: GridClass, group: { name: 'twine', display: 'Dia', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'maxTwineSize.code', display: 'To', width: { min: 50 }, setclass: GridClass, group: { name: 'twine', display: 'Dia', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'knot_view', display: 'Knot', width: { min: 40 }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stretching_view', display: 'Stret ching', width: { min: 45 }, setclass: GridClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'selvageWovenType_view', display: 'Selvage Woven', width: { min: 58 }, setclass: GridClass, multiLine: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'colorGroup.code', display: 'Code', width: { min: 70 }, setclass: GridClass, group: { name: 'colorgroup', display: 'Color Group', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'colorGroup.detail', display: 'Detail', width: { min: 50, max: 50 }, setclass: GridClass, format: { type: 'btnPopup', func: 'ShowColorDetail' }, sort: false, filter: false, group: { name: 'colorgroup', display: 'Color Group', langCode: '' } }));

    // R net
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesDescription', display: 'Sales Description', width: { min: 200 }, setclass: GridClass, group: { name: 'spec', display: 'Specification' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tagDescription', display: 'Tag Description', width: { min: 200 }, setclass: GridClass, group: { name: 'spec', display: 'Specification' } }));

    // R twine
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'twineSeries.code', display: 'Code', width: { min: 60 }, setclass: GridClass, group: { name: 'series', display: 'Twine Series', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'twineSeries.description', display: 'Description', width: { min: 150 }, setclass: GridClass, group: { name: 'series', display: 'Twine Series', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'unitType_view', display: 'Sale Unit', width: { min: 45 }, setclass: GridClass, multiLine: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountPercent', display: '% Discount', width: { min: 80 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: GridClass, multiLine: true  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountAmount', display: 'Fix Discount', width: { min: 80 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: GridClass, multiLine: true  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'increaseAmount', display: 'Surcharge', width: { min: 80 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: GridClass, multiLine: true  }));
    
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'updateFlag_view', display: 'Update Flag', width: { default: 90 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', display: 'Status', width: { default: 60 }, setclass: GridClass, cellFilter: 'mapStatus', hiding: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 250 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'approved_status', display: 'Approved Status', width: { default: 100 }, setclass: GridClass, hiding: true, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'approved_detail', display: 'Approved Detail', width: { default: 250 }, setclass: GridClass, hiding: true, multiLine: true }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => {
                    if (myRow.uid === row.uid) { numRow = index + 1; row.entity.no = index + 1; return; }
                });
                return numRow;
            } else if (myCol.field === 'product.detail') {
                return myRow.entity.product.code ? true : false;
            } else if (myCol.field === 'colorGroup.detail') {
                return myRow.entity.colorGroup.code ? true : false;
            }
        }
        return false;
    };

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        $scope.ChkChange();
    };

    $scope.ShowProductDetail = (data) => {
        dialog.ProductShowDetail({ productID: data.entity.product.id });
    };

    $scope.ShowColorDetail = (data) => {
        dialog.ColorGroupShowDetail({ colorGroupID: data.entity.colorGroup.id });
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, (row) => { $scope.ChkChange(); });
        gridApi.cellNav.on.navigate($scope, (newRowCol, oldRowCol) => {
            if (!oldRowCol || oldRowCol.row.uid !== newRowCol.row.uid) {
                $rootScope.DiscountApprovalGridPriceCtrl_SetData(newRowCol.row.entity, $scope.main);
            }
        });
    };
    
    $scope.prod = ['product.code', 'product.description', 'product.detail']; //prod

    $scope.rang = ['minTwineSize.code', 'maxTwineSize.code', 'colorGroup.code', 'colorGroup.detail']; // rang

    $scope.net = ['knot_view', 'stretching_view', 'selvageWovenType_view', 'tagDescription', 'salesDescription']; // net

    $scope.twine = ['twineSeries.code', 'twineSeries.description']; // twine

    $scope.hideCol = [];

    $rootScope.DiscountApprovalGridDetailCtrl_SetGrid = (flag) => {

        // prod
        if (flag === 0) { $scope.hideCol = $scope.rang.concat($scope.net.concat($scope.twine)); }

        // net
        else if (flag === 1) { $scope.hideCol = $scope.prod.concat($scope.twine); }

        // twine
        else $scope.hideCol = $scope.prod.concat($scope.net);

        $scope.gridOpt.columnDefs.forEach((c1) => {
            if (c1.field !== 'numRow') {
                c1.enableHiding = true;
                c1.visible = true;
            }
            if ($scope.hideCol.find((c2) => { return c2 === c1.field; })) {
                c1.enableHiding = false;
                c1.visible = false;
            }
        });

    };

    $scope.main = {};
    $scope.status = '';

    $rootScope.DiscountApprovalGridDetailCtrl_SetData = (main, status) => {
        $scope.main = main;
        $scope.status = status;
        if (!main) {
            $scope.gridOpt.data = [];
            $scope.gridApi.grid.refresh();
            return;
        }

        API.DiscountStd.SearchDetail({
            data: { mainID: main.id, effectiveID: main.discountStdEffectiveDate.id, status: status },
            callback: (res) => {
                res.data.discountDetails.forEach((d) => {
                    d.unitType_view = common.GetCodeDescription(d.unitType);
                    d.updateFlag_view = common.GetCodeDescription(d.updateFlag);

                    d.stretching_view = common.GetCodeDescription(d.stretching);
                    d.knot_view = common.GetCodeDescription(d.knot);
                    d.selvageWovenType_view = common.GetCodeDescription(d.selvageWovenType);

                    d.lastUpdate_view = common.GetDateTimeView(common.CreateDateTime(d.lastUpdate.datetime)) + ' ' + d.lastUpdate.by;
                    d.approved_status = common.GetCodeDescription(d.approved.statusFlag);
                    d.approved_detail = common.GetDateTimeView(common.CreateDateTime(d.approved.datetime)) + ' ' + d.approved.by;
                });
                $scope.gridOpt.data = res.data.discountDetails;
                $scope.gridApi.grid.refresh();
                $rootScope.DiscountApprovalGridPriceCtrl_SetData();
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.btnAppr = $scope.btnNotAppr = false;

    $scope.ChkChange = () => {
        $scope.btnAppr = $scope.btnNotAppr = $scope.gridApi.selection.getSelectedRows().length > 0;
        $scope.gridApi.selection.getSelectedRows().forEach((row) => {
            if (row.approved.flag === 'A' /* || row.approved.actionFlag === 'N'*/) { $scope.btnAppr = false; }
        });
    };

    $scope.Approval = (flag) => {
        var data = [];
        $scope.gridApi.selection.getSelectedRows().forEach((row) => {
            row.approved.actionFlag = row.approved.actionFlag === 'Y' ? flag : row.approved.actionFlag === flag ? 'O' : flag;
            data.push(row);
        });
        API.DiscountStd.Approval({
            data: { discountDetails: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $rootScope.DiscountApprovalGridDetailCtrl_SetData($scope.main, $scope.status); });
            },
            error: (res) => {
                var msg = '';
                res.data.discountDetails.forEach((v) => {
                    if (v._result._status === 'F') {
                        msg += 'Seq : ' + v.seq + ' : ' + v._result._message + '\n';
                    }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    };

});

app.controller("DiscountApprovalGridPriceCtrl", function ($rootScope, $scope, common, intersales, API) {

    $scope.IP_DB = $rootScope.IP_DB + 'sxsPriceStdMain, sxsPriceStdRangH, sxsPriceStdRangD, sxsPriceStdProd, sxsPriceStdValue';

    var SetClass = function (grid, row, col) {
        var classx = '';
        if (col.colDef.type === 'number') {
            if (common.GetObjVal(col.colDef.field, row.entity) < 0) classx += 'text-danger';
            else if (common.GetObjVal(col.colDef.field, row.entity) > 0) classx += 'text-success';
        }
        return classx;
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 65 }, format: { type: 'numRow' } }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountStdTableCode', display: 'Discount code', width: { min: 170 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'priceStdTableCode', display: 'code', width: { min: 150 }, group: { name: 'price', display: 'Price', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesDescription', display: 'Sales Description', width: { min: 300 }, group: { name: 'price', display: 'Price', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tagDescription', display: 'Tag Description', width: { min: 300 }, group: { name: 'price', display: 'Price', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateFrom', display: 'From', format: { type: 'datetime' }, width: { min: 90 }, group: { name: 'priceeff', display: 'Price Effective Date', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateTo', display: 'To', format: { type: 'datetime' }, width: { min: 90 }, group: { name: 'priceeff', display: 'Price Effective Date', langCode: '' }, setclass: SetClass }));

    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountPercent', display: '% Discount', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: SetClass, multiLine: true }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountAmount', display: 'Fix Discount', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: SetClass, multiLine: true }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'increaseAmount', display: 'Surchange', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: SetClass, multiLine: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'priceFOB', display: 'HC', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, group: { name: 'fob', display: 'FOB', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'restFOB', display: 'Net Price', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, group: { name: 'fob', display: 'FOB', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'priceCAF', display: 'HC', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, group: { name: 'caf', display: 'C&F', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'restCAF', display: 'Net Price', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, group: { name: 'caf', display: 'C&F', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'priceCIF', display: 'HC', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, group: { name: 'cif', display: 'CIF', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'restCIF', display: 'Net Price', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, group: { name: 'cif', display: 'CIF', langCode: '' }, setclass: SetClass }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => {
                    if (myRow.uid === row.uid) { numRow = index + 1; row.entity.no = index + 1; return; }
                });
                return numRow;
            } else if (myCol.field === "effectiveDateFrom") {
                return common.GetDateView(myRow.entity.effectiveDateFrom);
            } else if (myCol.field === "effectiveDateTo") {
                return common.GetDateView(myRow.entity.effectiveDateTo);
            }
        }
        return false;
    };
        
    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    };


    $rootScope.DiscountApprovalGridPriceCtrl_SetData = (row, main) => {
        if (!row || !main) {
            $scope.gridOpt.data = [];
            $scope.gridApi.grid.refresh();
            return;
        }


        API.PriceStd.SearchPriceForDiscount({
            data: {
                effectiveDateTo: main.effectiveDateTo
                , effectiveDateFrom: main.effectiveDateFrom
                , customerID: main.customer.id
                , productTypeID: main.productType.id
                , productGradeID: main.productGrade.id
                , currencyID: main.currency.id
                , unitTypeID: common.GetObjVal('unitType.id', row)
                , productID: common.GetObjVal('product.id', row)
                , minTwineSizeCode: common.GetObjVal('minTwineSize.code', row)
                , maxTwineSizeCode: common.GetObjVal('maxTwineSize.code', row)
                , knotID: common.GetObjVal('knot.id', row)
                , stretchingID: common.GetObjVal('stretching.id', row)
                , selvageWovenTypeID: common.GetObjVal('selvageWovenType.id', row)
                , colorGroupID: common.GetObjVal('colorGroup.id', row)
                , twineseriesID: common.GetObjVal('twineSeries.id', row)
                , minMeshSize: common.GetObjVal('minMeshSize', row)
                , maxMeshSize: common.GetObjVal('maxMeshSize', row)
                , minMeshDepth: common.GetObjVal('minMeshDepth', row)
                , maxMeshDepth: common.GetObjVal('maxMeshDepth', row)
                , minLength: common.GetObjVal('minLength', row)
                , maxLength: common.GetObjVal('maxLength', row)
                , approvedFlag: 'A'
            },
            callback: (res) => {
                res.data.prices.forEach((r) => {
                    r.effectiveDateFrom = common.CreateDateTime(r.effectiveDateFrom);
                    r.effectiveDateTo = common.CreateDateTime(r.effectiveDateTo);
                    r.discountPercent = row.discountPercent;
                    r.discountAmount = row.discountAmount;
                    r.increaseAmount = row.increaseAmount;
                    r.restFOB = intersales.PriceToRest(r.priceFOB, row.discountPercent, row.discountAmount, row.increaseAmount);
                    r.restCAF = intersales.PriceToRest(r.priceCAF, row.discountPercent, row.discountAmount, row.increaseAmount);
                    r.restCIF = intersales.PriceToRest(r.priceCIF, row.discountPercent, row.discountAmount, row.increaseAmount);
                });

                $scope.gridOpt.data = res.data.prices;
                $scope.gridApi.grid.refresh();
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };
});
