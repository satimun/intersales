using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class ProductFindAPI : BaseAPIEngine<ProductFindRequest, ProductFindResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(ProductFindRequest dataReq, ProductFindResponse dataRes)
        {
            Productx tmp = new Productx();
            tmp.id = 1;
            tmp.code = "D";
            tmp.description = "D";
            tmp.grade = "D";
            tmp.series = "D";
            tmp.selvage = "D";
            dataRes.products.Add(tmp);
        }
    }
}
