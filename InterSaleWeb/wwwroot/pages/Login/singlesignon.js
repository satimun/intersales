'use strict';
app.controller("singlesignonController", function ($rootScope, $scope, $location, $window, API, $timeout, common) {

    $rootScope.titleHeader = "Login";
    $rootScope.isCollapsed = true;
    $rootScope.login = true;

    $scope.delay = 3;
    $scope.isDisabled = true;
    $rootScope.backUrl = $location.search().BackUrl;
    //if (KSSClient.API.Oauth.Token != undefined) {
    //    $location.path("/");
    //}

    API.Oauth.SingleSignOn({
        callback: function (res) {
            //window.localStorage.setItem('Token', res.data.token);
            window.localStorage.setItem('username', res.data.username);

            $scope.isDisabled = false;

            let count = setInterval(() => {
                $scope.delay--;
                $scope.$apply();
                if ($scope.delay === 0) {
                    clearInterval(count);
                    $scope.onSignIn();
                }
            }, 1000);
        },
        error: function (res) {
            if (RegExp('^O9', 'i').test(res.message)) {

                // check connect sso
                const requestOptions = {
                    method: 'GET',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        AccessToken: getCookie('AccessToken'),
                        Token: getCookie('Token'),
                    }
                };

                console.log($rootScope.SSO_URL)

                fetch(`${$rootScope.SSO_URL}api/Oauth/TokenStatus`, requestOptions).then(() => {
                    if (select_mode === 3) {
                        $window.location.href = `${$rootScope.SSO_URL}member/signin/?backurl=${encodeURI($window.location.href)}`;
                    } else {
                        $window.location.href = '/login';
                    }
                }).catch(() => {
                    $window.location.href = '/login';
                })
            } else {
                common.AlertMessage("Error", res.message);
            }
        }
    });

    $scope.onSignIn = () => {
        $timeout(() => {
            $rootScope.isCollapsed = false;
            $rootScope.login = false;
            if (RegExp("^/singlesignon", "i").test($rootScope.backUrl) || !$rootScope.backUrl) {
                $rootScope.backUrl = "/";
            }
            $window.location.href = $rootScope.backUrl;
        }, 10);
    }

    // Single Sign On
    //oauth.SingleSignOn();
});