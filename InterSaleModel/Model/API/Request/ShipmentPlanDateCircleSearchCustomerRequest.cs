using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanDateCircleSearchCustomerRequest : IRequestModel
    {
        public string search { get; set; }
        public List<string> status { get; set; }
    }
}
