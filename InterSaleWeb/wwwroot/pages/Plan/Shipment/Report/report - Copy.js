'use strict';
app.controller("shipmentCompareReportController", function ($rootScope, $scope, $location, $filter, $timeout, common, intersales) {

    $scope.IP_DB = $rootScope.IP_DB;

    // set datePlan
    if ($location.search().date) {
        $scope.planDate = $location.search().date;
    } else {
        var d = new Date();
        var m = /*d.getDate() > 15 ? d.getMonth() + 2 :*/ d.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        $scope.planDate = m + '/' + d.getFullYear();
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

    // set compare
    var tmpCompareList = [{ id: 'N', view: 'None' }, { id: 'M', view: 'Monthly Plan' }, { id: 'W', view: 'Weekly Plan' }, { id: 'A', view: 'Actual' }];
    $scope.compare = {};
    $scope.compare.list = tmpCompareList;
    $scope.compare.view = 'None';
    $scope.compare.SetID = function (id) {
        $scope.compare.id = id;
    }

    // set reportType
    $scope.reportType = {};
    $scope.reportType.list = [{ id: 'M', view: 'Monthly Plan' }, { id: 'W', view: 'Weekly Plan' }, { id: 'A', view: 'Actual' }];
    $scope.reportType.view = 'Monthly Plan';
    $scope.reportType.SetID = function (id) {
        $scope.reportType.id = id;
        $scope.compare.list = $filter('filter')(tmpCompareList, function (value, index, array) {
            return (value.id !== id && id !== '');
        }, true);
        if ($scope.compare.list.length) { $scope.compare.view = 'None'; }
        else { $scope.compare.view = '' }
    }
    if ($location.search().type) {
        $scope.reportType.view = $location.search().type;
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
    }
    var empID = parseInt($rootScope.username.split(' ')[0]);

    KSSClient.API.Employee.SearchSale({
        data: { search: '', status: 'A' },
        callback: function (res) {
            var tmp = []
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

    $scope.btnExport = false;

    $scope.GenData = (data) => {
        $scope.weekPlan = intersales.GetWeekPlan($scope.planMonth, $scope.planYear);
        data.forEach((row, i) => {
            row.customer = row.customers.map(x => x.code + ' : ' + x.description).join(", ");
            row.country = KSSClient.Engine.Common.ArrayToStringComma(row.countrys, 'code');
            row.port = row.ports.map(x => x.code + ' : ' + x.description).join(", ");
            row.ciCodes = row.ciCodes.join(", ");
            row.piCodes = KSSClient.Engine.Common.ArrayToStringComma(row.piCodes);
            row.paymentTerms = KSSClient.Engine.Common.ArrayToStringComma(row.paymentTerms);
            row.planDate_view = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.planDate));
            row.planDate_export = KSSClient.Engine.Common.GetDateView2(KSSClient.Engine.Common.CreateDateTime(row.planDate));
            row.lastAdmitDate_view = KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(row.lastAdmitDate));
            row.lastAdmitDate_export = KSSClient.Engine.Common.GetDateView2(KSSClient.Engine.Common.CreateDateTime(row.lastAdmitDate));
            row.remark_view = common.GetCodeDescription(row.remark);

            if (row.status === 'P' || row.status === 'R') {
                row.noTotal = true;
            }

            $scope.weekPlan.forEach((w) => {
                if (w.weekNo === row.planWeek && w.month === $scope.planMonth) {
                    var tmpDate = w.startDate.getDate();
                    tmpDate = (tmpDate < 10 ? '0' + tmpDate : tmpDate);
                    row.planWeek_view = 'W' + w.weekNo + ' : ' + tmpDate + ' - ' + KSSClient.Engine.Common.GetDateView(w.endDate);
                    row.planWeek_vieworg = row.planWeek_view;
                    row.planWeek = 'W' + w.weekNo;
                    return;
                }
            });
            $scope.btnExport = true;
        });
    };

    $scope.LoadData = function () {
        $scope.shipmentOrgData = [];
        $scope.shipmentCompareData = [];
        $scope.btnExport = false;
        var zoneAccountIDs = [];
        if ($scope.zones) {
            $scope.zones.forEach(function (v) {
                zoneAccountIDs.push(v.id);
            });
        }
        var regionalZoneIDs = [];
        if ($scope.regzone) {
            $scope.regzone.forEach(function (v) {
                regionalZoneIDs.push(v.id);
            });
        }

        var weeks = [];
        if ($scope.weeks) {
            $scope.weeks.forEach(function (v) {
                weeks.push(v.id);
            });
        }

        KSSClient.API.ShipmentPlan.GetCompareReport({
            data: {
                planType: $scope.reportType.id
                , planTypeCompare: $scope.compare.id
                , planMonth: $scope.planMonth
                , planYear: $scope.planYear
                , saleEmployeeID: $scope.emp.id
                , zoneAccountIDs: zoneAccountIDs
                , regionalZoneIDs: regionalZoneIDs
                , weeks: weeks
            },
            callback: function (res) {
                $scope.GenData(res.data.shipmentOrg.planHs);
                var length = res.data.shipmentOrg.planHs.length * 5;
                for (var i = 0; i < length; i++) { res.data.shipmentOrg.planHs.push({ totalRow: true }); }
                $rootScope.shipmentCompareReport1Ctrl_SetData(res.data.shipmentOrg.planHs);

                if ($scope.compare.id != 'N') {
                    if (!res.data.shipmentCompare.planHs) return;
                    $scope.GenData(res.data.shipmentCompare.planHs);
                    length = res.data.shipmentCompare.planHs.length * 5;
                    for (var i = 0; i < length; i++) { res.data.shipmentCompare.planHs.push({ totalRow: true }); }
                    $rootScope.shipmentCompareReport2Ctrl_SetData(res.data.shipmentCompare.planHs);
                }
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    };

    $scope.ExportExcel = function () {

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

        // success 
        format.success = { textCenter: GenFormatText(successFill), textLeft: GenFormatText(successFill, 'left'), int: GenFormatNumber(successFill, '#,##0'), decimal: GenFormatNumber(successFill) };
        format.primary = { textCenter: GenFormatText(primaryFill), textLeft: GenFormatText(primaryFill, 'left'), int: GenFormatNumber(primaryFill, '#,##0'), decimal: GenFormatNumber(primaryFill) };
        format.danger = { textCenter: GenFormatText(dangerFill), textLeft: GenFormatText(dangerFill, 'left'), int: GenFormatNumber(dangerFill, '#,##0'), decimal: GenFormatNumber(dangerFill) };
        format.warning = { textCenter: GenFormatText(warningFill), textLeft: GenFormatText(warningFill, 'left'), int: GenFormatNumber(warningFill, '#,##0'), decimal: GenFormatNumber(warningFill) };
        format.pink = { textCenter: GenFormatText(pinkFill), textLeft: GenFormatText(pinkFill, 'left'), int: GenFormatNumber(pinkFill, '#,##0'), decimal: GenFormatNumber(pinkFill) };
        format.gray = { textCenter: GenFormatText(grayFill), textLeft: GenFormatText(grayFill, 'left'), int: GenFormatNumber(grayFill, '#,##0'), decimal: GenFormatNumber(grayFill) };
        format.else = { textCenter: GenFormatText(''), textLeft: GenFormatText('', 'left'), int: GenFormatNumber('', '#,##0'), decimal: GenFormatNumber('') };
        format.total = { textCenter: GenFormatText(totalFill, '', rowFontTotal), textLeft: GenFormatText(totalFill, 'left', rowFontTotal), int: GenFormatNumber(totalFill, '#,##0', rowFontTotal), decimal: GenFormatNumber(totalFill, '#,##0.00', rowFontTotal) };

        var data = [];

        var compareShow = false;

        var dataReport = $rootScope.shipmentCompareReport1Ctrl_GetVisibleData();
        var dataCompare = [];
        if ($scope.compare.id != null && $scope.compare.id != 'N') {
            compareShow = true;
            dataCompare = $rootScope.shipmentCompareReport2Ctrl_GetVisibleData();
        }

        var zone = KSSClient.Engine.Common.ArrayToStringComma($scope.zones, 'text');

        // name Report 
        data.push([{ value: 'Shipment Plan Report', metadata: { style: reportNamme, type: 'string' } }]);


        // title header
        data.push([{ value: 'Plan Type : ', metadata: { style: titleFormat, type: 'string' } }, { value: $scope.reportType.view, metadata: { style: valueFormat, type: 'string' } }, { value: null }
            , { value: 'Compare : ', metadata: { style: titleFormat, type: 'string' } }, { value: $scope.compare.view, metadata: { style: valueFormat, type: 'string' } }
            , { value: 'Sales Representative : ', metadata: { style: titleFormat, type: 'string' } }, { value: null }, { value: $scope.emp.view, metadata: { style: valueFormat, type: 'string' } }
        ]);
        data.push([{ value: 'Month Plan : ', metadata: { style: titleFormat, type: 'string' } }, { value: $scope.planDate, metadata: { style: valueFormat, type: 'string' } }, { value: null }
            , { value: 'Zones : ', metadata: { style: titleFormat, type: 'string' } }, { value: zone, metadata: { style: valueFormat, type: 'string' } }
        ]);

        worksheet.mergeCells('B2', 'C2');
        worksheet.mergeCells('F2', 'G2');
        worksheet.mergeCells('H2', 'M2');
        worksheet.mergeCells('B3', 'C3');
        worksheet.mergeCells('E3', 'G3');
        worksheet.setRowInstructions(1, { height: 25.5 });
        worksheet.setRowInstructions(2, { height: 25.5 });

        var GenHeadTable = () => {
            var data = [{ value: 'WEEK', metadata: { style: headFormat, type: 'string' } }
                , { value: 'No.', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Customer', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Port/ Country', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Order Number (PI/CI)', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Stock Date', metadata: { style: headFormat, type: 'string' } }
                , { value: 'ETD (KKF)', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Payment Terms', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Transport', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Quantity', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Weight(KG)', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Bales', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Values', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Value(THB)', metadata: { style: headFormat, type: 'string' } }
                , { value: 'Remark', metadata: { style: headFormat, type: 'string' } }];
            return data;
        }

        var GenHeadWidth = () => {
            var width = [{ width: 18 }
                , { width: 4 }
                , { width: 45 }
                , { width: 35 }
                , { width: 16.88 }
                , { width: 17 }
                , { width: 14 }
                , { width: 14 } // Payment Term
                , { width: 10.13 }
                , { width: 10.13 }
                , { width: 10.13 }
                , { width: 10.13 }
                , { width: 20, hidden: $scope.hideValue }
                , { width: 15, hidden: $scope.hideValue }
                , { width: 35, hidden: $scope.hideValue } // remark
            ];
            return width;
        }

        var rowIndex = [];

        var GenMerge = (data) => {
            var ww = '';
            data.forEach((row, i) => {
                if (!angular.isUndefined(row.grouping2) && angular.isUndefined(row.totalRow)) {
                    if (row.grouping2 === ww) {
                        rowIndex[rowIndex.length - 1].end = i;
                    } else { ww = row.grouping2; rowIndex.push({ start: i, end: i }); }
                }
            });
        }

        var SetData = (data) => {
            var chkSum = true;
            var q = 0, w = 0, b = 0, v = [], vv = '', vt = 0;
            var tmpData = [];
            data.forEach((row, i) => {
                var status = 'else';

                if (row.totalRow) {
                    status = 'total';
                    chkSum = false;
                } else {
                    switch (row.status) {
                        case 'S': status = 'success'; break;
                        case 'R': status = 'danger'; break;
                        case 'M': status = 'warning'; break;
                        case 'N': status = 'primary'; break;
                        case 'C': status = 'pink'; break;
                        case 'P': status = 'gray'; break;
                    }
                }

                var tv = '';
                if (row.planBalance) {
                    if (chkSum && !row.noTotal) {
                        q += row.planBalance.quantity;
                        w += row.planBalance.weight;
                        b += row.planBalance.bale;
                        vt += row.planBalance.valueTHB;
                        var zChk = true;
                        row.planBalance.values.forEach(function (d) {
                            for (var z = 0; z < v.length; z++) {
                                if (v[z].code === d.code) {
                                    v[z].num += d.num;
                                    zChk = false;
                                    break;
                                }
                            }
                            if (zChk) { v.push(angular.copy(d)); }
                        });
                    }
                    tv = row.planBalance.values.map(x => x.code + ' ' + $filter('number')(x.num, 2)).join(' , ');
                } 
                tmpData.push([
                    { value: common.GetObjVal('planWeek_view', row), metadata: { style: chkSum ? weekFormat : format.total.textLeft, type: 'string' } }
                    , { value: common.GetObjVal('no', row), metadata: { style: format[status].textCenter, type: 'number' } }
                    , { value: common.GetObjVal('customer', row), metadata: { style: format[status].textLeft, type: 'string' } }
                    , { value: common.GetObjVal('port', row), metadata: { style: format[status].textLeft, type: 'string' } }
                    , { value: common.GetObjVal('ciCodes', row), metadata: { style: format[status].textCenter, type: 'string' } }
                    , { value: common.GetObjVal('lastAdmitDate_export', row), metadata: { style: format[status].textCenter, type: 'string' } }
                    , { value: common.GetObjVal('planDate_export', row), metadata: { style: format[status].textCenter, type: 'string' } }
                    , { value: common.GetObjVal('paymentTerms', row), metadata: { style: format[status].textCenter, type: 'string' } }
                    , { value: common.GetObjVal('containerCode', row), metadata: { style: format[status].textCenter, type: 'string' } }
                    , { value: common.GetObjVal('planBalance.quantity', row), metadata: { style: format[status].int, type: 'number' } }
                    , { value: common.GetObjVal('planBalance.weight', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('planBalance.bale', row), metadata: { style: format[status].int, type: 'number' } }
                    , { value: tv, metadata: { style: format[status].decimal, type: 'string' } }
                    , { value: common.GetObjVal('planBalance.valueTHB', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('remark_view', row), metadata: { style: format[status].textLeft, type: 'string' } }
                ]);
                chkSum = true;
            });
            vv = v.map(x => x.code + ' ' + $filter('number')(x.num, 2)).join(' , ');
            tmpData.push([
                { value: null, metadata: { style: format.total.textCenter, type: 'string' } }
                , { value: null, metadata: { style: format.total.textCenter, type: 'string' } }
                , { value: 'Grand Total', metadata: { style: format.total.textCenter, type: 'string' } }
                , { value: null, metadata: { style: format.total.textCenter, type: 'string' } }
                , { value: null, metadata: { style: format.total.textCenter, type: 'string' } }
                , { value: null, metadata: { style: format.total.textCenter, type: 'string' } }
                , { value: null, metadata: { style: format.total.textCenter, type: 'string' } }
                , { value: null, metadata: { style: format.total.textCenter, type: 'string' } }
                , { value: null, metadata: { style: format.total.textCenter, type: 'string' } }
                , { value: q, metadata: { style: format.total.int, type: 'number' } }
                , { value: w, metadata: { style: format.total.decimal, type: 'number' } }
                , { value: b, metadata: { style: format.total.int, type: 'number' } }
                , { value: vv, metadata: { style: format.total.decimal, type: 'string' } }
                , { value: vt, metadata: { style: format.total.decimal, type: 'number' } }
                , { value: null, metadata: { style: format.total.textCenter, type: 'string' } }
            ]);
            return tmpData;
        }

        //////////// set excel

        // pre data 
        var dataEx = [], chk = true;
        if (compareShow) {
            var groupWeek = [], currencyCode = [];
            dataCompare.forEach((d) => {
                if (d.entity.TcurrecyCode) {
                    chk = true;
                    currencyCode.forEach((c) => { if (c === d.entity.TcurrecyCode) { chk = false; return;} });
                    if (chk) { currencyCode.push(d.entity.TcurrecyCode); }
                }
                chk = true;
                groupWeek.forEach((w) => { if (w.view === d.entity.planWeek_vieworg) { chk = false; return; } });
                if (chk && d.entity.planWeek_vieworg) groupWeek.push({ view: d.entity.planWeek_vieworg, group: d.entity.grouping2, compare: [], org: [] });
            });

            dataReport.forEach((d) => {
                if (d.entity.TcurrecyCode) {
                    chk = true;
                    currencyCode.forEach((c) => { if (c === d.entity.TcurrecyCode) { chk = false; return; } });
                    if (chk) { currencyCode.push(d.entity.TcurrecyCode); }
                }
                chk = true;
                groupWeek.forEach((w) => { if (w.view === d.entity.planWeek_vieworg) { chk = false; return; } });
                if (chk && d.entity.planWeek_vieworg) groupWeek.push({ view: d.entity.planWeek_vieworg, group: d.entity.grouping2, compare: [], org: []  });
            });

            groupWeek.forEach((g) => {
                dataCompare.forEach((d) => { if (g.group === d.entity.grouping2) { g.compare.push(angular.copy(d.entity)); } });
                dataReport.forEach((d) => { if (g.group === d.entity.grouping2) { g.org.push(angular.copy(d.entity)); } });
            });

            groupWeek = $filter('orderBy')(groupWeek, 'groupping2');

            var GenData = (data1, data2) => {
                var tmp = [], totalRowTmp = {};
                data1.forEach((d1) => {
                    var obj = {}, index = -1;
                    data2.forEach((d2, i) => { if (d1.refID === d2.refID || (d1.totalRow && d2.totalRow)) { index = i; obj = d2; return; } });
                    if (index != -1) data2.splice(index, 1);
                    d1.planWeek_view = null;
                    obj.planWeek_view = null;
                    if (d1.totalRow) { totalRowTmp = { data1: d1, data2: obj }}
                    else { tmp.push({ data1: d1, data2: obj }); }
                });
                if (data2.length) {
                    data2.forEach((d2) => {
                        if (!d2.totalRow) {
                            d2.planWeek_view = null;
                            tmp.push({ data1: { planWeek_view: null }, data2: d2 });
                        }
                    });
                }
                tmp.push(totalRowTmp);

                return tmp;
            }

            groupWeek.forEach((g) => {
                var tmp = {};
                if (g.org.length >= g.compare.length) { tmp = GenData(g.org, g.compare); g.org = tmp.map(x => x.data1); g.compare = tmp.map(x => x.data2); }
                else { tmp = GenData(g.compare, g.org); g.compare = tmp.map(x => x.data1); g.org = tmp.map(x => x.data2); }
                g.org[0].planWeek_view = g.view;
                g.compare[0].planWeek_view = g.view;
                for (var i = 0; i < g.org.length; i++) { g.org[i].grouping2 = g.group; g.compare[i].grouping2 = g.group; dataEx.push({ org: g.org[i], compare: g.compare[i] }); }
            });

            if (currencyCode.length) {
                dataEx.push({ org: { totalRow: true }, compare: { totalRow: true } });
                currencyCode.forEach((c) => {
                    var compare = $filter('filter')(dataCompare.map(x => x.entity), { TcurrecyCode: c }, true);
                    var org = $filter('filter')(dataReport.map(x => x.entity), { TcurrecyCode: c }, true);
                    dataEx.push({ org: angular.isUndefined(org[org.length - 1]) ? { totalRow: true } : org[org.length - 1], compare: angular.isUndefined(compare[compare.length - 1]) ? { totalRow: true } : compare[compare.length - 1] });
                });
            }
        } else {
            dataReport.forEach((r) => {
                dataEx.push({ org: r.entity, compare: undefined });
            });
        }

        var startRow = 3;
        worksheet.setRowInstructions(startRow++, { height: 45 });

        GenMerge(dataEx.map(x => x.org));
        rowIndex.forEach((r) => {
            worksheet.mergeCells('A' + (startRow + r.start + 1), 'A' + (startRow + r.end + 1));
            if (compareShow) { worksheet.mergeCells('Q' + (startRow + r.start + 1), 'Q' + (startRow + r.end + 1)); }
        });

        var headTable = GenHeadTable();
        var headWidth = GenHeadWidth();
        var tmpData = [];
        var dataOrg = SetData(dataEx.map(x => x.org));        
        if (compareShow) {
            headTable = headTable.concat([{ value: null, metadata: { style: null, type: 'string' } }]);
            headWidth = headWidth.concat([{ width: 5 }]);

            headTable = headTable.concat(GenHeadTable());
            headWidth = headWidth.concat(GenHeadWidth());

            var dataCom = SetData(dataEx.map(x => x.compare));
            dataOrg.forEach((o, i) => {
                var tmp = o.concat([{ value: null, metadata: { style: null, type: 'string' } }]);
                tmp = tmp.concat(dataCom[i]);
                tmpData.push(tmp);
            });
            
        } else { tmpData = dataOrg; }

        //// set column
        data.push(headTable);
        worksheet.setColumns(headWidth);

        // set data
        data = data.concat(tmpData);
        
        //worksheet.mergeCells('B' + (data.length), 'I' + (data.length));
        //if (compareShow) { worksheet.mergeCells('R' + (data.length), 'Y' + (data.length)); }
        
        worksheet.sheetView.showGridLines = false;
        worksheet.setData(data);
        common.ExportExcel(workbook, 'Shipment Plan Report');
    }

});

app.controller("shipmentCompareReport1Ctrl", function ($rootScope, $scope, $filter, common) {

    var SetClass = function (grid, row) {
        if (row.entity.totalRow) {
            return 'bg-info font-bold';
        }
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true, showTotalGrouping2: true, showTotalCurrency: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planWeek', display: 'Week', width: { min: 130 }, setclass: SetClass, sort: false, filter: false , format: { type: 'customText' }, grouping2: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'no', display: 'No.', width: { min: 55, max: 55 }, format: { type: 'text', align: 'center' }, setclass: SetClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer', display: 'Customer', width: { min: 300 }, format: { type: 'text', showTotal: true }, setclass: SetClass, sort: false, filter: false   }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port', display: 'Port/ Country', width: { min: 200 }, setclass: SetClass, sort: false, filter: false  }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'country', display: 'Country', width: { min: 100 }, setclass: SetClass, sort: false, filter: false , sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'ciCodes', display: 'Order Number (PI/CI)', width: { min: 170 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastAdmitDate_view', display: 'Stock Date', width: { min: 115 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planDate_view', display: 'ETD (KKF)', width: { min: 115 }, setclass: SetClass, sort: false, filter: false , multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerms', display: 'Payment Terms', width: { min: 115 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Transport', width: { min: 90 }, setclass: SetClass, sort: false, filter: false  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, sort: false, filter: false  /*, group: { name: 'planningAmount', display: 'Planning Amount', langCode: '' }*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, sort: false, filter: false  /*, group: { name: 'planningAmount', display: 'Planning Amount', langCode: '' }*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, sort: false, filter: false  /*, group: { name: 'planningAmount', display: 'Planning Amount', langCode: '' }*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, sort: false, filter: false  /*, group: { name: 'planningAmount', display: 'Planning Amount', langCode: '' }*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, sort: false, filter: false  /*, group: { name: 'planningAmount', display: 'Planning Amount', langCode: '' }*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark_view', display: 'Remark', width: { min: 250 }, setclass: SetClass, sort: false, filter: false }));

    $scope.cumulative = function (grid, row, col) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (col.field === 'planWeek') {
                if (col.colDef.grouping2) { return row.entity.planWeek_view; }
                else { return row.entity.planWeek; }
            }
        }
        return false;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_compare01');
    };

    $rootScope.shipmentCompareReport1Ctrl_GetVisibleData = () => { return $scope.gridApi.grid.renderContainers.body.visibleRowCache; }
    
    $rootScope.shipmentCompareReport1Ctrl_SetData = function (data) {
        $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
    };

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

app.controller("shipmentCompareReport2Ctrl", function ($rootScope, $scope, $filter, common) {

    var SetClass = function (grid, row) {
        if (row.entity.totalRow) {
            return 'bg-info font-bold';
        }

        if (row.entity.status === 'S') {
            return 'text-success';
        } else if (row.entity.status === 'R') {
            return 'text-danger';
        } else if (row.entity.status === 'M') {
            return 'text-warning';
        } else if (row.entity.status === 'N') {
            return 'text-primary';
        } else if (row.entity.status === 'C') {
            return 'text-pink';
        }
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true, showTotalGrouping2: true, showTotalCurrency: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planWeek', display: 'Week', width: { min: 130 }, setclass: SetClass, sort: false, filter: false , format: { type: 'customText' }, grouping2: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'no', display: 'No.', width: { min: 55, max: 55 }, format: { type: 'text', align: 'center' }, setclass: SetClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer', display: 'Customer', width: { min: 300 }, format: { type: 'text', showTotal: true }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port', display: 'Port/ Country', width: { min: 200 }, setclass: SetClass, sort: false, filter: false  }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'country', display: 'Country', width: { min: 100 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'ciCodes', display: 'Order Number (PI/CI)', width: { min: 170 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastAdmitDate_view', display: 'Stock Date', width: { min: 115 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planDate_view', display: 'ETD (KKF)', width: { min: 115 }, setclass: SetClass, sort: false, filter: false , multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerms', display: 'Payment Terms', width: { min: 115 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Transport', width: { min: 90 }, setclass: SetClass, sort: false, filter: false  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'planBalance.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark_view', display: 'Remark', width: { min: 250 }, setclass: SetClass, sort: false, filter: false  }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === 'planWeek') {
                if (myCol.colDef.grouping2) { return myRow.entity.planWeek_view; }
                else { return myRow.entity.planWeek; }
            }
        }
        return false
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_compare01');
    };

    $rootScope.shipmentCompareReport2Ctrl_GetVisibleData = () => { return $scope.gridApi.grid.renderContainers.body.visibleRowCache; }
    
    $rootScope.shipmentCompareReport2Ctrl_SetData = function (data) {
        $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
    };

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

