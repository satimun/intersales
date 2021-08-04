using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class OauthChangePasswordAPI : BaseAPIEngine<OauthChangPasswordReq, NullRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(OauthChangPasswordReq dataReq, NullRes dataRes)
        {
            EmployeeADO.GetInstant().ChangePassword(dataReq.oldPass, dataReq.newPass, dataReq.matchPass, this.employeeID, this.Logger);
        }
    }
}
