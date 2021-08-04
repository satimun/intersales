using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class PriceStdSearchHeader : PriceStdSearchMain
    {
        public string ProductGroupType;
		public DateTime? EffectiveDateFrom;
        public DateTime? EffectiveDateTo;
        public DateTime? EffectiveOldDateFrom;
        public DateTime? EffectiveOldDateTo;
    }
}
