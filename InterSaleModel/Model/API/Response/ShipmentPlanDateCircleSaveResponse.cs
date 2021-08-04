using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanDateCircleSaveResponse : IResponseModel
    {
        public List<ShipmentPlanDateCircles> shipmentPlanDateCircles = new List<ShipmentPlanDateCircles>();

        public class ShipmentPlanDateCircles
        {
            public int? id { get; set; }
            public int shippingDay { get; set; }
            public INTIdCodeDescriptionModel saleEmployee = new INTIdCodeDescriptionModel();
            public INTIdCodeDescriptionModel customer = new INTIdCodeDescriptionModel();
            public ByDateTimeModel create = new ByDateTimeModel();
            public ByDateTimeModel modify = new ByDateTimeModel();
            public ResultModel _result = new ResultModel();
        }
    }
}
