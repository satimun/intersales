KSSClient = typeof KSSClient && {};
KSSClient.API = KSSClient.API || {};


var path = "";
if (select_mode === 1) { path = "http://localhost:8083/v1/api/"; }
else if (select_mode === 2) { path = "https://intersalesapisdev.kkfnets.com/v1/api/"; }
else if (select_mode === 3) { path = "https://intersalesapis.kkfnets.com/v1/api/"; }

KSSClient.API.CountLoading = 0; 

KSSClient.API.Call = function (option) {
    var token = "test";
    if (window.localStorage.getItem('Token')) {
        token = window.localStorage.getItem('Token');
    }

    var method = option.api.method.toUpperCase();
    var url = path + option.api.controller + "/" + option.api.module + "/" + token;
    var data = JSON.stringify(option.data);
    if (method === "GET") {
        var key = Object.keys(option.data);
        url += "?";
        for (i = 0; i < key.length; i++) {
            var tmp = option.data[key[i]];
            if (Array.isArray(tmp)) {
                if (tmp.length > 0) {
                    for (var j = 0; j < tmp.length; j++) {
                        url += key[i] + "=" + (!tmp[j] || tmp[j] === undefined ? '' : tmp[j]);
                        if (tmp.length > j + 1) url += "&";
                    }
                } else {
                    url += key[i] + "=" + (!option.data[key[i]] ? '' : option.data[key[i]]);
                }
            } else {
                url += key[i] + "=" + (!option.data[key[i]] ? '' : option.data[key[i]]);
            }
            if (key.length > i + 1) url += "&";
        }      
        data = null;
    }
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    //xhr.timeout = 600000;

    var loadding = document.getElementById('loadding');

    if (!option.noloadding) { KSSClient.API.CountLoading++; }

    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var res = JSON.parse(xhr.responseText);
            if (res.status == 'S') option.callback(res);
            else option.error(res);
            if (!option.noloadding) { KSSClient.API.CountLoading--; }
        }
        else if (xhr.readyState == 4 && xhr.status != 204 && xhr.status != 0) {
            var res = {};
            res.status = "F"; 
            res.message = "ไม่สามารถเชื่อมต่อ API ได้";
            option.error(res);
            if (!option.noloadding) { KSSClient.API.CountLoading--; }
        }
        if (KSSClient.API.CountLoading == 0) { loadding.style.display = 'none'; }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send(data);
    setTimeout(function () {
        if (KSSClient.API.CountLoading > 0)
            loadding.style.display = 'flex';
    }, 100);

};

//------------------ Oauth ----------------------//

KSSClient.API.Oauth = KSSClient.API.Oauth || {};
KSSClient.API.Oauth.Token = undefined;

/*KSSClient.API.Oauth.RequestToken = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'Oauth', module: 'RequestToken' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Oauth.DestroyToken = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'Oauth', module: 'DestroyToken' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Oauth.RenewToken = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'Oauth', module: 'RenewToken' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Oauth.getTokenState = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Oauth', module: 'getTokenState' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Oauth.CheckPermission = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'Oauth', module: 'checkpermission' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Oauth.ChangePassword = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'Oauth', module: 'ChangePassword' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};*/



//------------------ CountryGroup ----------------------//

KSSClient.API.CountryGroup = KSSClient.API.CountryGroup || {};
KSSClient.API.CountryGroup.PriceList = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'countrygroup', module: 'pricelist' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


//------------------ Country ----------------------//

KSSClient.API.Country = KSSClient.API.Country || {};
KSSClient.API.Country.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Country', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Country.List = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Country', module: 'List' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ Constant ----------------------//

KSSClient.API.Constant = KSSClient.API.Constant || {};
KSSClient.API.Constant.PriceStdMainType = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'constant', module: 'priceStdMainType' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Constant.PriceStdEffectiveDateStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'constant', module: 'priceStdEffectiveDateStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Constant.PriceStdApproveStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'constant', module: 'priceStdApproveStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


