using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanGetActualRes : IResponseModel
    {
        public List<Actual> actuals = new List<Actual>();
        public class Actual
        {
            public string ciCode { get; set; }
            public string ciDate { get; set; }
            public PublicModel.INTIdCodeDescriptionModel customer { get; set; }
            public WeightValue actual { get; set; }
            public WeightValue other { get; set; }
            public class WeightValue
            {
                public decimal weightKg { get; set; }
                public int amountpc { get; set; }
                public decimal value { get; set; }
            } 
        }
        
    }
}
