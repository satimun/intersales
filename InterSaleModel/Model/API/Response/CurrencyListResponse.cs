using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CurrencyListResponse : IResponseModel
    {
        public List<INTIdCodeDescriptionModel> currencys = new List<INTIdCodeDescriptionModel>();
    }
}
