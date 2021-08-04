using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdSearchPriceForDiscountRes : IResponseModel
    {
        public List<price> prices = new List<price>();
        public class price
        {
            public int priceStdValueID { get; set; }
            public string priceStdTableType { get; set; }
            public string priceStdTableCode { get; set; }
            public string tagDescription { get; set; }
            public string salesDescription { get; set; }
            public string countryGroupDescription { get; set; }

            public string effectiveDateFrom { get; set; }
            public string effectiveDateTo { get; set; }

            public decimal priceFOB { get; set; }
            public decimal priceCAF { get; set; }
            public decimal priceCIF { get; set; }

            public string effectiveStatus { get; set; }
            public string priceStatus { get; set; }
        }
    }
}
