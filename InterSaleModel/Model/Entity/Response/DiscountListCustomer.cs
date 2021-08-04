using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class DiscountListCustomer
    {
        public int ID;
        public int DiscountStdEffectiveDate_ID;
        public DateTime EffectiveDateFrom;
        public DateTime EffectiveDateTo;
        public string Customer_Code;
    }
}
