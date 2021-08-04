using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanGetActualReq : IRequestModel
    {

        //public int monthFrom { get; set; }
        //public int monthTo { get; set; }
        //public int year { get; set; }
        public string dateFrom { get; set; }
        public string dateTo { get; set; }
        public int? zoneID { get; set; }
        public int? countryID { get; set; }
        public int? customerID { get; set; }
        public string productType { get; set; }
        public string diamerter { get; set; }
        public string color { get; set; }

        public bool otherProduct;
    }
}
