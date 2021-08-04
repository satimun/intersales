using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsDiscountStdValue
    {
        public int ID { get; set; }
        public int? DiscountStdRangeD_ID { get; set; }
        public int? DiscountStdProd_ID { get; set; }
        public int DiscountStdEffectiveDate_ID { get; set; }
        public int Seq { get; set; }
        public string Code { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal IncreaseAmount { get; set; }
        public int UpdateFlag_ID;
        public string ApprovedFlag;
        public int ApprovedHistory_ID;
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }

        public bool cloneFlag { get; set; }
    }
}
