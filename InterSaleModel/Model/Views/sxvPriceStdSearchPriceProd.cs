using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Views
{
    public class sxvPriceStdSearchPriceProd
    {
        public int id { get; set; }
        public int seq { get; set; }
        public int unitTypeID { get; set; }
        public dynamic pricePercent { get; set; }
        public dynamic priceAmount { get; set; }
        public dynamic increaseAmount { get; set; }
        public string status { get; set; }
        public int productID { get; set; }
        public int? ApproveBy { get; set; }
        public DateTime? ApproveDate { get; set; }
        public string ApproveStatus { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
