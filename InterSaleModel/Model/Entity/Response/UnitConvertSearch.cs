using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class UnitConvertSearch
    {
        public int UnitGroupType_ID;
        public string UnitGroupType_Code;
        public string UnitGroupType_Des;

        public int UnitType_ID;
        public string UnitType_Code;
        public string UnitType_Symbol;
        public string UnitType_Des;

        public int UnitType_ID2;
        public string UnitType_Code2;
        public string UnitType_Symbol2;
        public string UnitType_Des2;

        public string Description;
        public string Formula;
        public bool Round;

        public string status;
        public int CreateBy;
        public DateTime CreateDate;
        public int? ModifyBy;
        public DateTime? ModifyDate;
    }
}
