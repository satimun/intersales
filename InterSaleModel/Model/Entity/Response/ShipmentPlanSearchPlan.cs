using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanSearchPlan
    {
        public int customerID { get; set; }
        public string customerCode { get; set; }
        public string customerDes { get; set; }
        public string favoriteFlag { get; set; }

        public int zoneID { get; set; }
        public string zoneCode { get; set; }
        public string zoneDes { get; set; }

        public int countryID { get; set; }
        public string countryCode { get; set; }
        public string countryDes { get; set; }

        public int ShipmentPlanMain_ID { get; set; }
        public string ShipmentPlanMain_Status { get; set; }
        public string PlanType { get; set; }

        public int ShipmentPlanD_ID { get; set; }

        public int ShipmentPlanH_ID { get; set; }
        public string ShipmentPlanH_Status { get; set; }

        public int ShipmentPlanOrderStand_ID { get; set; }
        public string portCode { get; set; }
        public string portDes { get; set; }

    }
}
