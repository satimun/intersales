'use strict';
app.controller("loginController", function ($rootScope, $scope, $location, $window, oauth) {

    $rootScope.titleHeader = "Login";
    $rootScope.isCollapsed = true;
    $rootScope.login = true;

    $rootScope.backUrl = $location.search().BackUrl;
    //if (KSSClient.API.Oauth.Token != undefined) {
    //    $location.path("/");
    //}
    
    $scope.LogInAction = function () {
        oauth.LogIn($scope.userName, $scope.passWord);
    };
});