using InterSaleModel.Model.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Jobs
{
    public class ShipmentPlanReplacePlan
    {
        public List<PlanH> planHs = new List<PlanH>();
        public class PlanH
        {
            public int? ID { get; set; }
            public string RefID { get; set; }
            public string Container_Code { get; set; }
            public int PlanWeek { get; set; }
            public DateTime PlanDate { get; set; }
            public string Status { get; set; }

            public int? Remark_ID { get; set; }
            public List<int> customerIDs = new List<int>();

            public string packListCode { get; set; }


            public List<PlanD> planDs = new List<PlanD>();

            public class PlanD
            {
                public int? ID { get; set; }
                public int ShipmentPlanOrderStand_ID { get; set; }
                public int Customer_ID { get; set; }
                public decimal PlanQuatity { get; set; }
                public decimal PlanWeightKG { get; set; }
                public decimal PlanBale { get; set; }
                public decimal PlanValue { get; set; }
                public decimal PlanVolume { get; set; }
                public string Status { get; set; }
            }
        }
    }
}
