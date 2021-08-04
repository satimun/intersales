using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.DiscountStd
{
    public class DiscountStdSearchDiscountForPriceAPI : BaseAPIEngine<DiscountStdSearchDiscountForPriceReq, DiscountStdSearchDiscountForPriceRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(DiscountStdSearchDiscountForPriceReq dataReq, DiscountStdSearchDiscountForPriceRes dataRes)
        {
            DiscountStdADO.GetInstant().SearchDiscountForPrice(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.discounts.Add(new DiscountStdSearchDiscountForPriceRes.discount()
                {
                    discountStdValueID = x.discountStdValueID,
                    discountStdTableType = x.discountStdTableType,
                    discountStdTableCode = x.discountStdTableCode,
                    tagDescription = x.tagDescription,
                    salesDescription = x.salesDescription,
                    customerDescription = x.customerDescription,
                    effectiveDateFrom = DateTimeUtil.GetDateTimeString(x.effectiveDateFrom),
                    effectiveDateTo = DateTimeUtil.GetDateTimeString(x.effectiveDateTo),
                    discountPercent = x.discountPercent,
                    discountAmount = x.discountAmount,
                    increaseAmount = x.increaseAmount,
                    effectiveStatus = x.effectiveStatus,
                    discountStatus = x.discountStatus,
                    approvedFlag = x.approvedFlag,
                    approvedStatus = x.approvedStatus
                });
            });
        }
    }
}
