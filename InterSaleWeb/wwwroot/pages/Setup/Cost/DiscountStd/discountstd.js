'use strict';
app.controller("discountStdController", function ($rootScope, $scope, common, $uibModal, $document, $window, $filter, API, $timeout) {

    $rootScope.setupDiscount = 2;
    $rootScope.discountprod = true;
    $rootScope.selectGridDiscount = [undefined, undefined, undefined];
    $rootScope.discountChange = { table: '', change: false }

    // set value from model
    var $discountStdMain = this;

    $rootScope.CustomerList = {};
    $rootScope.DiscountStdMainType = {};

    // init value prodcodeprice SearchEffectDate
    $rootScope.PriceStdEffectiveDateStatus = {};
    $rootScope.PriceStdApproveStatus = {};

    $scope.dtpFrom = new Date();
    $scope.dtpFrom.setDate($scope.dtpFrom.getDate() - 30);
    $scope.dtpTo = new Date();
    $scope.dtpTo.setDate($scope.dtpTo.getDate() + 30);

    $rootScope.setupDiscount = -1;

    $scope.LoadProduct = (data) => {
        API.Product.SearchLight({
            data: {
                productTypeIDs: data.productTypeID
                , productGradeIDs: data.productGradeID === null ? '' : data.productGradeID
                , status: 'A'
            },
            noloadding: true,
            callback: (res) => {
                $rootScope.products = res.data.products;
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.LoadTwineSeries = (data) => {
        API.ProductTwineSeries.Search({
            data: { productTypeIDs: data.productTypeID, status: 'A' },
            noloadding: true,
            callback: (res) => {
                $rootScope.twineSeries = res.data.twineSeries;
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.LoadColorGroup = (data) => {
        API.ProductColorGroup.Search({
            data: {
                countryGroupIDs: data.countryGroupID
                , productTypeID: data.productTypeID
                , productGradeID: data.productGradeID
                , status: 'A'
            },
            noloadding: true,
            callback: (res) => {
                res.data.colorGroups.forEach((d) => { d.descriptionorg = d.description; });
                $rootScope.colorGroups = res.data.colorGroups;
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $rootScope.GridSelectDiscountChanged = function (grid) {
        if ($rootScope.selectGridDiscount[0] !== undefined) {
            if (grid === 0) {
                //$rootScope.setupDiscount = -1;
                $rootScope.GetDiscountStdEffectiveDates($rootScope.selectGridDiscount[grid].id, $scope.dtpFrom, $scope.dtpTo);
                if ($rootScope.selectGridDiscount[0].type === 'C') {
                    //$timeout(() => { $scope.LoadProduct({ productTypeID: $rootScope.selectGridDiscount[0].productType.id, productGradeID: $rootScope.selectGridDiscount[0].productGrade.id }); });
                } else {
                    $timeout(() => { $scope.LoadColorGroup({ countryGroupIDs: $rootScope.selectGridDiscount[0].countryGroup.id, productTypeID: $rootScope.selectGridDiscount[0].productType.id, productGradeID: $rootScope.selectGridDiscount[0].productGrade.id }); });
                    if ($filter('filter')($rootScope.ProductTypes, { code: $rootScope.selectGridDiscount[0].productType.code, groupType: 'T' }).length) {
                        $timeout(() => { $scope.LoadTwineSeries({ productTypeID: $rootScope.selectGridDiscount[0].productType.id }); });
                    }
                }
                $rootScope.GetDiscountSearchAction();
            } else if (grid === 1) {
                //$rootScope.setupDiscount = -1;
                $rootScope.GetDiscountSearchAction();
                $rootScope.discountStdPriceList_LoadData();
                if ($rootScope.selectGridDiscount[grid] !== undefined) {
                    if ($rootScope.selectGridDiscount[0].type === 'C') {
                        $rootScope.setupDiscount = 0;
                        $rootScope.GetDiscountSearchAction($rootScope.setupDiscount, $rootScope.selectGridDiscount[grid].id, 0);
                    }
                    else if ($rootScope.selectGridDiscount[0].type === 'R') {
                        if ($filter('filter')($rootScope.ProductTypes, { code: $rootScope.selectGridDiscount[0].productType.code, groupType: 'N' }).length) { $rootScope.setupDiscount = 1; }
                        else if ($filter('filter')($rootScope.ProductTypes, { code: $rootScope.selectGridDiscount[0].productType.code, groupType: 'T' }).length) { $rootScope.setupDiscount = 2; }
                        else { return false; }
                    } else { return false; }
                    $rootScope.GetSearchDiscountRangeH($rootScope.setupDiscount, $rootScope.selectGridDiscount[grid].id);
                } else {
                    //$rootScope.setupDiscount = -1;
                    $rootScope.GetSearchDiscountRangeH();
                }
            } else if (grid === 2) {
                $rootScope.discountStdPriceList_LoadData();
                if ($rootScope.selectGridDiscount[grid] !== undefined) {
                    $rootScope.GetDiscountSearchAction($rootScope.setupDiscount, $rootScope.selectGridDiscount[grid - 1].id, $rootScope.selectGridDiscount[grid].id);
                } else {
                    $rootScope.GetDiscountSearchAction();
                }
            }
        } else {
            //$rootScope.setupDiscount = -1;
            $rootScope.GetDiscountStdEffectiveDates();
            $rootScope.GetSearchDiscountRangeH();
        }
        //console.log($rootScope.selectGridDiscount[grid]);
    };

    $rootScope.CustomerList = [];
    API.Customer.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.customers.forEach((row) => {
                row.view = common.GetCodeDescription(row);
            });
            $rootScope.CustomerList = res.data.customers;
        },
        error: (res) => { common.AlertMessage("Error", res.message); }
    });

    KSSClient.API.Constant.DiscountStdMainType({
        data: {},
        callback: (res) => {
            res.data.discountStdMainType.forEach(function (row, index) { row.view = row.code + " : " + row.description; });
            $rootScope.DiscountStdMainType = res.data.discountStdMainType;
        },
        error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $scope.customerID = 0;
    $scope.SetCustomerID = function (customerID) {
        $scope.customerID = customerID;
    };

    var SetDate = () => {
        $rootScope.GetDiscountStdMain($scope.customerID, $scope.productType.id, $scope.productQuality.id);
        $rootScope.GetDiscountStdEffectiveDates();
        $rootScope.GetSearchDiscountRangeH();
        $rootScope.GetDiscountSearchAction();
    };

    $scope.LoadData = () => {
        if ($rootScope.discountChange.change) {
            common.ConfirmDialog($rootScope.discountChange.table + ' has changed.', 'Do you want to Cancel?').then((ok) => { if (ok) { SetDate(); } });
        }
        else SetDate();
    };

    $scope.DownLoad = function () { $window.location.href = $rootScope.IP_URL + "files/Template_DISCOUNT.zip"; }

    // data get from excel import file
    $scope.DiscountStdData = function (excel) {
        try {

            if (excel.sheetNames.find(function (sheetName) { return sheetName === "DISCOUNT" }) === undefined) { throw 500; }

            //sheetnames , data
            $discountStdMain.excel = excel;
            $discountStdMain.excel.table = [];
            $discountStdMain.excel.errorSheet = [];
            $discountStdMain.dataImport = {};
            $discountStdMain.dataImport.discountStdMains = [];

            for (var i = 0; i < excel.data.length; i++) {

                if (excel.sheetNames[i] !== 'DISCOUNT') { continue; }

                var j = [];
                for (var k = 0; k < excel.data[i].length; k++) {
                    if (k >= 13) {
                        var tmp = excel.data[i][k];
                        if (!(tmp[0] === null || tmp[0] === undefined || tmp.length === 0 || (tmp[0] + '').trim() === "")) {
                            j.push(tmp);
                        }
                    }
                    else {
                        j.push(excel.data[i][k]);
                    }
                }
                console.log(j);

                var discountStdMain = {
                    customerCode: common.GetStringCode(j[0][2]),
                    type: common.GetStringCode(j[4][2]),
                    productTypeCode: common.GetStringCode(j[1][2]),
                    productGradeCode: common.GetStringCode(j[2][2]),
                    currencyCode: common.GetStringCode(j[3][2]),
                    saleCode: common.GetStringCode(j[9][2]),
                    discountStdEffectiveDate: []
                };

                var discountStdProdCode = {};
                var discountStdRange = { discountStdRangeH: [] };
                var df = (j[6][2] + '').trim().split('/');
                var dt = (j[7][2] + '').trim().split('/');

                $discountStdMain.dataImport.discountStdMains.push(discountStdMain);

                discountStdMain.discountStdEffectiveDate.push({
                    effectiveDateFrom: df[2] + '-' + df[1] + '-' + df[0],
                    effectiveDateTo: dt[2] + '-' + dt[1] + '-' + dt[0],
                    discountStdProdCode: discountStdProdCode,
                    discountStdRange: discountStdRange
                });

                if (discountStdMain.type === 'C') {
                    var discountStdValues = [];
                    discountStdProdCode.discountStdValues = discountStdValues;
                    for (var p = 13; p < j.length; p++) {
                        if (j[p].length === 0) continue;
                        discountStdValues.push({
                            productCode: common.GetStringCode(j[p][1]),
                            unitTypeCode: common.GetStringCode(j[p][4]),
                            discountPercent: common.GetNumber(j[p][5]),
                            discountAmount: common.GetNumber(j[p][6]),
                            increaseAmount: 0
                        });
                    }
                } else if (discountStdMain.type === 'R' && PRODUCT1.indexOf(discountStdMain.productTypeCode) !== -1) {//NET
                    for (var o = 13; o < j.length; o++) {
                        if (j[o].length === 0) continue;
                        discountStdRange.discountStdRangeH.push({
                            minTwineSizeCode: common.GetStringCode(j[o][1]),
                            maxTwineSizeCode: common.GetStringCode(j[o][2]),
                            unitTypeCode: common.GetStringCode(j[o][12]),
                            knotCode: common.GetStringCode(j[o][9]),
                            stretchingCode: common.GetStringCode(j[o][10]),
                            selvageWovenTypeCode: null,
                            colorCode: common.GetStringCode(j[o][11]),
                            discountStdValues: [
                                {
                                    minMeshSize: common.GetNumberNull(j[o][3]),
                                    maxMeshSize: common.GetNumberNull(j[o][4]),
                                    minMeshDepth: common.GetNumberNull(j[o][5]),
                                    maxMeshDepth: common.GetNumberNull(j[o][6]),
                                    minLength: common.GetNumberNull(j[o][7]),
                                    maxLength: common.GetNumberNull(j[o][8]),
                                    discountPercent: common.GetNumber(j[o][13]),
                                    discountAmount: common.GetNumber(j[o][14]),
                                    increaseAmount: 0
                                }
                            ]
                        });
                    }
                } else if (discountStdMain.type === 'R' && PRODUCT2.indexOf(discountStdMain.productTypeCode) !== -1) {//TWINE
                    for (var d = 13; d < j.length; d++) {//Value Begin Row 10
                        if (j[d].length === 0) continue;
                        discountStdRange.discountStdRangeH.push({
                            minTwineSizeCode: common.GetStringCode(j[d][1]),
                            maxTwineSizeCode: common.GetStringCode(j[d][2]),
                            unitTypeCode: common.GetStringCode(j[d][6]),
                            colorCode: common.GetStringCode(j[d][5]),
                            discountStdValues: [
                                {
                                    productTwineSeriesCode: common.GetStringCode(j[d][3]),
                                    discountPercent: common.GetNumber(j[d][7]),
                                    discountAmount: common.GetNumber(j[d][8]),
                                    increaseAmount: 0
                                }
                            ]
                        });
                    }
                }
                // set date excel
                $discountStdMain.excel.data = [];
                $discountStdMain.excel.data.push(j);

                //create data table
                $discountStdMain.excel.table.push(KSSClient.Engine.Common.CreateTable(j));
                $discountStdMain.excel.errorSheet.push(false);
            }
        }
        catch (err) {
            alert("รูปแบบข้อมูลนำเข้าไม่ถูกต้อง \nกรุณาเลือกไฟล์นำเข้าใหม่.");
            return false;
        }
        $discountStdMain.open();
    };

    $discountStdMain.template = function (excel) {
        var isError = false;
        var html =
            '<div class="modal-header bg-success"><h3 class="modal-title" id="modal-title" > Preview File: ' + excel.fileName + '</h3 > </div >' +
            '<div class="" id="modal-body">' +
            '<uib-tabset active="active">';

        excel.sheetNames.forEach(function (sheet, index) {
            if (sheet === "DISCOUNT") {
                html += '<uib-tab index="' + 0 + '">';
                if (excel.errorSheet[0] === true) {
                    html += '<uib-tab-heading>' + '<div class="bg-danger">' + sheet + '</div></uib-tab-heading>';
                    isError = true;
                }
                else {
                    html += '<uib-tab-heading>' + '<div class="bg-default">' + sheet + '</div></uib-tab-heading>';
                }
                html += '<div windows-Resize class="modalContent" ng-style="{ \'max-height\': (height - 180) + \'px\'}" >' +
                    excel.table[0] + '</div></uib-tab>';
            }
        });

        html += '</uib-tabset></div>' +
            '<div class="modal-footer bg-success">';

        if (isError) {
            html += '<button class="btn btn-danger" type="button" ng-click="$discountStdMain.cancel()">Close</button>';
        } else {
            html += '<button class="btn btn-primary" type="button" ng-click="$discountStdMain.ok()" > Import</button >&nbsp;&nbsp;&nbsp;' +
                '<button class="btn btn-warning" type="button" ng-click="$discountStdMain.cancel()">Cancel</button>';
        }

        html += '</div>';

        return html;
    };

    $discountStdMain.open = function (parentSelector) {
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalCtrlDiscount',
            controllerAs: '$discountStdMain',
            size: 'lg',
            appendTo: parentElem,
            resolve:
                {
                    dataImport: function () { return $discountStdMain.dataImport; }
                },
            backdrop: 'static',
            keyboard: false,
            template: $discountStdMain.template($discountStdMain.excel)

        });

        modalInstance.result.then(function (res) {

            //console.log(res);

            if (res.status === "F") {
                $discountStdMain.excel.table = [];
                $discountStdMain.excel.errorSheet = [];

                for (var i = 0; i < res.data.discountStdMains.length; i++) {
                    var error = [];
                    if (res.data.discountStdMains[i]._result._status === 'F') {
                        var tmpMessage1 = KSSClient.Engine.Common.GetMessage(res.data.discountStdMains[i]._result._message);
                        if (tmpMessage1 !== "") error.push({ index: '1', message: tmpMessage1 });
                    }
                    for (var j = 0; j < res.data.discountStdMains[i].discountStdEffectiveDate.length; j++) {

                        if (res.data.discountStdMains[i].discountStdEffectiveDate[j]._result._status === 'F') {
                            var tmpMessage2 = KSSClient.Engine.Common.GetMessage(res.data.discountStdMains[i].discountStdEffectiveDate[j]._result._message);
                            if (tmpMessage2 !== "") error.push({ index: '6', message: tmpMessage2 });
                        }

                        if (res.data.discountStdMains[i].type === 'C') {
                            for (var k = 0; k < res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdProdCode.discountStdValues.length; k++) {
                                if (res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdProdCode.discountStdValues[k]._result._status === 'F') {
                                    var tmpMessage3 = KSSClient.Engine.Common.GetMessage(res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdProdCode.discountStdValues[k]._result._message);
                                    if (tmpMessage3 !== "") error.push({ index: (13 + k) + '', message: tmpMessage3 });
                                }
                            }
                        }
                        else if (res.data.discountStdMains[i].type === 'R') {
                            for (var d = 0; d < res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdRange.discountStdRangeH.length; d++) {
                                if (res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdRange.discountStdRangeH[d]._result._status === 'F') {
                                    var tmpMessage4 = "";
                                    if (PRODUCT1.indexOf(res.data.discountStdMains[i].productTypeCode) !== -1) {
                                        tmpMessage4 = KSSClient.Engine.Common.GetMessage2(res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdRange.discountStdRangeH[d]._result._message, $discountStdMain.excel.data[i], (13 + d));
                                        if (tmpMessage4 !== "") error.push({ index: (13 + d) + '', message: tmpMessage4 });
                                    } else {
                                        tmpMessage4 = KSSClient.Engine.Common.GetMessage(res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdRange.discountStdRangeH[d]._result._message);
                                        if (tmpMessage4 !== "") error.push({ index: (13 + d) + '', message: tmpMessage4 });
                                    }
                                }
                            }
                        }
                    }

                    //console.log(error);

                    $discountStdMain.excel.table.push(KSSClient.Engine.Common.CreateTable($discountStdMain.excel.data[i], error));
                    if (error.length !== 0) { $discountStdMain.excel.errorSheet.push(true); }
                    else { $discountStdMain.excel.errorSheet.push(false); }

                }
                $discountStdMain.open();
            }

            $scope.GetDiscountStdMain();
            $rootScope.selectGridDiscount[0] = undefined
            $rootScope.GridSelectDiscountChanged(-1);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $rootScope.DiscountAddEdit = (table, chk) => {
        if (table === 'Discount Main' && chk) { $rootScope.discountStdSearchMain_SetGrid(chk); }
        else { $rootScope.discountStdSearchMain_SetGrid(false); }

        if (table === 'Discount Effective Date' && chk) { $rootScope.discountStdSearchEffectDate_SetGrid(chk); }
        else { $rootScope.discountStdSearchEffectDate_SetGrid(false); }

        if (table === 'Discount Product Spec Header' && chk) { $rootScope.discountStdFilter_SetGrid(chk); }
        else { $rootScope.discountStdFilter_SetGrid(false); }

        if ((table === 'Discount Product Code Value' || table === 'Discount Product Spec Value') && chk) { $rootScope.discountStdAction_SetGrid(chk); }
        else { $rootScope.discountStdAction_SetGrid(false); }

        if (!chk) {
            $rootScope.discountStdSearchMain_SetGrid(!chk);
            $rootScope.discountStdSearchEffectDate_SetGrid(!chk);
            $rootScope.discountStdFilter_SetGrid(!chk);
            $rootScope.discountStdAction_SetGrid(!chk);
        }
        $rootScope.discountChange = { table: table, change: chk };
    };

    //clone function
    $scope.CloneModal = () => {
        $uibModal.open({
            animation: true,
            controller: 'DiscountCloneModalCtrl',
            size: 'lg',
            resolve: {
                data: () => {
                    return {
                        customerID: $scope.customerID
                    };
                }
            },
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/templates/DiscountCloneModal.html'
        }).result.then((data) => { }, () => { });
    };

    $rootScope.ProductTypes = [];

    API.ProductType.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.productTypes.forEach((row) => {
                row.view = row.code + " : " + row.description;
                $rootScope.ProductTypes.push(row);
            });
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $rootScope.ProductGrades = [];

    API.ProductGrade.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.productGrades.forEach((row) => {
                row.view = row.code + " : " + row.description;
                $rootScope.ProductGrades.push(row);
            });
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });

    // producttype
    $scope.productType = {
        list: $rootScope.ProductTypes, view: '', id: '', SetID: (id) => {
            $scope.productType.id = id;
        }
    };

    // productGrade
    $scope.productQuality = {
        list: $rootScope.ProductGrades, view: '', id: '', SetID: (id) => {
            $scope.productQuality.id = id;
        }
    };

});

app.controller('DiscountCloneModalCtrl', function ($scope, $rootScope, common, data, $uibModalInstance, $window, $filter, $timeout, uiGridConstants, API) {

    $timeout(() => { $scope.width = $window.innerWidth; }, 1);

    $scope.effectiveDate = new Date();

    //$scope.dateFrom = new Date($scope.effectiveDate.getFullYear(), );
    //$scope.dateTo = new Date();

    var customer = $filter('filter')($rootScope.CustomerList, { id: data.customerID ? data.customerID : '' }, true);
    // customer src
    $scope.customerSrc = { disabled: false };
    $scope.customerSrc.list = $rootScope.CustomerList;
    $scope.customerSrc.view = customer.length ? customer[0].view : '';
    $scope.customerSrc.id = '';
    $scope.customerSrc.SetID = (id) => {
        $scope.customerSrc.id = id;
        if (id && !$scope.customerDes.disabled) {
            var tmpId = $filter('filter')($rootScope.CustomerList, { id: $scope.customerSrc.id }, true);
            $scope.customerDes.list = $filter('filter')($rootScope.CustomerList, { countryGroup: { id: common.GetObjVal('countryGroup.id', tmpId[tmpId.length - 1]) } }, true);
            if (!$scope.customerDes.list.find((d) => { return d.id === $scope.customerDes.id; })) { $scope.customerDes.view = $scope.customerSrc.view; }
        }
    };

    // customer des
    $scope.customerDes = { disabled: false };
    $scope.customerDes.list = $rootScope.CustomerList;
    $scope.customerDes.view = '';
    $scope.customerDes.id = '';
    $scope.customerDes.SetID = (id) => { $scope.customerDes.id = id; };
        
    // producttype
    $scope.productType = {};
    $scope.productType.list = $rootScope.ProductTypes;
    $scope.productType.view = '';
    $scope.productType.id = '';
    $scope.productType.SetID = (id) => { $scope.productType.id = id; };
    
    $scope.gridOpt1 = common.CreateGrid2({ footer: true, mSelect: true, checkAll: false });
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Table No.', width: { min: 110 }, showCountItems: true }));
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'type_view', display: 'Table Type', width: { min: 80 }, multiLine: true }));
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'productType_view', display: 'Product Type', width: { min: 80 }, multiLine: true }));
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'productGrade_view', display: 'Product Quality', width: { min: 80 }, multiLine: true }));
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'currency_view', display: 'Currency', width: { min: 80 } }));
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'effectiveDateFrom_view', display: 'From', width: { min: 100 }, format: { type: 'datetime' }, group: { name: 'effective', display: 'Effective Date', langCode: '' } }));
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'effectiveDateTo_view', display: 'To', width: { min: 100 }, format: { type: 'datetime' }, group: { name: 'effective', display: 'Effective Date', langCode: '' } }));
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'countApproved', display: 'Items Value', width: { min: 80 }, format: { type: 'decimal', scale: 0 }, multiLine: true }));

    $scope.gridOpt1.onRegisterApi = function (gridApi) {
        $scope.gridApi1 = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, (row) => { $scope.smov1 = $scope.gridApi1.selection.getSelectedRows().length > 0; });

        gridApi.grid.registerRowsProcessor((renderableRows) => {
            renderableRows.forEach((row) => {
                if ($scope.gridApi2.grid.options.data.find((d) => { return d.id === row.entity.id; })
                    || !(row.entity.effectiveDateFrom_view.getTime() <= $scope.effectiveDate.getTime() && row.entity.effectiveDateTo_view.getTime() >= $scope.effectiveDate.getTime())
                ) row.visible = false;
            });
            return renderableRows;
        }, 200);
        $scope.LoadData();
    };

    $scope.LoadData = () => {
        if (!$scope.customerSrc.id) { return; }
        if (!common.GetStringVal($scope.effectiveDate)) { common.AlertMessage('Warning', 'Please select a Effective Date.'); return; }

        API.DiscountStd.CloneSearch({
            data: { customerID: $scope.customerSrc.id, effectiveDate: common.GetDateString($scope.effectiveDate), productTypeIDs: $scope.productType.id },
            callback: (res) => {
                $scope.gridOpt1.data = [];
                res.data.discountStds.forEach((d) => {
                    if (!$scope.gridApi2.grid.options.data.find((r) => {
                        return r.type === d.type
                            && r.productType.id === d.productType.id
                            && (r.productGrade.id === d.productGrade.id || r.productGrade.id === null)
                            && r.currency.id === d.currency.id;
                    }))
                    {
                        d.type_view = common.GetObjVal('view', $rootScope.DiscountStdMainType.find((r) => { return r.id === d.type; }));
                        d.productType_view = common.GetCodeDescription(d.productType);
                        d.productGrade_view = common.GetCodeDescription(d.productGrade);
                        d.currency_view = common.GetCodeDescription(d.currency);
                        d.effectiveDateFrom_view = common.CreateDateTime(d.effectiveDateFrom);
                        d.effectiveDateTo_view = common.CreateDateTime(d.effectiveDateTo);
                        d.enableEdit = true;
                        $scope.gridOpt1.data.push(d);
                    }
                });
                $scope.gridApi1.grid.refresh();
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi1.grid.id) {
            if (myCol.field === "headRow") { return true; }
            else if (myCol.field === "effectiveDateFrom_view") {
                return common.GetDateView(myRow.entity.effectiveDateFrom_view);
            }
            else if (myCol.field === "effectiveDateTo_view") {
                return common.GetDateView(myRow.entity.effectiveDateTo_view);
            }
        } else if (grid.id === $scope.gridApi2.grid.id) {
            if (myCol.field === "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field === "dateFrom") {
                return common.GetDateView(myRow.entity.dateFrom);
            }
            else if (myCol.field === "dateTo") {
                return common.GetDateView(myRow.entity.dateTo);
            }
        }

        return false;
    };


    $scope.gridOpt2 = common.CreateGrid2({ footer: true, mSelect: true, enableGridEdit: true, checkAll: false });
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Table No.', width: { min: 110 }, showCountItems: true }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'type_view', display: 'Table Type', width: { min: 80 }, multiLine: true }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'productType_view', display: 'Product Type', width: { min: 80 }, multiLine: true }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'productGrade_view', display: 'Product Quality', width: { min: 80 }, multiLine: true }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'currency_view', display: 'Currency', width: { min: 80 } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'dateFrom', display: 'From', edit: true, width: { min: 100 }, format: { type: 'datetime' }, setclass: common.SetClassEdit, group: { name: 'effective', display: 'Effective Date', langCode: '' } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'dateTo', display: 'To', edit: true, width: { min: 100 }, format: { type: 'datetime' }, setclass: common.SetClassEdit, group: { name: 'effective', display: 'Effective Date', langCode: '' } }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'countApproved', display: 'Items Value', width: { min: 80 }, format: { type: 'decimal', scale: 0 }, multiLine: true }));

    $scope.gridOpt2.onRegisterApi = function (gridApi) {
        $scope.gridApi2 = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, (row) => { $scope.smov2 = $scope.gridApi2.selection.getSelectedRows().length > 0; });

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.$apply();

            var flag = colDef.name === 'dateTo' ? 't' : 'f';
            var tmp = $scope.DateSet(rowEntity.dateFrom, rowEntity.dateTo, flag);
            if (tmp) { common.AlertMessage('Warning', tmp); }

            rowEntity.dateFromerr = rowEntity.dateToerr = !$scope.DateChk(rowEntity.dateFrom, rowEntity.dateTo);

            $scope.gridApi2.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $scope.ChkChange();
        });
    };

    $scope.MoveAction = (src, des, opt) => {
        if (!$scope.customerDes.id) { common.AlertMessage('Warning', 'Please select Customer Destination.'); return; }
        if (!$scope.DateChk($scope.dateFrom, $scope.dateTo)) { return; }
        var data = [];
        if (opt === 1) { data = src.selection.getSelectedRows(); }
        else if (opt === 2) { data = src.grid.renderContainers.body.visibleRowCache.map(x => x.entity); }

        data.forEach((d) => {
            if (!des.grid.options.data.find((r) => {
                return r.type === d.type
                    && r.productType.id === d.productType.id
                    && (r.productGrade.id === d.productGrade.id || r.productGrade.id === null)
                    && r.currency.id === d.currency.id; })) {
                d.dateFrom = d.dateFromorg = $scope.dateFrom;
                d.dateTo = d.dateToorg = $scope.dateTo;
                d.customerdes = $scope.customerDes.id;
                des.grid.options.data.push(d);
            }
            src.grid.options.data.splice(src.grid.options.data.indexOf(d), 1);
        });

        src.selection.clearSelectedRows();
        des.selection.clearSelectedRows();

        $timeout(() => {
            src.grid.refresh();
            $timeout(() => {
                des.grid.refresh();
                $scope.ChkChange();
                if ($scope.customerDes.disabled) {
                    $scope.customerSrc.list = $scope.customerDes.list;
                } else {
                    $scope.customerSrc.list = $rootScope.CustomerList;
                }
            });
        });

        $scope.smov1 = $scope.smov2 = false;
    };

    $scope.ChkChange = () => {
        $scope.btnOk = $scope.customerDes.disabled = $scope.gridApi2.grid.options.data.length > 0;
        $scope.gridApi2.grid.options.data.forEach((d) => {
            if (d.dateFromerr || d.dateToerr) { $scope.btnOk = false; return; }
        });
    };

    $scope.DateChk = (dateFrom, dateTo, flag) => {
        if (!common.GetStringVal(dateFrom) || !common.GetStringVal(dateTo)) { if (!flag) { common.AlertMessage('Warning', 'Please set "Effective Date From" and "Effective Date To".'); } return false; }
        if (dateFrom.getTime() > dateTo.getTime()) { common.AlertMessage('Error', '"Effective Date From" > "Effective Date To".'); return false; }
        return true;
    };

    $scope.DateChange2 = (flag) => {
        if (common.GetStringVal($scope.dateFrom)) { $scope.dateFrom = common.CreateDateTime(common.GetDateString($scope.dateFrom)); }
        if (common.GetStringVal($scope.dateTo)) { $scope.dateTo = common.CreateDateTime(common.GetDateString($scope.dateTo)); }
        var tmp = $scope.DateSet($scope.dateFrom, $scope.dateTo, flag);
        if (tmp) { common.AlertMessage('Warning', tmp); }
        else { $scope.DateChk($scope.dateFrom, $scope.dateTo, 1); }
    };

    $scope.DateSet = (dateFrom, dateTo, flag) => {
        var warning = '';
        if (common.GetStringVal(dateFrom) && flag === 'f') {
            var df = common.GetFirstDayOfMonth(dateFrom);
            if (dateFrom.getTime() !== df.getTime()) { warning += '"Effective Date From" does not match Date "' + common.GetDateView(df) + '". \n'; }
        }

        if (common.GetStringVal(dateTo) && flag === 't') {
            var dt = common.GetLastDayOfMonth(dateTo);
            if (dateTo.getTime() !== dt.getTime()) { warning += '"Effective Date To" does not match Date "' + common.GetDateView(dt) + '". \n'; }
        }
        return warning;
    };

    $scope.ok = function () {

        var data = [];
        $scope.gridApi2.grid.options.data.forEach((d) => {
            d.effectiveDateFrom = common.GetDateString(d.dateFrom);
            d.effectiveDateTo = common.GetDateString(d.dateTo);
            d.customer.id = d.customerdes;
            data.push(d);
        });

        API.DiscountStd.CloneSave({
            data: { discountStds: data },
            callback: (res) => {
                common.AlertMessage(res.message, '').then((ok) => { $uibModalInstance.close(); });
            },
            error: (res) => {
                var msg = '';
                res.data.discountStds.forEach((v) => { if (v._result._status === 'F') { msg += 'Table No. : ' + v.code + ' : ' + v._result._message + '\n'; } });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    };

    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };

});
//  model ctrl
app.controller('ModalCtrlDiscount', function ($uibModalInstance, dataImport, common) {
    var $discountStdMain = this;
    //$discountStdMain.dataImport = dataImport;
    $discountStdMain.ok = function () {
        KSSClient.API.DiscountStd.ImportDiscount({
            data: dataImport,
            callback: function (res) {
                var count = 0;
                if (res.data.discountStdMains[0].type === 'C') {
                    count = res.data.discountStdMains[0].discountStdEffectiveDate[0].discountStdProdCode.discountStdValues.length;
                }
                else if (res.data.discountStdMains[0].type === 'R') {
                    count = res.data.discountStdMains[0].discountStdEffectiveDate[0].discountStdRange.discountStdRangeH.length;
                }

                common.AlertMessage("Success", "นำเข้าข้อมูลจำนวน " + count + " รายการ เรียบร้อย");
                $uibModalInstance.close(res);
            },
            error: function (res) {
                if (res.message.substring(0, 1) === 'O') {
                    common.AlertMessage("Error", res.message);
                    $uibModalInstance.dismiss('cancel');
                } else {
                    common.AlertMessage("Error", "นำเข้าข้อมูลไม่สำเร็จ กรุณาปิดหน้าต่างแล้วนำเข้าข้อมูลใหม่");
                    $uibModalInstance.close(res);
                }
            }
        });
    };

    $modalPriceStd.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

///------------------------------------------------------------------ grid prodcodeprice SearchMain ----------------------------------------------------------------------------

app.controller("discountStdSearchMain", function ($rootScope, $scope, $timeout, API, common, uiGridConstants) {

    $scope.IP_DB = $rootScope.IP_DB;

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableInsert: false, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code'/*, langCode: 'GRID_MAIN_MAINCODE'*/, display: 'Table No.', width: { default: 140 }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountStdEffectiveDate.code'/*, langCode: 'GRID_MAIN_EFFECTDATE'*/, display: 'Effective Date No.', width: { default: 130 }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'type'/*, langCode: 'GRID_MAIN_TYPE'*/, edit: true, display: 'Table Type', width: { min: 154 }, format: { type: 'autocomplete', obj: 'type' }, cellFilter: 'mapDiscountStdMainType', setclass: common.SetClassEdit, inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productType.code'/*, langCode: 'GRID_MAIN_PRODUCTTYPE'*/, edit: true, display: 'Product Type', format: { type: 'autocomplete', obj: 'productType' }, cellFilter: 'mapProductType', width: { min: 150 }, setclass: common.SetClassEdit, inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productGrade.code'/*, langCode: 'GRID_MAIN_PRODUCTGRADE'*/, edit: true, display: 'Product Quality', width: { min: 217 }, format: { type: 'autocomplete', obj: 'productGrade' }, cellFilter: 'mapProductGrade', setclass: common.SetClassEdit, inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'currency.code'/*, langCode: 'GRID_MAIN_CURRENCY'*/, edit: true, display: 'Currency', width: { min: 150 }, format: { type: 'autocomplete', obj: 'currency' }, cellFilter: 'mapCurrency', setclass: common.SetClassEdit, inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', display: 'Status', width: { default: 100 }, setclass: common.SetClassEdit, cellFilter: 'mapStatus', hiding: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 300 }, setclass: common.SetClassEdit }));

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        common.ChkChange($scope);
    };

    $rootScope.discountStdSearchMain_SetGrid = (chk) => {
        $scope.gridApi.grid.options.enableInsert = chk;
        $scope.gridApi.grid.options.enableGridEdit = chk;
        $scope.gridApi.grid.refresh();
    };

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); return; }
                });
                return numRow;
            }
        }
        return false;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) { common.ChkChange($scope); });
        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            if (!oldRowCol || oldRowCol.row.uid !== newRowCol.row.uid) {
                if ($rootScope.discountChange.change && $rootScope.discountChange.table !== 'Discount Main') {
                    common.ConfirmDialog($rootScope.discountChange.table + ' has changed.', 'Do you want to Cancel?').then((ok) => {
                        if (ok) {
                            $rootScope.selectGridDiscount[0] = newRowCol.row.entity;
                            $rootScope.GridSelectDiscountChanged(0);
                            $rootScope.DiscountAddEdit('', false);
                            if (newRowCol.row.entity.type === 'C') { $scope.LoadProduct({ productTypeID: newRowCol.row.entity.productType.id, productGradeID: newRowCol.row.entity.productGrade.id }); }
                        }
                    });
                } else {
                    $rootScope.selectGridDiscount[0] = newRowCol.row.entity;
                    $rootScope.GridSelectDiscountChanged(0);
                    if (newRowCol.row.entity.type === 'C') { $scope.LoadProduct({ productTypeID: newRowCol.row.entity.productType.id, productGradeID: newRowCol.row.entity.productGrade.id }); }
                }
            }
        });

        //KSSClient.API.Language.Dictionary({
        //    data: { lang: $rootScope.lang, group: "SETUP_COST_PRICESTD" },
        //    callback: function (obj) {
        //        $scope.PH_countryGroup = obj['PH_COUNTRYGROUP'] !== undefined ? obj['PH_COUNTRYGROUP'] : '{PH_COUNTRYGROUP}';
        //        common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
        //    },
        //    error: function (res) { }
        //});

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.$apply();

            var type = $scope.type.list.find((x) => { return x.code === rowEntity.type; });
            var productType = $scope.productType.list.find((x) => { return x.code === rowEntity.productType.code; });
            if (productType) rowEntity.productType.id = productType.id;
            var productGrade = $scope.productGrade.list.find((x) => { return x.code === rowEntity.productGrade.code; });
            if (productGrade) rowEntity.productGrade.id = productGrade.id; else rowEntity.productGrade.id = null;
            rowEntity.productGrade.codeerr = false;
            var currency = $scope.currency.list.find((x) => { return x.code === rowEntity.currency.code; });
            if (currency) rowEntity.currency.id = currency.id;
            rowEntity.customer.id = $scope.customerID;

            rowEntity.code = rowEntity.customer.code + (angular.isUndefined(type) ? ' ' : type.code) + (angular.isUndefined(productType) ? ' ' : productType.code) + (angular.isUndefined(productGrade) ? '0' : productGrade.code) + (angular.isUndefined(currency) ? ' ' : currency.code);
            rowEntity.typeerr = !type;
            rowEntity.productType.codeerr = !productType;
            rowEntity.currency.codeerr = !currency;
            $scope.gridApi.grid.options.data.forEach((d) => {
                if (rowEntity.productType.code === d.productType.code
                    && rowEntity.type === d.type
                    && (rowEntity.productGrade.id === null || rowEntity.productGrade.code === d.productGrade.code)
                    && rowEntity.currency.code === d.currency.code
                    && d.$$hashKey !== rowEntity.$$hashKey && d.status !== 'C') {
                    common.AlertMessage('Error', 'Cannot edit Overlap code : ' + rowEntity.code);
                    common.SetObjVal(colDef.name + 'err', true, rowEntity);
                    return;
                }
            });

            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $scope.ChkDataChange();
        });

        $scope.gridApi.grid.registerRowsProcessor((renderableRows) => {
            renderableRows.forEach((row) => { if (!row.grid.options.showAllStatus && !row.entity.isInsert) if (row.entity.status === 'C') { row.isSelected = false; row.visible = false; } });
            return renderableRows;
        }, 200);
    };

    $rootScope.GetDiscountStdMain = function (customerID, productTypeID, productGradeID) {
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        $rootScope.selectGridDiscount = [undefined, undefined, undefined];
        common.GridClearAll($scope);
        $rootScope.GridSelectDiscountChanged(0);
        if (!customerID) { return false; }
        $scope.ChkDataChange();
        $scope.customerID = customerID;
        $scope.productTypeID = productTypeID;
        $scope.productGradeID = productGradeID;

        KSSClient.API.DiscountStd.SearchMain({
            data: { customerIDs: customerID, productTypeIDs: productTypeID, productGradeIDs: productGradeID },
            callback: function (res) {
                res.data.discountStdMains.forEach(function (row, index) {
                    row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;
                });
                $scope.gridOpt.data = res.data.discountStdMains;
                $scope.gridApi.grid.refresh();
            },
            error: function (res) { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.type = {
        value: ''
        , list: [{ id: 'C', code: 'C', description: 'Product Code' }, { id: 'R', code: 'R', description: 'Range' }]
        , func: (key) => {
            $scope.type.value = key;
        }
    };

    $scope.productType = {
        value: ''
        , list: $rootScope.ProductTypes
        , func: (key) => {
            $scope.productType.value = key;
        }
    };

    $scope.productGrade = {
        value: ''
        , list: $rootScope.ProductGrades
        , func: (key) => {
            $scope.productGrade.value = key;
        }
    };

    API.Currency.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.currencys.forEach((row, index) => { row.view = row.code + " : " + row.description; });
            $rootScope.Currencys = res.data.currencys;
            $scope.currency.list = res.data.currencys;
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $scope.currency = {
        value: ''
        , list: []
        , func: (key) => {
            $scope.currency.value = key;
        }
    };

    $scope.AddRow = function () {
        var obj = {};
        common.SetObjVal('id', 0, obj);
        common.SetObjVal('customer.code', $rootScope.CustomerList.find((x) => { return x.id === $scope.customerID }).code, obj);
        common.SetObjVal('code', '', obj);
        common.SetObjVal('productType.code', "", obj);
        common.SetObjVal('productType.codeerr', true, obj);
        common.SetObjVal('productGrade.code', null, obj);
        common.SetObjVal('type', '', obj);
        common.SetObjVal('typeerr', true, obj);
        common.SetObjVal('discountStdEffectiveDate.id', 0, obj);
        common.SetObjVal('currency.code', "", obj);
        common.SetObjVal('currency.codeerr', true, obj);

        common.SetObjVal('status', 'A', obj);
        common.SetObjVal('isInsert', true, obj);
        common.SetObjVal('enableEdit', true, obj);

        $scope.gridOpt.data.push(obj);
        $timeout(function () {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 1]
                , $scope.gridApi.grid.options.columnDefs[4]);
            $scope.gridApi.core.scrollTo(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 2]
                , $scope.gridApi.grid.options.columnDefs[4]);
        }, 5);
        $scope.gridApi.grid.refresh();
        $scope.ChkDataChange();
    };

    $scope.RemoveRow = function (grid, row) {
        $scope.gridApi.grid.options.data.splice($scope.gridApi.grid.options.data.indexOf(row.entity), 1);
        $scope.ChkDataChange();
        $scope.gridApi.grid.refresh();
    };

    $scope.ChkDataChange = function () {
        var chk = false, chk2 = true;
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.isInsert) { chk = true; }
            if (d.productType.codeerr || d.typeerr || d.currency.codeerr || d.productGrade.codeerr) { chk2 = false; }
        });
        $scope.btnSave = chk && chk2;
        $scope.btnCancel = chk;
        $rootScope.DiscountAddEdit('Discount Main', chk);
    };

    $scope.UpdateStatus = (status) => {
        KSSClient.API.DiscountStd.UpdateStatusMain({
            data: { ids: $scope.gridApi.selection.getSelectedRows().map(x => x.id), status: status },
            callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $rootScope.GetDiscountStdMain($scope.customerID); }); },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.UpdateStatusAction = (status) => {
        if (status === 'C') {
            var msg = "";
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) { if (!row.totalRow) msg += row.code + '\n'; });
            common.ConfirmDialog('Are you sure?', 'Remove Table No. : \n' + msg).then((ok) => { if (ok) $scope.UpdateStatus(status); });
        } else { $scope.UpdateStatus(status); }
    };

    $scope.Save = () => {
        var data = [];
        $scope.gridApi.grid.options.data.forEach((d) => { if (d.isInsert) { data.push(d); } });
        KSSClient.API.DiscountStd.SaveMain({
            data: { discountStdMains: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $rootScope.GetDiscountStdMain($scope.customerID, $scope.productTypeID, $scope.productGradeID); });
            },
            error: (res) => {
                var msg = '';
                res.data.discountStdMains.forEach((v) => {
                    if (v._result._status === 'F') {
                        msg += 'Code : ' + v.code + ' : ' + v._result._message + '\n';
                    }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    };

    $scope.Cancel = function () {
        for (var i = $scope.gridApi.grid.options.data.length - 1; i >= 0; i--) {
            if ($scope.gridApi.grid.options.data[i].isInsert) {
                $scope.gridApi.grid.options.data.splice(i, 1);
            } else {
                //$scope.gridApi.grid.options.data[i].code = $scope.gridApi.grid.options.data[i].codeorg;
                //$scope.gridApi.grid.options.data[i].description = $scope.gridApi.grid.options.data[i].descriptionorg;
            }
        }

        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        $scope.ChkDataChange();
    };

});

///------------------------------------------------------------------ grid prodcodeprice SearchEffectDate ----------------------------------------------------------------------------

app.controller("discountStdSearchEffectDate", function ($rootScope, $scope, $timeout, common, uiGridConstants, intersales) {

    // init value grid
    $scope.IP_DB = $rootScope.IP_DB;

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableInsert: false, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code'/*, langCode: 'GRID_EFFECT_CODE'*/, display: 'Effective Date No.', width: { min: 179 }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateFrom'/*, langCode: 'GRID_EFFECT_DATEFROM'*/, edit: true, display: 'Date From', width: { min: 110 }, format: { type: 'date' }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateTo'/*, langCode: 'GRID_EFFECT_DATETO'*/, edit: true, display: 'Date To', width: { min: 110 }, format: { type: 'date' }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'countApprove_countTotal'/*, langCode: 'GRID_EFFECT_COUNT'*/, display: 'Count Approve', width: { min: 137 }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', display: 'Status', width: { default: 100 }, setclass: common.SetClassEdit, cellFilter: 'mapStatus', hiding: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 300 }, setclass: common.SetClassEdit }));

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        common.ChkChange($scope);
    };

    $scope.cumulative = function (grid, myRow, myCol, option = 0) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); return; }
                });
                return numRow;
            }
            else if (myCol.field === "effectiveDateFrom") {
                if (option === 1) { if (myRow.entity.effectiveOldDateFrom !== "") { return true; } }
                else if (option === 2) { if (myRow.entity.effectiveOldDateFrom !== "") { return KSSClient.Engine.Common.GetDateView(new Date(myRow.entity.effectiveOldDateFrom)); } }
                else { return KSSClient.Engine.Common.GetDateView(myRow.entity.effectiveDateFrom); }
            }
            else if (myCol.field === "effectiveDateTo") {
                if (option === 1) { if (myRow.entity.effectiveOldDateTo !== "") { return true; } }
                else if (option === 2) { if (myRow.entity.effectiveOldDateTo !== "") { return KSSClient.Engine.Common.GetDateView(new Date(myRow.entity.effectiveOldDateTo)); } }
                else { return KSSClient.Engine.Common.GetDateView(myRow.entity.effectiveDateTo); }
            }
        }
        return false;
    };

    $rootScope.discountStdSearchEffectDate_SetGrid = (chk) => {
        $scope.gridApi.grid.options.enableInsert = chk;
        $scope.gridApi.grid.options.enableGridEdit = chk;
        $scope.gridApi.grid.refresh();
    }

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) { common.ChkChange($scope); });

        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            if (!oldRowCol || oldRowCol.row.uid !== newRowCol.row.uid) {
                if ($rootScope.discountChange.change && $rootScope.discountChange.table !== 'Discount Main' && $rootScope.discountChange.table !== 'Discount Effective Date') {
                    common.ConfirmDialog($rootScope.discountChange.table + ' has changed.', 'Do you want to Cancel?').then((ok) => {
                        if (ok) {
                            $rootScope.selectGridDiscount[1] = newRowCol.row.entity;
                            $rootScope.GridSelectDiscountChanged(1);
                            $rootScope.DiscountAddEdit('', false);
                        }
                    });
                } else {
                    $rootScope.selectGridDiscount[1] = newRowCol.row.entity;
                    $rootScope.GridSelectDiscountChanged(1);
                }
            }
        });

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.$apply();

            if (!angular.isDate(rowEntity.effectiveDateFrom)) { return; }
            else rowEntity.effectiveDateFromerr = false;
            if (!angular.isDate(rowEntity.effectiveDateTo)) { return; }
            else rowEntity.effectiveDateToerr = false;
            var chk = false;
            $scope.gridApi.grid.options.data.forEach((d) => {
                if (intersales.DRange(d.effectiveDateFrom.getTime(), d.effectiveDateTo.getTime(), rowEntity.effectiveDateFrom.getTime(), rowEntity.effectiveDateTo.getTime()) && d.$$hashKey !== rowEntity.$$hashKey && d.status !== 'C') {
                    common.AlertMessage('Error', 'Effective Date Overlap : ' + d.code + ' ' + KSSClient.Engine.Common.GetDateView(d.effectiveDateFrom) + ' - ' + KSSClient.Engine.Common.GetDateView(d.effectiveDateTo)).then((val) => { });
                    chk = true;
                    return;
                }
            });
            rowEntity.effectiveDateFromerr = chk;
            rowEntity.effectiveDateToerr = chk;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $scope.ChkDataChange();
        });

        $scope.gridApi.grid.registerRowsProcessor((renderableRows) => {
            renderableRows.forEach((row) => { if (!row.grid.options.showAllStatus && !row.entity.isInsert) if (row.entity.status === 'C') { row.isSelected = false; row.visible = false; } });
            return renderableRows;
        }, 200);

        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "SETUP_COST_PRICESTD" },
            callback: function (obj) {
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) { }
        });
    };

    $rootScope.GetDiscountStdEffectiveDates = function (discountStdMainID = '', dateFrom = null, dateTo = null) {
        common.GridClearAll($scope);
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        if (!discountStdMainID) { return false }
        $scope.ChkDataChange();
        KSSClient.API.DiscountStd.SearchEffectiveDate({
            data: { discountStdMainIDs: discountStdMainID, dateFrom: common.GetDateString(dateFrom), dateTo: common.GetDateString(dateTo) },
            callback: function (res) {
                res.data.discountStdEffectiveDates.forEach(function (row) {
                    row.effectiveDateFromorg = row.effectiveDateFrom = KSSClient.Engine.Common.CreateDateTime(row.effectiveDateFrom);
                    row.effectiveDateToorg = row.effectiveDateTo = KSSClient.Engine.Common.CreateDateTime(row.effectiveDateTo);
                    row.effectiveOldDateFrom = KSSClient.Engine.Common.CreateDateTime(row.effectiveOldDateFrom);
                    row.effectiveOldDateTo = KSSClient.Engine.Common.CreateDateTime(row.effectiveOldDateTo);
                    row.countApprove_countTotal = row.countApprove + "/" + row.countTotal;
                    row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;

                    // add
                    //row.enableEdit = true;
                });
                $scope.gridOpt.data = res.data.discountStdEffectiveDates;
                $scope.gridApi.grid.refresh();
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    }

    $scope.AddRow = function () {
        if (!$rootScope.selectGridDiscount[0] || !$rootScope.selectGridDiscount[0].id) { common.AlertMessage('Warning', 'Please Select Price Main Data.'); return; }
        var obj = {};
        common.SetObjVal('id', 0, obj);
        common.SetObjVal('discountStdMain.id', $rootScope.selectGridDiscount[0].id, obj);
        common.SetObjVal('discountStdMain.code', $rootScope.selectGridDiscount[0].code, obj);
        common.SetObjVal('code', '', obj);
        common.SetObjVal('effectiveDateFrom', '', obj);
        common.SetObjVal('effectiveOldDateFrom', '', obj);
        common.SetObjVal('effectiveDateFromerr', true, obj);
        common.SetObjVal('effectiveDateTo', '', obj);
        common.SetObjVal('effectiveOldDateTo', '', obj);
        common.SetObjVal('effectiveDateToerr', true, obj);

        common.SetObjVal('status', 'A', obj);
        common.SetObjVal('isInsert', true, obj);
        common.SetObjVal('enableEdit', true, obj);

        $scope.gridOpt.data.push(obj);
        $timeout(function () {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 1]
                , $scope.gridApi.grid.options.columnDefs[3]);
            $scope.gridApi.core.scrollTo(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 2]
                , $scope.gridApi.grid.options.columnDefs[3]);
        }, 5);
        $scope.gridApi.grid.refresh();
        $scope.ChkDataChange();
    };

    $scope.RemoveRow = function (grid, row) {
        $scope.gridApi.grid.options.data.splice($scope.gridApi.grid.options.data.indexOf(row.entity), 1);
        $scope.ChkDataChange();
        $scope.gridApi.grid.refresh();
    };

    $scope.ChkDataChange = function () {
        var chk = false, chk2 = true;
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.isInsert/* || d.effectiveDateFrom.getTime() !== d.effectiveDateFromorg.getTime() || d.effectiveDateTo.getTime() !== d.effectiveDateToorg.getTime() */) { chk = true; }
            if (d.effectiveDateFromerr || d.effectiveDateToerr) { chk2 = false; }
        });
        $scope.btnSave = chk && chk2;
        $scope.btnCancel = chk;
        $rootScope.DiscountAddEdit('Discount Effective Date', chk);
    }

    $scope.UpdateStatus = (status) => {
        KSSClient.API.DiscountStd.UpdateStatusEffectiveDate({
            data: { ids: $scope.gridApi.selection.getSelectedRows().map(x => x.id), status: status },
            callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $scope.Cancel(); }); },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    $scope.UpdateStatusAction = (status) => {
        if (status === 'C') {
            var msg = "";
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) { if (!row.totalRow) msg += row.code + '\n'; });
            common.ConfirmDialog('Are you sure?', 'Remove Effective Date No. : \n' + msg).then((ok) => { if (ok) $scope.UpdateStatus(status); });
        } else { $scope.UpdateStatus(status); }
    }

    $scope.Save = () => {
        var data = [];
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.isInsert) {
                data.push({
                    discountStdMain: d.discountStdMain
                    , effectiveDateFrom: KSSClient.Engine.Common.GetDateString(d.effectiveDateFrom)
                    , effectiveDateTo: KSSClient.Engine.Common.GetDateString(d.effectiveDateTo)
                    , status: d.status
                });
            }
        });
        KSSClient.API.DiscountStd.SaveEffectiveDate({
            data: { discountStdEffectiveDates: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $rootScope.GridSelectDiscountChanged(0); });
            },
            error: (res) => {
                var msg = '';
                res.data.discountStdEffectiveDates.forEach((v) => {
                    if (v._result._status === 'F') {
                        msg += 'Effective Date : ' + KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(v.effectiveDateFrom)) + ' - ' + KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(v.effectiveDateTo)) + ' : ' + v._result._message + '\n';
                    }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    }

    $scope.Cancel = function () { $rootScope.GridSelectDiscountChanged(0); }

});

