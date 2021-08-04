using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanMainInsertMonthlyInitRequest : IRequestModel
    {
        public int customerID { get; set; }
        public int planMonth { get; set; }
        public int planYear { get; set; }
    }
}
