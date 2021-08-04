using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request.PublicModel
{
    public class IntArrayIDRequest : IRequestModel
    {
        public List<int> id { get; set; }
    }
}
