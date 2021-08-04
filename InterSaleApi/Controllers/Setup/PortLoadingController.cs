using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.API.PortLoading;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/PortLoading")]
    public class PortLoadingController : Controller
    {
        [HttpGet("Search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids, [FromQuery] string search, [FromQuery] string[] status)
        {
            PortLoadingSearchAPI res = new PortLoadingSearchAPI();
            var data = new { ids = ids, search = search, status = status };
            return res.Execute(token, data);
        }

        [HttpPost("Save/{token}")]
        public dynamic Save(string token, [FromBody] dynamic data)
        {
            PortLoadingSaveAPI res = new PortLoadingSaveAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatus/{token}")]
        public dynamic UpdateStatus(string token, [FromBody] dynamic data)
        {
            PortLoadingUpdateStatusAPI res = new PortLoadingUpdateStatusAPI();
            return res.Execute(token, data);
        }
    }
}
