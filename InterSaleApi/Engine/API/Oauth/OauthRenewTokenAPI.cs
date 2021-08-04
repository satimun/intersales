using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class OauthRenewTokenAPI : BaseAPIEngine<OauthRenewTokenRequest, OauthRenewTokenResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(OauthRenewTokenRequest dataReq, OauthRenewTokenResponse dataRes)
        {
            var db = TokenADO.GetInstant().RenewToken(this.token, dataReq.password, this.Logger);
            if (db.Count == 0) { throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O9002, ""); }

            db.ForEach(
                x =>
                {
                    dataRes.token = x.Code;
                    dataRes.expirydate = BaseValidate.GetDateTimeISO(x.ExpiryDate);
                }
            );

        }
    }
}
