using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class DiscountStdSearchDiscountForPriceRes : IResponseModel
    {
        public List<discount> discounts = new List<discount>();
        public class discount
        {
            public int discountStdValueID { get; set; }
            public string discountStdTableType { get; set; }
            public string discountStdTableCode { get; set; }
            public string tagDescription { get; set; }
            public string salesDescription { get; set; }
            public string customerDescription { get; set; }

            public string effectiveDateFrom { get; set; }
            public string effectiveDateTo { get; set; }

            public decimal discountPercent { get; set; }
            public decimal discountAmount { get; set; }
            public decimal increaseAmount { get; set; }

            public string effectiveStatus { get; set; }
            public string discountStatus { get; set; }
            public string approvedFlag { get; set; }
            public string approvedStatus { get; set; }
        }
    }
}
