using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Jobs.Request
{
    public class ShipmentPlanOutstandProcessReq : IJRequestModel
    {
        public string admitDateFrom { get; set; }
        public string admitDateTo { get; set; }
        public int option { get; set; }
    }
}
