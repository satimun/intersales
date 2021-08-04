'use strict';
app.controller("shipmentPlanSummaryReportCtrl", function ($rootScope, $scope, $location, $filter, $timeout, common, intersales) {

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
    $scope.tabList = [{ id: '', code: 'Total', description: 'Total', active: true }]; //regzoneCodes
    KSSClient.API.ShipmentPlan.ListRegionalZone({
        data: {},
        callback: (res) => {
            res.data.regionalZones.forEach(function (v) { $scope.tabList.push({ id: v.id, code: v.code, description: v.description, active: false, view: common.GetCodeDescription(v) }); });
            $scope.tabList.push({ id: 'S', code: 'SUM', description: 'SUM', active: false });
            $scope.tabList.push({ id: 'R', code: 'RED', description: 'RED', active: false });
            $scope.$apply();
        },
        error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $scope.seltab = '';

    $scope.TabChange = function (id) {
        $scope.seltab = id;
        $scope.tabList.forEach((v) => { v.active = v.id === id; });
        if (!$scope.btnExport) return;
        $timeout(() => {
            if (id === 'S') {
                $scope.GenData2(angular.copy($scope.data));
            } else if (id === 'R') {
                $scope.GenData3(angular.copy($scope.data));
            } else {
                $scope.GenData1(angular.copy($scope.data), id);
            }
        }, 1);
    };

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
        return row;
    };

    $scope.GenData1 = (data, regionalZoneID) => {
        var plan = [], actual = [];
        data.forEach((d, i) => {
            if (d.status === 'S' || d.status === 'R' || d.status === 'P' || d.status === null || (d.status === 'C' && d.plan !== null && d.plan.status !== 'P')) {
                if (d.plan.regionalZone.id === regionalZoneID || regionalZoneID === '') { plan.push($scope.ConvertData1(d.plan)); }
            }
            if (d.status !== null) {
                if (d.actual.regionalZone.id === regionalZoneID || regionalZoneID === '') { actual.push($scope.ConvertData1(d.actual)); }
            }
        });
        $rootScope.shipmentSummaryReportGrid1Ctrl_SetData($filter('orderBy')(plan, 'date'));
        $rootScope.shipmentSummaryReportGrid2Ctrl_SetData(actual);
    };

    $scope.GenData2 = (data, getdata) => {
        var tmp = [];
        $scope.tabList.forEach((r) => {
            if (isFinite(r.id) && r.id) {
                tmp.push({
                    regionalZone: r
                    , plan: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
                    , actual: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
                    , percent: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
                });
            }
        });
        data.forEach((d) => {
            tmp.forEach((v) => {
                var regionalZoneID = d.plan ? d.plan.regionalZone.id : d.actual.regionalZone.id;
                if (v.regionalZone.id === regionalZoneID) {
                    if (d.status === 'S' || d.status === 'R' || d.status === 'P' || d.status === null || (d.status === 'C' && d.plan !== null && d.plan.status !== 'P')) {
                        v.plan.items += 1;
                        v.plan.weight += d.plan.balance.weight;
                        v.plan.valueTHB += d.plan.balance.valueTHB;
                        v.plan.bale += d.plan.balance.bale;
                    }
                    if (d.status === 'S') {
                        v.actual.items += 1;
                        v.actual.weight += d.actual.balance.weight;
                        v.actual.valueTHB += d.actual.balance.valueTHB;
                        v.actual.bale += d.actual.balance.bale;
                    }

                    v.percent.items = (v.plan.items === 0 ? NaN : (v.actual.items / v.plan.items) * 100);
                    v.percent.weight = (v.plan.weight === 0 ? NaN : (v.actual.weight / v.plan.weight) * 100);
                    v.percent.valueTHB = (v.plan.valueTHB === 0 ? NaN : (v.actual.valueTHB / v.plan.valueTHB) * 100);
                    v.percent.bale = (v.plan.bale === 0 ? NaN : (v.actual.bale / v.plan.bale) * 100);
                    return;
                }
            });
        });
        if (getdata) { return tmp; }
        else { $rootScope.shipmentSummaryReportGrid3Ctrl_SetData(tmp); }
    }
    
    $scope.GenData3 = (data, getdata) => {
        var data1 = [], data2 = [];
        var chk = true;
        data.forEach((d) => {
            if (d.status === 'R') {
                chk = true;
                data2.push($scope.ConvertData1(d.plan));
                data1.forEach((v) => {
                    if (v.remarkGroup.id === d.plan.remarkGroup.id) {
                        v.items += 1
                        v.weight += d.plan.balance.weight;
                        v.bale += d.plan.balance.bale;
                        v.valueTHB += d.plan.balance.valueTHB;
                        d.plan.balance.values.forEach((x) => {
                            var chkc = true;
                            v.values.forEach((c) => { if (c.code === x.code) { c.num += x.num; chkc = false; return; } });
                            if (chkc) v.values.push(angular.copy(x));
                        });
                        chk = false;
                        return;
                    }
                });
                if (chk) {
                    data1.push({
                        remarkGroup: angular.copy(d.plan.remarkGroup)
                        , items: 1
                        , weight: d.plan.balance.weight
                        , bale: d.plan.balance.bale
                        , values: angular.copy(d.plan.balance.values)
                        , valueTHB: d.plan.balance.valueTHB
                    });
                }
            }
        });

        if (getdata) { return { data1: $filter('orderBy')(data1, 'remarkGroup.code'), data2: $filter('orderBy')(data2, 'remarkGroup.code') }; }
        else {
            $rootScope.shipmentSummaryReportGrid4Ctrl_SetData($filter('orderBy')(data1, 'remarkGroup.code'));
            $rootScope.shipmentSummaryReportGrid5Ctrl_SetData($filter('orderBy')(data2, 'remarkGroup.code'));
        }
    };

    $scope.btnExport = false;

    $scope.LoadData = function () {
        KSSClient.API.ShipmentPlan.GetReport2({
            data: {
                type: 'M'
                , compare: 'A'
                , year: $scope.year
                , monthFrom: $scope.monthFrom.id
                , monthTo: $scope.monthTo.id
                //, regionalZoneIDs: $scope.regionalZonesID
            },
            callback: (res) => {
                $scope.btnExport = res.data.reports.length > 0;
                $scope.data = res.data.reports;
                $scope.TabChange($scope.seltab);
                $scope.dataH = { monthFrom: $scope.monthFrom.view, monthFromID: $scope.monthFrom.id, monthTo: $scope.monthTo.view, monthToID: $scope.monthTo.id, year: $scope.year };
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

    $scope.GenExcel1 = (workbook, format, tabID) => {
        var worksheet = new ExcelBuilder.Worksheet({ name: $scope.tabList.find((v) => { return v.id === tabID; }).description });
        workbook.addWorksheet(worksheet);
        var data = [];
        // name Report 
        data.push([{ value: 'Shipment Plan Summary Report : ' + $scope.tabList.find((v) => { return v.id === tabID; }).description + ' ( ' + $scope.dataH.monthFrom + ' - ' + $scope.dataH.monthTo + ' ' + $scope.dataH.year + ' )', metadata: { style: format.report, type: 'string' } }]);
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
        }

        var GenHeadWidth = () => {
            var width = [{ width: 18 }, { width: 4 }, { width: 45 }, { width: 35 }, { width: 16.88 }, { width: 17 }, { width: 14 }, { width: 14 }, { width: 10.13 }, { width: 10.13 }, { width: 10.13 }, { width: 10.13 }, { width: 20 }, { width: 15 }, { width: 35 }];
            return width;
        }

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
        }

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
        }

        //conver data
        var weeks = [];
        $scope.data.forEach((d) => {
            var regionalZoneID = d.plan ? d.plan.regionalZone.id : d.actual.regionalZone.id;
            if (regionalZoneID === tabID || !tabID) {
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
            }
        });

        var total = { plan: { balance: { quantity: 0, weight: 0, bale: 0, values: [], valueTHB: 0 }, totalRow: true }, actual: { balance: { quantity: 0, weight: 0, bale: 0, values: [], valueTHB: 0 }, totalRow: true } };
        angular.copy($scope.data).forEach((d) => {
            var regionalZoneID = d.plan ? d.plan.regionalZone.id : d.actual.regionalZone.id;
            if (regionalZoneID === tabID || !tabID) {
                var plan = null, actual = null;
                if (d.status === 'S' || d.status === 'R' || d.status === 'P' || d.status === null || (d.status === 'C' && d.plan !== null && d.plan.status !== 'P')) {
                    d.plan.status = '';
                    plan = $scope.ConvertData1(d.plan);
                    $scope.SumTotal(d.plan, total.plan);
                }
                if (d.actual && d.status !== null) {
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
            }
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
                if (d.plan.balance.values[0] && d.plan.balance.values[0].code === x.code) {
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
            w.total.plan.customer = 'Total Group : ' + 'W' +  w.week + ' : ' + numP + ' items';
            w.total.actual.customer = 'Total Group : ' + 'W' + w.week + ' : ' + numA + ' items';
            plan.push(w.total.plan);
            actual.push(w.total.actual);
            totalP += numP; totalA += numA;
        });
        plan.push({ totalRow: true }); actual.push({ totalRow: true });
        totalCurrency.forEach((c) => { plan.push(c.plan); actual.push(c.actual); });
        plan.push({ totalRow: true }); actual.push({ totalRow: true });
        total.plan.customer = 'Grand Total : ' + totalP + ' Items'
        total.actual.customer = 'Grand Total : ' + totalA + ' Items'
        plan.push(total.plan);
        actual.push(total.actual);

        // set head
        var headTable = GenHeadTable();
        var headWidth = GenHeadWidth();
        var tmpData = [];
        headTable = headTable.concat([{ value: null, metadata: { style: null, type: 'string' } }]);
        headWidth = headWidth.concat([{ width: 5 }]);

        headTable = headTable.concat(GenHeadTable());
        headWidth = headWidth.concat(GenHeadWidth());
                
        // get data excel
        var dataOrg = SetData(plan);
        var dataCom = SetData(actual);
        dataOrg.forEach((o, i) => {
            var tmp = o.concat([{ value: null, metadata: { style: null, type: 'string' } }]);
            tmp = tmp.concat(dataCom[i]);
            tmpData.push(tmp);
        });

        var startRow = 2;
        GenMerge(plan);
        rowIndex.forEach((r) => {
            worksheet.mergeCells('A' + (startRow + r.start + 1), 'A' + (startRow + r.end + 1));
            worksheet.mergeCells('Q' + (startRow + r.start + 1), 'Q' + (startRow + r.end + 1));
        });

        //// set column
        data.push(headTable);
        worksheet.setColumns(headWidth);

        // set data
        data = data.concat(tmpData);
        worksheet.sheetView.showGridLines = false;
        worksheet.setData(data);
    }

    $scope.GenExcel2 = (workbook, format, tabID) => {
        var worksheet = new ExcelBuilder.Worksheet({ name: $scope.tabList.find((v) => { return v.id === tabID; }).description });
        workbook.addWorksheet(worksheet);
        var data = [];
        // name Report 
        data.push([{ value: 'Shipment Plan Summary Report : ' + $scope.tabList.find((v) => { return v.id === tabID; }).description + ' ( ' + $scope.dataH.monthFrom + ' - ' + $scope.dataH.monthTo + ' ' + $scope.dataH.year + ' )', metadata: { style: format.report, type: 'string' } }]);
        worksheet.setRowInstructions(1, { height: 25.5 });
        var SetData = (data) => {
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

        var tmpCol11 = [{ value: 'Regional Zone', metadata: { style: format.head, type: 'string' } }
            , { value: 'Plan', metadata: { style: format.head, type: 'string' } }
            , { value: 'Plan', metadata: { style: format.head, type: 'string' } }
            , { value: 'Plan', metadata: { style: format.head, type: 'string' } }
            , { value: 'Plan', metadata: { style: format.head, type: 'string' } }
            , { value: 'Actual', metadata: { style: format.head, type: 'string' } }
            , { value: 'Actual', metadata: { style: format.head, type: 'string' } }
            , { value: 'Actual', metadata: { style: format.head, type: 'string' } }
            , { value: 'Actual', metadata: { style: format.head, type: 'string' } }
            , { value: '% Number of Shipment', metadata: { style: format.head, type: 'string' } }
            , { value: '% Weight(KG)', metadata: { style: format.head, type: 'string' } }
            , { value: '% Value(THB)', metadata: { style: format.head, type: 'string' } }
            , { value: '% Bales', metadata: { style: format.head, type: 'string' } }
        ];

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

        var tmpWidth = [{ width: 30 }
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

        var startRow = 2;

        // column add1
        data.push(tmpCol11);
        // column add2
        data.push(tmpCol22);
        // set Col width
        worksheet.setColumns(tmpWidth);

        worksheet.mergeCells('A' + (startRow), 'A' + (startRow + 1));
        worksheet.mergeCells('B' + (startRow), 'E' + (startRow));
        worksheet.mergeCells('F' + (startRow), 'I' + (startRow));
        worksheet.mergeCells('J' + (startRow), 'J' + (startRow + 1));
        worksheet.mergeCells('K' + (startRow), 'K' + (startRow + 1));
        worksheet.mergeCells('L' + (startRow), 'L' + (startRow + 1));
        worksheet.mergeCells('M' + (startRow), 'M' + (startRow + 1));

        // conver data
        var total = {
            regionalZone: { view: 'Grand Total : 0 Items' }
            , plan: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
            , actual: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
            , percent: { weight: 0, bale: 0, valueTHB: 0, items: 0 }
            , totalRow: true
        };

        var tmp = $scope.GenData2(angular.copy($scope.data), true);
        tmp.forEach((d) => {
            total.plan.items += d.plan.items;
            total.plan.weight += d.plan.weight;
            total.plan.valueTHB += d.plan.valueTHB;
            total.plan.bale += d.plan.bale;

            total.actual.items += d.actual.items;
            total.actual.weight += d.actual.weight;
            total.actual.valueTHB += d.actual.valueTHB;
            total.actual.bale += d.actual.bale;

            total.percent.items = (total.plan.items === 0 ? NaN : (total.actual.items / total.plan.items) * 100);
            total.percent.weight = (total.plan.weight === 0 ? NaN : (total.actual.weight / total.plan.weight) * 100);
            total.percent.valueTHB = (total.plan.valueTHB === 0 ? NaN : (total.actual.valueTHB / total.plan.valueTHB) * 100);
            total.percent.bale = (total.plan.bale === 0 ? NaN : (total.actual.bale / total.plan.bale) * 100);
        });
        total.regionalZone.view = 'Grand Total: ' + tmp.length + ' Items';
        tmp.push(total);
        data = data.concat(SetData(tmp));
        worksheet.sheetView.showGridLines = false;
        worksheet.setData(data);
    }

    $scope.GenExcel3 = (workbook, format, tabID) => {
        var worksheet = new ExcelBuilder.Worksheet({ name: $scope.tabList.find((v) => { return v.id === tabID; }).description });
        workbook.addWorksheet(worksheet);
        var data = [];
        // name Report 
        data.push([{ value: 'Shipment Plan Summary Report : ' + $scope.tabList.find((v) => { return v.id === tabID; }).description + ' ( ' + $scope.dataH.monthFrom + ' - ' + $scope.dataH.monthTo + ' ' + $scope.dataH.year + ' )', metadata: { style: format.report, type: 'string' } }]);

        var SetData1 = (data) => {
            var tmpData = [];
            data.forEach((row, i) => {
                var status = 'else', tv = '';
                if (row.totalRow) { status = 'total'; }
                tv = row.values.map(x => x.code + ' ' + $filter('number')(x.num, 2)).join(' , ');
                tmpData.push([
                    { value: common.GetObjVal('remarkGroup.view', row), metadata: { style: format[status].textLeft, type: 'string' } }
                    , { value: common.GetObjVal('items', row), metadata: { style: format[status].int, type: 'number' } }
                    , { value: common.GetObjVal('bale', row), metadata: { style: format[status].int, type: 'number' } }
                    , { value: common.GetObjVal('weight', row), metadata: { style: format[status].decimal, type: 'number' } }
                    , { value: tv, metadata: { style: format[status].decimal, type: 'string' } }
                    , { value: common.GetObjVal('valueTHB', row), metadata: { style: format[status].decimal, type: 'number' } }
                ]);
            });
            return tmpData;
        }

        var rowIndex = [];
        var GenMerge = (data) => {
            var ww = '';
            data.forEach((row, i) => {
                if (!angular.isUndefined(row.remarkGroup) && angular.isUndefined(row.totalRow)) {
                    if (row.remarkGroup.code === ww) {
                        rowIndex[rowIndex.length - 1].end = i;
                    } else { ww = row.remarkGroup.code; rowIndex.push({ start: i, end: i }); }
                }
            });
        }

        var SetData2 = (data) => {
            var tmpData = [];
            data.forEach((row, i) => {
                var tv = '';
                var status = 'else';
                if (row.totalRow) {
                    status = 'total';
                }
                if (row.balance) { tv = row.balance.values.map(x => x.code + ' ' + $filter('number')(x.num, 2)).join(' , '); }
                tmpData.push([
                    { value: common.GetObjVal('remarkGroup.code_view', row), metadata: { style: !row.totalRow ? format.week : format.total.textLeft, type: 'string' } }
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
        }

        // conver data
        var tmp = $scope.GenData3(angular.copy($scope.data), true);
        var total1 = { remarkGroup: { view: '' }, weight: 0, items: 0, bale: 0, valueTHB: 0, values: [], totalRow: true };
        var remarkGroup = [];
        tmp.data1.forEach((d) => {
            remarkGroup.push({
                group: d.remarkGroup.code
                , data: []
                , total: { totalRow: true, balance: { bale: 0, quantity: 0, valueTHB: 0, values: [], weight: 0 } }
            });
            total1.items += d.items;
            total1.weight += d.weight;
            total1.bale += d.bale;
            total1.valueTHB += d.valueTHB;
            d.values.forEach((x) => {
                var chkc = true;
                total1.values.forEach((c) => { if (c.code === x.code) { c.num += x.num; chkc = false; return; } });
                if (chkc) total1.values.push(angular.copy(x));
            });
        })
        total1.remarkGroup.view = 'Grand Total: ' + tmp.data1.length + ' Items';
        tmp.data1.push(total1);

        var total2 = { totalRow: true, balance: { bale: 0, quantity: 0, valueTHB: 0, values: [], weight: 0 } };

        tmp.data2.forEach((d) => {
            remarkGroup.forEach((r) => {
                if (d.remarkGroup.code === r.group) { r.data.push(d); $scope.SumTotal(d, r.total); return; }
            });
            $scope.SumTotal(d, total2);
        });
        tmp.data2 = [];

        var totalCurrency = [];
        total2.balance.values.forEach((x) => { totalCurrency.push({ customer: 'Total Currency ' + x.code, balance: { values: [x] }, totalRow: true }); });

        var totalNum = 0;
        remarkGroup.forEach((r) => {
            var no = 0;
            r.data.forEach((d, i) => {
                d.no = i + 1;
                if (i) { d.remarkGroup.code_veiw = null; }
                tmp.data2.push(d);
            });
            totalNum += r.data.length;
            r.total.customer = 'Total Group : ' + r.group + ' : ' + r.data.length + ' items';
            tmp.data2.push(r.total);
        });

        tmp.data2.push({ totalRow: true });
        totalCurrency.forEach((c) => { tmp.data2.push(c); });
        tmp.data2.push({ totalRow: true });
        total2.customer = 'Grand Total : ' + totalNum + ' Items'
        tmp.data2.push(total2);

        data.push([{ value: 'Problems', metadata: { style: format.head, type: 'string' } }
            , { value: 'Number of Shipment', metadata: { style: format.head, type: 'string' } }
            , { value: 'Bales', metadata: { style: format.head, type: 'string' } }
            , { value: 'Weight(KG)', metadata: { style: format.head, type: 'string' } }
            , { value: 'Values', metadata: { style: format.head, type: 'string' } }
            , { value: 'Value(THB)', metadata: { style: format.head, type: 'string' } }]);

        data = data.concat(SetData1(tmp.data1));
        data.push({});
        data.push({});
        worksheet.setRowInstructions(data.length, { height: 45 });
        data.push([{ value: 'Problems', metadata: { style: format.head, type: 'string' } }
            , { value: 'No.', metadata: { style: format.head, type: 'string' } }
            , { value: 'Customer', metadata: { style: format.head, type: 'string' } }
            , { value: 'Port/ Country', metadata: { style: format.head, type: 'string' } }
            , { value: 'Order Number (PI/CI)', metadata: { style: format.head, type: 'string' } }
            , { value: 'Stock Date', metadata: { style: format.head, type: 'string' } }
            , { value: 'ETD (KKF)', metadata: { style: format.head, type: 'string' } }
            , { value: 'Payment Terms', metadata: { style: format.head, type: 'string' } }
            , { value: 'Transport', metadata: { style: format.head, type: 'string' } }
            , { value: 'Quantity', metadata: { style: format.head, type: 'string' } }
            , { value: 'Weight(KG)', metadata: { style: format.head, type: 'string' } }
            , { value: 'Bales', metadata: { style: format.head, type: 'string' } }
            , { value: 'Values', metadata: { style: format.head, type: 'string' } }
            , { value: 'Value(THB)', metadata: { style: format.head, type: 'string' } }
            , { value: 'Remark', metadata: { style: format.head, type: 'string' } }]);

        worksheet.setColumns([{ width: 30 }, { width: 9 }, { width: 45 }, { width: 35 }, { width: 16.88 }, { width: 17 }, { width: 14 }, { width: 14 }, { width: 10.13 }, { width: 10.13 }, { width: 10.13 }, { width: 10.13 }, { width: 20 }, { width: 15 }, { width: 35 }]);

        var startRow = data.length;
        data = data.concat(SetData2(tmp.data2));

        GenMerge(tmp.data2);
        rowIndex.forEach((r) => { worksheet.mergeCells('A' + (startRow + r.start + 1), 'A' + (startRow + r.end + 1)); });

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
        if (option === 1) {
            if ($scope.seltab === 'S') {
                $scope.GenExcel2(workbook, format, $scope.seltab);
            } else if ($scope.seltab === 'R') {
                $scope.GenExcel3(workbook, format, $scope.seltab);
            } else {
                $scope.GenExcel1(workbook, format, $scope.seltab);
            }
        } else {
            $scope.tabList.forEach((v) => {
                if (v.id === 'S') {
                    $scope.GenExcel2(workbook, format, v.id);
                } else if (v.id === 'R') {
                    $scope.GenExcel3(workbook, format, v.id);
                } else {
                    $scope.GenExcel1(workbook, format, v.id);
                }
            });
        }

        common.ExportExcel(workbook, 'Shipment Plan Summary Report');

    };


});

app.controller("shipmentSummaryReportGrid1Ctrl", function ($rootScope, $scope, $filter, common) {

    var SetClass = function (grid, row) {
        if (row.entity.totalRow) {
            return 'bg-info font-bold';
        }
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true, showTotalGrouping2: true, showTotalCurrency: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'week', display: 'Week', width: { min: 130 }, setclass: SetClass, sort: false, filter: false, format: { type: 'customText' }, grouping2: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'no', display: 'No.', width: { min: 55, max: 55 }, format: { type: 'text', align: 'center' }, sort: false, filter: false, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer', display: 'Customer', width: { min: 300 }, format: { type: 'text', showTotal: true }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port', display: 'Port/ Country', width: { min: 200 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'ciCodes', display: 'Order Number (PI/CI)', width: { min: 170 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stockDate', display: 'Stock Date', width: { min: 115 }, format: { type: 'customText' }, filter: false, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'date', display: 'ETD (KKF)', width: { min: 115 }, format: { type: 'customText' }, filter: false, setclass: SetClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerms', display: 'Payment Term', width: { min: 115 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Transport', width: { min: 90 }, setclass: SetClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark_view', display: 'Remark', width: { min: 250 }, setclass: SetClass }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === 'week') {
                if (myCol.colDef.grouping2) { return myRow.entity.week_view; }
                else { return myRow.entity.week; }
            } else if (myCol.field === 'stockDate') {
                if (myRow.entity.stockDate) { return KSSClient.Engine.Common.GetDateView(myRow.entity.stockDate);}
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
    
    $rootScope.shipmentSummaryReportGrid1Ctrl_SetData = function (data) {
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

app.controller("shipmentSummaryReportGrid2Ctrl", function ($rootScope, $scope, $filter, common) {

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
    }

    $scope.gridOpt = common.CreateGrid2({ footer: true, showTotalGrouping2: true, showTotalCurrency: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'week', display: 'Week', width: { min: 130 }, setclass: SetClass, sort: false, filter: false, format: { type: 'customText' }, grouping2: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'no', display: 'No.', width: { min: 55, max: 55 }, format: { type: 'text', align: 'center' }, sort: false, filter: false, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer', display: 'Customer', width: { min: 300 }, format: { type: 'text', showTotal: true }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port', display: 'Port/ Country', width: { min: 200 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'ciCodes', display: 'Order Number (PI/CI)', width: { min: 170 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stockDate', display: 'Stock Date', width: { min: 115 }, format: { type: 'customText' }, filter: false, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'date', display: 'ETD (KKF)', width: { min: 115 }, format: { type: 'customText' }, filter: false, setclass: SetClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerms', display: 'Payment Term', width: { min: 115 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Transport', width: { min: 90 }, setclass: SetClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark_view', display: 'Remark', width: { min: 250 }, setclass: SetClass }));

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
        return false
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_compare01');
    };

    $rootScope.shipmentSummaryReportGrid2Ctrl_SetData = function (data) {
        data.forEach((row) => { row.noTotal = row.status === 'P' || row.status === 'R'; });
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

app.controller("shipmentSummaryReportGrid3Ctrl", function ($rootScope, $scope, $filter, common) {

    var SetClass = function (grid, row) {
        if (row.entity.totalRow) {
            return 'bg-info font-bold';
        }
    }

    $scope.gridOpt = common.CreateGrid2({ footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'regionalZone.view', display: 'Regional Zone', width: { default: 300 }, setclass: SetClass, showCountItems: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'plan.items', display: 'Number of Shipment', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'plan', display: 'Plan', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'plan.weight', display: 'Weight(KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'plan', display: 'Plan', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'plan.valueTHB', display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'plan', display: 'Plan', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'plan.bale', display: 'Bales', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'plan', display: 'Plan', langCode: '' }, setclass: SetClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.items', display: 'Number of Shipment', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.weight', display: 'Weight(KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.valueTHB', display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'actual.bale', display: 'Bales', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, group: { name: 'actual', display: 'Actual', langCode: '' }, setclass: SetClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'percent.items', display: '% Number of Shipment', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actual.items', divi: 'plan.items' }, setclass: SetClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'percent.weight', display: '% Weight(KG)', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actual.weight', divi: 'plan.weight' }, setclass: SetClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'percent.valueTHB', display: '% Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actual.valueTHB', divi: 'plan.valueTHB' }, setclass: SetClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'percent.bale', display: '% Bales', width: { default: 120 }, format: { type: 'decimal', scale: 2, summary: 'percent', multi: 'actual.bale', divi: 'plan.bale' }, setclass: SetClass, multiLine: true }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
        }
        return false
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_compare01');
    };
    
    $rootScope.shipmentSummaryReportGrid3Ctrl_SetData = function (data) {
        $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
    }

});

app.controller("shipmentSummaryReportGrid4Ctrl", function ($rootScope, $scope, $filter, common) {

    var SetClass = function (grid, row) {
        if (row.entity.totalRow) {
            return 'bg-info font-bold';
        }
    }

    $scope.gridOpt = common.CreateGrid2({ footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remarkGroup.view', display: 'Problems', width: { default: 300 }, format: { type: 'text', showTotal: true }, sort: false, filter: false, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'items', display: 'Number of Shipment', width: { default: 150 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'bale', display: 'Bales', width: { default: 60 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'weight', display: 'Weight(KG)', width: { default: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'values', display: 'Values', width: { default: 300 }, format: { type: 'currency', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'valueTHB', display: 'Value(THB)', width: { default: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
        }
        return false
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_compare01');
    };

    $rootScope.shipmentSummaryReportGrid4Ctrl_SetData = function (data) {
        //var length = data.length * 5;
        //for (var i = 0; i < length; i++) { data.push({ totalRow: true }); }
        $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
    }

});

app.controller("shipmentSummaryReportGrid5Ctrl", function ($rootScope, $scope, $filter, common) {

    var SetClass = function (grid, row) {
        if (row.entity.totalRow) {
            return 'bg-info font-bold';
        }
    }

    $scope.gridOpt = common.CreateGrid2({ footer: true, showTotalGrouping2: true, showTotalCurrency: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remarkGroup.code', display: 'Problems', width: { min: 300 }, setclass: SetClass, sort: false, filter: false, format: { type: 'customText' }, grouping2: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'no', display: 'No.', width: { min: 55, max: 55 }, format: { type: 'text', align: 'center' }, sort: false, filter: false, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer', display: 'Customer', width: { min: 300 }, format: { type: 'text', showTotal: true }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'port', display: 'Port/ Country', width: { min: 200 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'ciCodes', display: 'Order Number (PI/CI)', width: { min: 170 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stockDate', display: 'Stock Date', width: { min: 115 }, format: { type: 'customText' }, filter: false, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'date', display: 'ETD (KKF)', width: { min: 115 }, format: { type: 'customText' }, filter: false, setclass: SetClass, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'paymentTerms', display: 'Payment Term', width: { min: 115 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'containerCode', display: 'Transport', width: { min: 90 }, setclass: SetClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.quantity', display: 'Quantity', width: { min: 100 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.weight', display: 'Weight(KG)', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.bale', display: 'Bales', width: { min: 60 }, format: { type: 'decimal', scale: 0 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.values', display: 'Values', width: { min: 180 }, format: { type: 'currency', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'balance.valueTHB', display: 'Value(THB)', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'remark_view', display: 'Remark', width: { min: 250 }, setclass: SetClass }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === 'remarkGroup.code') {
                return angular.isUndefined(myRow.entity.remarkGroup) ? '' : myRow.entity.remarkGroup.code_view;
            } else if (myCol.field === 'stockDate') {
                if (myRow.entity.stockDate) { return KSSClient.Engine.Common.GetDateView(myRow.entity.stockDate); }
                return '';
            } else if (myCol.field === 'date') {
                if (myRow.entity.date) { return KSSClient.Engine.Common.GetDateView(myRow.entity.date); }
                return '';
            }
        }
        return false
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_compare01');
    };
    
    $rootScope.shipmentSummaryReportGrid5Ctrl_SetData = function (data) {
        var length = data.length * 5;
        for (var i = 0; i < length; i++) { data.push({ totalRow: true }); }
        $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
    }

});
