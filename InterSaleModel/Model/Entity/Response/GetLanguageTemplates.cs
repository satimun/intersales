using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class GetLanguageTemplates
    {
        public int LanguageTemplate_ID { get; set; }
        public string LanguageTemplate_Code { get; set; }
        public string LanguageTemplate_Status { get; set; }
        public int LanguageTemplate_CreateBy { get; set; }
        public DateTime LanguageTemplate_CreateDate { get; set; }
        public int? LanguageTemplate_ModifyBy { get; set; }
        public DateTime? LanguageTemplate_ModifyDate { get; set; }

        public int LanguageDictionary_ID { get; set; }
        public string LanguageDictionary_Message { get; set; }        

        public int Language_ID { get; set; }
        public string Language_Code { get; set; }
        public string Language_Description { get; set; }

        public int LanguageGroup_ID { get; set; }
        public string LanguageGroup_Code { get; set; }
        public string LanguageGroup_Description { get; set; }
    }
}
