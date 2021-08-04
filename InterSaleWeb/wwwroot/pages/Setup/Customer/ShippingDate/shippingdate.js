'use strict';
app.controller("shippingdateController", function ($rootScope, $scope ,common) {
 
    $scope.IP_DB = $rootScope.IP_DB + 'sxsCustomer, sxsEmployee, sxsShipmentPlanDateCircle | saleex.saleex.dbo.CUSTOMER';

    $rootScope.days = [
        { id: 0, view: 'Sunday' },
        { id: 1, view: 'Monday' },
        { id: 2, view: 'Tuesday' },
        { id: 3, view: 'Wednesday' },
        { id: 4, view: 'Thursday' },
        { id: 5, view: 'Friday' },
        { id: 6, view: 'Saturday' }
    ];
    
    $scope.PH_shippingDate = "CusCode, CusDes, SalesCode, SaleDes";

    var SetClass = function (grid, row, col) {
        var cellClass = '';
        var tmp = col.name.split('.');
        var obj = angular.copy(row.entity);
        for (var i = 0; i < tmp.length; i++) {
            if (i == tmp.length - 1) {
                if (obj) {
                    if (obj[tmp[i] + 'org'] && obj[tmp[i] + 'org'] != obj[tmp[i]]) {
                        cellClass += 'bg-warning ';
                    }
                }
            } else {
                obj = obj[tmp[i]];
            }
        }
        return cellClass;
    }

    $scope.gridOpt = common.CreateGrid2({ footer: true, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 65, max: 65 }, format: { type: 'numRow' }, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'customer.view', display: 'Customer', width: { min: 150 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'saleEmployee.view', display: 'Sales', width: { min: 150 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'shippingDay', display: 'Shipping Day', edit: true, width: { default: 150 }, setclass: SetClass, cellFilter: 'mapDays', format: { type: 'dropdown', items: $rootScope.days } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'modify.datetime', display: 'Last Update', width: { min: 150 }, format: { type: 'customText' } }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid == row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            } else if (myCol.field == "modify.datetime") {
                return KSSClient.Engine.Common.GetDateTimeView(myRow.entity.modify.datetime) + '  ' + myRow.entity.modify.by;
            }
        }
        return false;
    };

    $scope.dataEdit = [];

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_shippingdate01');
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            if (colDef.name == 'shippingDay') {
                if (newValue != oldValue && rowEntity.shippingDayorg != rowEntity.shippingDay) {
                    $scope.dataEdit.push({ customerID: rowEntity.customer.id, shippingDay: rowEntity.shippingDay });
                } else {
                    for (var i = $scope.dataEdit.length - 1; i >= 0; i--) {
                        if (rowEntity.customer.id == $scope.dataEdit[i].customerID) {
                            $scope.dataEdit.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            if ($scope.dataEdit.length) {
                $scope.btnSave = true;
                $scope.btnCancel = true;
            } else {
                $scope.btnSave = false;
                $scope.btnCancel = false;
            }
            $scope.$apply();
        });

        $scope.LoadData();
    };

    $scope.LoadData = function (txtFind) {
        KSSClient.API.ShipmentPlanDateCircle.SearchCustomer({
            data: { search: angular.isUndefined(txtFind) ? '' : txtFind, status: ['A'] },
            callback: function (res) {
                console.log(res);
                res.data.shipmentPlanDateCircles.forEach(function (row) {
                    row.customer.view = common.GetCodeDescription(row.customer);
                    row.saleEmployee.view = common.GetCodeDescription(row.saleEmployee);
                    row.enableEdit = true;
                    row.shippingDayorg = row.shippingDay;
                    row.create.datetime = KSSClient.Engine.Common.CreateDateTime(row.create.datetime);
                    row.modify.datetime = KSSClient.Engine.Common.CreateDateTime(row.modify.datetime);
                });
                $scope.gridOpt.data = res.data.shipmentPlanDateCircles;
                $scope.gridApi.grid.refresh();
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    }

    $scope.btnSave = false;
    $scope.btnCancel = false;

    $scope.SaveAction = function () {
        KSSClient.API.ShipmentPlanDateCircle.Save({
            data: { shipmentPlanDateCircles: $scope.dataEdit },
            callback: function (res) {
                $scope.LoadData();
                $scope.btnSave = false;
                $scope.btnCancel = false;
                $scope.dataEdit = [];
                common.AlertMessage("Success", '');
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    }

    $scope.CancelAction = function () {
        $scope.gridApi.grid.options.data.forEach(function (row) {
            row.shippingDay = row.shippingDayorg;
        });
        $scope.dataEdit = [];
        $scope.btnSave = false;
        $scope.btnCancel = false;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    }
    

});