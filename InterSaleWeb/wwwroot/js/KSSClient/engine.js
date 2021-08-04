//KSSClient = KSSClient || {};
KSSClient.Engine = KSSClient.Engine || {};
KSSClient.Engine.Common = KSSClient.Engine.Common || {};

KSSClient.Engine.Common.MapID = function (mapList, value) {
    if (angular.isUndefined(value) || value === '' || value === null) {
        return '';
    } else {
        var index = mapList.findIndex(function (a) { return a.id == value });
        if (!mapList[index]) return '';
        return mapList[index].view;
    }
};

KSSClient.Engine.Common.MapCode = function (mapList, value) {
    if (angular.isUndefined(value) || value === '' || value === null) {
        return '';
    } else {
        var index = mapList.findIndex(function (a) { return a.code == value });
        if (!mapList[index]) return '';
        return mapList[index].view;
    }
};

KSSClient.Engine.Common.CreateDateTime = function (str) {
    if (!str) {
        return '';
    } else {
        // yyyy-MM-dd hh:mm:ss
        try {
            var dt = str.split(' ');
            var d = dt[0] != undefined ? dt[0].split('-') : undefined;
            var t = dt[1] != undefined ? dt[1].split(':') : undefined;
            if (d && t) {
                //new Date(year, month, date, hours, minutes, seconds, ms)
                return new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]), parseInt(t[0]), parseInt(t[1]), parseInt(t[2]), 0);
            } else if (d) {
                //new Date(year, month, date, hours, minutes, seconds, ms)
                return new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]), 0, 0, 0, 0);
            } 
        } catch (err) {
            return '';
        }
        return '';
    }
};

KSSClient.Engine.Common.GetDateString = function (d) {
    var month = d.getMonth() + 1;
    var date = d.getDate();
    if (month < 10) { month = '0' + month; }
    if (date < 10) { date = '0' + date; }
    return d.getFullYear() + "-" + month + "-" + date;
};

KSSClient.Engine.Common.GetDateView = function (dt) {
    if (!dt) {
        return '';
    } else {
        //1/2/2012
        var d = dt.toLocaleDateString('en-US').split('/');
        //1/2/2012
        //var tmp = dt.toLocaleDateString('en-US').split('/');
        if (d.length != 0) {
            if (parseInt(d[0]) < 10) d[0] = '0' + d[0];
            if (parseInt(d[1]) < 10) d[1] = '0' + d[1];
            //if (d[2] != tmp[2]) d[2] = tmp[2];
        }
        //var year = d[2].toString();
        d = d[1] + '/' + d[0] + '/' + d[2].slice(2, 4);
        return d;
    }
};

