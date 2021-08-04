using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CountryGroupListByTypeRequest:IRequestModel
    {
        public string groupType { get; set; }
    }
}
