using InterSaleModel.Model.Entity.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class CountrySearchCountryGroup : IdCodeDescriptionModel
    {
        
        public int UpdateBy;
        public DateTime UpdateDate;
        public int? CountryGroup_ID;
        public string CountryGroup_Code;
        public string CountryGroup_Des;
        public string GroupType;

        public int? Zone_ID;
        public string Zone_Code;
        public string Zone_Des;

        public int? RegionalZone_ID;
        public string RegionalZone_Code;
        public string RegionalZone_Des;
    }
}
