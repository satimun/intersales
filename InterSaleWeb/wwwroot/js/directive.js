
app.directive('openExcel', function () {
    return {
        scope: { setdata: '&' },
        link: function (scope, elm, attrs) {
            elm.on('change', function (changeEvent) {
                var fileName = changeEvent.target.value.split('\\');
                var excel = {};
                excel.fileName = fileName[fileName.length - 1];
                excel.data = []
                var tmpData = [];
                try {
                    var rABS = true;
                    var f = changeEvent.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        try {
                            var data = e.target.result;
                            if (!rABS) data = new Uint8Array(data);
                            var wb = XLSX.read(data, { type: 'binary' });
                            excel.sheetNames = wb.SheetNames;
                            for (var i = 0; i < wb.SheetNames.length; i++) {
                                excel.data.push(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[i]], { header: 1, raw: true }));
                            }
                        } catch (err) {
                            alert(err.message);
                        }
                        scope.setdata()(excel);
                    };
                    if (rABS) reader.readAsBinaryString(f);
                    else reader.readAsArrayBuffer(f);
                } catch (err) {
                    //alert(err.message);
                }
                changeEvent.target.value = '';
            });
        }
    };
});

app.directive('windowsResize', function ($window) {
    return {
        link: link,
        restrict: 'AE'
    };
    function link(scope, element, attrs) {

        scope.width = $window.innertWidth;
        scope.height = $window.innerHeight;

        function onResize() {
            // uncomment for only fire when $window.innerWidth change   
            if (scope.width !== $window.innerWidth) {
                scope.width = $window.innerWidth;
                scope.$digest();
            }
            if (scope.height !== $window.innerHeight) {
                scope.height = $window.innerHeight;
                scope.$digest();
            }
        };

        function cleanUp() {
            angular.element($window).off('resize', onResize);
        }

        angular.element($window).on('resize', onResize);
        angular.element($window).on('load', onResize);
        scope.$on('$destroy', cleanUp);
    }
});

app.directive('elementResize', function ($window) {
    return {
        link: link,
        restrict: 'AE'
    };
    function link(scope, element, attrs) {

        scope.elementWidth = element[0].offsetWidth;
        scope.elementHeight = element[0].offsetHeight;
        scope.multi = 1;
        function onResize() {
            if ($window.innerWidth < 768) { scope.multi = 0; }
            else { scope.multi = 1; }

            // uncomment for only fire when $window.innerWidth change   
            if (scope.elementWidth !== element[0].offsetWidth) {
                scope.elementWidth = element[0].offsetWidth;
                scope.$digest();
            }

            if (scope.elementHeight !== element[0].offsetHeight) {
                scope.elementHeight = element[0].offsetHeight;
                scope.$digest();
            }
        };

        function cleanUp() {
            angular.element($window).off('resize', onResize);
        }

        angular.element($window).on('resize', onResize);
        angular.element($window).on('load', onResize);
        scope.$on('$destroy', cleanUp);
    }
});

app.directive('kssAutocomplete', function ($filter) {
    return {
        restrict: 'AE',
        require: '^ngModel',
        template: '<datalist id="{{id}}"><option ng-repeat="opt in list | filter: val | limitTo: limit" value="{{opt.view}}">{{opt.subview}}</option></datalist>' +
                  '<input ng-class="{ \'has-error\': error }" type="text" ng-click="Click()" ng-blur="OutFocus()" class="form-control" placeholder="{{placeholder}}" list="{{id}}" style="{{stylex}}" autocomplete="on" ng-model="val" ng-disabled="disabled"/>',
        replace: false,
        scope: {
            id: '='
            , list: '='
            , placeholder: '='
            , limit: '='
            , stylex: '='
            , ngModel: '='
            , ngChange: '&'
            , notnull: '=?'
            , error: '=?'
            , disabled: '=?'
        }
        , link: function (scope, element, attrs, ngModel) {
            var id = '';
            var oldID = 0;
            scope.error = false;
            scope.oldVal = '';
            scope.OutFocus = function () {
                if (!scope.val && !id) { scope.val = scope.oldVal; }
                if (id && !angular.isArray(id)) { scope.val = $filter('filter')(scope.list, { 'id': id }, true)[0].view; }
            };
            scope.Click = function () {
                if (scope.val || !scope.notnull) { scope.oldVal = scope.val; }
                if (!scope.list.length) scope.oldVal = '';
                scope.val = '';
            };
            scope.change = (val) => {
                var tmp = scope.list.filter(v => v.view == val);
                if (val) { scope.error = true; } else { if (scope.notnull) scope.error = true; else scope.error = false; }
                if (angular.isArray(tmp)) {
                    if (tmp.length === 1 && scope.val !== '') {
                        scope.error = false;
                        if (id !== tmp[0].id) {
                            scope.val = tmp[0].view;
                        }
                        id = tmp[0].id;
                    } else { id = ''; }
                } else { id = ''; }
                try {
                    if (id !== oldID) {
                        scope.ngChange()(id);
                        oldID = id;
                    }
                    if (!id && scope.notnull) { scope.error = true; }
                    else { scope.error = false; }
                } catch (ex) { ex; }
            };
            scope.$watch('ngModel', function (val, old) {
                scope.val = val;
                scope.change(val);
            });

            scope.$watch('val', function (val, old) {
                ngModel.$setViewValue(val);
                scope.change(val);
            });

            scope.$watch('list', (val, old) => {
                if (angular.isArray(val)) {
                    if (!val.length && scope.notnull) scope.error = true;
                }
            });
        }
    };
});

