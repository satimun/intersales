using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class OauthDestroyTokenAPI : BaseAPIEngine<NullRequest, OauthDestroyTokenResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, OauthDestroyTokenResponse dataRes)
        {
            var db = TokenADO.GetInstant().DestroyToken(this.token ,this.Logger);
            //if (db.Count == 0)
            //{
            //    throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O0000, "ไม่พบ token ในระบบ");
            //}
            db.ForEach(
                x =>
                {
                    dataRes.token = x.Code;
                    dataRes.status = x.Status;
                }
            );

        }
    }
}
