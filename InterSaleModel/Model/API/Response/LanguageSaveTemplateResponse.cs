using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class LanguageSaveTemplateResponse:IResponseModel
    {
        public List<LanguageSaveTemplateRes> languageTemplates = new List<LanguageSaveTemplateRes>();
    }

    public class LanguageSaveTemplateRes
    {
        public int id { get; set; }
        public string code { get; set; }
        public string status { get; set; }
        public LanguageGroupSaveTemplateRes languageGroup = new LanguageGroupSaveTemplateRes();
        public List<LanguageDictionarySaveTemplateRes> dictionarys = new List<LanguageDictionarySaveTemplateRes>();
        public ByDateTimeModel create = new ByDateTimeModel();
        public ByDateTimeModel modify = new ByDateTimeModel();
        public ResultModel _result = new ResultModel();
    }

    public class LanguageGroupSaveTemplateRes
    {
        public int id { get; set; }
        public string code { get; set; }     
        public string description { get; set; }
    }

    public class LanguageDictionarySaveTemplateRes
    {
        public int id { get; set; }
        public string message { get; set; }
        public LanguageSaveRes Language = new LanguageSaveRes();
    }

    public class LanguageSaveRes
    {
        public int id { get; set; }
        public string code { get; set; }
        public string description { get; set; }

    }

}
