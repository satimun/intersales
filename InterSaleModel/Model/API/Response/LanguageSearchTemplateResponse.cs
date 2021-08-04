using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class LanguageSearchTemplateResponse:IResponseModel
    {
        public List<LanguageSearchTemplateRes> languageTemplates = new List<LanguageSearchTemplateRes>();
    }

    public class LanguageSearchTemplateRes
    {
        public int id { get; set; }
        public string code { get; set; }
        public string status { get; set; }
        public List<LanguageDictionaryRes> LanguageDictionarys = new List<LanguageDictionaryRes>();
        public ByDateTimeModel create = new ByDateTimeModel();
        public ByDateTimeModel modify = new ByDateTimeModel();
    }

    public class LanguageDictionaryRes
    {
        public int id { get; set; }
        public string message { get; set; }
        public LanguageRes Language = new LanguageRes();
        
    }

    public class LanguageRes
    {
        public int id { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        
    }



}
