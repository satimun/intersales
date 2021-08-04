using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class CountryGroupListByTypeAPI : BaseAPIEngine<CountryGroupListByTypeRequest, CountryGroupListByTypeResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(CountryGroupListByTypeRequest dataReq, CountryGroupListByTypeResponse dataRes)
        {
            CountryGroupADO.GetInstant().ListByType(dataReq.groupType, this.Logger)
                .ForEach(x =>
                {
                    CountryGroupListByTypeRes tmp = new CountryGroupListByTypeRes();
                    tmp.ID = x.ID;
                    tmp.GroupType = x.GroupType;
                    tmp.Code = x.Code;
                    tmp.Description = x.Description;
                    tmp.Status = x.Status;

                    tmp.create.by = BaseValidate.GetEmpName(x.CreateBy);
                    tmp.create.datetime = BaseValidate.GetDateTimeString(x.CreateDate);

                    tmp.modify.by = BaseValidate.GetEmpName(x.ModifyBy);
                    tmp.modify.datetime = BaseValidate.GetDateTimeString(x.ModifyDate);

                    dataRes.CountryGroups.Add(tmp);
                });
        }
    }
}
