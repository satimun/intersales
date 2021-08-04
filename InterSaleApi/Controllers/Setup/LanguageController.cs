using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.API.Language;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/Language")]
    public class LanguageController : Controller
    {

        [HttpGet("ListLanguage/{token}")]
        public dynamic ListLanguage(string token)
        {
            LanguageListLanguageAPI res = new LanguageListLanguageAPI();
            return res.Execute(token);
        }

        [HttpGet("Dictionary/{token}")]
        public dynamic Dictionary(string token, [FromQuery] string lang, string group)
        {
            var data = new { lang = lang, group = group };
            LanguageDictionaryAPI res = new LanguageDictionaryAPI();
            return res.Execute(token, data);
        }


        [HttpGet("ListGroup/{token}")]
        public dynamic ListGroup(string token)
        {
            LanguageListGroupAPI res = new LanguageListGroupAPI();
            return res.Execute(token);
        }

        [HttpPost("ActiveLanguage/{token}")]
        public dynamic ActiveLanguage(string token)
        {
            LanguageActiveLanguageAPI res = new LanguageActiveLanguageAPI();
            return res.Execute(token);
        }

        [HttpPost("InactiveLanguage/{token}")]
        public dynamic InactiveLanguage(string token)
        {
            LanguageInactiveLanguageAPI res = new LanguageInactiveLanguageAPI();
            return res.Execute(token);
        }

        [HttpPost("CancelLanguage/{token}")]
        public dynamic CancelLanguage(string token, [FromBody] dynamic data)
        {
            LanguageCancelLanguageAPI res = new LanguageCancelLanguageAPI();
            return res.Execute(token, data);
        }

        [HttpPut("SaveLanguage/{token}")]
        public dynamic SaveLanguage(string token, [FromBody] dynamic data)
        {
            LanguageSaveLanguageAPI res = new LanguageSaveLanguageAPI();
            return res.Execute(token, data); 
        }

        [HttpPost("ActiveGroup/{token}")]
        public dynamic ActiveGroup(string token, [FromBody] dynamic data)
        {
            LanguageActiveGroupAPI res = new LanguageActiveGroupAPI();
            return res.Execute(token, data);
        }

        [HttpPost("InactiveGroup/{token}")]
        public dynamic InactiveGroup(string token, [FromBody] dynamic data)
        {
            LanguageInactiveGroupAPI res = new LanguageInactiveGroupAPI();
            return res.Execute(token, data);
        }

        [HttpPost("CancelGroup/{token}")]
        public dynamic CancelGroup(string token, [FromBody] dynamic data)
        {
            LanguageCancelGroupAPI res = new LanguageCancelGroupAPI();
            return res.Execute(token, data);
        }
        

        [HttpPut("SaveGroup/{token}")]
        public dynamic SaveGroup(string token, [FromBody] dynamic data)
        {
            LanguageSaveGroupAPI res = new LanguageSaveGroupAPI();
            return res.Execute(token, data);
        }

        [HttpGet("SearchTemplate/{token}")]
        public dynamic SearchTemplate(string token, [FromQuery] string[] languageIDs, [FromQuery] string[] languageGroupIDs, [FromQuery] string[] Status)
        {
            var data = new { languageIDs = languageIDs, languageGroupIDs= languageGroupIDs,   Status = Status };
            LanguageSearchTemplateAPI res = new LanguageSearchTemplateAPI();
            return res.Execute(token, data);
        }

        [HttpPost("CancelTemplate/{token}")]
        public dynamic CancelTemplate(string token, [FromBody] dynamic data)
        {
            LanguageCancelTemplateAPI res = new LanguageCancelTemplateAPI();
            return res.Execute(token, data);
        }

        [HttpPut("SaveTemplate/{token}")]
        public dynamic SaveTemplate(string token, [FromBody] dynamic data)
        {
            LanguageSaveTemplateAPI res = new LanguageSaveTemplateAPI();
            return res.Execute(token, data);
        }
    }
}
