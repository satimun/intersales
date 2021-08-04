using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.API.AvgDayAmtKPI;
using InterSaleApi.Engine.API.PortLoading;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/AvgDayAmtKPI")]
    public class AvgDayAmtKPIController : Controller
    {
        [HttpGet("Search")]
        public dynamic Search([FromHeader] string token, [FromQuery] string[] year, [FromQuery] string[] zoneAccountIDs, [FromQuery] string[] status)
        {
            AvgDayAmtKPISearchAPI res = new AvgDayAmtKPISearchAPI();
            var data = new { ids = year, ids1 = zoneAccountIDs, status = status };
            return res.Execute(token, data);
        }

        [HttpPost("Save")]
        public dynamic Save([FromHeader] string token, [FromBody] dynamic data)
        {
            AvgDayAmtKPISaveAPI res = new AvgDayAmtKPISaveAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateStatus")]
        public dynamic UpdateStatus([FromHeader] string token, [FromBody] dynamic data)
        {
            AvgDayAmtKPIUpdateStatusAPI res = new AvgDayAmtKPIUpdateStatusAPI();
            return res.Execute(token, data);
        }
    }
}