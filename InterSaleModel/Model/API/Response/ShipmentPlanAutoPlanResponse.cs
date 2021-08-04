using InterSaleModel.Model.API.Response.PublicModel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanAutoPlanResponse : IResponseModel
    {
        public List<ShipmentPlanMain> shipmentPlanMain { get; set; }
        public class ShipmentPlanMain
        {
            public int id { get; set; }
            public int customerID { get; set; }
            public string code { get; set; }
            public string planType { get; set; }
            public int planMonth { get; set; }
            public int planYear { get; set; }
            public int revision { get; set; }
            public string status { get; set; }
            public ByDateTimeModel approve;
            public ByDateTimeModel create;
            public ByDateTimeModel modify;

        }
    }
}
