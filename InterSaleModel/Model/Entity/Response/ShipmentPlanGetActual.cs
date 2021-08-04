using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanGetActual
    {
        public string ciCode { get; set; }
        public DateTime ciDate { get; set; }
        public string customerCode { get; set; }
        public decimal weightkg { get; set; }
        public int amountpc { get; set; }
        public decimal value { get; set; }

        public decimal otherweightkg;
        public int otheramountpc;
        public decimal othervalue;
    }
}
