using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicModel;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class DiscountStdSearchEffectiveDateAPI : BaseAPIEngine<SearchEffectiveDateReq, DiscountStdSearchEffectDateResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchEffectiveDateReq dataReq, DiscountStdSearchEffectDateResponse dataRes)
        {
            DiscountStdADO.GetInstant().SearchEffectiveDate(dataReq, this.Logger).ForEach(
                   x =>
                   {
                       dataRes.discountStdEffectiveDates.Add(new EffectiveDateModel()
                        {
                            id = x.ID
                            , discountStdMain = new INTIdCodeModel() { id = x.DiscountStdMain_ID, code = x.DiscountStdMain_Code }
                            , code = x.Code
                            , effectiveDateFrom = BaseValidate.GetDateTimeString(x.EffectiveDateFrom)
                            , effectiveDateTo = BaseValidate.GetDateTimeString(x.EffectiveDateTo)
                            , effectiveOldDateFrom = BaseValidate.GetDateTimeString(x.EffectiveOldDateFrom)
                            , effectiveOldDateTo = BaseValidate.GetDateTimeString(x.EffectiveOldDateTo)
                            , countApprove = x.CountApprove
                            , countTotal = x.CountTotal
                            , status = x.Status
                            , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                        });
                   }
               );
        }
    }
}
