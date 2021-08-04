using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdSaveProdValueReq : IRequestModel
    {
        public List<PriceStdValue> priceStdValues { get; set; }
    }
}
