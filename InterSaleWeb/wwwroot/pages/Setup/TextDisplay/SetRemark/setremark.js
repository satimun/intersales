'use strict';
app.controller("setremarkController", function ($rootScope, $scope, $timeout, common) {

    $scope.IP_DB = $rootScope.IP_DB + 'sxsRemarkGroup, sxsRemark';
    // set Group Type
    $scope.groupType = {};
    $scope.groupType.list = [];
    $scope.groupType.SetID = function (id) {
        $scope.groupType.id = id;
    }

    $rootScope.remarkGroupTypeID = '';
    $scope.setRemarkIsEdit = false;
    $rootScope.setRemark_tabIndex = false;

    KSSClient.API.Constant.RemarkGrouptype({
        data: {},
        callback: function (res) {
            res.data.remarkGroupTypes.forEach(function (v) {
                $scope.groupType.list.push({ id: v.id, view: common.GetCodeDescription(v) });
            });
            $rootScope.RemarkGroupType = angular.copy($scope.groupType.list);
        },
        error: function (res) { common.AlertMessage("Error", res.message); }
    });
    
    // set status
    $scope.status = {};
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
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });

    $scope.status.SetID = function (id) {
        $scope.status.id = id;
    }
    
    $scope.ChkAction = function (callBack, data) {
        if ($scope.setRemarkIsEdit) {
            common.ConfirmDialog('Data Change', 'Do you want to cancel data ?', false).then((chk) => {
                if (chk) $rootScope.LoadDataAction(chk); 
                callBack(chk, data);
            });
        } else {
            callBack(true, data);
        }
    }

    $scope.LoadData = function () {
        $scope.ChkAction($rootScope.LoadDataAction);
    }

    $rootScope.LoadDataAction = function (chk) {
        if (!chk) return;
        $rootScope.setRemark_status = $scope.status.id;
        KSSClient.API.Remark.GetData({
            data: { groupTypes: $scope.groupType.id, status: $scope.status.id },
            callback: function (res) {
                $rootScope.remarkGroupTypeID = $scope.groupType.id;
                res.data.remarkGroups.forEach(function (row) {
                    row.enableEdit = row.status != 'C';
                    row.codeorg = row.code;
                    row.descriptionorg = row.description;
                    row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;
                    row.remarks.forEach(function (v) {
                        v.enableEdit = v.status != 'C';
                        v.codeorg = v.code;
                        v.descriptionorg = v.description;
                        v.colorCodeorg = v.colorCode;
                        v.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(v.lastUpdate.datetime)) + ' ' + v.lastUpdate.by;
                    });
                });

                $scope.SetView(true, $rootScope.setRemark_tabIndex);
                $rootScope.setRemarkGroupTypeCtrl_SetData(res.data.remarkGroups);
                $rootScope.setRemarkTextCtrl_SetData();
                $rootScope.setRemark_ChangeEdit(false);
            },
            error: function (res) { common.AlertMessage("Error", res.message); }
        });
    }

    $scope.tabs = [{ id: 0, description: 'Remark Group', active: true }, { id: 1, description: 'Remark Text', active: false }];
    $scope.TabChange = function (id) {
        if ($rootScope.setRemark_tabIndex != id) $scope.ChkAction($scope.SetView, id);
    }

    $scope.SetView = function (chk, id) {
        if (chk) {
            $rootScope.setRemark_tabIndex = id;
            if ($rootScope.remarkGroupTypeID) {
                $rootScope.setRemarkGroupTypeCtrl_SetGrid(!id);
            } else { if (id) $rootScope.setRemarkGroupTypeCtrl_SetGrid(false); else $rootScope.setRemarkGroupTypeCtrl_SetGrid(false, true); }
            $rootScope.setRemarkTextCtrl_SetData();
            $scope.tabs.forEach(function (v) {
                if (v.id == id) {
                    v.active = true;
                } else {
                    v.active = false;
                }
            });
            $rootScope.setRemark_SelectChange(false);
            $rootScope.setRemarkGroupTypeCtrl_Cancel();
            $rootScope.setRemarkTextCtrl_Cancel();
        }
    }

    $rootScope.setRemark_SelectChange = function (chk, opt) {
        if (opt === 'btnActive' || angular.isUndefined(opt)) $scope.btnActive = chk;
        if (opt === 'btnInactive' || angular.isUndefined(opt)) $scope.btnInactive = chk;
        if (opt === 'btnRemove' || angular.isUndefined(opt)) $scope.btnRemove = chk;
    }

    $rootScope.setRemark_ChangeEdit = function (chk, opt) {
        if (opt === 'btnSave' || angular.isUndefined(opt)) $scope.btnSave = chk;
        if (opt === 'btnCancel' || angular.isUndefined(opt)) $scope.btnCancel = chk;
        $scope.setRemarkIsEdit = chk;
    }
    
    $scope.ClickAction = function (action) {
        switch (action) {
            case 1:
                if (!$rootScope.setRemark_tabIndex) $rootScope.setRemarkGroupTypeCtrl_UpdateStatus('A');
                else $rootScope.setRemarkTextCtrl_UpdateStatus('A');
                break;
            case 2:
                if (!$rootScope.setRemark_tabIndex) $rootScope.setRemarkGroupTypeCtrl_UpdateStatus('I');
                else $rootScope.setRemarkTextCtrl_UpdateStatus('I');
                break;
            case 3:
                if (!$rootScope.setRemark_tabIndex) $rootScope.setRemarkGroupTypeCtrl_UpdateStatus('C');
                else $rootScope.setRemarkTextCtrl_UpdateStatus('C');
                break;
            case 4:
                if (!$rootScope.setRemark_tabIndex) $rootScope.setRemarkGroupTypeCtrl_Save();
                else $rootScope.setRemarkTextCtrl_Save();
                break;
            case 5:
                if (!$rootScope.setRemark_tabIndex) $rootScope.setRemarkGroupTypeCtrl_Cancel();
                else $rootScope.setRemarkTextCtrl_Cancel();
                break;
        }
    }

});

