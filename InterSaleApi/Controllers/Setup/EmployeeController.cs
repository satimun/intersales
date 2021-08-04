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
    [Route("v1/api/Employee")]
    public class EmployeeController : Controller
    {

        [HttpGet("searchSale/{token}")]
        public dynamic SearchSale(string token, [FromQuery] string search, [FromQuery] string[] status)
        {
            EmployeeSearchSaleAPI exc = new EmployeeSearchSaleAPI();
            var res = exc.Execute(token, new { search = search, status = status });
            return res;
        }
    }
}