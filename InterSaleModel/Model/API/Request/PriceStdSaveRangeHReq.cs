using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdSaveRangeHReq : IRequestModel
    {
        public List<PriceStdRangeHs> priceStdRangeHs { get; set; }
    }
}
