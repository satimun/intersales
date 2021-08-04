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
    public class ProductColorSearchAPI : BaseAPIEngine<SearchRequest, ProductColorSearchRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, ProductColorSearchRes dataRes)
        {
            ProductColorADO.GetInstant().Search(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.colors.Add(new SearchResModel()
                {
                    id = x.ID
                    , code = x.CodeOld
                    , description = x.Description
                    , status = x.Status
                    , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                });
            });
        }
    }
}
