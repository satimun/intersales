using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class LanguageListLanguageAPI : BaseAPIEngine<NullRequest, LanguageListLanguageResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, LanguageListLanguageResponse dataRes)
        {
            dataRes.languages = LanguageADO.GetInstant().ListLanguage(this.Logger);
        }
    }
}
