using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
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
    public class DiscountStdSearchRangeValueAPI : BaseAPIEngine<SearchRequest, DiscountStdSearchDiscountRangeValueResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, DiscountStdSearchDiscountRangeValueResponse dataRes)
        {
          
            DiscountStdADO.GetInstant().SearchRangeValue(dataReq, this.Logger).ForEach(
                x =>
                {
                    dataRes.discountStdValues.Add(new DiscountStdValues()
                    {
                        id = x.ID
                        , discountRangeDID = x.DiscountStdRangeD_ID
                        , discountEffectiveDateID = x.DiscountStdEffectiveDate_ID
                        , discountRangeHID = x.DiscountStdRangeH_ID
                        , seq = x.Seq
                        , discountPercent = x.DiscountPercent
                        , discountAmount = x.DiscountAmount
                        , increaseAmount = x.IncreaseAmount
                        , minMeshSize = x.MinMeshSize
                        , maxMeshSize = x.MaxMeshSize
                        , minMeshDepth = x.MinMeshDepth
                        , maxMeshDepth = x.MaxMeshDepth
                        , minLength = x.MinLength
                        , maxLength = x.MaxLength
                        , tagDescription = x.TagDescription
                        , salesDescription = x.SalesDescription
                        , twineSeries = new INTIdCodeDescriptionModel() { id = x.ProductTwineSeries_ID, code = x.ProductTwineSeries_Code ?? "", description = x.ProductTwineSeries_Des }
                        , status = x.Status
                        , updateFlag = new INTIdCodeDescriptionModel() { id = x.UpdateFlag_ID, code = x.UpdateFlag_Code, description = x.UpdateFlag_Des }
                        , approved = new ApproveDocumentModel()
                        {
                            id = x.Approved_ID
                            , actionFlag = x.ActionFlag
                            , flag = x.ApprovedFlag
                            , statusFlag = new INTIdCodeDescriptionModel() { id = x.StatusFlag_ID, code = x.StatusFlag_Code, description = x.StatusFlag_Des }
                            , by = BaseValidate.GetEmpName(x.ApprovedBy)
                            , datetime = BaseValidate.GetDateTimeString(x.ApprovedDate)
                        }
                        , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                    });
                }
            );
        }
    }
}
