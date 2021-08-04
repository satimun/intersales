using InterSaleApi.ADO;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request.PublicRequest;

namespace InterSaleApi.Engine.API
{
    public class PriceStdSearchMainAPI : BaseAPIEngine<SearchRequest, PriceStdSearchMainResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, PriceStdSearchMainResponse dataRes)
        {
            
            PriceStdADO.GetInstant().SearchMain(dataReq, this.Logger).ForEach(
                   x =>
                   {
                       dataRes.priceStdMains.Add(new PriceStdMains() {
                           id = x.ID
                           , code = x.Code
                           , type = x.Type
                           , priceStdEffectiveDate =new INTIdCodeModel() { id = x.PriceStdEffectiveDate_ID, code = x.PriceStdEffectiveDate_Code }
                           , productType = new INTIdCodeDescriptionModel() { id = x.ProductType_ID, code = x.ProductType_Code, description = x.ProductType_Des }
                           , productGrade = new INTIdCodeDescriptionModel() { id = x.ProductGrade_ID, code = x.ProductGrade_Code, description = x.ProductGrade_Des }
                           , countryGroup = new INTIdCodeDescriptionModel() { id = x.CountryGroup_ID, code = x.CountryGroup_Code, description = x.CountryGroup_Des }
                           , currency = new INTIdCodeDescriptionModel() { id = x.Currency_ID, code = x.Currency_Code, description = x.Currency_Des }
                           , productGroup = new INTIdCodeDescriptionModel() { id = x.ProductGroup_ID, code = x.ProductGroup_Code, description = x.ProductGroup_Des }
                           , status = x.Status
                           , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                       });                       
                   }
               );
        }

    }
}
