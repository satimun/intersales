using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class LanguageDictionaryResponse : IResponseModel
    {
        public List<Dictionarys> dictionarys = new List<Dictionarys>();
    }

    public class Dictionarys
    {
        public string code { get; set; }
        public string message { get; set; }
    }
}
