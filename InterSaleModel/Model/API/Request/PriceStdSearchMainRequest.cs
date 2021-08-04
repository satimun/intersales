using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdSearchMainRequest : IRequestModel
    {
        public int countryGroupID { get; set; }
    }
}
