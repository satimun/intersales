using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CountryGroupSaveGroupRequest : IRequestModel
    {
        public List<CountryGroupRQ> SaveGroupRQ = new List<CountryGroupRQ>();
    }

    public class CountryGroupRQ
    {
        public int ID { get; set; }
        public string GroupType { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }



    }
}
