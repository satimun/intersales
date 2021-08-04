using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanGetPackListReq : IRequestModel
    {
        public int planMonth { get; set; }
        public int planYear { get; set; }
        public List<int> customerIDs { get; set; }
        public int? planWeek { get; set; }
    }
}
