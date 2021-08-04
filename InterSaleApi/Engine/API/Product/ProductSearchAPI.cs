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
    public class ProductSearchAPI : BaseAPIEngine<SearchRequest, ProductSearchRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, ProductSearchRes dataRes)
        {
            //if(!string.IsNullOrWhiteSpace(dataReq.search))
            //{

            //}     
            var tmp = ProductADO.GetInstant().Search(dataReq, this.Logger);

            tmp.GroupBy(x => new { id = x.ID, grade = x.ProductGrade_ID }).ToList().ForEach(x =>
            {
                var layer = new List<ProductSearchRes.Product.ProductLayer>();
                x.ToList().Where(y => y.LayerProduct_ID != null).ToList().ForEach(l => layer.Add(new ProductSearchRes.Product.ProductLayer() { id = l.LayerProduct_ID, code = l.LayerProduct_Code, description = l.LayerProduct_Des, seq = l.LayerProduct_Seq }));

                dataRes.products.Add(new ProductSearchRes.Product()
                {
                    id = x.First().ID
                    ,
                    code = x.First().Code
                    ,
                    description = x.First().DescriptionSale
                    ,
                    boneFlag = x.First().BoneFlag
                    ,
                    boneShiftEyeAmountMD = x.First().BoneShiftEyeAmountMD
                    ,
                    productSpoolCode = x.First().ProductSpoolCode
                    ,
                    softenTypeCode = x.First().SoftenTypeCode
                    ,
                    twineChainAmount = x.First().TwineChainAmount
                    ,
                    productType = new INTIdCodeDescriptionModel() { id = x.First().ProductType_ID, code = x.First().ProductType_Code, description = x.First().ProductType_Description }
                    ,
                    productGrade = new INTIdCodeDescriptionModel() { id = x.First().ProductGrade_ID, code = x.First().ProductGrade_Code, description = x.First().ProductGrade_Description }
                    ,
                    productKnot = new INTIdCodeDescriptionModel() { id = x.First().ProductKnot_ID, code = x.First().ProductKnot_Code, description = x.First().ProductKnot_Description }
                    ,
                    productStretching = new INTIdCodeDescriptionModel() { id = x.First().ProductStretching_ID, code = x.First().ProductStretching_Code, description = x.First().ProductStretching_Description }
                    ,
                    productTwineSeries = new INTIdCodeDescriptionModel() { id = x.First().ProductTwineSeries_ID, code = x.First().ProductTwineSeries_Code, description = x.First().ProductTwineSeries_Description }
                    ,
                    productTwineType = new INTIdCodeDescriptionModel() { id = x.First().ProductTwineType_ID, code = x.First().ProductTwineType_Code, description = x.First().ProductTwineType_Description }
                    ,
                    productTwineSize = new ProductSearchRes.Product.ProductTwineSize() { id = x.First().ProductTwineSize_ID, code = x.First().ProductTwineSize_Code, size = x.First().ProductTwineSize_FilamentSize, amount = x.First().ProductTwineSize_FilamentAmount, word = x.First().ProductTwineSize_FilamentWord }
                    ,
                    productSelvage = new INTIdCodeDescriptionModel() { id = x.First().ProductSelvage_ID, code = x.First().ProductSelvage_Code, description = x.First().ProductSelvage_Description }
                    ,
                    productSelvageStretching = new INTIdCodeDescriptionModel() { id = x.First().ProductSelvageStretchingType_ID, code = x.First().ProductSelvageStretchingType_Code, description = x.First().ProductSelvageStretchingType_Description }
                    ,
                    productSelvageWoven = new INTIdCodeDescriptionModel() { id = x.First().ProductSelvageWovenType_ID, code = x.First().ProductSelvageWovenType_Code, description = x.First().ProductSelvageWovenType_Description }
                    ,
                    productColor = new INTIdCodeDescriptionModel() { id = x.First().ProductColor_ID, code = x.First().ProductColor_Code, description = x.First().ProductColor_Description }
                    ,
                    rumType = new INTIdCodeDescriptionModel() { id = x.First().ProductRumType_ID, code = x.First().ProductRumType_Code, description = x.First().ProductRumType_Description }
                    ,
                    productMeshDepth = new ProductSearchRes.Product.ProductEyeDeep() { id = x.First().ProductMeshDepth_ID, code = x.First().ProductMeshDepth_Code, description = x.First().ProductMeshDepth_Description, meshDepth = x.First().ProductMeshDepth_MeshDepth }
                    ,
                    productMeshSize = new ProductSearchRes.Product.ProductEyeSize() { id = x.First().ProductMeshSize_ID, code = x.First().ProductMeshSize_Code, description = x.First().ProductMeshSize_Description, meshSize = x.First().ProductMeshSize_MeshSize }
                    ,
                    productLength = new ProductSearchRes.Product.ProductLength() { id = x.First().ProductLength_ID, code = x.First().ProductLength_Code, description = x.First().ProductLength_Description, length = x.First().ProductLength_Length }
                    ,
                    productLayer = layer
                });
            });
        }
    }
}
