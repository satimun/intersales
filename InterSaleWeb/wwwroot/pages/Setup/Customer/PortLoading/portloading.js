'use strict';
app.controller("portloadingController", function ($rootScope, $scope, $timeout, uiGridConstants, common) {

    $scope.IP_DB = $rootScope.IP_DB + 'sxsPortLoading';

    // set status
    $scope.status = {};
    $scope.status.id = 'A';
    KSSClient.API.Constant.DefaultStatus({
        data: {},
        callback: function (res) {
            res.data.defaultStatus.forEach(function (r) {
                r.view = common.GetCodeDescription(r);
            });
            $scope.status.list = res.data.defaultStatus;
            if ($scope.status.list[1]) { $scope.status.view = $scope.status.list[1].view; }
            $scope.$apply();
        },
        error: function (res) { common.AlertMessage("Error", res.message); }
    });

    $scope.status.SetID = function (id) {
        $scope.status.id = id;
    }

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableGridEdit: true, enableInsert: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 65, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Code', edit: true, width: { default: 100 }, setclass: common.SetClassEdit, inputOpt: { placeholder: '[0-9][0-9]', maxlength: 2, pattern: /^[0-9]{2}$/m } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description', edit: true, width: { min: 150 }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', display: 'Status', width: { default: 100 }, setclass: common.SetClassEdit, cellFilter: 'mapStatus' }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 150 }, setclass: common.SetClassEdit }));

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        $scope.ChkChange();
    };

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field == "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => {
                    if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); return; }
                });
                return numRow;
            }
        }
        return false;
    };

    $scope.AddRow = function () {
        var obj = {};
        obj['id'] = 0;
        obj['code'] = "";
        obj['codeerr'] = true;
        obj['description'] = "";
        obj['descriptionerr'] = true;
        obj['status'] = "A";
        obj['isInsert'] = true;
        obj['enableEdit'] = true;
        $scope.gridOpt.data.push(obj);
        $timeout(function () {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 1]
                , $scope.gridApi.grid.options.columnDefs[2]);
            $scope.gridApi.core.scrollTo(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 2]
                , $scope.gridApi.grid.options.columnDefs[2]);
        }, 5);
        $scope.isChange = true;
        $scope.gridApi.grid.refresh();
    };

    $scope.RemoveRow = function (grid, row) {
        $scope.gridApi.grid.options.data.splice($scope.gridApi.grid.options.data.indexOf(row.entity), 1);
        $scope.gridApi.grid.refresh();
        $scope.ChkDataChange();
    };

    $scope.ChkDataChange = () => {
        var chk = false, chk2 = true;
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.isInsert || d.code !== d.codeorg || d.description !== d.descriptionorg) { chk = true; }
            if (d.codeerr || d.descriptionerr) { chk2 = false; }
        });
        $scope.btnSave = chk && chk2;
        $scope.btnCancel = $scope.isChange = chk;
    }


    $scope.GridFilter = function (renderableRows) {
        renderableRows.forEach(function (row) {
            if ($scope.status.id && !row.entity.isInsert) if (row.entity.status != $scope.status.id) { row.visible = false; }
            //if (!row.grid.options.showAllStatus && !row.entity.isInsert) if (row.entity.status === 'C') { row.isSelected = false;  row.visible = false; }
        });
        return renderableRows;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_setupPortLoading01');

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            //if (row.isSelected) { $rootScope.setRemarkTextCtrl_SetData(row.entity.remarks, row.entity.id, row.entity.status, row.entity.code); }
            //else { $rootScope.setRemarkTextCtrl_SetData(); }
            $scope.ChkChange();
        });

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.$apply();
            if (colDef.name == 'code') {
                for (var i = $scope.gridApi.grid.options.data.length - 1; i >= 0; i--) {
                    if ($scope.gridApi.grid.options.data[i].code == rowEntity.code && ($scope.gridApi.grid.options.data[i].$$hashKey != rowEntity.$$hashKey) && $scope.gridApi.grid.options.data[i].status != 'C') {
                        common.AlertMessage('Error', 'Cannot edit duplicate code : ' + rowEntity.code).then((val) => {
                            rowEntity.code = rowEntity.codeorg;
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                        });
                        newValue = rowEntity.codeorg;
                        break;
                    }
                }
            }

            if (!newValue) { common.AlertMessage('Error', 'Invalid data format.'); rowEntity[colDef.name + 'err'] = true; }
            else rowEntity[colDef.name + 'err'] = false;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $scope.ChkDataChange();
        });

        $scope.gridApi.grid.registerRowsProcessor($scope.GridFilter, 200);

        $scope.LoadData($scope.txtFind);
    };

    $scope.PreLoadData = () => {
        if ($scope.isChange) {
            common.ConfirmDialog('Data Change', 'Do you want to cancel data ?', false).then((chk) => {
                $scope.LoadData();
            });
        } else {
            $scope.LoadData();
        }
    }

    $scope.LoadData = function () {
        KSSClient.API.PortLoading.Search({
            data: { ids: [], search: angular.isUndefined($scope.txtFind) ? '' : $scope.txtFind, status: $scope.status.id },
            callback: function (res) {
                res.data.portLoadings.forEach((row) => {
                    row.enableEdit = row.status != 'C';
                    row.codeorg = row.code;
                    row.descriptionorg = row.description;
                    row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;
                });
                $scope.btnSave = $scope.btnCancel = $scope.isChange = false;
                $scope.gridOpt.data = res.data.portLoadings;
                $scope.gridApi.grid.refresh();
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    $scope.ChkChange = function () {
        $scope.btnActive = $scope.btnInactive = $scope.btnRemove = true;
        $scope.selx = [];
        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            if (!row.totalRow) {
                if (row.status == 'A') { $scope.btnActive = false; }
                else if (row.status == 'I') { $scope.btnInactive = false; }
                else if (row.status == 'C') { $scope.btnActive = $scope.btnInactive = $scope.btnRemove = false; }
                $scope.selx.push(row.id);
            }
        });
        if (!$scope.selx.length) { $scope.btnActive = $scope.btnInactive = $scope.btnRemove = false; }
    }

    $scope.btnSave = $scope.btnCancel = $scope.isChange = false;

    $scope.UpdateStatus = (status) => {
        KSSClient.API.PortLoading.UpdateStatus({
            data: { ids: $scope.selx, status: status },
            callback: function (res) {
                res.data.portLoadings.forEach(function (row) {
                    $scope.gridApi.grid.options.data.forEach((d) => {
                        if (d.id === row.id) {
                            d.status = row.status;
                            d.enableEdit = row.status !== 'C';
                            return;
                        }
                    });
                });
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                common.AlertMessage('Success', '').then((ok) => { $scope.gridApi.selection.clearSelectedRows(); });
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    $scope.UpdateStatusAction = (status) => {
        if (status == 'C') {
            var msg = "";
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) { if (!row.totalRow) msg += row.code + " : " + row.description + '\n'; });
            common.ConfirmDialog('Are you sure?', 'Remove PortLoading : \n' + msg).then((ok) => { if (ok) $scope.UpdateStatus(status); });
        } else { $scope.UpdateStatus(status); }
    }

    $scope.SaveAction = () => {
        var data = [];
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.isInsert || d.code !== d.codeorg || d.description !== d.descriptionorg ) {
                data.push(d);
            }
        });
        KSSClient.API.PortLoading.Save({
            data: { portLoadings: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $scope.LoadData($scope.txtFind); });
            },
            error: (res) => {
                var msg = '';
                res.data.portLoadings.forEach((v) => {
                    if (v._result._status === 'F') {
                        msg += 'Code : ' + v.code + ' : ' + v._result._message + '\n';
                    }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    }

    $scope.CancelAction = () => {
        for (var i = $scope.gridApi.grid.options.data.length - 1; i >= 0; i--) {
            if ($scope.gridApi.grid.options.data[i].isInsert) {
                $scope.gridApi.grid.options.data.splice(i, 1);
            } else {
                $scope.gridApi.grid.options.data[i].code = $scope.gridApi.grid.options.data[i].codeorg;
                $scope.gridApi.grid.options.data[i].description = $scope.gridApi.grid.options.data[i].descriptionorg;
                $scope.gridApi.grid.options.data[i].codeerr = false;
                $scope.gridApi.grid.options.data[i].descriptionerr = false;
            }
        }
        $scope.btnSave = $scope.btnCancel = $scope.isChange = false;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    }


});