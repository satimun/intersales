using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CountryGroupTypeRequest : IRequestModel
    {      
        public string search { get; set; }
        public string groupType { get; set; }     
        public List<string> Status = new List<string>();
    }
}
