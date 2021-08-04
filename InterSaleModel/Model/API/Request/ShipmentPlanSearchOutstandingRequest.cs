using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanSearchOutstandingRequest : IRequestModel
    {
        public string admitDateFrom { get; set; }
        public string admitDateTo { get; set; }
        public List<string> customerCodes { get; set; }
        public List<string> productTypeCodes { get; set; }
        public int option { get; set; }
        public List<string> productCodes { get; set; }
        public List<string> packlistCodes { get; set; }

        public bool IgnoreAdmitDate { get; set; }

        /**********AUTO***********/
        public int planMonth { get; set; }
        public int planYear { get; set; }
        public string planType { get; set; }

        /*********EXCEL**********/
        public List<string> orderCodes { get; set; }
        public List<string> prodCodes { get; set; }
        public List<decimal> ouantitys { get; set; }

    }
}
