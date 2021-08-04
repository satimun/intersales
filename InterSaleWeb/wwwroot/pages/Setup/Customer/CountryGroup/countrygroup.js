'use strict';
app.controller("countrygroupController", function ($rootScope, $scope, $location, $timeout, $filter, common, API) {

    $scope.IP_DB = $rootScope.IP_DB + 'sxsCountryGroup';

    // set Group Type
    $scope.groupType = {};
    $scope.groupType.list = [];
    $scope.groupType.SetID = function (id) {
        $scope.groupType.id = id;
    }

    API.Constant.CountryGroupType({
        data: {},
        callback: (res) => {
            res.data.constantCountry.forEach((d) => {
                d.view = common.GetCodeDescription(d);
            });
            $scope.groupType.list = res.data.constantCountry;
            $rootScope.CountryGroupTypes = angular.copy($scope.groupType.list);
        },
        error: (res) => { common.AlertMessage("Error", res.message); }
    });

    $scope.LoadData = () => {
        $rootScope.countrygroupGrid1Ctrl_SetData($scope.groupType.id);
    }
});


app.controller("countrygroupGrid1Ctrl", function ($rootScope, $scope, common, $timeout, uiGridConstants, API) {

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableGridEdit: true, enableInsert: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 65, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Code', edit: true, width: { default: 100 }, setclass: common.SetClassEdit, inputOpt: { placeholder: '[A-Z][0-9][0-9]', maxlength: 3, pattern: /^[A-Z][0-9]{2}$/m, uppercase: true } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description', edit: true, width: { min: 150 }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'groupType', display: 'Group Type', width: { min: 150 }, setclass: common.SetClassEdit, cellFilter: 'mapCountryGroupType' }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', display: 'Status', width: { default: 100 }, setclass: common.SetClassEdit, cellFilter: 'mapStatus' }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 150 }, setclass: common.SetClassEdit }));

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        common.ChkChange($scope);
    };

    //$rootScope.countrygroupGrid1Ctrl_SetGrid = (chk) => {
    //    $scope.gridApi.grid.options.enableInsert = chk;
    //    $scope.gridApi.grid.options.enableGridEdit = chk;
    //    $scope.gridApi.grid.refresh();
    //}

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field == "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => { if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); return; } });
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
                $rootScope.countrygroupGrid2Ctrl_SetData(newRowCol.row.entity.id, newRowCol.row.entity.status, newRowCol.row.entity.groupType);
            }
        });

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.$apply();
            rowEntity.codeerr = angular.isUndefined(rowEntity.code);
            rowEntity.descriptionerr = !rowEntity.description;
            $scope.gridApi.grid.options.data.forEach((d) => {
                if (rowEntity.code === d.code
                    && d.$$hashKey !== rowEntity.$$hashKey && d.status != 'C') {
                    common.AlertMessage('Error', 'Cannot edit duplicate code : ' + rowEntity.code);
                    common.SetObjVal('codeerr', true, rowEntity);
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

    $scope.groupTypeID = '';
    $rootScope.countrygroupGrid1Ctrl_SetData = (groupTypeID) => {
        $scope.groupTypeID = groupTypeID;
        $rootScope.countrygroupGrid2Ctrl_SetData(0);
        API.CountryGroup.Search({
            data: { groupTypes: groupTypeID },
            callback: (res) => {
                res.data.countryGroups.forEach((d) => {
                    d.codeorg = d.code;
                    d.descriptionorg = d.description;
                    d.lastUpdate_view = common.GetDateTimeView(common.CreateDateTime(d.lastUpdate.datetime)) + ' ' + d.lastUpdate.by;
                    d.enableEdit = d.status !== 'C';
                });
                $scope.gridOpt.data = res.data.countryGroups;
                $scope.gridApi.grid.refresh();
                common.GridClearAll($scope);
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });

    }

    $scope.AddRow = function () {
        if (!$scope.groupTypeID) { common.AlertMessage('Warning', 'Please Select Country Group Type.'); return; }
        var obj = {};
        common.SetObjVal('id', 0, obj);
        common.SetObjVal('groupType', $scope.groupTypeID, obj);
        common.SetObjVal('code', '', obj);
        common.SetObjVal('codeerr', true, obj);
        common.SetObjVal('description', '', obj);
        common.SetObjVal('descriptionerr', true, obj);
        
        common.SetObjVal('status', 'A', obj);
        common.SetObjVal('isInsert', true, obj);
        common.SetObjVal('enableEdit', true, obj);

        $scope.gridOpt.data.push(obj);
        $timeout(() => {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 1]
                , $scope.gridApi.grid.options.columnDefs[2]);
            $scope.gridApi.core.scrollTo(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 2]
                , $scope.gridApi.grid.options.columnDefs[2]);
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
            if (d.isInsert || d.code !== d.codeorg || d.description !== d.descriptionorg) { chk = true; }
            if (d.codeerr || d.descriptionerr) { chk2 = false; }
        });
        $scope.btnSave = chk && chk2;
        $scope.btnCancel = chk;
    }

    $scope.UpdateStatus = (status) => {
        KSSClient.API.PriceStd.UpdateStatusMain({
            data: { ids: $scope.gridApi.selection.getSelectedRows().map(x => x.id), status: status },
            callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $rootScope.GetPriceStdMain($scope.countryGroupID); }); },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    var Save = (data) => {
        API.CountryGroup.Save({
            data: { countryGroups: data },
            callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $rootScope.countrygroupGrid1Ctrl_SetData($scope.groupTypeID); }); },
            error: (res) => {
                var msg = '';
                res.data.countryGroups.forEach((v) => {
                    if (v._result._status === 'F') { msg += 'Code : ' + v.code + ' : ' + v._result._message + '\n'; }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    }

    $scope.UpdateStatusAction = (status) => {
        var data = [];
        $scope.gridApi.selection.getSelectedRows().forEach(function (d) {
            if (!d.totalRow) {
                msg += d.view + '\n';
                var tmp = angular.copy(d);
                tmp.status = status;
                data.push(tmp);
            }
        });
        if (status === 'C') {
            var msg = "";
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) { if (!row.totalRow) msg += row.code + '\n'; });
            common.ConfirmDialog('Are you sure?', 'Remove Country Group Code : \n' + msg).then((ok) => { if (ok) Save(data); });
        } else { Save(data); }
    }

    $scope.SaveClick = () => {
        var data = [];
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.isInsert || d.code !== d.codeorg || d.description !== d.descriptionorg) { data.push(d); }
        });
        Save(data);
    }

    $scope.CancelClick = function () {
        $rootScope.countrygroupGrid1Ctrl_SetData($scope.groupTypeID);
    }

});

