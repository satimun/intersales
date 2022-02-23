'use strict';
app.controller("priceStdController", function ($rootScope, $scope, common, $uibModal, $document, $window, $filter, $timeout, API) {

    $rootScope.setupPrice = 2;
    $rootScope.priceprod = true;
    $rootScope.selectGrid = [undefined, undefined, undefined];
    $rootScope.priceChange = { table: '', change: false };

    // set value from model
    var $modalPriceStd = this;

    $rootScope.CountryGroupList = {};
    $rootScope.PriceStdMainType = {};

    // init value prodcodeprice SearchEffectDate
    $rootScope.PriceStdEffectiveDateStatus = {};
    $rootScope.PriceStdApproveStatus = {};

    $scope.dtpFrom = new Date();
    $scope.dtpFrom.setDate($scope.dtpFrom.getDate() - 30);
    $scope.dtpTo = new Date();
    $scope.dtpTo.setDate($scope.dtpTo.getDate() + 30);

    $rootScope.setupPrice = -1;

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

    $rootScope.GridSelectChanged = function (grid) {
        if ($rootScope.selectGrid[0] !== undefined) {
            if (grid === 0) {
                //$rootScope.setupPrice = -1;
                $rootScope.GetPriceStdEffectiveDates($rootScope.selectGrid[grid].id, $scope.dtpFrom, $scope.dtpTo);
                if ($rootScope.selectGrid[0].type === 'C') {
                    $timeout(() => { $scope.LoadProduct({ productTypeID: $rootScope.selectGrid[0].productType.id, productGradeID: $rootScope.selectGrid[0].productGrade.id }); });
                } else {
                    $timeout(() => { $scope.LoadColorGroup({ countryGroupIDs: $rootScope.selectGrid[0].countryGroup.id, productTypeID: $rootScope.selectGrid[0].productType.id, productGradeID: $rootScope.selectGrid[0].productGrade.id }); });
                    if ($filter('filter')($rootScope.ProductTypes, { code: $rootScope.selectGrid[0].productType.code, groupType: 'T' }).length) {
                        $timeout(() => { $scope.LoadTwineSeries({ productTypeID: $rootScope.selectGrid[0].productType.id }); });
                    }
                }
                $rootScope.GetPriceSearchAction();
            } else if (grid === 1) {
                //$rootScope.setupPrice = -1;
                $rootScope.GetPriceSearchAction();
                if ($rootScope.selectGrid[grid] !== undefined) {
                    if ($rootScope.selectGrid[0].type === 'C') {
                        $rootScope.setupPrice = 0;
                        $rootScope.GetPriceSearchAction($rootScope.setupPrice, $rootScope.selectGrid[grid].id, 0);
                    }
                    else if ($rootScope.selectGrid[0].type === 'R') {
                        if ($filter('filter')($rootScope.ProductTypes, { code: $rootScope.selectGrid[0].productType.code, groupType: 'N' }).length) { $rootScope.setupPrice = 1; }
                        else if ($filter('filter')($rootScope.ProductTypes, { code: $rootScope.selectGrid[0].productType.code, groupType: 'T' }).length) { $rootScope.setupPrice = 2; }
                        else { return false; }
                    } else { return false; }
                    $rootScope.GetSearchPriceRangeH($rootScope.setupPrice, $rootScope.selectGrid[grid].id);
                } else {
                    //$rootScope.setupPrice = -1;
                    $rootScope.GetSearchPriceRangeH();
                }
            } else if (grid === 2) {
                if ($rootScope.selectGrid[grid] !== undefined) {
                    $rootScope.GetPriceSearchAction($rootScope.setupPrice, $rootScope.selectGrid[grid - 1].id, $rootScope.selectGrid[grid].id);
                } else {
                    $rootScope.GetPriceSearchAction();
                }
            }
        } else {
            //$rootScope.setupPrice = -1;
            $rootScope.GetPriceStdEffectiveDates();
            $rootScope.GetSearchPriceRangeH();
        }
        //console.log($rootScope.selectGrid[grid]);
    };

    $rootScope.CountryGroupList = [];
    //$scope.PH_countryGroup = "ใส่ข้อมูล code กลุ่มประเทศ หรือ ประเทศ";

    API.CountryGroup.SearchCountry({
        data: { groupTypes: 'P', status: 'A' },
        noloadding: true,
        callback: (res) => {
            res.data.countryGroups.forEach(function (row, index) {
                row.view = common.GetCodeDescription(row);
                row.subview = "";
                row.countrys.forEach(function (r2, i) {
                    if (row.countrys.length - 1 === i) row.subview += r2.code + " : " + r2.description.trim();
                    else row.subview += r2.code + " : " + r2.description.trim() + ", ";
                });
            });
            $rootScope.CountryGroupList = res.data.countryGroups;
        },
        error: (res) => { common.AlertMessage("Error", res.message); }
    });

    KSSClient.API.Constant.PriceStdMainType({
        data: {},
        callback: function (res) {
            res.data.priceStdMainType.forEach(function (row, index) {
                row.view = row.code + " : " + row.description;
            });
            $rootScope.PriceStdMainType = res.data.priceStdMainType;
            ////LoadPriceStdMain
            //$scope.GetPriceStdMain();
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });

    $scope.countryGroupID = 0;
    $scope.SetCountryGroupID = function (countryGroupID) {
        $scope.countryGroupID = countryGroupID;
        //$scope.GetPriceStdMain();
    };

    var SetDate = () => {
        $rootScope.GetPriceStdMain($scope.countryGroupID, $scope.productType.id, $scope.productQuality.id);
        $rootScope.GetPriceStdEffectiveDates();
        $rootScope.GetSearchPriceRangeH();
        $rootScope.GetPriceSearchAction();
    };

    $scope.LoadData = () => {
        if ($rootScope.priceChange.change) {
            common.ConfirmDialog($rootScope.priceChange.table + ' has changed.', 'Do you want to Cancel?').then((ok) => { if (ok) { SetDate(); } });
        }
        else SetDate();
    };

    $scope.DownLoad = function () { $window.location.href = $rootScope.IP_URL + "files/Template_HC.zip"; };

    // data get from excel import file
    $scope.PriceStdData = function (excel) {
        try {
            if (excel.sheetNames.find(function (sheetName) { return sheetName === "HC"; }) === undefined) { throw 500; }

            //sheetnames , data
            $modalPriceStd.excel = excel;
            $modalPriceStd.excel.table = [];
            $modalPriceStd.excel.errorSheet = [];
            $modalPriceStd.dataImport = {};
            $modalPriceStd.dataImport.priceStdMains = [];

            for (var i = 0; i < excel.data.length; i++) {

                if (excel.sheetNames[i] !== 'HC') { continue; }

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

                //console.log(j);

                var priceStdMain = {
                    countryGroupCode: common.GetStringCode(j[0][2]),
                    type: common.GetStringCode(j[4][2]),
                    productTypeCode: common.GetStringCode(j[1][2]),
                    productGradeCode: common.GetStringCode(j[2][2]),
                    currencyCode: common.GetStringCode(j[3][2]),
                    saleCode: common.GetStringCode(j[9][2]),
                    priceStdEffectiveDate: []
                };

                var priceStdProdCode = {};
                var priceStdRange = { priceStdRangeH: [] };
                var df = (j[6][2] + '').trim().split('/');
                var dt = (j[7][2] + '').trim().split('/');

                $modalPriceStd.dataImport.priceStdMains.push(priceStdMain);

                priceStdMain.priceStdEffectiveDate.push({
                    effectiveDateFrom: df[2] + '-' + df[1] + '-' + df[0],
                    effectiveDateTo: dt[2] + '-' + dt[1] + '-' + dt[0],
                    priceStdProdCode: priceStdProdCode,
                    priceStdRange: priceStdRange
                });

                if (priceStdMain.type === 'C') {
                    var priceStdValues = [];
                    priceStdProdCode.priceStdValues = priceStdValues;
                    for (var p = 13; p < j.length; p++) {
                        if (j[p].length === 0) continue;
                        priceStdValues.push({
                            productCode: common.GetStringCode(j[p][1]),
                            unitTypeCode: common.GetStringCode(j[p][4]),
                            fob: common.GetNumber(j[p][5]),
                            caf: 0,
                            cif: common.GetNumber(j[p][6])
                        });
                    }
                } else if (priceStdMain.type === 'R' && PRODUCT1.indexOf(priceStdMain.productTypeCode) !== -1) {//NET
                    for (var o = 13; o < j.length; o++) {
                        if (j[o].length === 0) continue;
                        priceStdRange.priceStdRangeH.push({
                            minTwineSizeCode: common.GetStringCode(j[o][1]),
                            maxTwineSizeCode: common.GetStringCode(j[o][2]),
                            unitTypeCode: common.GetStringCode(j[o][12]),
                            knotCode: common.GetStringCode(j[o][9]),
                            stretchingCode: common.GetStringCode(j[o][10]),
                            selvageWovenTypeCode: null,
                            colorCode: common.GetStringCode(j[o][11]),
                            priceStdValues: [
                                {
                                    minMeshSize: common.GetNumber(j[o][3]),
                                    maxMeshSize: common.GetNumber(j[o][4]),
                                    minMeshDepth: common.GetNumber(j[o][5]),
                                    maxMeshDepth: common.GetNumber(j[o][6]),
                                    minLength: common.GetNumber(j[o][7]),
                                    maxLength: common.GetNumber(j[o][8]),
                                    fob: common.GetNumber(j[o][13]),
                                    caf: 0,
                                    cif: common.GetNumber(j[o][14])
                                }
                            ]
                        });
                    }
                } else if (priceStdMain.type === 'R' && PRODUCT2.indexOf(priceStdMain.productTypeCode) !== -1) {//TWINE
                    for (var d = 13; d < j.length; d++) {
                        if (j[d].length === 0) continue;
                        priceStdRange.priceStdRangeH.push({
                            minTwineSizeCode: common.GetStringCode(j[d][1]),
                            maxTwineSizeCode: common.GetStringCode(j[d][2]),
                            unitTypeCode: common.GetStringCode(j[d][6]),
                            colorCode: common.GetStringCode(j[d][5]),
                            priceStdValues: [
                                {
                                    productTwineSeriesCode: common.GetStringCode(j[d][3]),
                                    fob: common.GetNumber(j[d][7]),
                                    caf: 0,
                                    cif: common.GetNumber(j[d][8])
                                }
                            ]
                        });
                    }
                }
                // set data excel
                $modalPriceStd.excel.data = [];
                $modalPriceStd.excel.data.push(j);
                //console.log($modalPriceStd.excel.data);
                //create data table
                $modalPriceStd.excel.table.push(KSSClient.Engine.Common.CreateTable(j));
                $modalPriceStd.excel.errorSheet.push(false);
            }
        }
        catch (err) {
            alert("รูปแบบข้อมูลนำเข้าไม่ถูกต้อง \nกรุณาเลือกไฟล์นำเข้าใหม่.");
            return false;
        }

        console.log($modalPriceStd.dataImport);
        $modalPriceStd.open();
    };

    $modalPriceStd.template = function (excel) {
        var isError = false;
        var html =
            '<div class="modal-header bg-success"><h3 class="modal-title" id="modal-title" > Preview File: ' + excel.fileName + '</h3 > </div >' +
            '<div class="" id="modal-body">' +
            '<uib-tabset active="active">';

        excel.sheetNames.forEach(function (sheet, index) {
            if (sheet === "HC") {
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
            html += '<button class="btn btn-danger" type="button" ng-click="$modalPriceStd.cancel()">Close</button>';
        } else {
            html += '<button class="btn btn-primary" type="button" ng-click="$modalPriceStd.ok()" > Import</button >&nbsp;&nbsp;&nbsp;' +
                '<button class="btn btn-warning" type="button" ng-click="$modalPriceStd.cancel()">Cancel</button>';
        }

        html += '</div>';

        return html;
    };

    $modalPriceStd.open = function (parentSelector) {
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalCtrl',
            controllerAs: '$modalPriceStd',
            size: 'lg',
            appendTo: parentElem,
            resolve:
                {
                    dataImport: function () { return $modalPriceStd.dataImport; }
                },
            backdrop: 'static',
            keyboard: false,
            template: $modalPriceStd.template($modalPriceStd.excel)

        });

        modalInstance.result.then(function (res) {

            //console.log(res);

            if (res.status === "F") {
                $modalPriceStd.excel.table = [];
                $modalPriceStd.excel.errorSheet = [];

                for (var i = 0; i < res.data.priceStdMains.length; i++) {
                    var error = [];
                    if (res.data.priceStdMains[i]._result._status === 'F') {
                        var tmpMessage1 = KSSClient.Engine.Common.GetMessage(res.data.priceStdMains[i]._result._message);
                        if (tmpMessage1 !== "") error.push({ index: '1', message: tmpMessage1 });
                    }
                    for (var j = 0; j < res.data.priceStdMains[i].priceStdEffectiveDate.length; j++) {

                        if (res.data.priceStdMains[i].priceStdEffectiveDate[j]._result._status === 'F') {
                            var tmpMessage2 = KSSClient.Engine.Common.GetMessage(res.data.priceStdMains[i].priceStdEffectiveDate[j]._result._message);
                            if (tmpMessage2 !== "") error.push({ index: '6', message: tmpMessage2 });
                        }

                        if (res.data.priceStdMains[i].type === 'C') {
                            for (var k = 0; k < res.data.priceStdMains[i].priceStdEffectiveDate[j].priceStdProdCode.priceStdValues.length; k++) {
                                if (res.data.priceStdMains[i].priceStdEffectiveDate[j].priceStdProdCode.priceStdValues[k]._result._status === 'F') {
                                    var tmpMessage3 = KSSClient.Engine.Common.GetMessage(res.data.priceStdMains[i].priceStdEffectiveDate[j].priceStdProdCode.priceStdValues[k]._result._message);
                                    if (tmpMessage3 !== "") error.push({ index: (13 + k) + '', message: tmpMessage3 });
                                }
                            }
                        }
                        else if (res.data.priceStdMains[i].type === 'R') {
                            for (var o = 0; o < res.data.priceStdMains[i].priceStdEffectiveDate[j].priceStdRange.priceStdRangeH.length; o++) {
                                if (res.data.priceStdMains[i].priceStdEffectiveDate[j].priceStdRange.priceStdRangeH[o]._result._status === 'F') {
                                    var tmpMessage4 = "";
                                    if (PRODUCT1.indexOf(res.data.priceStdMains[i].productTypeCode) !== -1) {
                                        tmpMessage4 = KSSClient.Engine.Common.GetMessage2(res.data.priceStdMains[i].priceStdEffectiveDate[j].priceStdRange.priceStdRangeH[o]._result._message, $modalPriceStd.excel.data[i], (13 + o));
                                        if (tmpMessage4 !== "") error.push({ index: (13 + o) + '', message: tmpMessage4 });
                                    } else {
                                        tmpMessage4 = KSSClient.Engine.Common.GetMessage(res.data.priceStdMains[i].priceStdEffectiveDate[j].priceStdRange.priceStdRangeH[o]._result._message);
                                        if (tmpMessage4 !== "") error.push({ index: (13 + o) + '', message: tmpMessage4 });
                                    }

                                }
                            }
                        }
                    }
                    //console.log(error);
                    $modalPriceStd.excel.table.push(KSSClient.Engine.Common.CreateTable($modalPriceStd.excel.data[i], error));

                    if (error.length !== 0) { $modalPriceStd.excel.errorSheet.push(true); }
                    else { $modalPriceStd.excel.errorSheet.push(false); }
                }

                $modalPriceStd.open();
            }

            $scope.GetPriceStdMain();
            $rootScope.selectGrid[0] = undefined
            $rootScope.GridSelectChanged(-1);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $rootScope.PriceAddEdit = (table, chk) => {
        if (table === 'Price Main' && chk) { $rootScope.priceStdSearchMain_SetGrid(chk); }
        else { $rootScope.priceStdSearchMain_SetGrid(false); }

        if (table === 'Price Effective Date' && chk) { $rootScope.priceStdSearchEffectDate_SetGrid(chk); }
        else { $rootScope.priceStdSearchEffectDate_SetGrid(false); }

        if (table === 'Price Product Spec Header' && chk) { $rootScope.priceStdFilter_SetGrid(chk); }
        else { $rootScope.priceStdFilter_SetGrid(false); }

        if ((table === 'Price Product Code Value' || table === 'Price Product Spec Value') && chk) { $rootScope.priceStdAction_SetGrid(chk); }
        else { $rootScope.priceStdAction_SetGrid(false); }

        if (!chk) {
            $rootScope.priceStdSearchMain_SetGrid(!chk);
            $rootScope.priceStdSearchEffectDate_SetGrid(!chk);
            $rootScope.priceStdFilter_SetGrid(!chk);
            $rootScope.priceStdAction_SetGrid(!chk);
        }
        $rootScope.priceChange = { table: table, change: chk };
    };

    //clone function
    $scope.CloneModal = () => {
        $uibModal.open({
            animation: true,
            controller: 'PriceCloneModalCtrl',
            size: 'lg',
            resolve: {
                data: () => {
                    return {
                        countryGroupID: $scope.countryGroupID
                    };
                }
            },
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/templates/PriceCloneModal.html'
        }).result.then((data) => {  }, () => {});
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

app.controller('PriceCloneModalCtrl', function ($scope, $rootScope, common, data, $uibModalInstance, $window, $filter, $timeout, uiGridConstants, API) {

    $timeout(() => { $scope.width = $window.innerWidth; }, 1);

    $scope.effectiveDate = new Date();

    //$scope.dateFrom = new Date($scope.effectiveDate.getFullYear(), );
    //$scope.dateTo = new Date();

    var countryGroup = $filter('filter')($rootScope.CountryGroupList, { id: data.countryGroupID ? data.countryGroupID : '' }, true);
    // country groups
    $scope.countryGroup = { disabled: false };
    $scope.countryGroup.list = $rootScope.CountryGroupList;
    $scope.countryGroup.view = countryGroup.length ? countryGroup[0].view : '';
    $scope.countryGroup.id = '';
    $scope.countryGroup.SetID = (id) => { $scope.countryGroup.id = id; };

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
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'currency_view', display: 'Currency', width: { min: 80} }));
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'effectiveDateFrom_view', display: 'From', width: { min: 100 }, format: { type: 'datetime' }, group: { name: 'effective', display: 'Effective Date', langCode: '' } }));
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'effectiveDateTo_view', display: 'To', width: { min: 100 }, format: { type: 'datetime' }, group: { name: 'effective', display: 'Effective Date', langCode: '' } }));
    $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'countApproved', display: 'Items Value', width: { min: 80 }, format: { type: 'decimal', scale: 0 }, multiLine: true }));

    $scope.gridOpt1.onRegisterApi = function (gridApi) {
        $scope.gridApi1 = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, (row) => { $scope.smov1 = $scope.gridApi1.selection.getSelectedRows().length > 0; });

        gridApi.grid.registerRowsProcessor((renderableRows) => {
            renderableRows.forEach((row) => {
                if ($scope.gridApi2.grid.options.data.find((d) => { return d.id === row.entity.id; })
                    || !(row.entity.effectiveDateFrom_view.getTime() <= $scope.effectiveDate.getTime() && row.entity.effectiveDateTo_view.getTime() >= $scope.effectiveDate.getTime() )
                ) row.visible = false;
            });
            return renderableRows;
        }, 200);
        $scope.LoadData();
    };

    $scope.LoadData = () => {
        if (!$scope.countryGroup.id) { return; }
        if (!common.GetStringVal($scope.effectiveDate)) { common.AlertMessage('Warning', 'Please select a Effective Date.'); return; }

        API.PriceStd.CloneSearch({
            data: { countryGroupID: $scope.countryGroup.id, effectiveDate: common.GetDateString($scope.effectiveDate), productTypeIDs: $scope.productType.id },
            callback: (res) => {
                $scope.gridOpt1.data = [];
                res.data.priceStds.forEach((d) => {
                    if (!$scope.gridApi2.grid.options.data.find((r) => { return r.id === d.id; })) {
                        d.type_view = common.GetObjVal('view', $rootScope.PriceStdMainType.find((r) => { return r.id === d.type; }));
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
        if (!$scope.DateChk($scope.dateFrom, $scope.dateTo)) { return; }
        var data = [];
        if (opt === 1) { data = src.selection.getSelectedRows(); }
        else if (opt === 2) { data = src.grid.renderContainers.body.visibleRowCache.map(x => x.entity); }
        
        data.forEach((d) => {
            if (!des.grid.options.data.find((r) => { return r.id === d.id; })) {
                d.dateFrom = d.dateFromorg = $scope.dateFrom;
                d.dateTo = d.dateToorg = $scope.dateTo;
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
            });
        });  

        $scope.smov1 = $scope.smov2 = false;
    };

    $scope.ChkChange = () => {
        $scope.btnOk = $scope.countryGroup.disabled = $scope.gridApi2.grid.options.data.length > 0;
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
            if (dateTo.getTime() !== dt.getTime()) { warning +='"Effective Date To" does not match Date "' + common.GetDateView(dt) + '". \n'; }
        }
        return warning;
    };
    
    $scope.ok = function () {

        var data = [];
        $scope.gridApi2.grid.options.data.forEach((d) => {
            d.effectiveDateFrom = common.GetDateString(d.dateFrom);
            d.effectiveDateTo = common.GetDateString(d.dateTo);
            data.push(d);
        });

        API.PriceStd.CloneSave({
            data: { priceStds: data },
            callback: (res) => {
                common.AlertMessage(res.message, '').then((ok) => { $uibModalInstance.close(); });
            },
            error: (res) => {
                var msg = '';
                res.data.priceStds.forEach((v) => { if (v._result._status === 'F') { msg += 'Table No. : ' + v.code + ' : ' + v._result._message + '\n'; } });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    };

    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});

//  model ctrl
app.controller('ModalCtrl', function ($uibModalInstance, dataImport, common) {
    var $modalPriceStd = this;
    //$modalPriceStd.dataImport = dataImport;
    $modalPriceStd.ok = function () {
        KSSClient.API.PriceStd.ImportPrice({
            data: dataImport,
            callback: function (res) {
                var count = 0;
                if (res.data.priceStdMains[0].type === 'C') {
                    count = res.data.priceStdMains[0].priceStdEffectiveDate[0].priceStdProdCode.priceStdValues.length;
                }
                else if (res.data.priceStdMains[0].type === 'R') {
                    count = res.data.priceStdMains[0].priceStdEffectiveDate[0].priceStdRange.priceStdRangeH.length;
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

app.controller("priceStdSearchMain", function ($rootScope, $scope, $timeout, common, API, uiGridConstants) {
        
    $scope.IP_DB = $rootScope.IP_DB;
   
    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableInsert: false, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code'/*, langCode: 'GRID_MAIN_MAINCODE'*/, display: 'Table No.', width: { min: 107 }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'priceStdEffectiveDate.code'/*, langCode: 'GRID_MAIN_EFFECTDATE'*/, display: 'Effective Date No.', width: { default: 130 }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'type'/*, langCode: 'GRID_MAIN_TYPE'*/, edit: true, display: 'Table Type', width: { min: 154 }, format: { type: 'autocomplete', obj: 'type' }, cellFilter: 'mapPriceStdMainType', setclass: common.SetClassEdit, inputOpt: { uppercase: true } }));
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

    $rootScope.priceStdSearchMain_SetGrid = (chk) => {
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
                if ($rootScope.priceChange.change && $rootScope.priceChange.table !== 'Price Main') {
                    common.ConfirmDialog($rootScope.priceChange.table + ' has changed.', 'Do you want to Cancel?').then((ok) => {
                        if (ok) {
                            $rootScope.selectGrid[0] = newRowCol.row.entity;
                            $rootScope.GridSelectChanged(0);
                            $rootScope.PriceAddEdit('', false);
                        } 
                    });
                } else {
                    $rootScope.selectGrid[0] = newRowCol.row.entity;
                    $rootScope.GridSelectChanged(0);
                }
            }
        });

        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "SETUP_COST_PRICESTD" },
            callback: function (obj) {
                $scope.PH_countryGroup = obj['PH_COUNTRYGROUP'] !== undefined ? obj['PH_COUNTRYGROUP'] : '{PH_COUNTRYGROUP}';
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) {}
        });

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.$apply();           

            var type = $scope.type.list.find((x) => { return x.code === rowEntity.type; });
            var productType = $scope.productType.list.find((x) => { return x.code === rowEntity.productType.code; });
            if (productType) rowEntity.productType.id = productType.id;
            var productGrade = $scope.productGrade.list.find((x) => { return x.code === rowEntity.productGrade.code; });
            if (productGrade) { rowEntity.productGrade.id = productGrade.id; } else rowEntity.productGrade.id = null;
            rowEntity.productGrade.codeerr = false;
            var currency = $scope.currency.list.find((x) => { return x.code === rowEntity.currency.code; });
            if (currency) rowEntity.currency.id = currency.id;
            rowEntity.countryGroup.id = $scope.countryGroupID;

            rowEntity.code = rowEntity.countryGroup.code + (angular.isUndefined(type) ? ' ' : type.code) + (angular.isUndefined(productType) ? ' ' : productType.code) + (angular.isUndefined(productGrade) ? '0' : productGrade.code) + (angular.isUndefined(currency) ? ' ' : currency.code);
            rowEntity.typeerr = !type;
            rowEntity.productType.codeerr = !productType;
            rowEntity.currency.codeerr = !currency;
            //console.log(rowEntity);
            $scope.gridApi.grid.options.data.forEach((d) => {
                if (rowEntity.productType.code === d.productType.code
                    && rowEntity.type === d.type
                    && ( rowEntity.productGrade.id === null || rowEntity.productGrade.code === d.productGrade.code )
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
        
    $rootScope.GetPriceStdMain = function (countryGroupID, productTypeID, productGradeID) {
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        $rootScope.selectGrid = [undefined, undefined, undefined];
        common.GridClearAll($scope);
        $rootScope.GridSelectChanged(0);
        if (!countryGroupID) { return false; }
        $scope.ChkDataChange();
        $scope.countryGroupID = countryGroupID;
        $scope.productTypeID = productTypeID;
        $scope.productGradeID = productGradeID;

        KSSClient.API.PriceStd.SearchMain({
            data: { countryGroupIDs: countryGroupID, productTypeIDs: productTypeID, productGradeIDs: productGradeID },
            callback: function (res) {
                res.data.priceStdMains.forEach(function (row) {
                    row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;
                });
                $scope.gridOpt.data = res.data.priceStdMains;
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
        common.SetObjVal('countryGroup.code', $rootScope.CountryGroupList.find((x) => { return x.id === $scope.countryGroupID; }).code, obj);
        common.SetObjVal('code', '', obj);
        common.SetObjVal('productType.code', "", obj);
        common.SetObjVal('productType.codeerr', true, obj);
        common.SetObjVal('productGrade.code', null, obj);
        common.SetObjVal('type', '', obj);
        common.SetObjVal('typeerr', true, obj);
        common.SetObjVal('priceStdEffectiveDate.id', 0, obj);
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
        $rootScope.PriceAddEdit('Price Main', chk);
    };

    $scope.UpdateStatus = (status) => {
        KSSClient.API.PriceStd.UpdateStatusMain({
            data: { ids: $scope.gridApi.selection.getSelectedRows().map(x => x.id), status: status },
            callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $rootScope.GetPriceStdMain($scope.countryGroupID, $scope.productTypeID, $scope.productGradeID); }); },
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
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.isInsert) { data.push(d); }
        });
        KSSClient.API.PriceStd.SaveMain({
            data: { priceStdMains: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $rootScope.GetPriceStdMain($scope.countryGroupID); });
            },
            error: (res) => {
                var msg = '';
                res.data.priceStdMains.forEach((v) => {
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

app.controller("priceStdSearchEffectDate", function ($rootScope, $scope, $timeout, common, uiGridConstants, intersales) {

    // init value grid
    $scope.IP_DB = $rootScope.IP_DB;

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableInsert: false, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code'/*, langCode: 'GRID_EFFECT_CODE'*/, display: 'Effective Date No.', width: { min: 179 }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateFrom'/*, langCode: 'GRID_EFFECT_DATEFROM'*/, edit: true, display: 'Date From', width: { min: 110 }, format: { type: 'date' }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateTo'/*, langCode: 'GRID_EFFECT_DATETO'*/, edit: true, display: 'Date To', width: { min: 110 }, format: { type: 'date' }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'countApprove_countTotal'/*, langCode: 'GRID_EFFECT_COUNT'*/, display: 'Count Approve', width: { min: 137 }, setclass: common.SetClassEdit }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', langCode: 'GRID_EFFECT_STATUS', display: 'Status', width: { min: 78 }, setclass: common.SetClassEdit, cellFilter: 'mapPriceStdEffectiveDateStatus' }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', display: 'Status', width: { default: 100 }, setclass: common.SetClassEdit, cellFilter: 'mapStatus', hiding: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 300 }, setclass: common.SetClassEdit }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'create.by', langCode: 'GRID_EFFECT_CREATE', display: 'Create By', width: { min: 240 }, setclass: common.SetClassEdit }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'create.datetime', langCode: 'GRID_EFFECT_CREATEDATE', display: 'Create Date', width: { min: 125 }, format: { type: 'datetime' }, setclass: common.SetClassEdit }));

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

    $rootScope.priceStdSearchEffectDate_SetGrid = (chk) => {
        $scope.gridApi.grid.options.enableInsert = chk;
        $scope.gridApi.grid.options.enableGridEdit = chk;
        $scope.gridApi.grid.refresh();
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, (row) => { common.ChkChange($scope); });

        gridApi.cellNav.on.navigate($scope, (newRowCol, oldRowCol) => {
            if (!oldRowCol || oldRowCol.row.uid !== newRowCol.row.uid) {
                if ($rootScope.priceChange.change && $rootScope.priceChange.table !== 'Price Main' && $rootScope.priceChange.table !== 'Price Effective Date') {
                    common.ConfirmDialog($rootScope.priceChange.table + ' has changed.', 'Do you want to Cancel?').then((ok) => {
                        if (ok) {
                            $rootScope.selectGrid[1] = newRowCol.row.entity;
                            $rootScope.GridSelectChanged(1);
                            $rootScope.PriceAddEdit('', false);
                        }
                    });
                } else {
                    $rootScope.selectGrid[1] = newRowCol.row.entity;
                    $rootScope.GridSelectChanged(1);
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

    $rootScope.GetPriceStdEffectiveDates = function (priceStdMainID = '', dateFrom = null, dateTo = null) {
        common.GridClearAll($scope);
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        if (!priceStdMainID) { return false }
        $scope.ChkDataChange();
        KSSClient.API.PriceStd.SearchEffectiveDate({
            data: { priceStdMainIDs: priceStdMainID, dateFrom: common.GetDateString(dateFrom), dateTo: common.GetDateString(dateTo) }, 
            callback: function (res) {
                res.data.priceStdEffectiveDates.forEach(function (row) {
                    row.effectiveDateFromorg = row.effectiveDateFrom = KSSClient.Engine.Common.CreateDateTime(row.effectiveDateFrom);
                    row.effectiveDateToorg = row.effectiveDateTo = KSSClient.Engine.Common.CreateDateTime(row.effectiveDateTo);
                    row.effectiveOldDateFrom = KSSClient.Engine.Common.CreateDateTime(row.effectiveOldDateFrom);
                    row.effectiveOldDateTo = KSSClient.Engine.Common.CreateDateTime(row.effectiveOldDateTo);
                    row.countApprove_countTotal = row.countApprove + "/" + row.countTotal;
                    row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;
                });
                $scope.gridOpt.data = res.data.priceStdEffectiveDates;
                $scope.gridApi.grid.refresh();
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    }

    $scope.AddRow = function () {
        if (!$rootScope.selectGrid[0] || !$rootScope.selectGrid[0].id) { common.AlertMessage('Warning', 'Please Select Price Main Data.'); return; }
        var obj = {};
        common.SetObjVal('id', 0, obj);
        common.SetObjVal('priceStdMain.id', $rootScope.selectGrid[0].id, obj);
        common.SetObjVal('priceStdMain.code', $rootScope.selectGrid[0].code, obj);
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
        $rootScope.PriceAddEdit('Price Effective Date', chk);
    }

    $scope.UpdateStatus = (status) => {
        KSSClient.API.PriceStd.UpdateStatusEffectiveDate({
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
                    priceStdMain: d.priceStdMain
                    , effectiveDateFrom: KSSClient.Engine.Common.GetDateString(d.effectiveDateFrom)
                    , effectiveDateTo: KSSClient.Engine.Common.GetDateString(d.effectiveDateTo)
                    , status: d.status
                });
            }
        });
        KSSClient.API.PriceStd.SaveEffectiveDate({
            data: { priceStdEffectiveDates: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $rootScope.GridSelectChanged(0); });
            },
            error: (res) => {
                var msg = '';
                res.data.priceStdEffectiveDates.forEach((v) => {
                    if (v._result._status === 'F') {
                        msg += 'Effective Date : ' + KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(v.effectiveDateFrom)) + ' - ' + KSSClient.Engine.Common.GetDateView(KSSClient.Engine.Common.CreateDateTime(v.effectiveDateTo)) + ' : ' + v._result._message + '\n';
                    }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    }

    $scope.Cancel = function () { $rootScope.GridSelectChanged(0); }

});

///------------------------------------------------------------------ grid prodcodeprice Filter ----------------------------------------------------------------------------

app.controller("priceStdFilter", function ($rootScope, $scope, $timeout, $filter, common, uiGridConstants, intersales, API, dialog) {

    // values
    $scope.IP_DB = $rootScope.IP_DB;

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableInsert: false, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'minTwineSize.code', edit: true, display: 'From', width: { min: 90 }, setclass: common.SetClassEdit, group: { name: 'twine', display: 'Dia', langCode: '' }, format: { type: 'autocomplete', obj: 'twineSize', limit: 10 }, inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'maxTwineSize.code', edit: true, display: 'To', width: { min: 90 }, setclass: common.SetClassEdit, group: { name: 'twine', display: 'Dia', langCode: '' }, format: { type: 'autocomplete', obj: 'twineSize', limit: 10 }, inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'knot.code', edit: true, display: 'Knot', width: { min: 147 }, setclass: common.SetClassEdit, format: { type: 'autocomplete', obj: 'productKnot' }, cellFilter: 'mapProductKnot', inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stretching.code', edit: true, display: 'Stretching', width: { min: 118 }, setclass: common.SetClassEdit, format: { type: 'autocomplete', obj: 'productStretching' }, cellFilter: 'mapProductStretching', inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'unitType.code', edit: true, display: 'Sale Unit', width: { min: 100 }, setclass: common.SetClassEdit, format: { type: 'autocomplete', obj: 'unitType' }, cellFilter: 'mapUnitType', inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'selvageWovenType.code', edit: true, display: 'Selvage Woven', width: { min: 117 }, setclass: common.SetClassEdit, format: { type: 'autocomplete', obj: 'productSelvageWovenType' }, cellFilter: 'mapProductSelvageWovenType', inputOpt: { uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'colorGroups.code', edit: true, display: 'Color Group', width: { min: 160 }, setclass: common.SetClassEdit, format: { type: 'helpInput', func: 'ColorGroupPopup' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', display: 'Status', width: { default: 100 }, setclass: common.SetClassEdit, cellFilter: 'mapStatus', hiding: true }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 300 }, setclass: common.SetClassEdit }));

    $scope.hideCol = ['knot.code', 'stretching.code', 'selvageWovenType.code'];

    $scope.gridColorSearch = common.CreateGrid2({ footer: true });
    $scope.gridColorSearch.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 55, max: 65 }, format: { type: 'numRow' }, sort: false, filter: false }));
    $scope.gridColorSearch.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Code', width: { min: 55 } }));
    $scope.gridColorSearch.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description' }));

    $rootScope.priceStdFilter_SetGrid = (chk) => {
        $scope.gridApi.grid.options.enableInsert = chk;
        $scope.gridApi.grid.options.enableGridEdit = chk;
        $scope.gridApi.grid.refresh();
    };

    $scope.ColorGroupPopup = (row) => {
        dialog.ColorGroupModal({
            countryGroupID: $rootScope.selectGrid[0].countryGroup.id
            , productTypeID: $rootScope.selectGrid[0].productType.id
            , productGradeID: $rootScope.selectGrid[0].productGrade.id
            , colorGroupID: row.entity.colorGroups.id
        }).then((data) => {
            var tmp = $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.indexOf(row.entity)];
            if (data) {
                tmp.colorGroups.code = data.code;
                API.ProductColorGroup.Search({
                    data: {
                        countryGroupIDs: $rootScope.selectGrid[0].countryGroup.id
                        , productTypeID: $rootScope.selectGrid[0].productType.id
                        , productGradeID: $rootScope.selectGrid[0].productGrade.id
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

    $rootScope.GetSearchPriceRangeH = function (model = -1, priceEffectiveDateID = '') {
        $scope.gridOpt.data = [];
        $scope.gridColorSearch.data = [];
        $scope.gridApi.grid.refresh();
        common.GridClearAll($scope);
        if (!priceEffectiveDateID) return;
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
        if ($rootScope.selectGrid[0].productGroup.id === 8) {
            $scope.twineSize.list = [];
            $scope.twineSizes.forEach((v) => {
                if (!$scope.twineSize.list.find((d) => { return d.id === v.id })) {
                    $scope.twineSize.list.push(v);
                }
            });
        } else {
            $scope.twineSize.list = $filter('filter')($scope.twineSizes, { productGroup: { id: $rootScope.selectGrid[0].productGroup.id } }, true);
        }
        
        KSSClient.API.PriceStd.SearchPriceRangeH({
            data: { priceEffectiveDateID: priceEffectiveDateID },
            callback: function (res) {
                res.data.priceStdRangeHs.forEach(function (row, index) {
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
                $scope.gridOpt.data = res.data.priceStdRangeHs;
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
                if ($rootScope.priceChange.change && $rootScope.priceChange.table === 'Price Product Spec Value') {
                    common.ConfirmDialog($rootScope.priceChange.table + ' has changed.', 'Do you want to Cancel?').then((ok) => {
                        if (ok) {
                            $rootScope.selectGrid[2] = newRowCol.row.entity;
                            $scope.gridColorSearch.data = newRowCol.row.entity.colorGroups.colors;
                            $rootScope.GridSelectChanged(2);
                            $rootScope.PriceAddEdit('', false);
                        }
                    });
                } else {
                    $rootScope.selectGrid[2] = newRowCol.row.entity;
                    $scope.gridColorSearch.data = newRowCol.row.entity.colorGroups.colors;
                    $rootScope.GridSelectChanged(2);
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
            res.data.unitTypes.forEach((row) => { row.view = row.code + " : " + row.description; });
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
            res.data.knots.forEach((row) => { row.view = row.code + " : " + row.description; });
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
            res.data.stretchings.forEach((row) => { row.view = row.code + " : " + row.description; });
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
        if (!$rootScope.selectGrid[1] || !$rootScope.selectGrid[1].id) { common.AlertMessage('Warning', 'Please Select Price Effective Date Data.'); return; }
        var obj = {};
        common.SetObjVal('id', 0, obj);
        common.SetObjVal('priceStdMainID', $rootScope.selectGrid[0].id, obj);
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
        $rootScope.PriceAddEdit('Price Product Spec Header', chk);
    };

    $scope.UpdateStatus = (status, priceEffectiveDateID = '') => {
        KSSClient.API.PriceStd.UpdateStatusRangeH({
            data: { ids: $scope.gridApi.selection.getSelectedRows().map(x => x.id), status: status, priceEffectiveDateID: priceEffectiveDateID },
            callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $scope.Cancel(); }); },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.UpdateStatusAction = (status) => {
        if (status === 'C') {
            var msg = "";
            var priceEffectiveDateID = $rootScope.selectGrid[1].id;
            //console.log($rootScope)
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) { if (!row.totalRow) msg += row.minTwineSize.code + ' - ' + row.maxTwineSize.code + ' ' + row.unitType.code + '\n'; });
            common.ConfirmDialog('Are you sure?', 'Remove Product Spec : \n' + msg).then((ok) => { if (ok) $scope.UpdateStatus(status, priceEffectiveDateID); });
        } else { $scope.UpdateStatus(status, priceEffectiveDateID); }
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
        KSSClient.API.PriceStd.SaveRangeH({
            data: { priceStdRangeHs: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $rootScope.GridSelectChanged(1); });
            },
            error: (res) => {
                var msg = '';
                res.data.priceStdRangeHs.forEach((v) => {
                    if (v._result._status === 'F') { msg += 'Dia : ' + v.minTwineSize.code + ' - ' + v.maxTwineSize.code + ' : ' + v._result._message + '\n'; }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    };

    $scope.Cancel = function () { $rootScope.GridSelectChanged(1); }
    
});

///------------------------------------------------------------------ grid prodcodeprice Action ----------------------------------------------------------------------------
app.controller("priceStdAction", function ($rootScope, $scope, $timeout, uiGridConstants, API, $filter, common, intersales, dialog) {

    var GridClass = (grid, row, col) => {
        var cellClass = '';       
        var status = common.GetObjVal('approved.statusFlag.code', row.entity);
        if ((status === 'MA' && row.entity.status !== 'C') || row.entity.status === 'I') {
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
    $scope.title = "Price Product Code Value";

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableInsert: false, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow'/*, langcode: 'GRID_VALUE_NO'*/, display: 'No', width: { min: 55, max: 65 }, format: { type: 'numRow' }, setclass: GridClass, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'seq'/*, langCode: 'GRID_VALUE_SEQ'*/, display: 'Seq', width: { min: 55 }, setclass: GridClass, format: { type: 'decimal', scale: 0, summary: 'none' } }));
    // P
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.code'/*, langCode: 'GRID_VALUE_PDCODE'*/, edit: true, display: 'Code', width: { min: 200 }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' }, format: { type: 'helpInput', func: 'ProductPopup' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.description'/*, langCode: 'GRID_VALUE_PDDES'*/, display: 'Description', width: { min: 350 }, setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.detail', display: 'Detail', width: { min: 60 }, format: { type: 'btnPopup', func: 'ShowDetail' } , setclass: GridClass, group: { name: 'product', display: 'Product', langCode: '' }, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'rumType_view', display: 'Rum Type', width: { min: 150 }, setclass: GridClass }));
   

    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'rumType.view'/*, langCode: 'GRID_VALUE_PDRUME'*/, display: 'Rume Type', width: { min: 185 }, setclass: GridClass }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'unitType.code'/*, langCode: 'GRID_VALUE_UNITTYPE'*/, edit: true, display: 'Sale Unit', width: { min: 100 }, setclass: GridClass, format: { type: 'autocomplete', obj: 'unitType' }, cellFilter: 'mapUnitType', inputOpt: { uppercase: true } }));  


    // R net
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'spec'/*, langCode: 'GRID_VALUE_TAG'*/, edit: true, display: 'Edit', format: { type: 'btnPopup', func: 'SpecNetPopup' }, width: { min: 50 }, setclass: GridClass, group: { name: 'spec', display: 'Specification' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesDescription'/*, langCode: 'GRID_VALUE_TAG'*/, display: 'Sales Description', width: { min: 200 }, setclass: GridClass, group: { name: 'spec', display: 'Specification' }  }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tagDescription'/*, langCode: 'GRID_VALUE_TAG'*/, display: 'Tag Description', width: { min: 250 }, setclass: GridClass, group: { name: 'spec', display: 'Specification' }  }));
    
    // R twine
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'twineSeries.code'/*, langCode: 'GRID_VALUE_PDSERIES'*/, edit: true, display: 'Code', width: { min: 100 }, setclass: GridClass, format: { type: 'helpInput', func: 'TwineSeriesPopup' }, group: { name: 'series', display: 'Twine Series', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'twineSeries.description'/*, langCode: 'GRID_VALUE_PDSERIES'*/, display: 'Description', width: { min: 200 }, setclass: GridClass, group: { name: 'series', display:  'Twine Series', langCode: '' } }));
    
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'fob', edit: true, display: 'FOB', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: GridClass, group: { name: 'price', display: 'Price', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'caf', edit: true, display: 'C&F', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: GridClass, group: { name: 'price', display: 'Price', langCode: '' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'cif', edit: true, display: 'CIF', width: { min: 70 }, format: { type: 'decimal', scale: 2, summary: 'none' }, setclass: GridClass, group: { name: 'price', display: 'Price', langCode: '' } }));

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

    $rootScope.priceStdAction_SetGrid = (chk) => {
        $scope.gridApi.grid.options.enableInsert = chk;
        $scope.gridApi.grid.options.enableGridEdit = chk;
        $scope.gridApi.grid.refresh();
    };

    $scope.ShowDetail = (data) => {
        dialog.ProductShowDetail({ productID: data.entity.product.id, productGradeID: $rootScope.selectGrid[0].productGrade.id });
    };

    $scope.ProductPopup = (row) => {
        dialog.ProductModal({
            productTypeID: $rootScope.selectGrid[0].productType.id
            , productGradeID: $rootScope.selectGrid[0].productGrade.id
            , row: row.entity
            , priceMode: true
            //, products: $rootScope.products
        }).then((data) => {
            $scope.AfterEdit(row.entity, { name: 'product.code' });
        });
    };

    $scope.TwineSeriesPopup = (row) => {
        dialog.TwineSeriesModal({
            productTypeID: $rootScope.selectGrid[0].productType.id
            , productGradeID: $rootScope.selectGrid[0].productGrade.id
            , row: row.entity
            , priceMode: true
            , twineSeries: $rootScope.twineSeries
        }).then((data) => {
            $scope.AfterEdit(row.entity, { name: 'twineSeries.code' });
        });
    };

    API.UnitConvert.search({
        data: { status: 'A' },
        noloadding: true, 
        callback: (res) => { $scope.unitConverts = res.data.unitConverts; },
        error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $scope.SpecNetPopup = (row) => {
        dialog.SpecNetModal({
            productTypeID: $rootScope.selectGrid[0].productType.id
            , unitConverts: $scope.unitConverts
            , row: row.entity
            , mainID: $rootScope.selectGrid[0].id
            , priceMode: true
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
        "Price Product Code Value"
        , "Price Product Spec Value"
    ];

    //$scope.SetGridLang = function () {
    //    KSSClient.API.Language.Dictionary({
    //        data: { lang: $rootScope.lang, group: "SETUP_COST_PRICESTD" },
    //        callback: function (obj) {
    //            $scope.PN_PRICEVALUE[0] = obj['PN_PRICEVALUE1'] !== undefined ? obj['PN_PRICEVALUE1'] : '{PN_PRICEVALUE1}';
    //            $scope.PN_PRICEVALUE[1] = obj['PN_PRICEVALUE2'] !== undefined ? obj['PN_PRICEVALUE2'] : '{PN_PRICEVALUE2}';
    //            common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
    //        },
    //        error: function (res) {
    //            //common.AlertMessage("Error", res.message);
    //        }
    //    });
    //}
    
    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) { common.ChkChange($scope); });

        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            //if (!oldRowCol || oldRowCol.row.uid !== newRowCol.row.uid) {
            //    //if ($rootScope.setupPrice === 0 && $rootScope.priceprod) {
            //    //    $rootScope.GetPriceProductLayer(newRowCol.row.entity.product.id);
            //    //}
            //}
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

        //$scope.SetGridLang();
    };

    $scope.AfterEdit = (rowEntity, colDef) => {

        rowEntity.foberr = !isFinite(rowEntity.fob) || rowEntity.fob === '';
        rowEntity.caferr = !isFinite(rowEntity.caf) || rowEntity.caf === '';
        rowEntity.ciferr = !isFinite(rowEntity.cif) || rowEntity.cif === '';

        if ($rootScope.setupPrice === 0) {
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

        } else if ($rootScope.setupPrice === 1) {
            rowEntity.specerr = rowEntity.spec === 'I';
            $scope.gridApi.grid.options.data.forEach((d) => {
                if (intersales.NRange(rowEntity.minMeshSize, rowEntity.maxMeshSize, d.minMeshSize, d.maxMeshSize)
                    && intersales.NRange(rowEntity.minMeshDepth, rowEntity.maxMeshDepth, d.minMeshDepth, d.maxMeshDepth)
                    && intersales.NRange(rowEntity.minLength, rowEntity.maxLength, d.minLength, d.maxLength)
                    && d.$$hashKey !== rowEntity.$$hashKey && d.status !== 'C') {
                    common.AlertMessage('Error', 'Spec Overlap : ' + d.tagDescription);
                    common.SetObjVal(colDef.name + 'err', true, rowEntity);
                    return;
                }
            });

        } else if ($rootScope.setupPrice === 2) {
            if (!rowEntity.twineSeries.code) {
                rowEntity.twineSeries.codeerr = false;
                rowEntity.twineSeries.id = null;
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

        if (rowEntity.fob === 0 && rowEntity.caf === 0 && rowEntity.cif === 0) {
            if (colDef.name === 'fob' || colDef.name === 'caf' || colDef.name === 'cif') common.AlertMessage('Error', 'Price FOB, CAF, CIF must have one value, not zero.');
            rowEntity.foberr = rowEntity.caferr = rowEntity.ciferr = true;
        }

        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        $scope.ChkDataChange();
    };

    $scope.show0 = ['product.code', 'product.description', 'product.detail', 'rumType_view', 'unitType.code'];
    $scope.show1 = ['spec', 'tagDescription', 'salesDescription'];

    $scope.show2 = ['twineSeries.code', 'twineSeries.description'];

    $scope.hideCol = [];
    
    $rootScope.GetPriceSearchAction = function (setupPrice = -1, priceEffectiveDateID = '', priceRangeHID = '') {
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        common.GridClearAll($scope);
        if (!priceEffectiveDateID || (setupPrice !== 0 && !priceRangeHID)) return;
        $scope.ChkDataChange();
        switch (setupPrice) {
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

        if (setupPrice === 0) {
            $scope.tableSelect = "sxsPriceStdProd";
            KSSClient.API.PriceStd.SearchPriceProd({
                data: { priceEffectiveDateID: priceEffectiveDateID },
                callback: function (res) {
                    res.data.priceStdValues.forEach(function (row) {
                        row.unitType.codeorg = row.unitType.code;
                        row.product.codeorg = row.product.code;
                        row.foborg = row.fob;
                        row.caforg = row.caf;
                        row.ciforg = row.cif;
                        row.rumType_view = common.GetCodeDescription(row.rumType);
                        row.enableEdit = row.status !== 'C';
                        row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;
                        row.sort = KSSClient.Engine.Common.convertProductCodeToObject(row.product.description);

                        row.approved_status = common.GetCodeDescription(row.approved.statusFlag);
                        row.updateFlag_view = common.GetCodeDescription(row.updateFlag);
                        
                    });
                    $scope.gridOpt.data = res.data.priceStdValues;
                    intersales.SortProduct($scope.gridOpt.data);

                    $scope.gridApi.grid.refresh();
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });

        }
        else {
            $scope.tableSelect = "sxsPriceStdRangeD";
            KSSClient.API.PriceStd.SearchPriceRangeValue({
                data: { priceEffectiveDateID: priceEffectiveDateID, priceRangeHID: priceRangeHID },
                callback: function (res) {
                    res.data.priceStdValues.forEach(function (row, index) {
                        row.foborg = row.fob;
                        row.caforg = row.caf;
                        row.ciforg = row.cif;
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
                    $scope.gridOpt.data = res.data.priceStdValues;
                    $scope.gridApi.grid.refresh();
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        }
    };

    $scope.unitType = {
        value: ''
        , list: $rootScope.UnitTypes
        , func: (key) => {
            $scope.unitType.value = key;
        }
    };
        
    $scope.AddRow = function () {

        if ($rootScope.setupPrice === 0) {
            if (!$rootScope.selectGrid[1] || !$rootScope.selectGrid[1].id) { common.AlertMessage('Warning', 'Please Select Price Effective Date Data.'); return; }
        } else if ($rootScope.setupPrice > 0) {  //  1 net  2 twine
            if (!$rootScope.selectGrid[2] || !$rootScope.selectGrid[2].id) { common.AlertMessage('Warning', 'Please Select Price Product Spec Header Data.'); return; }
        } 

        if ($rootScope.setupPrice === 0) {
            dialog.ProductModal({
                productTypeID: $rootScope.selectGrid[0].productType.id
                , productGradeID: $rootScope.selectGrid[0].productGrade.id
                , mSelect: true
                , priceMode: true
                //, products: $rootScope.products
            }).then((data) => {
                data.forEach((d) => {
                    var tmp = $scope.AddRowAction(d);
                    $scope.AfterEdit(tmp, { name: 'product.code' });
                });
            });
        } else if ($rootScope.setupPrice === 1) { //net
            dialog.SpecNetModal({
                productTypeID: $rootScope.selectGrid[0].productType.id
                , unitConverts: $scope.unitConverts
                , mSelect: true
                , priceMode: true
                , mainID: $rootScope.selectGrid[0].id
            }).then((data) => {
                data.forEach((d) => {
                    var tmp = $scope.AddRowAction(d);
                    $scope.AfterEdit(tmp, { name: 'spec' });
                });
            });
        } else if ($rootScope.setupPrice === 2) { //twine
            dialog.TwineSeriesModal({
                productTypeID: $rootScope.selectGrid[0].productType.id
                , productGradeID: $rootScope.selectGrid[0].productGrade.id
                , mSelect: true
                , priceMode: true
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
        common.SetObjVal('priceStdMainID', $rootScope.selectGrid[0].id, obj);
        common.SetObjVal('priceEffectiveDateID', $rootScope.selectGrid[1].id, obj);

        var tmp = {};

        if ($rootScope.setupPrice === 0) common.SetObjVal('priceStdProdID', 0, obj);
        else {
            common.SetObjVal('priceRangeDID', 0, obj);
            common.SetObjVal('priceRangeHID', $rootScope.selectGrid[2].id, obj);
        }

        if ($rootScope.setupPrice === 0) {
            common.SetObjVal('product.id', common.GetObjVal('id', d), obj);
            common.SetObjVal('product.code', common.GetObjVal('code', d), obj);
            common.SetObjVal('product.description', common.GetObjVal('description', d), obj);
            common.SetObjVal('product.codeerr', !common.GetObjVal('id', d), obj);

            common.SetObjVal('rumType', common.GetObjVal('rumType', d), obj);
            common.SetObjVal('rumType_view', common.GetObjVal('rumType_view', d), obj);

            common.SetObjVal('unitType.code', '', obj);
            common.SetObjVal('unitType.codeerr', true, obj);
            
            tmp = $filter('filter')($scope.gridApi.grid.options.columnDefs, { field: 'product.code' }, true);
        } else if ($rootScope.setupPrice === 1) {
            
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
        } else if ($rootScope.setupPrice === 2) {

            common.SetObjVal('twineSeries.id', common.GetObjVal('id', d), obj);
            common.SetObjVal('twineSeries.code', common.GetObjVal('code', d), obj);
            common.SetObjVal('twineSeries.description', !common.GetObjVal('description', d) ? 'any' : common.GetObjVal('description', d), obj);
            common.SetObjVal('twineSeries.codeerr', !common.GetObjVal('id', d), obj);

            tmp = $filter('filter')($scope.gridApi.grid.options.columnDefs, { field: 'twineSeries.code' }, true);
        }

        common.SetObjVal('fob', 0, obj);
        common.SetObjVal('foberr', true, obj);
        common.SetObjVal('caf', 0, obj);
        common.SetObjVal('caferr', true, obj);
        common.SetObjVal('cif', 0, obj);
        common.SetObjVal('ciferr', true, obj);

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

    $scope.RemoveRow = function () {
        $scope.gridApi.selection.getSelectedRows().forEach((d) => {
            $scope.gridApi.grid.options.data.splice($scope.gridApi.grid.options.data.indexOf(d), 1);
        });
        $scope.ChkDataChange();
        $scope.gridApi.grid.refresh();
        $timeout(() => { common.ChkChange($scope); }, 1);
    };

    $scope.ChkDataChange = function () {
        var chk = false, chk2 = true;
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (!d.id || d.fob !== d.foborg || d.caf !== d.caforg || d.cif !== d.ciforg) { chk = true; }
            if (d.foberr || d.caferr || d.ciferr) { chk2 = false; }
            if (!chk || chk2) {
                if ($rootScope.setupPrice === 0) {
                    if (d.product.code !== d.product.codeorg || d.unitType.code !== d.unitType.codeorg) { chk = true; }
                    if (d.product.codeerr || d.unitType.codeerr) { chk2 = false; }
                } else if ($rootScope.setupPrice === 1) { //net 
                    if (d.minMeshSize !== d.minMeshSizeorg
                        || d.maxMeshSize !== d.maxMeshSizeorg
                        || d.minMeshDepth !== d.minMeshDepthorg
                        || d.maxMeshDepth !== d.maxMeshDepthorg
                        || d.minLength !== d.minLengthorg
                        || d.maxLength !== d.maxLengthorg
                        || d.spec !== d.specorg
                    ) { chk = true; }
                    if (d.specerr) { chk2 = false; }
                } else if ($rootScope.setupPrice === 2) { // twine
                    if (d.twineSeries.code !== d.twineSeries.codeorg) { chk = true; }
                    if (d.twineSeries.codeerr) { chk2 = false; }
                }
            }
        });

        $scope.btnSave = chk && chk2;
        $scope.btnCancel = chk;
        if ($rootScope.setupPrice === 0) { $rootScope.PriceAddEdit('Price Product Code Value', chk); }
        else { $rootScope.PriceAddEdit('Price Product Spec Value', chk); }
    };

    $scope.UpdateStatus = (status) => {
        var ids1 = $rootScope.selectGrid[0].type === 'R' ? $scope.gridApi.selection.getSelectedRows().map(x => x.priceRangeDID) : $scope.gridApi.selection.getSelectedRows().map(x => x.priceStdProdID);
        KSSClient.API.PriceStd.UpdateStatusValue({
            data: { ids: $scope.gridApi.selection.getSelectedRows().map(x => x.id), ids1: ids1, type: $rootScope.selectGrid[0].type, status: status },
            callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $scope.Cancel(); }); },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.UpdateStatusAction = (status) => {
        if (status === 'C') {
            var msg = "", msg1 = '', insertOnly = true;
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                if (row.id) { insertOnly = false; }
                if ($rootScope.setupPrice === 0) {
                    msg1 = 'Product Code';
                    msg += row.product.code + '\n';
                } else if ($rootScope.setupPrice === 1) {
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
        var data = [];
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (!d.id || d.fob !== d.foborg || d.caf !== d.caforg || d.cif !== d.ciforg) { data.push(d); }
            else {
                if ($rootScope.setupPrice === 0) {
                    if (d.product.code !== d.product.codeorg || d.unitType.code !== d.unitType.codeorg) { data.push(d); }
                } else if ($rootScope.setupPrice === 1) { //net 
                    if (d.minMeshSize !== d.minMeshSizeorg
                        || d.maxMeshSize !== d.maxMeshSizeorg
                        || d.minMeshDepth !== d.minMeshDepthorg
                        || d.maxMeshDepth !== d.maxMeshDepthorg
                        || d.minLength !== d.minLengthorg
                        || d.maxLength !== d.maxLengthorg
                        || d.spec !== d.specorg
                    ) { data.push(d); }
                } else if ($rootScope.setupPrice === 2) { // twine
                    if (d.twineSeries.code !== d.twineSeries.codeorg) { data.push(d); }
                }
            }
        });

        if ($rootScope.setupPrice === 0) {
            KSSClient.API.PriceStd.SaveProdValue({
                data: { priceStdValues: data },
                callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $rootScope.GridSelectChanged(1); }); },
                error: (res) => {
                    var msg = '';
                    res.data.priceStdValues.forEach((v) => { if (v._result._status === 'F') { msg += 'Product : ' + v.product.code + ' ' + v.product.description + ' : ' + v._result._message + '\n'; } });
                    common.AlertMessage("Error", res.message + '\n' + msg);
                }
            });
        } else {
            KSSClient.API.PriceStd.SaveRangeValue({
                data: { priceStdValues: data },
                callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $rootScope.GridSelectChanged(2); }); },
                error: (res) => {
                    var msg = '';
                    res.data.priceStdValues.forEach((v) => {
                        if (v._result._status === 'F') {
                            if ($rootScope.setupPrice === 1) msg += 'Spec : ' + v.tagDescription + ' : ' + v._result._message + '\n';
                            else msg += 'Twine Series : ' + v.twineSeries.code + ' ' + v.twineSeries.description + ' : ' + v._result._message + '\n';
                        }
                    });
                    common.AlertMessage("Error", res.message + '\n' + msg);
                }
            });
        }
    };

    $scope.Cancel = function () {
        if ($rootScope.setupPrice === 0) { $rootScope.GridSelectChanged(1); }
        else { $rootScope.GridSelectChanged(2); }
    };

    $scope.ReplaceClick = () => {
        dialog.ReplacePriceModal({}).then((data) => {
            $scope.gridApi.selection.getSelectedRows().forEach((d) => {
                d.fob = data.fob;
                d.caf = data.caf;
                d.cif = data.cif;
                $scope.AfterEdit(d, 'fob');
            });

            $scope.gridApi.selection.clearSelectedRows();
            common.ChkChange($scope);
        });
    };

});

///------------------------------------------------------------------ grid Prodcut Layer ----------------------------------------------------------------------------
//app.controller("priceStdProductLayer", function ($rootScope, $scope, common) {
//    $scope.gridOpt = common.CreateGrid2({ footer: true });
//    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow'/*, langcode: 'GRID_LAYER_NO'*/, display: 'No', width: { min: 117 }, format: { type: 'numRow' }, sort: false, filter: false }));
//    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.code'/*, langCode: 'GRID_LAYER_PDCODE'*/, display: 'Product Code', width: { min: 170 } }));
//    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.descriptionSale'/*, langCode: 'GRID_LAYER_PDDES'*/, display: 'Product Description', width: { min: 340 } }));
//    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.productSelvageWoven.view'/*, langCode: 'GRID_LAYER_PDSELVAGE'*/, display: 'Selvage Woven', width: { min: 200 } }));

//    $scope.cumulative = function (grid, myRow, myCol) {
//        if (grid.id === $scope.gridApi.grid.id) {
//            if (myCol.field === "numRow") {
//                var numRow = 0;
//                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
//                    if (myRow.uid === row.uid) { numRow = (index + 1); }
//                });
//                return numRow;
//            }
//        }
//        return false;
//    };

//    $scope.SetGridLang = function () {
//        KSSClient.API.Language.Dictionary({
//            data: { lang: $rootScope.lang, group: "SETUP_COST_PRICESTD" },
//            callback: function (obj) {
//                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
//            },
//            error: function (res) { }
//        });
//    }
//    $scope.gridOpt.onRegisterApi = function (gridApi) {
//        $scope.gridApi = gridApi;
//        $scope.SetGridLang();
//    };

//    $rootScope.GetPriceProductLayer = function (productID = 0) {
//        $scope.gridOpt.data = [];
//        $scope.gridApi.grid.refresh();
//        if (productID !== 0) {
//            KSSClient.API.Product.SearchLayer({
//                data: { productID: productID },
//                callback: function (res) {
//                    res.data.products.forEach(function (row, index) {
//                        row.product.productSelvageWoven.view = common.GetCodeDescription(row.product.productSelvageWoven);
//                    });
//                    $scope.gridOpt.data = res.data.products;
//                    $scope.gridApi.grid.refresh();
//                },
//                error: function (res) {
//                    common.AlertMessage("Error", res.message);
//                }
//            });
//        }
        
//    }
//});

