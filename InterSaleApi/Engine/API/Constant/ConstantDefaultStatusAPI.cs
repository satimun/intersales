using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Constant.ConstEnum;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class ConstantDefaultStatusAPI : BaseAPIEngine<NullRequest, ConstantDefaultStatusRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, ConstantDefaultStatusRes dataRes)
        {
            EnumUtil.ListAttr<ENDefualtStatus>().ForEach(x =>
            {
                dataRes.defaultStatus.Add(new StringIdCodeDescriptionModel() {
                    id = x.Value == 0 ? null : ((char)x.Value).ToString()
                    , code = x.Value == 0 ? null : ((char)x.Value).ToString()
                    , description = x.Name
                });
            });
        }

    }
}
