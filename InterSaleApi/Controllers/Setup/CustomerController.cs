using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/Customer")]
    public class CustomerController : Controller
    {
        [HttpGet("find/{token}")]
        public dynamic Find(string token, [FromQuery] dynamic data)
        {
            //throw new Exception("404");
            return null;
        }

        [HttpGet("list/{token}")]
        public dynamic List(string token)
        {
            CustomerListAPI res = new CustomerListAPI();
            return res.Execute(token);
        }

        [HttpGet("search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            CustomerSearchAPI exc = new CustomerSearchAPI();

            var res = exc.Execute(token, new { ids = ids, codes = codes, search = search, status = status });
            return res;
        }

        [HttpGet("search")]
        public dynamic Search2([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            CustomerSearchAPI exc = new CustomerSearchAPI();
            var res = exc.Execute(token, new { ids = ids, codes = codes, search = search, status = status });
            return res;
        }
    }
}
