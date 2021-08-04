using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Request
{
    public class GetPriceRequest
    {
        //public string priceType { get; set; }
        public int? productGradeID { get; set; }
        public int productTypeID { get; set; }
        public int currencyID { get; set; }
        public int customerID { get; set; }
        public DateTime effectiveDateFrom { get; set; }
        public DateTime effectiveDateTo { get; set; }
        public int productID { get; set; }
        public int unitTypeID { get; set; }
    }
}
