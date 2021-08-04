using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdSearchPriceRangeValueRequest : IRequestModel
    {
        public int priceEffectiveDateID { get; set; }
        public int priceRangeHID { get; set; }
        public List<string> status { get; set; }
    }
}
