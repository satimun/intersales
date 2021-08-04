using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response.PublicModel
{
    public class UpdateStatusRes : IResponseModel
    {
        public List<idStatus> results = new List<idStatus>();
        public class idStatus
        {
            public int? id { get; set; }
            public string status { get; set; }
            public ResultModel _result = new ResultModel();
        }
    }
}
