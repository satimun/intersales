'use strict';
app.controller("SalesReportOderOnhandReportController", function ($rootScope, $scope, API, $timeout, $filter, $q, common, intersales) {
    $scope.IP_DB = $rootScope.IP_DB + '[saleex].dbo.ORDERMST, [saleex].dbo.ORDERTRN, [saleex].dbo.PERFORMAMST, [saleex].dbo.PERFORMATRN, [saleex].dbo.GENPRODSTDCOST, [saleex].dbo.STKTRN, [saleex].dbo.PACKLIST, [saleex].dbo.PACKLIST1, [saleex].dbo.V_SALEEXCH';

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
        error: function (res) { common.AlertMessage("Error", res.message); }
    });
    // set LoadRegzone
    $scope.LoadRegzone = function (query) { return $filter('filter')($scope.regzoneList, { 'text': query }); };

    // load LoadZones
    $scope.zoneList = [];
    $scope.zones = [];
    KSSClient.API.ZoneAccount.Search({
        data: { search: '', status: 'A' },
        callback: function (res) {
            res.data.zoneAccounts.forEach(function (v) {
                $scope.zoneList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        },
        error: function (res) { common.AlertMessage("Error", res.message); }
    });
    // set LoadZones
    $scope.LoadZones = function (query) { return $filter('filter')($scope.zoneList, { 'text': query }); };

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

    $scope.showOrder = false;
    $scope.showOrders = [
        { value: false, text: 'All open.' },
        { value: true, text: 'Date range ' }
    ];

    var day = new Date();
    $scope.inventoryDate = day;

    $scope.ShowChk = () => {
        if ($scope.showOrder) {
            $scope.dateFrom = new Date(day.getFullYear(), day.getMonth(), 1);
            $scope.dateTo = new Date(day.getFullYear(), day.getMonth() + 1, 0);
        } else {
            $scope.dateFrom = null;
            $scope.dateTo = null;
        }
    };

    $scope.closeBy = false;
    $scope.closeBys = [
        { value: false, text: 'Close by KPK.' },
        { value: true, text: 'Close by KCI.' }
    ];

    $scope.ChkDate = () => {
        if (!$scope.dateFrom || !$scope.dateTo) { return 0; }
        if ($scope.dateFrom.getTime() > $scope.dateTo.getTime()) {
            common.AlertMessage('warning', 'Date from must be less than the date to.');
        }
    };

    $scope.admitDate = null;
    $scope.onlyInventory = false;
    $scope.deadstock = false;

    $scope.lists = [
        { label: 'Zone', field: 'zone.code', checked: true },
        { label: 'Country', field: 'country.code', checked: false },
        { label: 'Customer', field: 'customer.code', checked: false },
        { label: 'Material Group', field: 'materialGroup', checked: false },
        { label: 'Product', field: 'productType.code', checked: false },
        { label: 'Diameter Group', field: 'diameterGroup', checked: false },
        { label: 'Diameter', field: 'diameter', checked: false },
        { label: 'Color', field: 'color.code', checked: false },
        { label: 'Currency', field: 'currencyCode', checked: false }
    ];
    $scope.$watch('lists', (v) => {
        if (v.length) {
            var tmpCol = [];
            v.forEach((c1) => {
                $scope.gridOpt.columnDefs.forEach((c2, i) => {
                    if (c1.field === c2.field) {
                        tmpCol.push(c2);
                        $scope.gridOpt.columnDefs.splice(i, 1);
                    }
                });
            });
            tmpCol.forEach((c, i) => {
                $scope.gridOpt.columnDefs.splice(i, 0, c);
            });
            $scope.ChangeChk();
        }
    }, true);


    $scope.group1 = false;
    $scope.onGroup1Change = () => {
        $scope.lists.find(v => v.field == 'materialGroup').checked = $scope.group1;
        $scope.lists.find(v => v.field == 'productType.code').checked = $scope.group1;
        let item = $scope.lists.find(v => v.field == 'diameterGroup');
        item.checked = $scope.group1;
        // $scope.onGroupChange(item);
        $scope.ChangeChk();
    }

    $scope.gZone = true;
    $scope.gCountry = false;
    $scope.gCustomer = false;
    $scope.gProduct = false;
    $scope.gMaterialGroup = false;
    $scope.gDiameterGroup = false;
    $scope.gDiameter = false;
    $scope.gColor = false;
    $scope.gCurrency = false;

    $scope.ChangeChk = () => {
        $scope.lists.forEach((v) => {
            if (v.label === 'Zone') { $scope.gZone = v.checked; }
            if (v.label === 'Country') { $scope.gCountry = v.checked; }
            if (v.label === 'Customer') { $scope.gCustomer = v.checked; }
            if (v.label === 'Material Group') { $scope.gMaterialGroup = v.checked; }
            if (v.label === 'Product') { $scope.gProduct = v.checked; }
            if (v.label === 'Diameter Group') { $scope.gDiameterGroup = v.checked; }
            if (v.label === 'Diameter') { $scope.gDiameter = v.checked; }
            if (v.label === 'Color') { $scope.gColor = v.checked; }
            if (v.label === 'Currency') { $scope.gCurrency = v.checked; }
        });

        $scope.colGroup = [];
        $scope.gridOpt.columnDefs.forEach((c) => {
            if (c.field === "zone.code") { c.grouping2 = c.visible = $scope.gZone; c.showCountItems = false; }
            else if (c.field === "country.code") { c.grouping2 = c.visible = $scope.gCountry; c.showCountItems = false; }
            else if (c.field === "customer.code") { c.grouping2 = c.visible = $scope.gCustomer; c.showCountItems = false; }
            else if (c.field === "materialGroup") { c.grouping2 = c.visible = $scope.gMaterialGroup; c.showCountItems = false; }
            else if (c.field === "productType.code") { c.grouping2 = c.visible = $scope.gProduct; c.showCountItems = false; }
            else if (c.field === "diameterGroup") { c.grouping2 = c.visible = $scope.gDiameterGroup; c.showCountItems = false; }
            else if (c.field === "diameter") { c.grouping2 = c.visible = $scope.gDiameter; c.showCountItems = false; }
            else if (c.field === "color.code") { c.grouping2 = c.visible = $scope.gColor; c.showCountItems = false; }
            else if (c.field === "currencyCode") { c.grouping2 = c.visible = $scope.gCurrency; c.showCountItems = false; }
            if (c.visible && c.grouping2) { $scope.colGroup.push(c.field); }
        });
        //$scope.colGroup.push('currencyCode');

        $scope.gridOpt.columnDefs.forEach((c) => {
            if (c.field === $scope.colGroup[0]) c.showCountItems = true;
            if (c.field === $scope.colGroup[$scope.colGroup.length - 1]) { c.grouping2 = false; }
        });

        $scope.SetData();

    };

    $scope.cols2 = [
        { id: 1, label: 'Quantity', field: 'quantity', checked: true },
        { id: 2, label: 'Weight(KG)', field: 'weight', checked: true },
        { id: 3, label: 'Bales', field: 'bale', checked: true },
        { id: 4, label: 'Values', field: 'values', checked: true },
        { id: 5, label: 'Value(THB)', field: 'valueTHB', checked: true }
    ];

    $scope.cols = [
        { id: 1, label: 'Proforma Balance', prefix: 'proforma', fields: $scope.cols2, checked: true },
        { id: 2, label: 'Delivered', prefix: 'delivered', fields: $scope.cols2, checked: true },
        { id: 3, label: 'Outstanding Balance', prefix: 'outstanding', fields: $scope.cols2, checked: true },
        { id: 4, label: 'Inventory', prefix: 'inventory', fields: $scope.cols2, checked: true },
        { id: 5, label: 'Expecting', prefix: 'expecting', fields: $scope.cols2, checked: false }
    ];

    $scope.ColumnChk = () => {
        $scope.cols.forEach((x) => {
            x.fields.forEach((y) => {
                $scope.gridOpt.columnDefs.find((c) => { return c.field === x.prefix.concat('.', y.field); }).visible = x.checked && y.checked;
            });
        });
        $scope.SetData();
    };
            
    var SetClass = function (grid, row, col) {
        var classx = '';
        if (row.entity.totalRow) {
            classx += 'bg-info font-bold ';
        }
        if (col.colDef.type === 'number') {
            if (common.GetObjVal(col.colDef.field, row.entity) < 0) classx += 'text-danger';
        }
        return classx;
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true, enableTotalCurrency: false, grouping2: { enable: true, showTotal: true } });
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'action', display: '', width: { default: 45 }, format: { type: 'btnPopup', func: 'ShowDetail' }, hiding: false, sort: false, filter: false, pinnedLeft: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'zone.code', display: 'Zone', width: { default: 250 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'country.code', display: 'Country', width: { default: 250 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer.code', display: 'Customer', width: { default: 250 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'materialGroup', display: 'Material Group', width: { default: 150 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productType.code', display: 'Product', width: { default: 200 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'diameterGroup', display: 'Diameter Group', width: { default: 150 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'diameter', display: 'Diameter', width: { default: 100 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'color.code', display: 'Color', width: { default: 150 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'currencyCode', display: 'Currency', width: { default: 90 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'proforma.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, group: { name: 'proforma', display: 'Proforma Balance' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'proforma.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, group: { name: 'proforma', display: 'Proforma Balance' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'proforma.bale', display: 'Bales', width: { min: 65 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, group: { name: 'proforma', display: 'Proforma Balance' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'proforma.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, group: { name: 'proforma', display: 'Proforma Balance' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'proforma.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, group: { name: 'proforma', display: 'Proforma Balance' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'delivered.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, group: { name: 'delivered', display: 'Delivered' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'delivered.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, group: { name: 'delivered', display: 'Delivered' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'delivered.bale', display: 'Bales', width: { min: 65 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, group: { name: 'delivered', display: 'Delivered' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'delivered.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, group: { name: 'delivered', display: 'Delivered' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'delivered.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, group: { name: 'delivered', display: 'Delivered' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstanding.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, group: { name: 'outstanding', display: 'Outstanding Balance' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstanding.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, group: { name: 'outstanding', display: 'Outstanding Balance' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstanding.bale', display: 'Bales', width: { min: 65 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, group: { name: 'outstanding', display: 'Outstanding Balance' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstanding.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, group: { name: 'outstanding', display: 'Outstanding Balance' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'outstanding.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, group: { name: 'outstanding', display: 'Outstanding Balance' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, group: { name: 'inventory', display: 'Inventory' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, group: { name: 'inventory', display: 'Inventory' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.bale', display: 'Bales', width: { min: 65 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, group: { name: 'inventory', display: 'Inventory' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, group: { name: 'inventory', display: 'Inventory' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'inventory.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, group: { name: 'inventory', display: 'Inventory' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'expecting.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, group: { name: 'expecting', display: 'Expecting' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'expecting.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, group: { name: 'expecting', display: 'Expecting' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'expecting.bale', display: 'Bales', width: { min: 65 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, group: { name: 'expecting', display: 'Expecting' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'expecting.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, group: { name: 'expecting', display: 'Expecting' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'expecting.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, group: { name: 'expecting', display: 'Expecting' } }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === 'zone.code') {
                return angular.isUndefined(myRow.entity.zone) ? '' : myRow.entity.zone.code_view;
            } else if (myCol.field === 'country.code') {
                return angular.isUndefined(myRow.entity.country) ? '' : myRow.entity.country.code_view;
            } else if (myCol.field === 'customer.code') {
                return angular.isUndefined(myRow.entity.customer) ? '' : myRow.entity.customer.code_view;
            } else if (myCol.field === 'materialGroup') {
                return angular.isUndefined(myRow.entity.materialGroup_view) ? '' : myRow.entity.materialGroup_view;
            } else if (myCol.field === 'productType.code') {
                return angular.isUndefined(myRow.entity.productType) ? '' : myRow.entity.productType.code_view;
            } else if (myCol.field === 'diameterGroup') {
                return angular.isUndefined(myRow.entity.diameterGroup_view) ? '' : myRow.entity.diameterGroup_view;
            } else if (myCol.field === 'diameter') {
                return angular.isUndefined(myRow.entity.diameter_view) ? '' : myRow.entity.diameter_view;
            } else if (myCol.field === 'color.code') {
                return angular.isUndefined(myRow.entity.color) ? '' : myRow.entity.color.code_view;
            } else if (myCol.field === 'currencyCode') {
                return angular.isUndefined(myRow.entity.currencyCode) ? '' : myRow.entity.currencyCode_view;
            }
        }
        return false;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        $scope.ChangeChk();
        $scope.ColumnChk();
    };

    $scope.data = [];

    $scope.LoadData = function () {

        var zoneAccountIDs = [];
        $scope.zones.forEach(function (v) { zoneAccountIDs.push(v.id); });

        var regionalZoneIDs = [];
        $scope.regzone.forEach((v) => { regionalZoneIDs.push(v.id); });

        var customerIDs = [];
        $scope.customers.forEach((v) => { customerIDs.push(v.id); });

        API.OrderOnhand.Report({
            data: {
                showOrder: $scope.showOrder
                , dateFrom: common.GetDateString($scope.dateFrom)
                , dateTo: common.GetDateString($scope.dateTo)
                , invtoryDate: common.GetDateString($scope.inventoryDate)
                , closeBy: $scope.closeBy
                , admitDate: common.GetDateString($scope.admitDate)
                , onlyInventory: $scope.onlyInventory
                , deadstock: $scope.deadstock,

                regionalZoneIDs: regionalZoneIDs,
                zoneAccountIDs: zoneAccountIDs,
                customerIDs: customerIDs,

                "MaterialGroup": true, //$scope.lists.find(v => v.field === 'materialGroup').checked,
                "DiameterGroup": true //$scope.lists.find(v => v.field === 'diameterGroup').checked,
            },
            callback: function (res) {
                res.data.orders.forEach((row) => {
                    $scope.btnExport = true;
                    row.zone.code_view = row.zone.code_vieworg = common.GetCodeDescription(row.zone);
                    row.country.code_view = row.country.code_vieworg = common.GetCodeDescription(row.country);
                    row.color.code_view = row.color.code_vieworg = common.GetCodeDescription(row.color);
                    row.customer.code_view = row.customer.code_vieworg = common.GetCodeDescription(row.customer);
                    row.productType.code_view = row.productType.code_vieworg = common.GetCodeDescription(row.productType);

                    row.materialGroup_view = row.materialGroup_vieworg = row.materialGroup;
                    row.diameterGroup_view = row.diameterGroup_vieworg = row.diameterGroup;

                    row.diameter_view = row.diameter_vieworg = row.diameter;
                    row.twine = intersales.GetDiameter(row.diameter);
                    row.currencyCode_view = row.currencyCode_vieworg = row.currencyCode;
                });
                $scope.data = res.data.orders;
                $scope.SetData();
                $scope.detail = $scope.showOrders.find((x) => { return x.value === $scope.showOrder; }).text + ($scope.showOrder ? ': ' + common.GetDateView($scope.dateFrom) + ' - ' + common.GetDateView($scope.dateTo) : ', ');
                $scope.detail += 'Inventory Date: ' + common.GetDateView($scope.inventoryDate) + ' -> ';
                $scope.detail += $scope.closeBys.find((x) => { return x.value === $scope.closeBy; }).text;
                $scope.detail += common.GetDateString($scope.admitDate) ? ', Admit Date: ' + common.GetDateView($scope.admitDate) : '';
                $scope.detail += $scope.onlyInventory ? ', Only items with inventory' : '';
                $scope.detail += $scope.deadstock ? ', Deadstock' : '';

            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    };

    $scope.SetData = function () {
        var tmpObj = [], data = [], totalCurrency = [];
        angular.copy($scope.data).forEach((d) => {
            var obj = {};
            $scope.colGroup.forEach((c) => { var key = c.split('.')[0]; obj[key] = d[key]; });
            var chk = true;
            tmpObj.forEach((o, index) => {
                if (angular.equals(o.group, obj)) {
                    tmpObj[index].data.push(d);
                    chk = false;
                }
            });
            if (chk) { tmpObj.push({ group: obj, data: [d], total: {} }); }

        });
        
        tmpObj.forEach((o) => {
            o.total = o.data.pop();

            //------------------------------------ total currency ----------------------------------//
            $scope.SetTotalCurrency(totalCurrency, o.total);

            o.data.forEach((d) => {

                o.total.proforma.quantity += d.proforma.quantity;
                o.total.proforma.weight += d.proforma.weight;
                o.total.proforma.bale += d.proforma.bale;
                d.proforma.values.forEach((x) => {
                    var tmp = o.total.proforma.values.find((d) => { return d.code === x.code; });
                    if (tmp) tmp.num += x.num;
                    else o.total.proforma.values.push(angular.copy(x));
                });
                o.total.proforma.valueTHB += d.proforma.valueTHB;

                o.total.delivered.quantity += d.delivered.quantity;
                o.total.delivered.weight += d.delivered.weight;
                o.total.delivered.bale += d.delivered.bale;
                d.delivered.values.forEach((x) => {
                    var tmp = o.total.delivered.values.find((d) => { return d.code === x.code; });
                    if (tmp) tmp.num += x.num;
                    else o.total.delivered.values.push(angular.copy(x));
                });
                o.total.delivered.valueTHB += d.delivered.valueTHB;

                o.total.outstanding.quantity += d.outstanding.quantity;
                o.total.outstanding.weight += d.outstanding.weight;
                o.total.outstanding.bale += d.outstanding.bale;
                d.outstanding.values.forEach((x) => {
                    var tmp = o.total.outstanding.values.find((d) => { return d.code === x.code; });
                    if (tmp) tmp.num += x.num;
                    else o.total.outstanding.values.push(angular.copy(x));
                });
                o.total.outstanding.valueTHB += d.outstanding.valueTHB;

                o.total.inventory.quantity += d.inventory.quantity;
                o.total.inventory.weight += d.inventory.weight;
                o.total.inventory.bale += d.inventory.bale;
                d.inventory.values.forEach((x) => {
                    var tmp = o.total.inventory.values.find((d) => { return d.code === x.code; });
                    if (tmp) tmp.num += x.num;
                    else o.total.inventory.values.push(angular.copy(x));
                });
                o.total.inventory.valueTHB += d.inventory.valueTHB;

                o.total.expecting.quantity += d.expecting.quantity;
                o.total.expecting.weight += d.expecting.weight;
                o.total.expecting.bale += d.expecting.bale;
                d.expecting.values.forEach((x) => {
                    var tmp = o.total.expecting.values.find((d) => { return d.code === x.code; });
                    if (tmp) tmp.num += x.num;
                    else o.total.expecting.values.push(angular.copy(x));
                });
                o.total.expecting.valueTHB += d.expecting.valueTHB;

                //------------------------------------ total currency ----------------------------------//
                $scope.SetTotalCurrency(totalCurrency, d);
                
            });

            data.push(o.total);
        });

        var codeSort = [];
        $scope.colGroup.forEach((c) => {
            if (c === 'diameter') {
                codeSort.push('twine.size');
                codeSort.push('twine.amount');
                codeSort.push('twine.word');
            } else { codeSort.push(c); }
        });
        data = $filter('orderBy')(data, codeSort, false);
        $timeout(() => {
            
            totalCurrency.forEach((d, i) => {
                if (!i) {
                    data.push({ totalRow: true, visible: true });
                }
                d.zone.code_view = d.country.code_view = d.color.code_view = d.color.code_view = d.productType.code_view = d.diameter_view = d.customer.code_view = d.materialGroup_view = d.diameterGroup_view = '';
                common.SetObjVal($scope.colGroup[0], 'Total Currency ' + d.currencyCode, d);
                common.SetObjVal(($scope.colGroup[0] + '_view').split('.'), 'Total Currency ' + d.currencyCode, d);
                
                d.totalRow = true;
                d.visible = true;
                data.push(d);
            });

            var length = Math.abs(data.length * $scope.colGroup.length);

            for (var i = 0; i < length; i++) {
                data.push({ totalRow: true, visible: false });
            }

            $scope.gridOpt.data = data;
            $scope.gridApi.grid.refresh();
        });
    };

    $scope.SetTotalCurrency = (totalCurrency, d) => {
        var tmpt = totalCurrency.find((x) => { return x.currencyCode === d.currencyCode; });
        if (tmpt) {
            tmpt.proforma.quantity += d.proforma.quantity;
            tmpt.proforma.weight += d.proforma.weight;
            tmpt.proforma.bale += d.proforma.bale;
            d.proforma.values.forEach((x) => {
                var tmp = tmpt.proforma.values.find((d) => { return d.code === x.code; });
                if (tmp) tmp.num += x.num;
                else tmpt.proforma.values.push(angular.copy(x));
            });
            tmpt.proforma.valueTHB += d.proforma.valueTHB;

            tmpt.delivered.quantity += d.delivered.quantity;
            tmpt.delivered.weight += d.delivered.weight;
            tmpt.delivered.bale += d.delivered.bale;
            d.delivered.values.forEach((x) => {
                var tmp = tmpt.delivered.values.find((d) => { return d.code === x.code; });
                if (tmp) tmp.num += x.num;
                else tmpt.delivered.values.push(angular.copy(x));
            });
            tmpt.delivered.valueTHB += d.delivered.valueTHB;

            tmpt.outstanding.quantity += d.outstanding.quantity;
            tmpt.outstanding.weight += d.outstanding.weight;
            tmpt.outstanding.bale += d.outstanding.bale;
            d.outstanding.values.forEach((x) => {
                var tmp = tmpt.outstanding.values.find((d) => { return d.code === x.code; });
                if (tmp) tmp.num += x.num;
                else tmpt.outstanding.values.push(angular.copy(x));
            });
            tmpt.outstanding.valueTHB += d.outstanding.valueTHB;

            tmpt.inventory.quantity += d.inventory.quantity;
            tmpt.inventory.weight += d.inventory.weight;
            tmpt.inventory.bale += d.inventory.bale;
            d.inventory.values.forEach((x) => {
                var tmp = tmpt.inventory.values.find((d) => { return d.code === x.code; });
                if (tmp) tmp.num += x.num;
                else tmpt.inventory.values.push(angular.copy(x));
            });
            tmpt.inventory.valueTHB += d.inventory.valueTHB;

            tmpt.expecting.quantity += d.expecting.quantity;
            tmpt.expecting.weight += d.expecting.weight;
            tmpt.expecting.bale += d.expecting.bale;
            d.expecting.values.forEach((x) => {
                var tmp = tmpt.expecting.values.find((d) => { return d.code === x.code; });
                if (tmp) tmp.num += x.num;
                else tmpt.expecting.values.push(angular.copy(x));
            });
            tmpt.expecting.valueTHB += d.expecting.valueTHB;
        } else {
            totalCurrency.push(angular.copy(d));
        }
    };

    $scope.btnExport = false;
    

    $scope.Export = function () {
        var workbook = new ExcelBuilder.Workbook();
        var worksheet = new ExcelBuilder.Worksheet({ name: 'Sheet1' });
        workbook.addWorksheet(worksheet);
        var stylesheet = workbook.getStyleSheet();

        var borderStyle = stylesheet.createBorderFormatter({ bottom: { style: 'thin', color: 'FF000000' }, top: { style: 'thin', color: 'FF000000' }, left: { style: 'thin', color: 'FF000000' }, right: { style: 'thin', color: 'FF000000' } }).id;

        var titleFormat = stylesheet.createFormat({
            font: { size: 11, fontName: 'Calibri', bold: true, color: 'FF000000' },
            alignment: { horizontal: 'right', vertical: 'center' }
        }).id;
        var valueFormat = stylesheet.createFormat({
            font: { size: 11, fontName: 'Calibri', color: 'FF000000' },
            alignment: { horizontal: 'left', vertical: 'center' }
        }).id;

        var reportNamme = stylesheet.createFormat({
            font: { size: 20, fontName: 'Calibri', bold: true, color: 'FF000000' },
            alignment: { horizontal: 'left', vertical: 'center' }
        }).id;

        var headFormat = stylesheet.createFormat({
            font: { size: 11, fontName: 'Calibri', bold: true, color: 'FF000000' },
            fill: { type: "pattern", patternType: "solid", fgColor: "FFB1A0C7", bgColor: "FFB1A0C7" }, //b1a0c7
            border: borderStyle,
            alignment: { wrapText: true, horizontal: 'center', vertical: 'center' }
        }).id;

        var rowFont = stylesheet.createFontStyle({ size: 10, fontName: 'Trebuchet MS', color: 'FF000000' }).id;
        var rowFontTotal = stylesheet.createFontStyle({ size: 10, fontName: 'Trebuchet MS', bold: true, color: 'FF000000' }).id;

        var rowFont_red = stylesheet.createFontStyle({ size: 10, fontName: 'Trebuchet MS', color: 'FFFF0000' }).id;
        var rowFontTotal_red = stylesheet.createFontStyle({ size: 10, fontName: 'Trebuchet MS', bold: true, color: 'FFFF0000' }).id;

        var totalFill = stylesheet.createFill({ type: "pattern", patternType: "solid", fgColor: "FFFFFF66", bgColor: "FFFFFF66" }).id;

        var GenFormatText = (fill, align, font) => {
            var obj = {
                font: angular.isUndefined(font) ? rowFont : font, fill: fill, border: borderStyle,
                alignment: { horizontal: angular.isUndefined(align) ? 'center' : align, vertical: 'center' }
            };
            return stylesheet.createFormat(obj).id;
        };
        var GenFormatNumber = (fill, format, font) => {
            var obj = {
                font: angular.isUndefined(font) ? rowFont : font, format: angular.isUndefined(format) ? '#,##0.00' : format,
                fill: fill, border: borderStyle,
                alignment: { horizontal: 'right', vertical: 'center' }
            };
            return stylesheet.createFormat(obj).id;
        };

        var style = {};
        style.text = { textCenter: GenFormatText(''), textLeft: GenFormatText('', 'left'), int: GenFormatNumber('', '#,##0'), decimal: GenFormatNumber('') };
        style.textRed = { textCenter: GenFormatText('', '', rowFont_red), textLeft: GenFormatText('', 'left', rowFont_red), int: GenFormatNumber('', '#,##0', rowFont_red), decimal: GenFormatNumber('', '#,##0.00', rowFont_red) };
        style.total = { textCenter: GenFormatText(totalFill, '', rowFontTotal), textLeft: GenFormatText(totalFill, 'left', rowFontTotal), int: GenFormatNumber(totalFill, '#,##0', rowFontTotal), decimal: GenFormatNumber(totalFill, '#,##0.00', rowFontTotal) };
        style.totalRed = { textCenter: GenFormatText(totalFill, '', rowFontTotal_red), textLeft: GenFormatText(totalFill, 'left', rowFontTotal_red), int: GenFormatNumber(totalFill, '#,##0', rowFontTotal_red), decimal: GenFormatNumber(totalFill, '#,##0.00', rowFontTotal_red) };

        var data = [];

        data.push([{ value: 'Order Onhand Report : ' + $scope.detail, metadata: { style: reportNamme, type: 'string' } }]);
        worksheet.setRowInstructions(1, { height: 45 });

        var showCol = $scope.lists;
        var widthCol = { Zone: 25, Country: 25, Customer: 40, Product: 25, Diameter: 18, Color: 25, Currency: 15 };

        var startRow = 2;

        var tmpCol1 = [], tmpCol2 = [], startCol = 65, tmpWidth = [];

        showCol.forEach((c) => {
            if (c.checked) {
                tmpCol1.push({ value: c.label, metadata: { style: headFormat, type: 'string' } });
                tmpCol2.push({ value: c.label, metadata: { style: headFormat, type: 'string' } });
                worksheet.mergeCells(String.fromCharCode(startCol) + (startRow), String.fromCharCode(startCol) + (startRow + 1));
                tmpWidth.push({ width: widthCol[c.label] });
                startCol++;
            }
        });

        var showCols = []; 
        let digi1 = startCol - 1;
        let digi2 = 64;

        $scope.cols.forEach((x) => { 
            let code1 = '';
            if (x.checked) {
                if (digi1 + 1 > 90) {
                    digi1 = 64;
                    digi2++;
                }
                code1 = (digi2 > 64 ? String.fromCharCode(digi2) : '') + String.fromCharCode(++digi1);
            }
            let fields = x.fields.filter(c => c.checked);
            fields.forEach((y, i) => {
                if (x.checked && y.checked) {
                    showCols.push({ label1: x.label, label2: y.label, field: x.prefix.concat('.', y.field) });
                    tmpCol1.push({ value: x.label, metadata: { style: headFormat, type: 'string' } });
                    tmpCol2.push({ value: y.label, metadata: { style: headFormat, type: 'string' } });
                    tmpWidth.push({ width: 15 });

                    if (i > 0) digi1++;

                    if (digi1 + 1 > 90 && i !== fields.length - 1) {
                        digi1 = 64;
                        digi2++;
                    }
                }
            });
            if (x.checked) {
                let code2 = (digi2 > 64 ? String.fromCharCode(digi2) : '') + String.fromCharCode(digi1);
                worksheet.mergeCells(code1 + (startRow), code2 + (startRow));
            }
        });

        // column add1
        data.push(tmpCol1);
        // column add2
        data.push(tmpCol2);
        // set Col width
        worksheet.setColumns(tmpWidth);

        for (var i = 0; i < data.length; i++) { worksheet.setRowInstructions(i, { height: 25.5 }); }
        startRow = data.length;
        //var tmpSum = {};
        var dataGrid = $scope.gridApi.grid;
        dataGrid.renderContainers.body.visibleRowCache.map(x => x.entity).forEach(function (row, i) {

            var styleKey = 'text';

            if (row.totalRow) {
                styleKey = 'total';
                worksheet.mergeCells('A' + (startRow + 1), String.fromCharCode(startCol - 1) + (startRow + 1));
            }

            var tmpData = [];

            showCol.forEach((c) => {
                if (c.checked) { tmpData.push({ value: common.GetObjVal(c.field + '_view', row), metadata: { style: style[styleKey].textLeft, type: 'string' } }); }
            });

            showCols.forEach((c) => {
                var val = common.GetObjVal(c.field, row);
                var chkarr = false;
                if (angular.isArray(val)) {
                    chkarr = true;
                    var tmp = '';
                    val.forEach((x, i) => {
                        if (i !== 0) tmp += ', ';
                        tmp += x.code.concat(' ', $filter('number')(x.num, 2));
                    });
                    val = tmp;
                }
                tmpData.push({ value: val, metadata: { style: val < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: chkarr ? 'string' : 'number' } });
            });

            data.push(tmpData);
            startRow++;

        });

        var dataTotal = {};
        dataGrid.columns.forEach((c) => {
            showCols.forEach((k) => {
                if (c.field === k.field) {
                    common.SetObjVal(k.field, c.aggregationValue, dataTotal);
                }
            });
        });

        var tmpDataTotal = [];
        var styleKey = 'total';

        showCol.forEach((c) => {
            if (c.checked) { tmpDataTotal.push({ value: '', metadata: { style: style[styleKey].textLeft, type: 'string' } }); }
        });
        if (tmpDataTotal.length) { tmpDataTotal[0].value = 'Grand Total'; }

        showCols.forEach((c) => {
            var val = common.GetObjVal(c.field, dataTotal);
            var chkarr = false;
            if (angular.isArray(val)) {
                chkarr = true;
                var tmp = '';
                val.forEach((x, i) => {
                    if (i !== 0) tmp += ', ';
                    tmp += x.code.concat(' ', $filter('number')(x.sum, 2));
                });
                val = tmp;
            }
            tmpDataTotal.push({ value: val, metadata: { style: val < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: chkarr ? 'string' : 'number' } });
        });

        data.push(tmpDataTotal);
        worksheet.mergeCells('A' + (data.length), String.fromCharCode(startCol - 1) + (data.length));

        worksheet.sheetView.showGridLines = false;
        worksheet.setData(data);
        common.ExportExcel(workbook, 'Order Onhand Report');
    };

});
