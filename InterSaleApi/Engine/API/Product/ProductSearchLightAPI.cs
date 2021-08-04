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
    public class ProductSearchLightAPI : BaseAPIEngine<SearchRequest, ProductSearchLightRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, ProductSearchLightRes dataRes)
        {    
            var tmp = ProductADO.GetInstant().SearchLight(dataReq, this.Logger);
            //var res = new List<ProductSearchLightRes.Product>();
            //res.Clear();

            //Parallel.ForEach(tmp, (x) =>
            //{
            //    dataRes.products.Add(new ProductSearchLightRes.Product()
            //    {
            //        id = x.ID,
            //        code = x.Code,
            //        description = x.DescriptionSale,
            //        productType = new INTIdCodeDescriptionModel() { id = x.ProductType_ID, code = x.ProductType_Code, description = x.ProductType_Description },
            //        rumType = new INTIdCodeDescriptionModel() { id = x.ProductRumType_ID, code = x.ProductRumType_Code, description = x.ProductRumType_Description }
            //    });

            //});

            tmp.ForEach(x =>
            {
                dataRes.products.Add(new ProductSearchLightRes.Product()
                {
                    id = x.ID,
                    code = x.Code,
                    description = x.DescriptionSale,
                    productType = new INTIdCodeDescriptionModel() { id = x.ProductType_ID, code = x.ProductType_Code, description = x.ProductType_Description },
                    rumType = new INTIdCodeDescriptionModel() { id = x.ProductRumType_ID, code = x.ProductRumType_Code, description = x.ProductRumType_Description }
                });
            });

        }
    }
}
