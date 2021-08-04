using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class PriceStdSearchEffectiveDate
    {
        public int ID;
        public int PriceStdMain_ID;
        public string PriceStdMain_Code;
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
