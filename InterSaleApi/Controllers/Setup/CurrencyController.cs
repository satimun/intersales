using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.API.Currency;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/Currency")]
    public class CurrencyController : Controller
    {
        [HttpGet("list/{token}")]
        public dynamic List(string token)
        {
            CurrencyListAPI res = new CurrencyListAPI();
            return res.Execute(token);
        }

        [HttpGet("Search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, codes = codes, search = search, status = status };
            CurrencySearchAPI res = new CurrencySearchAPI();
            return res.Execute(token, data);
        }

        [HttpGet("Search")]
        public dynamic Search2([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, codes = codes, search = search, status = status };
            CurrencySearchAPI res = new CurrencySearchAPI();
            return res.Execute(token, data);
        }
    }
}
