using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdSearchRequest : IRequestModel
    {
        public int @priceEffectiveDateID { get; set; }
        public string search { get; set; }
        public string priceStdValueStatus { get; set; }
    }
}