///------------------------------------------------------------------ grid prodcodeprice Filter ----------------------------------------------------------------------------

app.controller("discountStdFilter", function ($rootScope, $scope, $timeout, $filter, common, uiGridConstants, API, intersales, dialog) {

    // values
    $scope.IP_DB = $rootScope.IP_DB;

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableInsert: false, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'minTwineSize.code'/*, langCode: 'GRID_RANGH_DIAFROM'*/, edit: true, display: 'From', width: { min: 90 }, setclass: common.SetClassEdit, group: { name: 'twine', display: 'Dia', langCode: '' }, format: { type: 'autocomplete', obj: 'twineSize', limit: 10 }, inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'maxTwineSize.code'/*, langCode: 'GRID_RANGH_DIATO'*/, edit: true, display: 'To', width: { min: 90 }, setclass: common.SetClassEdit, group: { name: 'twine', display: 'Dia', langCode: '' }, format: { type: 'autocomplete', obj: 'twineSize', limit: 10 }, inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'knot.code'/*, langCode: 'GRID_RANGH_KNOT'*/, edit: true, display: 'Knot', width: { min: 147 }, setclass: common.SetClassEdit, format: { type: 'autocomplete', obj: 'productKnot' }, cellFilter: 'mapProductKnot', inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stretching.code'/*, langCode: 'GRID_RANGH_STRET'*/, edit: true, display: 'Stretching', width: { min: 118 }, setclass: common.SetClassEdit, format: { type: 'autocomplete', obj: 'productStretching' }, cellFilter: 'mapProductStretching', inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'unitType.code'/*, langCode: 'GRID_RANGH_UNITTYPE'*/, edit: true, display: 'Sale Unit', width: { min: 100 }, setclass: common.SetClassEdit, format: { type: 'autocomplete', obj: 'unitType' }, cellFilter: 'mapUnitType', inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'selvageWovenType.code'/*, langCode: 'GRID_RANGH_SELVAGE'*/, edit: true, display: 'Selvage Woven', width: { min: 117 }, setclass: common.SetClassEdit, format: { type: 'autocomplete', obj: 'productSelvageWovenType' }, cellFilter: 'mapProductSelvageWovenType', inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'colorGroups.code'/*, langCode: 'GRID_RANGH_COLORGROUP'*/, edit: true, display: 'Color Group', width: { min: 160 }, setclass: common.SetClassEdit, format: { type: 'helpInput', func: 'ColorGroupPopup' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', display: 'Status', width: { default: 100 }, setclass: common.SetClassEdit, cellFilter: 'mapStatus', hiding: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 300 }, setclass: common.SetClassEdit }));

    $scope.hideCol = ['knot.code', 'stretching.code', 'selvageWovenType.code'];

    $scope.gridColorSearch = common.CreateGrid2({ footer: true });
    $scope.gridColorSearch.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 65 }, format: { type: 'numRow' }, sort: false, filter: false }));
    $scope.gridColorSearch.columnDefs.push(common.AddColumn2({ name: 'code'/*, langCode: 'GRID_COLOR_CODE'*/, display: 'Code', width: { min: 55 } }));
    $scope.gridColorSearch.columnDefs.push(common.AddColumn2({ name: 'description'/*, langCode: 'GRID_COLOR_DES'*/, display: 'Description' }));

    $rootScope.discountStdFilter_SetGrid = (chk) => {
        $scope.gridApi.grid.options.enableInsert = chk;
        $scope.gridApi.grid.options.enableGridEdit = chk;
        $scope.gridApi.grid.refresh();
    };

    $scope.ColorGroupPopup = (row) => {
        dialog.ColorGroupModal({
            countryGroupID: $rootScope.selectGridDiscount[0].countryGroup.id
            , productTypeID: $rootScope.selectGridDiscount[0].productType.id
            , productGradeID: $rootScope.selectGridDiscount[0].productGrade.id
            , colorGroupID: row.entity.colorGroups.id
        }).then((data) => {
            var tmp = $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.indexOf(row.entity)];
            if (data) {
                tmp.colorGroups.code = data.code;
                API.ProductColorGroup.Search({
                    data: {
                        countryGroupIDs: $rootScope.selectGridDiscount[0].countryGroup.id
                        , productTypeID: $rootScope.selectGridDiscount[0].productType.id
                        , productGradeID: $rootScope.selectGridDiscount[0].productGrade.id
                        , status: 'A'
                    },
                    callback: (res) => {
                        $rootScope.colorGroups = res.data.colorGroups;
                        $scope.ChkRange(tmp, { name: 'colorGroups.code' });
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                        $scope.ChkDataChange();
                    },
                    error: (res) => { common.AlertMessage("Error", res.message); }
                });
            } else {
                tmp.colorGroups.id = null;
                tmp.colorGroups.code = '';
                tmp.colorGroups.description = '';
                tmp.colorGroups.colors = [];
            }
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $scope.ChkDataChange();
        });
    };

    $scope.gridColorSearch.onRegisterApi = function (gridApi) {
        $scope.gridColorSearchApi = gridApi;
        //KSSClient.API.Language.Dictionary({
        //    data: { lang: $rootScope.lang, group: "SETUP_COST_PRICESTD" },
        //    callback: function (obj) { common.GridLang(gridApi.grid.renderContainers.body.visibleColumnCache, obj); },
        //    error: function (res) { common.AlertMessage("Error", res.message); }
        //});
    };

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        common.ChkChange($scope);
    };

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); return; }
                });
                return numRow;
            }
        }
        else if (grid.id === $scope.gridColorSearchApi.grid.id) {
            if (myCol.field === "numRow") {
                var numRow2 = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => {
                    if (myRow.uid === row.uid) { numRow2 = (index + 1); row.entity.no = (index + 1); return; }
                });
                return numRow2;
            }
        }
        return false;
    };

    $scope.SetGridLang = function () {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "SETUP_COST_PRICESTD" },
            callback: function (obj) { common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj); },
            error: function (res) { common.AlertMessage("Error", res.message); }
        });
    };

    $rootScope.GetSearchDiscountRangeH = function (model = -1, DiscountEffectiveDateID = '') {
        $scope.gridOpt.data = [];
        $scope.gridColorSearch.data = [];
        $scope.gridApi.grid.refresh();
        common.GridClearAll($scope);
        if (!DiscountEffectiveDateID) return;
        $scope.ChkDataChange();
        $scope.model = model;
        switch (model) {
            case 1: //$scope.gridOpt.columnDefs = gridPriceStdRangeH1;
                $scope.tableSelect = "sxsProductKnot, sxsProductStretching, sxsUnitType, sxsProductSelvageWovenType, sxsProductColorGroup";
                break;
            case 2: //$scope.gridOpt.columnDefs = gridPriceStdRangeH2;
                $scope.tableSelect = "sxsUnitType, sxsProductColorGroup";
                break;
            default: return false;
        }

        $scope.gridOpt.columnDefs.forEach((c1) => {
            c1.enableHiding = true;
            c1.visible = true;
            if ($scope.hideCol.find((c2) => { return c2 === c1.field; }) && model === 2) {
                c1.enableHiding = false;
                c1.visible = false;
            }
        });

        $scope.SetGridLang();

        if ($rootScope.selectGridDiscount[0].productGroup.id === 8) {
            $scope.twineSize.list = [];
            $scope.twineSizes.forEach((v) => {
                if (!$scope.twineSize.list.find((d) => { return d.id === v.id })) {
                    $scope.twineSize.list.push(v);
                }
            });
        } else {
            $scope.twineSize.list = $filter('filter')($scope.twineSizes, { productGroup: { id: $rootScope.selectGridDiscount[0].productGroup.id } }, true);
        }

        KSSClient.API.DiscountStd.SearchDiscountRangeH({
            data: { DiscountEffectiveDateID: DiscountEffectiveDateID },
            callback: function (res) {
                res.data.discountStdRangeHs.forEach(function (row, index) {
                    row.minTwineSize.codeorg = row.minTwineSize.code;
                    //row.mintwine = intersales.GetDiameter(row.minTwineSizeCode);
                    row.maxTwineSize.codeorg = row.maxTwineSize.code;
                    //row.maxtwine = intersales.GetDiameter(row.maxTwineSizeCode);
                    row.unitType.codeorg = row.unitType.code;
                    row.knot.codeorg = row.knot.code;
                    row.stretching.codeorg = row.stretching.code;
                    row.selvageWovenType.codeorg = row.selvageWovenType.code;
                    row.colorGroups.codeorg = row.colorGroups.code;
                    //row.colorGroups.view = common.GetCodeDescription(row.colorGroups);
                    row.enableEdit = row.status !== 'C';
                    row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;
                });
                $scope.gridOpt.data = res.data.discountStdRangeHs;
                $scope.gridApi.grid.refresh();
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) { common.ChkChange($scope); });

        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            if (!oldRowCol || oldRowCol.row.uid !== newRowCol.row.uid) {
                if ($rootScope.discountChange.change && $rootScope.discountChange.table === 'Discount Product Spec Value') {
                    common.ConfirmDialog($rootScope.discountChange.table + ' has changed.', 'Do you want to Cancel?').then((ok) => {
                        if (ok) {
                            $rootScope.selectGridDiscount[2] = newRowCol.row.entity;
                            $scope.gridColorSearch.data = newRowCol.row.entity.colorGroups.colors;
                            $rootScope.GridSelectDiscountChanged(2);
                            $rootScope.DiscountAddEdit('', false);
                        }
                    });
                } else {
                    $rootScope.selectGridDiscount[2] = newRowCol.row.entity;
                    $scope.gridColorSearch.data = newRowCol.row.entity.colorGroups.colors;
                    $rootScope.GridSelectDiscountChanged(2);
                }
            }
        });

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.$apply();
                        
            $scope.ChkRange(rowEntity, colDef);

            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $scope.ChkDataChange();
        });

        $scope.gridApi.core.on.sortChanged($scope, () => {

        });

        $scope.gridApi.grid.registerRowsProcessor((renderableRows) => {
            renderableRows.forEach((row) => { if (!row.grid.options.showAllStatus && !row.entity.isInsert) if (row.entity.status === 'C') { row.isSelected = false; row.visible = false; } });
            return renderableRows;
        }, 200);

        $scope.SetGridLang();
    };

    // functoin chk range
    $scope.ChkRange = (rowEntity, colDef) => {
        var minTwineSize = $filter('filter')($scope.twineSize.list, { code: rowEntity.minTwineSize.code }, true);
        var maxTwineSize = $filter('filter')($scope.twineSize.list, { code: rowEntity.maxTwineSize.code }, true);

        var knot = $filter('filter')($scope.productKnot.list, { code: rowEntity.knot.code }, true);
        if (knot.length) rowEntity.knot.id = knot[0].id; else rowEntity.knot.id = null;
        var stretching = $filter('filter')($scope.productStretching.list, { code: rowEntity.stretching.code }, true);
        if (stretching.length) rowEntity.stretching.id = stretching[0].id; else rowEntity.stretching.id = null;
        var selvageWovenType = $filter('filter')($scope.productSelvageWovenType.list, { code: rowEntity.selvageWovenType.code }, true);
        if (selvageWovenType.length) rowEntity.selvageWovenType.id = selvageWovenType[0].id; else rowEntity.selvageWovenType.id = null;

        var unitType = $filter('filter')($scope.unitType.list, { code: rowEntity.unitType.code }, true);
        rowEntity.unitType.codeerr = unitType.length === 0;
        if (unitType.length) rowEntity.unitType.id = unitType[0].id; else rowEntity.unitType.id = '';

        if (!rowEntity.colorGroups.code) {
            rowEntity.colorGroups.id = null;
            rowEntity.colorGroups.description = '';
            rowEntity.colorGroups.codeerr = false;
            $scope.gridColorSearch.data = rowEntity.colorGroups.colors = [];
        } else {
            rowEntity.colorGroups.codeerr = true;
            rowEntity.colorGroups.description = '';
            $filter('filter')($rootScope.colorGroups, { code: rowEntity.colorGroups.code }, true).forEach((d) => {
                rowEntity.colorGroups.id = d.id;
                rowEntity.colorGroups.description = d.description;
                rowEntity.colorGroups.codeerr = false;
                $scope.gridColorSearch.data = rowEntity.colorGroups.colors = d.colors;
            });
        }

        if (colDef.name === 'minTwineSize.code') {
            if (minTwineSize.length) {
                rowEntity.minTwineSize.codeerr = false;
                if (!maxTwineSize.length) {
                    rowEntity.maxTwineSize.code = rowEntity.minTwineSize.code;
                    maxTwineSize = minTwineSize;
                }
            } else { rowEntity.minTwineSize.codeerr = true; }
        }

        if (minTwineSize.length && maxTwineSize.length) {
            if (
                (maxTwineSize[0].filamentSize < minTwineSize[0].filamentSize)
                || (maxTwineSize[0].filamentSize === minTwineSize[0].filamentSize && maxTwineSize[0].filamentAmount < minTwineSize[0].filamentAmount)
                || (maxTwineSize[0].filamentSize === minTwineSize[0].filamentSize && maxTwineSize[0].filamentAmount === minTwineSize[0].filamentAmount && maxTwineSize[0].filamentWord < minTwineSize[0].filamentWord)
            ) {
                common.AlertMessage('Error', 'Dai To < Dai From ');
                rowEntity.maxTwineSize.codeerr = true;
            } else { rowEntity.maxTwineSize.codeerr = false; }
            rowEntity.minTwineSize.size = minTwineSize[0].filamentSize;
            rowEntity.minTwineSize.amount = minTwineSize[0].filamentAmount;
            rowEntity.minTwineSize.word = minTwineSize[0].filamentWord;

            rowEntity.maxTwineSize.size = maxTwineSize[0].filamentSize;
            rowEntity.maxTwineSize.amount = maxTwineSize[0].filamentAmount;
            rowEntity.maxTwineSize.word = maxTwineSize[0].filamentWord;
        }
        var chk = false;
        $scope.gridApi.grid.options.data.forEach((d) => {
            if ((
                ($scope.model === 1
                    && rowEntity.unitType.code === d.unitType.code
                    && (rowEntity.stretching.code === d.stretching.code || rowEntity.stretching.id === null)
                    && (rowEntity.knot.code === d.knot.code || rowEntity.knot.id === null)
                    && (rowEntity.selvageWovenType.code === d.selvageWovenType.code || rowEntity.selvageWovenType.id === null)
                    && (rowEntity.colorGroups.code === d.colorGroups.code))
                || ($scope.model === 2
                    && rowEntity.unitType.code === d.unitType.code
                    && rowEntity.colorGroups.code === d.colorGroups.code))
                && d.$$hashKey !== rowEntity.$$hashKey && d.status !== 'C') {
                if (
                    intersales.DRange(rowEntity.minTwineSize.size, rowEntity.maxTwineSize.size, d.minTwineSize.size, d.maxTwineSize.size)
                    && intersales.DRange(rowEntity.minTwineSize.amount, rowEntity.maxTwineSize.amount, d.minTwineSize.amount, d.maxTwineSize.amount)
                    && intersales.DRange(rowEntity.minTwineSize.word, rowEntity.maxTwineSize.word, d.minTwineSize.word, d.maxTwineSize.word)
                ) {
                    common.AlertMessage('Error', 'Dai Overlap : ' + d.minTwineSize.code + ' - ' + d.maxTwineSize.code);
                    chk = true;
                }
                return;
            }
        });
        common.SetObjVal('minTwineSize.codeerr', chk || minTwineSize.length === 0, rowEntity);
        common.SetObjVal('maxTwineSize.codeerr', chk || maxTwineSize.length === 0, rowEntity);
    };

    // twine size
    API.ProductTwineSize.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.twineSizes.forEach((row) => { row.filamentWord = row.filamentWord === null ? '' : row.filamentWord; });
            $scope.twineSizes = res.data.twineSizes;
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });
    $scope.twineSize = {
        value: ''
        , list: []
        , func: (key) => {
            $scope.twineSize.value = key;
        }
    };

    // unit type
    API.UnitType.Search({
        data: { groupTypes: 'S', status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.unitTypes.forEach((row, index) => { row.view = row.code + " : " + row.description; });
            $rootScope.UnitTypes = res.data.unitTypes;
            $scope.unitType.list = res.data.unitTypes;
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $scope.unitType = {
        value: ''
        , list: []
        , func: (key) => {
            $scope.unitType.value = key;
        }
    };

    // knot
    API.ProductKnot.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.knots.forEach((row, index) => { row.view = row.code + " : " + row.description; });
            $rootScope.ProductKnots = res.data.knots;
            $scope.productKnot.list = res.data.knots;
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $scope.productKnot = {
        value: ''
        , list: []
        , func: (key) => {
            $scope.productKnot.value = key;
        }
    };

    // strengching
    API.ProductStretching.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.stretchings.forEach((row, index) => { row.view = row.code + " : " + row.description; });
            $rootScope.ProductStretchings = res.data.stretchings;
            $scope.productStretching.list = res.data.stretchings;
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $scope.productStretching = {
        value: ''
        , list: []
        , func: (key) => {
            $scope.productStretching.value = key;
        }
    };

    // ProductSelvageWovenType
    API.ProductSelvageWovenType.Search({
        data: { status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.selvageWovenTypes.forEach((row, index) => { row.view = row.code + " : " + row.description; });
            $rootScope.ProductSelvageWovenTypes = res.data.selvageWovenTypes;
            $scope.productSelvageWovenType.list = res.data.selvageWovenTypes;
        }, error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $scope.productSelvageWovenType = {
        value: ''
        , list: []
        , func: (key) => {
            $scope.productStretching.value = key;
        }
    };


    $scope.AddRow = function () {
        if (!$rootScope.selectGridDiscount[1] || !$rootScope.selectGridDiscount[1].id) { common.AlertMessage('Warning', 'Please Select Price Effective Date Data.'); return; }
        var obj = {};
        common.SetObjVal('id', 0, obj);
        common.SetObjVal('discountStdMainID', $rootScope.selectGridDiscount[0].id, obj);
        common.SetObjVal('code', '', obj);
        common.SetObjVal('minTwineSize.code', '', obj);
        common.SetObjVal('minTwineSize.codeerr', true, obj);
        common.SetObjVal('maxTwineSize.code', '', obj);
        common.SetObjVal('maxTwineSize.codeerr', true, obj);
        common.SetObjVal('unitType.code', '', obj);
        common.SetObjVal('unitType.codeerr', true, obj);

        common.SetObjVal('stretching.code', '', obj);
        common.SetObjVal('knot.code', '', obj);
        common.SetObjVal('selvageWovenType.code', '', obj);

        common.SetObjVal('colorGroups.id', null, obj);
        common.SetObjVal('colorGroups.code', '', obj);
        common.SetObjVal('colorGroups.colors', [], obj);

        common.SetObjVal('status', 'A', obj);
        common.SetObjVal('isInsert', true, obj);
        common.SetObjVal('enableEdit', true, obj);

        $scope.gridOpt.data.push(obj);
        $timeout(function () {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 1]
                , $scope.gridApi.grid.options.columnDefs[1]);
            $scope.gridApi.core.scrollTo(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 2]
                , $scope.gridApi.grid.options.columnDefs[1]);
        }, 5);
        $scope.gridApi.grid.refresh();
        $scope.ChkDataChange();
    };

    $scope.RemoveRow = function (grid, row) {
        $scope.gridApi.grid.options.data.splice($scope.gridApi.grid.options.data.indexOf(row.entity), 1);
        $scope.ChkDataChange();
        $scope.gridApi.grid.refresh();
    };

    $scope.ChkDataChange = function () {
        var chk = false, chk2 = true;
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.isInsert || d.maxTwineSize.code !== d.maxTwineSize.codeorg || d.minTwineSize.code !== d.minTwineSize.codeorg
                || d.unitType.code !== d.unitType.codeorg || d.knot.code !== d.knot.codeorg || d.colorGroups.code !== d.colorGroups.codeorg
                || d.stretching.code !== d.stretching.codeorg || d.selvageWovenType.code !== d.selvageWovenType.codeorg) { chk = true; }
            if (d.maxTwineSize.codeerr || d.minTwineSize.codeerr || d.unitType.codeerr) { chk2 = false; }
        });
        $scope.btnSave = chk && chk2;
        $scope.btnCancel = chk;
        $rootScope.DiscountAddEdit('Discount Product Spec Header', chk);
    };

    $scope.UpdateStatus = (status, discountStdEffectiveDateID = '') => {
        KSSClient.API.DiscountStd.UpdateStatusRangeH({
            data: { ids: $scope.gridApi.selection.getSelectedRows().map(x => x.id), status: status, discountStdEffectiveDateID: discountStdEffectiveDateID },
            callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $scope.Cancel(); }); },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.UpdateStatusAction = (status) => {
        if (status === 'C') {
            var msg = "";
            var discountStdEffectiveDateID = $rootScope.selectGridDiscount[1].id;
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) { if (!row.totalRow) msg += row.minTwineSize.code + ' - ' + row.maxTwineSize.code + ' ' + row.unitType.code + '\n'; });
            common.ConfirmDialog('Are you sure?', 'Remove Product Spec : \n' + msg).then((ok) => { if (ok) $scope.UpdateStatus(status, discountStdEffectiveDateID); });
        } else { $scope.UpdateStatus(status, discountStdEffectiveDateID); }
    };

    $scope.Save = () => {
        var data = [];
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.isInsert || d.maxTwineSize.code !== d.maxTwineSize.codeorg || d.minTwineSize.code !== d.minTwineSize.codeorg
                || d.unitType.code !== d.unitType.codeorg || d.knot.code !== d.knot.codeorg || d.colorGroups.code !== d.colorGroups.codeorg
                || d.stretching.code !== d.stretching.codeorg || d.selvageWovenType.code !== d.selvageWovenType.codeorg) {
                data.push(d);
            }
        });
        KSSClient.API.DiscountStd.SaveRangeH({
            data: { discountStdRangeHs: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $rootScope.GridSelectDiscountChanged(1); });
            },
            error: (res) => {
                var msg = '';
                res.data.discountStdRangeHs.forEach((v) => {
                    if (v._result._status === 'F') { msg += 'Dia : ' + v.minTwineSize.code + ' - ' + v.maxTwineSize.code + ' : ' + v._result._message + '\n'; }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    };

    $scope.Cancel = function () { $rootScope.GridSelectDiscountChanged(1); }

});


