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
    public class ConstantShipmentStatusAPI : BaseAPIEngine<NullRequest, ConstantShipmentStatusRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, ConstantShipmentStatusRes dataRes)
        {
            EnumUtil.ListAttr<ENShipmentStatus>().ForEach(x =>
            {
                ConstantShipmentStatusRes.ConstantShipmentStatus tmp = new ConstantShipmentStatusRes.ConstantShipmentStatus();
                tmp.id = x.Value == 0 ? null : ((char)x.Value).ToString();
                tmp.code = tmp.id;
                tmp.description = x.Name;
                tmp.step = int.Parse(x.GroupName);
                dataRes.constantShipmentStatus.Add(tmp);
            });
        }

    }
}
