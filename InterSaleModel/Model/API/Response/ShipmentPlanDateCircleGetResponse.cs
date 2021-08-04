using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanDateCircleGetResponse : IResponseModel
    {
        public ShipmentPlanDateCircle shipmentPlanDateCircle { get; set; }
        public class ShipmentPlanDateCircle
        {
            public int id { get; set; }
            public int shippingDay { get; set; }
            public PublicModel.INTIdCodeDescriptionModel customer { get; set; }
            public PublicModel.ByDateTimeModel create { get; set; }
            public PublicModel.ByDateTimeModel modify { get; set; }
        }
    }
}
