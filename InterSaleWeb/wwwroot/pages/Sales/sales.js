'use strict';
app.controller("salesController", function ($rootScope, $scope, $location, oauth, common) {
    $rootScope.backUrl = $location.url();
    oauth.GetToken();

});