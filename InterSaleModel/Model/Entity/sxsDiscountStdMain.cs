using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsDiscountStdMain
    {
        public int ID { get; set; }
        public int Customer_ID { get; set; }
        public int ProductType_ID { get; set; }
        public int? ProductGrade_ID { get; set; }
        public int Currency_ID { get; set; }
        public string Type { get; set; }
        public string Code { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
