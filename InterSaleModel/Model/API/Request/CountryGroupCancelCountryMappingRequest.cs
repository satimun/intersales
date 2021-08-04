using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CountryGroupCancelCountryMappingRequest :IRequestModel
    {        
        public List<CountryGroupCancelCountryMappingReq> countryMappings = new List<CountryGroupCancelCountryMappingReq>();
    }

    public class CountryGroupCancelCountryMappingReq
    {
        public int CountryGroupID { get; set; }
        public int CountryID { get; set; }
    }
}
