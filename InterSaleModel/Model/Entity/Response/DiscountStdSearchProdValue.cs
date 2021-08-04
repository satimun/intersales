﻿using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class DiscountStdSearchProdValue
    {
        public int ID;
        public int DiscountStdMain_ID;
        public int DiscountStdProd_ID;
        public int DiscountStdEffectiveDate_ID;
        public int Seq;
        public decimal DiscountPercent;
        public decimal DiscountAmount;
        public decimal IncreaseAmount;
        public string Status;
        public int CreateBy;
        public DateTime CreateDate;
        public int? ModifyBy;
        public DateTime? ModifyDate;
       
        public int UnitType_ID;
        public string UnitType_Code;
        public string UnitType_Des;
        public int Product_ID;
        public string Product_Code;
        public string Product_Des;
        public int? ProductRumType_ID;
        public string ProductRumType_Code;
        public string ProductRumType_Des;

        public int Approved_ID;
        public string ApprovedFlag;
        public string ActionFlag;
        public int? ApprovedBy;
        public DateTime? ApprovedDate;

        public int StatusFlag_ID;
        public string StatusFlag_Code;
        public string StatusFlag_Des;

        public int UpdateFlag_ID;
        public string UpdateFlag_Code;
        public string UpdateFlag_Des;
    }
}
