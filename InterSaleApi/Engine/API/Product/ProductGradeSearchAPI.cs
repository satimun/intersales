using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Product
{
    public class ProductGradeSearchAPI : BaseAPIEngine<SearchRequest, ProductGradeListResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, ProductGradeListResponse dataRes)
        {
            ProductGradeADO.GetInstant().Search(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.productGrades.Add(new INTIdCodeDescriptionModel()
                {
                    id = x.ID
                    , code = x.Code
                    , description = x.Description
                });
            });
        }
    }
}
