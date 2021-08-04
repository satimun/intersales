using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CountryGroupMoveCountryMappingResponse :IResponseModel
    {
        public CountryGroupMoveCountryMappingRes CountryGroup = new CountryGroupMoveCountryMappingRes();
    }



    public class CountryGroupMoveCountryMappingRes
    {
        public int ID { get; set; }
        public string GroupType { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public List<CountryMoveCountryMapping> Countrys = new List<CountryMoveCountryMapping>();
    }


    public class CountryMoveCountryMapping
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public ResultModel _result = new ResultModel();
    }
}
