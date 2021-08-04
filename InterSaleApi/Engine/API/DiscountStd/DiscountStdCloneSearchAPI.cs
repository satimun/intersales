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

namespace InterSaleApi.Engine.API.DiscountStd
{
    public class DiscountStdCloneSearchAPI : BaseAPIEngine<SearchRequest, DiscountStdCloneSearchRes>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, DiscountStdCloneSearchRes dataRes)
        {
            DiscountStdADO.GetInstant().CloneSearch(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.discountStds.Add(new DiscountStdCloneSearchRes.DiscountCloneSearh()
                {
                    id = x.ID
                    , code = x.Code
                    , type = x.Type
                    , discountStdEffectiveDate = new INTIdCodeModel() { id = x.DiscountStdEffectiveDate_ID, code = x.DiscountStdEffectiveDate_Code }
                    , effectiveDateFrom = x.EffectiveDateFrom.GetDateString()
                    , effectiveDateTo = x.EffectiveDateTo.GetDateString()
                    , countApproved = x.CountApprove
                    , productType = new INTIdCodeDescriptionModel() { id = x.ProductType_ID, code = x.ProductType_Code, description = x.ProductType_Des }
                    , productGrade = new INTIdCodeDescriptionModel() { id = x.ProductGrade_ID, code = x.ProductGrade_Code, description = x.ProductGrade_Des }
                    , productGroup = new INTIdCodeDescriptionModel() { id = x.ProductGroup_ID, code = x.ProductGroup_Code, description = x.ProductGroup_Des }
                    , currency = new INTIdCodeDescriptionModel() { id = x.Currency_ID, code = x.Currency_Code, description = x.Currency_Des }
                    , customer = new INTIdCodeDescriptionModel() { id = x.Customer_ID, code = x.Customer_Code, description = x.Customer_Des }
                    , status = x.Status
                    , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                });
            });
        }
    }
}
