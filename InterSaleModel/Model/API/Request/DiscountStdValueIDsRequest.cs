using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class DiscountStdValueIDsRequest : IRequestModel
    {
        public List<int> discountStdValueIDs = new List<int>();
    }
}
