using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ProductFindRequest : IRequestModel
    {
        public string search { get; set; }
    }
}
