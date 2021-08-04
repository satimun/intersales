using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class InvTurnOverReportReq : IRequestModel
    {
        public int year { get; set; }
        public int monthFrom { get; set; }
        public int monthTo { get; set; }       
        public List<string> regionalZoneIDs { get; set; }
        public List<string> zoneAccountIDs { get; set; }        
        public List<string> customerIDs { get; set; }
        public bool deadstock { get; set; }
    }
}
