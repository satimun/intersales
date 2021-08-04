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
    public class ProductStretchingSearchAPI : BaseAPIEngine<SearchRequest, ProductStretchingSearchRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, ProductStretchingSearchRes dataRes)
        {
            ProductStretchingADO.GetInstant().Search(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.stretchings.Add(new SearchResModel()
                {
                    id = x.ID
                    , code = x.Code
                    , description = x.Description
                    , status = x.Status
                    , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                });
            });
        }
    }
}
