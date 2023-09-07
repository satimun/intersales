using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsDiscountStdRangeH
    {
        public int ID { get; set; }
        public int DiscountStdMain_ID { get; set; }
        public int? ProductKnot_ID { get; set; }
        public int? ProductStretching_ID { get; set; }
        public int UnitType_ID { get; set; }
        public int? ProductSelvageWovenType_ID { get; set; }
        public int? ProductColorGroup_ID { get; set; }
        public string MaxProductTwineSizeCode { get; set; }

        public decimal MinFilamentSize { get; set; }
        public decimal MinFilamentAmount { get; set; }
        public string MinFilamentWord { get; set; }

        public string MinProductTwineSizeCode { get; set; }

        public decimal MaxFilamentSize { get; set; }
        public decimal MaxFilamentAmount { get; set; }
        public string MaxFilamentWord { get; set; }

        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }

        public int? DiscountStdEffectiveDate_ID { get; set; }
    }
}
