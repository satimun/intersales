using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanGetPlanRequest : IRequestModel
    {
        public int shipmentPlanMainID { get; set; }
    }
}
