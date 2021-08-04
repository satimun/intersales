using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class DiscountStdSearchMainAPI : BaseAPIEngine<SearchRequest, DiscountStdSearchMainResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, DiscountStdSearchMainResponse dataRes)
        {
             DiscountStdADO.GetInstant().SearchMain(dataReq, this.Logger).ForEach(
                   x =>
                   {
                       dataRes.discountStdMains.Add(new DiscountStdMains() {
                           id = x.ID
                           , code = x.Code
                           , type = x.Type
                           , discountStdEffectiveDate =new INTIdCodeModel() { id = x.DiscountStdEffectiveDate_ID, code = x.DiscountStdEffectiveDate_Code }
                           , productType = new INTIdCodeDescriptionModel() { id = x.ProductType_ID, code = x.ProductType_Code, description = x.ProductType_Des }
                           , productGrade = new INTIdCodeDescriptionModel() { id = x.ProductGrade_ID, code = x.ProductGrade_Code, description = x.ProductGrade_Des }
                           , customer = new INTIdCodeDescriptionModel() { id = x.Customer_ID, code = x.Customer_Code, description = x.Customer_Des }
                           , currency = new INTIdCodeDescriptionModel() { id = x.Currency_ID, code = x.Currency_Code, description = x.Currency_Des }
                           , productGroup = new INTIdCodeDescriptionModel() { id = x.ProductGroup_ID, code = x.ProductGroup_Code, description = x.ProductGroup_Des }
                           , countryGroup = CountryGroupADO.GetInstant().Search(new SearchRequest() { ids2 = new List<string>() { x.Customer_ID.ToString() }, groupTypes = new List<string>() { "P" }, status = new List<string>() { "A" } },this.Logger).Select(y => new INTIdCodeDescriptionModel() { id = y.ID, code = y.Code, description = y.Description }).FirstOrDefault()
                           , status = x.Status
                           , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                       });    
                   }
               );
        }
    }
}
