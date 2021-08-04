using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class PriceStdSearchPriceForDiscount
    {
        public int priceStdValueID;
        public string priceStdTableType;
        public string priceStdTableCode;
        public string tagDescription;
        public string salesDescription;
        public string countryGroupDescription;
        public DateTime effectiveDateFrom;
        public DateTime effectiveDateTo;
        public decimal priceFOB;
        public decimal priceCAF;
		public decimal priceCIF;
		public string effectiveStatus;
        public string priceStatus;
    }
}
