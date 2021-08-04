using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanGetReport2Req : IRequestModel
    {
        public int year { get; set; }
        public int monthFrom { get; set; }
        public int monthTo { get; set; }
        public List<string> regionalZoneIDs { get; set; }
        public List<string> zoneAccountIDs { get; set; }
        public List<string> saleEmployeeIDs { get; set; }
        public string type { get; set; }
        public string compare { get; set; }
        public int option { get; set; }
        public List<int> weeks { get; set; }
    }
}
