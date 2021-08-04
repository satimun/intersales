using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CountryGroupMoveCountryRes : IResponseModel
    {
        public CountryGroupSearchCountryRes.CountryGroups countryGroups = new CountryGroupSearchCountryRes.CountryGroups();
    }
}