KSSClient.API.Constant.DiscountStdMainType = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'constant', module: 'DiscountStdMainType' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Constant.DiscountStdEffectiveDateStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'constant', module: 'discountStdEffectiveDateStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Constant.DiscountStdApproveStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'constant', module: 'discountStdApproveStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Constant.ShipmentPlanMonthlyStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'constant', module: 'ShipmentPlanMonthlyStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Constant.ShipmentPlanWeeklyStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'constant', module: 'ShipmentPlanWeeklyStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Constant.DefaultStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'constant', module: 'DefaultStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ Product ----------------------//

KSSClient.API.Product = KSSClient.API.Product || {};
KSSClient.API.Product.SearchLayer = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Product', module: 'SearchLayer' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Product.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Product', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


//------------------ ProductType ----------------------//

KSSClient.API.ProductType = KSSClient.API.ProductType || {};
KSSClient.API.ProductType.List = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'productType', module: 'list' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ProductType.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'productType', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


//------------------ ProductGrade ----------------------//

KSSClient.API.ProductGrade = KSSClient.API.ProductGrade || {};
KSSClient.API.ProductGrade.List = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ProductGrade', module: 'list' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ProductGrade.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ProductGrade', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ Currency ----------------------//

KSSClient.API.Currency = KSSClient.API.Currency || {};
KSSClient.API.Currency.List = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Currency', module: 'list' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Currency.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Currency', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


//------------------UnitType ----------------------//

KSSClient.API.UnitType = KSSClient.API.UnitType || {};
KSSClient.API.UnitType.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'UnitType', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


//------------------ ProductKnot ----------------------//

KSSClient.API.ProductKnot = KSSClient.API.ProductKnot || {};
KSSClient.API.ProductKnot.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ProductKnot', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ ProductStretching ----------------------//

KSSClient.API.ProductStretching = KSSClient.API.ProductStretching || {};
KSSClient.API.ProductStretching.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ProductStretching', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ ProductSelvageWovenType ----------------------//

KSSClient.API.ProductSelvageWovenType = KSSClient.API.ProductSelvageWovenType || {};
KSSClient.API.ProductSelvageWovenType.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ProductSelvageWovenType', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ ProductTwineSize ----------------------//

KSSClient.API.ProductTwineSize = KSSClient.API.ProductTwineSize || {};
KSSClient.API.ProductTwineSize.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ProductTwineSize', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ ProductTwineSeries ----------------------//

KSSClient.API.ProductTwineSeries = KSSClient.API.ProductTwineSeries || {};
KSSClient.API.ProductTwineSeries.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ProductTwineSeries', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ ProductColorGroup ----------------------//

KSSClient.API.ProductColorGroup = KSSClient.API.ProductColorGroup || {};
KSSClient.API.ProductColorGroup.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ProductColorGroup', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ProductColorGroup.Import = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ProductColorGroup', module: 'Import' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ ProductColorGroup ----------------------//

KSSClient.API.ProductColor = KSSClient.API.ProductColor || {};
KSSClient.API.ProductColor.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ProductColor', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ PriceStd ----------------------//

KSSClient.API.PriceStd = KSSClient.API.PriceStd || {};
KSSClient.API.PriceStd.SearchMain = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'priceStd', module: 'searchMain' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------- reload -----------------------------------------
KSSClient.API.PriceStd.ReloadStaticValue = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'priceStd', module: 'ReloadStaticValues' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.SearchEffectiveDate = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'priceStd', module: 'searchEffectiveDate' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.SearchPriceProd = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'priceStd', module: 'searchPriceProd' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.SearchPriceRangeH = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'priceStd', module: 'searchPriceRangeH' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.SearchPriceRangeValue = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'priceStd', module: 'searchPriceRangeValue' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.ImportPrice = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'importPrice' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//KSSClient.API.PriceStd.ActivePrice = function (option) {
//    KSSClient.API.Call({
//        api: { method: 'post', controller: 'priceStd', module: 'ActivePrice' },
//        data: option.data,
//        callback: option.callback,
//        error: option.error
//    });
//};

