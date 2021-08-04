using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class PriceStdSearchMain
    {
        public int ID;
        public string Code;
        public string Type;
        public int? PriceStdEffectiveDate_ID;
        public string PriceStdEffectiveDate_Code;
        public int ProductType_ID;
        public string ProductType_Code;
        public string ProductType_Des;
        public int? ProductGrade_ID;
        public string ProductGrade_Code;
        public string ProductGrade_Des;
        public int Currency_ID;
        public string Currency_Code;
        public string Currency_Des;
        public int CountryGroup_ID;
        public string CountryGroup_Code;
	    public string CountryGroup_Des;
        public int ProductGroup_ID;
        public string ProductGroup_Code;
        public string ProductGroup_Des;
        public string Status;
        public int CreateBy;
        public DateTime CreateDate;
        public int? ModifyBy;
        public DateTime? ModifyDate;
    }
}
