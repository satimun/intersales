'use strict';
app.controller("shipmentplanfailreportController", function ($rootScope, $scope, $location, $timeout, $filter, $q, common, intersales) {

    $scope.IP_DB = $rootScope.IP_DB + 'sxtShipmentPlanH, sxtShipmentPlanD, sxsRemark, [saleex].dbo.COMMERCIAL1MST, [saleex].dbo.COMMERCIAL1TRN';

    // set date
    var d = new Date();
    $scope.year = d.getFullYear();

    $scope.GenMonth = (year) => { /*if (year) { $scope.GetCost(year); }*/ };

    // load & set MonthTo
    $scope.monthTo = {};
    $scope.monthTo.list = [];
    $scope.monthTo.view = '';
    $scope.monthTo.id = '';
    $scope.monthTo.SetID = function (id) {
        $scope.monthTo.id = id;
        if (!id) { $scope.monthTo.view = $scope.monthFrom.view; }
    };

    // load & set MonthFrom
    $scope.monthFrom = {};
    $scope.monthFrom.list = [];
    for (var i = 0; i < 12; i++) { var date = new Date(d.getFullYear(), i, 1); $scope.monthFrom.list.push({ id: i + 1, view: date.toLocaleString("en-us", { month: "long" }) }); }
    $timeout(() => { $scope.monthFrom.view = d.toLocaleString("en-us", { month: "long" }); });
    $scope.monthFrom.id = '';
    $scope.monthFrom.SetID = function (id) {
        $scope.monthFrom.id = id;
        $scope.monthTo.list = $filter('filter')($scope.monthFrom.list, function (value) { return value.id >= id; });
        if ($scope.monthTo.id < $scope.monthFrom.id) { $scope.monthTo.view = $scope.monthFrom.view; }
    };

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

    var ConvertData = (row) => {
        row.customer = row.customers.map(x => x.code + ' : ' + x.description).join(", ");
        row.port = row.ports.map(x => x.code + ' : ' + x.description).join(", ");
        row.ciCodes = row.ciCodes.join(", ");
        row.paymentTerms = KSSClient.Engine.Common.ArrayToStringComma(row.paymentTerms);

        var planDate = KSSClient.Engine.Common.CreateDateTime(row.date);
        row.planDate_view = KSSClient.Engine.Common.GetDateView(planDate);
        row.planDate_export = KSSClient.Engine.Common.GetDateView2(planDate);

        row.lastAdmitDate_view = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.stockDate));
        row.lastAdmitDate_export = KSSClient.Engine.Common.GetDateView2(KSSClient.Engine.Common.CreateDateTime(row.stockDate));

        row.remark_view = common.GetCodeDescription(row.remark);

        row.month = row.month_view = row.month_vieworg = planDate.toLocaleString("en-us", { month: "long" });
        $scope.btnExport = true;
        return row;
    };

    var GenData = (data) => {
        var tmp = [];
        data.forEach((d) => { if (d.status === 'R') { tmp.push(ConvertData(d.plan)); } });
        return tmp;
    };

    $scope.LoadData = function () {
        var zoneAccountIDs = [];
        $scope.zones.forEach(function (v) { zoneAccountIDs.push(v.id); });

        var regionalZoneIDs = [];
        $scope.regzone.forEach((v) => { regionalZoneIDs.push(v.id); });

        KSSClient.API.ShipmentPlan.GetReport2({
            data: {
                type: 'M'
                , compare: 'A'
                , year: $scope.year
                , monthFrom: $scope.monthFrom.id
                , monthTo: $scope.monthTo.id
                , regionalZoneIDs: regionalZoneIDs
                , zoneAccountIDs: zoneAccountIDs
                , option: 1
            },
            callback: (res) => {
                var data = GenData(res.data.reports);
                var length = data.length * 5;
                for (var i = 0; i < length; i++) { data.push({ totalRow: true }); }
                $scope.SetData(data);
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    //////////////////////////////////////////////////////// GRID /////////////////////////////////////////////////////////////

    var SetClass = function (grid, row, col) {
        var classx = '';
        if (row.entity.totalRow) {
            classx += 'bg-info font-bold ';
        }
        //if (col.colDef.type === 'number') {
        //    if (common.GetObjVal(col.colDef.field, row.entity) < 0) classx += 'text-danger';
        //}
        return classx;
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true, showTotalGrouping2: true, showTotalCurrency: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'month', display: 'Month', width: { min: 110 }, setclass: SetClass, format: { type: 'customText' }, grouping2: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer', display: 'Customer', width: { min: 300 }, format: { type: 'text', showTotal: true }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port', display: 'Port/ Country', width: { min: 200 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'ciCodes', display: 'Order Number (PI/CI)', width: { min: 170 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastAdmitDate_view', display: 'Stock Date', width: { min: 115 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planDate_view', display: 'ETD (KKF)', width: { min: 115 }, setclass: SetClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerms', display: 'Payment Term', width: { min: 115 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Transport', width: { min: 90 }, setclass: SetClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark_view', display: 'Remark', width: { min: 250 }, setclass: SetClass }));

    $scope.cumulative = function (grid, row, col) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (col.field == 'month') {
                if (col.colDef.grouping2) { return row.entity.month_view; }
                else { return row.entity.month; }
            }
        }
        return false
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_shipmentplanfailreport01');
    };

    $scope.SetData = (data) => {
        $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
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

        var zone = KSSClient.Engine.Common.ArrayToStringComma($scope.zones, 'text');
        var regzone = KSSClient.Engine.Common.ArrayToStringComma($scope.regzone, 'text');

        // Report Name
        data.push([{ value: 'Unfulfilled Shipment Report', metadata: { style: reportNamme, type: 'string' } }]);

        // title header
        data.push([{ value: 'Year : ', metadata: { style: titleFormat, type: 'string' } }, { value: $scope.year, metadata: { style: valueFormat, type: 'string' } }
            , { value: 'Month From : ', metadata: { style: titleFormat, type: 'string' } }, { value: $scope.monthFrom.view, metadata: { style: valueFormat, type: 'string' } }
            , { value: 'Month To : ', metadata: { style: titleFormat, type: 'string' } }, { value: $scope.monthTo.view, metadata: { style: valueFormat, type: 'string' } }
        ]);
        data.push([{ value: 'Regional Zone : ', metadata: { style: titleFormat, type: 'string' } }, { value: regzone, metadata: { style: valueFormat, type: 'string' } }
            , { value: 'Zones : ', metadata: { style: titleFormat, type: 'string' } }, { value: zone, metadata: { style: valueFormat, type: 'string' } }
        ]);

        var startRow = 4;

        var tmpCol1 = [{ value: 'Month', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Customer', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Port/ Country', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Order Number (PI/CI)', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Stock Date', metadata: { style: headFormat, type: 'string' } }
            , { value: 'ETD (KKF)', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Payment Term', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Transport', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Quantity', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Weight(KG)', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Bales', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Values', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Value(THB)', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Remark', metadata: { style: headFormat, type: 'string' } }
        ];

        var tmpWidth2 = [{ width: 18 }
            , { width: 45 }
            , { width: 35 }
            , { width: 14 }
            , { width: 17 }
            , { width: 14 }
            , { width: 14 } // Payment Term
            , { width: 12 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 20, hidden: $scope.hideValue }
            , { width: 15, hidden: $scope.hideValue }
            , { width: 35, hidden: $scope.hideValue } // remark
        ];

        // column add1
        data.push(tmpCol1);
        // set Col width
        worksheet.setColumns(tmpWidth2);

        for (var i = 0; i < data.length; i++) { worksheet.setRowInstructions(i, { height: 25.5 }); }
        startRow = data.length;
        worksheet.setRowInstructions(startRow -1, { height: 45 });
        var tmpSum = {};
        var dataGrid = $scope.gridApi.grid;
        dataGrid.renderContainers.body.visibleRowCache.map(x => x.entity).forEach(function (row, i) {

            var styleKey = 'text';

            if (row.totalRow) {
                styleKey = 'total';
            }
            var tmpData2 = [];
            var tv = '';
            if (row.balance) { tv = row.balance.values.map(x => x.code + ' ' + $filter('number')(x.num, 2)).join(' , '); }
            tmpData2 = [
                { value: row.month_view, metadata: { style: style[styleKey].textLeft, type: 'string' } }
                , { value: common.GetObjVal('customer', row), metadata: { style: style[styleKey].textLeft, type: 'string' } }
                , { value: common.GetObjVal('port', row), metadata: { style: style[styleKey].textLeft, type: 'string' } }
                , { value: common.GetObjVal('ciCodes', row), metadata: { style: style[styleKey].textCenter, type: 'string' } }
                , { value: common.GetObjVal('lastAdmitDate_export', row), metadata: { style: style[styleKey].textCenter, type: 'string' } }
                , { value: common.GetObjVal('planDate_export', row), metadata: { style: style[styleKey].textCenter, type: 'string' } }
                , { value: common.GetObjVal('paymentTerms', row), metadata: { style: style[styleKey].textCenter, type: 'string' } }
                , { value: common.GetObjVal('containerCode', row), metadata: { style: style[styleKey].textCenter, type: 'string' } }
                , { value: common.GetObjVal('balance.quantity', row), metadata: { style: style[styleKey].decimal, type: 'number' } }
                , { value: common.GetObjVal('balance.weight', row), metadata: { style: style[styleKey].decimal, type: 'number' } }
                , { value: common.GetObjVal('balance.bale', row), metadata: { style: style[styleKey].int, type: 'number' } }
                , { value: tv, metadata: { style: style[styleKey].decimal, type: 'string' } }
                , { value: common.GetObjVal('balance.valueTHB', row), metadata: { style: style[styleKey].decimal, type: 'number' } }
                , { value: common.GetObjVal('remark_view', row), metadata: { style: style[styleKey].textLeft, type: 'string' } }
            ];
            
            data.push(tmpData2);
            startRow++;

        });
        var arrkey = ['customer'
            , 'balance.quantity', 'shipmentPlan.value'
            , 'balance.bale', 'balance.weight'
            , 'balance.values', 'balance.valueTHB' ];
        var dataTotal = {};
        dataGrid.columns.forEach((c) => {
            arrkey.forEach((k) => {
                if (c.field === k) {
                    common.SetObjVal(k, c.aggregationValue, dataTotal);
                }
            });
        });

        var styleKey = 'total';
        var tv2 = dataTotal.balance.values.map(x => x.code + ' ' + $filter('number')(x.sum, 2)).join(' , ');
        var tmpDataTotal2 = [
            { value: null, metadata: { style: style[styleKey].textLeft, type: 'string' } }
            , { value: 'Grand Total : ' + dataTotal.customer + ' items', metadata: { style: style[styleKey].textLeft, type: 'string' } }
            , { value: null, metadata: { style: style[styleKey].textLeft, type: 'string' } }
            , { value: null, metadata: { style: style[styleKey].textCenter, type: 'string' } }
            , { value: null, metadata: { style: style[styleKey].textCenter, type: 'string' } }
            , { value: null, metadata: { style: style[styleKey].textCenter, type: 'string' } }
            , { value: null, metadata: { style: style[styleKey].textCenter, type: 'string' } }
            , { value: null, metadata: { style: style[styleKey].textCenter, type: 'string' } }
            , { value: dataTotal.balance.quantity, metadata: { style: style[styleKey].int, type: 'number' } }
            , { value: dataTotal.balance.weight, metadata: { style: style[styleKey].decimal, type: 'number' } }
            , { value: dataTotal.balance.bale, metadata: { style: style[styleKey].int, type: 'number' } }
            , { value: tv2, metadata: { style: style[styleKey].decimal, type: 'string' } }
            , { value: dataTotal.balance.valueTHB, metadata: { style: style[styleKey].decimal, type: 'number' } }
            , { value: null, metadata: { style: style[styleKey].textLeft, type: 'string' } }
        ];

        data.push(tmpDataTotal2);
        //worksheet.mergeCells('A' + (data.length), String.fromCharCode(startCol - 1) + (data.length));

        worksheet.sheetView.showGridLines = false;
        worksheet.setData(data);
        common.ExportExcel(workbook, 'Unfulfilled Shipment Report');
    }

});