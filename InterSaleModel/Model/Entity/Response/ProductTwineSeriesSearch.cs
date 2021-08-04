using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ProductTwineSeriesSearch
    {
        public int ID;
        public int ProductType_ID;
        public string ProductType_Code;
        public string ProductType_Des;
        public string Code;
        public string Description;
        public decimal AmountUnitPerPackage;
        public int UnitType_ID;
        public string UnitType_Code;
        public string UnitType_Des;
        public decimal AmountPackage;
        public int PackageType_ID;
        public string PackageType_Code;
        public string PackageType_Des;
        public int Revision;
        public string Status;
        public int CreateBy;
        public DateTime CreateDate;
        public int? ModifyBy;
        public DateTime? ModifyDate;
    }
}
