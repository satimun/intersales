using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class DiscountStdSearchRangeH
    {
        public int ID;
        public int DiscountStdMain_ID;
        public string MinProductTwineSizeCode;
        public decimal MinFilamentSize;
        public decimal MinFilamentAmount;
        public string MinFilamentWord;
        public string MaxProductTwineSizeCode;
        public decimal MaxFilamentSize;
        public decimal MaxFilamentAmount;
        public string MaxFilamentWord;
        public int UnitType_ID;
        public string UnitType_Code;
        public string UnitType_Des;
        public int? ProductKnot_ID;
        public string ProductKnot_Code;
        public string ProductKnot_Des;
        public int? ProductStretching_ID;
        public string ProductStretching_Code;
        public string ProductStretching_Des;
        public int? ProductSelvageWovenType_ID;
        public string ProductSelvageWovenType_Code;
        public string ProductSelvageWovenType_Des;
        public int? ProductColorGroup_ID;
        public string ProductColorGroup_Code;
        public string ProductColorGroup_Des;
        public string Status;
        public int CreateBy;
        public DateTime CreateDate;
        public int? ModifyBy;
        public DateTime? ModifyDate;
    }
}
