'use strict';
app.controller("SetupDefaultKpiAvgPeriodDayController", function ($rootScope, $scope, $filter, $timeout, $uibModal, uiGridConstants, common, API) {

    $scope.IP_DB = $rootScope.IP_DB + 'sxsAvgDayAmtKPI';

    // set datePlan
    var d = new Date();
    $scope.year = d.getFullYear();

    $scope.GenMonth = (year) => { };

    $scope.Zone = {
        value: ''
        , list: []
        , func: (key) => {
            $scope.Zone.value = key;
        }
    };

    // load LoadZones
    $rootScope.zoneList = [];
    $scope.zones = [];
    KSSClient.API.ZoneAccount.Search({
        data: { search: '', status: 'A' },
        callback: function (res) {
            res.data.zoneAccounts.forEach(function (v) {
                v.view = common.GetCodeDescription(v);
                $rootScope.zoneList.push(v);
            });
            $scope.Zone.list = $rootScope.zoneList;
            $scope.LoadData();
        },
        error: function (res) { common.AlertMessage("Error", res.message); }
    });
    // set LoadZones
    $scope.LoadZones = function (query) { return $filter('filter')($rootScope.zoneList, { 'view': query }); };
    
    $scope.gridOpt = common.CreateGrid2({ mSelect: true, footer: true, enableGridEdit: true, enableInsert: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'numRow', display: 'No.', width: { min: 65, max: 65 }, format: { type: 'numRow' }, setclass: common.SetClassEdit, sort: false, filter: false }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'year', display: 'Year', width: { default: 100 }, setclass: common.SetClassEdit, inputOpt: { placeholder: '[0-9][0-9][0-9][0-9]', maxlength: 4, pattern: /^[0-9]{4}$/m } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'zone.code', display: 'Zone', edit: true, width: { min: 150 }, format: { type: 'autocomplete', obj: 'Zone' }, cellFilter: 'mapZone', inputOpt: { uppercase: true }, setclass: common.SetClassEdit }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'avgPeriodDay', display: 'Avg Period Days', edit: true, width: { min: 100 }, setclass: common.SetClassEdit, inputOpt: { pattern: /^[0-9]+$/m } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'status', display: 'Status', width: { default: 100 }, setclass: common.SetClassEdit, cellFilter: 'mapStatus' }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'lastUpdate_view', display: 'Last Update', width: { min: 150 }, setclass: common.SetClassEdit }));

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
        return false;
    };    
    
    //$scope.GridFilter = function (renderableRows) {
    //    renderableRows.forEach(function (row) {
    //        if ($scope.status.id && !row.entity.isInsert) if (row.entity.status != $scope.status.id) { row.visible = false; }
    //        //if (!row.grid.options.showAllStatus && !row.entity.isInsert) if (row.entity.status === 'C') { row.isSelected = false;  row.visible = false; }
    //    });
    //    return renderableRows;
    //};

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        common.GridRegisterOption(gridApi, $scope, 'grid_setupAvgPeriodDay');

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            //if (row.isSelected) { $rootScope.setRemarkTextCtrl_SetData(row.entity.remarks, row.entity.id, row.entity.status, row.entity.code); }
            //else { $rootScope.setRemarkTextCtrl_SetData(); }
            common.ChkChange($scope);
        });

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.$apply();

            if (colDef.name === 'zone.code') {
                if (!rowEntity.isInsert) {
                    common.AlertMessage('Error', 'Cannot edit Zone : ' + rowEntity.zone.code).then((val) => {
                        rowEntity.zone.code = rowEntity.zone.codeorg;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                    });
                    return;
                }
                for (var i = $scope.gridApi.grid.options.data.length - 1; i >= 0; i--) {
                    if ($scope.gridApi.grid.options.data[i].year === rowEntity.year && $scope.gridApi.grid.options.data[i].zone.code === rowEntity.zone.code
                        && ($scope.gridApi.grid.options.data[i].$$hashKey !== rowEntity.$$hashKey) && $scope.gridApi.grid.options.data[i].status !== 'C') {
                        rowEntity.zone.code = rowEntity.zone.codeorg;
                        common.AlertMessage('Error', 'Cannot edit duplicate : ' + rowEntity.year + ' , ' + $scope.gridApi.grid.options.data[i].zone.code).then((val) => {                            
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                        });
                        //newValue = rowEntity.zone.codeorg;
                        break;
                    }
                }

                var zone = $filter('filter')($scope.Zone.list, { code: rowEntity.zone.code }, true);
                rowEntity.zone.codeerr = zone.length === 0;
                if (zone.length) rowEntity.zone.id = zone[0].id; else rowEntity.zone.id = '';
            }  
            
            if (!newValue) { common.AlertMessage('Error', 'Invalid data format.'); rowEntity[colDef.name + 'err'] = true; }
            else rowEntity[colDef.name + 'err'] = false;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $scope.ChkDataChange();
        });

        //$scope.gridApi.grid.registerRowsProcessor($scope.GridFilter, 200);
    };

    //$scope.PreLoadData = () => {
    //    if ($scope.isChange) {
    //        common.ConfirmDialog('Data Change', 'Do you want to cancel data ?', false).then((chk) => {
    //            $scope.LoadData();
    //        });
    //    } else {
    //        $scope.LoadData();
    //    }
    //};

    $scope.LoadData = function () {

        var zoneAccountIDs = [];
        $scope.zones.forEach(function (v) { zoneAccountIDs.push(v.id); });

        common.GridClearAll($scope);

        API.AvgDayAmtKPI.Search({
            data: { year: $scope.year, zoneAccountIDs: zoneAccountIDs, status: ['A','I'] },
            callback: (res) => {
                res.data.avgDays.forEach((row) => {
                    row.enableEdit = row.status !== 'C';
                    row.zone.codeorg = row.zone.code;
                    row.zone.view = common.GetCodeDescription(row.zone);
                    row.avgPeriodDayorg = row.avgPeriodDay;
                    row.lastUpdate_view = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.lastUpdate.datetime)) + ' ' + row.lastUpdate.by;
                });
                $scope.gridOpt.data = res.data.avgDays;
                $scope.gridApi.grid.refresh();
                $scope.ChkDataChange();
                $scope.btnSave = $scope.btnCancel = false;
                
            },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.AddRow = function () {
        if (!$scope.year) { common.AlertMessage('Warning', 'Please set year.'); return; }
        var obj = {};
        common.SetObjVal('year', $scope.year, obj);
        common.SetObjVal('zone.code', '', obj);
        common.SetObjVal('zone.codeorg', '', obj);
        common.SetObjVal('zone.codeerr', true, obj);
        common.SetObjVal('avgPeriodDay', '', obj);
        common.SetObjVal('avgPeriodDayerr', true, obj);
        
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
            if (d.isInsert || d.zone.id !== d.zone.idorg || d.avgPeriodDay !== d.avgPeriodDayorg) { chk = true; }
            if (d.zone.iderr || d.avgPeriodDayerr) { chk2 = false; }
        });
        $scope.btnSave = chk && chk2;
        $scope.btnCancel = chk;
    };

    $scope.UpdateStatus = (status) => {
        var data = [];
        $scope.gridApi.selection.getSelectedRows().forEach((x) => {
            data.push({ year: x.year, zone: { id: x.zone.id }, status: status });
        });
        API.AvgDayAmtKPI.UpdateStatus({
            data: { avgDays: data },
            callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $scope.LoadData(); }); },
            error: (res) => { common.AlertMessage("Error", res.message); }
        });
    };

    $scope.UpdateStatusAction = (status) => {
        if (status === 'C') {
            var msg = "";
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) { if (!row.totalRow) msg += row.year + ' ' + row.zone.code + '\n'; });
            common.ConfirmDialog('Are you sure?', 'Remove Data : \n' + msg).then((ok) => { if (ok) $scope.UpdateStatus(status); });
        } else { $scope.UpdateStatus(status); }
    };

    $scope.SaveAction = () => {
        var data = [];
        $scope.gridApi.grid.options.data.forEach((d) => {
            if (d.isInsert || d.zone.code !== d.zone.codeorg || d.avgPeriodDay !== d.avgPeriodDayorg) {
                data.push(d);
            }
        });

        API.AvgDayAmtKPI.Save ({
            data: { avgDays: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $scope.LoadData(); });
            },
            error: (res) => {
                var msg = '';
                res.data.avgDays.forEach((v) => {
                    if (v._result._status === 'F') {
                        msg += 'Data : ' + res.year + ' ' + common.GetCodeDescription(res.zone) + ' : ' + v._result._message + '\n';
                    }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    };

    $scope.CancelAction = function () { $scope.LoadData(); };

    $scope.CloneAction = function () {
        var data = [];
        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            if (!row.totalRow) {
                data.push(row);
            }
        });
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'SetupDefaultKpiAvgPeriodDayModalCtrl',
            size: 'sm',
            appendTo: undefined,
            resolve: { dataModal: function () { return data; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'SetupDefaultKpiAvgPeriodDayModal.html'
        });
        modalInstance.result.then(() => { }, () => { });
    };
});


app.controller('SetupDefaultKpiAvgPeriodDayModalCtrl', function ($scope, dataModal, common, $uibModalInstance, API) {

    $scope.year = dataModal[dataModal.length - 1].year + 1;
    $scope.data = angular.copy(dataModal);

    $scope.yearChk = function () {};

    $scope.ok = function () {
        var data = [];
        $scope.data.forEach((x) => {
            x.year = $scope.year;
            data.push(x);
        });

        API.AvgDayAmtKPI.Save({
            data: { avgDays: data },
            callback: (res) => {
                common.AlertMessage('Success', '').then((ok) => { $uibModalInstance.close(); });
            },
            error: (res) => {
                var msg = '';
                res.data.avgDays.forEach((v) => {
                    if (v._result._status === 'F') {
                        msg += 'Data : ' + res.year + ' ' + common.GetCodeDescription(res.zone) + ' : ' + v._result._message + '\n';
                    }
                });
                common.AlertMessage("Error", res.message + '\n' + msg);
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});
