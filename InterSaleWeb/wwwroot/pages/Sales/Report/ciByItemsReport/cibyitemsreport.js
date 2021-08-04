'use strict';
app.controller("SalesReportCIByItemsReportController", function ($rootScope, $scope, API, $timeout, $filter, $q, common, intersales) {
    $scope.IP_DB = $rootScope.IP_DB;

    // set datePlan
    var d = new Date();
    $scope.dateFrom = new Date(d.getFullYear(), 0, 1);
    $scope.dateTo = new Date(d.getFullYear(), 11, 31);

    $scope.ChkDate = () => {
        if (!$scope.dateFrom || !$scope.dateTo) { return 0; }
        if ($scope.dateFrom.getTime() > $scope.dateTo.getTime()) {
            // common.AlertMessage('warning', 'Date from must be less than the date to.');
            return 0;
        }
        $rootScope.SalesReportCIByItemsReportGridCtrl_ResetData($scope.dateFrom, $scope.dateTo);
        $scope.btnExport = false;
    }
    setTimeout(() => { $scope.ChkDate(); }, 500);

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

    // load country
    $scope.countryList = [];
    $scope.countrys = [];
    KSSClient.API.Country.List({
        data: {},
        callback: function (res) {
            res.data.countrys.forEach(function (v) {
                $scope.countryList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        },
        error: function (res) { common.AlertMessage("Error", res.message); }
    });
    // set country
    $scope.LoadCountry = function (query) {
        return $filter('filter')($scope.countryList, { 'text': query });
    };

    // load productType
    $scope.productTypeList = [];
    $scope.productType = [];
    API.ProductType.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.productTypes.forEach((v) => {
                $scope.productTypeList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });
    // set productType
    $scope.LoadProductType = function (query) {
        return $filter('filter')($scope.productTypeList, { 'text': query });
    };

    // load ProductQuality
    $scope.productQualityList = [];
    $scope.productQuality = [];
    API.ProductGrade.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.productGrades.forEach((v) => {
                $scope.productQualityList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });
    // set productQuality
    $scope.LoadProductQuality = function (query) {
        return $filter('filter')($scope.productQualityList, { 'text': query });
    };

    // load productTwineNo
    $scope.productTwineNoList = [];
    $scope.productTwineNo = [];
    API.ProductTwineSize.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.twineSizes.forEach((v) => {
                $scope.productTwineNoList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });
    // set productTwineNo
    $scope.LoadProductTwineNo = function (query) {
        return $filter('filter')($scope.productTwineNoList, { 'text': query });
    };

    $scope.diameterLabel = '';
    $scope.meshSizeProd = null;
    $scope.meshDepthProd = null;
    $scope.lenghtProd = null;

    // load knotType
    $scope.knotTypeList = [];
    $scope.knotType = [];
    API.ProductKnot.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.knots.forEach((v) => {
                $scope.knotTypeList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });
    // set knotType
    $scope.LoadKnotType = function (query) {
        return $filter('filter')($scope.knotTypeList, { 'text': query });
    };

    // load stretching
    $scope.stretchingList = [];
    $scope.stretching = [];
    API.ProductStretching.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.stretchings.forEach((v) => {
                $scope.stretchingList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });
    // set stretching
    $scope.LoadStretching = function (query) {
        return $filter('filter')($scope.stretchingList, { 'text': query });
    };

    // load color
    $scope.colorList = [];
    $scope.color = [];
    KSSClient.API.ProductColor.Search({
        data: { status: 'A' },
        callback: (res) => {
            res.data.colors.forEach((v) => {
                $scope.colorList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });
    // set color
    $scope.LoadColor = function (query) {
        return $filter('filter')($scope.colorList, { 'text': query });
    };

    // load label
    $scope.labelList = [];
    $scope.label = [];
    API.Label.List({
        data: {},
        noloadding: true,
        callback: (res) => {
            res.data.labels.forEach((v) => {
                $scope.labelList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });
    // set label
    $scope.LoadLabel = function (query) {
        return $filter('filter')($scope.labelList, { 'text': query });
    };

    $scope.chkLoadData = false;

    $scope.LoadData = function () {

        if ($scope.dateFrom.getTime() > $scope.dateTo.getTime()) {
            common.AlertMessage('warning', 'Date from must be less than the date to.');
            return 0;
        }
        
        var ZoneID = [];
        $scope.zones.forEach(function (v) { ZoneID.push(v.id); });

        var RegionalZoneID = [];
        $scope.regzone.forEach((v) => { RegionalZoneID.push(v.id); });

        var customerID = [];
        $scope.customers.forEach((v) => { customerID.push(v.id); });

        var countryID = [];
        $scope.countrys.forEach((v) => { countryID.push(v.id); });

        let ProductTypeCode = [];
        $scope.productType.forEach((v) => { ProductTypeCode.push(v.code); });

        let QualityCode = [];
        $scope.productQuality.forEach((v) => { QualityCode.push(v.code); });

        let ProductTwineNo = [];
        $scope.productTwineNo.forEach((v) => { ProductTwineNo.push(v.code); });

        let KnotType = [];
        $scope.knotType.forEach((v) => { KnotType.push(v.code); });

        let Stretching = [];
        $scope.stretching.forEach((v) => { Stretching.push(v.code); });

        let Color = [];
        $scope.color.forEach((v) => { Color.push(v.code); });

        let Label = [];
        $scope.label.forEach((v) => { Label.push(v.code); });

        let mode = $rootScope.SalesReportCIByItemsReportGridCtrl_Mode();

        let showCol = $rootScope.SalesReportCIByItemsReportGridCtrl_displaySpec();

        $scope.displayspec = [
            { id: 1, label: 'Zone', fields: ['_zone'], checked: false },
            { id: 2, label: 'Country', fields: ['_country'], checked: false },
            { id: 3, label: 'Customer', fields: ['_customer'], checked: false },
            { id: 4, label: 'Description', fields: ['product.description', '_label', 'salesUnitCode'], checked: true },
            { id: 5, label: 'Column Spec', fields: ['productTypeCode', 'qualityCode', 'productTwineNo', 'diameterLabel', 'knotType', 'stretching', 'meshSizeProd', 'meshDepthProd', 'lengthProd', 'colorCode'], checked: false },
            { id: 6, label: 'Show CI', fields: ['cino'], checked: false },
            { id: 7, label: 'Show Order', fields: ['orderNo'], checked: false },
            { id: 8, label: 'Selvage', fields: ['selvage.description'], checked: false },
        ];

        API.CommercialInvoice.ItemsReport({
            data: {
                dateFrom: common.GetDateString($scope.dateFrom),
                dateTo: common.GetDateString($scope.dateTo),
                RegionalZoneID: RegionalZoneID,
                ZoneID: ZoneID,
                countryID: countryID,
                customerID: customerID,
                ProductTypeCode: ProductTypeCode,
                QualityCode: QualityCode,
                ProductTwineNo: ProductTwineNo,
                DiameterLabel: $scope.diameterLabel,
                MeshSizeProd: $scope.meshSizeProd,
                MeshDepthProd: $scope.meshDepthProd,
                LengthProd: $scope.lenghtProd,
                KnotType: KnotType,
                Stretching: Stretching,
                Color: Color,
                Label: Label,
                mode: mode,
                showZone: showCol.find(v => v.id === 1).checked,
                showCountry: showCol.find(v => v.id === 2).checked,
                showCustomer: showCol.find(v => v.id === 3).checked,
                showDes: showCol.find(v => v.id === 4).checked,
                showSpec: showCol.find(v => v.id === 5).checked,
                showCI: showCol.find(v => v.id === 6).checked,
                showOrder: showCol.find(v => v.id === 7).checked,
                showSelvage: showCol.find(v => v.id === 8).checked,
            },
            callback: function (res) {

                res.data.comercialInvoice.forEach((row) => {
                    $scope.btnExport = true;
                    if (mode === 'Y') {
                        row.years.forEach(v => {
                            row[`_year${v.year}`] = {};
                            row[`_year${v.year}`].amount = v.amount;
                            row[`_year${v.year}`].weight = v.weight;
                            row[`_year${v.year}`].value = v.value;
                            row[`_year${v.year}`].valueTHB = v.valueTHB;
                        });
                    } else if (mode === 'Q') {
                        row.quarters.forEach(v => {
                            row[`_quarter${v.quarter}`] = {};
                            row[`_quarter${v.quarter}`].amount = v.amount;
                            row[`_quarter${v.quarter}`].weight = v.weight;
                            row[`_quarter${v.quarter}`].value = v.value;
                            row[`_quarter${v.quarter}`].valueTHB = v.valueTHB;
                        });
                    } else {
                        row.months.forEach(v => {
                            row[`_month${v.month}`] = {};
                            row[`_month${v.month}`].amount = v.amount;
                            row[`_month${v.month}`].weight = v.weight;
                            row[`_month${v.month}`].value = v.value;
                            row[`_month${v.month}`].valueTHB = v.valueTHB;
                        });
                    }
                    row._label = common.GetCodeDescription(row.label);
                    row._zone = common.GetCodeDescription(row.zone);
                    row._country = common.GetCodeDescription(row.country);
                    row._customer = common.GetCodeDescription(row.customer);
                });
                $rootScope.SalesReportCIByItemsReportGridCtrl_SetData(res.data.comercialInvoice);
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
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

        data.push([{ value: 'CI By Items Report : ' + ' ( ' + common.GetDateString($scope.dateFrom) + ' - ' + common.GetDateString($scope.dateTo) + ' )', metadata: { style: reportNamme, type: 'string' } }]);
        worksheet.setRowInstructions(1, { height: 45 });

        var showCol = $rootScope.SalesReportCIByItemsReportGridCtrl_ShowHideCol().filter(c => !c.group);
        var widthCol = {
            '_zone': 25, '_country': 25, '_customer': 25,
            'product.code': 20, 'product.description': 50, 'productTypeCode': 15, 'qualityCode': 15, 'productTwineNo': 15, 'diameterLabel': 25, 'knotType': 15, 'stretching': 15,
            'meshSizeProd': 10, 'meshDepthProd': 10, 'lengthProd': 10, 'colorCode': 15, '_label': 30, 'salesUnitCode': 10, 'cino': 15, 'orderNo': 15, 'selvage.description': 30
        };

        var startRow = 2;
        var tmpCol1 = [], tmpCol2 = [], startCol = 65, tmpWidth = [];

        showCol.forEach((c) => {
            tmpCol1.push({ value: c.displayName, metadata: { style: headFormat, type: 'string' } });
            tmpCol2.push({ value: c.displayName, metadata: { style: headFormat, type: 'string' } });
            worksheet.mergeCells(String.fromCharCode(startCol) + (startRow), String.fromCharCode(startCol) + (startRow + 1));
            tmpWidth.push({ width: widthCol[c.field] });
            startCol++;
        });

        var showCols = $rootScope.SalesReportCIByItemsReportGridCtrl_ShowHideCol().filter(c => c.group);
        let digi1 = startCol - 1;
        let digi2 = 64;

        let groups = [];
        showCols.forEach(c => {
            let tmp = groups.find(x => x.group.name === c.group.name);
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
                tmpCol1.push({ value: g.group.display, metadata: { style: headFormat, type: 'string' } });
                tmpCol2.push({ value: c.displayName, metadata: { style: headFormat, type: 'string' } });
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
        var dataGrid = $rootScope.SalesReportCIByItemsReportGridCtrl_GetData();
        dataGrid.renderContainers.body.visibleRowCache.map(x => x.entity).forEach(function (row, i) {

            var styleKey = 'text';

            if (row.totalRow) {
                styleKey = 'total';
                worksheet.mergeCells('A' + (startRow + 1), String.fromCharCode(startCol - 1) + (startRow + 1));
            }

            var tmpData = [];

            showCol.forEach((c) => {
                tmpData.push({ value: common.GetObjVal(c.field, row), metadata: { style: style[styleKey].textLeft, type: 'string' } });
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
            tmpDataTotal.push({ value: '', metadata: { style: style[styleKey].textLeft, type: 'string' } });
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
        common.ExportExcel(workbook, 'CI By Items Report');
    };

});

app.controller("SalesReportCIByItemsReportGridCtrl", function ($rootScope, $scope, $filter, $timeout, $uibModal, common) {

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
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer.code', display: 'Customer', width: { default: 250 },  setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: '_zone', visible: false, display: 'Zone', width: { default: 250 }, setclass: SetClass, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: '_country', visible: false, display: 'Country', width: { default: 250 }, setclass: SetClass, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: '_customer', visible: false, display: 'Customer', width: { default: 250 }, setclass: SetClass, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.code', display: 'Product Code', width: { default: 150 }, setclass: SetClass, hiding: false, showCountItems: true }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.description', display: 'Description', width: { default: 350 }, setclass: SetClass, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productTypeCode', visible: false, display: 'Product Type', width: { default: 100 }, setclass: SetClass, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'qualityCode', visible: false, display: 'Quality', width: { default: 100 }, setclass: SetClass, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productTwineNo', visible: false, display: 'Diameter', width: { default: 100 }, setclass: SetClass, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'diameterLabel', visible: false, display: 'Diameter Label', width: { default: 120 }, setclass: SetClass, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'knotType', visible: false, display: 'Knot Type', width: { default: 100 }, setclass: SetClass, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stretching', visible: false, display: 'Stretching', width: { default: 100 }, setclass: SetClass, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'meshSizeProd', visible: false, display: 'Mesh Size', width: { default: 100 }, setclass: SetClass, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'meshDepthProd', visible: false, display: 'Mesh Depth', width: { default: 100 }, setclass: SetClass, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lengthProd', visible: false, display: 'Length', width: { default: 100 }, setclass: SetClass, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'colorCode', visible: false, display: 'Color', width: { default: 150 }, setclass: SetClass, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: '_label', display: 'Label', width: { default: 150 }, setclass: SetClass, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesUnitCode', display: 'Sales Unit', width: { default: 120 }, setclass: SetClass, hiding: false }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'cino', visible: false, display: 'CI No.', width: { default: 150 }, setclass: SetClass, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'orderNo', visible: false, display: 'Order No.', width: { default: 150 }, setclass: SetClass, hiding: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'selvage.description', visible: false, display: 'Selvage', width: { default: 150 }, setclass: SetClass, hiding: false }));

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_shipmentForecast1');
    };

    $scope.years = [];

    $scope.quarterList = [
        { quarter: 1, start: 1, end: 3 },
        { quarter: 2, start: 4, end: 6 },
        { quarter: 3, start: 7, end: 9 },
        { quarter: 4, start: 10, end: 12 }
    ];

    $scope.dateFrom = '';
    $scope.dateTo = '';

    $scope.years = [];
    $scope.quarters = [];
    $scope.months = [];

    $rootScope.SalesReportCIByItemsReportGridCtrl_ResetData = (dateFrom, dateTo) => {
        $scope.dateFrom = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 15);
        $scope.dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), 15);
        $scope.gridOpt.data = [];
    }

    $rootScope.SalesReportCIByItemsReportGridCtrl_SetColumn = () => {

        // $scope.dateFrom = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 15);
        // $scope.dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), 15);

        $scope.gridOpt.data = [];
        $scope.ClearColumn();

        if ($scope.mode === 'Y') {
            $scope.years = [];
            let year = $scope.dateFrom.getFullYear();
            while (year <= $scope.dateTo.getFullYear()) {
                $scope.years.push(year++);
            }
            $scope.years.forEach(y => {
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_year${y}.amount`, display: 'PC', width: { default: 110 }, format: { type: 'decimal', scale: 0 }, group: { name: `_year${y}`, display: y, langCode: '' }, setclass: SetClass }));
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_year${y}.weight`, display: 'KG', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: `_year${y}`, display: y, langCode: '' }, setclass: SetClass }));
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_year${y}.value`, display: 'Value', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: `_year${y}`, display: y, langCode: '' }, setclass: SetClass }));
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_year${y}.valueTHB`, display: 'Value(THB)', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: `_year${y}`, display: y, langCode: '' }, setclass: SetClass }));
            });
        } else {

            let dateTmp = angular.copy($scope.dateFrom);
            $scope.months = [];
            let month = dateTmp.getMonth();
            while (dateTmp.getTime() <= $scope.dateTo.getTime()) {
                let tmp = $scope.months.find(x => x === dateTmp.getMonth() + 1);
                if (!tmp) {
                    $scope.months.push(dateTmp.getMonth() + 1);
                }
                month++;
                dateTmp.setMonth(month);
                dateTmp = new Date(dateTmp);
                dateTmp = new Date(dateTmp.getFullYear(), dateTmp.getMonth(), 15);
            }

            if ($scope.mode === 'Q') {
                $scope.quarters = $scope.quarterList.filter(v => $scope.months.find(y => y === v.start) || $scope.months.find(y => y === v.end));
                $scope.quarters.forEach(q => {
                    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_quarter${q.quarter}.amount`, display: 'PC', width: { default: 110 }, format: { type: 'decimal', scale: 0 }, group: { name: `_quarter${q.quarter}`, display: `Q${q.quarter}`, langCode: '' }, setclass: SetClass }));
                    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_quarter${q.quarter}.weight`, display: 'KG', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: `_quarter${q.quarter}`, display: `Q${q.quarter}`, langCode: '' }, setclass: SetClass }));
                    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_quarter${q.quarter}.value`, display: 'Value', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: `_quarter${q.quarter}`, display: `Q${q.quarter}`, langCode: '' }, setclass: SetClass }));
                    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_quarter${q.quarter}.valueTHB`, display: 'Value(THB)', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: `_quarter${q.quarter}`, display: `Q${q.quarter}`, langCode: '' }, setclass: SetClass }));
                });
            } else {
                $scope.months.forEach(m => {
                    let date = new Date($scope.dateFrom.getFullYear(), m - 1, 1);
                    let month = date.toLocaleString("en-us", { month: "long" })
                    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_month${m}.amount`, display: 'PC', width: { default: 110 }, format: { type: 'decimal', scale: 0 }, group: { name: `_month${m}`, display: month, langCode: '' }, setclass: SetClass }));
                    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_month${m}.weight`, display: 'KG', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: `_month${m}`, display: month, langCode: '' }, setclass: SetClass }));
                    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_month${m}.value`, display: 'Value', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: `_month${m}`, display: month, langCode: '' }, setclass: SetClass }));
                    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: `_month${m}.valueTHB`, display: 'Value(THB)', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: `_month${m}`, display: month, langCode: '' }, setclass: SetClass }));
                });
            }
        }


        $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'total.amount', display: 'PC', width: { default: 110 }, format: { type: 'decimal', scale: 0 }, group: { name: 'total', display: 'Total', langCode: '' }, setclass: SetClass }));
        $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'total.weight', display: 'KG', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: 'total', display: 'Total', langCode: '' }, setclass: SetClass }));
        $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'total.value', display: 'Value', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: 'total', display: 'Total', langCode: '' }, setclass: SetClass }));
        $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'total.valueTHB', display: 'Value(THB)', width: { default: 110 }, format: { type: 'decimal', scale: 2 }, group: { name: 'total', display: 'Total', langCode: '' }, setclass: SetClass }));
    }

    $scope.cumulative = function (grid, myRow, myCol) {
        //if (grid.id === $scope.gridApi.grid.id) {
        //}
        return false;
    };

    $scope.ClearColumn = function () {
        let col = $scope.gridOpt.columnDefs.filter(c => c.group);
        col.forEach(c => {
            let index = $scope.gridOpt.columnDefs.indexOf(c);
            $scope.gridOpt.columnDefs.splice(index, 1);
        });
    }

    $rootScope.SalesReportCIByItemsReportGridCtrl_GetData = () => { return $scope.gridApi.grid; };

    $scope.isProcess = false;

    $rootScope.SalesReportCIByItemsReportGridCtrl_SetData = function (data) {

        $rootScope.SalesReportCIByItemsReportGridCtrl_SetColumn($scope.dateFrom, $scope.dateTo);

        $scope.gridOpt.data = data;
    };

    $rootScope.SalesReportCIByItemsReportGridCtrl_ShowHideCol = () => {
        return $scope.gridOpt.columnDefs.filter(c => c.visible);
    };

    $rootScope.SalesReportCIByItemsReportGridCtrl_displaySpec = () => {
        return $scope.displayspec;
    }

    $scope.displayspec = [
        { id: 1, label: 'Zone', fields: ['_zone'], checked: false },
        { id: 2, label: 'Country', fields: ['_country'], checked: false },
        { id: 3, label: 'Customer', fields: ['_customer'], checked: false },
        { id: 4, label: 'Description', fields: ['product.description', '_label', 'salesUnitCode'], checked: true },
        { id: 5, label: 'Column Spec', fields: ['productTypeCode', 'qualityCode', 'productTwineNo', 'diameterLabel', 'knotType', 'stretching', 'meshSizeProd', 'meshDepthProd', 'lengthProd', 'colorCode'], checked: false },
        { id: 6, label: 'Show CI', fields: ['cino'], checked: false },
        { id: 7, label: 'Show Order', fields: ['orderNo'], checked: false },
        { id: 8, label: 'Selvage', fields: ['selvage.description'], checked: false },
    ];

    $scope.ColumnChk = (item) => {
        $scope.gridOpt.data = [];
        $scope.gridOpt.columnDefs.forEach((c) => {
            if (item.fields.find(field => field === c.field)) {
                c.visible = item.checked;
            }
        });
        $scope.gridApi.grid.refresh();
    };

    $rootScope.SalesReportCIByItemsReportGridCtrl_Mode = () => {
        return $scope.mode;
    }

    $scope.mode = 'Y';
    $scope.$watch('mode', (v) => {
        if ($scope.dateFrom) {
            $rootScope.SalesReportCIByItemsReportGridCtrl_SetColumn();
        }
    }, true);

});