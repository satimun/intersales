using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanApproveReq : IRequestModel
    {
        public List<int> shipmentHID { get; set; }
        public string status { get; set; }
        public string approve { get; set; } // Y, N, C
    }
}
