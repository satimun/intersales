
app.filter('decimalFormat', function ($filter) {
    return function (input, decimalPlaces) {
        if (input === undefined || input === null || input === '') {
            return "";
        }
        else if (isNaN(input)) {
            return input; //'#DIV/0!';//$filter('number')(input, decimalPlaces);
        }
        else {
            return $filter('number')(input, decimalPlaces);
        }
    };
});

app.filter('mapDays', function ($rootScope, common) {
    return (input) => {
        return common.MapID($rootScope.days, input);
    };
});

app.filter('mapRemarkGroupType', function ($rootScope, common) {
    return (input) => {
        return common.MapID($rootScope.RemarkGroupType, input);
    };
});

app.filter('mapCountryGroupType', function ($rootScope, common) {
    return (input) => {
        return common.MapID($rootScope.CountryGroupTypes, input);
    };
});

app.filter('mapStatus', function (common) {
    var statusCode = [
        { id: 'A', view: 'Active' },
        { id: 'I', view: 'Inactive' },
        { id: 'C', view: 'Remove' }
    ];
    return (input) => {
        return common.MapID(statusCode, input);
    };
});

app.filter('mapPriceStdMainType', function ($rootScope, common) {
    return (input) => {
        return common.MapID($rootScope.PriceStdMainType, input);
    };
});

app.filter('mapProductType', function ($rootScope, common) {
    return (input) => {
        return common.MapCode($rootScope.ProductTypes, input);
    };
});

app.filter('mapProductGrade', function ($rootScope, common) {
    return (input) => {
        return common.MapCode($rootScope.ProductGrades, input);
    };
});

app.filter('mapCurrency', function ($rootScope, common) {
    return (input) => {
        return common.MapCode($rootScope.Currencys, input);
    };
});

app.filter('mapUnitType', function ($rootScope, common) {
    return (input) => {
        return common.MapCode($rootScope.UnitTypes, input);
    };
});

app.filter('mapZone', function ($rootScope, common) {
    return (input) => {
        return common.MapCode($rootScope.zoneList, input);
    };
});

//app.filter('mapProductColor', function ($rootScope) {
//    return (input) => {
//        return common.MapCode($rootScope.ProductColors, input);
//    };
//});

//app.filter('mapTwineSize', function ($rootScope) {
//    return (input) => {
//        return common.MapCode($rootScope.TwineSizes, input);
//    };
//});

app.filter('mapProductKnot', function ($rootScope, common) {
    return (input) => {
        return common.MapCode($rootScope.ProductKnots, input);
    };
});

app.filter('mapProductStretching', function ($rootScope, common) {
    return (input) => {
        return common.MapCode($rootScope.ProductStretchings, input);
    };
});

app.filter('mapProductSelvageWovenType', function ($rootScope, common) {
    return (input) => {
        return common.MapCode($rootScope.ProductSelvageWovenTypes, input);
    };
});

app.filter('mapPriceStdApproveStatus', function ($rootScope, common) {
    return (input) => {
        return common.MapID($rootScope.PriceStdApproveStatus.list, input);
    };
});
app.filter('mapPriceStdEffectiveDateStatus', function ($rootScope, common) {
    return (input) => {
        return common.MapID($rootScope.PriceStdEffectiveDateStatus.list, input);
    };
});


app.filter('mapDiscountStdMainType', function ($rootScope, common) {
    return (input) => {
        return common.MapID($rootScope.DiscountStdMainType, input);
    };
});

app.filter('mapDiscountStdApproveStatus', function ($rootScope, common) {
    return (input) => {
        return common.MapID($rootScope.DiscountStdApproveStatus.list, input);
    };
});
app.filter('mapDiscountStdEffectiveDateStatus', function ($rootScope, common) {
    return (input) => {
        return common.MapID($rootScope.DiscountStdEffectiveDateStatus.list, input);
    };
});
