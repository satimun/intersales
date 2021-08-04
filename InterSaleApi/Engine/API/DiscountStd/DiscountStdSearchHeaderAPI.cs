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

namespace InterSaleApi.Engine.API.DiscountStd
{
    public class DiscountStdSearchHeaderAPI : BaseAPIEngine<SearchEffectiveDateReq, DiscountStdSearchHeaderRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(SearchEffectiveDateReq dataReq, DiscountStdSearchHeaderRes dataRes)
        {

            DiscountStdADO.GetInstant().SearchHeader(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.discountHeaders.Add(new DiscountStdSearchHeaderRes.DiscountMain()
                {
                    id = x.ID
                    , code = x.Code
                    , type = x.Type
                    , productGroupType = x.ProductGroupType
                    , tableType = new INTIdCodeDescriptionModel() { code = x.Type, description = EnumUtil.GetDisplayName<ENPriceStdMainType>(x.Type) }
                    , customer = new INTIdCodeDescriptionModel() { id = x.Customer_ID, code = x.Customer_Code, description = x.Customer_Des }
                    , discountStdEffectiveDate = new INTIdCodeModel() { id = x.DiscountStdEffectiveDate_ID, code = x.DiscountStdEffectiveDate_Code }
                    , currency = new INTIdCodeDescriptionModel() { id = x.Currency_ID, code = x.Currency_Code, description = x.Currency_Des }
                    , productGrade = new INTIdCodeDescriptionModel() { id = x.ProductGrade_ID, code = x.ProductGrade_Code, description = x.ProductGrade_Des }
                    , productGroup = new INTIdCodeDescriptionModel() { id = x.ProductGroup_ID, code = x.ProductGroup_Code, description = x.ProductGroup_Des }
                    , productType = new INTIdCodeDescriptionModel() { id = x.ProductType_ID, code = x.ProductType_Code, description = x.ProductType_Des }
                    , countryGroup = new INTIdCodeDescriptionModel() { id = x.CountryGroup_ID, code = x.CountryGroup_Code, description = x.CountryGroup_Des }
                    , effectiveDateFrom = x.EffectiveDateFrom.GetDateTimeString()
                    , effectiveDateTo = x.EffectiveDateTo.GetDateTimeString()
                    , effectiveOldDateFrom = x.EffectiveOldDateFrom.GetDateString()
                    , effectiveOldDateTo = x.EffectiveOldDateTo.GetDateString()
                    , status = x.Status
                    , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                });
            });
        }
    }
}