app.directive('kssPatternDate', function () {
    return {
        restrict: 'AE',
        require: '^ngModel',
        template: '<input ng-class="{\'has-error\': error}" type="text" class="form-control" style="{{stylex}}" placeholder="{{placeholder}}" ng-keyup="change($event)" ng-model="val" />',
        replace: false,
        scope: {
            placeholder: '@'
            , stylex: '@'
            , ngModel: '='
            , ngChange: '&'
        }
        , link: function (scope, element, attrs, ngModel) {
            var pattern = /^[0-9]{2}\/[0-9]{4}$/;
            scope.change = function (e) {
                //if (scope.val) {
                //    if (scope.val.length == 2 && e.keyCode != 8) {
                //        scope.val = scope.val + '/';
                //    } else if (scope.val.length > 2 && e.keyCode != 8) {
                //        if (scope.val[2] != '/') {
                //            scope.val = scope.val[0] + scope.val[1] + '/' + scope.val.slice(2);
                //        }
                //    }
                //}
                scope.SetVal();
            }

            scope.SetVal = function () {
                result = scope.val;
                if (pattern.test(scope.val)) {
                    var tmp = scope.val.split("/");
                    if (tmp.length) {
                        if (parseInt(tmp[0]) > 12) {
                            scope.error = true;
                            scope.ngChange()(undefined);
                        } else {
                            scope.error = false;
                            scope.ngChange()(result);
                        }
                    }
                } else {
                    scope.error = true;
                    scope.ngChange()(undefined);
                }
                ngModel.$setViewValue(result);
            }

            var result = '';
            scope.$watch('ngModel', function (val, old) {
                scope.val = val;
                scope.SetVal();
            });
            
        }
    };
});

app.directive('kssPatternInput', function () {
    return {
        restrict: 'AE',
        require: '^ngModel',
        template: '<input ng-class="{\'has-error\': error}" type="text" class="form-control" style="{{stylex}}" placeholder="{{placeholder}}" ng-change="change(val)" maxlength="{{maxlength}}" ng-pattern="pattern" ng-model="val" ng-disabled="disabled" />',
        replace: false,
        scope: {
            placeholder: '@'
            , stylex: '@'
            , ngModel: '='
            , ngChange: '&'
            , pattern: '@'
            , maxlength: '@'
            , notnull: '=?'
            , error: '=?'
            , ngKeyup: '&?'
            , disabled: '=?'
        }
        , link: function (scope, element, attrs, ngModel) {
            scope.val = scope.ngModel;
            scope.change = (val) => {
                scope.SetVal(val);
            };
            scope.SetVal = (val, ac) => {
                if (angular.isUndefined(val) || val === '' && scope.notnull) { scope.error = true; }
                else {
                    scope.error = false;
                    if (ac) scope.ngChange()(val);
                }
                if (angular.isFunction(scope.ngKeyup)) scope.ngKeyup()(val, scope.error);
                ngModel.$setViewValue(val);
            };
            scope.$watch('ngModel', function (val, old) {
                scope.val = val;
                scope.SetVal(val, true);
            });

        }
    };
});

app.directive('gridAutocomplete', function ($filter) {
    return {
        restrict: 'AE',
        require: '^ngModel',
        template: '<datalist id="{{id}}"><option ng-repeat="opt in list | filter: filter | limitTo: limit" value="{{opt.view}}">{{opt.subview}}</option></datalist>' +
        '<input ng-class="{ \'has-error\': error }" type="INPUT_TYPE" ng-class="\'colt\' + col.uid" ui-grid-editor placeholder="{{placeholder}}" list="{{id}}" style="{{stylex}}" autocomplete="on" ng-model="val"/>',
        replace: false,
        scope: {
            id: '@'
            , list: '='
            , placeholder: '='
            , limit: '='
            , stylex: '@'
            , ngModel: '='
            , ngChange: '&'
        }
        , link: function (scope, element, attrs, ngModel) {
            var id = 0;
            var oldID = 0;
            scope.error = false;
            scope.$watch('ngModel', function (val, old) {
                var tmp = $filter('filter')(scope.list, { 'view': val });
                if (val) { scope.error = true; }
                else { scope.error = false; }
                if (angular.isArray(tmp)) {
                    if (tmp.length === 1) {
                        if (id !== tmp[0].id) {
                            scope.error = false;
                            scope.val = tmp[0].view;
                        }
                        id = tmp[0].id;
                    } else { id = 0; }
                } else { id = 0; }
                try {
                    if (id !== oldID) {
                        scope.ngChange()(id);
                        oldID = id;
                    }
                } catch (ex) { }
            });

            scope.$watch('val', function (val, old) {
                ngModel.$setViewValue(val);
            });
        }
    };
});

