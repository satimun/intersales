using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanMainGetStatusResponse : IResponseModel
    {
        public List<ShipmentPlanMainSearchProgressResponse.Customer.ShipmentPlanMain> shipmentPlanMain = new List<ShipmentPlanMainSearchProgressResponse.Customer.ShipmentPlanMain>();
    }
}