///------------------------------------------------------------------ grid prodcodeprice Action ----------------------------------------------------------------------------
app.controller("discountStdAction", function ($rootScope, $scope, $timeout, uiGridConstants, $uibModal, API, $filter, common, intersales, dialog) {

    var GridClass = (grid, row, col) => {
        var cellClass = '';

        var status = common.GetObjVal('approved.statusFlag.code', row.entity);
        if ((status === 'MA' && row.entity.status !== 'C') || row.entity.status === 'I' ) {
            cellClass = 'text-primary ';
        } else if (status === 'WA' && row.entity.status !== 'C') {
            cellClass = 'text-warning ';
        } else if (status === 'AA' && row.entity.status !== 'C') {
            cellClass = 'text-success ';
        } else if (status === 'AN' || status === 'MN' || row.entity.status === 'C') {
            cellClass = 'text-danger ';
        }

        if (col.colDef.enableCellEdit) {
            if (angular.isDate(common.GetObjVal(col.name, row.entity)) && angular.isDate(common.GetObjVal(col.name + 'org', row.entity))) {
                if (common.GetObjVal(col.name, row.entity).getTime() !== common.GetObjVal(col.name + 'org', row.entity).getTime()) {
                    cellClass += 'bg-warning ';
                }
            } else if (common.GetObjVal(col.name, row.entity) !== common.GetObjVal(col.name + 'org', row.entity) && common.GetObjVal(col.name + 'org', row.entity)) {
                cellClass += 'bg-warning ';
            }
            if (common.GetObjVal(col.name + 'err', row.entity)) cellClass = 'bg-danger ';
        }

        return cellClass;
    };

    // values
    $scope.IP_DB = $rootScope.IP_DB;
    $scope.title = "Discount Product Code Value";

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableInsert: false, enableGridEdit: true/*, expandable: true*/ });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow'/*, langcode: 'GRID_VALUE_NO'*/, display: 'No', width: { min: 55, max: 65 }, format: { type: 'numRow' }, setclass: GridClass/*, focus: false*/, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'seq'/*, langCode: 'GRID_VALUE_SEQ'*/, display: 'Seq', width: { min: 55 }, setclass: GridClass, format: { type: 'decimal', scale: 0, summary: 'none' } }));
    // P
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.code'/*, langCode: 'GRID_VALUE_PDCODE'*/, edit: true, display: 'Code', width: { min: 200 }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' }, format: { type: 'helpInput', func: 'ProductPopup' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.description'/*, langCode: 'GRID_VALUE_PDDES'*/, display: 'Description', width: { min: 350 }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.detail'/*, langCode: 'GRID_VALUE_PDDES'*/, display: 'Detail', width: { min: 60 }, format: { type: 'btnPopup', func: 'ShowDetail' }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' }, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'rumType_view', display: 'Rum Type', width: { min: 150 }, setclass: GridClass }));

    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'rumType.view'/*, langCode: 'GRID_VALUE_PDRUME'*/, display: 'Rume Type', width: { min: 185 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'unitType.code', edit: true, display: 'Sale Unit', width: { min: 100 }, setclass: GridClass, format: { type: 'autocomplete', obj: 'unitType' }, cellFilter: 'mapUnitType', inputOpt: { uppercase: true } }));

    // R net
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'spec', edit: true, display: 'Edit', format: { type: 'btnPopup', func: 'SpecNetPopup' }, width: { min: 50 }, setclass: GridClass, group: { name: 'spec', display: 'Specification' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesDescription', display: 'Sales Description', width: { min: 200 }, setclass: GridClass, group: { name: 'spec', display: 'Specification' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tagDescription', display: 'Tag Description', width: { min: 250 }, setclass: GridClass, group: { name: 'spec', display: 'Specification' } }));

    // R twine
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'twineSeries.code', edit: true, display: 'Code', width: { min: 100 }, setclass: GridClass, format: { type: 'helpInput', func: 'TwineSeriesPopup' }, group: { name: 'series', display: ' Twine Series', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'twineSeries.description', display: 'Description', width: { min: 250 }, setclass: GridClass, group: { name: 'series', display: ' Twine Series', langCode: '' } }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountPercent', edit: true, display: '% Discount', width: { min: 100 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: GridClass, multiLine: true  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountAmount', edit: true, display: 'Fix Discount', width: { min: 100 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: GridClass, multiLine: true  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'increaseAmount', edit: true, display: 'Surcharge', width: { min: 100 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: GridClass, multiLine: true  }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'approved_status', display: 'Approved Status', width: { default: 120 }, setclass: GridClass, hiding: true, multiLine: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'updateFlag_view', display: 'Update Flag', width: { default: 100 }, setclass: GridClass }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', display: 'Status', width: { default: 100 }, setclass: GridClass, cellFilter: 'mapStatus', hiding: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 300 }, setclass: GridClass }));
    
    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid === row.uid) { numRow = (index + 1); }
                });
                return numRow;
            } else if (myCol.field === 'product.detail') {
                return angular.isUndefined(myRow.entity.totalRow) ? true : false;
            } else if (myCol.field === 'spec') {
                return angular.isUndefined(myRow.entity.totalRow) ? true : false;
            }
        }
        return false;
    };

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        common.ChkChange($scope);
    };

    $rootScope.discountStdAction_SetGrid = (chk) => {
        $scope.gridApi.grid.options.enableInsert = chk;
        $scope.gridApi.grid.options.enableGridEdit = chk;
        $scope.gridApi.grid.refresh();
    };

    $scope.ShowDetail = (data) => {
        dialog.ProductShowDetail({ productID: data.entity.product.id, productGradeID: $rootScope.selectGridDiscount[0].productGrade.id });
    };
    
    $scope.ProductPopup = (row) => {
        dialog.ProductModal({
            productTypeID: $rootScope.selectGridDiscount[0].productType.id
            , productGradeID: $rootScope.selectGridDiscount[0].productGrade.id
            , currencyID: $rootScope.selectGridDiscount[0].currency.id
            , countryGroupID: $rootScope.selectGridDiscount[0].countryGroup.id
            , row: row.entity
            //, products: $rootScope.products
        }).then((data) => {
            $scope.AfterEdit(row.entity, { name: 'product.code' });
        });
    };

    $scope.TwineSeriesPopup = (row) => {
        dialog.TwineSeriesModal({
            productTypeID: $rootScope.selectGridDiscount[0].productType.id
            , productGradeID: $rootScope.selectGridDiscount[0].productGrade.id
            , currencyID: $rootScope.selectGridDiscount[0].currency.id
            , countryGroupID: $rootScope.selectGridDiscount[0].countryGroup.id
            , row: row.entity
            , twineSeries: $rootScope.twineSeries
        }).then((data) => {
            $scope.AfterEdit(row.entity, { name: 'twineSeries.code' });
        });
    };

    API.UnitConvert.search({
        data: { status: 'A' },
        noloadding: true , 
        callback: (res) => { $scope.unitConverts = res.data.unitConverts; },
        error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $scope.SpecNetPopup = (row) => {
        dialog.SpecNetModal({
            productTypeID: $rootScope.selectGridDiscount[0].productType.id
            , currencyID: $rootScope.selectGridDiscount[0].currency.id
            , mainID: $rootScope.selectGridDiscount[0].id
            , productGradeID: $rootScope.selectGridDiscount[0].productGrade.id
            , countryGroupID: $rootScope.selectGridDiscount[0].countryGroup.id
            , unitConverts: $scope.unitConverts
            , row: row.entity
        }).then((data) => {
            $scope.AfterEdit(row.entity, { name: 'spec' });
        });
    };

    $scope.sortChanged = function (grid, sortColumns) {
        if (sortColumns[0] !== undefined) {
            if (sortColumns[0].colDef.name === 'product.description' || sortColumns[0].colDef.name === 'product.code') {
                switch (sortColumns[0].sort.direction) {
                    case uiGridConstants.DESC:
                        //console.log("DESC");
                        intersales.SortProduct($scope.gridOpt.data, false);
                        break;
                    default:
                        //console.log("ASC");
                        intersales.SortProduct($scope.gridOpt.data);
                        break;
                }
            }
        }
        $scope.gridApi.grid.refresh();
    };

    $scope.tableSelect = "sxsPriceStdProd";

    $scope.PN_PRICEVALUE = [
        "Discount Product Code Value"
        , "Discount Product Spec Value"
    ];
    
    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) { common.ChkChange($scope); });

        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            if (!oldRowCol || oldRowCol.row.uid !== newRowCol.row.uid) {
                $rootScope.discountStdPriceList_LoadData(newRowCol.row);
            }
        });

        gridApi.core.on.sortChanged($scope, $scope.sortChanged);

        $scope.gridApi.grid.registerRowsProcessor((renderableRows) => {
            renderableRows.forEach((row) => { if (!row.grid.options.showAllStatus && !row.entity.isInsert) if (row.entity.status === 'C') { row.isSelected = false; row.visible = false; } });
            return renderableRows;
        }, 200);

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.$apply();
            $scope.AfterEdit(rowEntity, colDef);
        });

        ////$scope.SetGridLang();
    };


    $scope.AfterEdit = (rowEntity, colDef) => {

        rowEntity.discountPercenterr = !isFinite(rowEntity.discountPercent) || rowEntity.discountPercent === '';
        rowEntity.discountAmounterr = !isFinite(rowEntity.discountAmount) || rowEntity.discountAmount === '';
        rowEntity.increaseAmounterr = !isFinite(rowEntity.increaseAmount) || rowEntity.increaseAmount === '';

        if ($rootScope.setupDiscount === 0) {
            rowEntity.product.codeerr = true;
            rowEntity.product.description = '';
            $filter('filter')($rootScope.products, { code: rowEntity.product.code }, true).forEach((d) => {
                rowEntity.product.id = d.id;
                rowEntity.product.description = d.description;
                rowEntity.product.codeerr = false;
                rowEntity.rumType_view = common.GetCodeDescription(d.rumType);
            });

            var unitType = $filter('filter')($rootScope.UnitTypes, { code: rowEntity.unitType.code }, true);
            rowEntity.unitType.codeerr = unitType.length === 0;
            if (unitType.length) rowEntity.unitType.id = unitType[0].id; else rowEntity.unitType.id = '';
            $scope.gridApi.grid.options.data.forEach((d) => {
                if (rowEntity.product.code === d.product.code
                    && rowEntity.unitType.code === d.unitType.code
                    && d.$$hashKey !== rowEntity.$$hashKey && d.status !== 'C') {
                    common.AlertMessage('Error', 'Cannot edit duplicate Data');//.then(() => { common.SetObjVal(colDef.name, '', rowEntity); });
                    common.SetObjVal(colDef.name + 'err', true, rowEntity);
                    return;
                }
            });
        } else if ($rootScope.setupDiscount === 1) {

            rowEntity.specerr = rowEntity.spec === 'I';

            if (common.GetStringVal(rowEntity.minMeshSize) === ''
                && common.GetStringVal(rowEntity.maxMeshSize) === ''
                && common.GetStringVal(rowEntity.minMeshDepth) === ''
                && common.GetStringVal(rowEntity.maxMeshDepth) === ''
                && common.GetStringVal(rowEntity.minLength) === ''
                && common.GetStringVal(rowEntity.maxLength) === '') {

                $scope.gridApi.grid.options.data.forEach((d) => {
                    if ((common.GetStringVal(d.minMeshSize) === ''
                        && common.GetStringVal(d.maxMeshSize) === ''
                        && common.GetStringVal(d.minMeshDepth) === ''
                        && common.GetStringVal(d.maxMeshDepth) === ''
                        && common.GetStringVal(d.minLength) === ''
                        && common.GetStringVal(d.maxLength) === '')
                            &&
                        (common.GetStringVal(rowEntity.minMeshSize) === common.GetStringVal(d.minMeshSize)
                        && common.GetStringVal(rowEntity.maxMeshSize) === common.GetStringVal(d.maxMeshSize)
                        && common.GetStringVal(rowEntity.minMeshDepth) === common.GetStringVal(d.minMeshDepth)
                        && common.GetStringVal(rowEntity.maxMeshDepth) === common.GetStringVal(d.maxMeshDepth)
                        && common.GetStringVal(rowEntity.minLength) === common.GetStringVal(d.minLength)
                        && common.GetStringVal(rowEntity.maxLength) === common.GetStringVal(d.maxLength))
                        && d.$$hashKey !== rowEntity.$$hashKey && d.status !== 'C') {
                        common.AlertMessage('Error', 'Spec Overlap : ' + d.tagDescription);
                        common.SetObjVal(colDef.name + 'err', true, rowEntity);
                        return;
                    }
                });
            } else {
                $scope.gridApi.grid.options.data.forEach((d) => {
                    if (!(common.GetStringVal(d.minMeshSize) === ''
                        && common.GetStringVal(d.maxMeshSize) === ''
                        && common.GetStringVal(d.minMeshDepth) === ''
                        && common.GetStringVal(d.maxMeshDepth) === ''
                        && common.GetStringVal(d.minLength) === ''
                        && common.GetStringVal(d.maxLength) === '')
                            &&
                        (intersales.NRange(rowEntity.minMeshSize, rowEntity.maxMeshSize, d.minMeshSize, d.maxMeshSize)
                        && intersales.NRange(rowEntity.minMeshDepth, rowEntity.maxMeshDepth, d.minMeshDepth, d.maxMeshDepth)
                        && intersales.NRange(rowEntity.minLength, rowEntity.maxLength, d.minLength, d.maxLength))
                        && d.$$hashKey !== rowEntity.$$hashKey && d.status !== 'C') {
                        common.AlertMessage('Error', 'Spec Overlap : ' + d.tagDescription);
                        common.SetObjVal(colDef.name + 'err', true, rowEntity);
                        return;
                    }
                });
            }            
        } else if ($rootScope.setupDiscount === 2) {
            if (!rowEntity.twineSeries.code) {
                rowEntity.twineSeries.id = null;
                rowEntity.twineSeries.codeerr = false;
                rowEntity.tagDescription = rowEntity.salesDescription = rowEntity.twineSeries.description = 'any';
            } else {
                rowEntity.twineSeries.codeerr = true;
                rowEntity.tagDescription = rowEntity.salesDescription = rowEntity.twineSeries.description = '';
                $filter('filter')($rootScope.twineSeries, { code: rowEntity.twineSeries.code }, true).forEach((d) => {
                    rowEntity.twineSeries.id = d.id;
                    rowEntity.tagDescription = rowEntity.salesDescription = rowEntity.twineSeries.description = d.description;
                    rowEntity.twineSeries.codeerr = false;
                });
            }
            $scope.gridApi.grid.options.data.forEach((d) => {
                if (rowEntity.twineSeries.code === d.twineSeries.code
                    && d.$$hashKey !== rowEntity.$$hashKey && d.status !== 'C') {
                    common.AlertMessage('Error', 'Cannot edit duplicate Data');
                    rowEntity.twineSeries.codeerr = true;
                    common.SetObjVal(colDef.name + 'err', true, rowEntity);
                    return;
                }
            });
        }

        //if (rowEntity.discountPercent === 0 && rowEntity.discountAmount === 0 && rowEntity.increaseAmount === 0) {
        //    if (colDef.name === 'discountPercent' || colDef.name === 'discountAmount' || colDef.name === 'increaseAmount') common.AlertMessage('Error', 'Price discountPercent, discountAmount, increaseAmount must have one value, not zero.');
        //    rowEntity.discountPercenterr = rowEntity.discountAmounterr = rowEntity.increaseAmounterr = true;
        //}

        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        $rootScope.discountStdPriceList_LoadData({ entity: rowEntity });
        $scope.ChkDataChange();
    };

    $scope.show0 = ['product.code', 'product.description', 'product.detail', 'rumType_view', 'unitType.code'];
    $scope.show1 = ['spec', 'tagDescription', 'salesDescription'];
    $scope.show2 = ['twineSeries.code', 'twineSeries.description'];

    $scope.hideCol = [];

    $rootScope.GetDiscountSearchAction = function (setupDiscount = -1, discountEffectiveDateID = '', discountRangeHID = '') {
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        common.GridClearAll($scope);
        if (!discountEffectiveDateID || (setupDiscount !== 0 && !discountRangeHID)) return;
        $scope.ChkDataChange();
        switch (setupDiscount) {
            case 0: //$scope.gridOpt.columnDefs = gridAction0;
                $scope.title = $scope.PN_PRICEVALUE[0];
                $scope.hideCol = $scope.show1.concat($scope.show2);
                break;
            case 1: //$scope.gridOpt.columnDefs = gridAction1;
                $scope.title = $scope.PN_PRICEVALUE[1];
                $scope.hideCol = $scope.show0.concat($scope.show2);
                break;
            case 2: //$scope.gridOpt.columnDefs = gridAction2;
                $scope.title = $scope.PN_PRICEVALUE[1];
                $scope.hideCol = $scope.show0.concat($scope.show1);
                break;
            default: return false;
        }

        $scope.gridOpt.columnDefs.forEach((c1) => {
            if (c1.field !== 'numRow') {
                c1.enableHiding = true;
                c1.visible = true;
            }
            if ($scope.hideCol.find((c2) => { return c2 === c1.field; })) {
                c1.enableHiding = false;
                c1.visible = false;
            }
        });

        //$scope.SetGridLang();

        if (setupDiscount === 0) {
            $scope.tableSelect = "sxsDiscountStdProd";
            KSSClient.API.DiscountStd.SearchDiscountProd({
                data: { discountEffectiveDateID: discountEffectiveDateID },
                callback: function (res) {
                    res.data.discountStdValues.forEach(function (row) {
                        row.unitType.codeorg = row.unitType.code;
                        row.product.codeorg = row.product.code;
                        row.discountPercentorg = row.discountPercent;
                        row.discountAmountorg = row.discountAmount;
                        row.increaseAmountorg = row.increaseAmount;
                        row.rumType_view = common.GetCodeDescription(row.rumType);
                        row.enableEdit = row.status !== 'C';
                        row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;
                        row.sort = KSSClient.Engine.Common.convertProductCodeToObject(row.product.description);

                        row.approved_status = common.GetCodeDescription(row.approved.statusFlag);
                        row.updateFlag_view = common.GetCodeDescription(row.updateFlag);
                    });
                    $scope.gridOpt.data = res.data.discountStdValues;
                    intersales.SortProduct($scope.gridOpt.data);

                    $scope.gridApi.grid.refresh();
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        }
        else {
            $scope.tableSelect = "sxsDiscountStdRangeD";
            KSSClient.API.DiscountStd.SearchDiscountRangeValue({
                data: { discountEffectiveDateID: discountEffectiveDateID, discountRangeHID: discountRangeHID },
                callback: function (res) {
                    res.data.discountStdValues.forEach(function (row, index) {
                        row.discountPercentorg = row.discountPercent;
                        row.discountAmountorg = row.discountAmount;
                        row.increaseAmountorg = row.increaseAmount;

                        row.twineSeries.codeorg = row.twineSeries.code;

                        row.minMeshSizeorg = row.minMeshSize;
                        row.maxMeshSizeorg = row.maxMeshSize;
                        row.minMeshDepthorg = row.minMeshDepth;
                        row.maxMeshDepthorg = row.maxMeshDepth;
                        row.minLengthorg = row.minLength;
                        row.maxLengthorg = row.maxLength;
                        row.specorg = row.spec = 'R';
                        row.enableEdit = row.status !== 'C';
                        row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;

                        row.approved_status = common.GetCodeDescription(row.approved.statusFlag);
                        row.updateFlag_view = common.GetCodeDescription(row.updateFlag);
                    });
                    $scope.gridOpt.data = res.data.discountStdValues;
                    $scope.gridApi.grid.refresh();
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });

            // load spec distinct

            $scope.specs = [];

        }
    };

    $scope.unitType = {
        value: ''
        , list: $rootScope.UnitTypes
        , func: (key) => {
            $scope.unitType.value = key;
        }
    };

    $scope.AddRow = () => {

        if ($rootScope.setupDiscount === 0) {
            if (!$rootScope.selectGridDiscount[1] || !$rootScope.selectGridDiscount[1].id) { common.AlertMessage('Warning', 'Please Select Price Effective Date Data.'); return; }
        } else if ($rootScope.setupDiscount > 0) {  //  1 net  2 twine
            if (!$rootScope.selectGridDiscount[2] || !$rootScope.selectGridDiscount[2].id) { common.AlertMessage('Warning', 'Please Select Price Product Spec H Data.'); return; }
        }
        
        if ($rootScope.setupDiscount === 0) {
            dialog.ProductModal({
                productTypeID: $rootScope.selectGridDiscount[0].productType.id
                , productGradeID: $rootScope.selectGridDiscount[0].productGrade.id
                , currencyID: $rootScope.selectGridDiscount[0].currency.id
                , countryGroupID: $rootScope.selectGridDiscount[0].countryGroup.id
                , mSelect: true
                //, products: $rootScope.products
            }).then((data) => {
                data.forEach((d) => {
                    var tmp = $scope.AddRowAction(d);
                    $scope.AfterEdit(tmp, { name: 'product.code' });
                });
            });
        } else if ($rootScope.setupDiscount === 1) { //net
            dialog.SpecNetModal({
                productTypeID: $rootScope.selectGridDiscount[0].productType.id
                , currencyID: $rootScope.selectGridDiscount[0].currency.id
                , mainID: $rootScope.selectGridDiscount[0].id
                , productGradeID: $rootScope.selectGridDiscount[0].productGrade.id
                , countryGroupID: $rootScope.selectGridDiscount[0].countryGroup.id
                , unitConverts: $scope.unitConverts
                , mSelect: true
            }).then((data) => {
                data.forEach((d) => {
                    var tmp = $scope.AddRowAction(d);
                    $scope.AfterEdit(tmp, { name: 'spec' });
                });
            });
        } else if ($rootScope.setupDiscount === 2) { //twine
            dialog.TwineSeriesModal({
                productTypeID: $rootScope.selectGridDiscount[0].productType.id
                , productGradeID: $rootScope.selectGridDiscount[0].productGrade.id
                , currencyID: $rootScope.selectGridDiscount[0].currency.id
                , countryGroupID: $rootScope.selectGridDiscount[0].countryGroup.id
                , mSelect: true
                , twineSeries: $rootScope.twineSeries
            }).then((data) => {
                data.forEach((d) => {
                    var tmp = $scope.AddRowAction(d);
                    $scope.AfterEdit(tmp, { name: 'twineSeries.code' });
                });
            });
        }
    };

    $scope.AddRowAction = (d) => {
        
        var obj = {};
        common.SetObjVal('id', 0, obj);
        common.SetObjVal('discountStdMainID', $rootScope.selectGridDiscount[0].id, obj);
        common.SetObjVal('discountEffectiveDateID', $rootScope.selectGridDiscount[1].id, obj);

        var tmp = {};

        if ($rootScope.setupDiscount === 0) common.SetObjVal('discountStdProdID', 0, obj);
        else {
            common.SetObjVal('discountRangeDID', 0, obj);
            common.SetObjVal('discountRangeHID', $rootScope.selectGridDiscount[2].id, obj);
        }

        if ($rootScope.setupDiscount === 0) {
            common.SetObjVal('product.id', common.GetObjVal('id', d), obj);
            common.SetObjVal('product.code', common.GetObjVal('code', d), obj);
            common.SetObjVal('product.description', common.GetObjVal('description', d), obj);
            common.SetObjVal('product.codeerr', !common.GetObjVal('id', d), obj);

            common.SetObjVal('rumType', common.GetObjVal('rumType', d), obj);
            common.SetObjVal('rumType_view', common.GetObjVal('rumType_view', d), obj);

            common.SetObjVal('unitType.code', '', obj);
            common.SetObjVal('unitType.codeerr', true, obj);

            tmp = $filter('filter')($scope.gridApi.grid.options.columnDefs, { field: 'product.code' }, true);
        } else if ($rootScope.setupDiscount === 1) {
            common.SetObjVal('spec', common.GetObjVal('spec', d), obj);
            //common.SetObjVal('specerr', true, obj);
            common.SetObjVal('minMeshSize', common.GetObjVal('minMeshSize', d), obj);
            common.SetObjVal('maxMeshSize', common.GetObjVal('maxMeshSize', d), obj);
            common.SetObjVal('minMeshDepth', common.GetObjVal('minMeshDepth', d), obj);
            common.SetObjVal('maxMeshDepth', common.GetObjVal('maxMeshDepth', d), obj);
            common.SetObjVal('minLength', common.GetObjVal('minLength', d), obj);
            common.SetObjVal('maxLength', common.GetObjVal('maxLength', d), obj);
            common.SetObjVal('tagDescription', common.GetObjVal('tagDescription', d), obj);
            common.SetObjVal('salesDescription', common.GetObjVal('salesDescription', d), obj);

            tmp = $filter('filter')($scope.gridApi.grid.options.columnDefs, { field: 'minMeshSize' }, true);

        } else if ($rootScope.setupDiscount === 2) {
            common.SetObjVal('twineSeries.id', common.GetObjVal('id', d), obj);
            common.SetObjVal('twineSeries.code', common.GetObjVal('code', d), obj);
            common.SetObjVal('twineSeries.description', !common.GetObjVal('description', d) ? 'any' : common.GetObjVal('description', d), obj);
            common.SetObjVal('twineSeries.codeerr', false, obj);

            tmp = $filter('filter')($scope.gridApi.grid.options.columnDefs, { field: 'twineSeries.code' }, true);
        }

        //common.SetObjVal('subGridOpt', angular.copy($scope.subGridOpt), obj);

        common.SetObjVal('discountPercent', 0, obj);
        common.SetObjVal('discountPercenterr', false, obj);
        common.SetObjVal('discountAmount', 0, obj);
        common.SetObjVal('discountAmounterr', false, obj);
        common.SetObjVal('increaseAmount', 0, obj);
        common.SetObjVal('increaseAmounterr', false, obj);

        common.SetObjVal('approve.date', '', obj);

        common.SetObjVal('status', 'A', obj);
        //common.SetObjVal('isInsert', true, obj);
        common.SetObjVal('enableEdit', true, obj);

        $scope.gridOpt.data.push(obj);
        $timeout(function () {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 1]
                , tmp[tmp.length - 1]);
            $scope.gridApi.core.scrollTo(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 2]
                , tmp[tmp.length - 1]);
        }, 5);
        $scope.gridApi.grid.refresh();
        $scope.ChkDataChange();
        return obj;
    };

    $scope.RemoveRow = () => {
        $scope.gridApi.selection.getSelectedRows().forEach((d) => {
            $scope.gridApi.grid.options.data.splice($scope.gridApi.grid.options.data.indexOf(d), 1);
        });
        $scope.ChkDataChange();
        $scope.gridApi.grid.refresh();
        $timeout(() => { common.ChkChange($scope); }, 1);
    };

    $scope.ChkDataChange = () => {
        var chk = false, chk2 = true;
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (!d.id || d.discountPercent !== d.discountPercentorg || d.discountAmount !== d.discountAmountorg || d.increaseAmount !== d.increaseAmountorg) { chk = true; }
            if (d.discountPercenterr || d.discountAmounterr || d.increaseAmounterr) { chk2 = false; }
            if (!chk || chk2) {
                if ($rootScope.setupDiscount === 0) {
                    if (d.product.code !== d.product.codeorg || d.unitType.code !== d.unitType.codeorg) { chk = true; }
                    if (d.product.codeerr || d.unitType.codeerr) { chk2 = false; }
                } else if ($rootScope.setupDiscount === 1) { //net 
                    if (d.minMeshSize !== d.minMeshSizeorg
                        || d.maxMeshSize !== d.maxMeshSizeorg
                        || d.minMeshDepth !== d.minMeshDepthorg
                        || d.maxMeshDepth !== d.maxMeshDepthorg
                        || d.minLength !== d.minLengthorg
                        || d.maxLength !== d.maxLengthorg
                        || d.spec !== d.specorg
                    ) { chk = true; }
                    if (d.specerr) { chk2 = false; }
                } else if ($rootScope.setupDiscount === 2) { // twine
                    if (d.twineSeries.code !== d.twineSeries.codeorg) { chk = true; }
                    if (d.twineSeries.codeerr) { chk2 = false; }
                }
            }
        });

        $scope.btnSave = chk && chk2;
        $scope.btnCancel = chk;
        if ($rootScope.setupDiscount === 0) { $rootScope.DiscountAddEdit('Discount Product Code Value', chk); }
        else { $rootScope.DiscountAddEdit('Discount Product Spec Value', chk); }
    };

    $scope.UpdateStatus = (status) => {
        //var ids1 = [], ids = [];
        //$scope.gridApi.selection.getSelectedRows().forEach((d) => {
        //    if (d.id) {
        //        ids1.push($rootScope.selectGridDiscount[0].type === 'R' ? d.discountRangeDID : d.discountStdProdID);
        //        ids.push(d.id);
        //    }
        //});
        var ids1 = $rootScope.selectGridDiscount[0].type === 'R' ? $scope.gridApi.selection.getSelectedRows().map(x => x.discountRangeDID) : $scope.gridApi.selection.getSelectedRows().map(x => x.discountStdProdID);
        KSSClient.API.DiscountStd.UpdateStatusValue({
            data: { ids: $scope.gridApi.selection.getSelectedRows().map(x => x.id), ids1: ids1, type: $rootScope.selectGridDiscount[0].type, status: status },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $scope.Cancel(); });
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });

        //if (insertOnly) { $scope.RemoveRow(); }
        //else {
        //    KSSClient.API.DiscountStd.UpdateStatusValue({
        //        data: { ids: $scope.gridApi.selection.getSelectedRows().map(x => x.id), ids1: ids1, type: $rootScope.selectGridDiscount[0].type, status: status },
        //        callback: (res) => {
        //            common.AlertMessage('Success', '').then((ok) => {
        //                //if (status === 'C') { $scope.RemoveRow(); }
        //                //else { $scope.Cancel(); }
        //                $scope.Cancel();
        //            });
        //        },
        //        error: (res) => { common.AlertMessage("Error", res.message); }
        //    });
        //}
    };

    $scope.UpdateStatusAction = (status) => {
        if (status === 'C') {
            var msg = "", msg1 = '', insertOnly = true;
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                if (row.id) { insertOnly = false; }
                if ($rootScope.setupDiscount === 0) {
                    msg1 = 'Product Code';
                    msg += row.product.code + '\n';
                } else if ($rootScope.setupDiscount === 1) {
                    msg1 = 'Tag Description';
                    msg += row.tagDescription + '\n';
                } else {
                    msg1 = 'Twine Series Code';
                    msg += row.twineSeries.code + '\n';
                }
            });
            if (insertOnly) { $scope.RemoveRow(); }
            else { common.ConfirmDialog('Are you sure?', 'Remove ' + msg1 + ' : \n' + msg).then((ok) => { if (ok) $scope.UpdateStatus(status); }); }
        } else { $scope.UpdateStatus(status); }
    };

    $scope.Save = () => {
        var data = [], chkValue = false, chkApproved = false;
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (!d.id || d.discountPercent !== d.discountPercentorg || d.discountAmount !== d.discountAmountorg || d.increaseAmount !== d.increaseAmountorg) {
                if (d.id) {
                    chkValue = true;
                }
                data.push(d);
            }
            else {
                if ($rootScope.setupDiscount === 0) {
                    if (d.product.code !== d.product.codeorg || d.unitType.code !== d.unitType.codeorg) { data.push(d); }
                } else if ($rootScope.setupDiscount === 1) { //net 
                    if (d.minMeshSize !== d.minMeshSizeorg
                        || d.maxMeshSize !== d.maxMeshSizeorg
                        || d.minMeshDepth !== d.minMeshDepthorg
                        || d.maxMeshDepth !== d.maxMeshDepthorg
                        || d.minLength !== d.minLengthorg
                        || d.maxLength !== d.maxLengthorg
                        || d.spec !== d.specorg
                    ) { data.push(d); }
                } else if ($rootScope.setupDiscount === 2) { // twine
                    if (d.twineSeries.code !== d.twineSeries.codeorg) { data.push(d); }
                }
            }
            if (common.GetObjVal('approved.flag', d) === 'A') {
                chkApproved = true;
            }
        });

        if (chkValue && chkApproved) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                controller: 'discountEffectiveDateModalCtrl',
                size: 'xs',
                appendTo: undefined,
                resolve: {
                    data: function () {
                        return {
                            discountStdMain: { id: $rootScope.selectGridDiscount[0].id, code: $rootScope.selectGridDiscount[0].code }
                            , effectiveDateFrom: $rootScope.selectGridDiscount[1].effectiveDateFrom
                            , effectiveDateTo: $rootScope.selectGridDiscount[1].effectiveDateTo
                        };
                    }
                },
                backdrop: 'static',
                keyboard: false,
                templateUrl: 'discountEffectiveDateModalContent.html'
            });
            modalInstance.result.then((effectiveDateID) => {
                if (effectiveDateID !== $rootScope.selectGridDiscount[1].id) {
                    data.forEach((d) => { d.discountEffectiveDateID = effectiveDateID; });
                    if ($rootScope.setupDiscount === 0) {
                        KSSClient.API.DiscountStd.SearchDiscountProd({
                            data: { discountEffectiveDateID: $rootScope.selectGridDiscount[1].id, status: ['A', 'I'] },
                            callback: (res) => {
                                res.data.discountStdValues.forEach((d) => {
                                    d.discountEffectiveDateID = effectiveDateID;
                                    if (!$filter('filter')(data, { id: d.id }, true).length) {
                                        d.cloneFlag = true;
                                        data.push(d);
                                    }
                                });
                                $scope.SaveAction(data);
                            },
                            error: (res) => { common.AlertMessage("Error", res.message); }
                        });
                    } else {
                        KSSClient.API.DiscountStd.SearchDiscountRangeValue({
                            data: { discountEffectiveDateID: $rootScope.selectGridDiscount[1].id, status: ['A', 'I'] },
                            callback: (res) => {
                                res.data.discountStdValues.forEach((d) => {
                                    d.discountEffectiveDateID = effectiveDateID;
                                    if (!$filter('filter')(data, { id: d.id }, true).length) {
                                        d.cloneFlag = true;
                                        data.push(d);
                                    }
                                });
                                $scope.SaveAction(data);
                            },
                            error: (res) => { common.AlertMessage("Error", res.message); }
                        });
                    }
                } else {
                    $scope.SaveAction(data);
                }
                
            }, () => { });

        } else {
            $scope.SaveAction(data);
        }
    };

    $scope.SaveAction = (data) => {
        if ($rootScope.setupDiscount === 0) {
            KSSClient.API.DiscountStd.SaveProdValue({
                data: { discountStdValues: data },
                callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $rootScope.GridSelectDiscountChanged(1); }); },
                error: (res) => {
                    var msg = '';
                    res.data.discountStdValues.forEach((v) => { if (v._result._status === 'F') { msg += 'Product : ' + v.product.code + ' ' + v.product.description + ' : ' + v._result._message + '\n'; } });
                    common.AlertMessage("Error", res.message + '\n' + msg);
                }
            });
        } else {
            KSSClient.API.DiscountStd.SaveRangeValue({
                data: { discountStdValues: data },
                callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $rootScope.GridSelectDiscountChanged(2); }); },
                error: (res) => {
                    var msg = '';
                    res.data.discountStdValues.forEach((v) => {
                        if (v._result._status === 'F') {
                            if ($rootScope.setupDiscount === 1) msg += 'Spec : ' + v.tagDescription + ' : ' + v._result._message + '\n';
                            else msg += 'Twine Series : ' + v.twineSeries.code + ' ' + v.twineSeries.description + ' : ' + v._result._message + '\n';
                        }
                    });
                    common.AlertMessage("Error", res.message + '\n' + msg);
                }
            });
        }
    };

    $scope.Cancel = function () {
        if ($rootScope.setupDiscount === 0) { $rootScope.GridSelectDiscountChanged(1); }
        else { $rootScope.GridSelectDiscountChanged(2); }
    };

    $scope.ReplaceClick = () => {
        dialog.ReplaceDiscountModal({}).then((data) => {
            $scope.gridApi.selection.getSelectedRows().forEach((d) => {
                d.discountPercent = data.percent;
                d.discountAmount = data.amount;
                d.increaseAmount = data.increase;
                $scope.AfterEdit(d, 'discountPercent');
            });

            $scope.gridApi.selection.clearSelectedRows();
            common.ChkChange($scope);
        });
    };

    $scope.AddMultiClick = () => {
        dialog.AddMultiItemsModal({
            data: $rootScope.setupDiscount === 0 ? $rootScope.products : $rootScope.setupDiscount === 1 ? $rootScope.twineSeries : $scope.specs
        }).then((data) => {
            $scope.AfterEdit(row.entity, { name: 'product.code' });
        });

        //if ($rootScope.setupDiscount === 0) {
        //    $rootScope.GridSelectDiscountChanged(1);

        //} else if ($rootScope.setupDiscount === 1) { // net

        //    $rootScope.GridSelectDiscountChanged(2);
        //} else { // twine

        //    $rootScope.GridSelectDiscountChanged(2);
        //}
    };

});

