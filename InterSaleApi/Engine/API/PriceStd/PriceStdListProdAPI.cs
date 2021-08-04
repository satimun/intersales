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
    public class PriceStdListProdAPI : BaseAPIEngine<SearchRequest, PriceStdSearchProdRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, PriceStdSearchProdRes dataRes)
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
                       
            PriceStdProdADO.GetInstant().Search(new SearchRequest() { ids1 = dataReq.ids, status = dataReq.status }, this.Logger).GroupBy(x => x.Product_ID).ToList().ForEach(x =>
            {
                //var tmp = x.ToList();
                dataRes.prods.Add(new PriceStdSearchProdRes.PriceStdProd
                {
                    id = x.First().ID
                    , priceStdMainID = x.First().PriceStdMain_ID
                    , product = new INTIdCodeDescriptionModel() { id = x.First().Product_ID, code = x.First().Product_Code, description = x.First().Product_Des }
                    , unitType = new INTIdCodeDescriptionModel() { id = x.First().UnitType_ID, code = x.First().UnitType_Code, description = x.First().UnitType_Des }
                    , lastUpdate = BaseValidate.GetByDateTime((x.First().ModifyBy.HasValue ? x.First().ModifyBy : x.First().CreateBy), (x.First().ModifyDate.HasValue ? x.First().ModifyDate : x.First().CreateDate))
                });
            });
        }
    }
}
