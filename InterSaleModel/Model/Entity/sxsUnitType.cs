using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsUnitType
    {
        public int ID;
        public string Code;
        public string Description;
        public string Symbol;

        public int Unit_ID;
        public string Unit_Code;
        public string GroupType;

        public int UnitGroupType_ID;
        public string UnitGroupType_Code;
        public string UnitGroupType_Des;

        public string Status;
        public int CreateBy;
        public DateTime CreateDate;
        public int? ModifyBy;
        public DateTime? ModifyDate;
    }
}
