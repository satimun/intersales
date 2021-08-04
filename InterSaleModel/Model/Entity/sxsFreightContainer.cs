using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsFreightContainer
    {
        public int ID;
        public string GroupType;
        public string Code;
        public string Description;
        public decimal MinWeightKg;
        public decimal MaxWeightKg;
        public decimal WeightKg;
        public decimal Volume;
        public decimal VolumePercentAdmit;
        public string Status;
        public int CreateBy;
        public DateTime CreateDate;
        public int ModifyBy;
        public DateTime ModifyDate;
    }
}
