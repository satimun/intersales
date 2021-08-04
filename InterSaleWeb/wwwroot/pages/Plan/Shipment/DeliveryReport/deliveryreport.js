'use strict';
app.controller("shipmentPlanDeliveryReportCtrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {

    $scope.IP_DB = $rootScope.IP_DB;

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
    };

    // load & set MonthFrom
    $scope.monthFrom = {};
    $scope.monthFrom.list = [];
    for (var i = 0; i < 12; i++) { var date = new Date(d.getFullYear(), i, 1); $scope.monthFrom.list.push({ id: i + 1, view: date.toLocaleString("en-us", { month: "long" }) }); }
    $timeout(() => { $scope.monthFrom.view = new Date(d.getFullYear(), 0, 1).toLocaleString("en-us", { month: "long" }); });
    $scope.monthFrom.id = '';
    $scope.monthFrom.SetID = function (id) {
        $scope.monthFrom.id = id;
        $scope.monthTo.list = $filter('filter')($scope.monthFrom.list, function (value) { return value.id >= id; });
        if ($scope.monthTo.id < $scope.monthFrom.id) { $scope.monthTo.view = $scope.monthFrom.view; }
        else { $scope.monthTo.view = d.toLocaleString("en-us", { month: "long" }); }
    };      

    // load RegionalZones
    $scope.regzone = [];
    $scope.regzoneList = []; //regzoneCodes
    KSSClient.API.ShipmentPlan.ListRegionalZone({
        data: {},
        callback: function (res) {
            res.data.regionalZones.forEach(function (v) {
                $scope.regzoneList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v), view: common.GetCodeDescription(v) });
            });
        },
        error: function (res) { common.AlertMessage("Error", res.message); }
    });
    // set LoadRegzone
    $scope.LoadRegzone = function (query) { return $filter('filter')($scope.regzoneList, { 'text': query }); };

    $scope.GenData = (data, monthFrom, monthTo, year) => {
        var tmp = [];
        for (var i = monthFrom; i <= monthTo; i++) {
            tmp.push({
                month: i
                , year: year
                , date: new Date(year, i - 1, 1)
                , data: []
                , total: {
                    plan: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
                    , actual: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
                    , percent: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
                }
            });

            $scope.regzoneList.forEach((r) => {
                var chk = $scope.dataH.regionalZoneIDs.length == 0;

                $scope.dataH.regionalZoneIDs.forEach((s) => {
                    if (r.id === s) { chk = true; }
                });
                if (isFinite(r.id) && r.id && chk) {
                    tmp[tmp.length - 1].data.push({
                        regionalZone: r
                        , plan: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
                        , actual: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
                        , percent: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
                    });
                }
            });
        }
        data.forEach((d) => {
            tmp.forEach((g) => {
                if (g.month === (KSSClient.Engine.Common.CreateDateTime(d.date).getMonth() + 1)) {
                    g.data.forEach((v) => {
                        var regionalZoneID = d.plan ? d.plan.regionalZone.id : d.actual.regionalZone.id;
                        if (v.regionalZone.id === regionalZoneID) {
                            if (d.status === 'S' || d.status === 'R' || d.status === 'P' || d.status === null || (d.status === 'C' && d.plan !== null && d.plan.status !== 'P')) {
                                v.plan.items += 1;
                                v.plan.weight += d.plan.balance.weight;
                                v.plan.valueTHB += d.plan.balance.valueTHB;
                                v.plan.bale += d.plan.balance.bale;
                            }

                            if (d.status !== 'R' && d.status !== 'P' && d.actual) {
                                v.actual.items += 1;
                                v.actual.weight += d.actual.balance.weight;
                                v.actual.valueTHB += d.actual.balance.valueTHB;
                                v.actual.bale += d.actual.balance.bale;
                            }

                            v.percent.items = (v.plan.items == 0 ? NaN : (v.actual.items / v.plan.items) * 100);
                            v.percent.weight = (v.plan.weight == 0 ? NaN : (v.actual.weight / v.plan.weight) * 100);
                            v.percent.valueTHB = (v.plan.valueTHB == 0 ? NaN : (v.actual.valueTHB / v.plan.valueTHB) * 100);
                            v.percent.bale = (v.plan.bale == 0 ? NaN : (v.actual.bale / v.plan.bale) * 100);
                            return;
                        }
                    });

                }
            });
        });

        var data1 = [];
        tmp.forEach((g, i) => {
            g.data.forEach((d) => {
                g.total.plan.items += d.plan.items;
                g.total.plan.weight += d.plan.weight;
                g.total.plan.valueTHB += d.plan.valueTHB;
                g.total.plan.bale += d.plan.bale;

                g.total.actual.items += d.actual.items;
                g.total.actual.weight += d.actual.weight;
                g.total.actual.valueTHB += d.actual.valueTHB;
                g.total.actual.bale += d.actual.bale;

                g.total.percent.items = (g.total.plan.items == 0 ? NaN : (g.total.actual.items / g.total.plan.items) * 100);
                g.total.percent.weight = (g.total.plan.weight == 0 ? NaN : (g.total.actual.weight / g.total.plan.weight) * 100);
                g.total.percent.valueTHB = (g.total.plan.valueTHB == 0 ? NaN : (g.total.actual.valueTHB / g.total.plan.valueTHB) * 100);
                g.total.percent.bale = (g.total.plan.bale == 0 ? NaN : (g.total.actual.bale / g.total.plan.bale) * 100);
            });
            var cumulative = data1[data1.length - 1];
            if (!angular.isUndefined(cumulative)) cumulative = ((cumulative.cumulative * i) + g.total.percent.valueTHB) / (i + 1);
            else cumulative = g.total.percent.valueTHB;
            data1.push({ month: g.month, month_view: g.date.toLocaleString("en-us", { month: "long" }), perMonth: g.total.percent.valueTHB, cumulative: cumulative });
        });
        return { data1: data1, data2: tmp };
    }

    $scope.LoadData = function () {
        var regionalZoneIDs = [];
        $scope.regzone.forEach((v) => { regionalZoneIDs.push(v.id) });

        KSSClient.API.ShipmentPlan.GetReport2({
            data: {
                type: 'M'
                , compare: 'A'
                , year: $scope.year
                , monthFrom: $scope.monthFrom.id
                , monthTo: $scope.monthTo.id
                , regionalZoneIDs: regionalZoneIDs
            },
            callback: (res) => {
                $scope.btnExport = res.data.reports.length > 0;
                $scope.data = res.data.reports;
                $scope.dataH = { monthFrom: $scope.monthFrom.view, monthFromID: $scope.monthFrom.id, monthTo: $scope.monthTo.view, monthToID: $scope.monthTo.id, year: $scope.year, regionalZoneIDs: regionalZoneIDs };

                var data = $scope.GenData(angular.copy($scope.data), $scope.monthFrom.id, $scope.monthTo.id, $scope.year);
                $rootScope.shipmentPlanDeliveryGridTotalCtrl_SetData(data.data1);

                data.data2.forEach((d) => {
                    switch (d.month) {
                        case 1: $scope.shipmentPlanDeliveryGrid1Ctrl_SetData(d.data, d.date); break;
                        case 2: $scope.shipmentPlanDeliveryGrid2Ctrl_SetData(d.data, d.date); break;
                        case 3: $scope.shipmentPlanDeliveryGrid3Ctrl_SetData(d.data, d.date); break;
                        case 4: $scope.shipmentPlanDeliveryGrid4Ctrl_SetData(d.data, d.date); break;
                        case 5: $scope.shipmentPlanDeliveryGrid5Ctrl_SetData(d.data, d.date); break;
                        case 6: $scope.shipmentPlanDeliveryGrid6Ctrl_SetData(d.data, d.date); break;
                        case 7: $scope.shipmentPlanDeliveryGrid7Ctrl_SetData(d.data, d.date); break;
                        case 8: $scope.shipmentPlanDeliveryGrid8Ctrl_SetData(d.data, d.date); break;
                        case 9: $scope.shipmentPlanDeliveryGrid9Ctrl_SetData(d.data, d.date); break;
                        case 10: $scope.shipmentPlanDeliveryGrid10Ctrl_SetData(d.data, d.date); break;
                        case 11: $scope.shipmentPlanDeliveryGrid11Ctrl_SetData(d.data, d.date); break;
                        case 12: $scope.shipmentPlanDeliveryGrid12Ctrl_SetData(d.data, d.date); break;
                    }
                });
                $scope.$apply();
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    $scope.GenExcel = (workbook, format) => {
        var worksheet = new ExcelBuilder.Worksheet({ name: 'Sheet1' });
        workbook.addWorksheet(worksheet);
        var data = [];
        // name Report 
        data.push([{ value: '% KPI of Actual Shipment Report ' + ' ( ' + $scope.dataH.monthFrom + ' - ' + $scope.dataH.monthTo + ' ' + $scope.dataH.year + ' )', metadata: { style: format.report, type: 'string' } }]);
        worksheet.setRowInstructions(2, { height: 25.5 });
        data.push({});
        var SetData1 = (data) => {
            var tmpData = [];
            data.forEach((row, i) => {
                var status = 'else';
                if (row.totalRow) { status = 'total'; }
                tmpData.push([
                    { value: common.GetObjVal('month_view', row), metadata: { style: format[status].textLeft, type: 'string' } }
                    , { value: common.GetObjVal('perMonth', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('cumulative', row), metadata: { style: format[status].decimal, type: 'number' } }
                ]);
            });
            return tmpData;
        }

        var SetData2 = (data) => {
            var tmpData = [];
            data.forEach((row, i) => {
                var status = 'else';
                if (row.totalRow) { status = 'total'; }
                tmpData.push([
                    { value: common.GetObjVal('regionalZone.view', row), metadata: { style: format[status].textLeft, type: 'string' } }
                    , { value: common.GetObjVal('plan.items', row), metadata: { style: format[status].int, type: 'number' } }
                    , { value: common.GetObjVal('plan.weight', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('plan.valueTHB', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('plan.bale', row), metadata: { style: format[status].int, type: 'number' } }

                    , { value: common.GetObjVal('actual.items', row), metadata: { style: format[status].int, type: 'number' } }
                    , { value: common.GetObjVal('actual.weight', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('actual.valueTHB', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('actual.bale', row), metadata: { style: format[status].int, type: 'number' } }

                    , { value: common.GetObjVal('percent.items', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('percent.weight', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('percent.valueTHB', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('percent.bale', row), metadata: { style: format[status].decimal, type: 'number' } }
                ]);
            });
            return tmpData;
        }

        var tmpCol11 = (month) => {
            return [{ value: 'Regional Zone', metadata: { style: format.head, type: 'string' } }
                , { value: 'Plan ' + month, metadata: { style: format.head, type: 'string' } }
                , { value: 'Plan ' + month, metadata: { style: format.head, type: 'string' } }
                , { value: 'Plan ' + month, metadata: { style: format.head, type: 'string' } }
                , { value: 'Plan ' + month, metadata: { style: format.head, type: 'string' } }
                , { value: 'Actual ' + month, metadata: { style: format.head, type: 'string' } }
                , { value: 'Actual ' + month, metadata: { style: format.head, type: 'string' } }
                , { value: 'Actual ' + month, metadata: { style: format.head, type: 'string' } }
                , { value: 'Actual ' + month, metadata: { style: format.head, type: 'string' } }
                , { value: '% Number of Shipment', metadata: { style: format.head, type: 'string' } }
                , { value: '% Weight(KG)', metadata: { style: format.head, type: 'string' } }
                , { value: '% Value(THB)', metadata: { style: format.head, type: 'string' } }
                , { value: '% Bales', metadata: { style: format.head, type: 'string' } }
            ];
        }

        var tmpCol22 = [{ value: 'Regional Zone', metadata: { style: format.head, type: 'string' } }
            , { value: 'Number of Shipment', metadata: { style: format.head, type: 'string' } }
            , { value: 'Weight(KG)', metadata: { style: format.head, type: 'string' } }
            , { value: 'Value(THB)', metadata: { style: format.head, type: 'string' } }
            , { value: 'Bales', metadata: { style: format.head, type: 'string' } }
            , { value: 'Number of Shipment', metadata: { style: format.head, type: 'string' } }
            , { value: 'Weight(KG)', metadata: { style: format.head, type: 'string' } }
            , { value: 'Value(THB)', metadata: { style: format.head, type: 'string' } }
            , { value: 'Bales', metadata: { style: format.head, type: 'string' } }
            , { value: '% Number of Shipment', metadata: { style: format.head, type: 'string' } }
            , { value: '% Weight(KG)', metadata: { style: format.head, type: 'string' } }
            , { value: '% Value(THB)', metadata: { style: format.head, type: 'string' } }
            , { value: '% Bales', metadata: { style: format.head, type: 'string' } }
        ];

        var tmpWidth = [{ width: 25 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
            , { width: 15 }
        ];

        // set head data1
        data.push([{ value: 'Month', metadata: { style: format.head, type: 'string' } }
            , { value: '% Per Month', metadata: { style: format.head, type: 'string' } }
            , { value: '% Cumulative', metadata: { style: format.head, type: 'string' } }
        ]);

        // get data
        var tmp = $scope.GenData(angular.copy($scope.data), $scope.dataH.monthFromID, $scope.dataH.monthToID, $scope.dataH.year);

        //set data1
        data = data.concat(SetData1(tmp.data1));

        data.push([]);
        data.push([]);

        var startRow = data.length;

        // convert data2
        tmp.data2.forEach((g) => {
            worksheet.setRowInstructions(data.length, { height: 25.5 });
            // column add1
            data.push(tmpCol11(g.date.toLocaleString("en-us", { month: "long" }) + ' ' + g.date.getFullYear()));
            // column add2
            data.push(tmpCol22);

            startRow = data.length - 1;
            worksheet.mergeCells('A' + (startRow), 'A' + (startRow + 1));
            worksheet.mergeCells('B' + (startRow), 'E' + (startRow));
            worksheet.mergeCells('F' + (startRow), 'I' + (startRow));
            worksheet.mergeCells('J' + (startRow), 'J' + (startRow + 1));
            worksheet.mergeCells('K' + (startRow), 'K' + (startRow + 1));
            worksheet.mergeCells('L' + (startRow), 'L' + (startRow + 1));
            worksheet.mergeCells('M' + (startRow), 'M' + (startRow + 1));

            common.SetObjVal('regionalZone.view', 'Grand Total : ' + g.data.length + ' items', g.total);
            g.total.totalRow = true;
            g.data.push(g.total);
            data = data.concat(SetData2(g.data));
            data.push([]);
        });              

        worksheet.setColumns(tmpWidth);
        worksheet.sheetView.showGridLines = false;
        worksheet.setData(data);
    }

    $scope.Export = (option) => {

        var workbook = new ExcelBuilder.Workbook();

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

        var successFill = stylesheet.createFill({ type: "pattern", patternType: "solid", fgColor: "FF92D050", bgColor: "FF92D050" }).id; //c4d79b //92d050
        var primaryFill = stylesheet.createFill({ type: "pattern", patternType: "solid", fgColor: "FF00B0F0", bgColor: "FF00B0F0" }).id; //95b3d7 //00b0f0
        var dangerFill = stylesheet.createFill({ type: "pattern", patternType: "solid", fgColor: "FFFF0000", bgColor: "FFFF0000" }).id; //e6b8b7 //FF0000
        var warningFill = stylesheet.createFill({ type: "pattern", patternType: "solid", fgColor: "FFED7D31", bgColor: "FFED7D31" }).id; //fabf8f //ed7d31
        var pinkFill = stylesheet.createFill({ type: "pattern", patternType: "solid", fgColor: "FFFFA4A9", bgColor: "FFFFA4A9" }).id; //ffccff  ffa4a9
        var grayFill = stylesheet.createFill({ type: "pattern", patternType: "solid", fgColor: "FF808080", bgColor: "FF808080" }).id; //808080
        var totalFill = stylesheet.createFill({ type: "pattern", patternType: "solid", fgColor: "FFFFFF66", bgColor: "FFFFFF66" }).id; //ffccff

        var weekFormat = stylesheet.createFormat({
            font: rowFont,
            border: borderStyle,
            alignment: { wrapText: true/*, textRotation: 90*/, horizontal: 'center', vertical: 'center' }
        }).id;

        var format = {};

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

        // format 
        format.report = reportNamme;
        format.head = headFormat;
        format.week = weekFormat;
        format.success = { textCenter: GenFormatText(successFill), textLeft: GenFormatText(successFill, 'left'), int: GenFormatNumber(successFill, '#,##0'), decimal: GenFormatNumber(successFill) };
        format.primary = { textCenter: GenFormatText(primaryFill), textLeft: GenFormatText(primaryFill, 'left'), int: GenFormatNumber(primaryFill, '#,##0'), decimal: GenFormatNumber(primaryFill) };
        format.danger = { textCenter: GenFormatText(dangerFill), textLeft: GenFormatText(dangerFill, 'left'), int: GenFormatNumber(dangerFill, '#,##0'), decimal: GenFormatNumber(dangerFill) };
        format.warning = { textCenter: GenFormatText(warningFill), textLeft: GenFormatText(warningFill, 'left'), int: GenFormatNumber(warningFill, '#,##0'), decimal: GenFormatNumber(warningFill) };
        format.pink = { textCenter: GenFormatText(pinkFill), textLeft: GenFormatText(pinkFill, 'left'), int: GenFormatNumber(pinkFill, '#,##0'), decimal: GenFormatNumber(pinkFill) };
        format.gray = { textCenter: GenFormatText(grayFill), textLeft: GenFormatText(grayFill, 'left'), int: GenFormatNumber(grayFill, '#,##0'), decimal: GenFormatNumber(grayFill) };
        format.else = { textCenter: GenFormatText(''), textLeft: GenFormatText('', 'left'), int: GenFormatNumber('', '#,##0'), decimal: GenFormatNumber('') };
        format.total = { textCenter: GenFormatText(totalFill, '', rowFontTotal), textLeft: GenFormatText(totalFill, 'left', rowFontTotal), int: GenFormatNumber(totalFill, '#,##0', rowFontTotal), decimal: GenFormatNumber(totalFill, '#,##0.00', rowFontTotal) };



        //////////// set excel
        $scope.GenExcel(workbook, format);



        common.ExportExcel(workbook, '% KPI of Actual Shipment Report' + $scope.dataH.monthFromID + ' - ' + $scope.dataH.monthToID + ' / ' + $scope.dataH.year);

    }

});

var SMPDLG = {};


app.controller("shipmentPlanDeliveryGridTotalCtrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {

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

    $scope.gridOpt = common.CreateGrid2({});
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'month', display: 'Month', width: { default: 150 }, format: { type: 'customText' } , setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'perMonth', display: '% Per Month', width: { default: 145 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'cumulative', display: '% Cumulative', width: { default: 145 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == 'month') {
                return myRow.entity.month_view;
            }
        }
        return false;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_shipmentplanvsactual01');
    };

    $rootScope.shipmentPlanDeliveryGridTotalCtrl_SetData = (data) => {
        $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
    }

    var SetClass2 = function (grid, row) {
        if (row.entity.totalRow) {
            return 'bg-info font-bold';
        }
    }

    SMPDLG = common.CreateGrid2({ footer: true });
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'regionalZone.view', display: 'Regional Zone', width: { default: 200 }, setclass: SetClass2, showCountItems: true }));
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'plan.items', display: 'Number of Shipment', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'plan', display: 'Plan', langCode: '' }, setclass: SetClass2 }));
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'plan.weight', display: 'Weight(KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'plan', display: 'Plan', langCode: '' }, setclass: SetClass2 }));
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'plan.valueTHB', display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'plan', display: 'Plan', langCode: '' }, setclass: SetClass2 }));
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'plan.bale', display: 'Bales', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'plan', display: 'Plan', langCode: '' }, setclass: SetClass2 }));

    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'actual.items', display: 'Number of Shipment', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass2 }));
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'actual.weight', display: 'Weight(KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass2 }));
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'actual.valueTHB', display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass2 }));
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'actual.bale', display: 'Bales', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass2 }));

    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'percent.items', display: '% Number of Shipment', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actual.items', divi: 'plan.items' }, setclass: SetClass2, multiLine: true }));
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'percent.weight', display: '% Weight(KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actual.weight', divi: 'plan.weight' }, setclass: SetClass2, multiLine: true }));
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'percent.valueTHB', display: '% Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actual.valueTHB', divi: 'plan.valueTHB' }, setclass: SetClass2, multiLine: true }));
    SMPDLG.columnDefs.push(common.AddColumn2({ name: 'percent.bale', display: '% Bales', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actual.bale', divi: 'plan.bale' }, setclass: SetClass2, multiLine: true }));

});



app.controller("shipmentPlanDeliveryGrid1Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {   
    $rootScope.shipmentPlanDeliveryGrid1Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});

