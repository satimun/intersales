
app.controller("AppCtrl", function ($scope, $rootScope, $location, $filter, $window, $timeout, $q, common, oauth, $uibModal, $interval, $templateCache, Fullscreen) {

    if (select_mode === 1) {
        $rootScope.IP_URL = "http://localhost:8736/";
        $rootScope.SSO_URL = "http://localhost:2243/";
        $rootScope.IP_DB = "191.20.2.3 > smartsales_dev > ";
        $scope.dev = true;
    } else if (select_mode === 2) {
        $rootScope.IP_URL = "https://intersalesdev.kkfnets.com/";
        $rootScope.SSO_URL = "https://singlesignon.kkfnets.com/";
        $rootScope.IP_DB = "191.20.2.3 > smartsales_dev > ";
        $scope.dev = true;
    } else if (select_mode === 3) {
        $rootScope.IP_URL = "https://intersales.kkfnets.com/";
        $rootScope.SSO_URL = "https://singlesignon.kkfnets.com/";
        $rootScope.IP_DB = "191.20.2.3 > smartsales > ";
    }

    $scope.footerText = 'KIG 2018';
    $rootScope.login = false;

    $rootScope.isCollapsed = false;
    $scope.Collapsed = function () {
        $rootScope.isCollapsed = !$rootScope.isCollapsed;
    };

    var d = new Date();
    if (d.toLocaleDateString('en-US') === d.toLocaleDateString()) $rootScope.dateFormat = 'MM/dd/yyyy';
    else $rootScope.dateFormat = 'dd/MM/yyyy';


    // Clear Cache
    if (version !== app.info().version) {
        $templateCache.removeAll();
    }

    $scope.menu = {
        SALES: {
            label: "Sales",
            langcode: "BTN_SALE",
            active: false,
            href: "/sales",
            icon: "glyphicon-briefcase",
            group:
            {
                SALESREPORT: {
                    label: "Report",
                    langcode: "MNG_SALESREPORT",
                    active: false,
                    list: {
                        SALES_SALESREPORT_PIVSFORECAST: {
                            label: "PI Vs Forecast Report",
                            langcode: "MN_SALESREPORT_PIVSFORECASTREPORT",
                            href: "/sales/salesreport/pivsforecastreport"
                        },
                        SALES_SALESREPORT_ORDERONHAND: {
                            label: "Order Onhand Report",
                            langcode: "MN_SALESREPORT_ORDERONHAND",
                            href: "/sales/salesreport/orderonhandreport"
                        },
                        SALES_SALESREPORT_INVTURNOVER: {
                            label: "Inventory Turnover Ratio Report",
                            langcode: "MN_SALESREPORT_INVTurOVERREPORT",
                            href: "/sales/salesreport/invturnoverreport"
                        },
                        SALES_SALESREPORT_PIBYITEMS: {
                            label: "CI by items Report",
                            langcode: "MN_SALESREPORT_PIBYITEMSREPORT",
                            href: "/sales/salesreport/cibyitemsreport"
                        },
                    }
                }
            }
        },
        PLAN: {
            label: "Plan",
            langcode: "BTN_PLAN",
            active: false,
            href: "/plan",
            icon: "glyphicon-tasks",
            group:
            {
                SHIPMENT: {
                    label: "Shipment",
                    langcode: "MNG_SHIPMENT",
                    active: false,
                    list: {
                        PLAN_SHIPMENT_PLANLIST: {
                            label: "Planlist",
                            langcode: "MN_SHIPMENT_PLANLIST",
                            href: "/plan/shipment/planlist"
                        }
                        , PLAN_SHIPMENT_APPROVE1: {
                            label: "Send To Approve",
                            langcode: "MN_SHIPMENT_APPROVE1",
                            href: "/plan/shipment/approve/1"
                        }
                        , PLAN_SHIPMENT_APPROVE2: {
                            label: "Regional Approve",
                            langcode: "MN_SHIPMENT_APPROVE2",
                            href: "/plan/shipment/approve/2"
                        }
                        , PLAN_SHIPMENT_APPROVE3: {
                            label: "Manager Approve",
                            langcode: "MN_SHIPMENT_APPROVE3",
                            href: "/plan/shipment/mng_approve"
                        }
                        , PLAN_SHIPMENT_BOOKINGTRANSPORT: {
                            label: "Mark Booking Transport",
                            langcode: "MN_SHIPMENT_BOOKINGTRANSPORT",
                            href: "/plan/shipment/markbookingtransport/"
                        }
                        , PLAN_SHIPMENT_REMARK: {
                            label: "Shipment Plan Remark",
                            langcode: "MN_SHIPMENT_REMARK",
                            href: "/plan/shipment/remark/"
                        }
                        , PLAN_SHIPMENT_REPORT: {
                            label: "Shipment Plan Report",
                            langcode: "MN_SHIPMENT_REPORT",
                            href: "/plan/shipment/report/"
                        }
                        , PLAN_SHIPMENT_PLANFAIL: {
                            label: "Unfulfilled Shipment Report",
                            langcode: "MN_SHIPMENT_PLANFAIL",
                            href: "/plan/shipment/planfailreport/"
                        }
                        , PLAN_SHIPMENT_PLANVSAC: {
                            label: "Shipment Plan vs Actual Shipment Report",
                            langcode: "MN_SHIPMENT_PLANVSAC",
                            href: "/plan/shipment/planvsactualreport/"
                        }
                        , PLAN_SHIPMENT_SUMMARYREPORT: {
                            label: "Shipment Plan Summary Report",
                            langcode: "MN_SHIPMENT_SUMMARYREPORT",
                            href: "/plan/shipment/summaryreport/"
                        }
                        , PLAN_SHIPMENT_DELIVERYREPORT: {
                            label: "Shipment Plan KPI % Delivery Report",
                            langcode: "MN_SHIPMENT_DELIVERYREPORT",
                            href: "/plan/shipment/deliveryreport/"
                        }
                        , PLAN_SHIPMENT_FORECAST: {
                            label: "Comparison Report (Forecast vs Shipment Plan vs Actual)",
                            langcode: "MN_SHIPMENT_FORECAST",
                            href: "/plan/shipment/forecastcompare/"
                        }
                    }
                }
            }
        },
        SETUP: {
            label: "Setup",
            langcode: "BTN_SETUP",
            active: false,
            href: "/setup",
            icon: "glyphicon-cog",
            group:
            {
                COST: {
                    label: "ตารางราคากลาง & ส่วนลด",
                    langcode: "MNG_COST",
                    active: false,
                    list: {
                        SETUP_COST_PRICESTD: {
                            label: "ตารางราคากลาง",
                            langcode: "MN_PRICESTD",
                            href: "/setup/cost/pricestd"
                        },
                        SETUP_COST_DISCOUNTSTD: {
                            label: "ตารางราคาส่วนลด",
                            langcode: "MN_DISCOUNTSTD",
                            href: "/setup/cost/discountstd"
                        },
                        SETUP_COST_PRICEAPPROVAL: {
                            label: "อนุมัติตารางราคากลาง",
                            langcode: "MN_PRICEAPPROVAL",
                            href: "/setup/cost/priceapproval"
                        },
                        SETUP_COST_DISCOUNTAPPROVAL: {
                            label: "อนุมัติตารางส่วนลด",
                            langcode: "MN_DISCOUNTAPPROVAL",
                            href: "/setup/cost/discountapproval"
                        }
                    }
                },
                CUSTOMER: {
                    label: "ลูกค้า",
                    langcode: "MNG_CUSTOMER",
                    active: false,
                    list: {
                        SETUP_CUSTOMER_CUSTOMERGROUP: {
                            label: "กลุ่มลูกค้า",
                            langcode: "MN_CUSTOMERGROUP",
                            href: "/setup/customer/customergroup"
                        },
                        SETUP_CUSTOMER_COUNTRYGROUP: {
                            label: "กลุ่มประเทศ",
                            langcode: "MN_COUNTRYGROUP",
                            href: "/setup/customer/countrygroup"
                        },
                        SETUP_CUSTOMER_PORTLOADING: {
                            label: "Port of Loading",
                            langcode: "MN_PORTLOADING",
                            href: "/setup/customer/portloading"
                        },
                        SETUP_CUSTOMER_SHIPPINGDATE: {
                            label: "รอบการส่ง",
                            langcode: "MN_SHIPPINGDATE",
                            href: "/setup/customer/shippingdate"
                        }
                    }
                },
                DEFAULT: {
                    label: "ค่าเริ่มต้น",
                    langcode: "MNG_DEFAULT",
                    active: false,
                    list: {
                        SETUP_DEFAULT_KPIAVGPERIODDAY: {
                            label: "KPI Avg. Period Day",
                            langcode: "MN_KPIAVGPERIODDAY",
                            href: "/setup/default/kpiavgperiodday"
                        }
                    }
                },
                TEXTDISPLAY: {
                    label: "ข้อความ และการแสดงผล",
                    langcode: "MNG_TEXTDISPLAY",
                    active: false,
                    list: {
                        SETUP_TEXTDISPLAY_SETREMARK: {
                            label: "กำหนดหมายเหตุ",
                            langcode: "MN_SETREMARK",
                            href: "/setup/textdisplay/setremark"
                        }
                    }
                }
            }
        }
    };

    $scope.ModeAction = function (key) {
        key = (key !== undefined ? key.toUpperCase() : undefined);
        var k = Object.keys($scope.menu);
        k.forEach(function (v) {
            if (v === key) { $scope.mode = key; $scope.menu[v].active = true; }
            else { $scope.menu[v].active = false; }
        });
    };
    $scope.ModeAction($location.path().split('/')[1]);

    $scope.MenuAction = function (obj) {
        obj.active = !obj.active;
    };
    var mainPage = $location.path().split('/')[1];
    var menuGroup = $location.path().split('/')[2];
    if (menuGroup) {
        mainPage = mainPage.toUpperCase();
        menuGroup = menuGroup.toUpperCase();
        $scope.MenuAction($scope.menu[mainPage]['group'][menuGroup]);
    }

    $scope.isActive = function (location) {
        return location === $location.path();
    };

    $rootScope.backUrl = $location.url();
    KSSClient.API.Oauth.Token = common.getCookie('Token');
    $rootScope.username = window.localStorage.getItem('username');

    if (!RegExp("^/login", "g").test($location.url()) && !RegExp("^/singlesignon", "g").test($location.url())) {
        oauth.getTokenState();
    }

    $rootScope.lang = window.localStorage.getItem('lang');

    $scope.lang = [];
    $scope.langSel = {};

    KSSClient.API.Language.ListLanguage({
        data: {},
        callback: function (res) {
            $scope.lang = res.data.languages;
            if ($scope.lang.length > 0) {
                if ($rootScope.lang === undefined) {
                    //$localStorage['lang'] = $scope.lang[0].code;
                    window.localStorage.setItem('lang', $scope.lang[0].code);
                }
                $scope.langSel = $scope.lang[0];
            }
            $scope.GetLang();
            $scope.$apply();
        },
        error: function (res) {
            //common.AlertMessage("Error", res.message);
        }
    });

    $scope.ChangeLang = function (code) {
        //$localStorage['lang'] = code;
        if ($scope.langSel.code !== code) {
            $window.location.href = $rootScope.backUrl;
        }
    };

    $scope.GetLang = function () {
        if (window.localStorage.getItem('lang')/*$localStorage['lang']*/) {
            $scope.langSel = angular.copy($filter('filter')($scope.lang, { 'code': window.localStorage.getItem('lang')/*$localStorage['lang']*/ }, true)[0]);
        } else {
            if ($scope.lang.length > 0) {
                $scope.langSel = angular.copy($scope.lang[0]);
            }
            else {
                $scope.langSel = [];
            }
        }

    };

    $scope.$on('$viewContentLoaded', function (event) {

        $rootScope.isCollapsed = $scope.width <= 1024;

        if (!RegExp("^/singlesignon", "g").test($location.url())) { $rootScope.backUrl = $location.url(); }
        $timeout(function () {
            if (!RegExp("^/login", "g").test($location.url()) && !RegExp("^/singlesignon", "g").test($location.url())) {
                oauth.GetToken();
            }
        }, 1);

        // cancel shipment status loading
        $interval.cancel($rootScope.ShipmentPlanGetStatus);
        // set language
        $rootScope.lang = window.localStorage.getItem('lang');//$localStorage['lang'];
        $scope.GetLang();
        if ($rootScope.lang) {
            var group = "0";
            var sel = document.querySelectorAll('[lang-group]');
            sel.forEach(function (value) {
                group = value.getAttribute('lang-group');
            });
            common.LoadLang(group);
        }
    });

    //$scope.ReloadStaticValue = function () {
    //    common.ReloadStaticValue();
    //}

    $scope.LogOut = function () {
        oauth.LogOut();
    };

    $scope.ChangePass = function (parentSelector) {
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalChangePassCtrl',
            size: 'xs',
            appendTo: parentElem,
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'ModalChangePassContent.html'
        });

        modalInstance.result.then(function () {
            $scope.LogOut();
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $rootScope.ModalHelp = (containHtml) => {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalHelpCtrl',
            size: 'md',
            appendTo: undefined,
            resolve: {
                contains: () => { return containHtml; }
            },
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'helpContent.html'
        });
        modalInstance.result.then((data) => { }, () => { });
    };

    $scope.FullScreenAction = () => {
        if (Fullscreen.isEnabled()) { Fullscreen.cancel(); }
        else { Fullscreen.all(); }
    };

    $scope.smScreen = false;

    $scope.$watch('width', (val) => {
        $scope.smScreen = val <= 1015;
        $rootScope.isCollapsed = val <= 1024;
    });

    $scope.TabAction = (val) => {
        $rootScope.isCollapsed = val;
    };

});

