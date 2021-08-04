'use strict';
app.controller("discountStdController", function ($rootScope, $scope) {

    $rootScope.setupDiscount = 2;
    $rootScope.discountprod = true;
    $rootScope.selectGrid = [undefined, undefined, undefined];

    $rootScope.CustomerList = {};
    $rootScope.DiscountStdMainType = {};

    // init value prodcodeDiscount SearchEffectDate
    $rootScope.txtSearch = "";
    $rootScope.DiscountStdEffectiveDateStatus = {};
    $rootScope.DiscountStdApproveStatus = {};

    $rootScope.GridSelectChanged = function (grid) {
        if ($rootScope.selectGrid[0] != undefined) {
            if (grid == 0) {
                $rootScope.setupDiscount = -1;
                $rootScope.GetDiscountStdEffectiveDates($rootScope.selectGrid[grid].id, $rootScope.txtSearch, $rootScope.DiscountStdEffectiveDateStatus.select.id);
            } else if (grid == 1) {
                $rootScope.setupDiscount = -1;
                $rootScope.discountprod = false;
                $rootScope.GetDiscountSearchAction();
                if ($rootScope.selectGrid[grid] != undefined) {
                    if ($rootScope.selectGrid[0].type == 'C') {
                        $rootScope.setupDiscount = 0;
                        $rootScope.GetDiscountSearchAction($rootScope.setupDiscount, $rootScope.selectGrid[grid].id, 0, $rootScope.txtSearch, $rootScope.DiscountStdEffectiveDateStatus.select.id);
                        // อวน
                        if (PRODUCT1.indexOf($rootScope.selectGrid[0].productType.code) > -1) {
                            if ($rootScope.selectGrid[0].productType.code == 'P' || $rootScope.selectGrid[0].productType.code == 'H') {
                                $rootScope.discountprod = true;
                                $rootScope.ShowCol(6);
                            }
                            else { $rootScope.ShowCol(5); }
                        }
                        // เอ็น ด้าย
                        else if (PRODUCT2.indexOf($rootScope.selectGrid[0].productType.code) > -1) { $rootScope.ShowCol(4); }
                        else { $rootScope.ShowCol(); }
                    }
                    else if ($rootScope.selectGrid[0].type == 'R') {
                        if (PRODUCT1.indexOf($rootScope.selectGrid[0].productType.code) > -1) { $rootScope.setupDiscount = 1; }
                        else if (PRODUCT2.indexOf($rootScope.selectGrid[0].productType.code) > -1) { $rootScope.setupDiscount = 2; }
                        else { return false; }
                    } else { return false; }
                    $rootScope.GetSearchDiscountRangeH($rootScope.setupDiscount, $rootScope.selectGrid[grid].id, $rootScope.txtSearch, $rootScope.DiscountStdEffectiveDateStatus.select.id);
                } else {
                    $rootScope.setupDiscount = -1;
                    $rootScope.GetSearchDiscountRangeH();
                }
            } else if (grid == 2) {
                if ($rootScope.selectGrid[grid] != undefined) {
                    $rootScope.GetDiscountSearchAction($rootScope.setupDiscount, $rootScope.selectGrid[grid - 1].id, $rootScope.selectGrid[grid].id, $rootScope.txtSearch, $rootScope.DiscountStdEffectiveDateStatus.select.id);
                } else {
                    $rootScope.GetDiscountSearchAction();
                }
            }
        } else {
            $rootScope.setupDiscount = -1;
            $rootScope.GetDiscountStdEffectiveDates();
            $rootScope.GetSearchDiscountRangeH();
        }
        //console.log($rootScope.selectGrid[grid]);
    };

});

///------------------------------------------------------------------ grid prodcodeDiscount SearchMain ----------------------------------------------------------------------------

