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
    [Route("v1/api/Constant")]
    public class ConstantController : Controller
    {
        [HttpGet("discountStdApproveStatus/{token}")]
        public dynamic DiscountStdApproveStatus(string token)
        {
            ConstantDiscountStdApproveStatusAPI res = new ConstantDiscountStdApproveStatusAPI();
            return res.Execute(token);
        }

        [HttpGet("discountStdEffectiveDateStatus/{token}")]
        public dynamic DiscountStdEffectiveDateStatus(string token)
        {
            ConstantDiscountStdEffectiveDateStatusAPI res = new ConstantDiscountStdEffectiveDateStatusAPI();
            return res.Execute(token);
        }

        [HttpGet("discountStdMainType/{token}")]
        public dynamic DiscountStdMainType(string token)
        {
            ConstantDiscountStdMainTypeAPI res = new ConstantDiscountStdMainTypeAPI();
            return res.Execute(token);
        }


        [HttpGet("priceStdApproveStatus/{token}")]
        public dynamic PriceStdApproveStatus(string token)
        {
            ConstantPriceStdApproveStatusAPI res = new ConstantPriceStdApproveStatusAPI();
            return res.Execute(token);
        }

        [HttpGet("priceStdEffectiveDateStatus/{token}")]
        public dynamic PriceStdEffectiveDateStatus(string token)
        {
            ConstantPriceStdEffectiveDateStatusAPI res = new ConstantPriceStdEffectiveDateStatusAPI();
            return res.Execute(token);
        }

        [HttpGet("priceStdMainType/{token}")]
        public dynamic PriceStdMainType(string token)
        {
            ConstantPriceStdMainTypeAPI res = new ConstantPriceStdMainTypeAPI();
            return res.Execute(token);
        }

        [HttpGet("CountryGroupType")]
        public dynamic CountryGroupType([FromHeader] string token)
        {
            ConstantCountryGroupTypeAPI res = new ConstantCountryGroupTypeAPI();
            return res.Execute(token);
        }


        [HttpGet("customerGroupType/{token}")]
        public dynamic customerGroupType(string token)
        {
            ConstantCustomerGroupTypeAPI res = new ConstantCustomerGroupTypeAPI();
            return res.Execute(token);
        }

        [HttpGet("shipmentPlanMonthlyStatus/{token}")]
        public dynamic shipmentPlanMonthlyStatus(string token)
        {
            ConstantShipmentPlanMonthlyAPI res = new ConstantShipmentPlanMonthlyAPI();
            return res.Execute(token);
        }

        [HttpGet("shipmentPlanWeeklyStatus/{token}")]
        public dynamic shipmentPlanWeeklyStatus(string token)
        {
            ConstantShipmentPlanWeeklyAPI res = new ConstantShipmentPlanWeeklyAPI();
            return res.Execute(token);
        }

        [HttpGet("RemarkGroupType/{token}")]
        public dynamic RemarkGroupType(string token)
        {
            ConstantRemarkGroupTypeAPI res = new ConstantRemarkGroupTypeAPI();
            return res.Execute(token);
        }

        [HttpGet("DefaultStatus/{token}")]
        public dynamic DefaultStatus(string token)
        {
            ConstantDefaultStatusAPI res = new ConstantDefaultStatusAPI();
            return res.Execute(token);
        }

    }
}
