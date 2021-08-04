using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanMainGetStatusRequest : IRequestModel
    {
        public List<int> shipmentPlanMainID { get; set; }

        public int planMonth { get; set; }
        public int planYear { get; set; }
        public List<int> saleEmployeeIDs { get; set; }
        public List<int> zoneAccountIDs { get; set; }
        public List<int> customerIDs { get; set; }
        public List<int> regionalZoneIDs { get; set; }
        //public List<string> monthlyStatus { get; set; }
        //public List<string> weeklyStatus { get; set; }
        //public List<string> regzoneCodes { get; set; }
    }
}
