using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity.Request;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class PriceStdSearchByRangeForDiscountAPI : BaseAPIEngine<PriceStdSearchByRangeForDiscountRequest, PriceStdSearchPriceForDiscountResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(PriceStdSearchByRangeForDiscountRequest dataReq, PriceStdSearchPriceForDiscountResponse dataRes)
        {
            
            
            GetProductRangeRequest dataPriceRange = new GetProductRangeRequest();

            PriceStdADO.GetInstant().SearchByRangeForDiscount(dataReq, this.Logger).ForEach(
                x =>
                {
                    PriceStdsForDiscount tmp = new PriceStdsForDiscount();
                    tmp.priceStdValueID = x.priceStdValueID;
                    tmp.priceStdTableType = x.priceStdTableType;
                    tmp.priceStdTableCode = x.priceStdTableCode;
                    tmp.productDescription = x.productDescription;
                    tmp.countryGroupDescription = x.countryGroupDescription;
                    tmp.effectiveDateFrom = BaseValidate.GetDateTimeString(x.effectiveDateFrom);
                    tmp.effectiveDateTo = BaseValidate.GetDateTimeString(x.effectiveDateTo);
                    tmp.priceFOB = x.priceFOB;
                    tmp.priceCAF = x.priceCAF;
                    tmp.priceCIF = x.priceCIF;
                    tmp.effectiveStatus = x.effectiveStatus;
                    tmp.priceStatus = x.priceStatus;

                    dataRes.priceStds.Add(tmp);
                }
            );
            
        }
    }
}
