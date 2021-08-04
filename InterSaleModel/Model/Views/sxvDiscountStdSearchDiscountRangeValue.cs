using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Views
{
    public class sxvDiscountStdSearchDiscountRangeValue
    {
        public int id { get; set; }
        public int seq { get; set; }
        public int? twineSeriesID { get; set; }
        public dynamic minEyeSizeCM { get; set; }
        public dynamic maxEyeSizeCM { get; set; }
        public dynamic minEyeAmountMD { get; set; }
        public dynamic maxEyeAmountMD { get; set; }
        public dynamic minLengthM { get; set; }
        public dynamic maxLengthM { get; set; }
        public string tagDescription { get; set; }
        public dynamic discountPercent { get; set; }
        public dynamic discountAmount { get; set; }
        public dynamic increaseAmount { get; set; }
        public string status { get; set; }
        public int? ApproveBy { get; set; }
        public DateTime? ApproveDate { get; set; }
        public string ApproveStatus { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
