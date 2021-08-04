using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class GetCountryGroupMoveCountryMapping
    {
        public int Country_ID { get; set; }       
        public string CountryCode { get; set; }
        public string CountryDesc { get; set; }

        public int CountryGroup_ID { get; set; }
        public string CountryGroupCode { get; set; }
        public string CountryGroupDesc { get; set; }
        public string CountryGroupType { get; set; }
        public string CountryGroupStatus { get; set; }       

    }
}
