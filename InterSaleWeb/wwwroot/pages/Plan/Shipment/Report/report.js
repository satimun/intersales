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
        $scope.planDate = (m > 12 ? '01' : m) + '/' + (m > 12 ? d.getFullYear() + 1 : d.getFullYear());
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
    };

    // set compare
    var tmpCompareList = [{ id: 'N', view: 'None' }, { id: 'M', view: 'Monthly Plan' }, { id: 'W', view: 'Weekly Plan' }, { id: 'A', view: 'Actual' }];
    $scope.compare = {};
    $scope.compare.list = tmpCompareList;
    $scope.compare.view = 'None';
    $scope.compare.SetID = function (id) {
        $scope.compare.id = id;
    };

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
    };
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

            //$filter('filter')(res.data.employees, function (value, index, array) {
            //    return (value.position.code.trim() !== 'E033' && value.position.code.trim() !== 'G021' && value.position.code.trim() !== 'E011' && value.position.code.trim() !== 'E011');
            //}).forEach(function (v) {
            //    $scope.employeesList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            //    if (parseInt($rootScope.username.split(' ')[0]) === v.id) {
            //        $scope.sales.push($scope.employeesList[$scope.employeesList.length - 1]);
            //    }
            //});

            $scope.emp.list = tmp;
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });

    $scope.btnExport = false;

    $scope.ConvertData1 = (row) => {
        row.customer = row.customers.map(x => x.code + ' : ' + x.description).join(", ");
        row.port = row.ports.map(x => x.code + ' : ' + x.description).join(", ");
        row.ciCodes = row.ciCodes.join(", ");
        row.paymentTerms = row.paymentTerms.join(", ");
        row.date = KSSClient.Engine.Common.CreateDateTime(row.date);
        row.date_export = KSSClient.Engine.Common.GetDateView(row.date);
        row.stockDate = KSSClient.Engine.Common.CreateDateTime(row.stockDate);
        row.stockDate_export = KSSClient.Engine.Common.GetDateView(row.stockDate);
        row.remark_view = common.GetCodeDescription(row.remark);
        row.remarkGroup.view = row.remarkGroup.code_view = row.remarkGroup.code_vieworg = common.GetCodeDescription(row.remarkGroup);
        var month = row.date.getMonth() + 1;
        intersales.GetWeekPlan(month, row.date.getFullYear()).forEach((w) => {
            if (w.weekNo === row.week && w.month === month) {
                var tmpDate = w.startDate.getDate();
                tmpDate = (tmpDate < 10 ? '0' + tmpDate : tmpDate);
                row.week_vieworg = row.week_view = 'W' + w.weekNo + ' : ' + tmpDate + ' - ' + KSSClient.Engine.Common.GetDateView(w.endDate);
                row.week = 'W' + w.weekNo + ' - ' + month;
                return;
            }
        });
        $scope.btnExport = true;
        return row;
    };

    $scope.GenData1 = (data) => {
        var plan = [], actual = [];
        data.forEach((d, i) => {
            if (d.status === 'S' || d.status === 'R' || d.status === 'P' || d.status === null || (d.status === 'C' && d.plan !== null && d.plan.status !== 'P')) {
                plan.push($scope.ConvertData1(d.plan));
            }
            if (d.status !== null && $scope.compare.id !== 'N' && $scope.compare.id) {
                actual.push($scope.ConvertData1(d.actual));
            }
        });
        $rootScope.shipmentCompareReport1Ctrl_SetData($filter('orderBy')(plan, 'date'));
        $rootScope.shipmentCompareReport2Ctrl_SetData(actual);

    };

    $scope.LoadData = function () {
        //$scope.shipmentOrgData = [];
        //$scope.shipmentCompareData = [];

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

        KSSClient.API.ShipmentPlan.GetReport2({
            data: {
                type: $scope.reportType.id
                , compare: $scope.compare.id
                , year: $scope.planYear
                , monthFrom: $scope.planMonth
                , monthTo: $scope.planMonth
                , saleEmployeeIDs: $scope.emp.id
                , zoneAccountIDs: zoneAccountIDs
                , regionalZoneIDs: regionalZoneIDs
                , weeks: weeks
                , option: 1
            },
            callback: (res) => {
                $scope.btnExport = res.data.reports.length > 0;
                $scope.data = res.data.reports;
                $scope.GenData1(angular.copy($scope.data));
                //$scope.TabChange($scope.seltab);
                $scope.dataH = { type: $scope.reportType.view, compare: $scope.compare.view, month: $scope.planMonth, year: $scope.planYear };
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };


    $scope.SumTotal = (d, total) => {
        total.balance.quantity += d.balance.quantity;
        total.balance.weight += d.balance.weight;
        total.balance.bale += d.balance.bale;
        total.balance.valueTHB += d.balance.valueTHB;

        d.balance.values.forEach((x) => {
            var chkc = true;
            total.balance.values.forEach((c) => {
                if (c.code === x.code) { c.num += x.num; chkc = false; return; }
            });
            if (chkc) total.balance.values.push(angular.copy(x));
        });
    };

    $scope.GenExcel1 = (workbook, format) => {
        var worksheet = new ExcelBuilder.Worksheet({ name: $scope.dataH.month + '_' + $scope.dataH.year });
        workbook.addWorksheet(worksheet);
        var data = [];
        // name Report 
        var title = $scope.dataH.type;
        if ($scope.compare.id !== 'N' && $scope.compare.id) {
            title = $scope.dataH.type + ' Vs ' + $scope.dataH.compare;
        }
        data.push([{ value: 'Shipment Plan Report : ' + title + ' ( ' + $scope.dataH.month + ' / ' + $scope.dataH.year + ' )', metadata: { style: format.report, type: 'string' } }]);

        worksheet.setRowInstructions(1, { height: 45 });
        var GenHeadTable = () => {
            var dataH = [{ value: 'WEEK', metadata: { style: format.head, type: 'string' } }
                , { value: 'No.', metadata: { style: format.head, type: 'string' } }
                , { value: 'Customer', metadata: { style: format.head, type: 'string' } }
                , { value: 'Port/ Country', metadata: { style: format.head, type: 'string' } }
                , { value: 'Order Number (PI/CI)', metadata: { style: format.head, type: 'string' } }
                , { value: 'Stock Date', metadata: { style: format.head, type: 'string' } }
                , { value: 'ETD (KKF)', metadata: { style: format.head, type: 'string' } }
                , { value: 'Payment Terms', metadata: { style: format.head, type: 'string' } }
                , { value: 'Transport', metadata: { style: format.head, type: 'string' } }
                , { value: 'Quantity', metadata: { style: format.head, type: 'string' } }
                , { value: 'Weight (kg)', metadata: { style: format.head, type: 'string' } }
                , { value: 'Bales', metadata: { style: format.head, type: 'string' } }
                , { value: 'Values', metadata: { style: format.head, type: 'string' } }
                , { value: 'Value(THB)', metadata: { style: format.head, type: 'string' } }
                , { value: 'Remark', metadata: { style: format.head, type: 'string' } }];
            return dataH;
        };

        var GenHeadWidth = () => {
            var width = [{ width: 18 }, { width: 4 }, { width: 45 }, { width: 35 }, { width: 16.88 }, { width: 17 }, { width: 14 }, { width: 14 }, { width: 10.13 }, { width: 10.13 }, { width: 10.13 }, { width: 10.13 }, { width: 20, hidden: $scope.hideValue }, { width: 15, hidden: $scope.hideValue }, { width: 35, hidden: $scope.hideValue }];
            return width;
        };

        var rowIndex = [];
        var GenMerge = (data) => {
            var ww = '';
            data.forEach((row, i) => {
                if (!angular.isUndefined(row.week) && angular.isUndefined(row.totalRow)) {
                    if (row.week === ww) {
                        rowIndex[rowIndex.length - 1].end = i;
                    } else { ww = row.week; rowIndex.push({ start: i, end: i }); }
                }
            });
        };

        var SetData = (data) => {
            var tmpData = [];
            data.forEach((row, i) => {
                var tv = '';
                var status = 'else';
                if (row.totalRow) {
                    status = 'total';
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
                if (row.balance) { tv = row.balance.values.map(x => x.code + ' ' + $filter('number')(x.num, 2)).join(' , '); }
                tmpData.push([
                    { value: common.GetObjVal('week_view', row), metadata: { style: !row.totalRow ? format.week : format.total.textLeft, type: 'string' } }
                    , { value: common.GetObjVal('no', row), metadata: { style: format[status].textCenter, type: 'number' } }
                    , { value: common.GetObjVal('customer', row), metadata: { style: format[status].textLeft, type: 'string' } }
                    , { value: common.GetObjVal('port', row), metadata: { style: format[status].textLeft, type: 'string' } }
                    , { value: common.GetObjVal('ciCodes', row), metadata: { style: format[status].textCenter, type: 'string' } }
                    , { value: common.GetObjVal('stockDate_export', row), metadata: { style: format[status].textCenter, type: 'string' } }
                    , { value: common.GetObjVal('date_export', row), metadata: { style: format[status].textCenter, type: 'string' } }
                    , { value: common.GetObjVal('paymentTerms', row), metadata: { style: format[status].textCenter, type: 'string' } }
                    , { value: common.GetObjVal('containerCode', row), metadata: { style: format[status].textCenter, type: 'string' } }
                    , { value: common.GetObjVal('balance.quantity', row), metadata: { style: format[status].int, type: 'number' } }
                    , { value: common.GetObjVal('balance.weight', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('balance.bale', row), metadata: { style: format[status].int, type: 'number' } }
                    , { value: tv, metadata: { style: format[status].decimal, type: 'string' } }
                    , { value: common.GetObjVal('balance.valueTHB', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: common.GetObjVal('remark_view', row), metadata: { style: format[status].textLeft, type: 'string' } }
                ]);
            });
            return tmpData;
        };

        //conver data
        var weeks = [];
        $scope.data.forEach((d) => {
            var chk = true;
            var month = KSSClient.Engine.Common.CreateDateTime(d.date).getMonth() + 1;
            weeks.forEach((w) => {
                if (w.week === d.week + ' - ' + month) { chk = false; return; }
            });
            if (chk) {
                weeks.push({
                    week: d.week + ' - ' + month, data: [], total: {
                        plan: { totalRow: true, balance: { quantity: 0, weight: 0, bale: 0, values: [], valueTHB: 0 } }
                        , actual: { totalRow: true, balance: { quantity: 0, weight: 0, bale: 0, values: [], valueTHB: 0 } }
                    }
                });
            }
        });

        var total = { plan: { balance: { quantity: 0, weight: 0, bale: 0, values: [], valueTHB: 0 }, totalRow: true }, actual: { balance: { quantity: 0, weight: 0, bale: 0, values: [], valueTHB: 0 }, totalRow: true } };
        angular.copy($scope.data).forEach((d) => {
            var plan = null, actual = null;
            if (d.status === 'S' || d.status === 'R' || d.status === 'P' || d.status === null || (d.status === 'C' && d.plan !== null && d.plan.status !== 'P')) {
                d.plan.status = '';
                plan = $scope.ConvertData1(d.plan);
                $scope.SumTotal(d.plan, total.plan);
            }
            if (d.actual && d.status !== null && $scope.compare.id !== 'N' && $scope.compare.id) {
                actual = $scope.ConvertData1(d.actual);
                if (d.status !== 'P' && d.status !== 'R') {
                    $scope.SumTotal(d.actual, total.actual);
                }
            }
            var month = KSSClient.Engine.Common.CreateDateTime(d.date).getMonth() + 1;
            weeks.forEach((w) => {
                if (w.week === d.week + ' - ' + month) {
                    if (plan) $scope.SumTotal(plan, w.total.plan);
                    if (actual && d.status !== 'P' && d.status !== 'R') $scope.SumTotal(actual, w.total.actual);
                    w.data.push({ plan: plan, actual: actual });
                    return;
                }
            });
        });

        var totalCurrency = [];
        total.plan.balance.values.forEach((x) => {
            totalCurrency.push({
                plan: { customer: 'Total Currency ' + x.code, balance: { values: [x] }, totalRow: true }
                , actual: { customer: 'Total Currency ' + x.code, balance: { values: [] }, totalRow: true }
            });
        });

        total.actual.balance.values.forEach((x) => {
            var chkc = true;
            totalCurrency.forEach((d) => {
                if (common.GetObjVal('code', d.plan.balance.values[0]) === x.code) {
                    d.actual.balance.values = [x];
                    chkc = false; return;
                }
            });
            if (chkc) {
                totalCurrency.push({
                    plan: { customer: 'Total Currency ' + x.code, balance: { values: [] }, totalRow: true }
                    , actual: { customer: 'Total Currency ' + x.code, balance: { values: [x] }, totalRow: true }
                });
            }
        });

        // set data
        var plan = [], actual = [], totalP = 0, totalA = 0;
        weeks.forEach((w) => {
            var numP = 0, numA = 0;
            w.data.forEach((d, i) => {
                if (d.plan) { numP++; d.plan.no = numP; }
                if (d.actual) { numA++; d.actual.no = numA; }
                if (!d.plan) d.plan = {};
                if (!d.actual) d.actual = {};
                if (!i) {
                    var detail = d.plan.week_view ? d.plan.week_view : d.actual.week_view;
                    common.SetObjVal('week_view', detail, d.actual);
                    common.SetObjVal('week_view', detail, d.plan);
                } else {
                    common.SetObjVal('week_view', null, d.actual);
                    common.SetObjVal('week_view', null, d.plan);
                }
                common.SetObjVal('week', w.week, d.actual);
                common.SetObjVal('week', w.week, d.plan);
                plan.push(d.plan);
                actual.push(d.actual);
            });
            w.total.plan.customer = 'Total Group : ' + 'W' + w.week + ' : ' + numP + ' items';
            w.total.actual.customer = 'Total Group : ' + 'W' + w.week + ' : ' + numA + ' items';
            plan.push(w.total.plan);
            actual.push(w.total.actual);
            totalP += numP; totalA += numA;
        });
        plan.push({ totalRow: true }); actual.push({ totalRow: true });
        totalCurrency.forEach((c) => { plan.push(c.plan); actual.push(c.actual); });
        plan.push({ totalRow: true }); actual.push({ totalRow: true });
        total.plan.customer = 'Grand Total : ' + totalP + ' Items';
        total.actual.customer = 'Grand Total : ' + totalA + ' Items';
        plan.push(total.plan);
        actual.push(total.actual);

        // set head
        var headTable = GenHeadTable();
        var headWidth = GenHeadWidth();
        var tmpData = [];
        headTable = headTable.concat([{ value: null, metadata: { style: null, type: 'string' } }]);
        headWidth = headWidth.concat([{ width: 5 }]);

        if ($scope.compare.id !== 'N' && $scope.compare.id) {
            headTable = headTable.concat(GenHeadTable());
            headWidth = headWidth.concat(GenHeadWidth());
        }
        
        // get data excel
        var dataOrg = SetData(plan);
        var dataCom = SetData(actual);
        dataOrg.forEach((o, i) => {
            var tmp = o.concat([{ value: null, metadata: { style: null, type: 'string' } }]);
            if ($scope.compare.id !== 'N' && $scope.compare.id) tmp = tmp.concat(dataCom[i]);
            tmpData.push(tmp);
        });

        var startRow = 2;
        GenMerge(plan);
        rowIndex.forEach((r) => {
            worksheet.mergeCells('A' + (startRow + r.start + 1), 'A' + (startRow + r.end + 1));
            if ($scope.compare.id !== 'N' && $scope.compare.id) worksheet.mergeCells('Q' + (startRow + r.start + 1), 'Q' + (startRow + r.end + 1));
        });

        //// set column
        data.push(headTable);
        worksheet.setColumns(headWidth);

        // set data
        data = data.concat(tmpData);
        worksheet.sheetView.showGridLines = false;
        worksheet.setData(data);
    };

    $scope.ExportExcel = () => {

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
        $scope.GenExcel1(workbook, format);

        common.ExportExcel(workbook, 'Shipment Plan Report');

    };

});

app.controller("shipmentCompareReport1Ctrl", function ($rootScope, $scope, common) {

    var SetClass = function (grid, row) {
        if (row.entity.totalRow) {
            return 'bg-info font-bold';
        }
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true, showTotalGrouping2: true, showTotalCurrency: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'week', display: 'Week', width: { min: 130 }, setclass: SetClass, sort: false, filter: false , format: { type: 'customText' }, grouping2: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'no', display: 'No.', width: { min: 55, max: 55 }, format: { type: 'text', align: 'center' }, setclass: SetClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer', display: 'Customer', width: { min: 300 }, format: { type: 'text', showTotal: true }, setclass: SetClass, sort: false, filter: false   }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port', display: 'Port/ Country', width: { min: 200 }, setclass: SetClass, sort: false, filter: false  }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'country', display: 'Country', width: { min: 100 }, setclass: SetClass, sort: false, filter: false , sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'ciCodes', display: 'Order Number (PI/CI)', width: { min: 170 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stockDate', display: 'Stock Date', width: { min: 115 }, format: { type: 'customText' }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'date', display: 'ETD (KKF)', width: { min: 115 }, format: { type: 'customText' }, setclass: SetClass, sort: false, filter: false , multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerms', display: 'Payment Terms', width: { min: 115 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Transport', width: { min: 90 }, setclass: SetClass, sort: false, filter: false  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, sort: false, filter: false  /*, group: { name: 'planningAmount', display: 'Planning Amount', langCode: '' }*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, sort: false, filter: false  /*, group: { name: 'planningAmount', display: 'Planning Amount', langCode: '' }*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, sort: false, filter: false  /*, group: { name: 'planningAmount', display: 'Planning Amount', langCode: '' }*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, sort: false, filter: false  /*, group: { name: 'planningAmount', display: 'Planning Amount', langCode: '' }*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, sort: false, filter: false  /*, group: { name: 'planningAmount', display: 'Planning Amount', langCode: '' }*/ }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark_view', display: 'Remark', width: { min: 250 }, setclass: SetClass, sort: false, filter: false }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === 'week') {
                if (myCol.colDef.grouping2) { return myRow.entity.week_view; }
                else { return myRow.entity.week; }
            } else if (myCol.field === 'stockDate') {
                if (myRow.entity.stockDate) { return KSSClient.Engine.Common.GetDateView(myRow.entity.stockDate); }
                return '';
            } else if (myCol.field === 'date') {
                if (myRow.entity.date) { return KSSClient.Engine.Common.GetDateView(myRow.entity.date); }
                return '';
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
        var length = data.length * 5;
        for (var i = 0; i < length; i++) { data.push({ totalRow: true }); }
        $scope.gridOpt.data = data;
        console.log($scope.gridOpt.data.filter(x => x.totalRow))
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

app.controller("shipmentCompareReport2Ctrl", function ($rootScope, $scope, common) {

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
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'week', display: 'Week', width: { min: 130 }, setclass: SetClass, sort: false, filter: false , format: { type: 'customText' }, grouping2: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'no', display: 'No.', width: { min: 55, max: 55 }, format: { type: 'text', align: 'center' }, setclass: SetClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer', display: 'Customer', width: { min: 300 }, format: { type: 'text', showTotal: true }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port', display: 'Port/ Country', width: { min: 200 }, setclass: SetClass, sort: false, filter: false  }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'country', display: 'Country', width: { min: 100 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'ciCodes', display: 'Order Number (PI/CI)', width: { min: 170 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stockDate', display: 'Stock Date', width: { min: 115 }, format: { type: 'customText' }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'date', display: 'ETD (KKF)', width: { min: 115 }, format: { type: 'customText' }, setclass: SetClass, sort: false, filter: false , multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerms', display: 'Payment Terms', width: { min: 115 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Transport', width: { min: 90 }, setclass: SetClass, sort: false, filter: false  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass, sort: false, filter: false  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark_view', display: 'Remark', width: { min: 250 }, setclass: SetClass, sort: false, filter: false  }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === 'week') {
                if (myCol.colDef.grouping2) { return myRow.entity.week_view; }
                else { return myRow.entity.week; }
            } else if (myCol.field === 'stockDate') {
                if (myRow.entity.stockDate) { return KSSClient.Engine.Common.GetDateView(myRow.entity.stockDate); }
                return '';
            } else if (myCol.field === 'date') {
                if (myRow.entity.date) { return KSSClient.Engine.Common.GetDateView(myRow.entity.date); }
                return '';
            }
        }
        return false;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_compare01');
    };

    $rootScope.shipmentCompareReport2Ctrl_GetVisibleData = () => { return $scope.gridApi.grid.renderContainers.body.visibleRowCache; }
    
    $rootScope.shipmentCompareReport2Ctrl_SetData = function (data) {
        var length = data.length * 5;
        for (var i = 0; i < length; i++) { data.push({ totalRow: true }); }
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

