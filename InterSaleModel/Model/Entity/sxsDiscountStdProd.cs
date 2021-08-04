using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsDiscountStdProd
    {
        public int ID { get; set; }
        public int DiscountStdMain_ID { get; set; }
        public int Product_ID { get; set; }
        public int UnitType_ID { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }

        public int? discountEffectiveDateID { get; set; }
    }
}
