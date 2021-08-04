using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanGetPayAmount
    {
        public string PiCode { get; set; }
        public decimal PayAmount { get; set; }
        public string CurrencyCode { get; set; }
    }
}