//KSSClient.API.PriceStd.CancelPrice = function (option) {
//    KSSClient.API.Call({
//        api: { method: 'post', controller: 'priceStd', module: 'CancelPrice' },
//        data: option.data,
//        callback: option.callback,
//        error: option.error
//    });
//};

//KSSClient.API.PriceStd.InactivePrice = function (option) {
//    KSSClient.API.Call({
//        api: { method: 'post', controller: 'priceStd', module: 'InactivePrice' },
//        data: option.data,
//        callback: option.callback,
//        error: option.error
//    });
//};

KSSClient.API.PriceStd.SaveMain = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'SaveMain' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.SaveEffectiveDate = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'SaveEffectiveDate' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.SaveRangeH = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'SaveRangeH' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.SaveProdValue = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'SaveProdValue' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.SaveRangeValue = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'SaveRangeValue' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.UpdateStatusMain = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'UpdateStatusMain' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.UpdateStatusEffectiveDate = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'UpdateStatusEffectiveDate' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.UpdateStatusRangeH = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'UpdateStatusRangeH' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.UpdateStatusRangeD = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'UpdateStatusRangeD' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PriceStd.UpdateStatusValue = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'priceStd', module: 'UpdateStatusValue' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ Price Get Search Price -----------------//

KSSClient.API.PriceStd.GetPrice = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'priceStd', module: 'GetPrice' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};
KSSClient.API.PriceStd.SearchByCodeForDiscount = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'priceStd', module: 'SearchByCodeForDiscount' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};
KSSClient.API.PriceStd.SearchByRangeForDiscount = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'priceStd', module: 'SearchByRangeForDiscount' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


//------------------ Customer ----------------------//

KSSClient.API.Customer = KSSClient.API.Customer || {};
KSSClient.API.Customer.List = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Customer', module: 'list' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Customer.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Customer', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


//------------------ DiscountStd ----------------------//

KSSClient.API.DiscountStd = KSSClient.API.DiscountStd || {};
KSSClient.API.DiscountStd.SearchMain = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'DiscountStd', module: 'searchMain' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.SearchEffectiveDate = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'DiscountStd', module: 'searchEffectiveDate' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.SearchDiscountProd = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'DiscountStd', module: 'searchDiscountProd' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.SearchDiscountRangeH = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'DiscountStd', module: 'searchDiscountRangeH' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.SearchDiscountRangeValue = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'DiscountStd', module: 'searchDiscountRangeValue' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.ImportDiscount = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'DiscountStd', module: 'importDiscount' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//KSSClient.API.DiscountStd.ActiveDiscount = function (option) {
//    KSSClient.API.Call({
//        api: { method: 'post', controller: 'DiscountStd', module: 'ActiveDiscount' },
//        data: option.data,
//        callback: option.callback,
//        error: option.error
//    });
//};

//KSSClient.API.DiscountStd.CancelDiscount = function (option) {
//    KSSClient.API.Call({
//        api: { method: 'post', controller: 'DiscountStd', module: 'CancelDiscount' },
//        data: option.data,
//        callback: option.callback,
//        error: option.error
//    });
//};

//KSSClient.API.DiscountStd.InactiveDiscount = function (option) {
//    KSSClient.API.Call({
//        api: { method: 'post', controller: 'DiscountStd', module: 'InactiveDiscount' },
//        data: option.data,
//        callback: option.callback,
//        error: option.error
//    });
//};

