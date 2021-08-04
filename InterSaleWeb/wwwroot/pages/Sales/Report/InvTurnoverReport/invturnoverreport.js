'use strict';
app.controller("SalesReportInvTurnoverReportController", function ($rootScope, $scope, $timeout, API, $filter, $q, common, intersales) {
    $scope.IP_DB = $rootScope.IP_DB;

    // set datePlan
    var d = new Date();
    $scope.year = d.getFullYear();

    $scope.GenMonth = (year) => { };

    $scope.ytdChk = (ytd) => {
        if (ytd) {
            $scope.monthTo.view = d.toLocaleString("en-us", { month: "long" });
            $scope.monthFrom.view = 'January';
        } else {
            $scope.monthTo.view = d.toLocaleString("en-us", { month: "long" });
            $scope.monthFrom.view = d.toLocaleString("en-us", { month: "long" });
        }
    };

    $scope.diffDays = (firstMonth, secondMonth) => {
        
        if (firstMonth && secondMonth) {
            var oneDay = 8.64e7;//24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var firstDate = new Date($scope.year, firstMonth - 1, 1);
            var secondDate = null;
            for (var i = 28; i < 32; i++) {
                var tmp = new Date($scope.year, secondMonth - 1, i);
                if (tmp.getMonth() + 1 === secondMonth) {
                    secondDate = tmp;
                }
            }
            return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)) + 1;
        }
        return '';        
    };
    
    // load & set MonthTo
    $scope.monthTo = {};
    $scope.monthTo.list = [];
    $scope.monthTo.view = '';
    $scope.monthTo.id = '';
    $scope.monthTo.SetID = function (id) {
        $scope.monthTo.id = id;
        if (!id) { $scope.monthTo.view = $scope.monthFrom.view; }
        $scope.days = $scope.diffDays($scope.monthFrom.id, $scope.monthTo.id);
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
        $scope.days = $scope.diffDays($scope.monthFrom.id, $scope.monthTo.id);
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
                if (v.id === empID) {
                    $scope.emp.view = common.GetCodeDescription(v);
                }
            });
            $scope.emp.list = tmp;
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });

    $scope.chkLoadData = false;
    $scope.deadstock = false;

    $rootScope.invTurnOvers = [];

    $scope.LoadData = function () {

        var zoneAccountIDs = [];
        $scope.zones.forEach(function (v) { zoneAccountIDs.push(v.id); });

        var regionalZoneIDs = [];
        $scope.regzone.forEach((v) => { regionalZoneIDs.push(v.id); });

        var customerIDs = [];
        $scope.customers.forEach((v) => { customerIDs.push(v.id); });

        $rootScope.invTurnOvers = [];

        API.InvTurnOver.Report({
            data: {
                monthFrom: $scope.monthFrom.id
                , monthTo: $scope.monthTo.id
                , year: $scope.year
                , regionalZoneIDs: regionalZoneIDs
                , zoneAccountIDs: zoneAccountIDs
                , customerIDs: customerIDs
                , deadstock: $scope.deadstock
            },
            callback: function (res) {
                res.data.invTurnOvers.forEach((row) => {
                    $scope.btnExport = true;
                    row.zone.code_view = row.zone.code_vieworg = common.GetCodeDescription(row.zone);
                    row.country.code_view = row.country.code_vieworg = common.GetCodeDescription(row.country);
                    row.color.code_view = row.color.code_vieworg = common.GetCodeDescription(row.color);
                    row.customer.code_view = row.customer.code_vieworg = common.GetCodeDescription(row.customer);
                    row.productType.code_view = row.productType.code_vieworg = common.GetCodeDescription(row.productType);
                    row.diameter_view = row.diameter_vieworg = row.diameter;
                    row.twine = intersales.GetDiameter(row.diameter);
                });

                $rootScope.invTurnOvers = res.data.invTurnOvers;
                $rootScope.SalesReportInvTurnoverReportGridCtrl_SetData();

                $scope.dataH = { monthFrom: $scope.monthFrom.view, monthFromID: $scope.monthFrom.id, monthTo: $scope.monthTo.view, monthToID: $scope.monthTo.id, year: $scope.year };
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    };

    $scope.btnExport = false;

    $scope.viewMode = 0;
    $scope.TabChange = function (index) {
        $scope.viewMode = index;
        $scope.btnExport = false;
        try {
            if (index === 0) {
                $rootScope.ShipmentForecastReportZone_SetData($scope.planMonth, $scope.planYear, $scope.shipmentForecateData);
            } else if (index === 1) {
                $rootScope.ShipmentForecastReportCountry_SetData($scope.planMonth, $scope.planYear, $scope.shipmentForecateData);
            } else {
                $rootScope.ShipmentForecastReportCustomer_SetData($scope.planMonth, $scope.planYear, $scope.shipmentForecateData);
            }
            if ($scope.shipmentForecateData[keySel[$scope.viewMode].key].length > 0) {
                $scope.btnExport = true;
            }
        } catch (ex) { $scope.btnExport = false; }
    };


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

        //var zone = KSSClient.Engine.Common.ArrayToStringComma($scope.zones, 'text');
        //var regzone = KSSClient.Engine.Common.ArrayToStringComma($scope.regzone, 'text');
        //var customer = KSSClient.Engine.Common.ArrayToStringComma($scope.customers, 'text');

        // Report Name
        //data.push([{ value: 'Inventory Turnover Ratio Report', metadata: { style: reportNamme, type: 'string' } }]);

        data.push([{ value: 'Inventory Turnover Ratio Report : ' + ' ( ' + $scope.dataH.monthFrom + ' - ' + $scope.dataH.monthTo + ' ' + $scope.dataH.year + ' )', metadata: { style: reportNamme, type: 'string' } }]);
        worksheet.setRowInstructions(1, { height: 45 });

        var showCol = $rootScope.SalesReportInvTurnoverReportGridCtrl_ShowHideCol();
        var widthCol = { Zone: 25, Country: 25, Customer: 40, Product: 25, Diameter: 18, Color: 25 };

        var startRow = 2;

        var tmpCol1 = [], tmpCol2 = [], startCol = 65, tmpWidth = [];

        showCol.forEach((c) => {
            if (c.checked) {
                tmpCol1.push({ value: c.label, metadata: { style: headFormat, type: 'string' } });
                tmpWidth.push({ width: widthCol[c.label] });
                startCol++;
            }
        });

        var showCols = $rootScope.SalesReportInvTurnoverReportGridCtrl_ShowCols();

        var chk = true;
        showCols.forEach((c, i) => {
            tmpCol1.push({ value: c.label, metadata: { style: headFormat, type: 'string' } });
            tmpWidth.push({ width: 15 });
        });

        // column add1
        data.push(tmpCol1);
        // column add2
        //data.push(tmpCol2);
        // set Col width
        worksheet.setColumns(tmpWidth);

        for (var i = 0; i < data.length; i++) { worksheet.setRowInstructions(i, { height: 25.5 }); }
        startRow = data.length;
        var tmpSum = {};
        var dataGrid = $rootScope.SalesReportInvTurnoverReportGridCtrl_GetData();
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
                tmpData.push({ value: val, metadata: { style: val < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } });
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
            tmpDataTotal.push({ value: val, metadata: { style: val < 0 ? style[styleKey + 'Red'].decimal : style[styleKey].decimal, type: 'number' } });
        });

        data.push(tmpDataTotal);
        worksheet.mergeCells('A' + (data.length), String.fromCharCode(startCol - 1) + (data.length));

        worksheet.sheetView.showGridLines = false;
        worksheet.setData(data);
        common.ExportExcel(workbook, 'Inventory Turnover Ratio Report');
    };
    

});

