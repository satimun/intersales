using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class GetPrice
    {
        public dynamic productDescription { get; set; }

        public dynamic priceStdValueID { get; set; }
        public dynamic priceStdTableCode { get; set; }

        public dynamic priceFOB { get; set; }
        public dynamic priceCAF { get; set; }
        public dynamic priceCIF { get; set; }

        public DateTime effectiveFrom { get; set; }
        public DateTime effectiveTo { get; set; }

        public dynamic effectiveStatus { get; set; }
        public dynamic priceStatus { get; set; }
    }
}
