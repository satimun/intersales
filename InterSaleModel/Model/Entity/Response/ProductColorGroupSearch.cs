using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ProductColorGroupSearch
    {
        public int ID;
        public int CountryGroup_ID;
        public string CountryGroup_Code;
        public string CountryGroup_Des;
	    public string GroupType;
        public int ProductColor_ID;
        public string ProductColor_Code;
	    public string ProductColor_Des;

        public int ProductType_ID;
        public string ProductType_Code;
        public string ProductType_Des;

        public int? ProductGrade_ID;
        public string ProductGrade_Code;
        public string ProductGrade_Des;

	    public string Code;
	    public string Description;
	    public string Status;
        public int Revision;
        public int CreateBy;
	    public DateTime CreateDate;
        public int? ModifyBy;
	    public DateTime? ModifyDate;
    }
}
