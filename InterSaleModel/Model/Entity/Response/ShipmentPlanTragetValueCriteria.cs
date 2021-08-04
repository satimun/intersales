using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
   public  class ShipmentPlanTragetValueCriteria
    {
        public string ZoneID { get; set; }
        public string ZoneCode { get; set; }
        public string CountryID { get; set; }
        public string CountryCode { get; set; }
        public string CustomerID { get; set; }
        public string CustomerCode { get; set; }
        public int PlanMonth { get; set; }
        public int PlanYear { get; set; }
        public string CurrencyCode { get; set; }
        public decimal PlanValue { get; set; }
        public decimal PlanValueTHB { get; set; }

    }
}
