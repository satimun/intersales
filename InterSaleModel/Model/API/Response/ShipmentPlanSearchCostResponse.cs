using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanSearchCostResponse : IResponseModel
    {
        public List<Cost> costs { get; set; }
        public class Cost: PublicModel.INTIdCodeDescriptionModel
        {
            public string defaultFlag { get; set; }
        }
    }
}
