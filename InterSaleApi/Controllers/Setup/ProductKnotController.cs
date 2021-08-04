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
    [Route("v1/api/ProductKnot")]
    public class ProductKnotController : Controller
    {
        [HttpGet("search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            ProductKnotSearchAPI res = new ProductKnotSearchAPI();
            var data = new { ids = ids, codes = codes, search = search, status = status };
            return res.Execute(token, data);
        }

        [HttpGet("search")]
        public dynamic Search2([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            ProductKnotSearchAPI res = new ProductKnotSearchAPI();
            var data = new { ids = ids, codes = codes, search = search, status = status };
            return res.Execute(token, data);
        }
    }
}
