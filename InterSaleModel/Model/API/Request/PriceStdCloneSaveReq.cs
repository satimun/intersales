using System;
using System.Collections.Generic;
using System.Text;
using static InterSaleModel.Model.API.Response.PriceStdCloneSearchRes;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdCloneSaveReq : IRequestModel
    {
        public List<PriceCloneSearh> priceStds = new List<PriceCloneSearh>();
    }
}
