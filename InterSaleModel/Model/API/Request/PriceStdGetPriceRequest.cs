using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdGetPriceRequest : IRequestModel
    {
        public string effectiveDateTo { get; set; }
        public string effectiveDateFrom { get; set; }
        public string[] productCodes { get; set; }
        public string[] productGradeCodes { get; set; }
        public string currencyCode { get; set; }
        public string customerCode { get; set; }
        public string unitTypeCode { get; set; }
        public string priceStatus { get; set; }
    }
}
