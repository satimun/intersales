using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class DiscountStdCloneSearch : DiscountStdSearchMain
    {
        public DateTime? EffectiveDateFrom;
        public DateTime? EffectiveDateTo;
        public int CountApprove;
    }
}
