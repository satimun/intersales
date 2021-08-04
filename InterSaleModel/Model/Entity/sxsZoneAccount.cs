using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsZoneAccount
    {
        public int ID { get; set; }
        public int ZoneGroup_ID { get; set; }
        public int ManagerEmployee_ID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string AccountAR { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int ModifyBy { get; set; }
        public DateTime ModifyDate { get; set; }
    }
}
