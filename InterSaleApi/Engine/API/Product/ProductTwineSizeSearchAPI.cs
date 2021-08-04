using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Product
{
    public class ProductTwineSizeSearchAPI: BaseAPIEngine<SearchRequest, ProductTwineSizeSearchRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, ProductTwineSizeSearchRes dataRes)
        {
            ProductTwineSizeADO.GetInstant().Search(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.twineSizes.Add(new ProductTwineSizeSearchRes.TwineSize()
                {
                    id = x.ID
                    , productGroup = new INTIdCodeDescriptionModel() { id = x.ProductGroup_ID, code = x.ProductGroup_Code, description = x.ProductGroup_Des }
                    , code = x.Code2
                    , description = x.Description
                    , filamentSize = x.FilamentSize
                    , filamentAmount = x.FilamentAmount
                    , filamentWord = x.FilamentWord
                    , status = x.Status
                    , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                });
            });
        }
    }
}
