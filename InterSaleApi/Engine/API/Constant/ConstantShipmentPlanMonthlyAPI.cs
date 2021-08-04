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
    public class ConstantShipmentPlanMonthlyAPI : BaseAPIEngine<NullRequest, ConstantMonthyStatusResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, ConstantMonthyStatusResponse dataRes)
        {
            EnumUtil.ListKeyValuesString<ENShipmentPlanMonthlyStatus>().ForEach(x => {
                if (x.Value != ENShipmentPlanMonthlyStatus.REMOVE.GetValueString())
                {
                    StringIdCodeDescriptionModel tmp = new StringIdCodeDescriptionModel();
                    tmp.id = x.Value;
                    tmp.code = x.Value;
                    tmp.description = x.Key;
                    dataRes.monthlyStatus.Add(tmp);
                }
            });
        }

    }
}
