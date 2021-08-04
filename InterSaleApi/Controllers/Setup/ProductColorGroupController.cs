using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API.Product;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/ProductColorGroup")]
    public class ProductColorGroupController : Controller
    {
        [HttpGet("search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids, [FromQuery] string[] countryGroupIDs, [FromQuery] string[] customerIDs, [FromQuery] string[] codes, [FromQuery] string[] productTypeID, [FromQuery] string[] productGradeID, [FromQuery] string search, [FromQuery] string[] status)
        {
            ProductColorGroupSearchAPI res = new ProductColorGroupSearchAPI();
            var data = new { ids = ids, codes = codes, ids1 = countryGroupIDs, ids2 = customerIDs, ids3 = productTypeID, ids4 = productGradeID, search = search, status = status };
            return res.Execute(token, data);
        }

        [HttpGet("search")]
        public dynamic Search2([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] countryGroupIDs, [FromQuery] string[] customerIDs, [FromQuery] string[] codes, [FromQuery] string[] productTypeID, [FromQuery] string[] productGradeID, [FromQuery] string search, [FromQuery] string[] status)
        {
            ProductColorGroupSearchAPI res = new ProductColorGroupSearchAPI();
            var data = new { ids = ids, codes = codes, ids1 = countryGroupIDs, ids2 = customerIDs, ids3 = productTypeID, ids4 = productGradeID, search = search, status = status };
            return res.Execute(token, data);
        }

        [HttpPost("Import/{token}")]
        public dynamic Import(string token, [FromBody] dynamic data)
        {
            ProductColorGroupImportAPI res = new ProductColorGroupImportAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatus")]
        public dynamic UpdateStatus([FromHeader] string token, [FromBody] dynamic data)
        {
            ProductColorGroupUpdateStatusAPI res = new ProductColorGroupUpdateStatusAPI();
            return res.Execute(token, data);
        }
    }
}
