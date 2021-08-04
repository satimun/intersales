using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class LanguageSaveLanguageRequest : IRequestModel
    {
        public List<LanguageSaveLanguageReq> languages = new List<LanguageSaveLanguageReq>();
    }

    public class LanguageSaveLanguageReq
    {
        public int  id { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string iconURL { get; set; }

    }

}
