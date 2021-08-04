using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleModel.Model.Jobs.Response
{
    public class JobsResponse<JRespone> where JRespone : IJResponseModel
    {
        public string status { get; set; }
        public string message { get; set; }
        public string[] warning { get; set; }
        public JRespone data { get; set; }
    }
}
