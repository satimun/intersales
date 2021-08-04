using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicModel;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class PriceStdSearchEffectiveDateAPI : BaseAPIEngine<SearchEffectiveDateReq, PriceStdSearchEffectiveDateResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchEffectiveDateReq dataReq, PriceStdSearchEffectiveDateResponse dataRes)
        {
            PriceStdADO.GetInstant().SearchEffectiveDate(dataReq, this.Logger).ForEach( x =>
            {
                dataRes.priceStdEffectiveDates.Add(new EffectiveDateModel()
                {
                    id = x.ID
                    , priceStdMain = new InterSaleModel.Model.API.Response.PublicModel.INTIdCodeModel() { id = x.PriceStdMain_ID, code = x.PriceStdMain_Code }
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
            });
        }
    }
}
