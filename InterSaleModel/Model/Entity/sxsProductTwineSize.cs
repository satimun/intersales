using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsProductTwineSize
    {
        public int ID { get; set; }
        public int? ProductGroup_ID { get; set; }
        public string ProductGroup_Code { get; set; }
        public string ProductGroup_Des { get; set; }
        public string Code { get; set; }
        public string Code2 { get; set; }
        public string Description { get; set; }
        public decimal FilamentSize { get; set; }
        public decimal FilamentAmount { get; set; }
        public string FilamentWord { get; set; }
        public int Revision { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
