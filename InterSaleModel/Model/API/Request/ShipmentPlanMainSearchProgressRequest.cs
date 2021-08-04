using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanMainSearchProgressRequest : IRequestModel
    {
        public int planMonth { get; set; }
        public int planYear { get; set; }
        public List<int> saleEmployeeIDs { get; set; }
        public List<int> zoneAccountIDs { get; set; }
        public List<int> customerIDs { get; set; }
        public List<string> monthlyStatus { get; set; }
        public List<string> weeklyStatus { get; set; }
        public List<string> regzoneCodes { get; set; }
        
    }
}