app.controller("discountStdSearchMain", function ($rootScope, $scope, $uibModal, $document, $window, $filter, common, uiGridConstants) {

    // set value from model
    var $discountStdMain = this;
    $scope.IP_DB = $rootScope.IP_DB;
    $rootScope.CustomerList = [];

    $scope.PH_customer = "ใส่ข้อมูล code ลูกค้า";

    $scope.gridOpt = common.CreateGrid2({ mSelect: false, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', langCode: 'GRID_MAIN_MAINCODE', display: 'Table No.', width: { min: 107 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountStdEffectiveDate.code', langCode: 'GRID_MAIN_EFFECTDATE', display: 'Effective Date No.', width: { min: 179 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'type', langCode: 'GRID_MAIN_TYPE', display: 'Table Type', width: { min: 154 }, cellFilter: 'mapDiscountStdMainType' }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productType.view', langCode: 'GRID_MAIN_PRODUCTTYPE', display: 'Product Type', width: { min: 117 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'productGrade.view', langCode: 'GRID_MAIN_PRODUCTGRADE', display: 'Grade', width: { min: 217 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'currency.view', langCode: 'GRID_MAIN_CURRENCY', display: 'Currency', width: { min: 87 } }));

    $scope.SetGridLang = function () {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "SETUP_COST_DISCOUNTSTD" },
            callback: function (obj) {
                $scope.PH_countryGroup = obj['PH_CUSTOMER'] != undefined ? obj['PH_CUSTOMER'] : '{PH_CUSTOMER}';
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) {
                //common.AlertMessage("Error", res.message);
            }
        });
    }

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
        }
        return false
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) { $rootScope.selectGrid[0] = row.entity; }
            else { $rootScope.selectGrid[0] = undefined; }
            $rootScope.GridSelectChanged(0);
        });

        //gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
        //    $scope.gridApi.selection.selectRow(newRowCol.row.entity);
        //});

        $scope.SetGridLang();
    };

    KSSClient.API.Customer.List({
        data: {},
        callback: function (res) {
            res.data.customer.forEach(function (row, index) {
                row.view = common.GetCodeDescription(row);
            });
            $rootScope.CustomerList = res.data.customer;
            //if ($rootScope.CustomerList.length > 0) {
            //    $scope.customerCode = angular.copy($rootScope.CustomerList[0].view);
            //}

            KSSClient.API.Constant.DiscountStdMainType({
                data: {},
                callback: function (res) {
                    res.data.discountStdMainType.forEach(function (row, index) {
                        row.view = row.code + " : " + row.description;
                    });
                    $rootScope.DiscountStdMainType = res.data.discountStdMainType;

                    //LoadDiscountStdMain
                    $scope.GetDiscountStdMain();

                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });

            KSSClient.API.Constant.DiscountStdEffectiveDateStatus({
                data: {},
                callback: function (res) {
                    $rootScope.DiscountStdEffectiveDateStatus.list = [];
                    $rootScope.DiscountStdEffectiveDateStatus.list[0] = { id: "", code: "all", description: "-all-", view: "-all-" };
                    var i = 1;
                    res.data.constants.forEach(function (row, index) {
                        row.view = row.description;
                        $rootScope.DiscountStdEffectiveDateStatus.list[i++] = row;
                    });
                    if ($rootScope.DiscountStdEffectiveDateStatus.list.length > 1) {
                        $rootScope.DiscountStdEffectiveDateStatus.select = $rootScope.DiscountStdEffectiveDateStatus.list[1];
                    }
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });

            KSSClient.API.Constant.DiscountStdApproveStatus({
                data: {},
                callback: function (res) {
                    $rootScope.DiscountStdApproveStatus.list = [];
                    $rootScope.DiscountStdApproveStatus.list[0] = { id: "", code: "all", description: "-all-", view: "-all-" };
                    var i = 1;
                    res.data.constants.forEach(function (row, index) {
                        row.view = row.description;
                        $rootScope.DiscountStdApproveStatus.list[i++] = row;
                    });
                    if ($rootScope.DiscountStdApproveStatus.list.length > 1) {
                        $rootScope.DiscountStdApproveStatus.select = $rootScope.DiscountStdApproveStatus.list[1];
                    }
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
            
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });

    $scope.customerID = 0;
    $scope.SetCustomerID = function (customerID) {
        $scope.customerID = customerID;
        $scope.GetDiscountStdMain();
    }

    $scope.GetDiscountStdMain = function () {
        
        $scope.customerDes = "";
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        $rootScope.setupDiscount = -1;
        $rootScope.selectGrid = [undefined, undefined, undefined];
        $rootScope.GridSelectChanged(0);

        if ($scope.customerID == 0) return false;
        $scope.customerDes = $filter('filter')($rootScope.CustomerList, { 'id': $scope.customerID })[0].description;

        KSSClient.API.DiscountStd.SearchMain({
            data: { customerID: $scope.customerID },
            callback: function (res) {
                res.data.discountStdMains.forEach(function (row, index) {
                    row.productType.view = common.GetCodeDescription(row.productType);
                    row.productGrade.view = common.GetCodeDescription(row.productGrade);
                    row.currency.view = common.GetCodeDescription(row.currency);
                });
                $scope.gridOpt.data = res.data.discountStdMains;
                $scope.gridApi.grid.refresh();
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
       
    }

    $scope.DownLoad = function () {
        $window.location.href = $rootScope.IP_URL + "files/Template_DISCOUNT.zip";
    }

    // data get from excel import file
    $scope.DiscountStdData = function (excel) {
        try {

            if (excel.sheetNames.find(function (sheetName) { return sheetName == "DISCOUNT" }) == undefined) { throw 500; }

            //sheetnames , data
            $discountStdMain.excel = excel;
            $discountStdMain.excel.table = [];
            $discountStdMain.excel.errorSheet = [];
            $discountStdMain.dataImport = {};
            $discountStdMain.dataImport.discountStdMains = [];

            for (var i = 0; i < excel.data.length; i++) {

                if (excel.sheetNames[i] != 'DISCOUNT') { continue; }

                var j = [];
                for (var k = 0; k < excel.data[i].length; k++) {
                    if (k >= 13) {
                        var tmp = excel.data[i][k];
                        if (!(tmp[0] == null || tmp[0] == undefined || tmp.length == 0 || (tmp[0] + '').trim() == "")) {
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

                if (discountStdMain.type == 'C') {
                    var discountStdValues = [];
                    discountStdProdCode.discountStdValues = discountStdValues;
                    for (var k = 13; k < j.length; k++) {
                        if (j[k].length == 0) continue;
                        discountStdValues.push({
                            productCode: common.GetStringCode(j[k][1]),
                            unitTypeCode: common.GetStringCode(j[k][4]),
                            discountPercent: common.GetNumber(j[k][5]),
                            discountAmount: common.GetNumber(j[k][6]),
                            increaseAmount: 0
                        });
                    }
                } else if (discountStdMain.type == 'R' && PRODUCT1.indexOf(discountStdMain.productTypeCode) != -1) {//NET
                    for (var k = 13; k < j.length; k++) {
                        if (j[k].length == 0) continue;
                        discountStdRange.discountStdRangeH.push({
                            minTwineSizeCode: common.GetStringCode(j[k][1]),
                            maxTwineSizeCode: common.GetStringCode(j[k][2]),
                            unitTypeCode: common.GetStringCode(j[k][12]),
                            knotCode: common.GetStringCode(j[k][9]),
                            stretchingCode: common.GetStringCode(j[k][10]),
                            selvageWovenTypeCode: null,
                            colorCode: common.GetStringCode(j[k][11]),
                            discountStdValues: [
                                {
                                    minEyeSizeCM: common.GetNumberNull(j[k][3]),
                                    maxEyeSizeCM: common.GetNumberNull(j[k][4]),
                                    minEyeAmountMD: common.GetNumberNull(j[k][5]),
                                    maxEyeAmountMD: common.GetNumberNull(j[k][6]),
                                    minLengthM: common.GetNumberNull(j[k][7]),
                                    maxLengthM: common.GetNumberNull(j[k][8]),
                                    discountPercent: common.GetNumber(j[k][13]),
                                    discountAmount: common.GetNumber(j[k][14]),
                                    increaseAmount: 0
                                }
                            ]
                        });
                    }
                } else if (discountStdMain.type == 'R' && PRODUCT2.indexOf(discountStdMain.productTypeCode) != -1) {//TWINE
                    for (var k = 13; k < j.length; k++) {//Value Begin Row 10
                        if (j[k].length == 0) continue;
                        discountStdRange.discountStdRangeH.push({
                            minTwineSizeCode: common.GetStringCode(j[k][1]),
                            maxTwineSizeCode: common.GetStringCode(j[k][2]),
                            unitTypeCode: common.GetStringCode(j[k][6]),
                            colorCode: common.GetStringCode(j[k][5]),
                            discountStdValues: [
                                {
                                    productTwineSeriesCode: common.GetStringCode(j[k][3]),
                                    discountPercent: common.GetNumber(j[k][7]),
                                    discountAmount: common.GetNumber(j[k][8]),
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

        console.log($discountStdMain.dataImport);
        $discountStdMain.open();
    };

    $discountStdMain.template = function (excel) {
        var isError = false;
        var html =
            '<div class="modal-header bg-success"><h3 class="modal-title" id="modal-title" > Preview File: ' + excel.fileName + '</h3 > </div >' +
            '<div class="" id="modal-body">' +
            '<uib-tabset active="active">';

        excel.sheetNames.forEach(function (sheet, index) {
            if (sheet == "DISCOUNT") {
                html += '<uib-tab index="' + 0 + '">';
                if (excel.errorSheet[0] == true) {
                    html += '<uib-tab-heading>' + '<div class="bg-danger">' + sheet + '</div></uib-tab-heading>';
                    isError = true;
                }
                else {
                    html += '<uib-tab-heading>' + '<div class="bg-default">' + sheet + '</div></uib-tab-heading>';
                }
                html += '<div windows-Resize class="modalContent" ng-style="{ \'max-height\': (height - 215) + \'px\'}" >' +
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

            if (res.status == "F") {
                $discountStdMain.excel.table = [];
                $discountStdMain.excel.errorSheet = [];

                for (var i = 0; i < res.data.discountStdMains.length; i++) {
                    var error = [];
                    if (res.data.discountStdMains[i]._result._status == 'F') {
                        var tmpMessage1 = KSSClient.Engine.Common.GetMessage(res.data.discountStdMains[i]._result._message);
                        if (tmpMessage1 != "") error.push({ index: '1', message: tmpMessage1 });
                    }
                    for (var j = 0; j < res.data.discountStdMains[i].discountStdEffectiveDate.length; j++) {

                        if (res.data.discountStdMains[i].discountStdEffectiveDate[j]._result._status == 'F') {
                            var tmpMessage2 = KSSClient.Engine.Common.GetMessage(res.data.discountStdMains[i].discountStdEffectiveDate[j]._result._message);
                            if (tmpMessage2 != "") error.push({ index: '6', message: tmpMessage2 });
                        }

                        if (res.data.discountStdMains[i].type == 'C') {
                            for (var k = 0; k < res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdProdCode.discountStdValues.length; k++) {
                                if (res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdProdCode.discountStdValues[k]._result._status == 'F') {
                                    var tmpMessage3 = KSSClient.Engine.Common.GetMessage(res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdProdCode.discountStdValues[k]._result._message);
                                    if (tmpMessage3 != "") error.push({ index: (13 + k) + '', message: tmpMessage3 });
                                }
                            }
                        }
                        else if (res.data.discountStdMains[i].type == 'R') {
                            for (var k = 0; k < res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdRange.discountStdRangeH.length; k++) {
                                if (res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdRange.discountStdRangeH[k]._result._status == 'F') {
                                    if (PRODUCT1.indexOf(res.data.discountStdMains[i].productTypeCode) != -1) {
                                        var tmpMessage4 = KSSClient.Engine.Common.GetMessage2(res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdRange.discountStdRangeH[k]._result._message, $discountStdMain.excel.data[i], (13 + k));
                                        if (tmpMessage4 != "") error.push({ index: (13 + k) + '', message: tmpMessage4 });
                                    } else {
                                        var tmpMessage4 = KSSClient.Engine.Common.GetMessage(res.data.discountStdMains[i].discountStdEffectiveDate[j].discountStdRange.discountStdRangeH[k]._result._message);
                                        if (tmpMessage4 != "") error.push({ index: (13 + k) + '', message: tmpMessage4 });
                                    }
                                }
                            }
                        }
                    }

                    //console.log(error);

                    $discountStdMain.excel.table.push(KSSClient.Engine.Common.CreateTable($discountStdMain.excel.data[i], error));
                    if (error.length != 0) { $discountStdMain.excel.errorSheet.push(true); }
                    else { $discountStdMain.excel.errorSheet.push(false); }
                
                }
                $discountStdMain.open();
            }

            $scope.GetDiscountStdMain();
            $rootScope.selectGrid[0] = undefined
            $rootScope.GridSelectChanged(-1);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

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
                if (res.data.discountStdMains[0].type == 'C') {
                    count = res.data.discountStdMains[0].discountStdEffectiveDate[0].discountStdProdCode.discountStdValues.length;
                }
                else if (res.data.discountStdMains[0].type == 'R') {
                    count = res.data.discountStdMains[0].discountStdEffectiveDate[0].discountStdRange.discountStdRangeH.length;
                }

                common.AlertMessage("Success", "นำเข้าข้อมูลจำนวน " + count + " รายการ เรียบร้อย");
                $uibModalInstance.close(res);
            },
            error: function (res) {
                if (res.message.substring(0, 1) == 'O') {
                    common.AlertMessage("Error", res.message);
                    $uibModalInstance.dismiss('cancel');
                } else {
                    common.AlertMessage("Error", "นำเข้าข้อมูลไม่สำเร็จ กรุณาปิดหน้าต่างแล้วนำเข้าข้อมูลใหม่");
                    $uibModalInstance.close(res);
                }
            }
        });
    };

    $discountStdMain.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

///------------------------------------------------------------------ grid prodcodeDiscount SearchEffectDate ----------------------------------------------------------------------------

app.controller("discountStdSearchEffectDate", function ($rootScope, $scope, common, uiGridConstants) {

    // init value grid 2
    $scope.IP_DB = $rootScope.IP_DB;
    $scope.dtpFrom = new Date();
    $scope.dtpFrom.setDate($scope.dtpFrom.getDate() - 30);
    $scope.dtpTo = new Date();
    $scope.dtpTo.setDate($scope.dtpTo.getDate() + 30);

    $scope.dtpGridFrom = new Date();
    $scope.dtpGridTo = new Date();


    $scope.gridOpt = common.CreateGrid2({ mSelect: false, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', langCode: 'GRID_EFFECT_CODE', display: 'Effective Date No.', width: { min: 179 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateFrom', langCode: 'GRID_EFFECT_DATEFROM', display: 'Date From', width: { min: 110 }, format: { type: 'date' }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateTo', langCode: 'GRID_EFFECT_DATETO', display: 'Date To', width: { min: 110 }, format: { type: 'date' }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'countApprove_countTotal', langCode: 'GRID_EFFECT_COUNT', display: 'Count Approve', width: { min: 137 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', langCode: 'GRID_EFFECT_STATUS', display: 'Status', width: { min: 78 }, setclass: common.ClassGridStatus, cellFilter: 'mapDiscountStdEffectiveDateStatus' }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'create.by', langCode: 'GRID_EFFECT_CREATE', display: 'Create By', width: { min: 240 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'create.datetime', langCode: 'GRID_EFFECT_CREATEDATE', display: 'Create Date', width: { min: 125 }, format: { type: 'datetime' }, setclass: common.ClassGridStatus }));

    $scope.SetGridLang = function () {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "SETUP_COST_DISCOUNTSTD" },
            callback: function (obj) {
                $scope.PH_FINDLIST[0] = obj['PH_FINDLIST1'] != undefined ? obj['PH_FINDLIST1'] : '{PH_FINDLIST1}';
                $scope.PH_FINDLIST[1] = obj['PH_FINDLIST2'] != undefined ? obj['PH_FINDLIST2'] : '{PH_FINDLIST2}';
                $scope.PH_FINDLIST[2] = obj['PH_FINDLIST3'] != undefined ? obj['PH_FINDLIST3'] : '{PH_FINDLIST3}';
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) {
                //common.AlertMessage("Error", res.message);
            }
        });
    }
    
    $scope.cumulative = function (grid, myRow, myCol, option = 0) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field == "effectiveDateFrom") {
                if (option == 1) { if (myRow.entity.effectiveOldDateFrom != "") { return true; } }
                else if (option == 2) { if (myRow.entity.effectiveOldDateFrom != "") { return KSSClient.Engine.Common.GetDateView(new Date(myRow.entity.effectiveOldDateFrom)); } }
                else { return KSSClient.Engine.Common.GetDateView(myRow.entity.effectiveDateFrom); }
            }
            else if (myCol.field == "effectiveDateTo") {
                if (option == 1) { if (myRow.entity.effectiveOldDateTo != "") { return true; } }
                else if (option == 2) { if (myRow.entity.effectiveOldDateTo != "") { return KSSClient.Engine.Common.GetDateView(new Date(myRow.entity.effectiveOldDateTo)); } }
                else { return KSSClient.Engine.Common.GetDateView(myRow.entity.effectiveDateTo); }
            }
            else if (myCol.field == "create.datetime") {
                return KSSClient.Engine.Common.GetDateTimeView(myRow.entity.create.datetime);
            }
        }
        return false;
    };

    $scope.TxtSearchChange = function (txt) {
        $rootScope.txtSearch = txt;
    };

    $scope.filter = function () {
        $scope.gridApi.grid.refresh();
    };

    $rootScope.DateFilter = function (renderableRows) {
        renderableRows.forEach(function (row) {
            var match = false;
            if (
                (($scope.dtpFrom >= row.entity.effectiveDateFrom) && ($scope.dtpFrom <= row.entity.effectiveDateTo))
                || (($scope.dtpTo >= row.entity.effectiveDateFrom) && ($scope.dtpTo <= row.entity.effectiveDateTo))
                || (($scope.dtpFrom <= row.entity.effectiveDateFrom) && ($scope.dtpTo >= row.entity.effectiveDateTo))
                || (($scope.dtpFrom >= row.entity.effectiveDateFrom) && ($scope.dtpTo <= row.entity.effectiveDateTo))
            ) {
                match = true;
            }
            if (!match) { row.visible = false; }
        });
        return renderableRows;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) { $rootScope.selectGrid[1] = row.entity; }
            else { $rootScope.selectGrid[1] = undefined; }
            $rootScope.GridSelectChanged(1);
        });
        $scope.gridApi.grid.registerRowsProcessor($scope.DateFilter, 200);

        //gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
        //    $scope.gridApi.selection.selectRow(newRowCol.row.entity);
        //});
        $scope.SetGridLang();
    };

    $scope.PH_FINDLIST = [
        "รหัสสินค้า, รายละเอียดสินค้า, หน่วยขาย"
        , "เบอร์ใย, ประเภทเงื่อน, ประเภทการอบ, หน่วยขาย, ลักษณะหูทอ, กลุ่มสี, สี"
        , "เบอร์ใย, หน่วยขาย, กลุ่มสี, สี"
    ];

    $scope.SetTooltip = function () {
        if ($rootScope.selectGrid[0] != undefined) {
            if ($rootScope.selectGrid[0].type == 'C') {
                $scope.searchTooltip = $scope.PH_FINDLIST[0];
            }
            else if ($rootScope.selectGrid[0].type == 'R') {
                if (PRODUCT1.indexOf($rootScope.selectGrid[0].productType.code) > -1) {
                    $scope.searchTooltip = $scope.PH_FINDLIST[1];
                }
                else if (PRODUCT2.indexOf($rootScope.selectGrid[0].productType.code) > -1) {
                    $scope.searchTooltip = $scope.PH_FINDLIST[2];
                }
            }
        }
    };

    $scope.SetTooltip();

    $rootScope.GetDiscountStdEffectiveDates = function (discountStdMainID = '', search = '', discountStdValueStatus = '') {
        if (discountStdMainID == '') { $scope.gridOpt.data = []; return false }
        $scope.SetTooltip();
        KSSClient.API.DiscountStd.SearchEffectiveDate({
            data: { discountStdMainID: discountStdMainID, search: search, discountStdValueStatus: discountStdValueStatus },
            callback: function (res) {
                res.data.discountStdEffectiveDates.forEach(function (row, index) {

                    row.effectiveDateFrom = KSSClient.Engine.Common.CreateDateTime(row.effectiveDateFrom);
                    row.effectiveDateTo = KSSClient.Engine.Common.CreateDateTime(row.effectiveDateTo);
                    row.effectiveOldDateFrom = KSSClient.Engine.Common.CreateDateTime(row.effectiveOldDateFrom);
                    row.effectiveOldDateTo = KSSClient.Engine.Common.CreateDateTime(row.effectiveOldDateTo);
                    row.create.datetime = KSSClient.Engine.Common.CreateDateTime(row.create.datetime);

                    row.countApprove_countTotal = row.countApprove + "/" + row.countTotal;
                });
                $scope.gridOpt.data = res.data.discountStdEffectiveDates;
                $scope.gridApi.grid.refresh();
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    }

    $scope.RefreshEffectDate = function () {
        if ($rootScope.selectGrid[0] != undefined)
            $rootScope.GetDiscountStdEffectiveDates($rootScope.selectGrid[0].id, $rootScope.txtSearch, $rootScope.DiscountStdEffectiveDateStatus.select.id);
        $rootScope.GetSearchDiscountRangeH();
        $rootScope.GetDiscountSearchAction();
    };

});

///------------------------------------------------------------------ grid prodcodeDiscount Filter ----------------------------------------------------------------------------
app.controller("discountStdFilter", function ($rootScope, $scope, common) {

    // values
    $scope.IP_DB = $rootScope.IP_DB;
    var gridDiscountStdRangeH = [];

    $scope.gridOpt = common.CreateGrid2({ mSelect: false, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'minTwineSizeCode', langCode: 'GRID_RANGH_DIAFROM', display: 'Dia From', width: { min: 115 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'maxTwineSizeCode', langCode: 'GRID_RANGH_DIATO', display: 'Dai To', width: { min: 115 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'knot.view', langCode: 'GRID_RANGH_KNOT', display: 'Unit Sale', width: { min: 147 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'stretching.view', langCode: 'GRID_RANGH_STRET', display: 'Color Group', width: { min: 118 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'unitType.view', langCode: 'GRID_RANGH_UNITTYPE', display: 'Grade', width: { min: 100 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'selvageWovenType.view', langCode: 'GRID_RANGH_SELVAGE', display: 'Currency', width: { min: 117 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'colorGroups.view', langCode: 'GRID_RANGH_COLORGROUP', display: 'Currency', width: { min: 125 }, setclass: common.ClassGridStatus }));

    $scope.hideCol = ['knot.view', 'stretching.view', 'selvageWovenType.view'];

    $scope.gridColorSearch = common.CreateGrid2({ mSelect: false, footer: true });
    $scope.gridColorSearch.columnDefs.push(common.AddColumn2({ name: 'code', langCode: 'GRID_COLOR_CODE', display: 'Code', width: { min: 55 } }));
    $scope.gridColorSearch.columnDefs.push(common.AddColumn2({ name: 'description', langCode: 'GRID_COLOR_DES', display: 'Description' }));


    $scope.gridColorSearch.onRegisterApi = function (gridApi) {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "SETUP_COST_DISCOUNTSTD" },
            callback: function (obj) {
                common.GridLang(gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) {}
        });
    }

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
        }
        return false;
    };

    $scope.SetGridLang = function () {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "SETUP_COST_DISCOUNTSTD" },
            callback: function (obj) {
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) {}
        });
    }

    $rootScope.GetSearchDiscountRangeH = function (model = -1, DiscountEffectiveDateID = '', search = '', DiscountStdValueStatus = '') {
        $scope.gridOpt.data = [];
        $scope.gridColorSearch.data = [];
        $scope.gridApi.grid.refresh();
        switch (model) {
            case 1: //$scope.gridOpt.columnDefs = gridDiscountStdRangeH1;
                $scope.tableSelect = "sxsProductKnot, sxsProductStretching, sxsUnitType, sxsProductSelvageWovenType, sxsProductColorGroup";
                break;
            case 2: //$scope.gridOpt.columnDefs = gridDiscountStdRangeH2;
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

        KSSClient.API.DiscountStd.SearchDiscountRangeH({
            data: { DiscountEffectiveDateID: DiscountEffectiveDateID, search: search, DiscountStdValueStatus: DiscountStdValueStatus },
            callback: function (res) {
                res.data.discountStdRangeHs.forEach(function (row, index) {
                    row.knot.view = common.GetCodeDescription(row.knot);
                    row.stretching.view = common.GetCodeDescription(row.stretching);
                    row.unitType.view = common.GetCodeDescription(row.unitType);

                    row.selvageWovenType.view = common.GetCodeDescription(row.selvageWovenType);
                    row.colorGroups.view = common.GetCodeDescription(row.colorGroups);
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
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            console.log(row);
            if (row.isSelected) {
                $rootScope.selectGrid[2] = row.entity;
                $scope.gridColorSearch.data = row.entity.colorGroups.colors;
            }
            else {
                $rootScope.selectGrid[2] = undefined;
                $scope.gridColorSearch.data = [];
            }
            $rootScope.GridSelectChanged(2);
        });

        //gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
        //    $scope.gridApi.selection.selectRow(newRowCol.row.entity);
        //});
        $scope.SetGridLang();
    };

});

///------------------------------------------------------------------ grid prodcodeDiscount Action ----------------------------------------------------------------------------
app.controller("discountStdAction", function ($rootScope, $scope, common) {

    // values
    $scope.IP_DB = $rootScope.IP_DB;
    $rootScope.UnitType = {};
    $scope.chkAll = false;
    $scope.title = "ตารางกำหนดสเปคสินค้าจาก ขนาดผลิตภัณฑ์ & ส่วนลด";

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, expandable: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', langcode: 'GRID_VALUE_NO', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, setclass: common.ClassGridStatus, sort: false, filter: false, pinnedLeft: false }));
    // P
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.code', langCode: 'GRID_VALUE_PDCODE', display: 'Product Code', width: { min: 140 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.description', langCode: 'GRID_VALUE_PDDES', display: 'Description', width: { min: 350 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.seriesDescription', langCode: 'GRID_VALUE_PDSERIES', display: 'Series', width: { min: 185 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.selvedgeDescription', langCode: 'GRID_VALUE_PDSELVED', display: 'ลักษณะหู', width: { min: 185 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.rumeDescription', langCode: 'GRID_VALUE_PDRUME', display: 'Rume Type', width: { min: 185 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'unitType.view', langCode: 'GRID_VALUE_UNITTYPE', display: 'Unit Sale', width: { min: 100 }, setclass: common.ClassGridStatus }));

    // R net
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'minEyeSizeCM', langCode: 'GRID_VALUE_MESHFROM', display: 'MESH From', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'maxEyeSizeCM', langCode: 'GRID_VALUE_MESHTO', display: 'MESH To', width: { min: 120 }, format: { type: 'decimal', scale: 2 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'minEyeAmountMD', langCode: 'GRID_VALUE_MDFROM', display: 'MD From', width: { min: 126 }, format: { type: 'decimal', scale: 2 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'maxEyeAmountMD', langCode: 'GRID_VALUE_MDTO', display: 'MD To', width: { min: 126 }, format: { type: 'decimal', scale: 2 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'minLengthM', langCode: 'GRID_VALUE_MTRSFROM', display: 'MTRS From', width: { min: 125 }, format: { type: 'decimal', scale: 2 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'maxLengthM', langCode: 'GRID_VALUE_MTRSTO', display: 'MTRS To', width: { min: 125 }, format: { type: 'decimal', scale: 2 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tagDescription', langCode: 'GRID_VALUE_TAG', display: 'Tag Description', width: { min: 300 }, setclass: common.ClassGridStatus }));

    // R t
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'twineSeries.view', langCode: 'GRID_VALUE_PDSERIES', display: 'Series', width: { min: 120 }, setclass: common.ClassGridStatus }));

    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountPercent', langCode: 'GRID_VALUE_PERCENT', display: '% Discount', width: { min: 100 }, format: { type: 'decimal', scale: 2 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'discountAmount', langCode: 'GRID_VALUE_AMOUNT', display: 'Discount Amount', width: { min: 126 }, format: { type: 'decimal', scale: 2 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'increaseAmount', langCode: 'GRID_VALUE_INCREASE', display: 'Increase Amount', width: { min: 126 }, format: { type: 'decimal', scale: 2 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'approve.status', langCode: 'GRID_VALUE_APPSTATE', display: 'Approve', width: { min: 75 }, format: { type: 'truefalse' }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'approve.by', langCode: 'GRID_VALUE_APPBY', display: 'Approve By', width: { min: 240 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'approve.datetime', langCode: 'GRID_VALUE_APPDATE', display: 'Approve Date', width: { min: 125 }, format: { type: 'datetime' }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', langCode: 'GRID_VALUE_STATUS', display: 'Status', width: { min: 100 }, cellFilter: 'mapDiscountStdApproveStatus', setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'modify.by', langCode: 'GRID_VALUE_MODIBY', display: 'Modify By', width: { min: 240 }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'modify.datetime', langCode: 'GRID_VALUE_MODIDATE', display: 'Modify Date', width: { min: 125 }, format: { type: 'datetime' }, setclass: common.ClassGridStatus }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'seq', langCode: 'GRID_VALUE_SEQ', display: 'Seq', width: { min: 55 }, setclass: common.ClassGridStatus }));

    $scope.SetGridLang = function () {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "SETUP_COST_DISCOUNTSTD" },
            callback: function (obj) {
                $scope.PN_PRICEVALUE[0] = obj['PN_DISCOUNTVALUE1'] != undefined ? obj['PN_DISCOUNTVALUE1'] : '{PN_DISCOUNTVALUE1}';
                $scope.PN_PRICEVALUE[1] = obj['PN_DISCOUNTVALUE2'] != undefined ? obj['PN_DISCOUNTVALUE2'] : '{PN_DISCOUNTVALUE2}';
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) {}
        });
    }

    //var header = {};
    //header['category'] = [
    //    { name: 'pricecode', display: '', visible: true },
    //    { name: 'description', display: '', visible: true },
    //    { name: 'effectiveDateFrom', display: '', visible: true },
    //    { name: 'effectiveDateTo', display: '', visible: true },
    //    { name: 'fob', display: 'FOB', visible: true },
    //    { name: 'caf', display: 'C&F', visible: true },
    //    { name: 'cif', display: 'CIF', visible: true },
    //    { name: 'end', display: '', visible: true }
    //];

    var SubClassGrid = function (grid, row) {
        if ((parseFloat(row.entity.restFOB) < 0 && parseFloat(row.entity.priceFOB) != 0)
            || (parseFloat(row.entity.restCAF) < 0 && parseFloat(row.entity.priceCAF) !=0) 
            || (parseFloat(row.entity.restCIF) < 0 && parseFloat(row.entity.priceCIF) != 0) ) {
            return 'ui-red';
        }
    }

    //$scope.subGridOpt = common.CreateGrid(undefined, false, header, false);

    $scope.subGridOpt = common.CreateGrid2({});
    //$scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No', width: { min: 55, max: 55 }, format: { type: 'numRow' }, setclass: SubClassGrid, sort: false, filter: false }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'priceStdTableCode', display: 'Price code', width: { min: 140 }, setclass: SubClassGrid }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'productDescription', display: 'Description', width: { min: 340 }, setclass: SubClassGrid }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateFrom', display: 'Effective Date From', width: { min: 140 }, format: { type: 'datetime' }, setclass: SubClassGrid }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'effectiveDateTo', display: 'Effective Date To', width: { min: 140 }, format: { type: 'datetime' }, setclass: SubClassGrid }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'priceFOB', display: 'Price', width: { min: 80 }, setclass: SubClassGrid, group: { name: 'fob', display: 'FOB', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'restFOB', display: 'Rest', width: { min: 80 }, setclass: SubClassGrid, group: { name: 'fob', display: 'FOB', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'priceCAF', display: 'Price', width: { min: 80 }, setclass: SubClassGrid, group: { name: 'caf', display: 'C&F', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'restCAF', display: 'Rest', width: { min: 80 }, setclass: SubClassGrid, group: { name: 'caf', display: 'C&F', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'priceCIF', display: 'Price', width: { min: 80 }, setclass: SubClassGrid, group: { name: 'cif', display: 'CIF', langCode: '' } }));
    $scope.subGridOpt.columnDefs.push(common.AddColumn2({ name: 'restCIF', display: 'Rest', width: { min: 80 }, setclass: SubClassGrid, group: { name: 'cif', display: 'CIF', langCode: '' } }));


    $scope.subGridOpt.appScopeProvider = {
        cumulative: function (grid, myRow, myCol) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field == "effectiveDateFrom") {
                return KSSClient.Engine.Common.GetDateView(myRow.entity.effectiveDateFrom);
            }
            else if (myCol.field == "effectiveDateTo") {
                return KSSClient.Engine.Common.GetDateView(myRow.entity.effectiveDateTo);
            }
            return false;
        }
    };
    $scope.subGridOpt.onRegisterApi = function (gridApi) {
        $scope.subgridApi = gridApi;
    };

    //$scope.SubClassGrid
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('priceStdTableCode', 'PriceCode', '', false, false, { min: 140, default: 140 }, '', {}, '', 'pricecode', false));
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('productDescription', 'Description', '', false, false, { min: 340, default: 340 }, '', {}, '', 'description', false));
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('effectiveDateFrom', 'effectiveDateFrom', '', false, false, { min: 140, default: 140 }, '', { type: 'datetime' }, '', 'effectiveDateFrom', false));
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('effectiveDateTo', 'effectiveDateTo', '', false, false, { min: 140, default: 140  }, '', { type: 'datetime' }, '', 'effectiveDateTo', false));
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('priceFOB', 'Price', '', false, false, { min: 80, default: 80 }, '', { type: 'decimal', scale: 2 }, '', 'fob', false));
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('restFOB', 'Rest', '', false, false, { min: 80, default: 80}, '', { type: 'decimal', scale: 2 }, '', 'fob', false));
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('priceCAF', 'Price', '', false, false, { min: 80, default: 80 }, '', { type: 'decimal', scale: 2 }, '', 'caf', false));
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('restCAF', 'Rest', '', false, false, { min: 80, default: 80 }, '', { type: 'decimal', scale: 2 }, '', 'caf', false));
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('priceCIF', 'Price', '', false, false, { min: 80, default: 80 }, '', { type: 'decimal', scale: 2 }, '', 'cif', false));
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('restCIF', 'Rest', '', false, false, { min: 80, default: 80  }, '', { type: 'decimal', scale: 2 }, '', 'cif', false));
    //$scope.subGridOpt.columnDefs.push(common.AddColumn('end', '', '', false, false, { min: 0, max: 0 }, '', {},'', 'end', false));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field == "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid == row.uid) { numRow = (index + 1); }
                });
                return numRow;
            } else if (myCol.field == "modify.datetime") {
                return KSSClient.Engine.Common.GetDateTimeView(myRow.entity.modify.datetime);
            } else if (myCol.field == "approve.datetime") {
                return KSSClient.Engine.Common.GetDateTimeView(myRow.entity.approve.datetime);
            } else if (myCol.field == 'approve.status') {
                if (myRow.entity.approve.status == 'A') { return 1; }
                else if (myRow.entity.approve.status == 'C') { return 2 }
                else { return 3; }
            }

        }
        return false;
    };


    // function     
    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); $scope.chkSel = true; }
        else { $scope.gridApi.selection.clearSelectedRows(); $scope.chkSel = false; }
    };

    $rootScope.ShowCol = function (col) {
        $scope.gridOpt.columnDefs[4].visible = false;
        $scope.gridOpt.columnDefs[5].visible = false;
        $scope.gridOpt.columnDefs[6].visible = false;
        if (col != undefined) $scope.gridOpt.columnDefs[col].visible = true;
        $scope.gridApi.grid.refresh();
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if ($rootScope.setupDiscount == 0 && $rootScope.discountprod) {
                if (row.isSelected) { $rootScope.GetDiscountProductLayer(row.entity.product.id); }
                else { $rootScope.GetDiscountProductLayer(); }
            }
            if ($scope.gridApi.selection.getSelectedRows().length != 0) { $scope.chkSel = true; }
            else { $scope.chkSel = false; }
        });

        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            //$scope.gridApi.selection.selectRow(newRowCol.row.entity);
            if ($rootScope.setupDiscount == 0 && $rootScope.discountprod) {
                $rootScope.GetDiscountProductLayer(newRowCol.row.entity.product.id);
            }
        });
        
        gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
            
            if (!row.expandedRendered) {

                row.expandedRowHeight = 0;
                row.entity.subGridOpt.height = 0;
                row.entity.subGridOpt.width = row.grid.gridWidth - (row.grid.renderContainers.left.canvasWidth + 22);
                row.entity.subGridOpt.margin = (row.grid.renderContainers.body.prevScrollLeft - row.grid.renderContainers.body.columnOffset);

                //row.expandedRowHeight = 0 ;
                //row.entity.subGridOpt.height = 0;
                //row.entity.subGridOpt.width = row.grid.gridWidth - 58;
                //row.entity.subGridOpt.margin = (row.grid.renderContainers.body.prevScrollLeft - row.grid.renderContainers.body.columnOffset);

                // function res
                function SetData_SubGridOpt(res) {
                    res.data.priceStds.forEach(function (r, index) {
                        r.effectiveDateFrom = KSSClient.Engine.Common.CreateDateTime(r.effectiveDateFrom);
                        r.effectiveDateTo = KSSClient.Engine.Common.CreateDateTime(r.effectiveDateTo);
                        r.restFOB = KSSClient.Engine.Common.PriceToRest(r.priceFOB, row.entity.discountPercent, row.entity.discountAmount, row.entity.increaseAmount);
                        r.restCAF = KSSClient.Engine.Common.PriceToRest(r.priceCAF, row.entity.discountPercent, row.entity.discountAmount, row.entity.increaseAmount);
                        r.restCIF = KSSClient.Engine.Common.PriceToRest(r.priceCIF, row.entity.discountPercent, row.entity.discountAmount, row.entity.increaseAmount);
                    });
                    row.entity.subGridOpt.data = res.data.priceStds;

                    var dataCount = row.entity.subGridOpt.data.length;
                    row.expandedRowHeight = dataCount == 0 ? 0 : 64 + (dataCount * 30) + 18 + 30;
                    if (row.expandedRowHeight > 200) {
                        row.expandedRowHeight = 200;
                    }

                    row.entity.subGridOpt.height = 63 + (dataCount * 30) + 18 + 30;

                    //row.expandedRowHeight = res.data.priceStds.length == 0 ? 0 : 64 + (row.entity.subGridOpt.data.length * 48);
                    ////row.expandedRowHeight = 64 + (row.entity.subGridOpt.data.length * 30);
                    //row.entity.subGridOpt.height = 63 + (row.entity.subGridOpt.data.length * 48);
                    $scope.subgridApi.grid.refresh();
                }

                if ($rootScope.setupDiscount == 0) {
                    KSSClient.API.PriceStd.SearchByCodeForDiscount({
                        data: {
                            effectiveDateTo: KSSClient.Engine.Common.GetDateString($rootScope.selectGrid[1].effectiveDateTo)
                            , effectiveDateFrom: KSSClient.Engine.Common.GetDateString($rootScope.selectGrid[1].effectiveDateFrom)
                            , productID : row.entity.product.id
                            , currencyID : $rootScope.selectGrid[0].currency.id
                            , customerID : $rootScope.selectGrid[0].customer.id
                            , unitTypeID : row.entity.unitType.id
                        },
                        callback: SetData_SubGridOpt,
                        error: function (res) {
                            common.AlertMessage("Error", res.message);
                        }
                    });
                } else if ($rootScope.setupDiscount > 0) {
                    KSSClient.API.PriceStd.SearchByRangeForDiscount({
                        data: {
                            effectiveDateTo: KSSClient.Engine.Common.GetDateString($rootScope.selectGrid[1].effectiveDateTo)
                            , effectiveDateFrom: KSSClient.Engine.Common.GetDateString($rootScope.selectGrid[1].effectiveDateFrom)
                            , customerID: $rootScope.selectGrid[0].customer.id
                            , productTypeID: $rootScope.selectGrid[0].productType.id
                            , productGradeID: $rootScope.selectGrid[0].productGrade.id
                            , currencyID: $rootScope.selectGrid[0].currency.id
                            , unitTypeID: $rootScope.selectGrid[2].unitType.id
                            , minTwineSizeCode: $rootScope.selectGrid[2].minTwineSizeCode
                            , maxTwineSizeCode: $rootScope.selectGrid[2].maxTwineSizeCode
                            , knotID: $rootScope.selectGrid[2].knot.id
                            , stretchingID: $rootScope.selectGrid[2].stretching.id
                            , selvageWovenTypeID: $rootScope.selectGrid[2].selvageWovenType.id
                            , colorGroupID: $rootScope.selectGrid[2].colorGroups.id
                            , twineseriesID: row.entity.twineSeries.id
                            , minEyeSize: row.entity.minEyeSizeCM
                            , maxEyeSize: row.entity.maxEyeSizeCM
                            , minEyeAmt: row.entity.minEyeAmountMD
                            , maxEyeAmt: row.entity.maxEyeAmountMD
                            , minLen: row.entity.minLengthM
                            , maxLen: row.entity.maxLengthM
                        },
                        callback: SetData_SubGridOpt,
                        error: function (res) {
                            common.AlertMessage("Error", res.message);
                        }
                    });
                }
            } 
        });

        $scope.gridApi.grid.registerRowsProcessor($scope.StatusFilter, 200);

        $scope.SetGridLang();

        $scope.$watch('gridApi.grid.gridWidth', function () {
            $scope.gridApi.grid.renderContainers.body.renderedRows.forEach(function (row) {
                if (row.isExpanded == true) {
                    row.entity.subGridOpt.width = $scope.gridApi.grid.gridWidth - ($scope.gridApi.grid.renderContainers.left.canvasWidth + 22);
                }
            });
        });

        $scope.$watch('gridApi.grid.renderContainers.body.prevScrollLeft', function () {
            $scope.gridApi.grid.renderContainers.body.renderedRows.forEach(function (row) {
                if (row.isExpanded == true) {
                    row.entity.subGridOpt.margin = ($scope.gridApi.grid.renderContainers.body.prevScrollLeft - $scope.gridApi.grid.renderContainers.body.columnOffset);
                    if (($scope.gridApi.grid.renderContainers.body.prevScrollLeft + row.entity.subGridOpt.width + 2) > $scope.gridApi.grid.renderContainers.body.canvasWidth) {
                        row.entity.subGridOpt.margin = $scope.gridApi.grid.renderContainers.body.canvasWidth - (row.entity.subGridOpt.width + $scope.gridApi.grid.renderContainers.body.columnOffset + 2);
                    }
                }
            });
        });
    };
        
    $scope.sortChanged = function (grid, sortColumns) {
        if (sortColumns[0] != undefined) {
            if (sortColumns[0].colDef.name == 'product.description' || sortColumns[0].colDef.name == 'product.code') {
                switch (sortColumns[0].sort.direction) {
                    case uiGridConstants.DESC:
                        //console.log("DESC");
                        common.SortProduct($scope.gridOpt.data, false);
                        break;
                    default:
                        //console.log("ASC");
                        common.SortProduct($scope.gridOpt.data);
                        break;
                }
            }
        }
        $scope.gridApi.grid.refresh();
    };

    $scope.tableSelect = "sxsDiscountStdProd";

    $scope.PN_PRICEVALUE = [
        "ตารางรหัสผลิตภัณฑ์ & ราคากลาง"
        , "ตารางกำหนดสเปคสินค้าจาก ขนาดผลิตภัณฑ์ & ราคากลาง"
    ];

    $scope.show0 = ['product.code', 'product.description', 'product.seriesDescription', 'product.selvedgeDescription', 'product.rumeDescription', 'unitType.view'];
    $scope.show1 = ['minEyeSizeCM', 'maxEyeSizeCM', 'minEyeAmountMD', 'maxEyeAmountMD', 'minLengthM', 'maxLengthM', 'tagDescription'];
    $scope.show2 = ['twineSeries.view'];
    
    $rootScope.GetDiscountSearchAction = function (setupDiscount = -1, discountEffectiveDateID = '', discountRangeHID = '', search = '', discountStdValueStatus = '') {
        $scope.gridOpt.data = [];
        $scope.chkAll = false;
        $scope.chkSel = false;
        $scope.gridApi.grid.refresh();
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

        $scope.SetGridLang();

        if (setupDiscount == 0) {
            $scope.tableSelect = "sxsDiscountStdProd";
            KSSClient.API.DiscountStd.SearchDiscountProd({
                data: { discountEffectiveDateID: discountEffectiveDateID, search: search, discountStdValueStatus: discountStdValueStatus },
                callback: function (res) {
                    res.data.discountStdValues.forEach(function (row, index) {
                        row.unitType.view = common.GetCodeDescription(row.unitType);
                        row.modify.datetime = KSSClient.Engine.Common.CreateDateTime(row.modify.datetime);
                        row.approve.datetime = KSSClient.Engine.Common.CreateDateTime(row.approve.datetime);
                        row.subGridOpt = angular.copy($scope.subGridOpt);
                        row.sort = KSSClient.Engine.Common.convertProductCodeToObject(row.product.description);
                    });
                    $scope.gridOpt.data = res.data.discountStdValues;
                    common.SortProduct($scope.gridOpt.data);
                    $scope.gridApi.grid.refresh();
                    if ($rootScope.discountprod) {
                        $rootScope.GetDiscountProductLayer();
                    }
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });

        }
        else {
            $scope.tableSelect = "sxsDiscountStdRangeD";
            KSSClient.API.DiscountStd.SearchDiscountRangeValue({
                data: { discountEffectiveDateID: discountEffectiveDateID, discountRangeHID: discountRangeHID, search: search, discountStdValueStatus:discountStdValueStatus },
                callback: function (res) {
                    res.data.discountStdValues.forEach(function (row, index) {
                        row.modify.datetime = KSSClient.Engine.Common.CreateDateTime(row.modify.datetime);
                        row.approve.datetime = KSSClient.Engine.Common.CreateDateTime(row.approve.datetime);
                        row.twineSeries.view = common.GetCodeDescription(row.twineSeries);
                        row.subGridOpt = angular.copy($scope.subGridOpt);
                    });
                    $scope.gridOpt.data = res.data.discountStdValues;
                    $scope.gridApi.grid.refresh();
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        }
    };

    $scope.chkSel = false;
    $scope.status = 'A';
    $scope.selx = [];
    
    $scope.StatusUpDate = function (status) {
        // get sel id
        var i = 0;
        $scope.selx = [];
        $scope.gridApi.selection.getSelectedRows().forEach(function (row, index) {
            if (row.status == 'C' && status != 'C') { common.AlertMessage("Warning", "รายการที่ถูก Cancel จะไม่สามารถเปลี่ยนสถานะได้") }
            else { $scope.selx[i++] = row.id; }
        });
        if ($scope.selx.length == 0) { return false; }

        function ChkUpdateStatus(res) {
            var chkError = true;
            res.data.discountStdValues.forEach(function (row, index) {
                if (row._result._status == 'S') { chkError = false; }
            });
            if (chkError) { common.AlertMessage("Error", "อัปเดตสถานะไม่สำเร็จ."); }
            else { common.AlertMessage("Success", 'อัปเดตสถานะสำเร็จ.'); }
            $rootScope.GetDiscountSearchAction($rootScope.setupDiscount, $rootScope.selectGrid[1].id, ($rootScope.selectGrid[2] == undefined ? 0 : $rootScope.selectGrid[2].id), $rootScope.txtSearch, $rootScope.DiscountStdEffectiveDateStatus.select.id);
        }

        if (status == 'A') {
            KSSClient.API.DiscountStd.ActiveDiscount({
                data: { discountStdValueIDs: $scope.selx },
                callback: ChkUpdateStatus,
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        } else if (status == 'I') {
            KSSClient.API.DiscountStd.InactiveDiscount({
                data: { discountStdValueIDs: $scope.selx },
                callback: ChkUpdateStatus,
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        } else if (status == 'C') {
            KSSClient.API.DiscountStd.CancelDiscount({
                data: { discountStdValueIDs: $scope.selx },
                callback: ChkUpdateStatus,
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        }
    };

    //$scope.discountStatus = "";
    $scope.filter = function () {
        $scope.gridApi.grid.refresh();
    };
    $scope.StatusFilter = function (renderableRows) {
        renderableRows.forEach(function (row) {
            var match = false;
            if (row.entity.status == $rootScope.DiscountStdApproveStatus.select.id || $rootScope.DiscountStdApproveStatus.select.id == '') {
                match = true;
            }
            if (!match) { row.visible = false; }
        });
        return renderableRows;
    };

});

///------------------------------------------------------------------ grid Prodcut Layer ----------------------------------------------------------------------------
app.controller("discountStdProductLayer", function ($rootScope, $scope, common) {

    ////(name, title, focus = false, edit = false, width = '', cellFilter = '', type = {}, setclass = '', category = '', sort = '', pinning = '')
    //$scope.gridOpt = common.CreateGrid(undefined, false, null, false, false);
    //$scope.gridOpt.columnDefs.push(common.AddColumn('numRow', 'ลำดับการรุม', 'GRID_LAYER_NO', false, false, { min: 117, default: 117 }, '', { type: 'numRow' }, '', '', false, false, false));
    //$scope.gridOpt.columnDefs.push(common.AddColumn('product.code', 'รหัสสินค้า', 'GRID_LAYER_PDCODE', false, false, { min: 170 }, '', {}, '', '', false, false, false));
    //$scope.gridOpt.columnDefs.push(common.AddColumn('product.descriptionSale', 'รายละเอียดสินค้า', 'GRID_LAYER_PDDES', false, false, { min: 340 }, '', {}, '', '', false, false, false));
    //$scope.gridOpt.columnDefs.push(common.AddColumn('product.productSelvageWoven.view', 'ลักษณะหูทอ', 'GRID_LAYER_PDSELVAGE', false, false, { min: 200 }, '', {}, '', '', false, false, false));

    $scope.gridOpt = common.CreateGrid2({ footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', langcode: 'GRID_LAYER_NO', display: 'No', width: { min: 117 }, format: { type: 'numRow' }, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.code', langCode: 'GRID_LAYER_PDCODE', display: 'Effective Date No.', width: { min: 170 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.descriptionSale', langCode: 'GRID_LAYER_PDDES', display: 'Table Type', width: { min: 340 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'product.productSelvageWoven.view', langCode: 'GRID_LAYER_PDSELVAGE', display: 'Product Type', width: { min: 200 } }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid == row.uid) {
                        numRow = (index + 1);
                    }
                });
                return numRow;
            }
        }
        return false;
    };

    $scope.SetGridLang = function () {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: "SETUP_COST_DISCOUNTSTD" },
            callback: function (obj) {
                common.GridLang($scope.gridApi.grid.renderContainers.body.visibleColumnCache, obj);
            },
            error: function (res) { }
        });
    }

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        $scope.SetGridLang();
    };

    $rootScope.GetDiscountProductLayer = function (productID = 0) {
        $scope.gridOpt.data = [];
        $scope.gridApi.grid.refresh();
        if (productID != 0) {
            KSSClient.API.Product.SearchLayer({
                data: { productID: productID },
                callback: function (res) {
                    res.data.products.forEach(function (row, index) {
                        row.product.productSelvageWoven.view = common.GetCodeDescription(row.product.productSelvageWoven);
                    });
                    $scope.gridOpt.data = res.data.products;
                    $scope.gridApi.grid.refresh();
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        }

    }
});

