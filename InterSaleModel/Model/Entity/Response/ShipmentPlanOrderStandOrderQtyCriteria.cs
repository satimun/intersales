using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanOrderStandOrderQtyCriteria
    {
        public string Order_Code { get; set; }
        public int ItemNo { get; set; }
        public DateTime PlanDate { get; set; }
        public decimal PlanQuatity { get; set; }
        public decimal PlanBale { get; set; }
        public decimal PlanWeightKG { get; set; }
        public decimal DelQuatity { get; set; }
        public decimal DelBale { get; set; }
        public decimal DelWeightKG { get; set; }
    }
}
