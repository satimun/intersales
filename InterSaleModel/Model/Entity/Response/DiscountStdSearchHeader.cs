using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class DiscountStdSearchHeader : DiscountStdSearchMain
    {
        public string ProductGroupType;

        public int? CountryGroup_ID;
        public string CountryGroup_Code;
        public string CountryGroup_Des;

        public DateTime? EffectiveDateFrom;
        public DateTime? EffectiveDateTo;
        public DateTime? EffectiveOldDateFrom;
        public DateTime? EffectiveOldDateTo;
    }
}
