using System;
using System.Collections.Generic;
using System.Text;
using InterSaleModel.Model.API.Response;

namespace InterSaleModel.Model.API.Request
{
    public class DiscountStdApprovalReq : IRequestModel
    {
        public List<DiscountStdSearchDetailRes.DiscountDetail> discountDetails = new List<DiscountStdSearchDetailRes.DiscountDetail>();
    }
}
