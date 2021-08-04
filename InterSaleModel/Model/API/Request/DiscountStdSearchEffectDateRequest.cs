using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class DiscountStdSearchEffectDateRequest : IRequestModel
    {
        public int discountStdMainID { get; set; }
        public string search { get; set; }
        public string discountStdValueStatus { get; set; }
    }
}
