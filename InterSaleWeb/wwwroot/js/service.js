
//------------------------------------common ------------------------------//

app.service('common', function ($rootScope, $window, $http, $timeout, $localStorage, $filter, $q) {
    var $this = this;

    //------- Call API --------//
    this.callCount = 0;
    this.Call = (option) => {
        var loadding = document.getElementById('loadding');
        var url = !option.url ? (path + option.api.controller + "/" + option.api.module) : option.url;
        if (option.api.method.toUpperCase() === 'GET' && option.data) {
            var key = Object.keys(option.data);
            url += "?";
            for (i = 0; i < key.length; i++) {
                var tmp = option.data[key[i]];
                if (angular.isArray(tmp)) {
                    if (tmp.length > 0) {
                        for (var j = 0; j < tmp.length; j++) {
                            url += key[i] + "=" + (!tmp[j] ? '' : tmp[j]);
                            if (tmp.length > j + 1) url += "&";
                        }
                    } else { url += key[i] + "=" + (!option.data[key[i]] ? '' : option.data[key[i]]); }
                } else { url += key[i] + "=" + (!option.data[key[i]] ? '' : option.data[key[i]]); }
                if (key.length > i + 1) url += "&";
            }
        }
        if (!option.noloadding) { $this.callCount++; }
        $http({
            url: url,
            method: option.api.method.toUpperCase(),
            data: angular.toJson(option.data),
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
                , 'Token': $this.getCookie('Token')
                , 'AccessToken': $this.getCookie('AccessToken')
            }
        }).then((res) => {
            if (!option.noloadding) { $this.callCount--; }
            if ($this.callCount <= 0) { loadding.style.display = 'none'; }
            if (res.data.status === 'S') option.callback(res.data);
            else option.error(res.data);
        }, (error) => {
            if (!option.noloadding) { $this.callCount--; }
            if ($this.callCount <= 0) { loadding.style.display = 'none'; }
            var res = {};
            res.status = "F";
            res.message = error.statusText;
            option.error(res);
        });

        $timeout(() => { if ($this.callCount > 0) { loadding.style.display = 'flex'; } else { loadding.style.display = 'none'; } }, 500);
    };

    //------- dialog -------//
    this.AlertMessage = function (type, msg, option, callBack) {
        var deferred = $q.defer();
        msg = msg.replace(/(#.*)$/g, '\n\n$1');

        if (msg.substring(0, 2) === 'O1' && msg.substring(0, 5) !== 'O1001') {
            $window.location.href = "/singlesignon?BackUrl=" + $rootScope.backUrl;
        } else if (msg.substring(0, 2) === 'O9') {
            $window.location.href = "/singlesignon?BackUrl=" + $rootScope.backUrl;
        }

        swal(type, msg, type.toLowerCase()).then((value) => {
            if (option) {
                if (option === 'close') {
                    $window.close();
                } else if (option === 'reload') {
                    $window.location.reload();
                } else {
                    $window.location.href = option;
                }
            } else if (angular.isFunction(callBack)) {
                callBack();
            } else {
                // if (msg.substring(0, 2) === 'O1') {
                //     $window.location.href = "/singlesignon?BackUrl=" + $rootScope.backUrl;                
                // } else if (msg.substring(0, 2) === 'O9') {
                //     $window.location.href = "/singlesignon?BackUrl=" + $rootScope.backUrl;
                // }
            }
            deferred.resolve(value);
        });
        return deferred.promise;
    };
    this.ConfirmDialog = function (title, msg, dangerMode) {
        var deferred = $q.defer();
        swal({
            title: title,
            text: msg,
            icon: "warning",
            buttons: true,
            dangerMode: dangerMode,
            closeOnClickOutside: false
        })
            .then((ok) => {
                deferred.resolve(ok);
            });

        return deferred.promise;
    };

    //----------- convert -----------//
    this.GetCodeDescription = function (value) {
        if (value) {
            if (value.code !== null && value.description !== null) {
                return value.code.trim() + " : " + value.description.trim();
            }
            else if (value.code !== null) {
                return value.code.trim();
            }
            else if (value.description !== null) {
                return value.description.trim();
            }
        }
        return "";
    };
    this.GetNumber = function (value) {
        if (value !== undefined) {
            value = (value + '').trim();
            if (value === '') { return 0; }

            if (isFinite(value)) { return parseFloat(value); }
            else { return -1; }
        }
        return 0;
    };
    this.GetNumberNull = function (value) {
        if (value !== undefined) {
            value = (value + '').trim();
            if (value === '') { return null; }

            if (isFinite(value)) { return parseFloat(value); }
            else { return -1; }
        }
        return null;
    };
    this.GetStringCode = function (value) {
        if (value !== undefined) {
            value = (value + '').trim();
            if (value === '') { return null; }
            else { return value.toUpperCase(); }
        }
        return null;
    };

    //------------ ui-grid ------------//
    this.CreateGrid = function (mSelect = undefined, expandable = false, header = null, menuCol = true, menuMain = true, footer = false, checkAll = true, enableInsert = false, enableFilterMenu = true) {
        var gridOpt = {
            //enableCellEditOnFocus: true
            enableRowSelection: true
            , enableRowHeaderSelection: false
            , showColumnFooter: footer
            //, showGridFooter: true
            , multiSelect: mSelect
            , enableColumnMenus: menuCol
            , enableGridMenu: menuMain
            , enableFiltering: false
            , enableFilterMenu: enableFilterMenu /*by SoMRuk*/
            , exporterMenuCsv: false
            , exporterMenuPdf: false
            , exporterExcelFilename: 'download.xlsx'
            , exporterExcelSheetName: 'Sheet1'
            //, gridMenuTitleFilter: function (title) {
            //    return 'col: ' + title;
            //}

        };

        if (expandable) {
            if (expandable === true) {
                gridOpt['expandableRowTemplate'] = '<div class="sub-grid" ui-grid="row.entity.subGridOpt" ui-grid-cellNav ui-grid-cell-selection ui-grid-exporter ui-grid-resize-columns ui-grid-auto-resize style="height:150px;"' +
                    'ng-hide="row.entity.subGridOpt.data.length === 0" ng-style="{ height: row.entity.subGridOpt.height + \'px\', width: row.entity.subGridOpt.width + \'px\', \'margin-left\': row.entity.subGridOpt.margin + \'px\'}"></div>';
            } else {
                gridOpt['expandableRowTemplate'] = expandable;
            }

            gridOpt['expandableRowHeight'] = '';
            gridOpt['expandableRowScope'] = {
                subGridVariable: 'subGridScopeVariable'
            };
        }

        //gridOpt['headerTemplate'] =
        //    '<div role="rowgroup" class="ui-grid-header">' +
        //    '<div class="ui-grid-top-panel">' +
        //    '<div class="ui-grid-header-viewport">' +
        //    '<div class="ui-grid-header-canvas">' +
        //    '<div class="ui-grid-header-cell-wrapper" ng-style="colContainer.headerCellWrapperStyle()">' +
        //    '<div role="row" class="ui-grid-header-cell-row">' +
        //    '<div class="ui-grid-header-cell ui-grid-clearfix ui-grid-category" ng-repeat="group in grid.options.group" ng-if="(colContainer.renderedColumns | filter:{ group: group.name}:true).length > 0">' +
        //    '<div class="ui-grid-header-category" ng-if="group.display != \'\'">{{ group.display }}</div>' +
        //    '<div class="ui-grid-header-cell ui-grid-clearfix grid-header" ng-repeat="col in colContainer.renderedColumns | filter:{ group: group.name}:true " ui-grid-header-cell col="col" render-index="$index"> </div>' +
        //    '</div>' +
        //    '</div>' +
        //    '</div>' +
        //    '</div>' +
        //    '</div>' +
        //    '</div>' +
        //    '</div>';

        gridOpt['headerTemplate'] =
            '<div role="rowgroup" class="ui-grid-header">' +
            '<div class="ui-grid-top-panel">' +
            '<div class="ui-grid-header-viewport">' +
            '<div class="ui-grid-header-canvas" ng-class="{ \'grid-maxg\': grid.options.chkColGroup && !grid.options.enableFiltering, \'grid-maxs\': !grid.options.chkColGroup && !grid.options.enableFiltering}">' +
            '<div class="ui-grid-header-cell-wrapper" ng-style="colContainer.headerCellWrapperStyle()">' +
            '<div role="row" class="ui-grid-header-cell-row">' +
            '<div class="ui-grid-header-cell ui-grid-clearfix ui-grid-category" ng-class="{\'grid-head-min\': grid.options.chkColGroup}" ng-repeat="group in grid.options.group" ng-if="(colContainer.renderedColumns | filter:{ group: group.name}:true).length > 0" ng-style="{width: group.width + \'px\'}">' + // category
            '<div class="ui-grid-header-category" ng-if="group.display != \'\'">{{ group.display }}</div>' +
            '<div class="ui-grid-header-cell grid-header" style="float: left;display: block;" ng-class="{ \'bg-success\': grid.options.enableGridEdit && col.colDef.enableCellEdit }" ng-repeat="col in colContainer.renderedColumns | filter:{ group: group.name}:true " ui-grid-header-cell col="col" render-index="$index"></div>' +
            '</div>' + // category
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        gridOpt.columnDefs = [];
        if (mSelect !== undefined) {
            var headRow = {
                field: 'headRow'
                , displayName: ''
                , enableCellEdit: false
                , width: '30'
                , pinnedLeft: true
                , allowCellFocus: false
                , enableSorting: false
                , enableColumnMenu: false
                , enableFiltering: false
                , enableHiding: false
                , category: 'headRow'
                , mutliLine: false
            };

            if (enableInsert) {
                headRow['footerCellTemplate'] = '<div class="ui-grid-cell-foot"><button class="btn btn-success btn-xs" ng-click="grid.appScope.AddRow(grid)"><i class="glyphicon glyphicon-plus"></i></button></div>';
            }

            var tmp = 'radio';
            if (mSelect) {
                tmp = 'checkbox';
                if (checkAll) {
                    headRow['headerCellTemplate'] = '<div class="ui-grid-cell-head"><input type="checkbox" ng-model="grid.appScope.chkAll" ng-click="grid.appScope.SelectAll()"></div>';
                }
            }
            headRow['cellTemplate'] = '<div class="ui-grid-cell-head">' +
                '<div ng-if="grid.appScope.cumulative(grid, row, col)"><div class="overlay"></div><input type="' + tmp + '" ng-checked="row.isSelected"/></div>' +
                '<button class="btn btn-danger btn-xs" ng-if="!grid.appScope.cumulative(grid, row, col)" ng-click="grid.appScope.RemoveRow(grid, row)"><i class="glyphicon glyphicon-remove"></i></button></div>';
            gridOpt.columnDefs.push(headRow);
        }
        return gridOpt;
    };
    this.AddColumn = function (name, title, langCode = '', focus = false, edit = false, width = '', cellFilter = '', format = [], setclass = '', category = '', sort = true, filter = true, colMenu = true, hiding = true, visible = true, multiLine = false, txtGuide = '') {
        var col = {
            field: name
            , displayName: title
            , headerTooltip: title
            , allowCellFocus: focus
            , enableCellEdit: edit
            , enableSorting: sort
            , enableFiltering: filter
            , enableColumnMenu: colMenu
            , enableHiding: hiding
            , visible: visible
            , multiLine: multiLine
            , group: category
            , hidePinRight: true
            , inputOpt: { placeholder: txtGuide }
        };

        if (langCode !== '') {
            col['lang_code'] = langCode;
        }
        if (width !== '') {
            if (width.min !== undefined) {
                col['minWidth'] = width.min;
            }
            if (width.max !== undefined) {
                col['maxWidth'] = width.max;
            }
            if (width.default !== undefined) {
                col['width'] = width.default;
            }
        } else {
            //col['width'] = '*';
        }
        if (edit) {
            col['cellEditableCondition'] = function ($scope) {
                return $scope.row.entity.enableEdit === undefined ? false : $scope.row.entity.enableEdit;
            };
            col['headerCellClass'] = function (grid, row, col, rowRenderIndex, colRenderIndex) {
                return 'bg-success';
            };
        } else { col['enableCellEdit'] = false }

        if (cellFilter !== '') { col['cellFilter'] = cellFilter; }
        //if (category != '') { /*col['category'] = category;*/ col['group'] = { name: }

        if (setclass !== '') {
            col['cellClass'] = setclass;
        }

        if (format) {
            switch (format.type) {
                case 'numRow':
                    col['pinnedLeft'] = true;
                    //col['pinnedRight'] = true;
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents"><center>{{grid.appScope.cumulative(grid, row, col)}}</center></div>';
                    col['aggregationType'] = 4;
                    col['aggregationHideLabel'] = true;
                    col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:center;" col-index="renderIndex">{{ col.getAggregationValue()|number }}</div>';
                    break;
                case 'text':
                    col['aggregationType'] = 4;
                    col['aggregationHideLabel'] = true;
                    col['cellTemplate'] = '<div class="' + format.class + ' ui-grid-cell-contents" style="text-align: ' + format.align + ';">{{ COL_FIELD }}</div>';
                    if (format.showTotal) {
                        col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align: ' + format.align + ';" col-index="renderIndex">Total : {{ col.getAggregationValue()|number }} items</div>';
                    }
                    break;
                case 'dropdown':
                    col['editDropdownOptionsArray'] = format.items;
                    col['editableCellTemplate'] = 'ui-grid/dropdownEditor';
                    col['editDropdownValueLabel'] = 'view';
                    col['editDropdownIdLabel'] = 'id';
                    break;
                case 'date':
                    col['type'] = format.type;
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents">' +
                        '<div class="cellDate">{{grid.appScope.cumulative(grid, row, col)}}</div>' +
                        '<div class="cellWarning" ng-if="grid.appScope.cumulative(grid, row, col, 1)" tooltip-placement="bottom-left" ' +
                        'uib-tooltip="{{grid.appScope.cumulative(grid, row, col, 2)}}" ' +
                        'tooltip-class="">!</div></div>';
                    break;
                case 'datetime':
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents">{{grid.appScope.cumulative(grid, row, col)}}</div>';
                    break;
                case 'autocomplete':
                    col['editableCellTemplate'] = '<div><form name="inputForm">' +
                        '<input type="INPUT_TYPE" ng-keyup="grid.appScope.' + format.obj + '.func(MODEL_COL_FIELD)" ng-class="\'colt\' + col.uid" ui-grid-editor list="' + format.obj + '" ng-model="MODEL_COL_FIELD">' +
                        '</form></div>';
                    col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" col-index="renderIndex">{{ col.getAggregationValue()}}</div>' +
                        '<datalist id="' + format.obj + '"><option ng-repeat="opt in grid.appScope.' + format.obj + '.list" value="{{opt.code}}">{{opt.description}}</option></datalist>';
                    break;
                case 'truefalse':
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents">' +
                        '<center><span class="glyphicon glyphicon-ok" ng-if="grid.appScope.cumulative(grid, row, col) === 1"></span>' +
                        '<span class="glyphicon glyphicon-remove" ng-if="grid.appScope.cumulative(grid, row, col) === 2"></span></center></div>';
                    break;
                case 'decimal':
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:right;">{{ COL_FIELD | decimalFormat: ' + format.scale + ' }}</div>';
                    col['type'] = 'number';
                    //col['aggregationType'] = 2;
                    if (format.summary === 'avg') {
                        col['aggregationType'] = 8;
                    } else if (format.summary === 'percent') {
                        col['percentMulti'] = format.multi;
                        col['percentDivi'] = format.divi;
                        col['aggregationType'] = 112;
                    } else if (angular.isFunction(format.summary)) {
                        console.log(format.sumary);
                        col['aggregationType'] = format.summary;
                    } else {
                        col['aggregationType'] = 2;
                    }
                    col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:right;" col-index="renderIndex">{{ col.getAggregationValue() | decimalFormat: ' + format.scale + ' }}</div>';
                    break;
                case 'currency':
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:right;"><span ng-repeat="v in COL_FIELD"><span ng-if="$index > 0"> , </span>{{ v.code }} {{ v.num | decimalFormat: ' + format.scale + ' }}</span></div>';
                    col['type'] = 'number';
                    col['aggregationType'] = 111;
                    col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:right;" col-index="renderIndex"><span ng-repeat="v in col.getAggregationValue()"><span ng-if="$index > 0"> , </span>{{ v.code }} {{ v.sum | decimalFormat: ' + format.scale + ' }}</span></div>';
                    break;
                case 'actionRow':
                    col['pinnedLeft'] = true;
                    col['cellTemplate'] = '<div style="padding:3px">' +
                        '<span ng-click="grid.appScope.' + format.func + '(row, 0)" ng-if="grid.appScope.cumulative(grid, row, col) === 0" class="glyphicon glyphicon-asterisk btn btn-default btn-xs grid-btn" title="New Plan"></span>' +
                        '<span ng-click="grid.appScope.' + format.func + '(row, 1)" ng-class="{\'grid-red\': grid.appScope.cumulative(grid, row, col) === 2}" ng-if="grid.appScope.cumulative(grid, row, col) > 0" class="glyphicon glyphicon-edit btn btn-default btn-xs grid-btn" title="Edit plan"></span>' +
                        '<span ng-click="grid.appScope.' + format.func + '(row, 2)" ng-class="{\'grid-red\': grid.appScope.cumulative(grid, row, col) === 2}" ng-if="grid.appScope.cumulative(grid, row, col) > 0" class="glyphicon glyphicon-file btn btn-default btn-xs grid-btn" title="Report plan"></span>' +
                        '</div>';
                    break;
                case 'customText':
                    col['cellTemplate'] = '<div class="' + format.class + ' ui-grid-cell-contents">' +
                        '{{ grid.appScope.cumulative(grid, row, col) }}' +
                        '</div>';
                    break;
                case 'customStyle':
                    col['cellTemplate'] = '<div ng-class="row.entity.class" class="ui-grid-cell-contents">' +
                        '{{ grid.appScope.cumulative(grid, row, col) }}' +
                        '</div>';
                    break;
                case 'arrMutiline':
                    col['cellTemplate'] = '<div class="multi-line ui-grid-cell-contents">' +
                        '<div ng-repeat="v in COL_FIELD" title="{{v}}">{{v}}</div>' +
                        '</div>';
                    break;
                case 'alertMessage':
                    col['cellTemplate'] = '<div class="multi-line ui-grid-cell-contents">' +
                        '<div ng-repeat="v in COL_FIELD" class="ui-grid-cell-custom" title="{{v}}">{{v}}</div>' +
                        '</div>';
                    break;
                case 'priority':
                    col['pinnedLeft'] = true;
                    col['cellTemplate'] = '<div style="padding:3px">' +
                        '<center><span ng-click="grid.appScope.' + format.func + '(row)" ng-class="{\'priority-remove\': grid.appScope.cumulative(grid, row, col), \'priority-add\': !grid.appScope.cumulative(grid, row, col)}" class="glyphicon glyphicon-star btn btn-info btn-xs grid-btn"></span></center>' +
                        '</div>';
                    break;
                case 'end':
                    col['pinnedRight'] = true;
                    break;
                default:
                    col['type'] = format.type;
            }
        }
        return col;
    };
    this.CreateGrid2 = function (opt) {
        //mSelect = undefined, expandable = false, header = null, menuCol = true, menuMain = true, footer = false, checkAll = true, enableInsert = false, enableFilterMenu = true
        var mSelect = opt.mSelect;
        var expandable = angular.isUndefined(opt.expandable) ? false : opt.expandable;
        var footer = angular.isUndefined(opt.footer) ? false : opt.footer;
        var checkAll = angular.isUndefined(opt.checkAll) ? true : opt.checkAll;
        var enableInsert = angular.isUndefined(opt.enableInsert) ? false : opt.enableInsert;
        var enableGridEdit = angular.isUndefined(opt.enableGridEdit) ? false : opt.enableGridEdit;
        var enableTotalCurrency = angular.isUndefined(opt.enableTotalCurrency) ? true : opt.enableTotalCurrency;

        var gridOpt = {
            //enableCellEditOnFocus: true, // cellnav click edit
            enableRowSelection: true
            , enableRowHeaderSelection: false
            , showColumnFooter: footer
            //, showGridFooter: true
            , multiSelect: mSelect
            , enableColumnMenus: angular.isUndefined(opt.menuCol) ? true : opt.menuCol              //menuCol
            , enableGridMenu: angular.isUndefined(opt.menuMain) ? true : opt.menuMain               //menuMain
            , enableFiltering: false
            , enableFilterMenu: angular.isUndefined(opt.enableFilterMenu) ? true : opt.enableFilterMenu  //enableFilterMenu   /*custom by SoMRuk*/
            , exporterMenuCsv: false
            , exporterMenuPdf: false
            , exporterExcelFilename: 'download.xlsx'
            , exporterExcelSheetName: 'Sheet1'
            , enableInsert: enableInsert
            , enableSelectAll: checkAll
            , enableGridEdit: enableGridEdit || enableInsert
            , showAllStatus: false
            , group: []
            //, gridMenuTitleFilter: function (title) {
            //    return 'col: ' + title;ui-grid-filter
            //}
            //, enableGroupHeaderSelection: true
            //, treeRowHeaderAlwaysVisible: false
            , showTotalGrouping2: angular.isUndefined(opt.showTotalGrouping2) ? false : opt.showTotalGrouping2
            , enableTotalCurrency: enableTotalCurrency
            , showTotalCurrency: angular.isUndefined(opt.showTotalCurrency) ? false : opt.showTotalCurrency
        };

        gridOpt['headerTemplate'] =
            '<div role="rowgroup" class="ui-grid-header">' +
            '<div class="ui-grid-top-panel">' +
            '<div class="ui-grid-header-viewport">' + //\'grid-maxg\': grid.options.chkColGroup && !grid.options.enableFiltering, \'grid-maxs\': !grid.options.chkColGroup && !grid.options.enableFiltering
            '<div class="ui-grid-header-canvas" ng-class="{ \'grid-maxg\': !grid.options.enableFiltering }">' + //\'grid-maxg\': !grid.options.enableFiltering
            '<div class="ui-grid-header-cell-wrapper" ng-style="colContainer.headerCellWrapperStyle()">' +
            '<div role="row" class="ui-grid-header-cell-row">' + // ng-class="{\'grid-head-min\': grid.options.chkColGroup}"
            '<div class="ui-grid-header-cell ui-grid-clearfix ui-grid-category" ng-class="{ \'grid-ming\': grid.options.chkColGroup && !grid.options.enableFiltering, \'grid-mins\': !grid.options.chkColGroup && !grid.options.enableFiltering }" ng-repeat="group in grid.options.group" ng-if="(colContainer.renderedColumns | filter:{ group: group.name }:true).length > 0" ng-style="{width: group.width + \'px\'}">' + // category
            '<div class="ui-grid-header-category" ng-if="group.display != \'\'">{{ group.display }}</div>' +
            '<div class="ui-grid-header-cell grid-header" style="float: left;display: block;" ng-class="{ \'bg-success\': grid.options.enableGridEdit && col.colDef.enableCellEdit }" ng-repeat="col in colContainer.renderedColumns | filter:{ group: group.name}:true " ui-grid-header-cell col="col" render-index="$index"></div>' +
            '</div>' + // category
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        if (expandable) {
            if (expandable === true) {
                gridOpt['expandableRowTemplate'] = '<div class="sub-grid" ui-grid="row.entity.subGridOpt" ui-grid-cellNav ui-grid-cell-selection ui-grid-exporter ui-grid-resize-columns ui-grid-auto-resize style="max-height:200px; width: auto;"' +
                    'ng-hide="row.entity.subGridOpt.data.length === 0" ng-style="{ height: row.entity.subGridOpt.height + \'px\', width: row.entity.subGridOpt.width + \'px\', \'margin-left\': row.entity.subGridOpt.margin + \'px\'}"></div>';
            } else {
                gridOpt['expandableRowTemplate'] = expandable;
            }
            gridOpt['expandableRowHeight'] = '';
            gridOpt['expandableRowScope'] = {
                subGridVariable: 'subGridScopeVariable'
            };
        }

        gridOpt.columnDefs = [];
        if (!angular.isUndefined(mSelect)) {
            var headRow = {
                field: 'headRow'
                , displayName: ''
                , enableCellEdit: false
                , maxWidth: '30'
                , pinnedLeft: true
                , allowCellFocus: false
                , enableSorting: false
                , enableColumnMenu: false
                , enableFiltering: false
                , enableHiding: false
                //, category: 'headRow'
                , mutliLine: false
            };
            //if (enableInsert) {

            //}
            headRow['footerCellTemplate'] = '<div class="ui-grid-cell-foot" ng-show="grid.options.enableInsert"><button class="btn btn-success btn-xs" ng-click="grid.appScope.AddRow(grid)" title="Add Row."><i class="glyphicon glyphicon-plus"></i></button></div>';
            headRow['headerCellTemplate'] = '<div class="ui-grid-cell-head" ng-show="grid.options.multiSelect && grid.options.enableSelectAll"><input type="checkbox" ng-model="grid.appScope.chkAll" ng-click="grid.appScope.SelectAll()"></div>';
            var tmp = 'radio';
            if (mSelect) { tmp = 'checkbox'; }

            headRow['cellTemplate'] = '<div class="ui-grid-cell-head" ng-class="{\'nav-select\': row.isNav && !row.entity.isInsert}">' +
                '<div ng-if="grid.appScope.cumulative(grid, row, col)"><div class="overlay"></div><input ng-show="!grid.options.multiSelect" type="radio" ng-checked="row.isSelected"/><input ng-show="grid.options.multiSelect" type="checkbox" ng-checked="row.isSelected"/></div>' +
                '<button class="btn btn-danger btn-xs" ng-if="grid.appScope.cumulative(grid, row, col) === false" ng-click="grid.appScope.RemoveRow(grid, row)" title="Remove Row."><i class="glyphicon glyphicon-remove"></i></button></div>';
            gridOpt.columnDefs.push(headRow);
        }
        return gridOpt;
    };
    this.AddColumn2 = function (opt) {
        //name, title, langCode = '', focus = false, edit = false, width = '', cellFilter = '', format = {}, setclass = '', category = '', sort = true, filter = true, colMenu = true, hiding = true, visible = true, multiLine = false
        var width = opt.width;
        var edit = angular.isUndefined(opt.edit) ? false : opt.edit                         // edit
        var cellFilter = opt.cellFilter;                                                    // cellFilter
        var format = angular.isUndefined(opt.format) ? {} : opt.format;                     // format { 'type': '' }
        var setclass = opt.setclass;                                                        // setclass

        var col = {
            field: opt.name                                                                 // name
            , displayName: angular.isUndefined(opt.display) ? '' : opt.display              // display
            , headerTooltip: angular.isUndefined(opt.display) ? '' : opt.display            // display
            , lang_code: angular.isUndefined(opt.langCode) ? '' : opt.langCode              // langCode
            , allowCellFocus: angular.isUndefined(opt.focus) ? true : opt.focus             // focus
            , enableCellEdit: edit
            , enableSorting: angular.isUndefined(opt.sort) ? true : opt.sort                // sort
            , enableFiltering: angular.isUndefined(opt.filter) ? true : opt.filter          // filter
            , enableColumnMenu: angular.isUndefined(opt.colMenu) ? true : opt.colMenu       // colMenu
            , enableHiding: angular.isUndefined(opt.hiding) ? true : opt.hiding             // hiding
            , visible: angular.isUndefined(opt.visible) ? true : opt.visible                // visible
            , multiLine: angular.isUndefined(opt.multiLine) ? false : opt.multiLine         // multiLine
            , group: opt.group                                                              // group { name: '', display: '' , langCode: ''}
            , hidePinRight: true
            , inputOpt: opt.inputOpt
            , pinnedLeft: opt.pinnedLeft
            , grouping2: angular.isUndefined(opt.grouping2) ? false : opt.grouping2
            , grouping2Active: angular.isUndefined(opt.grouping2Active) ? false : opt.grouping2Active
        };

        if (width) {
            if (width.min !== undefined) {
                col['minWidth'] = width.min;
            }
            if (width.max !== undefined) {
                col['maxWidth'] = width.max;
            }
            if (width.default !== undefined) {
                col['width'] = width.default;
            }
        }
        if (edit) {
            col['cellEditableCondition'] = function ($scope) {
                return !$scope.row.entity.enableEdit || !$scope.grid.options.enableGridEdit || $scope.col.colDef.format === 'modal' || $scope.col.colDef.format === 'btnPopup' ? false : $scope.row.entity.enableEdit;
            };
        } else { col['enableCellEdit'] = false; }
        if (cellFilter) { col['cellFilter'] = cellFilter; }
        if (setclass) { col['cellClass'] = setclass; }

        if (format) {
            switch (format.type) {
                case 'numRow':
                    //if (angular.isUndefined(opt.pinnedLeft)) col['pinnedLeft'] = true;
                    if (angular.isUndefined(opt.sort)) col['enableSorting'] = false;
                    if (angular.isUndefined(opt.filter)) col['enableFiltering'] = false;
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents"><center>{{grid.appScope.cumulative(grid, row, col)}}</center></div>';
                    col['aggregationType'] = 4;
                    col['aggregationHideLabel'] = true;
                    col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:center;" col-index="renderIndex">{{ col.getAggregationValue()|number }}</div>';
                    break;
                case 'text':
                    col['cellTemplate'] = '<div class="' + format.class + ' ui-grid-cell-contents" style="text-align: ' + format.align + ';">{{ COL_FIELD }}</div>';
                    if (format.showTotal) {
                        col['aggregationType'] = 4;
                        col['aggregationHideLabel'] = true;
                        col['showCountItems'] = true;
                        col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align: ' + format.align + ';" col-index="renderIndex">Total : {{ col.getAggregationValue()|number }} items</div>';
                    }
                    break;
                case 'distinct':
                    col['aggregationType'] = 113;
                    col['aggregationHideLabel'] = true; //show   .count | .item
                    col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align: ' + format.align + ';" col-index="renderIndex">{{ col.getAggregationValue().' + format.show + ' }}</div>';
                    break;
                case 'dropdown':
                    col['editDropdownOptionsArray'] = format.items;
                    col['editableCellTemplate'] = 'ui-grid/dropdownEditor';
                    col['editDropdownValueLabel'] = 'view';
                    col['editDropdownIdLabel'] = 'id';
                    break;
                case 'date':
                    col['type'] = format.type;
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents">' +
                        '<div class="cellDate">{{grid.appScope.cumulative(grid, row, col)}}</div>' +
                        '<div class="cellWarning" ng-if="grid.appScope.cumulative(grid, row, col, 1)" tooltip-placement="bottom-left" ' +
                        'uib-tooltip="{{grid.appScope.cumulative(grid, row, col, 2)}}" ' +
                        'tooltip-class="">!</div></div>';
                    break;
                case 'datetime':
                    col['type'] = 'date';
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents">{{grid.appScope.cumulative(grid, row, col)}}</div>';
                    break;
                case 'autocomplete':
                    format.limit = !format.limit ? 20 : format.limit;
                    col['editableCellTemplate'] = '<div><form name="inputForm">' +
                        '<input type="INPUT_TYPE" placeholder="{{ col.colDef.inputOpt.placeholder }}" maxlength="{{ col.colDef.inputOpt.maxlength }}" uppercase="{{ col.colDef.inputOpt.uppercase }}" ng-keyup="grid.appScope.' + format.obj + '.func(MODEL_COL_FIELD)" ng-click="grid.appScope.' + format.obj + '.func(MODEL_COL_FIELD)" ng-class="\'colt\' + col.uid" ui-grid-editor list="' + format.obj + '" ng-model="MODEL_COL_FIELD">' +
                        '</form></div>';
                    col['footerCellTemplate'] = //'<div class="ui-grid-cell-contents" col-index="renderIndex">{{ col.getAggregationValue()}}</div>' +
                        '<datalist id="' + format.obj + '"><option ng-repeat="opt in grid.appScope.' + format.obj + '.list | filter: grid.appScope.' + format.obj + '.value | limitTo: ' + format.limit + '" value="{{opt.code}}">{{opt.description}}</option></datalist>';
                    break;
                case 'truefalse':
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents">' +
                        '<center><span class="glyphicon glyphicon-ok" ng-if="grid.appScope.cumulative(grid, row, col) === 1"></span>' +
                        '<span class="glyphicon glyphicon-remove" ng-if="grid.appScope.cumulative(grid, row, col) === 2"></span></center></div>';
                    break;
                case 'decimal':
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:right;">{{ COL_FIELD | decimalFormat: ' + format.scale + ' }}</div>';
                    col['type'] = 'number';
                    //col['aggregationType'] = 2;
                    if (format.summary === 'avg') {
                        col['aggregationType'] = 8;
                    } else if (format.summary === 'percent') {
                        col['percentMulti'] = format.multi;
                        col['percentDivi'] = format.divi;
                        col['aggregationType'] = 112;
                    } else if (format.summary === 'none') {
                        col['aggregationType'] = undefined;
                    } else if (angular.isFunction(format.summary)) {
                        col['aggregationType'] = format.summary;
                    } else {
                        col['aggregationType'] = 2;
                    }
                    col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:right;" col-index="renderIndex">{{ col.getAggregationValue() | decimalFormat: ' + format.scale + ' }}</div>';
                    break;
                case 'currency':
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:right;"><span ng-repeat="v in COL_FIELD"><span ng-if="$index > 0"> , </span>{{ v.code }} {{ v.num | decimalFormat: ' + format.scale + ' }}</span></div>';
                    col['type'] = 'number';
                    col['aggregationType'] = 111;
                    col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:right;" col-index="renderIndex"><span ng-repeat="v in col.getAggregationValue()"><span ng-if="$index > 0"> , </span>{{ v.code }} {{ v.sum | decimalFormat: ' + format.scale + ' }}</span></div>';
                    break;
                case 'actionRow':
                    col['pinnedLeft'] = true;
                    col['cellTemplate'] = '<div style="padding:3px">' +
                        '<span ng-click="grid.appScope.' + format.func + '(row, 0)" ng-if="grid.appScope.cumulative(grid, row, col) === 0" class="glyphicon glyphicon-asterisk btn btn-default btn-xs grid-btn" title="New Plan"></span>' +
                        '<span ng-click="grid.appScope.' + format.func + '(row, 1)" ng-if="grid.appScope.cumulative(grid, row, col) === 1 || grid.appScope.cumulative(grid, row, col) === 3" class="glyphicon glyphicon-edit btn btn-default btn-xs grid-btn grid-blue" title="Edit Monthly plan"></span>' +
                        '<span ng-click="grid.appScope.' + format.func + '(row, 2)" ng-if="grid.appScope.cumulative(grid, row, col) === 2 || grid.appScope.cumulative(grid, row, col) === 3" class="glyphicon glyphicon-edit btn btn-default btn-xs grid-btn grid-red" title="Edit Weekly plan"></span>' +
                        //'<span ng-click="grid.appScope.' + format.func + '(row, 3)" ng-if="grid.appScope.cumulative(grid, row, col) > 0" class="glyphicon glyphicon-file btn btn-default btn-xs grid-btn" title="Report plan"></span>' +
                        '</div>';
                    break;
                case 'customText':
                    col['cellTemplate'] = '<div class="' + format.class + ' ui-grid-cell-contents">' +
                        '{{ grid.appScope.cumulative(grid, row, col) }}' +
                        '</div>';
                    break;
                case 'customStyle':
                    col['cellTemplate'] = '<div ng-class="row.entity.class" class="ui-grid-cell-contents">' +
                        '{{ grid.appScope.cumulative(grid, row, col) }}' +
                        '</div>';
                    break;
                case 'arrMutiline':
                    col['cellTemplate'] = '<div class="multi-line ui-grid-cell-contents">' +
                        '<div ng-repeat="v in COL_FIELD" title="{{v}}">{{v}}</div>' +
                        '</div>';
                    break;
                case 'alertMessage':
                    col['cellTemplate'] = '<div class="multi-line ui-grid-cell-contents">' +
                        '<div ng-repeat="v in COL_FIELD" class="ui-grid-cell-custom" title="{{v}}">{{v}}</div>' +
                        '</div>';
                    break;
                case 'priority':
                    col['pinnedLeft'] = true;
                    col['cellTemplate'] = '<div style="padding:3px">' +
                        '<center><span ng-click="grid.appScope.' + format.func + '(row)" ng-class="{\'priority-remove\': grid.appScope.cumulative(grid, row, col), \'priority-add\': !grid.appScope.cumulative(grid, row, col)}" class="glyphicon glyphicon-star btn btn-info btn-xs grid-btn"></span></center>' +
                        '</div>';
                    break;
                case 'color':
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents" ng-style="{ \'background-color\': COL_FIELD }">{{ COL_FIELD }}</div>';
                    col['editableCellTemplate'] = '<div><form name="inputForm">' +
                        '<input type="color" ng-class="\'colt\' + col.uid" name="color" ui-grid-editor ng-model="MODEL_COL_FIELD">' +
                        '</form></div>';
                    break;
                case 'modal':
                    col['format'] = 'modal';
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents">' +
                        '{{ COL_FIELD }} ' +
                        '<span style="float:right;" ng-show="grid.options.enableGridEdit && col.colDef.enableCellEdit && row.entity.enableEdit" ng-click="grid.appScope.' + format.func + '(row)" class="glyphicon glyphicon-pencil btn btn-info btn-xs grid-btn2" title="Edit Cell."></span>' +
                        '</div>';
                    break;
                case 'helpInput':
                    col['format'] = 'helpInput';
                    col['cellTemplate'] = '<div class="ui-grid-cell-contents">' +
                        '{{ COL_FIELD }} ' +
                        '<span style="float:right;" ng-show="grid.options.enableGridEdit && col.colDef.enableCellEdit && row.entity.enableEdit" ng-click="grid.appScope.' + format.func + '(row)" class="glyphicon glyphicon-pencil btn btn-info btn-xs grid-btn2" title="Edit Cell."></span>' +
                        '</div>';
                    break;
                case 'btnPopup':
                    col['format'] = 'modal';
                    var conEdit = '', icon = 'glyphicon-list-alt', title = 'Show Detail.', color = 'btn-default';
                    if (edit) {
                        conEdit = 'grid.options.enableGridEdit && col.colDef.enableCellEdit && row.entity.enableEdit && ';
                        icon = 'glyphicon-pencil';
                        title = 'Edit Data.';
                        color = 'btn-info';
                    }
                    col['cellTemplate'] = '<div style="padding:3px; width: 100%; ">' +
                        '<center><span ng-click="grid.appScope.' + format.func + '(row)" ng-show="' + conEdit + 'grid.appScope.cumulative(grid, row, col)" class="glyphicon ' + icon + ' btn ' + color + ' btn-xs grid-btn" title="' + title + '"></span></center>' +
                        '</div>';
                    break;
                default:
                    col['type'] = format.type;
            }

            if (!angular.isUndefined(opt.showCountItems)) {
                col['showCountItems'] = true;
                col['aggregationType'] = 4;
                col['aggregationHideLabel'] = true;
                if (format.type === 'autocomplete') {
                    col['footerCellTemplate'] += '<div class="ui-grid-cell-contents" style="text-align: center;" col-index="renderIndex"><span ng-show="col.getAggregationValue() && col.colDef.showCountItems">Total : {{ col.getAggregationValue()|number }} items</span></div>';
                } else {
                    col['footerCellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align: center;" col-index="renderIndex"><span ng-show="col.getAggregationValue() && col.colDef.showCountItems">Total : {{ col.getAggregationValue()|number }} items</span></div>';
                }
            }

        }
        return col;
    };
    this.SetStoreGrid = function (gridOpt, gridName) {
        var tmp = {};
        tmp[gridName] = [];
        gridOpt.columns.forEach(function (row, i) {
            tmp[gridName].push({ colName: row.field, visible: false, order: undefined, orderOld: i, pin: false });
        });
        var count = 0;
        if (gridOpt.renderContainers.left) {
            gridOpt.renderContainers.left.renderedColumns.forEach(function (row, i) {
                for (var j = 0; j < tmp[gridName].length; j++) {
                    if (tmp[gridName][j].colName === row.field) {
                        tmp[gridName][j].visible = true;
                        tmp[gridName][j].order = i;
                        tmp[gridName][j].pin = true;
                        count = i + 1;
                    }
                }
            });
        }
        if (gridOpt.renderContainers.body) {
            gridOpt.renderContainers.body.renderedColumns.forEach(function (row, i) {
                for (var j = 0; j < tmp[gridName].length; j++) {
                    if (tmp[gridName][j].colName === row.field) {
                        tmp[gridName][j].visible = true;
                        tmp[gridName][j].order = i + count;
                        tmp[gridName][j].pin = false;
                    }
                }
            })
        }
        tmp[gridName] = $filter('orderBy')(tmp[gridName], 'order', false);
        if (angular.isUndefined($localStorage[gridName])) {
            $localStorage.$default(tmp);
        } else {
            $localStorage[gridName] = tmp[gridName];
        }
        //console.log($localStorage);
    };
    this.GetGridOption = function (gridOpt, gridName) {
        if (angular.isUndefined($localStorage[gridName])) {
            $this.SetStoreGrid(gridOpt, gridName);
        } else if ($localStorage[gridName].length === gridOpt.options.columnDefs.length) {
            var tmp = [];
            $localStorage[gridName].forEach(function (row, i) {
                for (var j = 0; j < gridOpt.options.columnDefs.length; j++) {
                    if (row.colName === gridOpt.options.columnDefs[j].field) {
                        gridOpt.options.columnDefs[j].visible = row.visible;
                        gridOpt.options.columnDefs[j].pinnedLeft = row.pin;
                        tmp.push(gridOpt.options.columnDefs[j]);
                        break;
                    }
                }
            });
            gridOpt.options.columnDefs = tmp;
            //console.log($localStorage[gridName]);
            //console.log(gridOpt.options.columnDefs);
        } else {
            $this.SetStoreGrid(gridOpt, gridName);
        }
    };
    this.GridRegisterOption = function (gridApi, scope, gridName) {
        gridApi.core.on.renderingComplete(scope, function (x) {
            $this.GetGridOption(gridApi.grid, gridName);
        });
        if (gridApi.colMovable) {
            gridApi.colMovable.on.columnPositionChanged(scope, function (x) {
                $timeout(function () {
                    $this.SetStoreGrid(gridApi.grid, gridName);
                }, 10);
            });
        }
        if (gridApi.pinning) {
            gridApi.pinning.on.columnPinned(scope, function (x) {
                $timeout(function () {
                    $this.SetStoreGrid(gridApi.grid, gridName);
                }, 10);
            });
        }
        gridApi.core.on.columnVisibilityChanged(scope, function (x) {
            $timeout(function () {
                $this.SetStoreGrid(gridApi.grid, gridName);
            }, 10);
        });
    };
    this.GridLang = function (grid, obj) {
        $timeout(function () {
            grid.forEach(function (x) {
                if (x.colDef.lang_code) {
                    if (obj[x.colDef.lang_code]) {
                        x.displayName = obj[x.colDef.lang_code];
                        x.colDef.displayName = obj[x.colDef.lang_code];
                        x.colDef.headerTooltip = obj[x.colDef.lang_code];
                    } else {
                        x.displayName = '{' + x.colDef.lang_code + '}';
                        x.colDef.displayName = '{' + x.colDef.lang_code + '}';
                        x.colDef.headerTooltip = '{' + x.colDef.lang_code + '}';
                    }
                }
            });
        }, 10);
    };
    this.ClassGridStatus = function (grid, row) {
        if (row.entity.status === 'C') {
            return 'text-danger';
        }
        else if (row.entity.status === 'I') {
            return 'text-primary';
        }
    };
    this.SetClassEdit = (grid, row, col) => {
        var cellClass = '';
        if (col.colDef.enableCellEdit) {
            if (angular.isDate($this.GetObjVal(col.name, row.entity)) && angular.isDate($this.GetObjVal(col.name + 'org', row.entity))) {
                if ($this.GetObjVal(col.name, row.entity).getTime() !== $this.GetObjVal(col.name + 'org', row.entity).getTime()) {
                    cellClass += 'bg-warning ';
                }
            } else if ($this.GetObjVal(col.name, row.entity) !== $this.GetObjVal(col.name + 'org', row.entity) && $this.GetObjVal(col.name + 'org', row.entity)) {
                cellClass += 'bg-warning ';
            }
            if ($this.GetObjVal(col.name + 'err', row.entity)) cellClass = 'bg-danger ';
        }
        if (row.entity.status === 'I') cellClass += ' text-primary';
        else if (row.entity.status === 'C') cellClass += ' text-danger';
        return cellClass;
    };
    this.GridSelectChange = ($scope, chk, opt) => {
        if (opt === 'btnActive' || angular.isUndefined(opt)) $scope.btnActive = chk;
        if (opt === 'btnInactive' || angular.isUndefined(opt)) $scope.btnInactive = chk;
        if (opt === 'btnRemove' || angular.isUndefined(opt)) $scope.btnRemove = chk;
        if (opt === 'btnOk' || angular.isUndefined(opt)) $scope.btnOk = chk;
        return chk;
    };
    this.GridEditChange = ($scope, chk, opt) => {
        if (opt === 'btnSave' || angular.isUndefined(opt)) $scope.btnSave = chk;
        if (opt === 'btnCancel' || angular.isUndefined(opt)) $scope.btnCancel = chk;
        return chk;
    };
    this.GridClearAll = ($scope) => {
        $this.GridEditChange($scope, false);
        $this.GridSelectChange($scope, false);
    };
    this.ChkChange = ($scope) => {
        if ($scope.btnCancel) {
            $this.GridSelectChange($scope, false);
            var chk = $scope.gridApi.selection.getSelectedRows().length > 0;
            $scope.gridApi.selection.getSelectedRows().forEach((row) => {
                if (row.id) { chk = false; }
            });
            $this.GridSelectChange($scope, chk, 'btnRemove');
            $this.GridSelectChange($scope, chk, 'btnOk');
            return;
        }
        if ($scope.gridApi.selection.getSelectedRows().length) {
            $this.GridSelectChange($scope, true);
            $scope.gridApi.selection.getSelectedRows().forEach((row) => {
                if (!row.totalRow) {
                    if (row.status === 'A') { $this.GridSelectChange($scope, false, 'btnActive'); }
                    else if (row.status === 'I') { $this.GridSelectChange($scope, false, 'btnInactive'); }
                    else if (row.status === 'C') { $this.GridSelectChange($scope, false); }
                }
            });
        } else {
            $this.GridSelectChange($scope, false);
        }
    };

    //-------- lang ---------//
    this.LoadLang = function (group) {
        KSSClient.API.Language.Dictionary({
            data: { lang: $rootScope.lang, group: group },
            callback: function (obj) {
                //console.log(obj);
                $timeout(function () {
                    var lang_code = document.querySelectorAll('[lang-code]');
                    lang_code.forEach(function (value) {
                        var key = value.getAttribute('lang-code');
                        if (obj[key] !== undefined) { angular.element(value).html(obj[key]); }
                        else { angular.element(value).html('{' + key + '}'); }
                    });
                }, 50);
            },
            error: function (res) {
                //common.AlertMessage("Error", res.message);
            }
        });

    };

    //-------- export excel -------//
    this.ExportExcel = function (workbook, name) {
        ExcelBuilder.Builder.createFile(workbook, { type: "blob" }).then(function (csvContent) {
            var D = document;
            var a = D.createElement('a');
            var strMimeType = 'application/octet-stream;charset=utf-8';
            var rawFile;
            var d = new Date();
            var fileName = name + ' ' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + (d.getFullYear() + '').substring(2, 4) + '.xlsx';

            //html5 A[download]
            if ('download' in a) {
                var blob = new Blob(
                    ['', csvContent],
                    { type: strMimeType }
                );
                rawFile = URL.createObjectURL(blob);
                a.setAttribute('download', fileName);
            } else {
                rawFile = 'data:' + strMimeType + ',' + encodeURIComponent(csvContent);
                a.setAttribute('target', '_blank');
            }
            a.href = rawFile;
            a.setAttribute('style', 'display:none;');
            D.body.appendChild(a);
            setTimeout(function () {
                if (a.click) {
                    a.click();
                    // Workaround for Safari 5
                } else if (document.createEvent) {
                    var eventObj = document.createEvent('MouseEvents');
                    eventObj.initEvent('click', true, true);
                    a.dispatchEvent(eventObj);
                }
                D.body.removeChild(a);

            }, 100);

        });
    };

    //--------- Object ----------//
    this.ObjArrDel = function (obj, indexDel) {
        for (var i = indexDel.length - 1; i >= 0; i--) {
            obj.splice(indexDel[i], 1);
        }
    };
    this.GetObjVal = (keys, obj) => {
        var tmpobj = angular.copy(obj);
        keys.split('.').forEach((t) => {
            if (tmpobj) {
                tmpobj = tmpobj[t];
            } else { tmpobj = undefined; }
        });
        return tmpobj;
    };
    this.SetObjVal = (keys, value, obj) => { // set(['a', 'b', 'c'], 1)  =  { a: { b: { c: 1 } } }
        obj = obj || {};
        keys = typeof keys === 'string' ? keys.match(/\w+/g) : Array.prototype.slice.apply(keys);
        keys.reduce(function (obj, key, index) {
            obj[key] = index === keys.length - 1 ? value : typeof obj[key] === 'object' && obj !== null ? obj[key] : {};
            return obj[key];
        }, obj);
        return obj;
    };

    //------- date time -------//
    this.CreateDateTime = (str) => {
        if (!str) {
            return null;
        } else {
            // yyyy-MM-dd hh:mm:ss
            try {
                var dt = str.split(' ');
                var d = dt[0] !== undefined ? dt[0].split('-') : undefined;
                var t = dt[1] !== undefined ? dt[1].split(':') : undefined;
                if (d && t) {
                    //new Date(year, month, date, hours, minutes, seconds, ms)
                    return new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]), parseInt(t[0]), parseInt(t[1]), parseInt(t[2]), 0);
                } else if (d) {
                    //new Date(year, month, date, hours, minutes, seconds, ms)
                    return new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]), 0, 0, 0, 0);
                }
            } catch (err) {
                return null;
            }
            return null;
        }
    };
    this.GetDateString = (d) => {
        if (d) {
            var month = d.getMonth() + 1;
            var date = d.getDate();
            if (month < 10) { month = '0' + month; }
            if (date < 10) { date = '0' + date; }
            return d.getFullYear() + "-" + month + "-" + date;
        }
        return null;
    };
    this.GetDateView = (dt) => {
        if (!dt) {
            return '';
        } else {
            //1/2/2012
            var d = dt.toLocaleDateString('en-US').split('/');
            //1/2/2012
            //var tmp = dt.toLocaleDateString('en-US').split('/');
            if (d.length !== 0) {
                if (parseInt(d[0]) < 10) d[0] = '0' + d[0];
                if (parseInt(d[1]) < 10) d[1] = '0' + d[1];
                //if (d[2] != tmp[2]) d[2] = tmp[2];
            }
            //var year = d[2].toString();
            d = d[1] + '/' + d[0] + '/' + d[2].slice(2, 4);
            return d;
        }
    };
    this.GetDateView2 = (dt) => {
        if (!dt) {
            return '';
        } else {
            //1/2/2012
            var d = dt.toLocaleDateString('en-US').split('/');
            //1/2/2012
            //var tmp = dt.toLocaleDateString('en-US').split('/');
            if (d.length !== 0) {
                if (parseInt(d[0]) < 10) d[0] = '0' + d[0];
                if (parseInt(d[1]) < 10) d[1] = '0' + d[1];
                //if (d[2] != tmp[2]) d[2] = tmp[2];
            }
            //var year = d[2].toString();
            //console.log(year.slice(2, 4));
            d = d[1] + '/' + d[0] + '/' + d[2];
            return d;
        }
    };
    this.GetDateTimeView = (dt) => {
        if (!dt) {
            return '';
        } else {
            //1/2/2012
            var d = dt.toLocaleDateString('en-US').split('/');
            //1/2/2012
            //var tmp = dt.toLocaleDateString('en-US').split('/');
            if (d.length !== 0) {
                if (parseInt(d[0]) < 10) d[0] = '0' + d[0];
                if (parseInt(d[1]) < 10) d[1] = '0' + d[1];
                //if (d[2] != tmp[2]) d[2] = tmp[2];
            }
            d = d[1] + '/' + d[0] + '/' + d[2].slice(2, 4);
            //15:47:55 GMT+0700
            var t = dt.toTimeString().split(':');
            if (t.length !== 0) {
                t = t[0] + ":" + t[1] + ":" + t[2].charAt(0) + t[2].charAt(1);
            }
            return d + " " + t;
        }
    };
    this.GetFirstDayOfMonth = (dt) => {
        return new Date(dt.getFullYear(), dt.getMonth(), 1);
    };
    this.GetLastDayOfMonth = (dt) => {
        var m = dt.getMonth() + 1;
        var y = m === 12 ? dt.getFullYear() + 1 : dt.getFullYear();
        var tdt = new Date(y, m === 12 ? 0 : m, 1);
        return new Date(tdt.setDate(tdt.getDate() - 1));
    };

    //------- map data -------//
    this.MapID = (mapList, value) => {
        if (angular.isUndefined(value) || value === '' || value === null) {
            return '';
        } else {
            var index = mapList.findIndex(function (a) { return a.id === value; });
            if (!mapList[index]) return '';
            return mapList[index].view;
        }
    };
    this.MapCode = (mapList, value) => {
        if (angular.isUndefined(value) || value === '' || value === null) {
            return '';
        } else {
            var index = mapList.findIndex(function (a) { return a.code === value; });
            if (!mapList[index]) return '';
            return mapList[index].view;
        }
    };

    this.GetStringVal = (val) => {
        return (val === null || val === undefined ? '' : val + '').trim();
    };

    //Number.prototype.round
    this.Round = (num, places = 0) => {
        return +(Math.round(num + "e+" + places) + "e-" + places);
    };

    // cookie
    this.setCookie = function (cname, cvalue, exminutes) {
        const d = new Date()
        d.setTime(d.getTime() + (exminutes * 60 * 1000))
        const expires = `expires=${d.toUTCString()}`
        const isSecure = window.location.protocol == 'https:'
        const secure = isSecure ? ' samesite=none; secure;' : ''
        document.cookie = `${cname}=${cvalue}; ${expires};${secure} path=/;`
    }

    this.getCookie = function (cname, src) {
        const cookie = src || document.cookie
        const cvalue = cookie.split('; ').find(c => c.startsWith(`${cname}=`))
        if (!!cvalue) {
            return cvalue.replace(/^[^=]+./, '')
        }
        return ''
    }

}); //---- end service common


