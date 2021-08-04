using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdActionResponse : IResponseModel
    {
        public List<PriceStdValuesAction> priceStdValues = new List<PriceStdValuesAction>();
    }

    public class PriceStdValuesAction
    {
        public int id { get; set; }
        public string status { get; set; }
        public ResultModel _result = new ResultModel();
    }
}
