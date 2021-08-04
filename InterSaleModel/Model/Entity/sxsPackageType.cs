using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsPackageType
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Code2 { get; set; }
        public string Description { get; set; }
        public string GroupType { get; set; }
        int Revision { get; set; }
        public string Status { get; set; }
        int CreateBy { get; set; }
        public DateTime CreateDate{ get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
