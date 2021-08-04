using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API.Product;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [EnableCors("AllowCors"), Route("v1/api/ProductTwineSize")]
    public class ProductTwineSizeController : Controller
    {
        [HttpGet("Search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids, [FromQuery] string[] productGroupIDs, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, ids1 = productGroupIDs, codes = codes, search = search, status = status };
            ProductTwineSizeSearchAPI res = new ProductTwineSizeSearchAPI();
            return res.Execute(token, data);
        }

        [HttpGet("Search")]
        public dynamic Search2([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] productGroupIDs, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, ids1 = productGroupIDs, codes = codes, search = search, status = status };
            ProductTwineSizeSearchAPI res = new ProductTwineSizeSearchAPI();
            return res.Execute(token, data);
        }
    }
}