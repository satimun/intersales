using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdSearchPriceForDiscountResponse : IResponseModel
    {
        public List<PriceStdsForDiscount> priceStds = new List<PriceStdsForDiscount>();
    }

    public class PriceStdsForDiscount
    {
        public int priceStdValueID { get; set; }
        public string priceStdTableType { get; set; }
        public string priceStdTableCode { get; set; }
        public string productDescription { get; set; }
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
