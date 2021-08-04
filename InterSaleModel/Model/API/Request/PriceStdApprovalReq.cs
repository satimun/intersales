using System;
using System.Collections.Generic;
using System.Text;
using InterSaleModel.Model.API.Response;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdApprovalReq : IRequestModel
    {
        public List<PriceStdSearchDetailRes.PriceDetail> priceDetails = new List<PriceStdSearchDetailRes.PriceDetail>();
    }
}
