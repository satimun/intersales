using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.API.Product;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/ProductType")]
    public class ProductTypeController : Controller
    {
        [HttpGet("find/{token}")]
        public dynamic Find(string token, [FromQuery] dynamic data)
        {
            throw new Exception("404");
            //return null;
        }

        [HttpGet("list/{token}")]
        public dynamic List(string token)
        {
            ProductTypeListAPI res = new ProductTypeListAPI();
            return res.Execute(token);
        }

        [HttpGet("Search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, codes = codes, search = search, status = status };
            ProductTypeSearchAPI res = new ProductTypeSearchAPI();
            return res.Execute(token, data);
        }

        [HttpGet("Search")]
        public dynamic Search2([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, codes = codes, search = search, status = status };
            ProductTypeSearchAPI res = new ProductTypeSearchAPI();
            return res.Execute(token, data);
        }
    }
}