KSSClient.API.DiscountStd.SaveMain = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'DiscountStd', module: 'SaveMain' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.SaveEffectiveDate = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'DiscountStd', module: 'SaveEffectiveDate' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.SaveRangeH = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'DiscountStd', module: 'SaveRangeH' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.SaveProdValue = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'DiscountStd', module: 'SaveProdValue' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.SaveRangeValue = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'DiscountStd', module: 'SaveRangeValue' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.UpdateStatusMain = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'DiscountStd', module: 'UpdateStatusMain' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.UpdateStatusEffectiveDate = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'DiscountStd', module: 'UpdateStatusEffectiveDate' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.UpdateStatusRangeH = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'DiscountStd', module: 'UpdateStatusRangeH' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.DiscountStd.UpdateStatusValue = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'DiscountStd', module: 'UpdateStatusValue' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


//------------------ Price Get Language -----------------//
KSSClient.API.Language = KSSClient.API.Language || {};
KSSClient.API.Language.ListLanguage = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Language', module: 'ListLanguage' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Language.Dictionary = function (option) {
    if (KSSClient.API.Language.Dictionary.StaticValue[option.data.group])
        option.callback(KSSClient.API.Language.Dictionary.StaticValue[option.data.group]);
    else
        KSSClient.API.Call({
            api: { method: 'get', controller: 'Language', module: 'Dictionary' },
            data: option.data,
            callback: function (res) {
                var obj = {};
                res.data.dictionarys.forEach(function (row, i) {
                    obj[row.code] = row.message;
                });
                KSSClient.API.Language.Dictionary.StaticValue[option.data.group] = obj;
                option.callback(obj);
            },
        error: option.error
    });
};
KSSClient.API.Language.Dictionary.StaticValue = {};


//------------------ Employee -----------------//
KSSClient.API.Employee = KSSClient.API.Employee || {};
KSSClient.API.Employee.SearchSale = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Employee', module: 'SearchSale' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ ZoneAccount -----------------//
KSSClient.API.ZoneAccount = KSSClient.API.Zone || {};
KSSClient.API.ZoneAccount.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ZoneAccount', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ ShipMentPlanMain -----------------//
KSSClient.API.ShipmentPlanMain = KSSClient.API.ShipmentPlanMain || {};
KSSClient.API.ShipmentPlanMain.SearchProgress = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlanMain', module: 'SearchProgress' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlanMain.Remove = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlanMain', module: 'Remove' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlanMain.InsertMonthlyInit = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlanMain', module: 'InsertMonthlyInit' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlanMain.GetPlan = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlanMain', module: 'GetPlan' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlanMain.SavePlan = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlanMain', module: 'SavePlan' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
}; 

KSSClient.API.ShipmentPlanMain.GetStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlanMain', module: 'GetStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
        , noloadding: true
    });
};

KSSClient.API.ShipmentPlanMain.GetPlanForApprove = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlanMain', module: 'GetPlanForApprove' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ ShipMentPlan -----------------//
KSSClient.API.ShipmentPlan = KSSClient.API.ShipmentPlan || {};
KSSClient.API.ShipmentPlan.AutoPlan = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlan', module: 'AutoPlan' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
}; 

KSSClient.API.ShipmentPlan.SearchOutstanding = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'SearchOutstanding' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
}; 

KSSClient.API.ShipmentPlan.SearchOutstandingAuto = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'SearchOutstandingAuto' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
}; 

KSSClient.API.ShipmentPlan.ClientAutoPlan = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlan', module: 'ClientAutoPlan' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
}; 

KSSClient.API.ShipmentPlan.SearchOutstandingExcel = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'SearchOutstandingExcel' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
}; 

KSSClient.API.ShipmentPlan.SearchCost = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'SearchCost' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.GetCompareReport = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'GetCompareReport' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.ListContainerSize = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'ListContainerSize' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.ListRegionalZone = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'ListRegionalZone' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


