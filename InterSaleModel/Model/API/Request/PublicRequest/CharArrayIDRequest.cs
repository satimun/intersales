using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request.PublicRequest
{
    public class CharArrayIDRequest : IRequestModel
    {
        public List<string> id { get; set; }
    }
}
