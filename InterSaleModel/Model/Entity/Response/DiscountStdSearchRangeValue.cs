using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class DiscountStdSearchRangeValue
    {
        public int ID;
        public int DiscountStdEffectiveDate_ID;
        public int DiscountStdRangeD_ID;
        public int DiscountStdRangeH_ID;
        public int Seq;
        public int? ProductTwineSeries_ID;
        public string ProductTwineSeries_Code;
        public string ProductTwineSeries_Des;
        public decimal? MinMeshSize;
        public decimal? MaxMeshSize;
        public decimal? MinMeshDepth;
        public decimal? MaxMeshDepth;
        public decimal? MinLength;
        public decimal? MaxLength;
        public string TagDescription;
        public string SalesDescription;
        public decimal DiscountPercent;
        public decimal DiscountAmount;
        public decimal IncreaseAmount;
        public string Status;
        
        public int CreateBy;
        public DateTime CreateDate;
        public int? ModifyBy;
        public DateTime? ModifyDate;

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