app.controller("countrygroupGrid2Ctrl", function ($rootScope, $scope, common, $timeout, uiGridConstants, $q, $uibModal, API) {

    $scope.IP_DB = $rootScope.IP_DB + 'sxsCountry, sxsCountryGroupMapping';

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableGridEdit: true, enableInsert: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 65, max: 65 }, format: { type: 'numRow' } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'view', display: 'Country', width: { default: 300 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'zone.view', display: 'Zone', width: { default: 300 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 300 } }));

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        common.ChkChange($scope);
    };

    //$rootScope.countrygroupGrid2Ctrl_SetGrid = (chk) => {
    //    $scope.gridApi.grid.options.enableInsert = chk;
    //    $scope.gridApi.grid.refresh();
    //}

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
            else if (myCol.field == "numRow") {
                var numRow = 0;
                grid.renderContainers.body.visibleRowCache.forEach((row, index) => { if (myRow.uid === row.uid) { numRow = (index + 1); row.entity.no = (index + 1); return; } });
                return numRow;
            }
        }
        return false
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) { common.ChkChange($scope); });
    };

    $scope.countryGroupID = undefined;
    $scope.groupTypeID = undefined;

    $rootScope.countrygroupGrid2Ctrl_SetData = (countryGroupID, status, groupTypeID) => {
        $scope.gridApi.grid.options.enableInsert = status !== 'C';
        $scope.countryGroupID = countryGroupID;
        $scope.groupTypeID = groupTypeID;
        $scope.status = status;
        $scope.countryGroup = '';
        API.CountryGroup.SearchCountry({
            data: { ids: countryGroupID.toString() },
            callback: (res) => {
                $scope.gridOpt.data = [];
                var tmp = res.data.countryGroups[0];
                if (!angular.isUndefined(tmp)) {
                    $scope.countryGroup = tmp.code + ' : ' + tmp.description;
                    tmp.countrys.forEach((d) => {
                        d.countryGroup = { id: tmp.id, code: tmp.code, description: tmp.description };
                        d.view = common.GetCodeDescription(d);
                        d.zone.view = common.GetCodeDescription(d.zone);
                        d.lastUpdate_view = common.GetDateTimeView(common.CreateDateTime(d.lastUpdate.datetime)) + ' ' + d.lastUpdate.by;
                    });
                    $scope.gridOpt.data = tmp.countrys;
                }
                $scope.gridApi.grid.refresh();
                common.GridClearAll($scope);
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    $scope.CountryGroupAddModal = function () {
        var deferred = $q.defer();
        var modalInstance = $uibModal.open({
            animation: true,
            controller: 'countrygroupAddModalCtrl',
            size: 'mdc',
            resolve: {
                data: function () {
                    return {
                        countryGroupID: $scope.countryGroupID
                        , countryGroup: $scope.countryGroup
                        , groupType: $scope.groupTypeID
                    };
                }
            },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'countrygroupModalContent.html'
        });
        modalInstance.result.then((data) => { deferred.resolve(data); }, () => { });
        return deferred.promise;
    };
    
    $scope.AddRow = () => {
        if (!$scope.countryGroupID) { common.AlertMessage('Warning', 'Please Select Country Group.'); return; }
        $scope.CountryGroupAddModal().then((data) => {
            Save(data);
        });
    };

    $scope.CountryGroupMoveModal = function () {
        var deferred = $q.defer();
        var modalInstance = $uibModal.open({
            animation: true,
            controller: 'countrygroupMoveModalCtrl',
            size: 'md',
            resolve: {
                data: function () {
                    return {
                        countryGroupID: $scope.countryGroupID
                        , countrys: $scope.gridApi.selection.getSelectedRows()
                        , groupType: $scope.groupTypeID
                    };
                }
            },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'countrygroupMoveModalContent.html'
        });
        modalInstance.result.then((data) => { deferred.resolve(data); }, () => { });
        return deferred.promise;
    };

    var Save = (data) => {
        API.CountryGroup.MoveCountry({
            data: { countryGroupID: data.countryGroupID, countryIDs: data.countryIDs, groupType: $scope.groupTypeID },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $rootScope.countrygroupGrid2Ctrl_SetData($scope.countryGroupID, $scope.status, $scope.groupTypeID); });
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }
      
    
    $scope.RemoveAction = (status) => {
        var msg = '';
        $scope.gridApi.selection.getSelectedRows().forEach(function (row) { if (!row.totalRow) {  msg += row.view + '\n'; } });
        common.ConfirmDialog('Are you sure?', 'Remove Country : \n' + msg).then((ok) => {
            if (ok) { Save({ countryGroupID: null, countryIDs: $scope.gridApi.selection.getSelectedRows().map(x => x.id) }); }
        });
    }

    $scope.MoveAction = () => {
        $scope.CountryGroupMoveModal().then((data) => { Save(data); });
    }

});

app.controller("countrygroupAddModalCtrl", function ($scope, common, data, $rootScope, $uibModalInstance, $filter, API) {

    $scope.countryGroup = data.countryGroup;

    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'view', display: 'Country', width: { min: 300 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'countryGroup.view', display: 'Country Group', width: { min: 300 } }));

    $scope.SelectAll = function () {
        if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
        else { $scope.gridApi.selection.clearSelectedRows(); }
        common.ChkChange($scope);
    };

    $scope.cumulative = function (grid, myRow, myCol) { if (grid.id == $scope.gridApi.grid.id) { if (myCol.field == "headRow") { return true; } } return false };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, (row) => { common.ChkChange($scope); /*$scope.btnOk = row.isSelected;*/ });
        $scope.LoadData();
    };

    $scope.txtFind = '';

    $scope.LoadData = function () {
        API.Country.SearchCountryGroup({
            data: { status: 'A', groupTypes: data.groupType , search: $scope.txtFind },
            callback: (res) => {
                var tmp = [];
                res.data.countrys.forEach((d) => {
                    if (d.countryGroup.id !== data.countryGroupID) {
                        d.view = common.GetCodeDescription(d);
                        if (!d.countryGroup.id) d.countryGroup.view = 'Ungrouped'
                        else d.countryGroup.view = common.GetCodeDescription(d.countryGroup);
                        tmp.push(d);
                    }
                });                
                $scope.gridOpt.data = $filter('orderBy')(tmp, 'code');
                $scope.gridApi.grid.refresh();
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    }

    $scope.ok = () => { $uibModalInstance.close({ countryGroupID: data.countryGroupID, countryIDs: $scope.gridApi.selection.getSelectedRows().map(x => x.id) }); };
    $scope.cancel = () => { $uibModalInstance.dismiss('cancel'); };
});

app.controller("countrygroupMoveModalCtrl", function ($scope, common, data, $rootScope, $uibModalInstance, $filter, API) {
    
    $scope.countrys = data.countrys;

    $scope.btnOk = false;

    // set Country Group
    $scope.countryGroup = {};
    $scope.countryGroup.list = [];
    $scope.countryGroup.SetID = function (id) {
        $scope.countryGroup.id = id;
        $scope.btnOk = !!id;
    }

    API.CountryGroup.Search({
        data: { status: 'A', groupTypes: data.groupType },
        callback: (res) => {
            res.data.countryGroups.forEach((d) => {
                if (d.id !== data.countryGroupID) {
                    d.view = common.GetCodeDescription(d);
                    $scope.countryGroup.list.push(d);
                }
            });
        },
        error: (res) => { common.AlertMessage("Error", res.message); }
    });
    
    $scope.ok = () => { $uibModalInstance.close({ countryGroupID: $scope.countryGroup.id, countryIDs: $scope.countrys.map(x => x.id) }); }
    $scope.cancel = () => { $uibModalInstance.dismiss('cancel'); };

});


