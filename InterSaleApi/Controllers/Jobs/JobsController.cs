using InterSaleApi.Engine.Jobs;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace InterSaleApi.Controllers.Jobs
{
    [Produces("application/json")]
    [Route("v1/api/Jobs")]
    public class JobsController : Controller
    {
        [HttpPost("ShipmentPlanReplacePlan")]
        public dynamic ShipmentPlanReplacePlan([FromBody] dynamic data)
        {
            ShipmentPlanReplacePlanJobs job = new ShipmentPlanReplacePlanJobs();
            var res = job.Execute(data);
            return res;
        }

        [HttpPost("PridStdImportDataFromSaleEx")]
        public dynamic PridStdImportDataFromSaleEx([FromBody] dynamic data)
        {
            PriceStdImportDataFromSaleExJobs job = new PriceStdImportDataFromSaleExJobs();
            var res = job.Execute(data);
            return res;
        }

        [HttpPost("DiscountStdImportDataFromSaleEx")]
        public dynamic DiscountStdImportDataFromSaleEx([FromBody] dynamic data)
        {
            DiscountStdImportDataFromSaleExJobs job = new DiscountStdImportDataFromSaleExJobs();
            var res = job.Execute(data);
            return res;
        }

        [HttpPost("ShipmentPlanOutstandProcess")]
        public dynamic ShipmentPlanOutstandProcess([FromBody] dynamic data)
        {
            ShipmentPlanOutstandProcessJobs job = new ShipmentPlanOutstandProcessJobs();
            var res = job.Execute(data);
            return res;
        }

    }
}