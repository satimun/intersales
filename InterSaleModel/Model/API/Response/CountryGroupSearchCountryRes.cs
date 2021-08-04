using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CountryGroupSearchCountryRes : IResponseModel
    {
        public List<CountryGroups> countryGroups = new List<CountryGroups>();
        public class CountryGroups : SearchResModel
        {
            public List<Countrys> countrys = new List<Countrys>();
            public class Countrys : INTIdCodeDescriptionModel
            {
                public INTIdCodeDescriptionModel regionalZone { get; set; }
                public INTIdCodeDescriptionModel zone { get; set; }
                public ByDateTimeModel lastUpdate { get; set; }
                public ResultModel _result = new ResultModel();
            }
        }
    }
}
