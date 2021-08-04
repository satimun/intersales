using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class DiscountStdSearchEffectDateResponse : IResponseModel
    {
        public List<EffectiveDateModel> discountStdEffectiveDates = new List<EffectiveDateModel>();
    }
}
