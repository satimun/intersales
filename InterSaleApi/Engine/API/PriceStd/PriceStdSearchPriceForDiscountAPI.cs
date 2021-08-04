using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity.Request;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.PriceStd
{
    public class PriceStdSearchPriceForDiscountAPI : BaseAPIEngine<PriceStdSearchPriceForDiscountReq, PriceStdSearchPriceForDiscountRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(PriceStdSearchPriceForDiscountReq dataReq, PriceStdSearchPriceForDiscountRes dataRes)
        {
            PriceStdADO.GetInstant().SearchPriceForDiscount(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.prices.Add(new PriceStdSearchPriceForDiscountRes.price()
                {
                    priceStdValueID = x.priceStdValueID
                    , priceStdTableType = x.priceStdTableType
                    , priceStdTableCode = x.priceStdTableCode
                    , tagDescription = x.tagDescription
                    , salesDescription = x.salesDescription
                    , countryGroupDescription = x.countryGroupDescription
                    , effectiveDateFrom = DateTimeUtil.GetDateTimeString(x.effectiveDateFrom)
                    , effectiveDateTo = DateTimeUtil.GetDateTimeString(x.effectiveDateTo)
                    , priceFOB = x.priceFOB
                    , priceCAF = x.priceCAF
                    , priceCIF = x.priceCIF
                    , effectiveStatus = x.effectiveStatus
                    , priceStatus = x.priceStatus
                });
            });
        }
    }
}
