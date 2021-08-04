using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class ProductTypeListAPI : BaseAPIEngine<NullRequest, ProductTypeListResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, ProductTypeListResponse dataRes)
        {
            var db = ProductTypeADO.GetInstant().List();
            db.ForEach(
                    x =>
                    {
                        ProductTypeListResponse.productType tmp = new ProductTypeListResponse.productType();
                        tmp.id = x.ID;
                        tmp.code = x.Code;
                        tmp.description = x.Description;
                        dataRes.productTypes.Add(tmp);
                    }
                );
        }
    }
}
