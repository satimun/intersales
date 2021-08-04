using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Jobs.Request
{
    public class ShipmentPlanReplacePlanReq : IJRequestModel
    {
        public int? planYear { get; set; }
        public int? planMonth { get; set; }
        public int? planWeek { get; set; }
    }
}
