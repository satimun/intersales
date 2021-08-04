using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PortLoadingRes : IResponseModel
    {
        public List<PortLoading> portLoadings = new List<PortLoading>(); 
        public class PortLoading
        {
            public int id { get; set; }
            public string code { get; set; }
            public string description { get; set; }
            public string status { get; set; }
            public ByDateTimeModel lastUpdate { get; set; }
            public ResultModel _result = new ResultModel();
        }
        
    }
}
