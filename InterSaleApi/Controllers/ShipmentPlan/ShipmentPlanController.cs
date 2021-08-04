using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API.ShipmentPlanMain;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.API.ShipmentPlan;
using KKFCoreEngine.Util;

namespace InterSaleApi.Controllers.ShipmentPlan
{
    [Produces("application/json")]
    [Route("v1/api/ShipmentPlan")]
    public class ShipmentPlanController : Controller
    {

        [HttpGet("SearchOutstanding/{token}")]
        public dynamic SearchOutstanding(string token,
            [FromQuery] string admitDateFrom,
            [FromQuery] string admitDateTo,
            [FromQuery] string[] customerCodes,
            [FromQuery] string[] productTypeCodes,
            [FromQuery] int option,
            [FromQuery] int planMonth,
            [FromQuery] int planYear,
            [FromQuery] string planType,
            [FromQuery] bool IgnoreAdmitDate)
        {
            ShipmentPlanSearchOutstandingAPI exc = new ShipmentPlanSearchOutstandingAPI();
            var res = exc.Execute(token, new
            {
                admitDateFrom = admitDateFrom,
                admitDateTo = admitDateTo,
                customerCodes = customerCodes,
                productTypeCodes = productTypeCodes,
                option = option // 1 = close by bill landing   2 = close by Ci
                , planMonth = planMonth
                , planYear = planYear
                , planType = planType
                , IgnoreAdmitDate = IgnoreAdmitDate
            });
            return res;
        }

        [HttpGet("SearchOutstandingAuto/{token}")]
        public dynamic SearchOutstandingAuto(string token,
            [FromQuery] int planMonth,
            [FromQuery] int planYear,
            [FromQuery] string customerCode,
            [FromQuery] int option
            )
        {
            ShipmentPlanSearchOutstandingAutoAPI exc = new ShipmentPlanSearchOutstandingAutoAPI();
            var res = exc.Execute(token, new
            {
                planMonth = planMonth,
                planYear = planYear,
                customerCodes = new string[] { customerCode },
                option = option
            });
            return res;
        }
        

        [HttpGet("SearchOutstandingExcel/{token}")]
        public dynamic SearchOutstandingExcel(string token,
            [FromQuery] string customerCode,
            [FromQuery] string[] orderCodes,
            [FromQuery] string[] prodCodes,
            [FromQuery] decimal[] ouantitys)
        {
            ShipmentPlanSearchOutstandingExcelAPI exc = new ShipmentPlanSearchOutstandingExcelAPI();
            var res = exc.Execute(token, new
            {
                customerCode = customerCode,
                orderCodes = orderCodes,
                prodCodes = prodCodes,
                ouantitys = ouantitys
            });
            return res;
        }

        [HttpPost("AutoPlan/{token}")]
        public dynamic AutoPlan(string token, [FromBody] dynamic data)
        {
            ShipmentPlanAutoPlanAPI exc = new ShipmentPlanAutoPlanAPI();
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpPost("ClientAutoPlan/{token}")]
        public dynamic ClientAutoPlan(string token, [FromBody] dynamic data)
        {
            ShipmentPlanClientAutoPlanAPI exc = new ShipmentPlanClientAutoPlanAPI();
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpPost("RecalculatePlan/{token}")]
        public dynamic RecalculatePlan(string token, [FromBody] dynamic data)
        {
            ShipmentPlanRecalculatePlanAPI exc = new ShipmentPlanRecalculatePlanAPI();
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpGet("SearchCost/{token}")]
        public dynamic SearchCost(string token, [FromQuery] int year)
        {
            ShipmentPlanSearchCostAPI exc = new ShipmentPlanSearchCostAPI();
            var res = exc.Execute(token, new { year = year });
            return res;
        }

        //[HttpGet("GetReport/{token}")]
        //public dynamic GetReport(string token
        //    , [FromQuery] string planType
        //    , [FromQuery] string planTypeCompare
        //    , [FromQuery] int planMonth
        //    , [FromQuery] int planYear
        //    , [FromQuery] int costID
        //    , [FromQuery] int? saleEmployeeID
        //    , [FromQuery] int[] zoneAccountIDs)
        //{
        //    ShipmentPlanGetReportAPI exc = new ShipmentPlanGetReportAPI();
        //    var res = exc.Execute(token, new
        //    {
        //        planType = planType,
        //        planTypeCompare = planTypeCompare,
        //        planMonth = planMonth,
        //        planYear = planYear,
        //        costID = costID,
        //        saleEmployeeID = saleEmployeeID,
        //        zoneAccountIDs = zoneAccountIDs
        //    });
        //    return res;
        //}

        [HttpGet("ListContainerSize/{token}")]
        public dynamic ListContainerSize(string token)
        {
            ShipmentPlanListContainerSizeAPI exc = new ShipmentPlanListContainerSizeAPI();
            var res = exc.Execute(token, new { });
            return res;
        }

