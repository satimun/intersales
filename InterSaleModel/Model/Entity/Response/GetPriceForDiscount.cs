using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class GetPriceForDiscount
    {
        public int priceStdValueID { get; set; }
        public string priceStdTableType { get; set; }
        public string priceStdTableCode { get; set; }
        public string productDescription { get; set; }
        public string countryGroupDescription { get; set; }

        public DateTime effectiveDateFrom { get; set; }
        public DateTime effectiveDateTo { get; set; }

        public decimal priceFOB { get; set; }
        public decimal priceCAF { get; set; }
        public decimal priceCIF { get; set; }

        public string effectiveStatus { get; set; }
        public string priceStatus { get; set; }
    }
}