app.controller('discountEffectiveDateModalCtrl', function ($scope, common, data, $uibModalInstance) {

    $scope.start = common.GetDateString(data.effectiveDateFrom);
    $scope.max = common.GetDateString(data.effectiveDateTo);
    $scope.effectiveDateFrom = new Date();
    $scope.effectiveDateTo = data.effectiveDateTo;

    $scope.DateChk = () => {
        $scope.effectiveDateFrom.setHours(0, 0, 0, 0);
        $scope.effectiveDateTo.setHours(0, 0, 0, 0);
        if ($scope.effectiveDateFrom.getTime() > $scope.effectiveDateTo.getTime()) {
            common.AlertMessage('Error', 'Effective Date From > Effective Date To.');
            $scope.btnOk = false;
        } else {
            $scope.btnOk = true;
        }
    };
    $scope.DateChk();

    $scope.ok = function () {
        var tmpData = [{
            discountStdMain: data.discountStdMain
            , effectiveDateFrom: common.GetDateString($scope.effectiveDateFrom)
            , effectiveDateTo: common.GetDateString($scope.effectiveDateTo)
            , status: 'A'
        }];
        KSSClient.API.DiscountStd.SaveEffectiveDate({
            data: { discountStdEffectiveDates: tmpData },
            callback: (res) => {
                $uibModalInstance.close(res.data.discountStdEffectiveDates[0].id);
                //common.AlertMessage('Success', '').then((ok) => {  });
            },
            error: (res) => {
                var msg = '';
                res.data.discountStdEffectiveDates.forEach((v) => {
                    if (v._result._status === 'F') {
                        msg += 'Effective Date : ' + common.GetDateView(common.CreateDateTime(v.effectiveDateFrom)) + ' - ' + common.GetDateView(common.CreateDateTime(v.effectiveDateTo)) + ' : ' + v._result._message + '\n';
                    }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
        
    };

    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});

///------------------------------------------------------------------ grid Price Rest ----------------------------------------------------------------------------
app.controller("discountStdPriceList", function ($rootScope, $scope, common, intersales, API) {    

    var SetClass = function (grid, row, col) {
        var classx = '';
        if (col.colDef.type === 'number') {
            if (common.GetObjVal(col.colDef.field, row.entity) < 0) classx += 'text-danger';
        }
        return classx;
    };

    $scope.gridOpt = common.CreateGrid2({ footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 65 }, format: { type: 'numRow' } }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountStdTableCode', display: 'Discount code', width: { min: 170 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'priceStdTableCode', display: 'code', width: { min: 150 }, group: { name: 'price', display: 'Price', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesDescription', display: 'Sales Description', width: { min: 300 }, group: { name: 'price', display: 'Price', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tagDescription', display: 'Tag Description', width: { min: 300 }, group: { name: 'price', display: 'Price', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateFrom', display: 'From', format: { type: 'datetime' }, width: { min: 90 }, group: { name: 'priceeff', display: 'Price Effective Date', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateTo', display: 'To', format: { type: 'datetime' }, width: { min: 90 }, group: { name: 'priceeff', display: 'Price Effective Date', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'priceFOB', display: 'HC', width: { min: 70 }, format: { type: 'decimal', scale: 2 }, group: { name: 'fob', display: 'FOB', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'restFOB', display: 'Net Price', width: { min: 70 }, format: { type: 'decimal', scale: 2 }, group: { name: 'fob', display: 'FOB', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'priceCAF', display: 'HC', width: { min: 70 }, format: { type: 'decimal', scale: 2 }, group: { name: 'caf', display: 'C&F', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'restCAF', display: 'Net Price', width: { min: 70 }, format: { type: 'decimal', scale: 2 }, group: { name: 'caf', display: 'C&F', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'priceCIF', display: 'HC', width: { min: 70 }, format: { type: 'decimal', scale: 2 }, group: { name: 'cif', display: 'CIF', langCode: '' }, setclass: SetClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'restCIF', display: 'Net Price', width: { min: 70 }, format: { type: 'decimal', scale: 2 }, group: { name: 'cif', display: 'CIF', langCode: '' }, setclass: SetClass }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => {
                    if (myRow.uid === row.uid) { numRow = row.entity.no = (index + 1); return; }
                });
                return numRow;
            } else if (myCol.field === "effectiveDateFrom") {
                return common.GetDateView(myRow.entity.effectiveDateFrom);
            } else if (myCol.field === "effectiveDateTo") {
                return common.GetDateView(myRow.entity.effectiveDateTo);
            }
        } 
        return false;
    };

    $scope.SetGridLang = function () {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "SETUP_COST_PRICESTD" },
            callback: function (obj) {
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) { }
        });
    };
    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        $scope.SetGridLang();
    };
       

    $rootScope.discountStdPriceList_LoadData = (row) => {
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        if (!row) return;
        var tmp = $rootScope.selectGridDiscount[2];

        API.PriceStd.SearchPriceForDiscount({
            data: {
                effectiveDateTo: common.GetDateString($rootScope.selectGridDiscount[1].effectiveDateTo)
                , effectiveDateFrom: common.GetDateString($rootScope.selectGridDiscount[1].effectiveDateFrom)
                , customerID: $rootScope.selectGridDiscount[0].customer.id
                , productID: common.GetObjVal('product.id', row.entity)
                , productTypeID: $rootScope.selectGridDiscount[0].productType.id
                , productGradeID: $rootScope.selectGridDiscount[0].productGrade.id
                , currencyID: $rootScope.selectGridDiscount[0].currency.id
                , unitTypeID: $rootScope.setupDiscount === 0 ? common.GetObjVal('unitType.id', row.entity) : common.GetObjVal('unitType.id', tmp)
                , minTwineSizeCode: common.GetObjVal('minTwineSize.code', tmp)
                , maxTwineSizeCode: common.GetObjVal('maxTwineSize.code', tmp)
                , knotID: common.GetObjVal('knot.id', tmp)
                , stretchingID: common.GetObjVal('stretching.id', tmp)
                , selvageWovenTypeID: common.GetObjVal('selvageWovenType.id', tmp)
                , colorGroupID: common.GetObjVal('colorGroups.id', tmp)
                , twineseriesID: common.GetObjVal('twineSeries.id', row.entity)
                , minMeshSize: common.GetObjVal('minMeshSize', row.entity)
                , maxMeshSize: common.GetObjVal('maxMeshSize', row.entity)
                , minMeshDepth: common.GetObjVal('minMeshDepth', row.entity)
                , maxMeshDepth: common.GetObjVal('maxMeshDepth', row.entity)
                , minLength: common.GetObjVal('minLength', row.entity)
                , maxLength: common.GetObjVal('maxLength', row.entity)
            },
            callback: (res) => {
                res.data.prices.forEach((r) => {
                    r.effectiveDateFrom = common.CreateDateTime(r.effectiveDateFrom);
                    r.effectiveDateTo = common.CreateDateTime(r.effectiveDateTo);
                    r.restFOB = intersales.PriceToRest(r.priceFOB, row.entity.discountPercent, row.entity.discountAmount, row.entity.increaseAmount);
                    r.restCAF = intersales.PriceToRest(r.priceCAF, row.entity.discountPercent, row.entity.discountAmount, row.entity.increaseAmount);
                    r.restCIF = intersales.PriceToRest(r.priceCIF, row.entity.discountPercent, row.entity.discountAmount, row.entity.increaseAmount);
                });

                $scope.gridOpt.data = res.data.prices;
                $scope.gridApi.grid.refresh();
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };
});