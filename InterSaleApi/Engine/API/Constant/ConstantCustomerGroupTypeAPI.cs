using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
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
    public class ConstantCustomerGroupTypeAPI : BaseAPIEngine<NullRequest, ConstantCustomerGroupTypeResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, ConstantCustomerGroupTypeResponse dataRes)
        {
            var en = EnumUtil.ListKeyValuesString<ENDCustomerGroupTyp>();
            en.ForEach(x => {
                StringIdCodeDescriptionModel tmp = new StringIdCodeDescriptionModel();
                tmp.id = x.Value;
                tmp.code = x.Value;
                tmp.description = x.Key;
                /*
                tmp.create.by = BaseValidate.GetEmpName(x.CreateBy);
                tmp.create.datetime = BaseValidate.GetDateTimeString(x.CreateDate);

                tmp.modify.by = BaseValidate.GetEmpName(x.ModifyBy);
                tmp.modify.datetime = BaseValidate.GetDateTimeString(x.ModifyDate);
                */
                dataRes.CustomerGroupType.Add(tmp);
            });
        }
    }
}
