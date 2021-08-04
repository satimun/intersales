using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CountryGroupListResponse : IResponseModel
    {
        public List<CountryGroupList> countryGroups = new List<CountryGroupList>();

    }

    public class CountryGroupList
    {
        public int? id { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public List<INTIdCodeDescriptionModel> countrys = new List<INTIdCodeDescriptionModel>();
    }
}
