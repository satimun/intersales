using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsProductColor
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string CodeOld { get; set; }
        public string CodeNew { get; set; }
        public string Description { get; set; }
        public string DescriptionNew { get; set; }
        public int Revision { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