app.controller('ModalChangePassCtrl', function ($scope, common, $uibModalInstance, API) {

    $scope.errOld = false;
    $scope.errNew = false;
    $scope.errMatch = false;

    $scope.oldPass = '';
    $scope.newPass = '';
    $scope.matchPass = '';

    $scope.Ok = function () {
        var chk = true;
        if ($scope.oldPass === '') {
            chk = false; $scope.errOld = true;
        }
        if ($scope.newPass === '') {
            chk = false; $scope.errNew = true;
        }
        if ($scope.matchPass === '') {
            chk = false; $scope.errMatch = true;
        }
        if (chk) {
            API.Oauth.ChangePassword({
                data: { oldPass: $scope.oldPass, newPass: $scope.newPass, matchPass: $scope.matchPass },
                callback: function (res) {
                    common.AlertMessage("Success", '');
                    $uibModalInstance.close();
                },
                error: function (res) {
                    $scope.errOld = false;
                    $scope.errMatch = false;
                    $scope.errNew = false;
                    var tmp = res.message.split(':');
                    if (tmp[0] === '01') {
                        $scope.errOld = true;
                    } else if (tmp[0] === '02') {
                        $scope.errMatch = true;
                    }
                    common.AlertMessage("Error", res.message);
                }
            });
        }
    };

    $scope.Cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ModalHelpCtrl', function ($scope, $sce, contains, $uibModalInstance) {
    //contains.forEach((d) => {
    //    d.html = $sce.trustAsHtml(d.html);
    //});
    $scope.contains = contains;

    $scope.Cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ModalRemarkPopupCtrl', function ($scope, common, $uibModalInstance, $filter) {

    $scope.gridOpt = common.CreateGrid2({ mSelect: false, footer: true });
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'code', display: 'Code', width: { default: 80 } }));
    $scope.gridOpt.columnDefs.push(common.AddColumn2({ name: 'description', display: 'Description', width: { min: 150 } }));

    $scope.cumulative = function (grid, myRow, myCol) {
        if (grid.id === $scope.gridApi.grid.id) {
            if (myCol.field === "headRow") { return true; }
        }
        return false
    };

    // load Remark Group List
    $scope.remarkGroups = [];
    $scope.remarkGroupList = [];
    KSSClient.API.Remark.SearchGroup({
        data: { groupTypes: ['T'], status: ['A'] },
        callback: function (res) {
            res.data.remarkGroups.forEach(function (v) {
                $scope.remarkGroupList.push({ id: v.id, code: v.code, text: common.GetCodeDescription(v) });
            });
            $scope.$apply();
        },
        error: function (res) {
            common.AlertMessage("Error", res.message);
        }
    });
    // set LoadRemark Group
    $scope.LoadRemarkGroup = function (query) {
        return $filter('filter')($scope.remarkGroupList, { 'text': query });
    };

    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        //common.GridRegisterOption(gridApi, $scope, 'grid_manage06');
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) { $scope.btnOk = true; }
            else { $scope.btnOk = false; }
        });
        $scope.LoadData();
    };

    $scope.LoadData = function () {
        var remarkGroupIDs = [];
        $scope.remarkGroups.forEach(function (v) {
            remarkGroupIDs.push(v.id);
        });

        KSSClient.API.Remark.Search({
            data: { groupTypes: ['T'], remarkGroupIDs: remarkGroupIDs, status: ['A'] },
            callback: function (res) {
                $scope.gridOpt.data = res.data.remarks;
                $scope.gridApi.grid.refresh();
            },
            error: function (res) { common.AlertMessage("Error", res.message); }
        });

    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.gridApi.selection.getSelectedRows()[0]);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
