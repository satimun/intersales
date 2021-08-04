using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class DiscountStdSearchDetail
    {
        public int ID;
        public int? DiscountStdProd_ID;
        public int? DiscountStdRangeD_ID;
        public int Seq;

        public decimal DiscountPercent;
        public decimal DiscountAmount;
        public decimal IncreaseAmount;

        public int? DiscountStdRangeH_ID;
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

        public int? ProductTwineSeries_ID;
        public string ProductTwineSeries_Code;
        public string ProductTwineSeries_Des;
        public decimal MinMeshSize;
        public decimal MinMeshDepth;
        public decimal MinLength;
        public decimal MaxMeshSize;
        public decimal MaxMeshDepth;
        public decimal MaxLength;
        public string SalesDescription;
        public string TagDescription;

        public int? Product_ID;
        public string Product_Code;
        public string Product_Des;

        public int Approved_ID;
        public string ApprovedFlag;
        public string ActionFlag;
        public int? ApprovedBy;
        public DateTime? ApprovedDate;

        public int UpdateFlag_ID;
        public string UpdateFlag_Code;
        public string UpdateFlag_Des;

        public int StatusFlag_ID;
        public string StatusFlag_Code;
        public string StatusFlag_Des;

        public string Status;
        public int CreateBy;
        public DateTime CreateDate;
        public int? ModifyBy;
        public DateTime? ModifyDate;
    }
}
