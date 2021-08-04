using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{

    public class PriceStdSearchEffectiveDateResponse : IResponseModel
    {
        public List<EffectiveDateModel> priceStdEffectiveDates = new List<EffectiveDateModel>();
    }
}
