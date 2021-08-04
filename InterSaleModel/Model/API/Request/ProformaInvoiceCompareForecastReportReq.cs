using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ProformaInvoiceCompareForecastReportReq : IRequestModel
    {
        public string dateFrom { get; set; }
        public string dateTo { get; set; }
        public List<string> customerIDs { get; set; }
        public List<string> zoneAccountIDs { get; set; }
        public List<string> regionalZoneIDs { get; set; }
        public int costID { get; set; }
    }
}