KSSClient.Engine.Common.GetDateView2 = function (dt) {
    if (!dt) {
        return '';
    } else {
        //1/2/2012
        var d = dt.toLocaleDateString('en-US').split('/');
        //1/2/2012
        //var tmp = dt.toLocaleDateString('en-US').split('/');
        if (d.length != 0) {
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


KSSClient.Engine.Common.GetDateTimeView = function (dt) {
    if (!dt) {
        return '';
    } else {
        //1/2/2012
        var d = dt.toLocaleDateString('en-US').split('/');
        //1/2/2012
        //var tmp = dt.toLocaleDateString('en-US').split('/');
        if (d.length != 0) {
            if (parseInt(d[0]) < 10) d[0] = '0' + d[0];
            if (parseInt(d[1]) < 10) d[1] = '0' + d[1];
            //if (d[2] != tmp[2]) d[2] = tmp[2];
        }
        d = d[1] + '/' + d[0] + '/' + d[2].slice(2, 4);
        //15:47:55 GMT+0700
        var t = dt.toTimeString().split(':');
        if (t.length != 0) {
            t = t[0] + ":" + t[1] + ":" + t[2].charAt(0) + t[2].charAt(1);
        }
        return d + " " + t;
    }
};

KSSClient.Engine.Common.convertProductCodeToObject = function (code) {
    var datas = {};
    datas.twineFilamentSize = code.replace(/^([0-9]+).*$/g, '$1');
    datas.twineFilamentAmount = code.replace(/^[0-9]+[^0-9 ]([0-9]+).*$/g, '$1');
    datas.twineWord = code.replace(/^[0-9]+[^0-9 ]?[0-9]*[ ]([^0-9]+[^ ]*) [0-9.]+[*][0-9.]+[*][0-9.]+ .*$/g, '$1');
    datas.netEyeSize = code.replace(/^.* ([0-9.]+)[*][0-9.]+[*][0-9.]+ .*$/g, '$1');
    datas.netEyeAmount = code.replace(/^.* [0-9.]+[*]([0-9.]+)[*][0-9.]+ .*$/g, '$1');
    datas.netLength = code.replace(/^.* [0-9.]+[*][0-9.]+[*]([0-9.]+) .*$/g, '$1');
    datas.netKnotSerie = code.replace(/^.*[*][0-9.]+ ([^ ]+) .*$/g, '$1');
    datas.netSt = code.replace(/^.*[*][0-9.]+ [^ ]+ ([^ ]+) .*$/g, '$1');
    datas.netColor = code.replace(/^.* ([^ ]+)$/g, '$1');

    for (var i = 0; i < Object.keys(datas).length; i++) {
        var k = Object.keys(datas)[i];
        if (datas[k] == code) datas[k] = '';
        //console.log(k + ' = ' + datas[k]);
    }
    return datas;
}

KSSClient.Engine.Common.PriceToRest = function (price, percent, amount, inc_amount) {
    return ((price - (price * (percent / 100))) - amount) + inc_amount;
}

KSSClient.Engine.Common.GetMessage = function (error) {
    var str = "";
    for (var i = 0; i < error.length; i++) {
        var tmp = error[i].split("#");
        if (tmp.length > 1) {
            var tmp2 = tmp[0].split(":");
            if (tmp2.length == 2) {
                if (i == error.length - 1) str += tmp2[1].trim();
                else str += tmp2[1].trim() + ", <br/>";
            }
        }
        else {
            if (i == error.length - 1) str += error[i].trim();
            else str += error[i].trim() + ", <br/>";
        }
    }
    return str;
}

KSSClient.Engine.Common.GetMessage2 = function (error, data, index) {
    var str = "";
    var str_tmp = "";
    for (var i = 0; i < error.length; i++) {
        var tmp = error[i].split("#");
        if (tmp.length > 1) {
            var tmp2 = tmp[0].split(":");
            if (tmp2.length == 2) {
                str_tmp = tmp2[1].trim().split("{}");
                if (str_tmp.length == 2) {
                    var msg = str_tmp[1].split(",");

                    var msg2 = str_tmp[0] + "{ in db }" + str_tmp[1];

                    if (msg.length == 4) {
                        var twine = msg[0].trim().split(" - ");
                        if (twine.length == 2) {
                            twine[0] = twine[0].trim();
                            twine[1] = twine[1].trim();
                        }
                        var size = msg[1].trim().split(" - ");
                        if (size.length == 2) {
                            size[0] = parseFloat(size[0].trim());
                            size[1] = parseFloat(size[1].trim());
                        }
                        var amount = msg[2].trim().split(" - ");
                        if (amount.length == 2) {
                            amount[0] = parseFloat(amount[0].trim());
                            amount[1] = parseFloat(amount[1].trim());
                        }
                        var length = msg[3].trim().split(" - ");
                        if (length.length == 2) {
                            length[0] = parseFloat(length[0].trim());
                            length[1] = parseFloat(length[1].trim());
                        }
                        console.log(size);
                        for (var j = 13; j < index; j++) {                           
                            if (data[j][1] == twine[0] && data[j][2] == twine[1]
                                && data[j][3] == size[0] && data[j][4] == size[1]
                                && data[j][5] == amount[0] && data[j][6] == amount[1]
                                && data[j][7] == length[0] && data[j][8] == length[1]
                                && data[j][9] == data[index][9]
                                && data[j][10] == data[index][10]
                                && data[j][11] == data[index][11]
                                && data[j][12] == data[index][12]
                                ) {
                                msg2 = str_tmp[0] + "{ item: " + data[j][0] + " }" + str_tmp[1];
                                data[j][0] = { item: data[j][0], index: index };
                            }
                        }
                    }
                    if (i == error.length - 1) str += msg2.trim();
                    else str += msg2.trim() + ", <br/>";
                    
                } else {
                    if (i == error.length - 1) str += tmp2[1].trim();
                    else str += tmp2[1].trim() + ", <br/>";
                }
            }
        }
        else {
            if (i == error.length - 1) str += error[i].trim();
            else str += error[i].trim() + ", <br/>";
        }
    }

    return str;
}


KSSClient.Engine.Common.CreateTable = function (data, error = []) {
    function GetMessage(error, index) {
        var i = 0;
        for (i; i < error.length; i++) {
            if (error[i].index == index) {
                return error[i].message;
            }
        }
        return undefined;
    }
    var type = data[4][2].trim().toUpperCase();
    var productType = (data[1][2] + '').trim().toUpperCase();
    var table = "<table class='table table-bordered' style='margin-bottom:0;'>";  
    
    for (i = 0; i < data.length; i++) {
        //console.log(i + " : " + data[i].length);
        //var tmp = data[i][0]['item'] == undefined;
        //console.log(tmp);
        if (typeof data[i][0] === 'object') {
            table += "<tr class='bg-warning'>";
            data[i][0] = data[i][0].item;
        }
        else { table += "<tr>"; }
        for (j = 0; j <= data[12].length; j++) {
            //index = i + '_' + j;
            var errorx = error.length != 0 ? GetMessage(error, i) : undefined;
            if (j == data[12].length) {
                if (i == 0) { table += "<td class='bg-info align-center' style='min-width:190px;'>Error Message</td>" };
                if (errorx != undefined) {
                    if (i == 1) { table += "<td class='bg-danger' rowspan='4' class='align-center'>" + errorx + "</td>"; }
                    else if (i == 6) {
                        table += "<td class='bg-danger' rowspan='4' class='align-center'>" + errorx + "</td>";
                    }
                    else { table += "<td class='bg-danger' class='align-center'>" + errorx + "</td>"; }
                }
            }
            else if (i < 11) {
                if (j == 0) {
                    if (i == 5 || i == 8 || i == 10) {
                        table += "<td class='text-right'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                        table += "<td class='text-right'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    } else {
                        table += "<td colspan='2' class='bg-info text-right' style='min-width:130px;'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    }
                }
                else if (i == 9 && j > 2) {
                    if (j == 3) {
                        table += "<td colspan='" + (data[12].length - 3) + "' class='text-left'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    }
                }
                else if (j > 1) {
                    table += "<td class='align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                }
            }
            else if (i == 11) {
                if (j == 0) {
                    table += "<td rowspan='2' class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                } else if (type == 'C') {
                    if (j == 1) {
                        table += "<td rowspan='2' colspan='2' class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    } else if (j == 3 || j == 4) {
                        table += "<td rowspan='2' class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    } else if (j == 5) {
                        table += "<td colspan='2' class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    }
                } else if (type == 'R' && PRODUCT1.indexOf(productType) != -1) {
                    if (j == 1 || j == 3 || j == 5 || j == 7 || j == 13) {
                        table += "<td colspan='2' class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    } else if (j >= 9 && j <= 12) {
                        table += "<td rowspan='2' class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    } 
                } else if (type == 'R' && PRODUCT2.indexOf(productType) != -1) {
                    if (j == 1 || j == 3 || j == 7) {
                        table += "<td colspan='2' class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    } else if (j == 5 || j == 6) {
                        table += "<td rowspan='2' class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    }
                }
            }
            else if (i == 12) {
                if (j == 0);
                else if (type == 'C') {
                    if (j > 4) {
                        table += "<td class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    }
                } else if (type == 'R' && PRODUCT1.indexOf(productType) != -1) {
                    if ((j >= 1 && j <= 8) || j == 13 || j == 14) {
                        table += "<td class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    }
                } else if (type == 'R' && PRODUCT2.indexOf(productType) != -1) {
                    if ((j >= 1 && j <= 4) || j == 7 || j == 8) {
                        table += "<td class='bg-info align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    }
                }
                
            }
            else {
                if (j == 0) {
                    table += "<td class='align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                } else if (type == 'C') {
                    if (j == 1) {
                        table += "<td colspan='2' class='text-left'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    } else if (j == 3) {
                        table += "<td class='text-left'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    } else if (j >= 4) {
                        table += "<td class='align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    }
                } else if (type == 'R') {
                    if (PRODUCT2.indexOf(productType) != -1 && j == 4) {
                        table += "<td class='text-left'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    } else {
                        table += "<td class='align-center'>" + (data[i][j] == undefined ? "" : data[i][j]) + "</td>";
                    }
                }
            }
        }
        table += "</tr>";
    }
    
    table += "</table>";
    return table;
}

KSSClient.Engine.Common.ArrayToStringComma = function (arr, key) {
    var tmp = ''
    if (angular.isArray(arr)) {
        arr.forEach(function (v, i) {
            if (key) {
                if (arr.length - 1 == i) { tmp += v[key]; }
                else { tmp += v[key] + ', '; }
            } else {
                if (arr.length - 1 == i) { tmp += v; }
                else { tmp += v + ', '; }
            }

        });
    }
    return tmp;
}
/// Grid

//function fakeI18n(title) {
//    return 'col: ' + title;
//}

//KSSClient.Engine.Grid = KSSClient.Engine.Grid || {};
//KSSClient.Engine.Grid.CreateGrid = function (mSelect = undefined, expandable = false, header = null, menuCol = true, menuMain = true) {
//    var gridOpt = { enableCellEditOnFocus: true, enableRowSelection: true, enableRowHeaderSelection: false, /*showColumnFooter: true,*/ multiSelect: mSelect, enableColumnMenus: menuCol, enableGridMenu: menuMain, enableFiltering: false, gridMenuTitleFilter: fakeI18n };
//    if (expandable) {
//        gridOpt['expandableRowTemplate'] = '<div class="sub-grid" ui-grid="row.entity.subGridOpt" ui-grid-resize-columns ui-grid-auto-resize style="height:150px" ng-hide="row.entity.subGridOpt.data.length == 0" ng-style="{ height: row.entity.subGridOpt.height + \'px\'}"></div>';
//        //gridOpt['expandableRowTemplate'] = '<div class="sub-grid" ui-grid="row.entity.subGridOpt" ui-grid-resize-columns ui-grid-auto-resize style="height:150px" ng-hide="row.entity.subGridOpt.height == 0" ng-style="{ height: row.entity.subGridOpt.height + \'px\'}"></div>';

//        gridOpt['expandableRowHeight'] = '';
//        gridOpt['expandableRowScope'] = {
//            subGridVariable: 'subGridScopeVariable'
//        };
//    }

//    //gridOpt['enableSorting'] = false;

//    if (header != null) {
//        gridOpt['headerTemplate'] =
//            '<div role="rowgroup" class="ui-grid-header"><div class="ui-grid-top-panel"><div class="ui-grid-header-viewport"><div class="ui-grid-header-canvas"><div class="ui-grid-header-cell-wrapper" ng-style="colContainer.headerCellWrapperStyle()">' +
//            '<div role="row" class="ui-grid-header-cell-row">' +
//            '<div class="ui-grid-header-cell ui-grid-clearfix ui-grid-category" ng-repeat="cat in grid.options.category" ng-if="cat.visible && (colContainer.renderedColumns | filter:{ colDef:{category: cat.name} }).length>0">' +
//            '<div class="ui-grid-header-category" ng-if="cat.display != \'\'">{{ cat.display }}</div>' + 
//            '<div class="ui-grid-header-cell ui-grid-clearfix" ng-repeat="col in colContainer.renderedColumns | filter:{ colDef:{category: cat.name} }" ui-grid-header-cell col="col" render-index="$index"> </div></div>' +
//            '<div class="ui-grid-header-cell ui-grid-clearfix" ng-if="col.colDef.category === undefined" ng-repeat="col in colContainer.renderedColumns track by col.uid" ui-grid-header-cell col="col" render-index="$index"></div></div></div></div></div></div></div>';

//        gridOpt['category'] = header.category;
//    }
    
//    gridOpt.columnDefs = [];
//    if (mSelect != undefined) { 
//        var headRow = {
//            name: 'headRow', displayName: '', enableCellEdit: false, width: '30', pinnedLeft: true, allowCellFocus: false, enableSorting: false, enableColumnMenu: false, enableFiltering: false, enableHiding: false
//            //, footerCellTemplate: '<div class="ui-grid-cell-foot"><input type="button" ng-click="grid.appScope.AddRow()" value="+"/></div>'
//        };
//        var tmp = 'radio';
//        if (mSelect) {
//            tmp = 'checkbox';
//            headRow['headerCellTemplate'] = '<div class="ui-grid-cell-head"><input type="checkbox" ng-model="grid.appScope.chkAll" ng-click="grid.appScope.SelectAll()"></div>';
//        }
//        headRow['cellTemplate'] = '<div class="ui-grid-cell-head">' +
//            '<input type="' + tmp + '" ng-if="grid.appScope.cumulative(grid, row, col) && !row.isSelected"/>' +
//            '<input type="' + tmp + '" checked ng-if="grid.appScope.cumulative(grid, row, col) && row.isSelected"/>';
//            '<input type="button" value="x" ng-if="!grid.appScope.cumulative(grid, row, col)" ng-click="grid.appScope.RemoveRow(grid, row)"/></div>'
//        gridOpt.columnDefs.push(headRow);
//    }
//    return gridOpt;
//};

//KSSClient.Engine.Grid.AddColumn = function (name, title, focus = false, edit = false, width = '', cellFilter = '', type = [], setclass = '', category = '', sort = true, filter = true, hiding = true , pinning = '') {
//    var col = { name: name, displayName: title, headerTooltip: title, allowCellFocus: focus, enableSorting: sort, enableFiltering: filter, enableHiding: hiding };
//    if (width != '') {
//        if (width.min != undefined) {
//            col['minWidth'] = width.min;
//        }
//        if (width.max != undefined) {
//            col['maxWidth'] = width.max;
//        }
//        if (width.default != undefined) {
//            col['width'] = width.default;
//        }
//    }
//    if (edit) { col['cellEditableCondition'] = function ($scope) { return $scope.row.entity.isEdit; } } else { col['enableCellEdit'] = false }
//    if (cellFilter != '') { col['cellFilter'] = cellFilter; }
//    if (category != '') { col['category'] = category; }
//    //if (!hiding) { col['enableHiding'] = false; }
//    if (pinning != '') {
//        if (pinning == 'left') { col['pinnedLeft'] = true; }
//        else if (pinning == 'right') { col['pinnedRight'] = true; }
//    }

//    if (setclass != '') {
//        col['cellClass'] = setclass;
//    }

//    //col['headerCellTemplate'] = '<div role="columnheader" style="min-width:100px;" ng-class="{ \'sortable\': sortable } " ui-grid-one-bind-aria-labelledby-grid="col.uid + \'-header-text \' + col.uid + \'-sortdir-text\'" aria-sort="{{ col.sort.direction == asc ? \'ascending\' : (col.sort.direction == desc ? \'descending\' : (!col.sort.direction ? \'none\' : \'other\')) } } ">' +
//    //                            '<div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex" title="{{ col.headerTooltip(col) } } ">' +
//    //                            '<span class="ui-grid-header-cell-label" ui-grid-one-bind-id-grid="col.uid + \'-header-text\'">{{ col.displayName  }}</span> <span ui-grid-one-bind-id-grid="col.uid + \'-sortdir-text\'" ui-grid-visible="col.sort.direction" aria-label="{{ getSortDirectionAriaLabel() } } ">' +
//    //                            '<i ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction } " title="{{ isSortPriorityVisible() ? i18n.headerCell.priority + \' \' + (col.sort.priority + 1) : null } } " aria-hidden="true"></i> <sub ui-grid-visible="isSortPriorityVisible()" class="ui- grid - sort - priority - number">{{col.sort.priority + 1}}</sub></span></div>' +
//    //                            '<div role="button" tabindex="0" ui-grid-one-bind-id-grid="col.uid + \'-menu-button\'" class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader && col.colDef.enableColumnMenu !== false" ng-click="toggleMenu($event)" ng-keydown="headerCellArrowKeyDown($event)" ng-class="{\'ui-grid-column-menu-button-last-col\': isLastCol } " ui-grid-one-bind-aria-label="i18n.headerCell.aria.columnMenuButtonLabel" aria-haspopup="true"><i class="ui- grid - icon - angle - down" aria-hidden="true">&nbsp;</i></div>' +
//    //                            '<div ui-grid-filter></div></div>';
    
//    type.forEach(function (row, index) {
//        switch (row.type) {
//            case 'numRow':
//                col['cellTemplate'] = '<div class="ui-grid-cell-contents"><center>{{grid.appScope.cumulative(grid, row, col)}}</center></div>';
//                break;
//            case 'text':
//                col['cellTemplate'] = '<div class="ui-grid-cell-contents"><' + row.value1 + '>{{ COL_FIELD }}</' + row.value1 + '></div>';
//                break;
//            case 'dropdown':
//                col['editableCellTemplate'] = 'ui-grid/dropdownEditor';
//                col['editDropdownValueLabel'] = 'view';
//                col['editDropdownIdLabel'] = 'id';
//                if (edit) {
//                    col['footerCellTemplate'] = '<div class="ui-grid-footer-content">' +
//                        '<select ng-model="grid.appScope.' + row.value1 + '.select" ng-options="option.view for option in grid.appScope.' + row.value1 + '.list track by option.id"></select></div>';
//                }
//                break;
//            case 'date':
//                col['type'] = row.type;
//                col['cellTemplate'] = '<div class="ui-grid-cell-contents">' +
//                    '<div class="cellDate">{{grid.appScope.cumulative(grid, row, col)}}</div>' +
//                    '<div class="cellWarning" ng-if="grid.appScope.cumulative(grid, row, col, 1)" tooltip-placement="bottom-left" ' +
//                    'uib-tooltip="{{grid.appScope.cumulative(grid, row, col, 2)}}" ' +
//                    'tooltip-class="">!</div></div>';
//                if (edit) {
//                    col['footerCellTemplate'] = '<div class="ui-grid-footer-content"><input type="date" ng-model="grid.appScope.' + row.value1 + '"/></select></div>';
//                }
//                break;
//            case 'datetime':
//                col['cellTemplate'] = '<div class="ui-grid-cell-contents">{{grid.appScope.cumulative(grid, row, col)}}</div>';
//                break;
//            case 'autocomplete':
//                col['editableCellTemplate'] = '<div><form name="inputForm">' +
//                    '<input type="INPUT_TYPE" class="' + row.value1 + '" ng-keyup="grid.appScope.' + row.value1 + '.func(MODEL_COL_FIELD)" ng-class="\'colt\' + col.uid" ui-grid-editor list="{{grid.appScope.' + row.value1 +'.id}}" ng-model="MODEL_COL_FIELD">' +
//                    '</form></div>';
//                if (edit) {
//                    col['footerCellTemplate'] = '<div class="ui-grid-footer-content">' +
//                        '<input type="text" class="' + row.value1 + '" ng-keyup="grid.appScope.' + row.value1 + '.func()" list="{{grid.appScope.' + row.value1 + '.id}}" ng-model="grid.appScope.' + row.value1 + '.value">' +
//                        '<datalist id="{{grid.appScope.' + row.value1 + '.id}}"><option ng-repeat="opt in grid.appScope.' + row.value1 + '.list" value="{{opt.code}}">{{opt.descriptionsele}}</option></datalist></div>';
//                }
//                break;
//            case 'truefalse':
//                col['cellTemplate'] = '<div class="ui-grid-cell-contents">' +
//                    '<center><span class="glyphicon glyphicon-ok" ng-if="grid.appScope.cumulative(grid, row, col) == 1"></span>' +
//                    '<span class="glyphicon glyphicon-remove" ng-if="grid.appScope.cumulative(grid, row, col) == 2"></span></center></div>';
//                break;
//            case 'decimal':
//                col['cellTemplate'] = '<div class="ui-grid-cell-contents" style="text-align:right;">{{ COL_FIELD |decimalFormat: ' + row.value1 + ' }}</div>';
//                break;
//            default:
//                col['type'] = row.type;
//        }
//    });
//    return col;
//};
