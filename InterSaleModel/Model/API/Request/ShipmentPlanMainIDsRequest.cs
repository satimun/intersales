using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanMainIDsRequest : IRequestModel
    {
        public List<int> shipmentPlanMainIDs { get; set; }
    }
}
