using InterSaleModel.Model.API.Request.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdSaveEffectiveDateReq : IRequestModel
    {
        public List<EffectiveDateModel> priceStdEffectiveDates = new List<EffectiveDateModel>();
    }
}
