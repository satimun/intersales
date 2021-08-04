using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
   public  class ShipmentPlanOrderMarketCloseFlagCriteria
    {
        public string ORDERNO { get; set; }
        public string PRODCODE { get; set; }
        public int ITEMNO { get; set; }
        
        public string MarketCloseFlag { get; set; }
        public string OrderCloseFlag { get; set; }
    }
}