KSSClient.API.ShipmentPlan.GetForecastReport = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'GetForecastReport' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.GetShipmentStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'GetShipmentStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.SalesApprove = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlan', module: 'SalesApprove' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.RegionalApprove = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlan', module: 'RegionalApprove' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.ManagerApprove = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlan', module: 'ManagerApprove' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.GetPackList = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'GetPackList' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.GetOutstanding = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlan', module: 'GetOutstanding' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.GetActual = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'GetActual' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.BookingTransport = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'BookingTransport' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.MarkBookigTransport = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlan', module: 'MarkBookigTransport' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.GetCustomerGroup = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'GetCustomerGroup' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.SearchPlan = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'SearchPlan' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.RecalculatePlan = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlan', module: 'RecalculatePlan' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.GetRemark = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'GetRemark' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.SaveRemark = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlan', module: 'SaveRemark' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.GetReport2 = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'GetReport2' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.ShipmentPlan.PlanVsActualReport = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlan', module: 'PlanVsActualReport' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//------------------ ShipmentPlanDateCircle -----------------//
KSSClient.API.ShipmentPlanDateCircle = KSSClient.API.ShipmentPlanDateCircle || {};
KSSClient.API.ShipmentPlanDateCircle.Get = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlanDateCircle', module: 'Get' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
}; 

KSSClient.API.ShipmentPlanDateCircle.SearchCustomer = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'ShipmentPlanDateCircle', module: 'SearchCustomer' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
}; 

KSSClient.API.ShipmentPlanDateCircle.Save = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'ShipmentPlanDateCircle', module: 'Save' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
}; 


//// set up bee ADD customer 
KSSClient.API.Constant.CustomerGroupType = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Constant', module: 'CustomerGroupType' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


KSSClient.API.CustomerGroup = KSSClient.API.CustomerGroup || {};
KSSClient.API.CustomerGroup.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'CustomerGroup', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


KSSClient.API.CustomerGroup.ActiveGroup = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'CustomerGroup', module: 'ActiveGroup' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.CustomerGroup.InactiveGroup = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'CustomerGroup', module: 'InactiveGroup' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.CustomerGroup.CancelGroup = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'CustomerGroup', module: 'CancelGroup' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.CustomerGroup.saveGroup = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'CustomerGroup', module: 'saveGroup' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.CustomerGroup.SearchCustomer = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'CustomerGroup', module: 'SearchCustomer' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


KSSClient.API.CustomerGroup.ListByType = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'CustomerGroup', module: 'ListByType' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.CustomerGroup.MoveCustomerMapping = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'CustomerGroup', module: 'MoveCustomerMapping' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.CustomerGroup.CancelCustomerMapping = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'CustomerGroup', module: 'CancelCustomerMapping' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

//// setup 30/5/2018 bee ADD countrygroup
KSSClient.API.Constant.CountryGroupType = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Constant', module: 'CountryGroupType' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};



KSSClient.API.CountryGroup.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'CountryGroup', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.CountryGroup.SaveGroup = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'CountryGroup', module: 'SaveGroup' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.CountryGroup.SearchCountry = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'CountryGroup', module: 'SearchCountry' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


//------------------ Remark -----------------//

KSSClient.API.Constant.RemarkGrouptype = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Constant', module: 'RemarkGrouptype' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Remark = KSSClient.API.Remark || {};
KSSClient.API.Remark.GetData = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Remark', module: 'GetData' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Remark.SaveGroup = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'Remark', module: 'SaveGroup' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Remark.SaveText = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'Remark', module: 'SaveText' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};


KSSClient.API.Remark.UpdateGroupStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'Remark', module: 'UpdateGroupStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Remark.UpdateTextStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'Remark', module: 'UpdateTextStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Remark.SearchGroup = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Remark', module: 'SearchGroup' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.Remark.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'Remark', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PortLoading = KSSClient.API.PortLoading || {};
KSSClient.API.PortLoading.Search = function (option) {
    KSSClient.API.Call({
        api: { method: 'get', controller: 'PortLoading', module: 'Search' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PortLoading.Save = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'PortLoading', module: 'Save' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};

KSSClient.API.PortLoading.UpdateStatus = function (option) {
    KSSClient.API.Call({
        api: { method: 'post', controller: 'PortLoading', module: 'UpdateStatus' },
        data: option.data,
        callback: option.callback,
        error: option.error
    });
};








