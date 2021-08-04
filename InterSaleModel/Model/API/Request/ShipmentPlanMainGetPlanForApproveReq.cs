using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanMainGetPlanForApproveReq : IRequestModel
    {
        public int planMonth { get; set; }
        public int planYear { get; set; }
        public List<int> regionalManagerIDs { get; set; }
        public List<int> saleEmployeeIDs { get; set; }
        public List<int> regionalZoneIDs { get; set; }
        public List<int> countryIDs { get; set; }
        public List<int> zoneAccountIDs { get; set; }
        public List<int> customerIDs { get; set; }
        public string shipmentStatus { get; set; }
        public int step { get; set; }
        public int option { get; set; }
        public bool showOutstand { get; set; }
    }
}
