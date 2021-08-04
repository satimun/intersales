using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class RemarkGetData
    {
        public int RemarkGroup_ID { get; set; }
        public string RemarkGroup_GroupType { get; set; }
        public string RemarkGroup_Code { get; set; }
        public string RemarkGroup_Description { get; set; }
        public string RemarkGroup_Status { get; set; }
        public int? RemarkGroup_LastUpdateBy { get; set; }
        public DateTime? RemarkGroup_LastUpdateDate { get; set; }

        public int? Remark_ID { get; set; }
        public string Remark_Code { get; set; }
        public string Remark_Description { get; set; }
        public string Remark_Status { get; set; }
        public int? Remark_LastUpdateBy { get; set; }
        public DateTime? Remark_LastUpdateDate { get; set; }
    }
}
