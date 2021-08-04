using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class LanguageDictionaryRequest : IRequestModel
    {
        public string lang { get; set; }
        public string group { get; set; }
    }
}
