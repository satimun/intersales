using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleApi.ADO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleModel.Model.Constant.ConstEnum;
using KKFCoreEngine.Util;
using InterSaleModel.Model.API.Response.PublicModel;

namespace InterSaleApi.Engine.API
{
    public class ConstantCountryGroupTypeAPI : BaseAPIEngine<NullRequest, ConstantCountryGroupModel>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, ConstantCountryGroupModel dataRes)
        {
            EnumUtil.ListKeyValuesString<ENCountryGroupType>().ForEach(x => {
                StringIdCodeDescriptionModel tmp = new StringIdCodeDescriptionModel();
                tmp.id = x.Value;
                tmp.code = x.Value;
                tmp.description = x.Key;
                dataRes.ConstantCountry.Add(tmp);
            });
        }

    }
}
