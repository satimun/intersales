using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class OrderOnhandReportRes : IResponseModel
    {
        public List<OrderOnhand> orders;
        public class OrderOnhand
        {
            public PublicModel.INTIdCodeDescriptionModel zone;
            public PublicModel.INTIdCodeDescriptionModel country;
            public PublicModel.INTIdCodeDescriptionModel customer;
            public PublicModel.INTIdCodeDescriptionModel productType;
            public string materialGroup;
            public string diameterGroup;
            public string diameter;
            public string currencyCode;
            public PublicModel.INTIdCodeDescriptionModel color;
            public Balance proforma;
            public Balance delivered;
            public Balance outstanding;
            public Balance inventory;
            public Balance expecting;

            public string _key;
            
            public class Balance
            {
                public decimal quantity { get; set; }
                public decimal bale { get; set; }
                public decimal weight { get; set; }
                public decimal volume { get; set; }
                public List<Values> values { get; set; }
                public decimal valueTHB { get; set; }
            }
            
            public class Values
            {
                public decimal num { get; set; }
                public string code { get; set; }
            }
        }      

    }
}