app.controller("shipmentPlanDeliveryGrid2Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid2Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }
});

app.controller("shipmentPlanDeliveryGrid3Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid3Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});

app.controller("shipmentPlanDeliveryGrid4Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid4Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});

app.controller("shipmentPlanDeliveryGrid5Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid5Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});

app.controller("shipmentPlanDeliveryGrid6Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid6Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});

app.controller("shipmentPlanDeliveryGrid7Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid7Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});

app.controller("shipmentPlanDeliveryGrid8Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid8Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});

app.controller("shipmentPlanDeliveryGrid9Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid9Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});

app.controller("shipmentPlanDeliveryGrid10Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid10Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});

app.controller("shipmentPlanDeliveryGrid11Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid11Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});

app.controller("shipmentPlanDeliveryGrid12Ctrl", function ($rootScope, $scope, $location, $filter, $timeout, common) {
    $rootScope.shipmentPlanDeliveryGrid12Ctrl_SetData = (data, date) => {
        $scope.gridOpt = angular.copy(SMPDLG);
        $scope.gridOpt.onRegisterApi = (gridApi) => {
            $timeout(() => {
                gridApi.grid.options.group.forEach((c) => {
                    if (c.name === 'plan') { c.display = 'Plan ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                    if (c.name === 'actual') { c.display = 'Actual ' + date.toLocaleString("en-us", { month: "long" }) + ' ' + date.getFullYear(); }
                });
            }, 300);
            $scope.gridOpt.data = data;
            gridApi.grid.refresh();
        };
    }

});