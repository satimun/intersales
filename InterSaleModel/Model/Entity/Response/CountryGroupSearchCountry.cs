using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class CountryGroupSearchCountry : sxsCountryGroup
    {
        public int? UpdateBy;
        public DateTime? UpdateDate;
        public int? Country_ID;
        public string Country_Code;
        public string Country_Des;
        public int? Zone_ID;
        public string Zone_Code;
        public string Zone_Des;
        public int? RegionalZone_ID;
        public string RegionalZone_Code;
        public string RegionalZone_Des;

    }
}
