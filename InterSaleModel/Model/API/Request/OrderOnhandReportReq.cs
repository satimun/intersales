using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class OrderOnhandReportReq : IRequestModel
    {
        public bool showOrder;
        public string dateFrom;
        public string dateTo;
        public string invtoryDate;
        public bool closeBy;
        public string admitDate;
        public bool onlyInventory;
        public bool deadstock;
        public List<string> customerCodes;

        public List<string> customerIDs;
        public List<string> zoneAccountIDs;
        public List<string> regionalZoneIDs;

        public bool MaterialGroup;
        public bool ProductTypeCode;
        public bool DiameterGroup;
    }
}
