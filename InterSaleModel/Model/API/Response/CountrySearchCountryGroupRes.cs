using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CountrySearchCountryGroupRes : IResponseModel
    {
        public List<Country> countrys = new List<Country>();
        public class Country : SearchResModel
        {
            public INTIdCodeDescriptionModel countryGroup { get; set; }
            public INTIdCodeDescriptionModel regionalZone { get; set; }
            public INTIdCodeDescriptionModel zone { get; set; }
        }
    }
}