app.controller("setRemarkGroupTypeCtrl", function ($rootScope, $scope, $timeout, common, uiGridConstants) {

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 65, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Code', edit: true, width: { default: 100 }, setclass: common.SetClassEdit, inputOpt: { placeholder: '[A-Z]', maxlength: 1, pattern: /^[A-Z]$/m, uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description', edit: true, width: { min: 150 }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'groupType', display: 'Group Type', width: { min: 150 }, setclass: common.SetClassEdit, cellFilter: 'mapRemarkGroupType' }));
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
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid == row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            } 
        }
        return false;
    };

    $rootScope.setRemarkGroupTypeCtrl_SetGrid = function (status, optInsertEdit) {
        if (optInsertEdit) {
            $scope.gridOpt.enableInsert = status;
            $scope.gridOpt.enableGridEdit = status;
            $scope.gridOpt.multiSelect = true;
            return;
        }
        $scope.gridOpt.enableGridEdit = status;
        $scope.gridOpt.enableInsert = status;
        $scope.gridOpt.multiSelect = status;
        if (!status) $scope.gridApi.selection.clearSelectedRows();
        $scope.gridApi.selection.clearSelectedRows();
        console.log($scope.gridApi.grid);
    }

    $scope.AddRow = function () {
        var obj = {};
        obj['id'] = 0;
        obj['code'] = "";
        obj['codeerr'] = true;
        obj['description'] = "";
        obj['descriptionerr'] = true;
        obj['groupType'] = $rootScope.remarkGroupTypeID;
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
        $scope.gridApi.grid.refresh();
    };

    $scope.RemoveRow = function (grid, row) {
        $scope.gridApi.grid.options.data.splice($scope.gridApi.grid.options.data.indexOf(row.entity), 1);
        $scope.dataEdit.splice($scope.dataEdit.indexOf(row.entity), 1);
        $scope.ChkDataChange();
        $scope.gridApi.grid.refresh();
    };

    $scope.dataEdit = [];

    $scope.GridFilter = function (renderableRows) {
        renderableRows.forEach(function (row) {
            if ($rootScope.setRemark_status && !row.entity.isInsert) if (row.entity.status != $rootScope.setRemark_status) { row.visible = false; }
            //if (!row.grid.options.showAllStatus) 
        });
        return renderableRows;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_setremark01');

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) { $rootScope.setRemarkTextCtrl_SetData(row.entity.remarks, row.entity.id, row.entity.status, row.entity.code); }
            else { $rootScope.setRemarkTextCtrl_SetData(); }
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

            if (rowEntity.enableEdit) {
                var index = -1;
                for (var i = $scope.dataEdit.length - 1; i >= 0; i--) {
                    if ($scope.dataEdit[i].$$hashKey === rowEntity.$$hashKey) { index = i; break; }
                }
                if (index !== -1) {
                    var chk = true;
                    for (var i = 0; i < $scope.gridApi.grid.options.columnDefs.length; i++) {
                        if ($scope.gridApi.grid.options.columnDefs[i].enableCellEdit) {
                            if ($scope.dataEdit[index][$scope.gridApi.grid.options.columnDefs[i].name + 'org'] !== $scope.dataEdit[index][$scope.gridApi.grid.options.columnDefs[i].name]) {
                                chk = false; break;
                            }
                        }
                    }
                    if (chk) $scope.dataEdit.splice(index, 1);
                } else {
                    if (newValue != oldValue && rowEntity[colDef.name + 'org'] != rowEntity[colDef.name]) {
                        $scope.dataEdit.push(rowEntity);
                    }
                }
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                $scope.ChkDataChange();
            }
        });
        
        $scope.gridApi.grid.registerRowsProcessor($scope.GridFilter, 200);

    };

    $scope.ChkDataChange = function () {
        var chk = false;
        if ($scope.dataEdit.length) { chk = true; }
        $rootScope.setRemark_ChangeEdit(chk);
        if (chk) {
            $scope.dataEdit.forEach((v) => {
                if (v.codeerr || v.descriptionerr) {
                    $rootScope.setRemark_ChangeEdit(false, 'btnSave');
                    return false;
                }
            });
        }
    }

    $rootScope.setRemarkGroupTypeCtrl_SetData = function (data) {
        $scope.gridOpt.data = [];
        if (data) $scope.gridOpt.data = data;
        $scope.gridApi.grid.refresh();
    }

    $scope.ChkChange = function () {
        if ($rootScope.setRemark_tabIndex) return;
        $rootScope.setRemark_SelectChange(true);
        $scope.selx = [];
        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            if (!row.totalRow) {
                if (row.status == 'A') { $rootScope.setRemark_SelectChange(false, 'btnActive'); }
                else if (row.status == 'I') { $rootScope.setRemark_SelectChange(false, 'btnInactive'); }
                else if (row.status == 'C') { $rootScope.setRemark_SelectChange(false); }
                $scope.selx.push(row.id);
            }
        });
        if (!$scope.selx.length) $rootScope.setRemark_SelectChange(false);
    }

    $scope.UpdateStatus = (status) => {
        KSSClient.API.Remark.UpdateGroupStatus({
            data: { ids: $scope.selx, status: status },
            callback: function (res) {
                res.data.remarkGroups.forEach(function (row) {
                    for (var i = 0; i < $scope.gridApi.grid.options.data.length; i++) {
                        if ($scope.gridApi.grid.options.data[i].id === row.id) {
                            $scope.gridApi.grid.options.data[i].status = row.status;
                            if (row.status == 'C') $scope.gridApi.grid.options.data[i].enableEdit = false;
                            break;
                        }
                    }
                });
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                common.AlertMessage('Success', '').then((ok) => { $scope.gridApi.selection.clearSelectedRows(); });
                $rootScope.setRemark_SelectChange(false);
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    $rootScope.setRemarkGroupTypeCtrl_UpdateStatus = function (status) {
        if (status == 'C') {
            var msg = "";
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) { if (!row.totalRow) msg += row.code + " : " + row.description + '\n'; });
            common.ConfirmDialog('Are you sure?', 'Remove Remark Group : \n' + msg).then((ok) => { if (ok) $scope.UpdateStatus(status); });
        } else { $scope.UpdateStatus(status); }
    }

    $rootScope.setRemarkGroupTypeCtrl_Save = function () {
        KSSClient.API.Remark.SaveGroup({
            data: { remarkGroups: $scope.dataEdit },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $rootScope.LoadDataAction(true); });
                $scope.dataEdit = [];
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    $rootScope.setRemarkGroupTypeCtrl_Cancel = function () {
        for (var i = $scope.gridApi.grid.options.data.length - 1; i >= 0; i--) {
            if ($scope.gridApi.grid.options.data[i].isInsert) {
                $scope.gridApi.grid.options.data.splice(i, 1);
            } else {
                $scope.gridApi.grid.options.data[i].code = $scope.gridApi.grid.options.data[i].codeorg;
                $scope.gridApi.grid.options.data[i].description = $scope.gridApi.grid.options.data[i].descriptionorg;
            }
        }
        $scope.dataEdit = [];
        $rootScope.setRemark_ChangeEdit(false);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    }
    
});

app.controller("setRemarkTextCtrl", function ($rootScope, $scope, $timeout, common, uiGridConstants) {

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableGridEdit: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 65, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Code', edit: true, width: { default: 100 }, setclass: common.SetClassEdit, inputOpt: { placeholder: '[A-Z][0-9][0-9]', maxlength: 3, pattern: /^[A-Z][0-9]{2}$/m, uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description', edit: true, width: { min: 150 }, setclass: common.SetClassEdit }));
    //$scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'colorCode', display: 'Color Code', edit: true, format: { type: 'color' }, width: { default: 150 }, setclass: common.SetClassEdit }));
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
                grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
                    if (myRow.uid == row.uid) { numRow = (index + 1); row.entity.no = (index + 1); }
                });
                return numRow;
            } 
        }
        return false;
    };

    $scope.AddRow = function () {
        if (!$scope.remarkGroupID) return;
        var obj = {};
        obj['id'] = 0;
        obj['code'] = '';
        obj['codeerr'] = true;
        obj['description'] = '';
        obj['descriptionerr'] = true;
        obj['remarkGroupID'] = $scope.remarkGroupID;
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
        $scope.gridApi.grid.refresh();
    };

    $scope.RemoveRow = function (grid, row) {
        $scope.gridApi.grid.options.data.splice($scope.gridApi.grid.options.data.indexOf(row.entity), 1);
        $scope.dataEdit.splice($scope.dataEdit.indexOf(row.entity), 1);
        $scope.ChkDataChange();
        $scope.gridApi.grid.refresh();
    };

    $scope.dataEdit = [];

    $scope.GridFilter = function (renderableRows) {
        renderableRows.forEach(function (row) {
            if ($rootScope.setRemark_status && !row.entity.isInsert) if (row.entity.status != $rootScope.setRemark_status) { row.visible = false; }
            //if (!row.grid.options.showAllStatus) if (row.entity.status == 'C') { row.visible = false; }
        });
        return renderableRows;
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_setremark02');

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
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

            if (rowEntity.enableEdit) {
                var index = -1;
                for (var i = $scope.dataEdit.length - 1; i >= 0; i--) {
                    if ($scope.dataEdit[i].$$hashKey === rowEntity.$$hashKey) { index = i; break; }
                }
                if (index !== -1) {
                    var chk = true;
                    for (var i = 0; i < $scope.gridApi.grid.options.columnDefs.length; i++) {
                        if ($scope.gridApi.grid.options.columnDefs[i].enableCellEdit) {
                            if ($scope.dataEdit[index][$scope.gridApi.grid.options.columnDefs[i].name + 'org'] !== $scope.dataEdit[index][$scope.gridApi.grid.options.columnDefs[i].name]) {
                                chk = false; break;
                            }
                        }
                    }
                    if (chk) $scope.dataEdit.splice(index, 1);
                } else {
                    if (newValue != oldValue && rowEntity[colDef.name + 'org'] != rowEntity[colDef.name]) {
                        $scope.dataEdit.push(rowEntity);
                    }
                }
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                $scope.ChkDataChange();
            }
        });
        $scope.gridApi.grid.registerRowsProcessor($scope.GridFilter, 200);
    };

    $scope.ChkDataChange = function () {
        var chk = false;
        if ($scope.dataEdit.length) { chk = true; }
        $rootScope.setRemark_ChangeEdit(chk);
        if (chk) {
            $scope.dataEdit.forEach((v) => {
                if (v.codeerr || v.descriptionerr) {
                    $rootScope.setRemark_ChangeEdit(false, 'btnSave');
                    return false;
                }
            });
        }
    }
    
    $rootScope.setRemarkTextCtrl_SetData = function (data, remarkGroupID, remarkGroupStatus, remarkGroupCode) {
        $scope.gridOpt.data = [];
        $scope.remarkGroupID = remarkGroupID;
        $scope.gridOpt.enableGridEdit = remarkGroupStatus != 'C';
        $scope.gridOpt.enableInsert = false;
        if (data) {
            $scope.gridOpt.columnDefs.forEach((v) => {
                if (v.field === 'code') {
                    v.inputOpt.placeholder = '[' + remarkGroupCode + '][0-9][0-9]';
                    v.inputOpt.pattern = new RegExp('^[' + remarkGroupCode + '][0-9]{2}$', 'm');
                    return false;
                }
            });
            //for (var i = 0; i < .length; i++) { if()}
            //$scope.gridOpt.options.columnDefs['']
            $scope.gridOpt.data = data;
            $scope.gridOpt.enableInsert = remarkGroupStatus != 'C';
        }
        
        $scope.gridApi.grid.refresh();
    }

    $scope.ChkChange = function () {
        if ($rootScope.setRemark_tabIndex != 1) return;
        $rootScope.setRemark_SelectChange(true);
        $scope.selx = [];
        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            if (!row.totalRow) {
                if (row.status == 'A') { $rootScope.setRemark_SelectChange(false, 'btnActive'); }
                else if (row.status == 'I') { $rootScope.setRemark_SelectChange(false, 'btnInactive'); }
                else if (row.status == 'C') { $rootScope.setRemark_SelectChange(false); }
                $scope.selx.push(row.id);
            }
        });
        if (!$scope.selx.length) $rootScope.setRemark_SelectChange(false);
    }

    $scope.UpdateStatus = (status) => {
        KSSClient.API.Remark.UpdateTextStatus({
            data: { ids: $scope.selx, status: status },
            callback: function (res) {
                res.data.remarks.forEach(function (row) {
                    for (var i = 0; i < $scope.gridApi.grid.options.data.length; i++) {
                        if ($scope.gridApi.grid.options.data[i].id === row.id) {
                            $scope.gridApi.grid.options.data[i].status = row.status;
                            if (row.status == 'C') $scope.gridApi.grid.options.data[i].enableEdit = false;
                            break;
                        }
                    }
                });
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                common.AlertMessage('Success', '').then((ok) => { $scope.gridApi.selection.clearSelectedRows(); });
                $rootScope.setRemark_SelectChange(false);
            },
            error: function (res) { common.AlertMessage("Error", res.message); }
        });
    }

    $rootScope.setRemarkTextCtrl_UpdateStatus = function (status) {
        if (status == 'C') {
            var msg = "";
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) { if (!row.totalRow) msg += row.code + " : " + row.description + '\n'; });
            common.ConfirmDialog('Are you sure?', 'Remove Remark : \n' + msg).then((ok) => { if (ok) $scope.UpdateStatus(status); });
        } else { $scope.UpdateStatus(status); }
    }

    $rootScope.setRemarkTextCtrl_Save = function () {
        KSSClient.API.Remark.SaveText({
            data: { remarks: $scope.dataEdit },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $rootScope.LoadDataAction(true); });
                $scope.dataEdit = [];
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    $rootScope.setRemarkTextCtrl_Cancel = function () {
        for (var i = $scope.gridApi.grid.options.data.length - 1; i >= 0; i--) {
            if ($scope.gridApi.grid.options.data[i].isInsert) {
                $scope.gridApi.grid.options.data.splice(i, 1);
            } else {
                $scope.gridApi.grid.options.data[i].code = $scope.gridApi.grid.options.data[i].codeorg;
                $scope.gridApi.grid.options.data[i].description = $scope.gridApi.grid.options.data[i].descriptionorg;
            }
        }
        $scope.dataEdit = [];
        $rootScope.setRemark_ChangeEdit(false);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    }

});