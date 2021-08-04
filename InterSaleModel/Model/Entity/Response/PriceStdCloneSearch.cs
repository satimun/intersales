using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class PriceStdCloneSearch : PriceStdSearchMain
    {
        public DateTime? EffectiveDateFrom;
        public DateTime? EffectiveDateTo;
        public int CountApprove;
    }
}