//--------------------------------- oauth --------------------------------------//

app.service('oauth', function ($rootScope, $timeout, $window, $q, common, API) {

    this.LogOut = function () {
        API.Oauth.DestroyToken({
            data: {},
            callback: function (res) {
                common.setCookie('Token', '', -1);
                window.localStorage.clear('username');
                $window.location.href = "/singlesignon";
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
                $window.location.href = "/singlesignon";
            }
        });
    };

    this.LogIn = function (userName, passWord) {
        API.Oauth.RequestToken({
            data: { username: userName, password: passWord },
            callback: function (res) {
                // expire date fix 480 minute
                common.setCookie('Token', res.data.token, 480);
                window.localStorage.setItem('username', res.data.username);

                $timeout(() => {
                    $rootScope.isCollapsed = false;
                    $rootScope.login = false;
                    if (RegExp("^/login", "i").test($rootScope.backUrl) || !$rootScope.backUrl) $rootScope.backUrl = "/";
                    $window.location.href = $rootScope.backUrl;
                }, 10);
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    };

    this.getTokenState = function () {
        API.Oauth.getTokenState({
            data: {},
            callback: function (res) {
                if (res.data.status !== 'A') {
                    //$rootScope.ReNewToken();
                    $templateCache.removeAll();
                    $window.location.href = "/singlesignon?BackUrl=" + $rootScope.backUrl;
                }
            },
            error: function (res) {
                $templateCache.removeAll();
                common.AlertMessage("Error", res.message);
            }
        });
    };

    this.GetToken = function () {
        $rootScope.username = window.localStorage.getItem('username');

        if (!common.getCookie('Token')) {
            $templateCache.removeAll();
            $window.location.href = "/singlesignon?BackUrl=" + $rootScope.backUrl;
        }
        else {
            //this.getTokenState();
            var permissionpage = [];
            var page = document.querySelectorAll('[kkf-permssion-notfound]');
            page.forEach(function (value, index) {
                permissionpage[index] = value.getAttribute('kkf-permssion-notfound');
            });

            API.Oauth.CheckPermission({
                data: { type: 'C', permissions: permissionpage },
                callback: function (res) {
                    var obj = {};
                    res.data.permissions.forEach(function (row, i) {
                        obj[row.code] = row.authorize === "Y" ? true : false;
                    });
                    page.forEach(function (value, index) {
                        var key = value.getAttribute('kkf-permssion-notfound');
                        if (obj[key] === undefined || !obj[key]) {
                            if ($rootScope.backUrl !== "/") {
                                common.AlertMessage("Warning", "You do not have permission to access Page : " + $rootScope.backUrl, "/");
                            }
                        }
                    });
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });

            var permissionview = [];
            var view = document.querySelectorAll('[kkf-permssion-view]');
            view.forEach(function (value, index) {
                permissionview[index] = value.getAttribute('kkf-permssion-view');
            });
            API.Oauth.CheckPermission({
                data: { type: 'C', permissions: permissionview },
                callback: function (res) {
                    var obj = {};
                    res.data.permissions.forEach(function (row, i) {
                        obj[row.code] = row.authorize === "Y" ? true : false;
                    });
                    view.forEach(function (value, index) {
                        var key = value.getAttribute('kkf-permssion-view');
                        //if (obj[key] === undefined || !obj[key]) angular.element(value).css("display", "none");
                        if (obj[key] === undefined || !obj[key]) angular.element(value).remove();
                    });
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        }

    };

});


//--------------------------------- API -------------------------------//
app.service('API', function (common) {
    var $this = this;
    //------------------ Oauth ----------------------//
    this.Oauth = this.Oauth || {};
    this.Oauth.RequestToken = (option) => {
        common.Call({ api: { method: 'post', controller: 'Oauth', module: 'RequestToken' }, data: option.data, callback: option.callback, error: option.error });
    };
    this.Oauth.SingleSignOn = (option) => {
        common.Call({ api: { method: 'post', controller: 'Oauth', module: 'SingleSignOn' }, data: option.data, callback: option.callback, error: option.error });
    };
    this.Oauth.DestroyToken = (option) => {
        common.Call({ api: { method: 'post', controller: 'Oauth', module: 'DestroyToken' }, data: option.data, callback: option.callback, error: option.error });
    };
    this.Oauth.RenewToken = (option) => {
        common.Call({ api: { method: 'post', controller: 'Oauth', module: 'RenewToken' }, data: option.data, callback: option.callback, error: option.error });
    };
    this.Oauth.getTokenState = (option) => {
        common.Call({ api: { method: 'get', controller: 'Oauth', module: 'getTokenState' }, data: option.data, callback: option.callback, error: option.error });
    };
    this.Oauth.CheckPermission = (option) => {
        common.Call({ api: { method: 'post', controller: 'Oauth', module: 'checkpermission' }, data: option.data, callback: option.callback, error: option.error });
    };

    this.Oauth.ChangePassword = (option) => {
        common.Call({ api: { method: 'post', controller: 'Oauth', module: 'ChangePassword' }, data: option.data, callback: option.callback, error: option.error });
    };

    //------------------ Constant ----------------------//
    this.Constant = this.Constant || {};
    this.Constant.CountryGroupType = (option) => {
        common.Call({ api: { method: 'get', controller: 'Constant', module: 'CountryGroupType' }, data: option.data, callback: option.callback, error: option.error });
    };

    //------------------ Country ----------------------//
    this.Country = this.Country || {};
    this.Country.SearchCountryGroup = (option) => {
        common.Call({ api: { method: 'get', controller: 'Country', module: 'SearchCountryGroup' }, data: option.data, callback: option.callback, error: option.error });
    };

    //------------------ Country Group ----------------------//
    this.CountryGroup = this.CountryGroup || {};
    this.CountryGroup.Search = (option) => {
        option.api = { method: 'get', controller: 'CountryGroup', module: 'Search' };
        common.Call(option);
    };
    this.CountryGroup.SearchCountry = (option) => {
        option.api = { method: 'get', controller: 'CountryGroup', module: 'SearchCountry' };
        common.Call(option);
    };
    this.CountryGroup.Save = (option) => {
        common.Call({ api: { method: 'post', controller: 'CountryGroup', module: 'Save' }, data: option.data, callback: option.callback, error: option.error });
    };
    this.CountryGroup.MoveCountry = (option) => {
        common.Call({ api: { method: 'post', controller: 'CountryGroup', module: 'MoveCountry' }, data: option.data, callback: option.callback, error: option.error });
    };

    //------------------ Currency ----------------------//
    this.Currency = this.Currency || {};
    this.Currency.Search = (option) => {
        common.Call({ api: { method: 'get', controller: 'Currency', module: 'Search' }, data: option.data, callback: option.callback, error: option.error });
    };

    //----------------------- Price Std -------------------------//
    this.PriceStd = this.PriceStd || {};
    this.PriceStd.SearchPriceForDiscount = (option) => {
        option.api = { method: 'get', controller: 'PriceStd', module: 'SearchPriceForDiscount' };
        common.Call(option);
    };
    this.PriceStd.CloneSearch = (option) => {
        option.api = { method: 'get', controller: 'PriceStd', module: 'CloneSearch' };
        common.Call(option);
    };
    this.PriceStd.CloneSave = (option) => {
        option.api = { method: 'post', controller: 'PriceStd', module: 'CloneSave' };
        common.Call(option);
    };
    this.PriceStd.SearchHeader = (option) => {
        option.api = { method: 'get', controller: 'PriceStd', module: 'SearchHeader' };
        common.Call(option);
    };
    this.PriceStd.SearchDetail = (option) => {
        option.api = { method: 'get', controller: 'PriceStd', module: 'SearchDetail' };
        common.Call(option);
    };
    this.PriceStd.Approval = (option) => {
        option.api = { method: 'post', controller: 'PriceStd', module: 'Approval' };
        common.Call(option);
    };
    this.PriceStd.ListRangeD = (option) => {
        option.api = { method: 'get', controller: 'PriceStd', module: 'ListRangeD' };
        common.Call(option);
    };
    this.PriceStd.ListProd = (option) => {
        option.api = { method: 'get', controller: 'PriceStd', module: 'ListProd' };
        common.Call(option);
    };

    //------------------ Discount ----------------------//
    this.DiscountStd = this.DiscountStd || {};
    this.DiscountStd.CloneSearch = (option) => {
        option.api = { method: 'get', controller: 'DiscountStd', module: 'CloneSearch' };
        common.Call(option);
    };
    this.DiscountStd.CloneSave = (option) => {
        option.api = { method: 'post', controller: 'DiscountStd', module: 'CloneSave' };
        common.Call(option);
    };
    this.DiscountStd.SearchHeader = (option) => {
        option.api = { method: 'get', controller: 'DiscountStd', module: 'SearchHeader' };
        common.Call(option);
    };
    this.DiscountStd.SearchDetail = (option) => {
        option.api = { method: 'get', controller: 'DiscountStd', module: 'SearchDetail' };
        common.Call(option);
    };
    this.DiscountStd.Approval = (option) => {
        option.api = { method: 'post', controller: 'DiscountStd', module: 'Approval' };
        common.Call(option);
    };
    this.DiscountStd.ListRangeD = (option) => {
        option.api = { method: 'get', controller: 'DiscountStd', module: 'ListRangeD' };
        common.Call(option);
    };
    this.DiscountStd.SearchDiscountForPrice = (option) => {
        option.api = { method: 'get', controller: 'DiscountStd', module: 'SearchDiscountForPrice' };
        common.Call(option);
    };

    //------------------ Product Color Group ----------------------//
    this.ProductColorGroup = this.ProductColorGroup || {};
    this.ProductColorGroup.UpdateStatus = (option) => {
        option.api = { method: 'post', controller: 'ProductColorGroup', module: 'UpdateStatus' };
        common.Call(option);
    };
    this.ProductColorGroup.Search = (option) => {
        option.api = { method: 'get', controller: 'ProductColorGroup', module: 'Search' };
        common.Call(option);
    };

    //------------------ Product ----------------------//
    this.Product = this.Product || {};
    this.Product.Search = (option) => {
        option.api = { method: 'get', controller: 'Product', module: 'Search' };
        common.Call(option);
    };
    this.Product.SearchLight = (option) => {
        option.api = { method: 'get', controller: 'Product', module: 'SearchLight' };
        common.Call(option);
    };

    //------------------ ProductTwineSeries ----------------------//
    this.ProductTwineSeries = this.ProductTwineSeries || {};
    this.ProductTwineSeries.Search = (option) => {
        option.api = { method: 'get', controller: 'ProductTwineSeries', module: 'Search' };
        common.Call(option);
    };

    //------------------ Customer ----------------------//
    this.Customer = this.Customer || {};
    this.Customer.Search = (option) => {
        option.api = { method: 'get', controller: 'Customer', module: 'Search' };
        common.Call(option);
    };

    //------------------ UnitType ----------------------//
    this.UnitType = this.UnitType || {};
    this.UnitType.ProductTypeList = (option) => {
        option.api = { method: 'get', controller: 'UnitType', module: 'ProductTypeList' };
        common.Call(option);
    };
    this.UnitType.Search = (option) => {
        option.api = { method: 'get', controller: 'UnitType', module: 'Search' };
        common.Call(option);
    };

    //------------------ UnitConvert ----------------------//
    this.UnitConvert = this.UnitConvert || {};
    this.UnitConvert.search = (option) => {
        option.api = { method: 'get', controller: 'UnitConvert', module: 'search' };
        common.Call(option);
    };

    //------------------ StatusFlag ----------------------//
    this.StatusFlag = this.StatusFlag || {};
    this.StatusFlag.GetForApproval = (option) => {
        option.api = { method: 'get', controller: 'StatusFlag', module: 'GetForApproval' };
        common.Call(option);
    };

    //------------------ ProductTwineSize ----------------------//
    this.ProductTwineSize = this.ProductTwineSize || {};
    this.ProductTwineSize.Search = (option) => {
        option.api = { method: 'get', controller: 'ProductTwineSize', module: 'Search' };
        common.Call(option);
    };

    //------------------ ProductType ----------------------//
    this.ProductType = this.ProductType || {};
    this.ProductType.Search = (option) => {
        option.api = { method: 'get', controller: 'ProductType', module: 'Search' };
        common.Call(option);
    };

    //------------------ ProductGrade ----------------------//
    this.ProductGrade = this.ProductGrade || {};
    this.ProductGrade.Search = (option) => {
        option.api = { method: 'get', controller: 'ProductGrade', module: 'Search' };
        common.Call(option);
    };

    //------------------ ProductKnot ----------------------//
    this.ProductKnot = this.ProductKnot || {};
    this.ProductKnot.Search = (option) => {
        option.api = { method: 'get', controller: 'ProductKnot', module: 'Search' };
        common.Call(option);
    };

    //------------------ ProductStretching ----------------------//
    this.ProductStretching = this.ProductStretching || {};
    this.ProductStretching.Search = (option) => {
        option.api = { method: 'get', controller: 'ProductStretching', module: 'Search' };
        common.Call(option);
    };

    //------------------ ProductSelvageWovenType ----------------------//
    this.ProductSelvageWovenType = this.ProductSelvageWovenType || {};
    this.ProductSelvageWovenType.Search = (option) => {
        option.api = { method: 'get', controller: 'ProductSelvageWovenType', module: 'Search' };
        common.Call(option);
    };

    //------------------ AvgDayAmtKPI ----------------------//
    this.AvgDayAmtKPI = this.AvgDayAmtKPI || {};
    this.AvgDayAmtKPI.Search = (option) => {
        option.api = { method: 'get', controller: 'AvgDayAmtKPI', module: 'Search' };
        common.Call(option);
    };

    this.AvgDayAmtKPI.Save = (option) => {
        option.api = { method: 'post', controller: 'AvgDayAmtKPI', module: 'Save' };
        common.Call(option);
    };

    this.AvgDayAmtKPI.UpdateStatus = (option) => {
        option.api = { method: 'post', controller: 'AvgDayAmtKPI', module: 'UpdateStatus' };
        common.Call(option);
    };

    //------------------ InvTurnOver ----------------------//
    this.InvTurnOver = this.InvTurnOver || {};
    this.InvTurnOver.Report = (option) => {
        option.api = { method: 'get', controller: 'InvTurnOver', module: 'Report' };
        common.Call(option);
    };

    //------------------ ProformaInvoice ----------------------//
    this.ProformaInvoice = this.ProformaInvoice || {};
    this.ProformaInvoice.Report = (option) => {
        option.api = { method: 'post', controller: 'ProformaInvoice', module: 'Report' };
        common.Call(option);
    };
    this.ProformaInvoice.GetActual = (option) => {
        option.api = { method: 'post', controller: 'ProformaInvoice', module: 'GetActual' };
        common.Call(option);
    };
    this.ProformaInvoice.Report2 = (option) => {
        option.api = { method: 'post', controller: 'ProformaInvoice', module: 'Report2' };
        common.Call(option);
    };

    //------------------ Order ----------------------//
    this.OrderOnhand = this.OrderOnhand || {};
    this.OrderOnhand.Report = (option) => {
        option.api = { method: 'post', controller: 'Order', module: 'Report' };
        common.Call(option);
    };


    //------------------ Shipment Plan ----------------------//
    this.ShipmentPlan = this.ShipmentPlan || {};
    this.ShipmentPlan.GetForecastReport2 = (option) => {
        option.api = { method: 'post', controller: 'ShipmentPlan', module: 'GetForecastReport2' };
        common.Call(option);
    };

    //------------------ Label ----------------------//
    this.Label = this.Label || {};
    this.Label.List = (option) => {
        option.api = { method: 'get', controller: 'Label', module: 'List' };
        common.Call(option);
    };

    //------------------ CommercialInvoice ----------------------//
    this.CommercialInvoice = this.CommercialInvoice || {};
    this.CommercialInvoice.ItemsReport = (option) => {
        option.api = { method: 'post', controller: 'CommercialInvoice', module: 'ItemsReport' };
        common.Call(option);
    };

});

//--------------------------------- for international sales ---------------------------------//
app.service('intersales', function ($rootScope, common, $filter) {

    //--------- logic ------------//

    this.GetWeekPlan = function (month, year, shippingDay) {
        var weekPlan = [];
        for (month; month <= 12; month++) {
            var d = new Date(year, month - 1, 1);
            for (var i = 31; i >= 28; i--) {
                var d2 = angular.copy(d);
                d2.setDate(i);
                if (d2.getMonth() === d.getMonth()) {
                    var chk = true, fristDate = 1, no = 1, startDate = {};
                    for (var j = 1; j <= i; j++) {
                        var d3 = new Date(year, month - 1, j);
                        if (chk) { fristDate = j; chk = false; startDate = angular.copy(d3); }
                        if (d3.getDay() === 0) { chk = true }
                        if (j === i || chk) { weekPlan.push({ weekNo: no++, month: month, year: year, startDate: startDate, endDate: angular.copy(d3) }); }
                    }
                    break;
                }
            }
        }
        weekPlan.forEach(function (row) {
            row.label = 'W' + row.weekNo;
            for (var i = row.startDate.getDate(); i <= row.endDate.getDate(); i++) {
                var d = new Date(row.year, row.month - 1, i);
                row.shippingDay = d;
                if (d.getDay() >= shippingDay) {
                    break;
                }
            }
        });
        return weekPlan;
    };

    this.GetDiameter = (code) => {
        var datas = {};
        datas.size = code.replace(/^([0-9]+).*$/g, '$1');
        datas.amount = code.replace(/^[0-9]+[^0-9]([0-9]+).*$/g, '$1');
        var reg = new RegExp('^[0-9]+.*?[]?([A-Z]+)$', 'g');
        datas.word = code.replace(reg, '$1');

        for (var i = 0; i < Object.keys(datas).length; i++) {
            var k = Object.keys(datas)[i];
            if (datas[k] === code && k !== 'size') datas[k] = '0';
        }
        datas.size = parseInt(datas.size);
        datas.amount = parseInt(datas.amount);
        return datas;
    };

    this.GetTagDescription = (minMeshSize, maxMeshSize, minMeshDepth, maxMeshDepth, minLength, maxLength) => {
        minMeshSize = (minMeshSize === null || minMeshSize === undefined ? '' : minMeshSize + '').trim();
        maxMeshSize = (maxMeshSize === null || maxMeshSize === undefined ? '' : maxMeshSize + '').trim();
        minMeshDepth = (minMeshDepth === null || minMeshDepth === undefined ? '' : minMeshDepth + '').trim();
        maxMeshDepth = (maxMeshDepth === null || maxMeshDepth === undefined ? '' : maxMeshDepth + '').trim();
        minLength = (minLength === null || minLength === undefined ? '' : minLength + '').trim();
        maxLength = (maxLength === null || maxLength === undefined ? '' : maxLength + '').trim();
        var o = "";
        if (minMeshSize === maxMeshSize) o += (minMeshSize !== '' ? minMeshSize : "any") + " cm , ";
        else o += (minMeshSize !== '' ? minMeshSize : "any") + " - " + (maxMeshSize !== '' ? maxMeshSize : "any") + " cm , ";

        if (minMeshDepth === maxMeshDepth) o += (minMeshDepth !== '' ? minMeshDepth : "any") + " md , ";
        else o += (minMeshDepth !== '' ? minMeshDepth : "any") + " - " + (maxMeshDepth !== '' ? maxMeshDepth : "any") + " md , ";

        if (minLength === maxLength) o += (minLength !== '' ? minLength : "any") + " m";
        else o += (minLength !== '' ? minLength : "any") + " - " + (maxLength !== '' ? maxLength : "any") + " m";

        return o;
    };

    this.GetTagDescription2 = (meshSize, meshDepth, length) => {
        var minMeshSize = common.GetStringVal(meshSize.min);
        var maxMeshSize = common.GetStringVal(meshSize.max);
        var minMeshDepth = common.GetStringVal(meshDepth.min);
        var maxMeshDepth = common.GetStringVal(meshDepth.max);
        var minLength = common.GetStringVal(length.min);
        var maxLength = common.GetStringVal(length.max);

        var o = "";
        if (eval(minMeshSize) === eval(maxMeshSize)) o += (minMeshSize !== '' ? minMeshSize : "any") + " " + meshSize.unit.symbol + " , ";
        else o += (minMeshSize !== '' ? minMeshSize : "any") + " - " + (maxMeshSize !== '' ? maxMeshSize : "any") + " " + meshSize.unit.symbol + " , ";

        if (eval(minMeshDepth) === eval(maxMeshDepth)) o += (minMeshDepth !== '' ? minMeshDepth : "any") + " " + meshDepth.unit.symbol + " , ";
        else o += (minMeshDepth !== '' ? minMeshDepth : "any") + " - " + (maxMeshDepth !== '' ? maxMeshDepth : "any") + " " + meshDepth.unit.symbol + " , ";

        if (eval(minLength) === eval(maxLength)) o += (minLength !== '' ? minLength : "any") + " " + length.unit.symbol;
        else o += (minLength !== '' ? minLength : "any") + " - " + (maxLength !== '' ? maxLength : "any") + " " + length.unit.symbol;

        return o;
    };

    this.SortProduct = (data, asc = true) => {
        if (asc) {
            data.sort(function (a, b) {
                if (parseFloat(a.sort.twineFilamentSize) > parseFloat(b.sort.twineFilamentSize)) return true;
                else if (parseFloat(a.sort.twineFilamentSize) < parseFloat(b.sort.twineFilamentSize)) return false;

                if (parseFloat(a.sort.twineFilamentAmount) > parseFloat(b.sort.twineFilamentAmount)) return true;
                else if (parseFloat(a.sort.twineFilamentAmount) < parseFloat(b.sort.twineFilamentAmount)) return false;

                if (a.sort.twineWord > b.sort.twineWord) return true;
                else if (a.sort.twineWord < b.sort.twineWord) return false;

                if (parseFloat(a.sort.netEyeSize) > parseFloat(b.sort.netEyeSize)) return true;
                else if (parseFloat(a.sort.netEyeSize) < parseFloat(b.sort.netEyeSize)) return false;

                if (parseFloat(a.sort.netEyeAmount) > parseFloat(b.sort.netEyeAmount)) return true;
                else if (parseFloat(a.sort.netEyeAmount) < parseFloat(b.sort.netEyeAmount)) return false;

                if (parseFloat(a.sort.netLength) > parseFloat(b.sort.netLength)) return true;
                else if (parseFloat(a.sort.netLength) < parseFloat(b.sort.netLength)) return false;

                if (a.sort.netKnotSerie > b.sort.netKnotSerie) return true;
                else if (a.sort.netKnotSerie < b.sort.netKnotSerie) return false;

                if (a.sort.netSt > b.sort.netSt) return true;
                else if (a.sort.netSt < b.sort.netSt) return false;

                if (a.sort.netColor > b.sort.netColor) return true;
                else if (a.sort.netColor < b.sort.netColor) return false;

                return false;
            });
        } else {
            data.sort(function (a, b) {
                if (parseFloat(a.sort.twineFilamentSize) < parseFloat(b.sort.twineFilamentSize)) return true;
                else if (parseFloat(a.sort.twineFilamentSize) > parseFloat(b.sort.twineFilamentSize)) return false;

                if (parseFloat(a.sort.twineFilamentAmount) < parseFloat(b.sort.twineFilamentAmount)) return true;
                else if (parseFloat(a.sort.twineFilamentAmount) > parseFloat(b.sort.twineFilamentAmount)) return false;

                if (a.sort.twineWord < b.sort.twineWord) return true;
                else if (a.sort.twineWord > b.sort.twineWord) return false;

                if (parseFloat(a.sort.netEyeSize) < parseFloat(b.sort.netEyeSize)) return true;
                else if (parseFloat(a.sort.netEyeSize) > parseFloat(b.sort.netEyeSize)) return false;

                if (parseFloat(a.sort.netEyeAmount) < parseFloat(b.sort.netEyeAmount)) return true;
                else if (parseFloat(a.sort.netEyeAmount) > parseFloat(b.sort.netEyeAmount)) return false;

                if (parseFloat(a.sort.netLength) < parseFloat(b.sort.netLength)) return true;
                else if (parseFloat(a.sort.netLength) > parseFloat(b.sort.netLength)) return false;

                if (a.sort.netKnotSerie < b.sort.netKnotSerie) return true;
                else if (a.sort.netKnotSerie > b.sort.netKnotSerie) return false;

                if (a.sort.netSt < b.sort.netSt) return true;
                else if (a.sort.netSt > b.sort.netSt) return false;

                if (a.sort.netColor < b.sort.netColor) return true;
                else if (a.sort.netColor > b.sort.netColor) return false;

                return false;
            });
        }
    };

    this.PriceToRest = (price, percent, amount, inc_amount) => {
        return common.Round((price - common.Round(price * (percent / 100), 2)) - amount + inc_amount, 2);
    };

    this.DRange = (dFrom, dTo, rdFrom, rdTo) => {
        if ((dFrom >= rdFrom && dFrom <= rdTo) || (dTo >= rdFrom && dTo <= rdTo) || (dFrom <= rdFrom && dTo >= rdFrom) || (dFrom >= rdFrom && dTo <= rdTo)) {
            return true;
        }
        return false;
    };

    this.NRange = (nFrom, nTo, rnFrom, rnTo) => {
        nFrom = common.GetStringVal(nFrom) === '' ? 0 : eval(nFrom);
        nTo = common.GetStringVal(nTo) === '' ? 9999999 : eval(nTo);
        rnFrom = common.GetStringVal(rnFrom) === '' ? 0 : eval(rnFrom);
        rnTo = common.GetStringVal(rnTo) === '' ? 9999999 : eval(rnTo);
        if ((nFrom >= rnFrom && nFrom <= rnTo) || (nTo >= rnFrom && nTo <= rnTo) || (nFrom <= rnFrom && nTo >= rnFrom) || (nFrom >= rnFrom && nTo <= rnTo)) {
            return true;
        }
        return false;
    };

    this.ReloadStaticValue = function () {
        KSSClient.API.PriceStd.ReloadStaticValue({
            data: {},
            callback: function (res) {
                alert("Reload Static Values SUCCESS.");
            },
            error: function (res) {
                $rootScope.AlertMessage("Error", res.message);
            }
        });
    };

});

app.service('dialog', function ($uibModal, $q, $rootScope) {
    var $this = this;

    this.ProductShowDetail = (datareq) => {
        $uibModal.open({
            animation: true,
            size: 'mdc',
            resolve: { data: () => { return datareq; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/templates/ProductShowDetail.html?v=' + version,
            controller: ($scope, data, common, $uibModalInstance, $filter) => {
                KSSClient.API.Product.Search({
                    data: {
                        ids: data.productID
                        , productGradeIDs: data.productGradeID === null ? '' : data.productGradeID
                        , status: 'A'
                    },
                    callback: (res) => {
                        $scope.data = {};
                        res.data.products.forEach((d) => {
                            d.type = common.GetCodeDescription(d.productType);
                            d.twineType = common.GetCodeDescription(d.productTwineType);
                            d.twineSize = d.productTwineSize.code;
                            d.twineSeries = common.GetCodeDescription(d.productTwineSeries);
                            d.color = common.GetCodeDescription(d.productColor);
                            d.knot = common.GetCodeDescription(d.productKnot);
                            d.stretching = common.GetCodeDescription(d.productStretching);
                            d.woven = common.GetCodeDescription(d.productSelvageWoven);
                            d.selvage = common.GetCodeDescription(d.productSelvage);
                            d.selvageStretching = common.GetCodeDescription(d.productSelvageStretching);
                            d.meshSize = d.productMeshSize.meshSize;
                            d.meshDepth = d.productMeshDepth.meshDepth;
                            d.length = d.productLength.length;
                            d.rumType = common.GetCodeDescription(d.rumType);
                            d.productLayer.forEach((l) => { l.view = l.seq + ' : ' + common.GetCodeDescription(l); });
                            d.layers = d.productLayer;
                            $scope.data = d;
                            $scope.$apply();
                        });
                    },
                    error: (res) => { common.AlertMessage("Error", res.message); }
                });

                $scope.close = function () {
                    $uibModalInstance.close();
                };
            }
        }).result.then(() => { }, () => { });
    };

    this.TwineSeriesModal = (datareq) => {
        var deferred = $q.defer();
        $uibModal.open({
            animation: true,
            size: 'md',
            resolve: { data: () => { return datareq; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/templates/TwineSeriesModal.html?v=' + version,
            controller: ($scope, common, data, $uibModalInstance, API) => {

                $scope.priceMode = common.GetObjVal("priceMode", data);

                $scope.gridOpt = common.CreateGrid2({ mSelect: data.mSelect ? true : false, footer: true });
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Code', width: { default: 120 }, showCountItems: true }));
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description', width: { min: 150 } }));

                $scope.cumulative = (grid, myRow, myCol) => { if (grid.id === $scope.gridApi.grid.id) { if (myCol.field === "headRow") { return true; } } return false; };

                $scope.SelectAll = function () {
                    if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
                    else { $scope.gridApi.selection.clearSelectedRows(); }
                    common.ChkChange($scope);
                };

                $scope.gridOpt.onRegisterApi = (gridApi) => {
                    $scope.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, (row) => { $scope.btnOk = $scope.gridApi.selection.getSelectedRows().length > 0; });
                    $scope.gridApi.grid.registerRowsProcessor((renderableRows) => {
                        var reg = RegExp(angular.isUndefined($scope.txtFind) ? '' : $scope.txtFind, 'i');
                        renderableRows.forEach((row) => { if (reg.test(row.entity.code) || reg.test(row.entity.description)) { /*row.visible = true;*/ } else { row.visible = false; } });
                        return renderableRows;
                    }, 200);
                    $scope.LoadData();
                };

                $scope.LoadData = () => {
                    if ($scope.priceTableAvailable) {
                        API.PriceStd.ListRangeD({
                            data: {
                                ids: $scope.priceMode ? data.mainID : []
                                , countryGroupIDs: data.countryGroupID
                                , productTypeIDs: data.productTypeID
                                , productGradeIDs: data.productGradeID === null ? '' : data.productGradeID
                                , currencyIDs: data.currencyID
                                , status: 'A'
                            },
                            callback: (res) => {
                                $scope.gridOpt.data = res.data.rangeDs.map(x => x.twineSeries);
                                $scope.gridApi.grid.refresh();
                            },
                            error: (res) => { common.AlertMessage("Error", res.message); }
                        });
                    } else {
                        if (angular.isArray(data.twineSeries) && data.twineSeries.length) {
                            $scope.gridOpt.data = data.twineSeries;
                            $scope.gridApi.grid.refresh();
                        } else {
                            API.ProductTwineSeries.Search({
                                data: { productTypeIDs: data.productTypeID, search: angular.isUndefined($scope.txtFind) ? '' : $scope.txtFind, status: 'A' },
                                callback: (res) => {
                                    $scope.gridOpt.data = res.data.twineSeries;
                                    $scope.gridApi.grid.refresh();
                                },
                                error: (res) => { common.AlertMessage("Error", res.message); }
                            });
                        }
                    }
                };

                $scope.ok = () => {
                    var dataRes = {};
                    if (data.mSelect) {
                        dataRes = $scope.gridApi.selection.getSelectedRows();
                    } else {
                        dataRes = $scope.gridApi.selection.getSelectedRows()[0];
                        common.SetObjVal('twineSeries.id', dataRes.id, data.row);
                        common.SetObjVal('twineSeries.code', dataRes.code, data.row);
                        common.SetObjVal('twineSeries.description', dataRes.description, data.row);
                    }
                    $uibModalInstance.close(dataRes);
                };
                $scope.cancel = () => { $uibModalInstance.dismiss('cancel'); };
            }
        }).result.then((data) => { deferred.resolve(data); }, () => { deferred.resolve([]); });
        return deferred.promise;
    };

    this.ProductModal = (datareq) => {
        var deferred = $q.defer();
        $uibModal.open({
            animation: true,
            size: 'mdc',
            resolve: { data: () => { return datareq; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/templates/ProductModal.html',
            controller: ($scope, common, data, $uibModalInstance, API) => {
                $scope.priceMode = common.GetObjVal("priceMode", data);
                //$scope.priceTableAvailable = false;
                $scope.isOpen = false;

                $scope.gridOpt = common.CreateGrid2({ mSelect: data.mSelect ? true : false, footer: true });
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Code', width: { default: 155 }, showCountItems: true }));
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description', width: { min: 250 } }));
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'rumType_view', display: 'RumeType', width: { min: 200 } }));

                $scope.SelectAll = function () {
                    if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
                    else { $scope.gridApi.selection.clearSelectedRows(); }
                    common.ChkChange($scope);
                };

                $scope.cumulative = (grid, myRow, myCol) => { if (grid.id === $scope.gridApi.grid.id) { if (myCol.field === "headRow") { return true; } } return false; };

                $scope.gridOpt.onRegisterApi = (gridApi) => {
                    $scope.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, (row) => { $scope.btnOk = $scope.gridApi.selection.getSelectedRows().length > 0; });

                    $scope.gridApi.grid.registerRowsProcessor((renderableRows) => {
                        var reg = RegExp(angular.isUndefined($scope.txtFind) ? '' : $scope.txtFind.replace(/([!@#$%\^&)(+=._-])/g, '[$1]'), 'i');
                        renderableRows.forEach((row) => { if (reg.test(row.entity.code) || reg.test(row.entity.description) || row.entity.code === $scope.txtFind) { /*row.visible = true;*/ } else { row.visible = false; } });
                        return renderableRows;
                    }, 200);
                    $scope.isOpen = true;
                    $scope.LoadData();
                };


                $scope.LoadData = () => {
                    if (!$scope.isOpen) { return; }
                    if ($scope.priceTableAvailable) {
                        API.PriceStd.ListProd({
                            data: {
                                ids: $scope.priceMode ? data.mainID : []
                                , countryGroupIDs: data.countryGroupID
                                , productTypeIDs: data.productTypeID
                                , productGradeIDs: data.productGradeID === null ? '' : data.productGradeID
                                , currencyIDs: data.currencyID
                                , status: 'A'
                            },
                            callback: (res) => {
                                $scope.gridOpt.data = res.data.prods.map(x => x.product);
                                $scope.gridOpt.data.forEach((d) => { d.rumType_view = common.GetCodeDescription(d.rumType); });
                                $scope.gridApi.grid.refresh();
                            },
                            error: (res) => { common.AlertMessage("Error", res.message); }
                        });
                    } else {
                        if (angular.isArray($rootScope.products) && $rootScope.products.length) {
                            $scope.gridOpt.data = $rootScope.products;
                            $scope.gridOpt.data.forEach((d) => { d.rumType_view = common.GetCodeDescription(d.rumType); });
                            $scope.gridApi.grid.refresh();
                        } else {
                            API.Product.SearchLight({
                                data: {
                                    productTypeIDs: data.productTypeID
                                    , productGradeIDs: data.productGradeID === null ? '' : data.productGradeID
                                    , search: angular.isUndefined($scope.txtFind) ? '' : $scope.txtFind
                                    , status: 'A'
                                },
                                callback: (res) => {
                                    $scope.gridOpt.data = res.data.products;
                                    $scope.gridOpt.data.forEach((d) => { d.rumType_view = common.GetCodeDescription(d.rumType); });
                                    $scope.gridApi.grid.refresh();
                                },
                                error: (res) => { common.AlertMessage("Error", res.message); }
                            });
                        }
                    }
                };

                $scope.ok = () => {
                    var dataRes = {};
                    if (data.mSelect) {
                        dataRes = $scope.gridApi.selection.getSelectedRows();
                    } else {
                        dataRes = $scope.gridApi.selection.getSelectedRows()[0];
                        common.SetObjVal('product.id', dataRes.id, data.row);
                        common.SetObjVal('product.code', dataRes.code, data.row);
                        common.SetObjVal('product.description', dataRes.description, data.row);
                        common.SetObjVal('rumType', dataRes.rumType, data.row);
                        common.SetObjVal('rumType_view', dataRes.rumType_view, data.row);
                    }
                    $uibModalInstance.close(dataRes);
                };
                $scope.cancel = () => { $uibModalInstance.dismiss('cancel'); };
            }
        }).result.then((data) => { deferred.resolve(data); }, () => { deferred.resolve([]); });
        return deferred.promise;
    };

    this.ColorGroupModal = (datareq) => {
        var deferred = $q.defer();
        $uibModal.open({
            animation: true,
            size: 'lg',
            resolve: { data: () => { return datareq; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/templates/ColorGroupModal.html?v=' + version,
            controller: ($scope, common, data, $uibModalInstance, $filter, $timeout, uiGridConstants, API) => {

                $scope.gridOpt1 = common.CreateGrid2({ mSelect: false, footer: true, enableInsert: true, enableGridEdit: true });
                $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Code', width: { default: 100 }, showCountItems: true }));
                $scope.gridOpt1.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description', edit: true, width: { default: 250 } }));

                $scope.gridOpt1.onRegisterApi = (gridApi) => {
                    $scope.gridApi1 = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, (row) => {
                        row.entity.enableEdit = true;
                        $scope.SetColor(row.entity.colors);
                        $scope.Grid2_Set(true/*row.entity.id === 0*/);
                        $scope.btnOk = $scope.btnRemove1 = row.isSelected;
                    });
                    gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {
                        $scope.$apply();
                        $scope.checkEdit = true;
                    });
                    $scope.LoadData();
                };

                $scope.LoadData = () => {
                    KSSClient.API.ProductColorGroup.Search({
                        data: {
                            countryGroupIDs: data.countryGroupID
                            , productTypeID: data.productTypeID
                            , productGradeID: data.productGradeID
                            , search: angular.isUndefined($scope.txtFind) ? '' : $scope.txtFind
                            , status: 'A'
                        },
                        callback: (res) => {
                            res.data.colorGroups.forEach((d) => { d.descriptionorg = d.description; });
                            $scope.gridOpt1.data = res.data.colorGroups;
                            $scope.gridApi1.grid.refresh();
                            $scope.SetColor([]);
                            $scope.btnOk = $scope.checkEdit = $scope.btnRemove1 = false;
                            $timeout(() => {
                                var index = $scope.gridApi1.grid.options.data.findIndex((d) => { return d.id === data.colorGroupID; });
                                $scope.gridApi1.cellNav.scrollToFocus(
                                    $scope.gridApi1.grid.options.data[index]
                                    , $scope.gridApi1.grid.options.columnDefs[1]);
                                $scope.gridApi1.core.scrollTo(
                                    $scope.gridApi1.grid.options.data[index - 1]
                                    , $scope.gridApi1.grid.options.columnDefs[1]);
                            }, 5);
                            $scope.gridApi1.grid.refresh();
                        },
                        error: (res) => { common.AlertMessage("Error", res.message); }
                    });
                };


                $scope.RemoveColorGroup = () => {
                    $scope.gridApi1.selection.getSelectedRows().forEach((d) => {
                        common.ConfirmDialog('You are sure?', 'Remove Color Group :\n' + d.code, true).then((OK) => {
                            if (OK) {
                                API.ProductColorGroup.UpdateStatus({
                                    data: { ids: $scope.gridApi1.selection.getSelectedRows().map(x => x.id), status: 'C' },
                                    callback: (res) => { common.AlertMessage('Success', '').then((ok) => { $scope.LoadData(); }); },
                                    error: (res) => { common.AlertMessage("Error", res.message); }
                                });
                            }
                        });
                    });
                };

                $scope.cumulative = (grid, myRow, myCol) => {
                    if (grid.id === $scope.gridApi1.grid.id) {
                        if (myCol.field === "headRow") { return true; }
                    } else if (grid.id === $scope.gridApi2.grid.id) {
                        if (myCol.field === "headRow") { if (!myRow.entity.isInsert) { return true; } }
                    }
                    return false;
                };

                // ProductColor
                KSSClient.API.ProductColor.Search({
                    data: { status: 'A' },
                    callback: (res) => {
                        res.data.colors.forEach((row, index) => { row.view = row.code + " : " + row.description; });
                        //$rootScope.ProductColors = res.data.colors;
                        $scope.productColor.list = res.data.colors;
                    }, error: (res) => { common.AlertMessage("Error", res.message); }
                });

                $scope.productColor = {
                    value: ''
                    , list: []
                    , func: (key) => {
                        $scope.productColor.value = key;
                    }
                };

                $scope.AddRow = (grid) => {
                    var obj = {};
                    if (grid.id === $scope.gridApi1.grid.id) {
                        common.SetObjVal('id', 0, obj);
                        common.SetObjVal('code', 'New', obj);
                        common.SetObjVal('description', '', obj);
                        common.SetObjVal('countryGroup.id', data.countryGroupID, obj);
                        common.SetObjVal('productType.id', data.productTypeID, obj);
                        common.SetObjVal('productGrade.id', data.productGradeID, obj);
                        common.SetObjVal('colors', [], obj);
                        common.SetObjVal('enableEdit', true, obj);
                        $scope.gridOpt1.data.push(obj);
                        $timeout(() => {
                            $scope.gridApi1.cellNav.scrollToFocus(
                                $scope.gridApi1.grid.options.data[$scope.gridApi1.grid.options.data.length - 1]
                                , $scope.gridApi1.grid.options.columnDefs[1]);
                            $scope.gridApi1.core.scrollTo(
                                $scope.gridApi1.grid.options.data[$scope.gridApi1.grid.options.data.length - 2]
                                , $scope.gridApi1.grid.options.columnDefs[1]);
                            $timeout(() => { $scope.AddRow($scope.gridApi2.grid); }, 100);
                        }, 5);
                        $scope.gridApi1.grid.refresh();

                    } else if (grid.id === $scope.gridApi2.grid.id) {
                        common.SetObjVal('id', 0, obj);
                        common.SetObjVal('code', '', obj);
                        common.SetObjVal('codeerr', true, obj);
                        common.SetObjVal('description', '', obj);
                        common.SetObjVal('descriptionorg', '', obj);
                        common.SetObjVal('enableEdit', true, obj);
                        common.SetObjVal('isInsert', true, obj);
                        $scope.gridOpt2.data.push(obj);
                        $timeout(() => {
                            $scope.gridApi2.cellNav.scrollToFocus(
                                $scope.gridApi2.grid.options.data[$scope.gridApi2.grid.options.data.length - 1]
                                , $scope.gridApi2.grid.options.columnDefs[1]);
                            $scope.gridApi2.core.scrollTo(
                                $scope.gridApi2.grid.options.data[$scope.gridApi2.grid.options.data.length - 2]
                                , $scope.gridApi2.grid.options.columnDefs[1]);
                        }, 5);
                        $scope.gridApi2.grid.refresh();
                    }
                    $scope.checkEdit = true;
                };

                $scope.RemoveRow = (grid, row) => {
                    $scope.gridApi2.grid.options.data.splice($scope.gridApi2.grid.options.data.indexOf(row.entity), 1);
                    $scope.gridApi2.grid.refresh();
                };

                $scope.RemoveColor = () => {
                    $scope.gridApi2.selection.getSelectedRows().forEach((d) => {
                        common.ConfirmDialog('You are sure?', 'Remove Color :\n' + d.code, true).then((OK) => {
                            if (OK) {
                                $scope.gridApi2.grid.options.data.splice($scope.gridApi2.grid.options.data.indexOf(d), 1);
                                $scope.gridApi2.grid.refresh();
                                $scope.btnRemove2 = false;
                                $scope.checkEdit = true;
                            }
                        });
                    });
                };

                $scope.gridOpt2 = common.CreateGrid2({ mSelect: false, footer: true });
                $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'code', edit: true, display: 'Code', width: { default: 100 }, format: { type: 'autocomplete', obj: 'productColor' }, showCountItems: true, setclass: common.SetClassEdit }));
                $scope.gridOpt2.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description', width: { default: 250 }, setclass: common.SetClassEdit }));

                $scope.gridOpt2.onRegisterApi = (gridApi) => {
                    $scope.gridApi2 = gridApi;

                    gridApi.selection.on.rowSelectionChanged($scope, (row) => {
                        $scope.btnRemove2 = row.isSelected;
                    });

                    gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {
                        $scope.$apply();
                        $scope.checkEdit = true;
                        var color = $filter('filter')($scope.productColor.list, { code: rowEntity.code }, true);
                        rowEntity.codeerr = color.length === 0;
                        if (color.length) {
                            rowEntity.id = color[0].id;
                            rowEntity.description = color[0].description;
                        } else {
                            rowEntity.id = 0;
                            rowEntity.description = '';
                        }
                        $scope.gridApi2.grid.options.data.forEach((d) => {
                            if (rowEntity.code === d.code
                                && d.$$hashKey !== rowEntity.$$hashKey) {
                                common.AlertMessage('Error', 'Cannot edit duplicate Code : ' + d.code);
                                common.SetObjVal(colDef.name + 'err', true, rowEntity);
                                return;
                            }
                        });
                        $scope.gridApi2.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                    });
                };

                $scope.Grid2_Set = (chk) => {
                    $scope.gridApi2.grid.options.enableInsert = chk;
                    $scope.gridApi2.grid.options.enableGridEdit = chk;
                    $scope.gridApi2.grid.refresh();
                };

                $scope.SetColor = (data) => {
                    $scope.btnRemove2 = false;
                    $scope.gridOpt2.data = data;
                    $scope.gridApi2.grid.refresh();
                };

                $scope.ok = () => {
                    var tmp = $scope.gridApi1.selection.getSelectedRows()[0];
                    var chkErr = tmp.colors.length === 0;
                    tmp.colors.forEach((v) => { if (v.codeerr) { chkErr = true; return; } });
                    if (chkErr) {
                        common.AlertMessage('Error', 'Can not Choose Color Group.');
                    } else {
                        if ($scope.checkEdit) {
                            // chk color group use


                            // confirm change
                            KSSClient.API.ProductColorGroup.Import({
                                data: { colorGroups: [$scope.gridApi1.selection.getSelectedRows()[0]] },
                                callback: (res) => {
                                    if (res.data.colorGroups.length) {
                                        $uibModalInstance.close(res.data.colorGroups[0]);
                                    } else {
                                        common.AlertMessage('Error', 'Can not Choose Color Group.');
                                    }
                                },
                                error: (res) => { common.AlertMessage("Error", res.message); }
                            });

                        } else $uibModalInstance.close(tmp);
                    }
                };

                $scope.clear = () => { $uibModalInstance.close(); };

                $scope.cancel = () => { $uibModalInstance.dismiss('cancel'); };
            }
        }).result.then((data) => { deferred.resolve(data); }, () => { });
        return deferred.promise;
    };

    this.SpecNetModal = (datareq) => {
        var deferred = $q.defer();
        $uibModal.open({
            animation: true,
            size: 'md',
            resolve: { data: () => { return datareq; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/templates/SpecNetModal.html?v=' + version,
            controller: ($scope, common, intersales, data, $filter, API, $uibModalInstance, $timeout) => {
                $scope.priceMode = common.GetObjVal("priceMode", data);
                $scope.tabList = [
                    { id: 1, code: 'N', description: 'New Spec', active: true }
                    , { id: 2, code: 'A', description: 'Available Spec', active: false }
                ];
                $scope.seltab = 1;
                $scope.TabChange = (id) => {
                    $scope.seltab = id;
                    $scope.tabList.forEach((v) => { v.active = v.id === id; });

                    if (id === 1) {
                        //if ($scope.gridApi.selection.getSelectedRows().length === 1) {
                        //    var tmp = $scope.gridApi.selection.getSelectedRows()[0];
                        //    $scope.p_meshSize = { min: common.GetStringVal(common.GetObjVal('minMeshSize', tmp)), max: common.GetStringVal(common.GetObjVal('maxMeshSize', tmp)), unit: {}, error: false };
                        //    $scope.p_meshDepth = { min: common.GetStringVal(common.GetObjVal('minMeshDepth', tmp)), max: common.GetStringVal(common.GetObjVal('maxMeshDepth', tmp)), unit: {}, error: false };
                        //    $scope.p_length = { min: common.GetStringVal(common.GetObjVal('minLength', tmp)), max: common.GetStringVal(common.GetObjVal('maxLength', tmp)), unit: {}, error: false };

                        //    $scope.tagDes = common.GetObjVal('tagDescription', tmp);
                        //    $scope.salesDes = common.GetObjVal('salesDescription', tmp);
                        //}
                        $scope.ChkSuccess();
                    } else {
                        $scope.btnOk = $scope.gridApi.selection.getSelectedRows().length > 0;
                        if ($scope.gridApi.selection.getSelectedRows().length === 0) {
                            $scope.LoadData();
                        }
                    }
                };

                $scope.s_meshSize = { min: null, max: null, unit: {}, error: false };
                $scope.s_meshDepth = { min: null, max: null, unit: {}, error: false };
                $scope.s_length = { min: null, max: null, unit: {}, error: false };

                $scope.p_meshSize = { min: common.GetStringVal(common.GetObjVal('row.minMeshSize', data)), max: common.GetStringVal(common.GetObjVal('row.maxMeshSize', data)), unit: {}, error: false };
                $scope.p_meshDepth = { min: common.GetStringVal(common.GetObjVal('row.minMeshDepth', data)), max: common.GetStringVal(common.GetObjVal('row.maxMeshDepth', data)), unit: {}, error: false };
                $scope.p_length = { min: common.GetStringVal(common.GetObjVal('row.minLength', data)), max: common.GetStringVal(common.GetObjVal('row.maxLength', data)), unit: {}, error: false };

                $scope.tagDes = common.GetObjVal('row.tagDescription', data);
                $scope.salesDes = common.GetObjVal('row.salesDescription', data);

                $scope.mUnitType = [];
                $scope.dUnitType = [];
                $scope.lUnitType = [];

                $scope.chkChange = false;

                $scope.SetDataUnit = (x, obj) => {
                    if (x.length === 4) {
                        obj.min = x[0] === 'any' ? '' : x[0];
                        obj.max = x[2] === 'any' ? '' : x[2];
                        obj.unit = x[3];
                    } else if (x.length === 2) {
                        obj.min = obj.max = x[0] === 'any' ? '' : x[0];
                        obj.unit = x[1];
                    }
                };

                API.UnitType.ProductTypeList({
                    data: {
                        productTypeID: data.productTypeID
                    },
                    callback: (res) => {
                        try {
                            var tmp = data.row.salesDescription.split(" , ");
                            var M = tmp[0].split(' ');
                            var D = tmp[1].split(' ');
                            var L = tmp[2].split(' ');

                            $scope.SetDataUnit(M, $scope.s_meshSize);
                            $scope.SetDataUnit(D, $scope.s_meshDepth);
                            $scope.SetDataUnit(L, $scope.s_length);
                        } catch (ex) {
                            $scope.btnOk = false;
                            if (!common.GetObjVal('row.id', data)) {
                                $timeout(() => { $scope.mUnitChange(); $scope.pmUnitChange(); $scope.btnOk = true; }, 15);
                            }
                        }

                        res.data.unitTypes.forEach((d) => {
                            if (d.unitGroupType.code === 'M') {
                                d.s_unitType.forEach((r) => {
                                    $scope.mUnitType.push(r);
                                    if (r.symbol === $scope.s_meshSize.unit) { $scope.s_meshSize.unit = r; }
                                });
                                if (angular.isUndefined($scope.s_meshSize.unit.symbol)) { $scope.s_meshSize.unit = $scope.mUnitType[0]; }
                                $scope.p_meshSize.unit = d.p_unitType;

                            } else if (d.unitGroupType.code === 'D') {
                                d.s_unitType.forEach((r) => {
                                    $scope.dUnitType.push(r);
                                    if (r.symbol === $scope.s_meshDepth.unit) { $scope.s_meshDepth.unit = r; }
                                });
                                if (angular.isUndefined($scope.s_meshDepth.unit.symbol)) { $scope.s_meshDepth.unit = $scope.dUnitType[0]; }
                                $scope.p_meshDepth.unit = d.p_unitType;

                            } else if (d.unitGroupType.code === 'L') {
                                d.s_unitType.forEach((r) => {
                                    $scope.lUnitType.push(r);
                                    if (r.symbol === $scope.s_length.unit) { $scope.s_length.unit = r; }
                                });
                                if (angular.isUndefined($scope.s_length.unit.symbol)) { $scope.s_length.unit = $scope.lUnitType[0]; }
                                $scope.p_length.unit = d.p_unitType;

                            }
                        });
                        $timeout(() => { $scope.chkChange = true; }, 10);
                    },
                    error: (res) => { common.AlertMessage("Error", res.message); }
                });

                var GetA = (val) => {
                    if (/[/]/.test(val) && /[.]/.test(val)) {
                        return eval(val.replace(/[.]/, '+(') + ')');
                    }
                    return eval(val);
                };

                var ChkErr = (min, max) => {
                    if (common.GetStringVal(min) !== '' && common.GetStringVal(max) !== '') {
                        return GetA(min) > GetA(max);
                    }
                };

                var GetFormular = (unitID, unitID2, groupType) => {
                    return $filter('filter')(data.unitConverts, { unitGroupType: { code: common.GetStringVal(groupType) }, unitType: { id: unitID }, unitType2: { id: unitID2 } }, true)[0];
                };

                var GetSubUnitID = (groupType, unitCode) => {
                    return $filter('filter')(data.unitConverts, { unitGroupType: { code: common.GetStringVal(groupType) }, unitType: { symbol: common.GetStringVal(unitCode) } }, true)[0].unitType.id;
                };

                var GetSaleData = (groupType) => {
                    if (groupType === 'M') { return $scope.s_meshSize; }
                    else if (groupType === 'D') { return $scope.s_meshDepth; }
                    else if (groupType === 'L') { return $scope.s_length; }
                };

                var ConvertUnit = (s_data, unitID, groupType) => {
                    var tmp = { min: '', max: '' };
                    try {
                        if (s_data.err) { return tmp; }
                        var unitConvert = GetFormular(s_data.unit.id, unitID, groupType);
                        if (!unitConvert) { return tmp; }

                        var fmin = unitConvert.formula;
                        var fmax = unitConvert.formula;

                        var s = unitConvert.formula.search('{');
                        var e = unitConvert.formula.search('}');
                        if (s !== -1 && e !== -1) {
                            var subF = unitConvert.formula.slice(s, e + 1);
                            var t = subF.slice(1, subF.length - 1).split('=');
                            var num = ConvertUnit(GetSaleData(t[0]), GetSubUnitID(t[0], t[1]), t[0]);
                            fmin = fmin.replace(subF, common.GetStringVal(num.min));
                            fmax = fmax.replace(subF, common.GetStringVal(num.max));
                        }

                        var A = 0;
                        if (common.GetStringVal(s_data.min) !== '') {
                            A = GetA(s_data.min);
                            tmp.min = unitConvert.round ? Math.round(eval(fmin)) : eval(common.GetStringVal(fmin) === '' ? common.Round(fmin, 2) : common.Round(eval(fmin), 2));
                        }

                        if (common.GetStringVal(s_data.max) !== '') {
                            A = GetA(s_data.max);
                            tmp.max = unitConvert.round ? Math.round(eval(fmin)) : eval(common.GetStringVal(fmax) === '' ? common.Round(fmax, 2) : common.Round(eval(fmax), 2));
                        }

                    } catch (ex) {
                        console.log(ex);
                        common.AlertMessage('Error', 'Unit can not be converted.\n' + ex.toString());
                    }
                    return tmp;
                };

                var GenDesS = () => { $scope.salesDes = intersales.GetTagDescription2($scope.s_meshSize, $scope.s_meshDepth, $scope.s_length); };

                var GenDesP = () => { $scope.tagDes = intersales.GetTagDescription2($scope.p_meshSize, $scope.p_meshDepth, $scope.p_length); };

                //------------ Sales --------------//
                $scope.mUnitChange = () => {
                    if ($scope.chkChange) {
                        GenDesS();
                        $scope.s_meshSize.error = ChkErr($scope.s_meshSize.min, $scope.s_meshSize.max);

                        var tmp = ConvertUnit($scope.s_meshSize, $scope.p_meshSize.unit.id, 'M');
                        $scope.p_meshSize.min = common.GetStringVal(tmp.min);
                        $scope.p_meshSize.max = common.GetStringVal(tmp.max);
                    }
                };

                $scope.dUnitChange = () => {
                    if ($scope.chkChange) {
                        GenDesS();
                        $scope.s_meshDepth.error = ChkErr($scope.s_meshDepth.min, $scope.s_meshDepth.max);

                        var tmp = ConvertUnit($scope.s_meshDepth, $scope.p_meshDepth.unit.id, 'D');
                        $scope.p_meshDepth.min = common.GetStringVal(tmp.min);
                        $scope.p_meshDepth.max = common.GetStringVal(tmp.max);
                    }
                };

                $scope.lUnitChange = () => {
                    if ($scope.chkChange) {
                        GenDesS();
                        $scope.s_length.error = ChkErr($scope.s_length.min, $scope.s_length.max);

                        var tmp = ConvertUnit($scope.s_length, $scope.p_length.unit.id, 'L');
                        $scope.p_length.min = common.GetStringVal(tmp.min);
                        $scope.p_length.max = common.GetStringVal(tmp.max);
                    }
                };

                //-------------- production -------------//
                $scope.pmUnitChange = () => {
                    if ($scope.chkChange) {
                        GenDesP();
                        $scope.p_meshSize.error = ChkErr($scope.p_meshSize.min, $scope.p_meshSize.max);
                    }
                };
                $scope.pdUnitChange = () => {
                    if ($scope.chkChange) {
                        GenDesP();
                        $scope.p_meshDepth.error = ChkErr($scope.p_meshDepth.min, $scope.p_meshDepth.max);
                    }
                };
                $scope.plUnitChange = () => {
                    if ($scope.chkChange) {
                        GenDesP();
                        $scope.p_length.error = ChkErr($scope.p_length.min, $scope.p_length.max);
                    }
                };

                $scope.ChkSuccess = () => {
                    if ($scope.chkChange) $timeout(() => { $scope.btnOk = !($scope.s_meshSize.error || $scope.s_meshDepth.error || $scope.s_length.error || $scope.p_meshSize.error || $scope.p_meshDepth.error || $scope.p_length.error); });
                };

                //---------------------------- 2 -------------------------------//

                $scope.gridOpt = common.CreateGrid2({ mSelect: data.mSelect ? true : false, footer: true });
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'salesDescription', display: 'Sales Description', width: { default: 250 }, showCountItems: true }));
                $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'tagDescription', display: 'Tag Description', width: { min: 300 } }));

                $scope.SelectAll = function () {
                    if ($scope.chkAll) { $scope.gridApi.selection.selectAllVisibleRows(); }
                    else { $scope.gridApi.selection.clearSelectedRows(); }
                    common.ChkChange($scope);
                };

                $scope.cumulative = (grid, myRow, myCol) => { if (grid.id === $scope.gridApi.grid.id) { if (myCol.field === "headRow") { return true; } } return false; };

                $scope.gridOpt.onRegisterApi = (gridApi) => {
                    $scope.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, (row) => { $scope.btnOk = $scope.gridApi.selection.getSelectedRows().length > 0; });

                    $scope.gridApi.grid.registerRowsProcessor((renderableRows) => {
                        var reg = RegExp(angular.isUndefined($scope.txtFind) ? '' : $scope.txtFind, 'i');
                        renderableRows.forEach((row) => { if (reg.test(row.entity.salesDescription) || reg.test(row.entity.tagDescription)) { /*row.visible = true;*/ } else { row.visible = false; } });
                        return renderableRows;
                    }, 200);

                    $scope.LoadData();
                };

                $scope.LoadData = () => {
                    if ($scope.priceTableAvailable || $scope.priceMode) {
                        API.PriceStd.ListRangeD({
                            data: {
                                ids: $scope.priceMode ? data.mainID : []
                                , countryGroupIDs: data.countryGroupID
                                , productTypeIDs: data.productTypeID
                                , productGradeIDs: data.productGradeID === null ? '' : data.productGradeID
                                , currencyIDs: data.currencyID
                                , status: 'A'
                            },
                            callback: (res) => {
                                $scope.gridOpt.data = res.data.rangeDs;
                                $scope.gridApi.grid.refresh();
                            },
                            error: (res) => { common.AlertMessage("Error", res.message); }
                        });
                    } else {
                        API.DiscountStd.ListRangeD({
                            data: {
                                ids: data.mainID
                                , status: 'A'
                            },
                            callback: (res) => {
                                $scope.gridOpt.data = res.data.rangeDs;
                                $scope.gridApi.grid.refresh();
                            },
                            error: (res) => { common.AlertMessage("Error", res.message); }
                        });
                    }
                };

                $scope.ok = () => {
                    var dataRes = [];
                    if ($scope.seltab === 1) {
                        var tmp = {};
                        common.SetObjVal('spec', 'M', tmp);
                        common.SetObjVal('minMeshSize', eval($scope.p_meshSize.min), tmp);
                        common.SetObjVal('maxMeshSize', eval($scope.p_meshSize.max), tmp);
                        common.SetObjVal('minMeshDepth', eval($scope.p_meshDepth.min), tmp);
                        common.SetObjVal('maxMeshDepth', eval($scope.p_meshDepth.max), tmp);
                        common.SetObjVal('minLength', eval($scope.p_length.min), tmp);
                        common.SetObjVal('maxLength', eval($scope.p_length.max), tmp);
                        common.SetObjVal('tagDescription', $scope.tagDes, tmp);
                        common.SetObjVal('salesDescription', $scope.salesDes, tmp);
                        dataRes.push(tmp);
                    }

                    if (data.mSelect) {
                        dataRes = dataRes.concat($scope.gridApi.selection.getSelectedRows());
                    } else {
                        common.SetObjVal('spec', 'M', data.row);
                        common.SetObjVal('minMeshSize', dataRes[0].minMeshSize, data.row);
                        common.SetObjVal('maxMeshSize', dataRes[0].maxMeshSize, data.row);
                        common.SetObjVal('minMeshDepth', dataRes[0].minMeshDepth, data.row);
                        common.SetObjVal('maxMeshDepth', dataRes[0].maxMeshDepth, data.row);
                        common.SetObjVal('minLength', dataRes[0].minLength, data.row);
                        common.SetObjVal('maxLength', dataRes[0].maxLength, data.row);
                        common.SetObjVal('tagDescription', dataRes[0].tagDescription, data.row);
                        common.SetObjVal('salesDescription', dataRes[0].salesDescription, data.row);
                    }

                    $uibModalInstance.close(dataRes);
                };
                $scope.cancel = () => { $uibModalInstance.dismiss('cancel'); };
            }
        }).result.then((data) => { deferred.resolve(data); }, () => { deferred.resolve([]); });
        return deferred.promise;
    };

    this.ColorGroupShowDetail = (datareq) => {
        $uibModal.open({
            animation: true,
            size: 'md',
            resolve: { data: () => { return datareq; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/templates/ColorGroupShowDetail.html?v=' + version,
            controller: ($scope, data, common, $uibModalInstance, API) => {
                API.ProductColorGroup.Search({
                    data: {
                        ids: data.colorGroupID
                        , status: 'A'
                    },
                    callback: (res) => {
                        $scope.data = {};
                        res.data.colorGroups.forEach((d) => {
                            d.colors.forEach((r) => {
                                r.view = common.GetCodeDescription(r);
                            });
                            $scope.data = d;
                            //$scope.$apply();
                        });
                    },
                    error: (res) => { common.AlertMessage("Error", res.message); }
                });

                $scope.close = function () {
                    $uibModalInstance.close();
                };
            }
        }).result.then(() => { }, () => { });
    };

    this.ReplaceDiscountModal = (datareq) => {
        var deferred = $q.defer();
        $uibModal.open({
            animation: true,
            size: 'xs',
            resolve: { data: () => { return datareq; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/templates/ReplaceDiscountModal.html',
            controller: ($scope, data, $uibModalInstance) => {

                $scope.percent = $scope.amount = $scope.increase = 0;

                $scope.ChkChange = () => {
                    $scope.btnOk = angular.isNumber($scope.percent) && angular.isNumber($scope.amount) && angular.isNumber($scope.increase);
                };
                $scope.ChkChange();

                $scope.ok = () => {
                    var dataRes = {
                        percent: $scope.percent
                        , amount: $scope.amount
                        , increase: $scope.increase
                    };
                    $uibModalInstance.close(dataRes);
                };
                $scope.cancel = () => { $uibModalInstance.dismiss('cancel'); };
            }
        }).result.then((data) => { deferred.resolve(data); }, () => { });
        return deferred.promise;
    };

    this.ReplacePriceModal = (datareq) => {
        var deferred = $q.defer();
        $uibModal.open({
            animation: true,
            size: 'xs',
            resolve: { data: () => { return datareq; } },
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/templates/ReplacePriceModal.html',
            controller: ($scope, data, $uibModalInstance) => {

                $scope.fob = $scope.caf = $scope.cif = 0;

                $scope.ChkChange = () => {
                    $scope.btnOk = angular.isNumber($scope.fob) && angular.isNumber($scope.caf) && angular.isNumber($scope.cif) && !(!$scope.fob && !$scope.caf && !$scope.cif);
                };
                $scope.ChkChange();

                $scope.ok = () => {
                    var dataRes = {
                        fob: $scope.fob
                        , caf: $scope.caf
                        , cif: $scope.cif
                    };
                    $uibModalInstance.close(dataRes);
                };
                $scope.cancel = () => { $uibModalInstance.dismiss('cancel'); };
            }
        }).result.then((data) => { deferred.resolve(data); }, () => { });
        return deferred.promise;
    };

});