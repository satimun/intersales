using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CountryGroupMoveCountryMappingRequest :IRequestModel
    {
        public int countryGroupID { get; set; }
        public List<int> countryIDs = new List<int>();
    }

   
}
