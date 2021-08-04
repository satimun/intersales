using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanDateCircleGetRequest : IRequestModel
    {
        public int customerID { get; set; }
    }
}
