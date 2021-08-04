using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanDateCircleSaveRequest : IRequestModel
    {
        public List<ShipmentPlanDateCircles> shipmentPlanDateCircles = new List<ShipmentPlanDateCircles>();
        public class ShipmentPlanDateCircles
        {
            public int customerID { get; set; }
            public int shippingDay { get; set; }
        }
    }
}