        [HttpGet("GetCompareReport/{token}")]
        public dynamic GetCompareReport(string token
            , [FromQuery] string planType
            , [FromQuery] string planTypeCompare
            , [FromQuery] int planMonth
            , [FromQuery] int planYear
            , [FromQuery] int? saleEmployeeID
            , [FromQuery] int[] zoneAccountIDs
            , [FromQuery] int[] regionalZoneIDs
            , [FromQuery] int[] weeks)
        {
            ShipmentPlanGetCompareReportAPI exc = new ShipmentPlanGetCompareReportAPI();
            var res = exc.Execute(token, new
            {
                planType = planType,
                planTypeCompare = planTypeCompare,
                planMonth = planMonth,
                planYear = planYear,
                saleEmployeeID = saleEmployeeID,
                zoneAccountIDs = zoneAccountIDs
                , regionalZoneIDs = regionalZoneIDs
                , weeks = weeks
            });
            return res;
        }
        [HttpGet("GetForecastReport/{token}")]
        public dynamic GetForecastReport(string token
            , [FromQuery] string dateFrom
            , [FromQuery] string dateTo
            , [FromQuery] int costID
            , [FromQuery] int[] regionalZoneIDs
            , [FromQuery] int[] zoneAccountIDs
            , [FromQuery] int[] customerIDs
            , [FromQuery] int? saleEmployeeID)
        {
            ShipmentPlanGetForecastReportAPI exc = new ShipmentPlanGetForecastReportAPI();
            var res = exc.Execute(token, new
            {
                dateFrom = dateFrom
                , dateTo = dateTo
                , costID = costID
                , regionalZoneIDs = regionalZoneIDs
                , zoneAccountIDs = zoneAccountIDs
                , customerIDs = customerIDs
                , saleEmployeeID = saleEmployeeID
            });
            return res;
        }

        [HttpPost("GetForecastReport2")]
        public dynamic GetForecastReport2([FromHeader] string token, [FromBody] dynamic data)
        {
            ShipmentPlanGetForecastReport2API exc = new ShipmentPlanGetForecastReport2API();
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpGet("ListRegionalZone/{token}")]
        public dynamic GetForecastReport(string token)
        {
            ShipmentPlanListRegionalZoneAPI exc = new ShipmentPlanListRegionalZoneAPI();
            var res = exc.Execute(token, new{});
            return res;
        }

        [HttpGet("GetShipmentStatus/{token}")]
        public dynamic GetShipmentStatus(string token)
        {
            ConstantShipmentStatusAPI exc = new ConstantShipmentStatusAPI();
            var res = exc.Execute(token, new { });
            return res;
        }

        [HttpPost("SalesApprove/{token}")]
        public dynamic SalesApprove(string token, [FromBody] dynamic data)
        {
            ShipmentPlanSalseApprvoeAPI exc = new ShipmentPlanSalseApprvoeAPI();
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpPost("RegionalApprove/{token}")]
        public dynamic RegionalApprove(string token, [FromBody] dynamic data)
        {
            ShipmentPlanRegionalApproveAPI exc = new ShipmentPlanRegionalApproveAPI();
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpPost("ManagerApprove/{token}")]
        public dynamic ManagerApprove(string token, [FromBody] dynamic data)
        {
            ShipmentPlanManagerApproveAPI exc = new ShipmentPlanManagerApproveAPI();
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpGet("GetPackList/{token}")]
        public dynamic GetPackList(string token, [FromQuery] int planMonth, [FromQuery] int planYear, [FromQuery] int[] customerIDs)
        {
            ShipmentPlanGetPackListAPI exc = new ShipmentPlanGetPackListAPI();
            var data = new
            {
                planMonth = planMonth,
                planYear = planYear,
                customerIDs = customerIDs
            };
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpPost("GetOutstanding/{token}")]
        public dynamic GetOutstanding(string token, [FromBody] dynamic data)
        {
            ShipmentPlanGetOutstandingAPI exc = new ShipmentPlanGetOutstandingAPI();
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpGet("GetActual/{token}")]
        public dynamic GetActual(string token,
            [FromQuery] string dateFrom
            , [FromQuery] string dateTo
            , [FromQuery] int? zoneID
            , [FromQuery] int? countryID
            , [FromQuery] int? customerID
            , [FromQuery] string productType
            , [FromQuery] string diamerter
            , [FromQuery] string color
            , [FromQuery] bool otherProduct )
        {
            ShipmentPlanGetActualAPI exc = new ShipmentPlanGetActualAPI();
            var data = new {
                dateFrom = dateFrom
                , dateTo = dateTo
                , zoneID = zoneID
                , countryID = countryID
                , customerID = customerID
                , productType = StringUtil.GetStringValue(productType)
                , diamerter = StringUtil.GetStringValue(diamerter)
                , color = StringUtil.GetStringValue(color)
                , otherProduct = otherProduct
            };
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpGet("BookingTransport/{token}")]
        public dynamic BookingTransport(string token,
            [FromQuery] int planMonth
            , [FromQuery] int planYear
            , [FromQuery] int[] regionalZoneIDs
            , [FromQuery] int[] zoneAccountIDs
            , [FromQuery] int[] customerIDs
            , [FromQuery] int[] weeks)
        {
            ShipmentPlanBookingTransportAPI exc = new ShipmentPlanBookingTransportAPI();
            var data = new
            {
                planMonth = planMonth
                , planYear = planYear
                , regionalZoneIDs = regionalZoneIDs
                , zoneAccountIDs = zoneAccountIDs
                , customerIDs = customerIDs
                , weeks = weeks
            };
            var res = exc.Execute(token, data);
            return res;
        }

