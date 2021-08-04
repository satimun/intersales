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
    public class OauthRequestTokenAPI : BaseAPIEngine<OauthRequestTokenRequest, OauthRequestTokenResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(OauthRequestTokenRequest dataReq, OauthRequestTokenResponse dataRes)
        {
            var db = TokenADO.GetInstant().RequestToken(dataReq.username, dataReq.password, this.Logger);
            if(db.Count == 0) {  throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O1001, ""); }
            db.ForEach(
                x =>
                {
                    dataRes.token = x.Code;
                    dataRes.expiryDate = BaseValidate.GetDateTimeISO(x.ExpiryDate);
                    dataRes.username = BaseValidate.GetEmpName(x.Employee_ID);
                }    
            );

        }
    }
}
