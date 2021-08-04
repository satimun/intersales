using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class LanguageSaveTemplateRequest:IRequestModel
    {
        public List<LanguageSaveTemplateReq> languageTemplates = new List<LanguageSaveTemplateReq>();
    }

    public class LanguageSaveTemplateReq
    {
        public int id { get; set; }
        public string code { get; set; }
        public int languageGroupID { get; set; }
        public List<LanguageDictionaryReq> dictionarys = new List<LanguageDictionaryReq>();
    }

    public class LanguageDictionaryReq
    {
        public int id { get; set; }
        public string message { get; set; }
        public int languageID { get; set; }
    }

}
