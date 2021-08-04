using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class DiscountStdActionResponse : IResponseModel
    {
        public List<DiscountStdValuesAction> discountStdValues = new List<DiscountStdValuesAction>();
    }

    public class DiscountStdValuesAction
    {
        public int id { get; set; }
        public string status { get; set; }
        public ResultModel _result = new ResultModel();
    }
}
