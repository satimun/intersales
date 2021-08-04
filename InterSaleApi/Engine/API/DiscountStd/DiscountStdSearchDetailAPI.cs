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
    public class DiscountStdSearchDetailAPI : BaseAPIEngine<SearchRequest, DiscountStdSearchDetailRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, DiscountStdSearchDetailRes dataRes)
        {

            DiscountStdADO.GetInstant().SearchDetail(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.discountDetails.Add(new DiscountStdSearchDetailRes.DiscountDetail()
                {
                    id = x.ID
                    , seq = x.Seq
                    , discountStdMainID = Convert.ToInt32(dataReq.ids.First())
                    , discountEffectiveDateID = Convert.ToInt32(dataReq.ids1.First())

                    , discountStdProdID = x.DiscountStdProd_ID ?? 0
                    , product = new INTIdCodeDescriptionModel() { id = x.Product_ID, code = x.Product_Code, description = x.Product_Des }

                    , discountRangeHID = x.DiscountStdRangeH_ID ?? 0
                    , minTwineSize = new DiscountStdSearchDetailRes.DiscountDetail.TwineSize() { code = x.MinProductTwineSizeCode, amount = x.MinFilamentAmount, size = x.MinFilamentSize, word = x.MinFilamentWord }
                    , maxTwineSize = new DiscountStdSearchDetailRes.DiscountDetail.TwineSize() { code = x.MaxProductTwineSizeCode, amount = x.MaxFilamentAmount, size = x.MaxFilamentSize, word = x.MaxFilamentWord }
                    , knot = new INTIdCodeDescriptionModel() { id = x.ProductKnot_ID, code = x.ProductKnot_Code, description = x.ProductKnot_Des }
                    , stretching = new INTIdCodeDescriptionModel() { id = x.ProductStretching_ID, code = x.ProductStretching_Code, description = x.ProductStretching_Des }
                    , selvageWovenType = new INTIdCodeDescriptionModel() { id = x.ProductSelvageWovenType_ID, code = x.ProductSelvageWovenType_Code, description = x.ProductSelvageWovenType_Des }
                    , colorGroup = new INTIdCodeDescriptionModel() { id = x.ProductColorGroup_ID, code = x.ProductColorGroup_Code, description = x.ProductColorGroup_Des }

                    , discountRangeDID = x.DiscountStdRangeD_ID ?? 0
                    , twineSeries = new INTIdCodeDescriptionModel() { id = x.ProductTwineSeries_ID, code = x.ProductTwineSeries_Code, description = x.ProductTwineSeries_Des }
                    , minMeshSize = x.MinMeshSize
                    , maxMeshSize = x.MaxMeshSize
                    , minMeshDepth = x.MinMeshDepth
                    , maxMeshDepth = x.MaxMeshDepth
                    , minLength = x.MinLength
                    , maxLength = x.MaxLength
                    , salesDescription = x.SalesDescription
                    , tagDescription = x.TagDescription

                    , unitType = new INTIdCodeDescriptionModel() { id = x.UnitType_ID, code = x.UnitType_Code, description = x.UnitType_Des }

                    , discountPercent = x.DiscountPercent
                    , discountAmount = x.DiscountAmount
                    , increaseAmount = x.IncreaseAmount

                    , updateFlag = new INTIdCodeDescriptionModel() { id = x.UpdateFlag_ID, code = x.UpdateFlag_Code, description = x.UpdateFlag_Des }
                    , approved = new ApproveDocumentModel()
                    {
                        id = x.Approved_ID
                        , actionFlag = x.ActionFlag
                        , statusFlag = new INTIdCodeDescriptionModel() { id = x.StatusFlag_ID, code = x.StatusFlag_Code, description = x.StatusFlag_Des }
                        , flag = x.ApprovedFlag
                        , by = BaseValidate.GetEmpName(x.ApprovedBy), datetime = x.ApprovedDate.GetDateTimeString()
                    }
                    , status = x.Status
                    , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                });
                
            });
        }
    }
}
