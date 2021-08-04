using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanSearchCostRequest : IRequestModel
    {
        public int year { get; set; }
    }
}
