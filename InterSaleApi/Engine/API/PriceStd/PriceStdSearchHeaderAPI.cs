using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KKFCoreEngine.Util;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.Constant.ConstEnum;

namespace InterSaleApi.Engine.API.PriceStd
{
    public class PriceStdSearchHeaderAPI : BaseAPIEngine<SearchEffectiveDateReq, PriceStdSearchHeaderRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(SearchEffectiveDateReq dataReq, PriceStdSearchHeaderRes dataRes)
        {

            PriceStdADO.GetInstant().SearchHeader(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.priceHeaders.Add(new PriceStdSearchHeaderRes.PriceMain()
                {
                    id = x.ID
                    , code = x.Code
                    , type = x.Type
                    , productGroupType = x.ProductGroupType
                    , tableType = new INTIdCodeDescriptionModel() { code = x.Type, description = EnumUtil.GetDisplayName<ENPriceStdMainType>(x.Type) }
                    , countryGroup = new INTIdCodeDescriptionModel() { id = x.CountryGroup_ID, code = x.CountryGroup_Code, description = x.CountryGroup_Des }
                    , priceStdEffectiveDate = new INTIdCodeModel() { id = x.PriceStdEffectiveDate_ID, code = x.PriceStdEffectiveDate_Code }
                    , currency = new INTIdCodeDescriptionModel() { id = x.Currency_ID, code = x.Currency_Code, description = x.Currency_Des }
                    , productGrade = new INTIdCodeDescriptionModel() { id = x.ProductGrade_ID, code = x.ProductGrade_Code, description = x.ProductGrade_Des }
                    , productGroup = new INTIdCodeDescriptionModel() { id = x.ProductGroup_ID, code = x.ProductGroup_Code, description = x.ProductGroup_Des }
                    , productType = new INTIdCodeDescriptionModel() { id = x.ProductType_ID, code = x.ProductType_Code, description = x.ProductType_Des }
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
