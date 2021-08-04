using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API.InvTurnOver;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.InvTurnOver
{
    [Produces("application/json")]
    [Route("v1/api/InvTurnOver")]
    public class InvTurnOverController : Controller
    {
        [HttpGet("Report")]
        public dynamic Search([FromHeader] string token,
            [FromQuery] int year,
            [FromQuery] int monthFrom,
            [FromQuery] int monthTo,
            [FromQuery] string[] regionalZoneIDs,
            [FromQuery] string[] zoneAccountIDs,
            [FromQuery] string[] customerIDs,
            [FromQuery] bool deadstock)
        {
            InvTurnOverReportAPI res = new InvTurnOverReportAPI();
            var data = new {
                year = year,
                monthFrom = monthFrom,
                monthTo = monthTo,
                regionalZoneIDs = regionalZoneIDs,
                zoneAccountIDs = zoneAccountIDs,
                customerIDs = customerIDs,
                deadstock = deadstock
            };
            return res.Execute(token, data);
        }

        //[HttpPost("Save")]
        //public dynamic Save([FromHeader] string token, [FromBody] dynamic data)
        //{
        //    AvgDayAmtKPISaveAPI res = new AvgDayAmtKPISaveAPI();
        //    return res.Execute(token, data);
        //}

        //[HttpPost("UpdateStatus")]
        //public dynamic UpdateStatus([FromHeader] string token, [FromBody] dynamic data)
        //{
        //    AvgDayAmtKPIUpdateStatusAPI res = new AvgDayAmtKPIUpdateStatusAPI();
        //    return res.Execute(token, data);
        //}
    }
}