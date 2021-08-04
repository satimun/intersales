using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class APIResponseModel<TResponse> where TResponse : IResponseModel
    {
        public string status { get; set; }
        public string message { get; set; }
        public string[] warning { get; set; }
        public TResponse data { get; set; }
    }
}
