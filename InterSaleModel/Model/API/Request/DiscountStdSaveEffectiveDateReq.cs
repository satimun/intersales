using InterSaleModel.Model.API.Request.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class DiscountStdSaveEffectiveDateReq : IRequestModel
    {
        public List<EffectiveDateModel> discountStdEffectiveDates { get; set; }
    }
}
