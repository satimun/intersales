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
    [Route("v1/api/Product")]
    public class ProductController : Controller
    {
        [HttpGet("find/{token}")]
        public dynamic Find(string token, [FromQuery] dynamic data)
        {
            throw new Exception("404");
            //return null;
        }

        [HttpGet("get/{token}")]
        public dynamic Get(string token, [FromQuery] int id)
        {
            ProductGetAPI res = new ProductGetAPI();
            var data = new { id = id };
            return res.Execute(token, data);
        }

        [HttpGet("searchLayer/{token}")]
        public dynamic SearchLayer(string token, [FromQuery] int productID)
        {
            ProductSearchLayerAPI res = new ProductSearchLayerAPI();
            var data = new { productID = productID };
            return res.Execute(token, data);
        }

        [HttpGet("Search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids, [FromQuery] string[] productTypeIDs, [FromQuery] string[] productGradeIDs, [FromQuery] string[] codes, [FromQuery] string search)
        {
            var data = new { ids = ids, ids1 = productTypeIDs, ids2 = productGradeIDs, codes = codes, search = search };
            ProductSearchAPI res = new ProductSearchAPI();
            return res.Execute(token, data);
        }

        [HttpGet("Search")]
        public dynamic Search2([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] productTypeIDs, [FromQuery] string[] productGradeIDs, [FromQuery] string[] codes, [FromQuery] string search)
        {
            var data = new { ids = ids, ids1 = productTypeIDs, ids2 = productGradeIDs, codes = codes, search = search };
            ProductSearchAPI res = new ProductSearchAPI();
            return res.Execute(token, data);
        }

        [HttpGet("SearchLight")]
        public async Task<dynamic> SearchLight([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] productTypeIDs, [FromQuery] string[] productGradeIDs, [FromQuery] string[] codes, [FromQuery] string search)
        {
            var data = new { ids = ids, ids1 = productTypeIDs, ids2 = productGradeIDs, codes = codes, search = search };
            ProductSearchLightAPI res = new ProductSearchLightAPI();
            return await Task.Run(() => res.Execute(token, data));
        }
    }
}
