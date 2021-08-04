using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class UnitTypeSearchRequest : IRequestModel
    {
        public string groupType { get; set; }
        public string code { get; set; }
    }
}
