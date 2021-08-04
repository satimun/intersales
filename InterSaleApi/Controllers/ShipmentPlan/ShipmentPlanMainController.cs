using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.API.ShipmentPlan;
using InterSaleApi.Engine.API.ShipmentPlanMain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.ShipmentPlan
{
    [Produces("application/json")]
    [Route("v1/api/ShipmentPlanMain")]
    public class ShipmentPlanMainController : Controller
    {
        [HttpGet("SearchProgress/{token}")]
        public dynamic SearchProgress(
            string token,
            [FromQuery]int planMonth,
            [FromQuery]int planYear,
            [FromQuery]int[] saleEmployeeIDs,
            [FromQuery]int[] zoneAccountIDs,
            [FromQuery]int[] customerIDs,
            [FromQuery]string[] monthlyStatus,
            [FromQuery]string[] weeklyStatus
            ,[FromQuery]string[] regzoneCodes)
        {
            var exc = new ShipmentPlanMainSearchProgressAPI();
            var res = exc.Execute(token, new
            {
                planMonth = planMonth,
                planYear = planYear,
                saleEmployeeIDs = saleEmployeeIDs,
                zoneAccountIDs = zoneAccountIDs,
                customerIDs = customerIDs,
                monthlyStatus = monthlyStatus,
                weeklyStatus = weeklyStatus,
                regzoneCodes = regzoneCodes
            });
            return res;
        }

        [HttpPost("Remove/{token}")]
        public dynamic Remove(string token, [FromBody] dynamic data)
        {
            var res = new ShipmentPlanMainRemoveAPI();
            return res.Execute(token, data);
        }

        [HttpPost("InsertMonthlyInit/{token}")]
        public dynamic InsertMonthlyInit(string token, [FromBody] dynamic data)
        {
            var res = new ShipmentPlanMainInsertMonthlyInitAPI();
            return res.Execute(token, data);
        }

        [HttpGet("GetPlan/{token}")]
        public dynamic GetPlan(string token, [FromQuery] int shipmentPlanMainID)
        {
            var res = new ShipmentPlanMainGetPlanAPI();
            return res.Execute(token, new { shipmentPlanMainID = shipmentPlanMainID });
        }

        [HttpPost("SavePlan/{token}")]
        public dynamic SavePlan(string token, [FromBody] dynamic data)
        {

            var res = new ShipmentPlanMainSavePlanAPI();
            return res.Execute(token, data);
        }
        
        [HttpPost("GetStatus/{token}")]
        public dynamic GetStatus(string token, [FromBody] dynamic data) 
        {
            var exc = new ShipmentPlanMainGetStatus();
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpGet("GetPlanForApprove/{token}")]
        public dynamic GetPlanForApprove(string token,
            [FromQuery]int planMonth,
            [FromQuery]int planYear,
            [FromQuery]int[] regionalManagerIDs,
            [FromQuery]int[] saleEmployeeIDs,
            [FromQuery]int[] regionalZoneIDs,
            [FromQuery]int[] countryIDs,
            [FromQuery]int[] zoneAccountIDs,
            [FromQuery]int[] customerIDs,
            [FromQuery]string shipmentStatus
            , [FromQuery] int step)
        {
            var exc = new ShipmentPlanMainGetPlanForApproveAPI();
            var res = exc.Execute(token, new
            {
                planMonth = planMonth,
                planYear = planYear,
                regionalManagerIDs = regionalManagerIDs,
                saleEmployeeIDs = saleEmployeeIDs,
                regionalZoneIDs = regionalZoneIDs,
                countryIDs = countryIDs,
                zoneAccountIDs = zoneAccountIDs,
                customerIDs = customerIDs,
                shipmentStatus = shipmentStatus,
                step = step
            });
            return res;
        }


    }
}