using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanGetPackList
    {
        public string PKNO { get; set; }
        public DateTime? SHIPDATE { get; set; }
        public string ORDERNO { get; set; }
        public string PRODCODE { get; set; }
        public decimal QTY { get; set; }
        public decimal BALE { get; set; }
        public decimal WEIGHT { get; set; }
        public string CUSCOD { get; set; }
        public string SALEUNIT { get; set; }
        public int SHIPWEEK { get; set; }
        public string FREIGHTCODE { get; set; }
        public decimal VOLUME { get; set; }
        public decimal VALUE { get; set; }

        public int? outstandID { get; set; }
        public int? customerID { get; set; }
    }
}
