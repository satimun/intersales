using InterSaleModel.Model.Entity.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanListContainerSizeResponse : IResponseModel
    {
        public List<ShipmentPlanContainerSizeCriteria> containers { get; set; }
    }
}
