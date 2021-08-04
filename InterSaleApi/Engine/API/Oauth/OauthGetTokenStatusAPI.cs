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
    public class OauthGetTokenStatusAPI : BaseAPIEngine<NullRequest, OauthGetTokenStatusResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, OauthGetTokenStatusResponse dataRes)
        {
            var db = TokenADO.GetInstant().GetTokenStatus(this.token, this.Logger);
            if (db.Count == 0)
            {
                throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O9001, "");
            }

            db.ForEach(
                x =>
                {
                    if (x.Code == null) { throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O1002, ""); }

                    dataRes.token = x.Code;

                    if (x.Status == "A")
                    {
                        if (x.ExpiryDate > DateTime.Now)
                        {
                            dataRes.status = "A";
                        }
                        else if (x.ExpiryDate <= DateTime.Now) 
                        {
                            dataRes.status = "E";
                        }
                        else
                        {
                            dataRes.status = "I";
                        }
                    }
                    else
                    {
                        dataRes.status = "I";
                    }

                    dataRes.expirydate = BaseValidate.GetDateTimeISO(x.ExpiryDate);
                    
                }
            );

        }
    }
}
