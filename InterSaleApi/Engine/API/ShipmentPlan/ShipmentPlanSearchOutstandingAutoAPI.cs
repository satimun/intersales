using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.Util;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanSearchOutstandingAutoAPI : ShipmentPlanSearchOutstandingAPI
    {
        protected override void ExecuteChild(ShipmentPlanSearchOutstandingRequest dataRequest, ShipmentPlanSearchOutstandingResponse dataResponse)
        {
            dataRequest.planType = "M";
            dataRequest.admitDateFrom = DateTimeUtil.GetDateString(new DateTime(dataRequest.planYear - 2, 1, 1));
            var d = new DateTime(dataRequest.planYear, dataRequest.planMonth, 1);
            d = d.AddMonths(2).AddDays(-1);//.AddMonths(1).AddDays(-1);
            dataRequest.admitDateTo = DateTimeUtil.GetDateString(d);
            base.ExecuteChild(dataRequest, dataResponse);
        }
    }
}
