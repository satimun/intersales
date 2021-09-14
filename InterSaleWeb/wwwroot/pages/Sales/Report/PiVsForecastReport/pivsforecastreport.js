'use strict';
app.controller("SalesReportPiVsForecastReportController", function ($rootScope, $scope, API, $timeout, $filter, $q, common, intersales) {
    $scope.IP_DB = $rootScope.IP_DB;

    // set cost
    $scope.cost = {};
    $scope.cost.list = [];
    $scope.cost.view = '';
    $scope.cost.SetID = function (id) {
        $scope.cost.id = id;
    };
    $scope.GetCost = function (year) {
        KSSClient.API.ShipmentPlan.SearchCost({
            data: { year: year },
            callback: function (res) {
                var tmp = []
                res.data.costs.forEach(function (v) {
                    v.description = `ต้นทุนชุดที่ ${v.id}`;
                    tmp.push({ id: v.id, view: v.description });
                    if (v.defaultFlag === 'Y') {
                        $scope.cost.view = v.description;
                    }
                });
                $scope.cost.list = tmp;
                $scope.$apply();
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    };

    // set datePlan
    var d = new Date();
    $scope.yearFrom = d.getFullYear();
    $scope.yearTo = d.getFullYear();

    $scope.dtpFrom = new Date(d.getFullYear(), d.getMonth(), 1);
    $scope.dtpTo = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    $scope.GenMonth = (year) => {
        if (year) {
            $scope.GetCost($scope.yearTo);
            $rootScope.SalesReportPiVsForecastReportGridCtrl_SetColumn(parseInt($scope.yearFrom), parseInt($scope.yearTo), $scope.ytd);
        }
    };

    $scope.ytdChk = (ytd) => {
        $scope.genMonth(d.getFullYear());
        let dateFrom = new Date();
        let dateTo = new Date();
        if (ytd) {
            $scope.yearFrom = d.getFullYear() - 1;
            $scope.yearTo = d.getFullYear();
            dateFrom = new Date($scope.yearFrom, 10, 1);
            var td = new Date($scope.yearTo, 10, 0);
            if ($scope.dtpTo.getTime() > td.getTime()) {
                dateTo = td;
            }
        } else {
            $scope.yearFrom = $scope.yearTo;
            dateFrom = new Date($scope.yearTo, d.getMonth(), 1);
            dateTo = new Date($scope.yearTo, d.getMonth() + 1, 0);
        }

        $scope.monthFrom.view = dateFrom.toLocaleString("en-us", { month: "long" }).concat($scope.ytd ? ' ' + dateFrom.getFullYear() : '');
        $timeout(() => {
            $scope.monthTo.view = dateTo.toLocaleString("en-us", { month: "long" }).concat($scope.ytd ? ' ' + dateTo.getFullYear() : '');
        });
    };

    // load & set MonthTo
    $scope.monthTo = {};
    $scope.monthTo.list = [];
    $scope.monthTo.view = '';
    $scope.monthTo.id = '';
    $scope.monthTo.SetID = function (id) {
        $scope.monthTo.id = id;
        var tmp = id.split(":");
        try {
            $scope.dtpTo = new Date(parseInt($scope.yearTo), parseInt(tmp[1]) + 1, 0);
        } catch (ex) {
            console.log(ex);
        }
        if (!id) { $scope.monthTo.view = $scope.monthFrom.view; }
    };

    // load & set MonthFrom
    $scope.monthFrom = {};
    $scope.months = [];

    $scope.genMonth = (year) => {
        $scope.monthFrom.list = [];
        if ($scope.ytd) {
            for (var j = 10; j < 12; j++) { var date1 = new Date(year - 1, j, 1); $scope.monthFrom.list.push({ id: date1.getFullYear() + ':' + j, view: date1.toLocaleString("en-us", { month: "long" }).concat(' ' + date1.getFullYear()) }); }
        }
        for (var i = 0; i < 12; i++) {
            var date = new Date(year, i, 1);
            $scope.months.push(date.toLocaleString("en-us", { month: "long" }));
            $scope.monthFrom.list.push({ id: date.getFullYear() + ':' + (i < 10 ? '0' + i : i), view: date.toLocaleString("en-us", { month: "long" }).concat($scope.ytd ? ' ' + date.getFullYear() : '') });
        }
        $scope.monthFrom.view = d.toLocaleString("en-us", { month: "long" }).concat($scope.ytd ? ' ' + d.getFullYear() : '');
    };
    $scope.genMonth(d.getFullYear());

    // load & set MonthFrom
    $scope.monthFrom.id = '';
    $scope.monthFrom.SetID = function (id) {
        $scope.monthFrom.id = id;
        var tmp = id.split(":");
        try {
            $scope.dtpFrom = new Date(parseInt($scope.yearFrom), parseInt(tmp[1]), 1);
        } catch (ex) {
            console.log(ex);
        }
        $scope.monthTo.list = $scope.yearFrom != $scope.yearTo ? $scope.monthFrom.list : $scope.monthFrom.list.filter(x => x.id >= id);
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

    //// load & set Sales
    //$scope.emp = {};
    //$scope.emp.list = [];
    //$scope.emp.view = '';
    //$scope.emp.id = '';
    //$scope.emp.SetID = function (id) {
    //    $scope.emp.id = id;
    //};
    //var empID = parseInt($rootScope.username.split(' ')[0]);

    //KSSClient.API.Employee.SearchSale({
    //    data: { search: '', status: 'A' },
    //    callback: function (res) {
    //        var tmp = [];
    //        res.data.employees.forEach(function (v) {
    //            tmp.push({ id: v.id, view: common.GetCodeDescription(v) });
    //            if (v.id === empID) {
    //                $scope.emp.view = common.GetCodeDescription(v);
    //            }
    //        });
    //        $scope.emp.list = tmp;
    //    },
    //    error: function (res) {
    //        common.AlertMessage("Error", res.message);
    //    }
    //});

    $scope.chkLoadData = false;
    $scope.isRawData = false;

    $rootScope.piForecastData = [];

    $scope.LoadData = function () {
        if ($scope.cost.id === undefined) {
            return false;
        }

        var monthFrom = $scope.monthFrom.id.split(":");
        var monthTo = $scope.monthTo.id.split(":");

        if ($scope.ytd) {
            $scope.dtpFrom = new Date(parseInt(monthFrom[0]), parseInt(monthFrom[1]), 1);
            $scope.dtpTo = new Date(parseInt(monthTo[0]), parseInt(monthTo[1]) + 1, 0);
        } else {
            $scope.dtpFrom = new Date(parseInt($scope.yearFrom), parseInt(monthFrom[1]), 1);
            $scope.dtpTo = new Date(parseInt($scope.yearTo), parseInt(monthTo[1]) + 1, 0);
        }

        var zoneAccountIDs = [];
        $scope.zones.forEach(function (v) { zoneAccountIDs.push(v.id); });

        var regionalZoneIDs = [];
        $scope.regzone.forEach((v) => { regionalZoneIDs.push(v.id); });

        var customerIDs = [];
        $scope.customers.forEach((v) => { customerIDs.push(v.id); });

        $rootScope.piForecastData = [];

        var showCol = $rootScope.SalesReportPiVsForecastReportGridCtrl_ShowHideCol();

        API.ProformaInvoice.Report2({
            data: {
                dateFrom: common.GetDateString($scope.dtpFrom),
                dateTo: common.GetDateString($scope.dtpTo),
                costID: $scope.cost.id,
                regionalZoneIDs: regionalZoneIDs,
                zoneAccountIDs: zoneAccountIDs,
                customerIDs: customerIDs,
                "ProductTypeCode": showCol.find(v => v.field === 'productType.code').checked,
                "MaterialGroup": showCol.find(v => v.field === 'materialGroup').checked,
                "DiameterGroup": showCol.find(v => v.field === 'diameterGroup').checked,
                "Diameter": showCol.find(v => v.field === 'diameter').checked,
                "DiameterLB": showCol.find(v => v.field === 'diameterLB').checked,
                "MeshSizeLB": showCol.find(v => v.field === 'meshSizeLB').checked,
                "MeshDepthLB": showCol.find(v => v.field === 'meshDepthLB').checked,
                "LengthLB": showCol.find(v => v.field === 'lengthLB').checked,
                "KnotTypeCode": showCol.find(v => v.field === 'knotTypeLB').checked,
                "StretchingCode": showCol.find(v => v.field === 'stretchingLB').checked,
                "QualityCode": showCol.find(v => v.field === 'quality').checked,
                "LabelCode": showCol.find(v => v.field === 'label.code').checked,
                "ColorCode": showCol.find(v => v.field === 'color.code').checked
            },
            callback: function (res) {
                res.data.profomaInvoices.forEach((row) => {
                    $scope.btnExport = true;
                    row.zone.code_view = row.zone.code_vieworg = common.GetCodeDescription(row.zone);
                    row.country.code_view = row.country.code_vieworg = common.GetCodeDescription(row.country);
                    row.color.code_view = row.color.code_vieworg = common.GetCodeDescription(row.color);
                    row.customer.code_view = row.customer.code_vieworg = common.GetCodeDescription(row.customer);
                    row.productType.code_view = row.productType.code_vieworg = common.GetCodeDescription(row.productType);
                    //row.diameter_view = row.diameter_vieworg = row.diameter;
                    row.twine = row.diameter ? intersales.GetDiameter(row.diameter) : '';
                    row.month_view = row.month_vieworg = $scope.months[row.month - 1];

                    row.quality_view = row.quality_vieworg = row.quality;

                    row.materialGroup_view = row.materialGroup_vieworg = row.materialGroup;
                    row.diameterGroup_view = row.diameterGroup_vieworg = row.diameterGroup;

                    row.diameter_view = row.diameter_vieworg = row.diameter;
                    row.diameterLB_view = row.diameterLB_vieworg = row.diameter;

                    row.knotTypeLB_view = row.knotTypeLB_vieworg = row.knotTypeLB;
                    row.stretchingLB_view = row.stretchingLB_vieworg = row.stretchingLB;

                    row.meshSizeLB_view = row.meshSizeLB_vieworg = row.meshSizeLB;
                    row.meshDepthLB_view = row.meshDepthLB_vieworg = row.meshDepthLB;
                    row.lengthLB_view = row.lengthLB_vieworg = row.lengthLB;

                    row.label.code_view = row.label.code_vieworg = common.GetCodeDescription(row.label);

                });

                $rootScope.piForecastData = res.data.profomaInvoices;
                $rootScope.SalesReportPiVsForecastReportGridCtrl_SetData();

                $scope.dataH = {
                    monthFrom: $scope.monthFrom.view,
                    monthTo: $scope.monthTo.view,
                    year: $scope.yearFrom == $scope.yearTo ? $scope.yearFrom : $scope.yearFrom + ' - ' + $scope.yearTo
                };
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    };

    $rootScope.SalesReportPiVsForecastReport_GetDetail = (data) => {
        var deferred = $q.defer();
        API.ProformaInvoice.GetActual({
            data: {
                dateFrom: common.GetDateString($scope.dtpFrom)
                , dateTo: common.GetDateString($scope.dtpTo)
                , zoneID: data.zoneID
                , customerID: data.customerID
                , productType: data.productType
                , diameter: data.diameter
            },
            callback: function (res) {
                res.data.actuals.forEach((row) => { row.customer.view = common.GetCodeDescription(row.customer); });
                deferred.resolve(res.data.actuals);
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
                deferred.resolve();
            }
        });
        return deferred.promise;
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

        data.push([{ value: 'PI vs Forecast Report : ' + ' ( ' + $scope.dataH.monthFrom + ' - ' + $scope.dataH.monthTo + ' ' + ($scope.ytd ? '' : $scope.dataH.year) + ' )', metadata: { style: reportNamme, type: 'string' } }]);
        worksheet.setRowInstructions(1, { height: 45 });

        var showCol = $rootScope.SalesReportPiVsForecastReportGridCtrl_ShowHideCol();
        var widthCol = { Zone: 25, Country: 25, Customer: 40, Product: 25, Diameter: 18, Color: 25 };

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

        var showCols = $rootScope.SalesReportPiVsForecastReportGridCtrl_ShowCols();
        let digi1 = startCol - 1;
        let digi2 = 64;

        let groups = [];
        showCols.forEach(c => {
            let tmp = groups.find(x => x.id === c.id);
            if (!tmp) {
                tmp = c;
                tmp.items = [];
                groups.push(tmp);
            }
            tmp.items.push(c);
        });
        groups.forEach(g => {
            if (digi1 + 1 > 90) {
                digi1 = 64;
                digi2++;
            }
            let code1 = (digi2 > 64 ? String.fromCharCode(digi2) : '') + String.fromCharCode(++digi1);
            g.items.forEach((c, i) => {
                tmpCol1.push({ value: g.label2, metadata: { style: headFormat, type: 'string' } });
                tmpCol2.push({ value: c.label1, metadata: { style: headFormat, type: 'string' } });
                tmpWidth.push({ width: 15 });
                if (i > 0) digi1++;

                if (digi1 + 1 > 90 && i !== g.items.length - 1) {
                    digi1 = 64;
                    digi2++;
                }
            });
            let code2 = (digi2 > 64 ? String.fromCharCode(digi2) : '') + String.fromCharCode(digi1);
            worksheet.mergeCells(code1 + (startRow), code2 + (startRow));
        });

        // column add1
        data.push(tmpCol1);
        // column add2
        data.push(tmpCol2);
        // set Col width
        worksheet.setColumns(tmpWidth);

        for (var i = 0; i < data.length; i++) { worksheet.setRowInstructions(i, { height: 25.5 }); }
        startRow = data.length;
        var tmpSum = {};
        var dataGrid = $rootScope.SalesReportPiVsForecastReportGridCtrl_GetData();
        dataGrid.renderContainers.body.visibleRowCache.map(x => x.entity).forEach(function (row, i) {

            var styleKey = 'text';

            if (row.totalRow) {
                styleKey = 'total';
                worksheet.mergeCells('A' + (startRow + 1), String.fromCharCode(startCol - 1) + (startRow + 1));
            }

            var tmpData = [];

            showCol.forEach((c) => {
                if (c.checked) { tmpData.push({ value: $scope.isRawData ? common.GetObjVal(c.field + '_vieworg', row) : common.GetObjVal(c.field + '_view', row), metadata: { style: style[styleKey].textLeft, type: 'string' } }); }
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
        common.ExportExcel(workbook, 'PI vs Forecast Report');
    };

});

app.controller("SalesReportPiVsForecastReportGridCtrl", function ($rootScope, $scope, $filter, $timeout, $uibModal, common) {

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

    $scope.gridOpt = common.CreateGrid2({ footer: true, grouping2: { enable: true, showTotal: true } });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'action', display: '', width: { default: 45 }, format: { type: 'btnPopup', func: 'ShowDetail' }, hiding: false, sort: false, filter: false, pinnedLeft: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'zone.code', display: 'Zone', width: { default: 250 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'country.code', display: 'Country', width: { default: 250 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer.code', display: 'Customer', width: { default: 250 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'materialGroup', display: 'Material Group', width: { default: 150 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productType.code', display: 'Product', width: { default: 200 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'quality', display: 'Quality', width: { default: 100 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'diameterGroup', display: 'Diameter Group', width: { default: 150 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'diameter', display: 'Diameter', width: { default: 100 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'diameterLB', display: 'Diameter LB', width: { default: 120 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'knotTypeLB', display: 'Knot Type', width: { default: 100 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stretchingLB', display: 'Stretching', width: { default: 100 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'meshSizeLB', display: 'Mesh Size', width: { default: 100 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'meshDepthLB', display: 'Mesh Depth', width: { default: 100 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lengthLB', display: 'Length', width: { default: 100 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'color.code', display: 'Color', width: { default: 150 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'label.code', display: 'Label', width: { default: 150 }, format: { type: 'customText' }, _grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'month', display: 'Month', width: { default: 150 }, format: { type: 'customText' }, grouping2: true, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_shipmentForecast1');
    };

    $scope.years = [];

    $rootScope.SalesReportPiVsForecastReportGridCtrl_SetColumn = (yearFrom, yearTo, ytd) => {
        $scope.gridOpt.data = [];
        $scope.years = [];
        $scope.ClearColumn();
        if (yearFrom == yearTo || ytd) {

            $scope.years.push(yearTo);

            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'forecast.weight', display: 'Weight (KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'forecast', display: 'Forecast', langCode: '' }, setclass: SetClass }));
            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'forecast.value', display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'forecast', display: 'Forecast', langCode: '' }, setclass: SetClass }));

            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastYear.weight', display: 'Weight (KG)', visible: false, width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'lastYear', display: 'Last Year', langCode: '' }, setclass: SetClass }));
            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastYear.amount', display: 'Amount (PC)', visible: false, width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'lastYear', display: 'Last Year', langCode: '' }, setclass: SetClass }));
            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastYear.value', display: 'Value(THB)', visible: false, width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'lastYear', display: 'Last Year', langCode: '' }, setclass: SetClass }));

            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.weight', display: 'Weight (KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass }));
            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.amount', display: 'Amount (PC)', width: { default: 120 }, format: { type: 'decimal', scale: 0 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass }));
            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.value', display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass }));

            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actualVsLastYear.weight', visible: false, display: 'Weight (KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actualVsLastYear', display: 'Actual VS Last Year', langCode: '' }, setclass: SetClass }));
            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actualVsLastYear.value', visible: false, display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actualVsLastYear', display: 'Actual VS Last Year', langCode: '' }, setclass: SetClass }));

            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'differentAcVsLastYear.weight', visible: false, display: 'Weight (KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actualVsLastYear.weight', divi: 'lastYear.weight' }, group: { name: 'differentAcVsLastYear', display: '% Different', langCode: '' }, setclass: SetClass }));
            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'differentAcVsLastYear.value', visible: false, display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actualVsLastYear.value', divi: 'lastYear.value' }, group: { name: 'differentAcVsLastYear', display: '% Different', langCode: '' }, setclass: SetClass }));

            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actualVsForecast.weight', display: 'Weight (KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actualVsForecast', display: 'Actual VS Forecast', langCode: '' }, setclass: SetClass }));
            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actualVsForecast.value', display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actualVsForecast', display: 'Actual VS Forecast', langCode: '' }, setclass: SetClass }));

            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'differentAcVsFore.weight', display: 'Weight (KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actualVsForecast.weight', divi: 'forecast.weight' }, group: { name: 'differentAcVsFore', display: '% Different', langCode: '' }, setclass: SetClass }));
            $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'differentAcVsFore.value', display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actualVsForecast.value', divi: 'forecast.value' }, group: { name: 'differentAcVsFore', display: '% Different', langCode: '' }, setclass: SetClass }));


        } else {
            $scope.cols.find(x => x.id === 2).fieldss = [];
            $scope.cols.find(x => x.id === 3).fieldss = [];
            for (let y = yearFrom; y <= yearTo; y++) {
                $scope.AddColumn(y);
                $scope.years.push(y);
            }
        }

        $scope.PreChangeChk();
    }

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
            } else if (myCol.field === 'month') {
                return angular.isUndefined(myRow.entity.month) ? '' : myRow.entity.month_view;
            } else if (myCol.field === 'diameterLB') {
                return angular.isUndefined(myRow.entity.diameterLB) ? '' : myRow.entity.diameterLB_view;
            } else if (myCol.field === 'quality') {
                return angular.isUndefined(myRow.entity.quality) ? '' : myRow.entity.quality_view;
            } else if (myCol.field === 'knotTypeLB') {
                return angular.isUndefined(myRow.entity.knotTypeLB) ? '' : myRow.entity.knotTypeLB_view;
            } else if (myCol.field === 'stretchingLB') {
                return angular.isUndefined(myRow.entity.stretchingLB) ? '' : myRow.entity.stretchingLB_view;
            } else if (myCol.field === 'meshSizeLB') {
                return angular.isUndefined(myRow.entity.meshSizeLB) ? '' : myRow.entity.meshSizeLB_view;
            } else if (myCol.field === 'meshDepthLB') {
                return angular.isUndefined(myRow.entity.meshDepthLB) ? '' : myRow.entity.meshDepthLB_view;
            } else if (myCol.field === 'lengthLB') {
                return angular.isUndefined(myRow.entity.lengthLB) ? '' : myRow.entity.lengthLB_view;
            } else if (myCol.field === 'label.code') {
                return angular.isUndefined(myRow.entity.label) ? '' : myRow.entity.label.code_view;
            } else if (myCol.field === 'action') {
                return angular.isUndefined(myRow.entity.totalRow) ? true : false;
            }
        }
        return false;
    };

    $scope.ClearColumn = function () {
        let col = $scope.gridOpt.columnDefs.filter(c => c.group);
        col.forEach(c => {
            let index = $scope.gridOpt.columnDefs.indexOf(c);
            $scope.gridOpt.columnDefs.splice(index, 1);
        });
    }

    $scope.AddColumn = function (year) {

        $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_forecast${year}.weight`, display: 'Weight (KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: `_forecast${year}`, display: `Forecast ${year}`, langCode: '' }, setclass: SetClass }));
        $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_forecast${year}.value`, display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: `_forecast${year}`, display: `Forecast ${year}`, langCode: '' }, setclass: SetClass }));
        $scope.cols.find(x => x.id === 2).fieldss.push(`_forecast${year}`);

        $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_actual${year}.weight`, display: 'Weight (KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: `_actual${year}`, display: `Actual ${year}`, langCode: '' }, setclass: SetClass }));
        $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_actual${year}.amount`, display: 'Amount (PC)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: `_actual${year}`, display: `Actual ${year}`, langCode: '' }, setclass: SetClass }));
        $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_actual${year}.value`, display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: `_actual${year}`, display: `Actual ${year}`, langCode: '' }, setclass: SetClass }));
        $scope.cols.find(x => x.id === 3).fieldss.push(`_actual${year}`);

    }

    $scope.ShowDetail = (row) => {
        var req = { zoneID: null, countryID: null, customerID: null, productTypeID: null, diameter: null, colorID: null };
        var dataModal = { title: [], data: [] };
        if ($scope.gZone) { req.zoneID = row.entity.zone.id; dataModal.title.push({ text: 'Zone', value: row.entity.zone.code_vieworg }); }
        if ($scope.gCountry) { req.countryID = row.entity.country.id; dataModal.title.push({ text: 'Country', value: row.entity.country.code_vieworg }); }
        if ($scope.gCustomer) { req.customerID = row.entity.customer.id; dataModal.title.push({ text: 'Customer', value: row.entity.customer.code_vieworg }); }
        if ($scope.gProduct) { req.productTypeID = row.entity.productTypeID; dataModal.title.push({ text: 'Product', value: row.entity.productType.code_vieworg }); }
        if ($scope.gDiameter) { req.diameter = row.entity.diameter; dataModal.title.push({ text: 'Diameter', value: row.entity.diameter_vieworg }); }
        if ($scope.gColor) { req.colorID = row.entity.color.id; dataModal.title.push({ text: 'Color', value: row.entity.color.code_vieworg }); }
        $rootScope.SalesReportPiVsForecastReport_GetDetail(req).then((data) => {
            dataModal.data = data;
            $scope.ModalOpen(dataModal);
        });
    };

    $scope.colGroup = [];


    $rootScope.SalesReportPiVsForecastReportGridCtrl_GetData = () => { return $scope.gridApi.grid; };

    $scope.isProcess = false;

    $rootScope.SalesReportPiVsForecastReportGridCtrl_SetData = function () {
        var tmpObj = [], data = [];

        if ($rootScope.piForecastData.length) $scope.isGroupChange = false;
        $scope.isProcess = true;

        $rootScope.piForecastData.forEach((d) => {
            let group = [];
            $scope.colGroup.forEach(key => group.push(common.GetObjVal(key, d)));
            group = group.join('_');

            let o = tmpObj.find(v => v._group === group);
            if (!o) {
                o = { _group: group, total: angular.copy(d) };
                tmpObj.push(o);
                if ($scope.years.length > 1) {
                    $scope.years.forEach(y => {
                        o.total[`_forecast${y}`] = { weight: 0, value: 0 };
                        o.total[`_actual${y}`] = { weight: 0, amount: 0, value: 0 };
                    });
                } else {
                    o.total.actual = { weight: 0, amount: 0, value: 0 };
                    o.total.forecast = { weight: 0, value: 0 };
                    o.total.lastYear = { weight: 0, amount: 0, value: 0 };
                    o.total.actualVsForecast = { weight: 0, value: 0 };
                    o.total.actualVsLastYear = { weight: 0, value: 0 };
                    o.total.differentAcVsFore = { weight: 0, value: 0 };
                    o.total.differentAcVsLastYear = { weight: 0, value: 0 };
                }
                data.push(o.total);
            }

            if ($scope.years.length > 1) {
                $scope.years.forEach(y => {
                    let v = d.years.find(x => x.year === y);
                    if (v) {
                        o.total[`_forecast${y}`].weight += v.forecast.weight;
                        o.total[`_forecast${y}`].value += v.forecast.value;

                        o.total[`_actual${y}`].weight += v.actual.weight;
                        o.total[`_actual${y}`].amount += v.actual.amount;
                        o.total[`_actual${y}`].value += v.actual.value;
                    }
                });
            } else {

                o.total.forecast.weight += d.forecast.weight;
                o.total.forecast.value += d.forecast.value;

                o.total.lastYear.weight += d.lastYear.weight;
                o.total.lastYear.amount += d.lastYear.amount;
                o.total.lastYear.value += d.lastYear.value;

                o.total.actual.weight += d.actual.weight;
                o.total.actual.amount += d.actual.amount;
                o.total.actual.value += d.actual.value;

                o.total.actualVsForecast.weight = o.total.actual.weight - o.total.forecast.weight;
                o.total.actualVsForecast.value = o.total.actual.value - o.total.forecast.value;

                o.total.actualVsLastYear.weight = o.total.actual.weight - o.total.lastYear.weight;
                o.total.actualVsLastYear.value = o.total.actual.value - o.total.lastYear.value;

                o.total.differentAcVsFore.weight = o.total.forecast.weight === 0 ? 0 : (o.total.actualVsForecast.weight / o.total.forecast.weight) * 100;
                o.total.differentAcVsFore.value = o.total.forecast.value === 0 ? 0 : (o.total.actualVsForecast.value / o.total.forecast.value) * 100;

                o.total.differentAcVsLastYear.weight = o.total.lastYear.weight === 0 ? 0 : (o.total.actualVsLastYear.weight / o.total.lastYear.weight) * 100;
                o.total.differentAcVsLastYear.value = o.total.lastYear.value === 0 ? 0 : (o.total.actualVsLastYear.value / o.total.lastYear.value) * 100;
            }

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
            $scope.isProcess = false;
            //$scope.gridApi.grid.refresh();
        });
    };

    $scope.gZone = true;
    $scope.gCountry = true;
    $scope.gCustomer = false;
    $scope.gProduct = false;
    $scope.gDiameter = false;
    $scope.gColor = false;
    $scope.gMonth = false;

    $rootScope.SalesReportPiVsForecastReportGridCtrl_ShowHideCol = () => {
        return $scope.lists;
    };

    $scope.lists = [
        { label: 'Zone', field: 'zone.code', checked: true },
        { label: 'Country', field: 'country.code', checked: false },
        { label: 'Customer', field: 'customer.code', checked: false },
        { label: 'Material Group', field: 'materialGroup', checked: false },
        { label: 'Product', field: 'productType.code', checked: false },
        { label: 'Quality', field: 'quality', checked: false },
        { label: 'Diameter Group', field: 'diameterGroup', checked: false },
        { label: 'Diameter', field: 'diameter', checked: false },
        { label: 'Diameter LB', field: 'diameterLB', checked: false },

        { label: 'Knot Type', field: 'knotTypeLB', checked: false },
        { label: 'Stretching', field: 'stretchingLB', checked: false },
        { label: 'Mesh Size', field: 'meshSizeLB', checked: false },
        { label: 'Mesh Depth', field: 'meshDepthLB', checked: false },
        { label: 'Length', field: 'lengthLB', checked: false },

        { label: 'Color', field: 'color.code', checked: false },
        { label: 'Label', field: 'label.code', checked: false },

        { label: 'Month', field: 'month', checked: false }
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
                $scope.gridOpt.columnDefs.splice(i + 1, 0, c);
            });
            $scope.ChangeChk();
        }
    }, true);

    $scope.isGroupChange = false;
    $scope.onGroupChange = (item) => {
        if ((item.field === 'productType.code'
            || item.field === 'materialGroup'
            || item.field === 'diameterGroup'
            || item.field === 'diameter'
            || item.field === 'diameterLB'
            || item.field === 'meshSizeLB'
            || item.field === 'meshDepthLB'
            || item.field === 'lengthLB'
            || item.field === 'knotTypeLB'
            || item.field === 'stretchingLB'
            || item.field === 'quality'
            || item.field === 'label.code'
            || item.field === 'color.code') && item.checked) {
            $scope.isGroupChange = true;
            $rootScope.piForecastData = [];
        }
    }

    $scope.group1 = false;
    $scope.onGroup1Change = () => {
        $scope.lists.find(v => v.field == 'materialGroup').checked = $scope.group1;
        $scope.lists.find(v => v.field == 'productType.code').checked = $scope.group1;
        let item = $scope.lists.find(v => v.field == 'diameterGroup');
        item.checked = $scope.group1;
        $scope.onGroupChange(item);
    }

    $scope.PreChangeChk = () => {
        $scope.lists.forEach((v) => {
            if (v.label === 'Zone') { $scope.gZone = v.checked; }
            if (v.label === 'Country') { $scope.gCountry = v.checked; }
            if (v.label === 'Customer') { $scope.gCustomer = v.checked; }
            if (v.label === 'Product') { $scope.gProduct = v.checked; }
            if (v.label === 'Diameter') { $scope.gDiameter = v.checked; }
            if (v.label === 'Color') { $scope.gColor = v.checked; }
            if (v.label === 'Month') { $scope.gMonth = v.checked; }
        });

        $scope.colGroup = [];
        $scope.gridOpt.columnDefs.forEach((c) => {
            let v = $scope.lists.find(x => x.field === c.field);
            if (v) {
                c.grouping2 = c.visible = v.checked;
                c.showCountItems = false;
            }

            if (c.visible && c.grouping2) { $scope.colGroup.push(c.field); }
        });

        $scope.gridOpt.columnDefs.forEach((c) => {
            if (c.field === $scope.colGroup[0]) c.showCountItems = true;
            if (c.field === $scope.colGroup[$scope.colGroup.length - 1]) { c.grouping2 = false; }
        });
    }

    $scope.ChangeChk = () => {
        $scope.PreChangeChk();
        $rootScope.SalesReportPiVsForecastReportGridCtrl_SetData();
    };

    $scope.cols = [
        { id: 2, label: 'Forecast', fields: ['forecast', 'differentAcVsFore', 'actualVsForecast'], fieldss: [], checked: true },
        { id: 4, label: 'Last Year', fields: ['lastYear', 'differentAcVsLastYear', 'actualVsLastYear'], fieldss: [], checked: false },
        { id: 3, label: 'Actual', fields: ['actual'], fieldss: [], checked: true }
    ];

    $rootScope.SalesReportPiVsForecastReportGridCtrl_ShowCols = () => {
        var colss = [], colsl = [];
        if ($scope.years.length > 1) {
            $scope.years.forEach(y => {
                if ($scope.cols.find(x => x.id === 2).checked) {
                    colss.push({ id: `_forecast${y}`, label1: 'Weight(KG)', label2: `Forecast ${y}`, field: `_forecast${y}.weight` });
                    colss.push({ id: `_forecast${y}`, label1: 'Value(THB)', label2: `Forecast ${y}`, field: `_forecast${y}.value` });
                }
                if ($scope.cols.find(x => x.id === 3).checked) {
                    colss.push({ id: `_actual${y}`, label1: 'Weight(KG)', label2: `Actual ${y}`, field: `_actual${y}.weight` });
                    colss.push({ id: `_actual${y}`, label1: 'Amount(PC)', label2: `Actual ${y}`, field: `_actual${y}.amount` });
                    colss.push({ id: `_actual${y}`, label1: 'Value(THB)', label2: `Actual ${y}`, field: `_actual${y}.value` });
                }
            });
        } else {
            $scope.cols.forEach((x) => {
                if (x.checked) {
                    x.fields.forEach((y, i) => {
                        if (i === 0) {
                            colss.push({ id: y, label1: 'Weight(KG)', label2: x.label, field: y + '.weight' });
                            if (y !== 'forecast') colss.push({ id: y, label1: 'Amount(PC)', label2: x.label, field: y + '.amount' });
                            colss.push({ id: y, label1: 'Value(THB)', label2: x.label, field: y + '.value' });
                        } else {
                            colsl.push({ id: y, label1: 'Value(THB)', label2: y[0] === 'd' ? '% Different' : 'Actual VS ' + x.label, field: y + '.value' });
                            colsl.push({ id: y, label1: 'Weight(KG)', label2: y[0] === 'd' ? '% Different' : 'Actual VS ' + x.label, field: y + '.weight' });
                        }
                    });
                }
            });
        }
        for (var i = colsl.length - 1; i >= 0; i--) {
            colss.push(colsl[i]);
        }
        return colss;
    };

    $scope.ColumnChk = (id) => {
        $scope.cols.forEach((x) => {
            if (id === x.id) {
                let fields = $scope.years.length > 1 ? x.fieldss : x.fields;
                fields.forEach((y) => {
                    let tmp = $scope.gridOpt.columnDefs.find((c) => {
                        return c.field === y + '.weight';
                    });
                    if (tmp) tmp.visible = x.checked;

                    tmp = $scope.gridOpt.columnDefs.find((c) => {
                        return c.field === y + '.amount';
                    });
                    if (tmp) tmp.visible = x.checked;

                    tmp = $scope.gridOpt.columnDefs.find((c) => {
                        return c.field === y + '.value';
                    });
                    if (tmp) tmp.visible = x.checked;
                });
            }
        });

        $scope.gridApi.grid.refresh();
    };

    $scope.ModalOpen = (dataModal) => {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'SalesReportPiVsForecastCtrl',
            size: 'mdc',
            appendTo: undefined,
            resolve: { dataModal: function () { return dataModal; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'SalesReportPiVsForecastModal.html'
        });
        modalInstance.result.then(() => { }, () => { });
    };

});

app.controller('SalesReportPiVsForecastCtrl', function ($scope, dataModal, common, $uibModalInstance) {

    $scope.title = dataModal.title;

    $scope.gridOpt = common.CreateGrid2({ footer: true });
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'piCode', display: 'PI', width: { default: 120 }, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'piDate', display: 'PI Date', width: { default: 100 }, format: { type: 'datetime' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer.view', display: 'Customer', width: { default: 300 } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.weightKg', display: 'Weight (kg)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.amountpc', display: 'Amount (pc)', width: { min: 120 }, format: { type: 'decimal', scale: 0 }, group: { name: 'actual', display: 'Actual', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.value', display: 'Value', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' } }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "piDate") {
                return KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(myRow.entity.piDate));
            }
        }
        return false;
    };

    $scope.gridOpt.data = dataModal.data;

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_shipmentForecast2');
    };

    $scope.close = function () {
        $uibModalInstance.close();
    };
});