using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxtShipmentPlanD
    {
        public int? ID { get; set; }
        public string RefID { get; set; }
        public int ShipmentPlanMain_ID { get; set; }
        public int ShipmentPlanOrderStand_ID { get; set; }
        public int ShipmentPlanH_ID { get; set; }
        public int Customer_ID { get; set; }
        public decimal PlanQuatity { get; set; }
        public decimal PlanWeightKG { get; set; }
        public decimal PlanBale { get; set; }
        public decimal PlanValue { get; set; }
        public decimal PlanVolume { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int ModifyBy { get; set; }
        public DateTime ModifyDate { get; set; }

        public string planType { get; set; }
        public int planMonth { get; set; }
        public int planYear { get; set; }
    }
}
