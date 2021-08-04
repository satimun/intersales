using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class LanguageSearchTemplateRequest:IRequestModel
    {
        public List<string> languageIDs = new List<string>();
        public List<string> languageGroupIDs = new List<string>();
        public List<string> status = new List<string>();
    }
}
