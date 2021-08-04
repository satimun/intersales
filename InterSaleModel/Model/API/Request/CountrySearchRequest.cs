using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CountrySearchRequest : IRequestModel
    {
        public int countryGroupID { get; set; }
    }
}
