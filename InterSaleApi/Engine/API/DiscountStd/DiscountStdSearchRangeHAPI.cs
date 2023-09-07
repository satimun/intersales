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
    public class DiscountStdSearchRangeHAPI : BaseAPIEngine<SearchRequest, DiscountStdSearchDiscountRangeHResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, DiscountStdSearchDiscountRangeHResponse dataRes)
        {
            DiscountStdADO.GetInstant().SearchRangeH(dataReq, this.Logger).ForEach(
                   x =>
                   {
                       dataRes.discountStdRangeHs.Add(new DiscountStdRangeHs()
                       {
                           id = x.ID
                           , discountStdMainID = x.DiscountStdMain_ID
                           , discountStdEffectiveDateID = x.DiscountStdEffectiveDate_ID
                           , minTwineSize = new DiscountStdRangeHs.TwineSize() { code = x.MinProductTwineSizeCode, size = x.MinFilamentSize, amount = x.MinFilamentAmount, word = x.MinFilamentWord??"" }
                           , maxTwineSize = new DiscountStdRangeHs.TwineSize() { code = x.MaxProductTwineSizeCode, size = x.MaxFilamentSize, amount = x.MaxFilamentAmount, word = x.MaxFilamentWord??"" }
                           , unitType = new INTIdCodeDescriptionModel() { id = x.UnitType_ID, code = x.UnitType_Code ?? "", description = x.UnitType_Des }
                           , colorGroups = new ColorGroups() { id = x.ProductColorGroup_ID, code = x.ProductColorGroup_Code ?? "", description = x.ProductColorGroup_Des, colors = ProductColorADO.GetInstant().GetByGroupId(x.ProductColorGroup_ID ?? 0, this.Logger).Select(y => new INTIdCodeDescriptionModel() { id = y.ID, code = y.CodeOld, description = y.Description }).ToList() }
                           , knot = new INTIdCodeDescriptionModel() { id = x.ProductKnot_ID, code = x.ProductKnot_Code ?? "", description = x.ProductKnot_Des }
                           , stretching = new INTIdCodeDescriptionModel() { id = x.ProductStretching_ID, code = x.ProductStretching_Code ?? "", description = x.ProductStretching_Des }
                           , selvageWovenType = new INTIdCodeDescriptionModel() { id = x.ProductSelvageWovenType_ID, code = x.ProductSelvageWovenType_Code ?? "", description = x.ProductSelvageWovenType_Des }
                           , status = x.Status
                           , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                       });
                   }
            );
        }
    }
}
