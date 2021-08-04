using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/ZoneAccount")]
    public class ZoneAccountController : Controller
    {
        [HttpGet("search/{token}")]
        public dynamic Search(string token, [FromQuery] string search, [FromQuery] List<string> status)
        {
            InterSaleApi.Engine.API.ZoneAccountSearchAPI exc = new Engine.API.ZoneAccountSearchAPI();
            var res = exc.Execute(token, new { search = search, status = status });
            return res;
        }
    }
}
