using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdSaveMainReq : IRequestModel
    {
        public List<PriceStdMains> priceStdMains { get; set; }
    }
}
