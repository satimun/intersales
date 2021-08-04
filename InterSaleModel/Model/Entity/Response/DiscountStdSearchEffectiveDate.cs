using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class DiscountStdSearchEffectiveDate
    {
        public int ID;
        public int DiscountStdMain_ID;
        public string DiscountStdMain_Code;
        public string Code;
        public DateTime EffectiveDateFrom;
        public DateTime EffectiveDateTo;
        public DateTime? EffectiveOldDateFrom;
        public DateTime? EffectiveOldDateTo;
        public int CountApprove;
        public int CountTotal;
        public string Status;
        public int CreateBy;
        public DateTime CreateDate;
        public int? ModifyBy;
        public DateTime? ModifyDate;
    }
}
