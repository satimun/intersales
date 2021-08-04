using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Line.Request
{
    public class PushMessageModel : ILRequestModel
    {
        public string message { get; set; }
        public string url { get; set; }
        public string type { get; set; }
        public string userID { get; set; }
    }
}
