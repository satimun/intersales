using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.PriceStd
{
    public class PriceStdListRangeDAPI : BaseAPIEngine<SearchRequest, PriceStdSearchRangeDRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, PriceStdSearchRangeDRes dataRes)
        {
            // mainID, productType, productGrade
           
            if(dataReq.ids.Count > 0 || (dataReq.ids.Count != 0 && dataReq.ids.First() == null))
            {
                dataReq.ids = new List<string>();
                PriceStdADO.GetInstant().SearchMain(new SearchRequest() { status = dataReq.status, ids = dataReq.ids1, ids1 = dataReq.ids2, ids2 = dataReq.ids3, ids3 = dataReq.ids4 }, Logger).ForEach(x => dataReq.ids.Add(x.ID.ToString()));
            }

            //param.Add("@countryGroupIDs", StringUtil.Join(",", d.ids));
            //param.Add("@status", StringUtil.Join(",", d.status));
            //param.Add("@productTypeIDs", StringUtil.Join(",", d.ids1));
            //param.Add("@productGradeIDs", StringUtil.Join(",", d.ids2));

            List<string> rangHIDs = new List<string>();

            PriceStdRangeHADO.GetInstant().GetByMainID(dataReq.ids, dataReq.status, this.Logger).ForEach(x => rangHIDs.Add(x.ID.ToString()));

            PriceStdRangeDADO.GetInstant().Search(new SearchRequest() { ids1 = rangHIDs, status = dataReq.status }, this.Logger).GroupBy(x => new {
                twine = x.ProductTwineSeries_ID
                , minMeshSize = x.MinMeshSize
                , maxMeshSize = x.MaxMeshSize
                , minMeshDepth = x.MinMeshDepth
                , maxMeshDepth = x.MaxMeshDepth
                , minLength = x.MinLength
                , maxLength = x.MaxLength
            }).ToList().ForEach(x =>
            {
                if(!string.IsNullOrWhiteSpace(x.First().SalesDescription) && !(x.First().SalesDescription.Contains("- ,") || x.First().SalesDescription.Contains(", -") || x.First().SalesDescription.Contains(", - ,")))
                {
                    dataRes.rangeDs.Add(new PriceStdSearchRangeDRes.PriceStdRangeD()
                    {
                        id = x.First().ID
                        , priceRangeHID = x.First().PriceStdRangeH_ID
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
