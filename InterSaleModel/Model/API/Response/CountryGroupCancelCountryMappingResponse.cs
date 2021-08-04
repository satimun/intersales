using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CountryGroupCancelCountryMappingResponse : IResponseModel
    {
        public List<CountryGroupCancelCountryMappingRes> CountryGroupMapping = new List<CountryGroupCancelCountryMappingRes>();

    }

    public class CountryGroupCancelCountryMappingRes
    {
        public CountryGroupCancelCountryMapping CountryGroup = new CountryGroupCancelCountryMapping();
        public CountryCancelCountryMapping Country = new CountryCancelCountryMapping();
        public ResultModel _result = new ResultModel();
    }

    public class CountryGroupCancelCountryMapping
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }

    }

    public class CountryCancelCountryMapping
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
    }
}
