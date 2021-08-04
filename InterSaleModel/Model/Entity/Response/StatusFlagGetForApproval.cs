using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class StatusFlagGetForApproval : sxsStatusFlag
    {
        public string GroupFlag;
        public int? UpdateFlag_ID;
        public string UpdateFlag_Code;
        public string UpdateFlag_Des;
    }
}
