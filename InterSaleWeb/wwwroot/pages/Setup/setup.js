'use strict';
app.controller("setupController", function ($rootScope, $scope, $location, oauth, common) {
    $rootScope.backUrl = $location.url();
    oauth.GetToken();

});