using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanMainUpdateResponse : IResponseModel
    {
        public List<ShipmentPlanMain> shipmentPlanMain = new List<ShipmentPlanMain>();
    }

    public class ShipmentPlanMain
    {
        public int id { get; set; }
        public string code { get; set; }
        public string planType { get; set; }
        public int planMonth { get; set; }
        public int planYear { get; set; }
        public int revision { get; set; }
        public string status { get; set; }

        public ByDateTimeModel approve = new ByDateTimeModel();
        public ByDateTimeModel create = new ByDateTimeModel();
        public ByDateTimeModel modify = new ByDateTimeModel();
    }


}