//app.directive('ngDatalist', function () {
//    return {
//        restrict: 'AE',
//        require: '?ngModel',
//        template: '<input type="text" list="{{list.id}}" ng-model="choosen"><datalist id="{{list.id}}"><option ng-repeat="opt in list.list" value="{{opt.code}}">{{opt.descriptionsele}}</option></datalist>',
//        replace: false,
//        scope: {
//            list: '='
//        }
//        ,link: function (scope, element, attrs, ngModel) {
//            if (!ngModel) return;
//            scope.choosen = '';
//            scope.$watch('choosen', function (val, old) {
//                ngModel.$setViewValue(val);
//            });
//        }
//    };
//});

app.directive('uiGridCellSelection', function ($compile) {
    return {
        require: 'uiGrid',
        link: function (scope, element, attrs, uiGridCtrl) {
            // Taken from cellNav
            //add an element with no dimensions that can be used to set focus and capture keystrokes
            var gridApi = uiGridCtrl.grid.api
            var focuser = $compile('<div class="ui-grid-focuser" tabindex="-1"></div>')(scope);
            element.append(focuser);

            uiGridCtrl.focus = function () {
                focuser[0].focus();
            };


            gridApi.cellNav.on.viewPortKeyDown(scope, function (e) {
                if ((e.keyCode === 99 || e.keyCode === 67) && e.ctrlKey) {
                    var cells = gridApi.cellNav.getCurrentSelection();
                    var copyString = '',
                        rowId = cells[0].row.uid;
                    angular.forEach(cells, function (cell) {
                        if (cell.row.uid !== rowId) {
                            copyString += '\n';
                            rowId = cell.row.uid;
                        }
                        if (angular.isArray(gridApi.grid.getCellValue(cell.row, cell.col))) {
                            copyString += gridApi.grid.getCellValue(cell.row, cell.col).join();
                        } else {
                            copyString += gridApi.grid.getCellValue(cell.row, cell.col).toString();
                        }
                        
                    })
                    // Yes, this should be build into a directive, but this is a quick and dirty example.
                    var textArea = document.getElementById("grid-clipboard");
                    textArea.value = copyString;
                    textArea = document.getElementById("grid-clipboard").select();
                }
            })
            focuser.on('keyup', function (e) {
            })
        }
    }
});

app.directive('uiGridClipboard', function () {
    return {
        template: '<textarea id="grid-clipboard" ng-model="uiGridClipBoardContents"></textarea>',
        replace: true,
        link: function (scope, element, attrs) {
            // Obviously this needs to be hidden better (probably a z-index, and positioned behind something opaque)
            element.css('position', 'absolute');
            element.css('overflow', 'hidden');
            element.css('left', '-10px');
            element.css('height', '1px');
            element.css('width', '1px');
            element.css('resize', 'none');
        }
    };
});

app.directive('dateCustom', function ($timeout) {
    return {
        restrict: 'AE',
        require: '^ngModel', //style="text-indent:-500px;"
        template: '<div style="{{style}}"><input type="date" ng-blur="Change(d1)" input-focus="fd1" min={{min}} max={{max}} class="form-control" style="{{style}}" ng-model="d1" ng-change="Change(d1)" ng-show="sd1"/>' +
                  '<input type="text" class="form-control" placeholder="dd/MM/yyyy" ng-model="d2" ng-click="Click()" input-focus="fd2" style="{{style}}" ng-show="sd2" ng-disabled="disabled"/></div>',
        replace: false,
        scope: {
            style: '@'
            , ngModel: '='
            , ngChange: '&'
            , disabled: '='
            , min: '@'
            , max: '@'
        }
        , link: function (scope, element, attrs, ngModel) {
            var GetDateString = function (d) {
                if (angular.isDate(d)) {
                    var month = d.getMonth() + 1;
                    var date = d.getDate();
                    if (month < 10) { month = '0' + month; }
                    if (date < 10) { date = '0' + date; }
                    return date + "/" + month + "/" + d.getFullYear();
                }
            };

            scope.sd1 = false;
            scope.sd2 = true;

            scope.Change = function (d) {
                scope.d2 = GetDateString(d);
                scope.sd1 = false;
                scope.fd2 = true;
                $timeout(function () {
                    scope.sd2 = true;
                }, 0);
            };

            scope.Click = function () {
                scope.sd2 = false;
                scope.fd1 = true;
                $timeout(function () {
                    scope.sd1 = true;
                }, 0);
            };

            scope.$watch('ngModel', function (val, old) {
                scope.d1 = val;
                scope.d2 = GetDateString(val);
                scope.ngChange()(val);
            });

            scope.$watch('d1', function (val, old) {
                ngModel.$setViewValue(val);
            });
        }
    };
});

app.directive('inputFocus', function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.inputFocus);
            scope.$watch(model, function (value) {
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
            // on blur event:
            element.bind('blur', function () {
                scope.$apply(model.assign(scope, false));
            });
        }
    };
});
