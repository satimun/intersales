using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API;
using InterSaleModel.Model.API.Request;
using Newtonsoft.Json;
using System.IO;
using Microsoft.AspNetCore.Cors;
using InterSaleApi.Model.StaticValue;
using InterSaleApi.Engine.API.PriceStd;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/PriceStd")]
    public class PriceStdController : Controller
    {
        //------------------------------------------- Search ----------------------------------------//

        [HttpGet("searchMain/{token}")]
        public dynamic SearchMain(string token, [FromQuery] string[] countryGroupIDs, [FromQuery] string[] productTypeIDs, [FromQuery] string[] productGradeIDs, [FromQuery] string[] status)
        {
            PriceStdSearchMainAPI res = new PriceStdSearchMainAPI();
            var data = new { ids = countryGroupIDs, status = status, ids1 = productTypeIDs, ids2 = productGradeIDs };
            return res.Execute(token, data);
        }

        [HttpGet("searchEffectiveDate/{token}")]
        public dynamic SearchEffectiveDate(string token, [FromQuery] string[] priceStdMainIDs, [FromQuery] string[] status, [FromQuery] string dateFrom, [FromQuery] string dateTo) //priceStdMainID
        {
            PriceStdSearchEffectiveDateAPI res = new PriceStdSearchEffectiveDateAPI();
            var data = new { ids = priceStdMainIDs, status = status, dateFrom = dateFrom, dateTo = dateTo };
            return res.Execute(token, data);
        }

        [HttpGet("searchPriceProd/{token}")]
        public dynamic SearchPriceProd(string token, [FromQuery] string[] priceEffectiveDateID, [FromQuery] string[] status)
        {
            PriceStdSearchPriceProdAPI res = new PriceStdSearchPriceProdAPI();
            var data = new { ids = priceEffectiveDateID, status = status };
            return res.Execute(token, data);
        }

        [HttpGet("searchPriceRangeH/{token}")]
        public dynamic SearchPriceRangeH(string token, [FromQuery] int[] priceEffectiveDateID, [FromQuery] string[] status)
        {
            PriceStdSearchPriceRangeHAPI res = new PriceStdSearchPriceRangeHAPI();
            var data = new { ids = priceEffectiveDateID, status = status };
            return res.Execute(token, data);
        }

        [HttpGet("searchPriceRangeValue/{token}")]
        public dynamic SearchPriceRangeValue(string token, [FromQuery] string[] priceEffectiveDateID, [FromQuery] string[] priceRangeHID, [FromQuery] string[] status)
        {
            PriceStdSearchPriceRangeValueAPI res = new PriceStdSearchPriceRangeValueAPI();
            var data = new { ids = priceEffectiveDateID, ids1 = priceRangeHID, status = status };
            return res.Execute(token, data);
        }

        [HttpPost("importPrice/{token}")]
        public dynamic ImportPrice(string token, [FromBody] dynamic data)
        {
            data = JsonConvert.SerializeObject(data);
            PriceStdImportPriceAPI res = new PriceStdImportPriceAPI();
            return res.Execute(token, data);
        }

        //------------------- getPrice

        [HttpGet("getPrice/{token}")]
        public dynamic GetPrice(string token
            , [FromQuery] string effectiveDateTo
            , [FromQuery] string effectiveDateFrom
            , [FromQuery] string[] productCodes
            , [FromQuery] string[] productRanges
            , [FromQuery] string[] productGradeCodes
            , [FromQuery] string currencyCode
            , [FromQuery] string customerCode
            , [FromQuery] string unitTypeCode)
        {
            var data = new {
                effectiveDateTo = effectiveDateTo
                , effectiveDateFrom = effectiveDateFrom
                , productCodes = productCodes
                , productRanges = productRanges
                , productGradeCodes = productGradeCodes
                , currencyCode = currencyCode
                , customerCode = customerCode
                , unitTypeCode = unitTypeCode
            };
            PriceStdGetPriceAPI res = new PriceStdGetPriceAPI();
            return res.Execute(token, data);
        }
                
        //------------------- reload

        [HttpGet("ReloadStaticValues/{token}")]
        public dynamic reload(string token)
        {
            StaticValueManager.GetInstant().LoadInstantAll();
            var res = new { status = "S", message = "SUCCESS" };
            return res;
        }

        [HttpPost("SaveMain/{token}")]
        public dynamic SaveMain(string token, [FromBody] dynamic data)
        {
            var res = new PriceStdSaveMainAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatusMain/{token}")]
        public dynamic UpdateStatusMain(string token, [FromBody] dynamic data)
        {
            var res = new PriceStdMainUpdateStatusAPI();
            return res.Execute(token, data);
        }

        [HttpPost("SaveEffectiveDate/{token}")]
        public dynamic SaveEffectiveDate(string token, [FromBody] dynamic data)
        {
            var res = new PriceStdSaveEffectiveDateAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatusEffectiveDate/{token}")]
        public dynamic UpdateStatusEffectiveDate(string token, [FromBody] dynamic data)
        {
            var res = new PriceStdEffectiveDateUpdateStatusAPI();
            return res.Execute(token, data);
        }

        [HttpPost("SaveRangeH/{token}")]
        public dynamic SaveRangeH(string token, [FromBody] dynamic data)
        {
            var res = new PriceStdSaveRangeHAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatusRangeH/{token}")]
        public dynamic UpdateStatusRangeH(string token, [FromBody] dynamic data)
        {
            var res = new PriceStdRangeHUpdateStatusAPI();
            return res.Execute(token, data);
        }

        [HttpPost("SaveProdValue/{token}")]
        public dynamic SaveProdValue(string token, [FromBody] dynamic data)
        {
            var res = new PriceStdSaveProdValueAPI();
            return res.Execute(token, data);
        }

        //[HttpPost("UpdateStatusRangeD/{token}")]
        //public dynamic UpdateStatusRangeD(string token, [FromBody] dynamic data)
        //{
        //    var res = new PriceStdRangeDUpdateStatusAPI();
        //    return res.Execute(token, data);
        //}

        [HttpPost("SaveRangeValue/{token}")]
        public dynamic SaveRangeValue(string token, [FromBody] dynamic data)
        {
            var res = new PriceStdSaveRangeValueAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatusValue/{token}")]
        public dynamic UpdateStatusValue(string token, [FromBody] dynamic data)
        {
            var res = new PriceStdValueUpdateStatusAPI();
            return res.Execute(token, data);
        }

        [HttpGet("SearchPriceForDiscount")]
        public dynamic SearchPriceForDiscount([FromHeader] string token
            , [FromQuery] string effectiveDateTo
            , [FromQuery] string effectiveDateFrom
            , [FromQuery] int customerID
            , [FromQuery] int? productID
            , [FromQuery] int productTypeID
            , [FromQuery] int? productGradeID
            , [FromQuery] int unitTypeID
            , [FromQuery] int currencyID
            , [FromQuery] string minTwineSizeCode
            , [FromQuery] string maxTwineSizeCode
            , [FromQuery] int? knotID
            , [FromQuery] int? stretchingID
            , [FromQuery] int? twineseriesID
            , [FromQuery] int? selvageWovenTypeID
            , [FromQuery] int? colorGroupID
            , [FromQuery] decimal? minMeshSize
            , [FromQuery] decimal? maxMeshSize
            , [FromQuery] decimal? minMeshDepth
            , [FromQuery] decimal? maxMeshDepth
            , [FromQuery] decimal? minLength
            , [FromQuery] decimal? maxLength)
        {
            var data = new
            {
                effectiveDateTo = effectiveDateTo
                , effectiveDateFrom = effectiveDateFrom
                , customerID = customerID
                , productID = productID
                , productTypeID = productTypeID
                , productGradeID = productGradeID
                , unitTypeID = unitTypeID
                , currencyID = currencyID
                , minTwineSizeCode = minTwineSizeCode
                , maxTwineSizeCode = maxTwineSizeCode
                , knotID = knotID
                , stretchingID = stretchingID
                , twineseriesID = twineseriesID
                , selvageWovenTypeID = selvageWovenTypeID
                , colorGroupID = colorGroupID
                , minMeshSize = minMeshSize
                , maxMeshSize = maxMeshSize
                , minMeshDepth = minMeshDepth
                , maxMeshDepth = maxMeshDepth
                , minLength = minLength
                , maxLength = maxLength
            };
            PriceStdSearchPriceForDiscountAPI res = new PriceStdSearchPriceForDiscountAPI();
            return res.Execute(token, data);
        }
        
        [HttpGet("CloneSearch")]
        public async Task<dynamic> CloneSearch([FromHeader] string token, [FromQuery] int countryGroupID, [FromQuery] string effectiveDate, [FromQuery] string[] productTypeIDs)
        {
            var res = new PriceStdCloneSearchAPI();
            var data = new
            {
                id = countryGroupID
                , search = effectiveDate
                , ids = productTypeIDs
            };
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpPost("CloneSave")]
        public async Task<dynamic> CloneSave([FromHeader] string token, [FromBody] dynamic data)
        {
            var res = new PriceStdCloneSaveAPI();
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpGet("SearchHeader")]
        public async Task<dynamic> SearchHeader([FromHeader] string token, [FromQuery] string[] countryGroupIDs, [FromQuery] string dateFrom, [FromQuery] string dateTo, [FromQuery] string[] status)
        {
            var res = new PriceStdSearchHeaderAPI();
            var data = new
            {
                ids = countryGroupIDs
                , dateFrom = dateFrom
                , dateTo = dateTo
                , status = status
            };
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpGet("SearchDetail")]
        public async Task<dynamic> SearchDetail([FromHeader] string token, [FromQuery] string[] mainID, [FromQuery] string[] effectiveID, [FromQuery] string[] status)
        {
            var res = new PriceStdSearchDetailAPI();
            var data = new
            {
                ids = mainID
                , ids1 = effectiveID
                , status = status
            };
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpPost("Approval")]
        public async Task<dynamic> Approval([FromHeader] string token, [FromBody] dynamic data)
        {
            var res = new PriceStdApprovalAPI();
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpGet("ListRangeD")]
        public async Task<dynamic> ListRangeD([FromHeader] string token, [FromQuery] string[] ids
            , [FromQuery] string[] countryGroupIDs
            , [FromQuery] string[] productTypeIDs
            , [FromQuery] string[] productGradeIDs
            , [FromQuery] string[] currencyIDs
            , [FromQuery] string[] status)
        {
            var res = new PriceStdListRangeDAPI();
            var data = new
            {
                ids = ids
                , ids1 = countryGroupIDs
                , ids2 = productTypeIDs
                , ids3 = productGradeIDs
                , ids4 = currencyIDs
                , status = status
            };
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpGet("ListProd")]
        public async Task<dynamic> ListProd([FromHeader] string token, [FromQuery] string[] ids
            , [FromQuery] string[] countryGroupIDs
            , [FromQuery] string[] productTypeIDs
            , [FromQuery] string[] productGradeIDs
            , [FromQuery] string[] currencyIDs
            , [FromQuery] string[] status)
        {
            var res = new PriceStdListProdAPI();
            var data = new
            {
                ids = ids
                , ids1 = countryGroupIDs
                , ids2 = productTypeIDs
                , ids3 = productGradeIDs
                , ids4 = currencyIDs
                , status = status
            };
            return await Task.Run(() => res.Execute(token, data));
        }
    }
}
