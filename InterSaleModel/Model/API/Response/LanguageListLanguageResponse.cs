using InterSaleModel.Model.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class LanguageListLanguageResponse : IResponseModel
    {
        public List<sxsLanguage> languages = new List<sxsLanguage>();
    }
}
