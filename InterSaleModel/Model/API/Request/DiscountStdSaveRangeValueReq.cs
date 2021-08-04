using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class DiscountStdSaveRangeValueReq : IRequestModel
    {
        public List<DiscountStdValues> discountStdValues { get; set; }
    }
}