        [HttpPost("MarkBookigTransport/{token}")]
        public dynamic MarkBookigTransport(string token, [FromBody] dynamic data)
        {
            // planHID, portLoadingID
            ShipmentPlanMarkBookingTransportAPI res = new ShipmentPlanMarkBookingTransportAPI();
            return res.Execute(token, data);
        }

        [HttpGet("GetCustomerGroup/{token}")]
        public dynamic GetCustomerGroup(string token, [FromQuery] string[] customerIDs)
        {
            ShipmentPlanGetCustomerGroupAPI res = new ShipmentPlanGetCustomerGroupAPI();
            var data = new { id = customerIDs };
            return res.Execute(token, data);
        }

        [HttpGet("SearchPlan/{token}")]
        public dynamic SearchPlan(string token
            , [FromQuery] int planMonth
            , [FromQuery] int planYear
            , [FromQuery] int[] saleEmployeeIDs
            , [FromQuery] int[] zoneAccountIDs
            , [FromQuery] int[] customerIDs
            , [FromQuery] int[] regionalZoneIDs
            , [FromQuery] int option
            , [FromQuery] bool showOutstand)
        {
            ShipmentPlanSearchPlanAPI exc = new ShipmentPlanSearchPlanAPI();
            var res = exc.Execute(token, new
            {
                planMonth = planMonth,
                planYear = planYear,
                saleEmployeeIDs = saleEmployeeIDs,
                zoneAccountIDs = zoneAccountIDs,
                customerIDs = customerIDs,
                regionalZoneIDs = regionalZoneIDs,
                option = option,
                showOutstand = showOutstand
            });
            return res;
        }

        [HttpGet("GetRemark/{token}")]
        public dynamic GetRemark(string token
            , [FromQuery] string planType
            , [FromQuery] int planMonth
            , [FromQuery] int planYear
            , [FromQuery] int? saleEmployeeID
            , [FromQuery] int[] zoneAccountIDs
            , [FromQuery] int option)
        {
            ShipmentPlanGetRemarkAPI exc = new ShipmentPlanGetRemarkAPI();
            var res = exc.Execute(token, new
            {
                planType = planType,
                planMonth = planMonth,
                planYear = planYear,
                saleEmployeeID = saleEmployeeID,
                zoneAccountIDs = zoneAccountIDs
                , option = option
            });
            return res;
        }

        [HttpPost("SaveRemark/{token}")]
        public dynamic SaveRemark(string token, [FromBody] dynamic data)
        {
            ShipmentPlanSaveRemarkAPI exc = new ShipmentPlanSaveRemarkAPI();
            return exc.Execute(token, data);
        }

        [HttpGet("GetReport2/{token}")]
        public dynamic GetReport2(string token
            , [FromQuery] string type
            , [FromQuery] string compare
            , [FromQuery] int year
            , [FromQuery] int monthFrom
            , [FromQuery] int monthTo
            , [FromQuery] string[] regionalZoneIDs
            , [FromQuery] string[] zoneAccountIDs
            , [FromQuery] string[] saleEmployeeIDs
            , [FromQuery] int[] weeks
            , [FromQuery] int option)
        {
            ShipmentPlanGetReport2API exc = new ShipmentPlanGetReport2API();
            var res = exc.Execute(token, new
            {
                type = type,
                compare = compare,
                year = year,
                monthFrom = monthFrom,
                monthTo = monthTo,
                regionalZoneIDs = regionalZoneIDs
                , zoneAccountIDs = zoneAccountIDs
                , saleEmployeeIDs = saleEmployeeIDs
                , option = option
                , weeks = weeks
            });
            return res;
        }

        [HttpGet("PlanVsActualReport/{token}")]
        public dynamic PlanVsActualReport(string token
            , [FromQuery] string type
            , [FromQuery] string compare
            , [FromQuery] int year
            , [FromQuery] int monthFrom
            , [FromQuery] int monthTo
            , [FromQuery] string[] regionalZoneIDs
            , [FromQuery] string[] zoneAccountIDs
            , [FromQuery] string[] saleEmployeeIDs
            , [FromQuery] int[] weeks
            , [FromQuery] int option)
        {
            ShipmentPlanVsActualReport exc = new ShipmentPlanVsActualReport();
            var res = exc.Execute(token, new
            {
                type = type,
                compare = compare,
                year = year,
                monthFrom = monthFrom,
                monthTo = monthTo,
                regionalZoneIDs = regionalZoneIDs,
                zoneAccountIDs = zoneAccountIDs,
                saleEmployeeIDs = saleEmployeeIDs,
                option = option,
                weeks = weeks
            });
            return res;
        }

    }
}
