using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Line.Response
{
    public class LineResponseModel
    {
        public string status { get; set; }
        public string message { get; set; }
        public string[] warning { get; set; }
        //public LResponse data { get; set; }
    }
}
