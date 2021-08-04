using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanHDCriteria
    {
        public int HID { get; set; }
        public int DID { get; set; }
        public DateTime PlanDate { get; set; }
        public int PlanWeek { get; set; }
        public int ShipmentPlanOrderStandID { get; set; }
        public int CustomerID { get; set; }
        public decimal PlanQuatity { get; set; }
        public decimal PlanWeightKG { get; set; }
        public decimal PlanBale { get; set; }
        public decimal PlanValue { get; set; }
    }
}
