using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class GetDataReq : IRequestModel
    {
        public string search { get; set; }
        public List<string> groupTypes = new List<string>();
        public List<string> status = new List<string>();
    }
}
