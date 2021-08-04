using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ConstantShipmentStatusRes : IResponseModel
    {
        public List<ConstantShipmentStatus> constantShipmentStatus = new List<ConstantShipmentStatus>();

        public class ConstantShipmentStatus
        {
            public string id { get; set; }
            public string code { get; set; }
            public string description { get; set; }
            public int step { get; set; }
        }
    }
}
