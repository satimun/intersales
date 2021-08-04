using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanListRegionalZoneResponse : IResponseModel
    {
        public List<PublicModel.INTIdCodeDescriptionModel> regionalZones;
    }
}
