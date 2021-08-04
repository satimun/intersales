using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleApi.ADO;

namespace InterSaleApi.Engine.API
{
    public class ProductSearchLayerAPI : BaseAPIEngine<ProductSearchLayerRequest, ProductSearchLayerResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(ProductSearchLayerRequest dataReq, ProductSearchLayerResponse dataRes)
        {
            ProductADO.GetInstant().SearchLayerByProductID(dataReq.productID, this.Logger).ForEach(
                x =>
                {
                    ProductGetResponse res = new ProductGetResponse();
                    dataRes.products.Add(res);

                    res.product.id = x.ID;
                    res.product.code = x.Code;
                    res.product.description = x.Description;
                    res.product.descriptionSale = x.DescriptionSale;
                    res.product.productSpoolCode = x.ProductSpoolCode;
                    res.product.boneFlag = x.BoneFlag;
                    res.product.boneShiftEyeAmountMD = x.BoneShiftEyeAmountMD;
                    res.product.twineChainAmount = x.TwineChainAmount;
                    res.product.softenTypeCode = x.SoftenTypeCode;

                    res.product.productType.id = x.ProductType_ID;
                    res.product.productType.code = x.ProductType_Code;
                    res.product.productType.description = x.ProductType_Description;

                    res.product.productGrade.id = x.ProductGrade_ID;
                    res.product.productGrade.code = x.ProductGrade_Code;
                    res.product.productGrade.description = x.ProductGrade_Description;

                    res.product.productTwineType.id = x.ProductTwineType_ID;
                    res.product.productTwineType.code = x.ProductTwineType_Code;
                    res.product.productTwineType.description = x.ProductTwineType_Description;

                    res.product.productColor.id = x.ProductColor_ID;
                    res.product.productColor.code = x.ProductColor_Code;
                    res.product.productColor.description = x.ProductColor_Description;

                    res.product.productTwineSeries.id = x.ProductTwineSeries_ID;
                    res.product.productTwineSeries.code = x.ProductTwineSeries_Code;
                    res.product.productTwineSeries.description = x.ProductTwineSeries_Description;

                    res.product.productKnot.id = x.ProductKnot_ID;
                    res.product.productKnot.code = x.ProductKnot_Code;
                    res.product.productKnot.description = x.ProductKnot_Description;

                    res.product.productStretching.id = x.ProductStretching_ID;
                    res.product.productStretching.code = x.ProductStretching_Code;
                    res.product.productStretching.description = x.ProductStretching_Description;

                    res.product.productSelvage.id = x.ProductSelvage_ID;
                    res.product.productSelvage.code = x.ProductSelvage_Code;
                    res.product.productSelvage.description = x.ProductSelvage_Description;

                    res.product.productSelvageStretching.id = x.ProductSelvageStretchingType_ID;
                    res.product.productSelvageStretching.code = x.ProductSelvageStretchingType_Code;
                    res.product.productSelvageStretching.description = x.ProductSelvageStretchingType_Description;

                    res.product.productSelvageWoven.id = x.ProductSelvageWovenType_ID;
                    res.product.productSelvageWoven.code = x.ProductSelvageWovenType_Code;
                    res.product.productSelvageWoven.description = x.ProductSelvageWovenType_Description;

                    res.product.productEyeSize.id = x.ProductMeshSize_ID;
                    res.product.productEyeSize.code = x.ProductMeshSize_Code;
                    res.product.productEyeSize.sezeCM = x.ProductMeshSize_MeshSize;
                    res.product.productEyeSize.description = x.ProductMeshSize_Description;

                    res.product.productEyeDeep.id = x.ProductMeshDepth_ID;
                    res.product.productEyeDeep.code = x.ProductMeshDepth_Code;
                    res.product.productEyeDeep.amountMD = x.ProductMeshDepth_MeshDepth;
                    res.product.productEyeDeep.description = x.ProductMeshDepth_Description;

                    res.product.productLength.id = x.ProductLength_ID;
                    res.product.productLength.code = x.ProductLength_Code;
                    res.product.productLength.lengthM = x.ProductLength_Length;
                    res.product.productLength.description = x.ProductLength_Description;

                    res.product.rumTypeCode = x.ProductRumType_Code;
                    res.product.rumTypeDescription = x.ProductRumType_Description;
                });
        }
    }
}