app.controller("SalesReportInvTurnoverReportGridCtrl", function ($rootScope, $scope, common, $filter, $timeout) {

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

    var InvAvg = function (r) {
        var quotedCost = 0, forwardCost = 0;
        r.forEach((x) => {
            quotedCost += x.entity.quotedCost;
            forwardCost += x.entity.forwardCost;
        });        
        return (quotedCost + forwardCost) / 2;
    };

    var InvTurnoverRatio = function (r) {
        var salesCost = 0;
        r.forEach((x) => {
            salesCost += x.entity.salesCost;
        });
        var invAvg = InvAvg(r);
        return invAvg === 0 ? 0 : salesCost / invAvg;
    };

    var AvgPeriodDay = function (r) {
        
        var day = r[r.length - 1];
        if (day) { day = day.entity.day; }
        
        var invTurnoverRatio = InvTurnoverRatio(r);
        return invTurnoverRatio === 0 ? 0 : day / invTurnoverRatio;
    };

    var AvgPeriodDayLast = function (r) {
        var quotedCostLast = 0, forwardCostLast = 0, salesCostLast = 0, dayLast = 0;
        r.forEach((x) => {
            quotedCostLast += x.entity.quotedCostLast;
            forwardCostLast += x.entity.forwardCostLast;
            salesCostLast += x.entity.salesCostLast;
            dayLast = x.entity.dayLast;
        });

        var invAvgLast = (quotedCostLast + forwardCostLast) / 2;
        var invTurnoverRatioLast = invAvgLast === 0 ? 0 : salesCostLast / invAvgLast;

        return invTurnoverRatioLast === 0 ? 0 : dayLast / invTurnoverRatioLast;
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true, grouping2: { enable: true, showTotal: true } });
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'action', display: '', width: { min: 45 }, format: { type: 'btnPopup', func: 'ShowDetail' }, hiding: false, sort: false, filter: false, pinnedLeft: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'zone.code', display: 'Zone', width: { default: 250 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'country.code', display: 'Country', width: { default: 250 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer.code', display: 'Customer', width: { default: 250 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productType.code', display: 'Product', width: { default: 250 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'diameter', display: 'Diameter', width: { default: 100 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'color.code', display: 'Color', width: { default: 150 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesCost', display: 'Cost of goods sold', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, multiLine: true, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'quotedCost', display: 'Beginning Inventory', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, multiLine: true, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'forwardCost', display: 'Ending Inventory', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, multiLine: true, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'invAvg', display: 'Average Inventory', width: { min: 120 }, format: { type: 'decimal', scale: 2, summary: InvAvg }, multiLine: true, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'invTurnoverRatio', display: 'Inventory Turnover Ratio', width: { min: 120 }, format: { type: 'decimal', scale: 2, summary: InvTurnoverRatio }, multiLine: true, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'avgPeriodDay', display: 'Average Inventory Period', width: { min: 120 }, format: { type: 'decimal', scale: 2, summary: AvgPeriodDay }, multiLine: true, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'avgPeriodDayKPI', visible: false, display: 'KPI', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, multiLine: true, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'avgPeriodDayLast', visible: false, display: 'Last Year', width: { min: 120 }, format: { type: 'decimal', scale: 2, summary: AvgPeriodDayLast }, setclass: SetClass, group: { name: 'lastYear', display: 'Average Inventory Period', langCode: '' } }));
   
    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === 'zone.code') {
                return angular.isUndefined(myRow.entity.zone) ? '' : myRow.entity.zone.code_view;
            } else if (myCol.field === 'country.code') {
                return angular.isUndefined(myRow.entity.country) ? '' : myRow.entity.country.code_view;
            } else if (myCol.field === 'customer.code') {
                return angular.isUndefined(myRow.entity.customer) ? '' : myRow.entity.customer.code_view;
            } else if (myCol.field === 'productType.code') {
                return angular.isUndefined(myRow.entity.productType) ? '' : myRow.entity.productType.code_view;
            } else if (myCol.field === 'diameter') {
                return angular.isUndefined(myRow.entity.diameter_view) ? '' : myRow.entity.diameter_view;
            } else if (myCol.field === 'color.code') {
                return angular.isUndefined(myRow.entity.color) ? '' : myRow.entity.color.code_view;
            } else if (myCol.field === 'action') {
                return angular.isUndefined(myRow.entity.totalRow) ? true : false;
            }
        }
        return false;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_shipmentForecast1');
        $scope.ChangeChk();
    };

    $scope.colGroup = [];

    $rootScope.SalesReportInvTurnoverReportGridCtrl_GetData = () => { return $scope.gridApi.grid; };

    $rootScope.SalesReportInvTurnoverReportGridCtrl_SetData = function () {
        var tmpObj = [], data = [];
        angular.copy($rootScope.invTurnOvers).forEach((d) => {
            var obj = {};
            $scope.colGroup.forEach((c) => { var key = c.split('.')[0]; obj[key] = d[key]; });
            var chk = true;
            tmpObj.forEach((o, index) => { if (angular.equals(o.group, obj)) { tmpObj[index].data.push(d); chk = false; } });
            if (chk) { tmpObj.push({ group: obj, data: [d], total: {} }); }

        });

        tmpObj.forEach((o) => {
            o.total = o.data.pop();
            o.data.forEach((d) => {

                o.total.salesCost += d.salesCost;
                o.total.salesWeight += d.salesWeight;
                o.total.quotedCost += d.quotedCost;
                o.total.quotedWeight += d.quotedWeight;
                o.total.forwardCost += d.forwardCost;
                o.total.forwardWeight += d.forwardWeight;

                o.total.salesCostLast += d.salesCostLast;
                o.total.salesWeightLast += d.salesWeightLast;
                o.total.quotedCostLast += d.quotedCostLast;
                o.total.quotedWeightLast += d.quotedWeightLast;
                o.total.forwardCostLast += d.forwardCostLast;
                o.total.forwardWeightLast += d.forwardWeightLast;

                o.total.day = d.day;
                o.total.dayLast = d.dayLast;

            });


            o.total.invAvg = Number(((o.total.quotedCost + o.total.forwardCost) / 2).toFixed(2));
            o.total.invTurnoverRatio = Number(o.total.invAvg === 0 ? 0 : (o.total.salesCost / o.total.invAvg).toFixed(2));
            o.total.avgPeriodDay = Number(o.total.invTurnoverRatio === 0 ? 0 : (o.total.day / o.total.invTurnoverRatio).toFixed(2));

            o.total.invAvgLast = Number(((o.total.quotedCostLast + o.total.forwardCostLast) / 2).toFixed(2));
            o.total.invTurnoverRatioLast = Number(o.total.invAvgLast === 0 ? 0 : (o.total.salesCostLast / o.total.invAvgLast).toFixed(2));
            o.total.avgPeriodDayLast = Number(o.total.invTurnoverRatioLast === 0 ? 0 : (o.total.dayLast / o.total.invTurnoverRatioLast).toFixed(2));
            
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
            var length = Math.abs(data.length * $scope.colGroup.length);
            for (var i = 0; i < length; i++) { data.push({ totalRow: true }); }
            $scope.gridOpt.data = data;
            $scope.gridApi.grid.refresh();
        });
    };

    $scope.gZone = true;
    $scope.gCountry = true;
    $scope.gCustomer = false;
    $scope.gProduct = false;
    $scope.gDiameter = false;
    $scope.gColor = false;

    $rootScope.SalesReportInvTurnoverReportGridCtrl_ShowHideCol = () => {
        return $scope.lists;
    };

    $scope.lists = [
        { label: 'Zone', field: 'zone.code', checked: true },
        { label: 'Country', field: 'country.code', checked: false },
        { label: 'Customer', field: 'customer.code', checked: false },
        { label: 'Product', field: 'productType.code', checked: false },
        { label: 'Diameter', field: 'diameter', checked: false },
        { label: 'Color', field: 'color.code', checked: false }
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

    $scope.ChangeChk = () => {

        $scope.lists.forEach((v) => {
            if (v.label === 'Zone') { $scope.gZone = v.checked; }
            if (v.label === 'Country') { $scope.gCountry = v.checked; }
            if (v.label === 'Customer') { $scope.gCustomer = v.checked; }
            if (v.label === 'Product') { $scope.gProduct = v.checked; }
            if (v.label === 'Diameter') { $scope.gDiameter = v.checked; }
            if (v.label === 'Color') { $scope.gColor = v.checked; }
        });

        $scope.colGroup = [];
        $scope.gridOpt.columnDefs.forEach((c) => {
            if (c.field === "zone.code") { c.grouping2 = c.visible = $scope.gZone; c.showCountItems = false; }
            else if (c.field === "country.code") { c.grouping2 = c.visible = $scope.gCountry; c.showCountItems = false; }
            else if (c.field === "customer.code") { c.grouping2 = c.visible = $scope.gCustomer; c.showCountItems = false; }
            else if (c.field === "productType.code") { c.grouping2 = c.visible = $scope.gProduct; c.showCountItems = false; }
            else if (c.field === "diameter") { c.grouping2 = c.visible = $scope.gDiameter; c.showCountItems = false; }
            else if (c.field === "color.code") { c.grouping2 = c.visible = $scope.gColor; c.showCountItems = false; }
            if (c.visible && c.grouping2) { $scope.colGroup.push(c.field); }
        });

        $scope.gridOpt.columnDefs.forEach((c) => {
            if (c.field === $scope.colGroup[0]) c.showCountItems = true;
            if (c.field === $scope.colGroup[$scope.colGroup.length - 1]) { c.grouping2 = false; }
        });

        $rootScope.SalesReportInvTurnoverReportGridCtrl_SetData();

    };
    
    $scope.cols = [        
        { id: 1, label: 'KPI', fields: ['avgPeriodDayKPI'], checked: false },
        { id: 2, label: 'Average Inventory Period Last Year', fields: ['avgPeriodDayLast'], checked: false }
    ];

    $scope.cols2 = [
        { id: 3, label: 'Cost of goods sold', field: 'salesCost'},
        { id: 4, label: 'Beginning Inventory', field: 'quotedCost'},
        { id: 5, label: 'Ending Inventory', field: 'forwardCost'},
        { id: 6, label: 'Average Inventory', field: 'invAvg' },
        { id: 7, label: 'Inventory Turnover Ratio', field: 'invTurnoverRatio' },
        { id: 8, label: 'Average Inventory Period', field: 'avgPeriodDay' }
    ];

    $rootScope.SalesReportInvTurnoverReportGridCtrl_ShowCols = () => {
        var colss = $scope.cols2;
        $scope.cols.forEach((x) => {
            if (x.checked) {
                x.fields.forEach((y, i) => {
                    colss.push({ label: x.label, field: y });
                });
            }
        });        
        return colss;
    };

    $scope.ColumnChk = (id) => {
        $scope.cols.forEach((x) => {
            if (id === x.id) {
                x.fields.forEach((y) => {
                    $scope.gridOpt.columnDefs.find((c) => {
                        return c.field === y;
                    }).visible = x.checked;
                    $scope.gridOpt.columnDefs.find((c) => {
                        return c.field === y;
                    }).visible = x.checked;
                });
            }
        });

        $rootScope.SalesReportInvTurnoverReportGridCtrl_SetData();
    };
           
});