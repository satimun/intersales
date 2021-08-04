using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.DiscountStd
{
    public class DiscountStdListRangeDAPI : BaseAPIEngine<SearchRequest, DiscountStdSearchRangeDRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, DiscountStdSearchRangeDRes dataRes)
        {
            // mainID, productType, productGrade
            List<string> rangHIDs = new List<string>();
            DiscountStdRangeHADO.GetInstant().GetByMainID(dataReq.ids, dataReq.status, this.Logger).ForEach(x => rangHIDs.Add(x.ID.ToString()));

            DiscountStdRangeDADO.GetInstant().Search(new SearchRequest() { ids1 = rangHIDs, status = dataReq.status }, this.Logger).GroupBy(x => new {
                twine = x.ProductTwineSeries_ID
                , minMeshSize = x.MinMeshSize
                , maxMeshSize = x.MaxMeshSize
                , minMeshDepth = x.MinMeshDepth
                , maxMeshDepth = x.MaxMeshDepth
                , minLength = x.MinLength
                , maxLength = x.MaxLength
            }).ToList().ForEach(x =>
            {
                if(!(x.First().SalesDescription.Contains("- ,") || x.First().SalesDescription.Contains(", -") || x.First().SalesDescription.Contains(", - ,")))
                {
                    dataRes.rangeDs.Add(new DiscountStdSearchRangeDRes.DiscountStdRangeD()
                    {
                        id = x.First().ID
                        , discountRangeHID = x.First().DiscountStdRangeH_ID??0
                        , twineSeries = new INTIdCodeDescriptionModel() { id = x.First().ProductTwineSeries_ID, code = x.First().ProductTwineSeries_Code, description = x.First().ProductTwineSeries_Des }
                        , minMeshSize = x.First().MinMeshSize
                        , maxMeshSize = x.First().MaxMeshSize
                        , minMeshDepth = x.First().MinMeshDepth
                        , maxMeshDepth = x.First().MaxMeshDepth
                        , minLength = x.First().MinLength
                        , maxLength = x.First().MaxLength
                        , salesDescription = x.First().SalesDescription
                        , tagDescription = x.First().TagDescription
                        , lastUpdate = BaseValidate.GetByDateTime((x.First().ModifyBy.HasValue ? x.First().ModifyBy : x.First().CreateBy), (x.First().ModifyDate.HasValue ? x.First().ModifyDate : x.First().CreateDate))
                    });
                }  
            });
        }
    }
}
