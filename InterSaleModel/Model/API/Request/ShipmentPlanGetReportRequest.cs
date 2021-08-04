using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanGetReportRequest : IRequestModel
    {
        public string planType { get; set; }
        public string planTypeCompare { get; set; }
        public int planMonth { get; set; }
        public int planYear { get; set; }
        public int costID { get; set; }
        public int? saleEmployeeID { get; set; }
        public List<int> zoneAccountIDs { get; set; }
        public List<int> regionalZoneIDs { get; set; }
        public List<int> weeks { get; set; }
        public List<int> customerIDs { get; set; }
        public int planMonthFrom { get; set; }
        public int planMonthTo { get; set; }
        public int option { get; set; }
    }
}
