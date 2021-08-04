using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProformaInvoiceGetActualRes : IResponseModel
    {        
        public List<Actual> actuals = new List<Actual>();
        public class Actual
        {
            public string piCode { get; set; }
            public string piDate { get; set; }
            public PublicModel.INTIdCodeDescriptionModel customer { get; set; }
            public WeightValue actual { get; set; }
            public class WeightValue
            {
                public decimal weightKg { get; set; }
                public int amountpc { get; set; }
                public decimal value { get; set; }
            }
        }
    }
}
