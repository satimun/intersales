using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CustomerGroupListByTypeRequest : IRequestModel
    {
        public string groupType { get; set; }
    }
}
