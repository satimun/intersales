using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CountryGroupListByTypeResponse:IResponseModel
    {
        public List<CountryGroupListByTypeRes> CountryGroups = new List<CountryGroupListByTypeRes>();
    }

    public class CountryGroupListByTypeRes
    {
        public int ID { get; set; }
        public string GroupType { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public ByDateTimeModel create = new ByDateTimeModel();
        public ByDateTimeModel modify = new ByDateTimeModel();
    }
}
