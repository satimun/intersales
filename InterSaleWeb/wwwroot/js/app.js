/*----------- val -------------*/

const PRODUCT1 = 'MTNLIKUPH'; //อวนชั้นเดียว_อวนหลายชั้น อวนสำเร็จรูป
const PRODUCT2 = 'XVYWJ'; //เอ็น และเส้นด้าย

var backUrl = "/";

var app = angular.module("App",
    ["ngRoute"
        /*, "ngAnimate"*/, "ngSanitize", "ui.bootstrap"
        , "ngTouch", "ui.grid", "ui.grid.edit", "ui.grid.cellNav", "ui.grid.pagination", "ui.grid.selection", "ui.grid.resizeColumns", "ui.grid.pinning", "ui.grid.expandable", "ui.grid.autoResize", "ui.grid.moveColumns", "ui.grid.grouping"
        , "ui.grid.exporter"
        //, "ngCookies"
        , "ngTagsInput"
        , "ngStorage"
        , "dndLists"
        , 'FBAngular'
        //, "angularResizable"
    ]);

app.info({ version: version });

app.config(function ($routeProvider, $locationProvider) {
    
    $routeProvider
        .when("/", {
            templateUrl: "/pages/Home/home.html?v=" + version
            , controller: "homeController"
        })
        .when("/setup", {
            templateUrl: "/pages/Setup/setup.html?v=" + version
            , controller: "setupController"
        })
        .when("/setup/cost/pricestd", {
            templateUrl: "/pages/Setup/Cost/PriceStd/pricestd.html?v=" + version
            , controller: "priceStdController"
        })
        .when("/setup/cost/discountstd", {
            templateUrl: "/pages/Setup/Cost/DiscountStd/discountstd.html?v=" + version
            , controller: "discountStdController"
        })
        .when("/setup/cost/priceapproval", {
            templateUrl: "/pages/Setup/Cost/PriceApproval/priceapproval.html?v=" + version
            , controller: "PriceApprovalCtrl"
        })
        .when("/setup/cost/discountapproval", {
            templateUrl: "/pages/Setup/Cost/DiscountApproval/discountapproval.html?v=" + version
            , controller: "DiscountApprovalCtrl"
        })

        .when("/setup/customer/customergroup", {
            templateUrl: "/pages/Setup/Customer/CustomerGroup/CustomerGroup.html?v=" + version
            , controller: "CustomerGroupController"
        })
        .when("/setup/customer/countrygroup", {
            templateUrl: "/pages/setup/Customer/CountryGroup/countrygroup.html?v=" + version
            , controller: "countrygroupController"
        })
        .when("/setup/customer/shippingdate", {
            templateUrl: "/pages/setup/Customer/ShippingDate/shippingdate.html?v=" + version
            , controller: "shippingdateController"
        })
        .when("/setup/customer/portloading", {
            templateUrl: "/pages/setup/Customer/PortLoading/portloading.html?v=" + version
            , controller: "portloadingController"
        })

        .when("/setup/default/kpiavgperiodday", {
            templateUrl: "/pages/setup/Default/KpiAvgPeriodDay/kpiavgperiodday.html?v=" + version
            , controller: "SetupDefaultKpiAvgPeriodDayController"
        })

        .when("/setup/textdisplay/setremark", {
            templateUrl: "/pages/setup/TextDisplay/SetRemark/setremark.html?v=" + version
            , controller: "setremarkController"
        })
        

        // plan
        .when("/plan", {
            templateUrl: "/pages/Plan/plan.html?v=" + version
            , controller: "planController"
        })
        .when("/plan/shipment/planlist", {
            templateUrl: "/pages/Plan/Shipment/PlanList/planlist.html?v=" + version
            , controller: "shipmentPlanListController as $shipmentPlanList"
        })
        .when("/plan/shipment/planlist/manage/:shipmentplanid", {
            templateUrl: "/pages/Plan/Shipment/Manage/manage.html?v=" + version
            , controller: "shipmentManageController as $shipmentManage"
        })
        .when("/plan/shipment/approve/:step", {
            templateUrl: "/pages/Plan/Shipment/Approve/approve.html?v=" + version
            , controller: "shipmentApproveController"
        })
        .when("/plan/shipment/mng_approve", {
            templateUrl: "/pages/Plan/Shipment/ManagerApprove/managerapprove.html?v=" + version
            , controller: "shipmentManagerApproveController"
        })
        .when("/plan/shipment/markbookingtransport/", {
            templateUrl: "/pages/Plan/Shipment/bookingtransport/bookingtransport.html?v=" + version
            , controller: "shipmentMarkBookingTransportCtrl"
        })
        .when("/plan/shipment/report/", {
            templateUrl: "/pages/Plan/Shipment/Report/report.html?v=" + version
            , controller: "shipmentCompareReportController"
        })
        .when("/plan/shipment/planvsactualreport/", {
            templateUrl: "/pages/Plan/Shipment/PlanVSActualReport/planvsactualreport.html?v=" + version
            , controller: "shipmentplanvsactualreportController"
        })
        .when("/plan/shipment/planfailreport/", {
            templateUrl: "/pages/Plan/Shipment/PlanFailReport/planfailreport.html?v=" + version
            , controller: "shipmentplanfailreportController"
        })
        .when("/plan/shipment/forecastcompare/", {
            templateUrl: "/pages/Plan/Shipment/Forecast/forecast.html?v=" + version
            , controller: "shipmentForecastReportController"
        })
        .when("/plan/shipment/remark/", {
            templateUrl: "/pages/Plan/Shipment/Remark/remark.html?v=" + version
            , controller: "shipmentPlanRemarkCtrl"
        })
        .when("/plan/shipment/summaryreport/", {
            templateUrl: "/pages/Plan/Shipment/SummaryReport/summaryreport.html?v=" + version
            , controller: "shipmentPlanSummaryReportCtrl"
        })
        .when("/plan/shipment/deliveryreport/", {
            templateUrl: "/pages/Plan/Shipment/DeliveryReport/deliveryreport.html?v=" + version
            , controller: "shipmentPlanDeliveryReportCtrl"
        })

        // sale
        .when("/sales", {
            templateUrl: "/pages/Sales/sales.html?v=" + version
            , controller: "salesController"
        })
        .when("/sales/salesreport/pivsforecastreport", {
            templateUrl: "/pages/Sales/Report/PiVsForecastReport/pivsforecastreport.html?v=" + version
            , controller: "SalesReportPiVsForecastReportController"
        })        
        .when("/sales/salesreport/invturnoverreport", {
            templateUrl: "/pages/Sales/Report/InvTurnoverReport/invturnoverreport.html?v=" + version
            , controller: "SalesReportInvTurnoverReportController"
        })
        .when("/sales/salesreport/orderonhandreport", {
            templateUrl: "/pages/Sales/Report/OderOnhandReport/orderonhandreport.html?v=" + version
            , controller: "SalesReportOderOnhandReportController"
        })
        .when("/sales/salesreport/cibyitemsreport", {
            templateUrl: "/pages/Sales/Report/CIByItemsReport/cibyitemsreport.html?v=" + version
            , controller: "SalesReportCIByItemsReportController"
        })

        // login
        .when("/login", {
            templateUrl: "/pages/Login/login.html?v=" + version
            , controller: "loginController"
        })
        .when("/singlesignon", {
            templateUrl: "/pages/Login/singlesignon.html?v=" + version
            , controller: "singlesignonController"
        })
        .otherwise({
            redirectTo: "/setup"
        });
    $locationProvider.html5Mode(true);
});

