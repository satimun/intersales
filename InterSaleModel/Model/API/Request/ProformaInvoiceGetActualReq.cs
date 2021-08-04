using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ProformaInvoiceGetActualReq : IRequestModel
    {
        public string dateFrom { get; set; }
        public string dateTo { get; set; }
        //public int year { get; set; }
        public int? zoneID { get; set; }
        public int? customerID { get; set; }
        public string productType { get; set; }
        public string diamerter { get; set; }
    }
}
