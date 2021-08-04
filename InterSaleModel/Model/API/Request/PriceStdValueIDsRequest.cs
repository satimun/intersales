using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdValueIDsRequest : IRequestModel
    {
        public List<int> priceStdValueIDs = new List<int>();
    }
}
