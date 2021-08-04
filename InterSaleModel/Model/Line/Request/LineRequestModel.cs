using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Line.Request
{
    public class LineRequestModel<LRequest> where LRequest : ILRequestModel
    {
        public string botID { get; set; }
        public LRequest data { get; set; }
    }
}
