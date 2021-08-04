using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ZoneAccountSearchResponse : IResponseModel
    {
        public List<ZoneAccount> zoneAccounts { get; set; }
        public class ZoneAccount : INTIdCodeDescriptionModel
        {
            public ByDateTimeModel create { get; set; }
            public ByDateTimeModel modify { get; set; }
        }
    }
}
