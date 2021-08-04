using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsPriceStdValue
    {
        public int ID { get; set; }
        public int? PriceStdRangeD_ID { get; set; }
        public int? PriceStdProd_ID { get; set; }
        public int PriceStdEffectiveDate_ID { get; set; }
        public int Seq { get; set; }
        public decimal PriceFOB { get; set; }
        public decimal PriceCAF { get; set; }
        public decimal PriceCIF { get; set; }
        public int UpdateFlag_ID;
        public string ApprovedFlag;
        public int ApprovedHistory_ID;
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
