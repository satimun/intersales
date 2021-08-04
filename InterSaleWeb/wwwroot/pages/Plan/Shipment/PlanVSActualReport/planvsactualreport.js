'use strict';
app.controller("shipmentplanvsactualreportController", function ($rootScope, $scope, $location, $timeout, $filter, $q, common, intersales) {

    $scope.IP_DB = $rootScope.IP_DB + 'sxtShipmentPlanH, sxtShipmentPlanD, [saleex].dbo.COMMERCIAL1MST, [saleex].dbo.COMMERCIAL1TRN';

    // set date
    var d = new Date();
    $scope.year = d.getFullYear();

    $scope.GenMonth = (year) => { /*if (year) { $scope.GetCost(year); }*/ }

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

    var ConverData = (data) => {
        var tmp = [];
        //let v = {
        //    plan: { items: 0, value: 0, weight: 0, bale: 0 }
        //    , actual: { items: 0, value: 0, weight: 0, bale: 0 }
        //    , valueDiff: { diff: 0, percent: 0 }
        //    , weightDiff: { diff: 0, percent: 0 }
        //};
        //data.filter(d => d.actual.zoneAccount.id == 5).forEach(d => {
        //    if (d.status === 'S' || d.status === 'R' || d.status === 'P' || d.status === null || (d.status === 'C' && d.plan !== null && d.plan.status !== 'P')) {
        //        v.plan.items += 1;
        //        v.plan.weight += d.plan.balance.weight;
        //        v.plan.value += d.plan.balance.valueTHB;
        //        v.plan.bale += d.plan.balance.bale;
        //    }
        //    if (d.status !== 'R' && d.status !== 'P' && d.actual) {
        //        v.actual.items += 1;
        //        v.actual.weight += d.actual.balance.weight;
        //        v.actual.value += d.actual.balance.valueTHB;
        //        v.actual.bale += d.actual.balance.bale;
        //    }

        //    v.valueDiff.diff = v.actual.value - v.plan.value;
        //    v.valueDiff.percent = v.plan.value == 0 ? 0 : (v.valueDiff.diff * 100) / v.plan.value;

        //    v.weightDiff.diff = v.actual.weight - v.plan.weight;
        //    v.weightDiff.percent = v.plan.weight == 0 ? 0 : (v.weightDiff.diff * 100) / v.plan.weight;
        //});
        //console.log(v);

        data.forEach((d) => {
            var chk = true;
            var zone = !d.plan ? d.actual.zoneAccount : d.plan.zoneAccount;
            tmp.forEach((v) => {
                if (v.zone.id === zone.id) {
                    if (d.status === 'S' || d.status === 'R' || d.status === 'P' || d.status === null || (d.status === 'C' && d.plan !== null && d.plan.status !== 'P')) {
                        v.plan.items += 1;
                        v.plan.weight += d.plan.balance.weight;
                        v.plan.value += d.plan.balance.valueTHB;
                        v.plan.bale += d.plan.balance.bale;
                    }
                    if (d.status !== 'R' && d.status !== 'P' && d.actual) {
                        v.actual.items += 1;
                        v.actual.weight += d.actual.balance.weight;
                        v.actual.value += d.actual.balance.valueTHB;
                        v.actual.bale += d.actual.balance.bale;
                    }
                                        
                    v.valueDiff.diff = v.actual.value - v.plan.value;
                    v.valueDiff.percent = v.plan.value == 0 ? 0 : (v.valueDiff.diff * 100) / v.plan.value;                 

                    v.weightDiff.diff = v.actual.weight - v.plan.weight;
                    v.weightDiff.percent = v.plan.weight == 0 ? 0 : (v.weightDiff.diff * 100) / v.plan.weight;

                    chk = false;
                    return;
                }
            });

            if (chk) {
                var regzone = !d.plan ? d.actual.regionalZone : d.plan.regionalZone;
                zone.view = common.GetCodeDescription(zone);
                regzone.description_view = regzone.description_vieworg = regzone.description;
                var obj = {
                    regionalZone: regzone
                    , zone: zone
                    , plan: { items: 0, value: 0, weight: 0, bale: 0 }
                    , actual: { items: 0, value: 0, weight: 0, bale: 0 }
                    , valueDiff: { diff: 0, percent: 0 }
                    , weightDiff: { diff: 0, percent: 0 }
                };
                if (d.status === 'S' || d.status === 'R' || d.status === 'P' || d.status === null || (d.status === 'C' && d.plan !== null && d.plan.status !== 'P')) {
                    obj.plan.items += 1;
                    obj.plan.weight += d.plan.balance.weight;
                    obj.plan.value += d.plan.balance.valueTHB;
                    obj.plan.bale += d.plan.balance.bale;
                }
                if (d.status !== 'R' && d.status !== 'P' && d.actual) {
                    obj.actual.items += 1;
                    obj.actual.weight += d.actual.balance.weight;
                    obj.actual.value += d.actual.balance.valueTHB;
                    obj.actual.bale += d.actual.balance.bale;
                }

                obj.valueDiff.diff = obj.actual.value - obj.plan.value;
                obj.valueDiff.percent = obj.plan.value == 0 ? 0 : (obj.valueDiff.diff * 100) / obj.plan.value;

                obj.weightDiff.diff = obj.actual.weight - obj.plan.weight;
                obj.weightDiff.percent = obj.plan.weight == 0 ? 0 : (obj.weightDiff.diff * 100) / obj.plan.weight;

                tmp.push(obj);

            }

            //if (!obj.valueDiff.diff) {
            //    var x = 0;
            //}

        });
        return $filter('orderBy')(tmp, 'zone.code');
    }
        
    $scope.LoadData = function () {
        var zoneAccountIDs = [];
        $scope.zones.forEach(function (v) { zoneAccountIDs.push(v.id); });

        var regionalZoneIDs = [];
        $scope.regzone.forEach((v) => { regionalZoneIDs.push(v.id) });

        KSSClient.API.ShipmentPlan.PlanVsActualReport({
            data: {
                type: 'M'
                , compare: 'A'
                , year: $scope.year
                , monthFrom: $scope.monthFrom.id
                , monthTo: $scope.monthTo.id
                , regionalZoneIDs: regionalZoneIDs
                , zoneAccountIDs: zoneAccountIDs
            },
            callback: (res) => {
                var data = ConverData(res.data.reports);
                var length = data.length * 4;
                for (var i = 0; i < length; i++) { data.push({ totalRow: true }); }
                $scope.SetData(data);
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    //////////////////////////////////////////////////////// GRID /////////////////////////////////////////////////////////////

    var SetClass = function (grid, row, col) {
        var classx = '';
        if (row.entity.totalRow) {
            classx += 'bg-info font-bold ';
        }
        if (col.colDef.type === 'number') {
            if (common.GetObjVal(col.colDef.field, row.entity) < 0) classx += 'text-danger';
        }
        return classx;
    }

    $scope.gridOpt = common.CreateGrid2({ footer: true, showTotalGrouping2: true });
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'regionalZone.description', display: '', width: { default: 0, max: 1 }, setclass: SetClass, hiding: false, grouping2: true, groping2Active: true, colMenu: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'zone.view', display: 'Zone', width: { default: 300 }, setclass: SetClass, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'plan.value', display: 'Plan', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'value', display: 'Value(THB)', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.value', display: 'Actual', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'value', display: 'Value(THB)', langCode: '' }, setclass: SetClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'valueDiff.diff', display: 'Diff', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'valueDiff.percent', display: '%', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'valueDiff.diff', divi: 'plan.value' }, setclass: SetClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'plan.weight', display: 'Plan', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'weight', display: 'Weight(KG)', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.weight', display: 'Actual', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'weight', display: 'Weight(KG)', langCode: '' }, setclass: SetClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'weightDiff.diff', display: 'Diff', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'weightDiff.percent', display: '%', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'weightDiff.diff', divi: 'plan.weight' }, setclass: SetClass }));


    $scope.cumulative = function (grid, myRow, myCol) {
        //if (grid.id === $scope.gridApi.grid.id) {
        //}
        return false
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_shipmentplanvsactual01');
    };

    $scope.SetData = (data) => {
        //console.log(data);
        $scope.btnExport = data.length > 0;
        $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
    }

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
            }
            return stylesheet.createFormat(obj).id;
        }
        var GenFormatNumber = (fill, format, font) => {
            var obj = {
                font: angular.isUndefined(font) ? rowFont : font, format: angular.isUndefined(format) ? '#,##0.00' : format,
                fill: fill, border: borderStyle,
                alignment: { horizontal: 'right', vertical: 'center' }
            }
            return stylesheet.createFormat(obj).id;
        }

        var style = {};
        style.text = { textCenter: GenFormatText(''), textLeft: GenFormatText('', 'left'), int: GenFormatNumber('', '#,##0'), decimal: GenFormatNumber('') };
        style.textRed = { textCenter: GenFormatText('', '', rowFont_red), textLeft: GenFormatText('', 'left', rowFont_red), int: GenFormatNumber('', '#,##0', rowFont_red), decimal: GenFormatNumber('', '#,##0.00', rowFont_red) };
        style.total = { textCenter: GenFormatText(totalFill, '', rowFontTotal), textLeft: GenFormatText(totalFill, 'left', rowFontTotal), int: GenFormatNumber(totalFill, '#,##0', rowFontTotal), decimal: GenFormatNumber(totalFill, '#,##0.00', rowFontTotal) };
        style.totalRed = { textCenter: GenFormatText(totalFill, '', rowFontTotal_red), textLeft: GenFormatText(totalFill, 'left', rowFontTotal_red), int: GenFormatNumber(totalFill, '#,##0', rowFontTotal_red), decimal: GenFormatNumber(totalFill, '#,##0.00', rowFontTotal_red) };

        var data = [];

        var zone = KSSClient.Engine.Common.ArrayToStringComma($scope.zones, 'text');
        var regzone = KSSClient.Engine.Common.ArrayToStringComma($scope.regzone, 'text');

        // Report Name
        data.push([{ value: 'Shipment Plan vs Actual Report', metadata: { style: reportNamme, type: 'string' } }]);

        // title header
        data.push([{ value: 'Year : ', metadata: { style: titleFormat, type: 'string' } }, { value: $scope.year, metadata: { style: valueFormat, type: 'string' } }
            , { value: 'Month From : ', metadata: { style: titleFormat, type: 'string' } }, { value: $scope.monthFrom.view, metadata: { style: valueFormat, type: 'string' } }
            , { value: 'Month To : ', metadata: { style: titleFormat, type: 'string' } }, { value: $scope.monthTo.view, metadata: { style: valueFormat, type: 'string' } }
        ]);
        data.push([{ value: 'Regional Zone : ', metadata: { style: titleFormat, type: 'string' } }, { value: regzone, metadata: { style: valueFormat, type: 'string' } }
            , { value: 'Zones : ', metadata: { style: titleFormat, type: 'string' } }, { value: zone, metadata: { style: valueFormat, type: 'string' } }
        ]);
        
        var startRow = 4;

        var tmpCol11 = [{ value: 'Zone', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Value(THB)', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Value(THB)', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Diff', metadata: { style: headFormat, type: 'string' } }
            , { value: '%', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Weight(KG)', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Weight(KG)', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Diff', metadata: { style: headFormat, type: 'string' } }
            , { value: '%', metadata: { style: headFormat, type: 'string' } }
        ];

        var tmpCol22 = [{ value: 'Zone', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Plan', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Actual', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Diff', metadata: { style: headFormat, type: 'string' } }
            , { value: '%', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Plan', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Actual', metadata: { style: headFormat, type: 'string' } }
            , { value: 'Diff', metadata: { style: headFormat, type: 'string' } }
            , { value: '%', metadata: { style: headFormat, type: 'string' } }
        ];

        var tmpWidth2 = [{ width: 30 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
        ];

        // column add1
        data.push(tmpCol11);
        // column add2
        data.push(tmpCol22);
        // set Col width
        worksheet.setColumns(tmpWidth2);

        worksheet.mergeCells('A' + (startRow), 'A' + (startRow + 1));
        worksheet.mergeCells('B' + (startRow), 'C' + (startRow));

        worksheet.mergeCells('D' + (startRow), 'D' + (startRow + 1));
        worksheet.mergeCells('E' + (startRow), 'E' + (startRow + 1));

        worksheet.mergeCells('F' + (startRow), 'G' + (startRow));

        worksheet.mergeCells('H' + (startRow), 'H' + (startRow + 1));
        worksheet.mergeCells('I' + (startRow), 'I' + (startRow + 1));

        for (var i = 0; i < data.length; i++) { worksheet.setRowInstructions(i, { height: 25.5 }); }
        startRow = data.length;
        var tmpSum = {};
        var dataGrid = $scope.gridApi.grid;
        dataGrid.renderContainers.body.visibleRowCache.map(x => x.entity).forEach(function (row, i) {

            var styleKey = 'text';

            if (row.totalRow) {
                styleKey = 'total';
                //worksheet.mergeCells('A' + (startRow + 1), String.fromCharCode(startCol - 1) + (startRow + 1));
            }

            var tmpData2 = [
                { value: row.zone.view, metadata: { style: style[styleKey].textLeft, type: 'string' } }

                , { value: row.plan.value, metadata: { style: row.plan.value < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }
                , { value: row.actual.value, metadata: { style: row.actual.value < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }

                , { value: row.valueDiff.diff, metadata: { style: row.valueDiff.diff < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }
                , { value: row.valueDiff.percent, metadata: { style: row.valueDiff.percent < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }

                , { value: row.plan.weight, metadata: { style: row.plan.weight < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }
                , { value: row.actual.weight, metadata: { style: row.actual.weight < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }

                , { value: row.weightDiff.diff, metadata: { style: row.weightDiff.diff < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }
                , { value: row.weightDiff.percent, metadata: { style: row.weightDiff.percent < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }
            ];

            data.push(tmpData2);
            startRow++;

        });
        var arrkey = ['zone.view'
            , 'plan.weight', 'plan.value'
            , 'actual.weight', 'actual.value'
            , 'valueDiff.diff', 'valueDiff.percent'
            , 'weightDiff.diff', 'weightDiff.percent'];
        var dataTotal = {};
        dataGrid.columns.forEach((c) => {
            arrkey.forEach((k) => {
                if (c.field === k) {
                    common.SetObjVal(k, c.aggregationValue, dataTotal);
                }
            });
        });

        var styleKey = 'total';

        var tmpDataTotal2 = [
            { value: 'Grand Total : ' + dataTotal.zone.view + ' items', metadata: { style: style[styleKey].textLeft, type: 'string' } }

            , { value: dataTotal.plan.value, metadata: { style: dataTotal.plan.value < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }
            , { value: dataTotal.actual.value, metadata: { style: dataTotal.actual.value < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }

            , { value: dataTotal.valueDiff.diff, metadata: { style: dataTotal.valueDiff.diff < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }
            , { value: dataTotal.valueDiff.percent, metadata: { style: dataTotal.valueDiff.percent < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }

            , { value: dataTotal.plan.weight, metadata: { style: dataTotal.plan.weight < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }
            , { value: dataTotal.actual.weight, metadata: { style: dataTotal.actual.weight < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }

            , { value: dataTotal.weightDiff.diff, metadata: { style: dataTotal.weightDiff.diff < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }
            , { value: dataTotal.weightDiff.percent, metadata: { style: dataTotal.weightDiff.percent < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } }
        ];

        data.push(tmpDataTotal2);
        //worksheet.mergeCells('A' + (data.length), String.fromCharCode(startCol - 1) + (data.length));

        worksheet.sheetView.showGridLines = false;
        worksheet.setData(data);
        common.ExportExcel(workbook, 'Shipment Plan vs Actual Report');
    }

});