using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdSearchByCodeForDiscountRequest : IRequestModel
    {
        public string effectiveDateTo { get; set; }
        public string effectiveDateFrom { get; set; }
        public int productID { get; set; }
        public int currencyID { get; set; }
        public int customerID { get; set; }
        public int unitTypeID { get; set; }
    }
}
