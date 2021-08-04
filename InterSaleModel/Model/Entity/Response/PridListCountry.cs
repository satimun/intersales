using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class PridListCountry
    {
        public int ID;
        public int PriceStdEffectiveDate_ID;
        public DateTime EffectiveDateFrom;
        public DateTime EffectiveDateTo;
        public string Country_Code;
    }
}
