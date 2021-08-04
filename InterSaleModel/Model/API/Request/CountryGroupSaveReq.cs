using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CountryGroupSaveReq : IRequestModel
    {
        public List<SearchResModel> countryGroups { get; set; }
    }
}
