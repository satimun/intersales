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
    [Route("v1/api/ProductTwineSeries")]
    public class ProductTwineSeriesController : Controller
    {
        [HttpGet("Search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids,[FromQuery] string[] productTypeIDs, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, ids1 = productTypeIDs, codes = codes, search = search, status = status };
            ProductTwineSeriesSearchAPI res = new ProductTwineSeriesSearchAPI();
            return res.Execute(token, data);
        }

        [HttpGet("Search")]
        public dynamic Search2([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] productTypeIDs, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, ids1 = productTypeIDs, codes = codes, search = search, status = status };
            ProductTwineSeriesSearchAPI res = new ProductTwineSeriesSearchAPI();
            return res.Execute(token, data);
        }
    }
}
