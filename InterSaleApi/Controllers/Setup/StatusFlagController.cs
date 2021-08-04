using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API.StatusFlag;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/StatusFlag")]
    public class StatusFlagController : Controller
    {
        [HttpGet("GetForApproval")]
        public dynamic GetForApproval([FromHeader] string token, [FromQuery] int tableID)
        {
            GetForApprovalAPI res = new GetForApprovalAPI();
            var data = new { id = tableID };
            return res.Execute(token, data);
        }
    }
}
