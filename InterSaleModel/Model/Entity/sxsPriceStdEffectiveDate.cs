using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsPriceStdEffectiveDate
    {
        public int ID { get; set; }
        public int PriceStdMain_ID { get; set; }
        public string Code { get; set; }
        public DateTime EffectiveDateFrom { get; set; }
        public DateTime EffectiveDateTo { get; set; }
        public DateTime? EffectiveOldDateFrom { get; set; }
        public DateTime? EffectiveOldDateTo { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
