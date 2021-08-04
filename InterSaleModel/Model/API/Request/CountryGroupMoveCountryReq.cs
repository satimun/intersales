using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CountryGroupMoveCountryReq : IRequestModel
    {
        public int? countryGroupID { get; set; }
        public string groupType { get; set; }
        public List<int> countryIDs { get; set; }
    }
}
