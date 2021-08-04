using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CustomerGroupSearchRequest : IRequestModel
    {
        public string search { get; set; }
        public string groupType { get; set; }
        //public string Status { get; set; }
        public List<string> Status = new List<string>();
    }
}
