using System;
using System.Collections.Generic;
using System.Text;
using static InterSaleModel.Model.API.Response.DiscountStdCloneSearchRes;

namespace InterSaleModel.Model.API.Request
{
    public class DiscountStdCloneSaveReq : IRequestModel
    {
        public List<DiscountCloneSearh> discountStds = new List<DiscountCloneSearh>();
    }
}
