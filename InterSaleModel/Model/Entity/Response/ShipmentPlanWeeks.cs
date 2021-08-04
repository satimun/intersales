using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanWeeks
    {
        public int weekNo { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
    }
}
