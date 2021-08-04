using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class DiscountStdSearchDiscountRangeValueRequest : IRequestModel
    {
        public int discountEffectiveDateID { get; set; }
        public int discountRangeHID { get; set; }
        public string search { get; set; }
        public string discountStdValueStatus { get; set; }
    }
}
