using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response.PublicModel
{
    public class ResultArrModel
    {
        public string _status { get; set; }
        public List<string> _message = new List<string>();
    }
}
