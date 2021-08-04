using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API.ShipmentPlanMain;
using InterSaleApi.Engine.API.ShipmentPlan;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/ShipmentPlanDateCircle")]
    public class ShipmentPlanDateCircleController : Controller
    {

        [HttpGet("Get/{token}")]
        public dynamic Get(string token, [FromQuery] int customerID)
        {
            ShipmentPlanDateCircleGetAPI exc = new ShipmentPlanDateCircleGetAPI();
            var res = exc.Execute(token, new { customerID = customerID });
            return res;
        }

        [HttpGet("SearchCustomer/{token}")]
        public dynamic SearchCustomer(string token, [FromQuery] string search, [FromQuery] string[] status)
        {
            var exc = new ShipmentPlanDateCircleSearchCustomerAPI();
            return exc.Execute(token, new { search = search, status = status });
        }

        [HttpPost("Save/{token}")]
        public dynamic Save(string token, [FromBody] dynamic data)
        {
            var exc = new ShipmentPlanDateCircleSaveAPI();
            return exc.Execute(token, data);
        }

    }
}