using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API;
using Newtonsoft.Json;
using InterSaleApi.Engine.API.DiscountStd;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/DiscountStd")]
    public class DiscountStdController : Controller
    {

        //--------------------------------------------- Search -----------------------------------------------//

        [HttpGet("searchMain/{token}")]
        public dynamic SearchMain(string token, [FromQuery] string[] customerIDs, [FromQuery] string[] productTypeIDs, [FromQuery] string[] productGradeIDs, [FromQuery] string[] status)
        {
            DiscountStdSearchMainAPI res = new DiscountStdSearchMainAPI();
            var data = new { ids = customerIDs, status = status, ids1 = productTypeIDs, ids2 = productGradeIDs };
            return res.Execute(token, data);
        }

        [HttpGet("searchEffectiveDate/{token}")]
        public dynamic SearchEffectiveDate(string token, [FromQuery] string[] discountStdMainIDs, [FromQuery] string[] status, [FromQuery] string dateFrom, [FromQuery] string dateTo)
        {
            DiscountStdSearchEffectiveDateAPI res = new DiscountStdSearchEffectiveDateAPI();
            var data = new { ids = discountStdMainIDs, status = status, dateFrom = dateFrom, dateTo = dateTo };
            return res.Execute(token, data);
        }

        [HttpGet("searchDiscountProd/{token}")]
        public dynamic SearchDiscountProd(string token, [FromQuery] string[] discountEffectiveDateID, [FromQuery] string[] status)
        {
            DiscountStdSearchProdAPI res = new DiscountStdSearchProdAPI();
            var data = new { ids = discountEffectiveDateID, status = status };
            return res.Execute(token, data);
        }

        [HttpGet("searchDiscountRangeH/{token}")]
        public dynamic SearchDiscountRangeH(string token, [FromQuery] string[] discountEffectiveDateID, [FromQuery] string[] status)
        {
            DiscountStdSearchRangeHAPI res = new DiscountStdSearchRangeHAPI();
            var data = new { ids = discountEffectiveDateID, status = status };
            return res.Execute(token, data);
        }

        [HttpGet("searchDiscountRangeValue/{token}")]
        public dynamic SearchDiscountRangeValue(string token, [FromQuery] string[] discountEffectiveDateID, [FromQuery] string[] discountRangeHID, [FromQuery] string[] status)
        {
            DiscountStdSearchRangeValueAPI res = new DiscountStdSearchRangeValueAPI();
            var data = new { ids = discountEffectiveDateID, ids1 = discountRangeHID, status = status };
            return res.Execute(token, data);
        }

        [HttpPost("importDiscount/{token}")]
        public dynamic ImportDiscount(string token, [FromBody] dynamic data)
        {
            data = JsonConvert.SerializeObject(data);
            DiscountStdImportDiscountAPI res = new DiscountStdImportDiscountAPI();
            return res.Execute(token, data);
        }
                
        [HttpPost("SaveMain/{token}")]
        public dynamic SaveMain(string token, [FromBody] dynamic data)
        {
            DiscountStdSaveMainAPI res = new DiscountStdSaveMainAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatusMain/{token}")]
        public dynamic UpdateStatusMain(string token, [FromBody] dynamic data)
        {
            var res = new DiscountStdMainUpdateStatusAPI();
            return res.Execute(token, data);
        }

        [HttpPost("SaveEffectiveDate/{token}")]
        public dynamic SaveEffectiveDate(string token, [FromBody] dynamic data)
        {
            DiscountStdSaveEffectiveDateAPI res = new DiscountStdSaveEffectiveDateAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatusEffectiveDate/{token}")]
        public dynamic UpdateStatusEffectiveDate(string token, [FromBody] dynamic data)
        {
            var res = new DiscountStdEffectiveDateUpdateStatusAPI();
            return res.Execute(token, data);
        }

        [HttpPost("SaveRangeH/{token}")]
        public dynamic SaveRangeH(string token, [FromBody] dynamic data)
        {
            DiscountStdSaveRangeHAPI res = new DiscountStdSaveRangeHAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatusRangeH/{token}")]
        public dynamic UpdateStatusRangeH(string token, [FromBody] dynamic data)
        {
            var res = new DiscountStdRangHUpdateStatusAPI();
            return res.Execute(token, data);
        }

        [HttpPost("SaveProdValue/{token}")]
        public dynamic SaveProdValue(string token, [FromBody] dynamic data)
        {
            DiscountStdSaveProdValueAPI res = new DiscountStdSaveProdValueAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatusValue/{token}")]
        public dynamic UpdateStatusValue(string token, [FromBody] dynamic data)
        {
            var res = new DiscountStdValueUpdateStatusAPI();
            return res.Execute(token, data);
        }

        [HttpPost("SaveRangeValue/{token}")]
        public dynamic SaveRangeValue(string token, [FromBody] dynamic data)
        {
            DiscountStdSaveRangeValueAPI res = new DiscountStdSaveRangeValueAPI();
            return res.Execute(token, data);
        }

        [HttpGet("CloneSearch")]
        public async Task<dynamic> CloneSearch([FromHeader] string token, [FromQuery] int customerID, [FromQuery] string effectiveDate, [FromQuery] string[] productTypeIDs)
        {
            var res = new DiscountStdCloneSearchAPI();
            var data = new { id = customerID, search = effectiveDate, ids = productTypeIDs };
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpPost("CloneSave")]
        public async Task<dynamic> CloneSave([FromHeader] string token, [FromBody] dynamic data)
        {
            var res = new DiscountStdCloneSaveAPI();
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpGet("SearchHeader")]
        public async Task<dynamic> SearchHeader([FromHeader] string token, [FromQuery] string[] customerIDs, [FromQuery] string dateFrom, [FromQuery] string dateTo, [FromQuery] string[] status)
        {
            var res = new DiscountStdSearchHeaderAPI();
            var data = new
            {
                ids = customerIDs
                , dateFrom = dateFrom
                , dateTo = dateTo
                , status = status
            };
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpGet("SearchDetail")]
        public async Task<dynamic> SearchDetail([FromHeader] string token, [FromQuery] string[] mainID, [FromQuery] string[] effectiveID, [FromQuery] string[] status)
        {
            var res = new DiscountStdSearchDetailAPI();
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
            var res = new DiscountStdApprovalAPI();
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpGet("ListRangeD")]
        public async Task<dynamic> ListRangeD([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] status)
        {
            var res = new DiscountStdListRangeDAPI();
            var data = new
            {
                ids = ids
                , status = status
            };
            return await Task.Run(() => res.Execute(token, data));
        }

        [HttpGet("SearchDiscountForPrice")]
        public dynamic SearchDiscountForPrice([FromHeader] string token
            , [FromQuery] string effectiveDateTo
            , [FromQuery] string effectiveDateFrom
            , [FromQuery] int countryGroupID
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
                , countryGroupID = countryGroupID
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
            DiscountStdSearchDiscountForPriceAPI res = new DiscountStdSearchDiscountForPriceAPI();
            return res.Execute(token, data);
        }

    }
}
