using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class ProductGetAPI : BaseAPIEngine<ProductGetRequest, ProductGetResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(ProductGetRequest dataReq, ProductGetResponse dataRes)
        {
            ProductADO.GetInstant().GetByID(dataReq.id, this.Logger).ForEach(
                x =>
                {
                    dataRes.product.id = x.ID;
                    dataRes.product.code = x.Code;
                    dataRes.product.description = x.Description;
                    dataRes.product.descriptionSale = x.DescriptionSale;
                    dataRes.product.productSpoolCode = x.ProductSpoolCode;
                    dataRes.product.boneFlag = x.BoneFlag;
                    dataRes.product.boneShiftEyeAmountMD = x.BoneShiftEyeAmountMD;
                    dataRes.product.twineChainAmount = x.TwineChainAmount;
                    dataRes.product.softenTypeCode = x.SoftenTypeCode;

                    dataRes.product.productType.id = x.ProductType_ID;
                    dataRes.product.productType.code = x.ProductType_Code;
                    dataRes.product.productType.description = x.ProductType_Description;

                    dataRes.product.productGrade.id = x.ProductGrade_ID;
                    dataRes.product.productGrade.code = x.ProductGrade_Code;
                    dataRes.product.productGrade.description = x.ProductGrade_Description;

                    dataRes.product.productTwineType.id = x.ProductTwineType_ID;
                    dataRes.product.productTwineType.code = x.ProductTwineType_Code;
                    dataRes.product.productTwineType.description = x.ProductTwineType_Description;

                    dataRes.product.productColor.id = x.ProductColor_ID;
                    dataRes.product.productColor.code = x.ProductColor_Code;
                    dataRes.product.productColor.description = x.ProductColor_Description;

                    dataRes.product.productTwineSeries.id = x.ProductTwineSeries_ID;
                    dataRes.product.productTwineSeries.code = x.ProductTwineSeries_Code;
                    dataRes.product.productTwineSeries.description = x.ProductTwineSeries_Description;

                    dataRes.product.productKnot.id = x.ProductKnot_ID;
                    dataRes.product.productKnot.code = x.ProductKnot_Code;
                    dataRes.product.productKnot.description = x.ProductKnot_Description;

                    dataRes.product.productStretching.id = x.ProductStretching_ID;
                    dataRes.product.productStretching.code = x.ProductStretching_Code;
                    dataRes.product.productStretching.description = x.ProductStretching_Description;

                    dataRes.product.productSelvage.id = x.ProductSelvage_ID;
                    dataRes.product.productSelvage.code = x.ProductSelvage_Code;
                    dataRes.product.productSelvage.description = x.ProductSelvage_Description;

                    dataRes.product.productSelvageStretching.id = x.ProductSelvageStretchingType_ID;
                    dataRes.product.productSelvageStretching.code = x.ProductSelvageStretchingType_Code;
                    dataRes.product.productSelvageStretching.description = x.ProductSelvageStretchingType_Description;

                    dataRes.product.productSelvageWoven.id = x.ProductSelvageWovenType_ID;
                    dataRes.product.productSelvageWoven.code = x.ProductSelvageWovenType_Code;
                    dataRes.product.productSelvageWoven.description = x.ProductSelvageWovenType_Description;

                    dataRes.product.productEyeSize.id = x.ProductMeshSize_ID;
                    dataRes.product.productEyeSize.code = x.ProductMeshSize_Code;
                    dataRes.product.productEyeSize.sezeCM = x.ProductMeshSize_MeshSize;
                    dataRes.product.productEyeSize.description = x.ProductMeshSize_Description;

                    dataRes.product.productEyeDeep.id = x.ProductMeshDepth_ID;
                    dataRes.product.productEyeDeep.code = x.ProductMeshDepth_Code;
                    dataRes.product.productEyeDeep.amountMD = x.ProductMeshDepth_MeshDepth;
                    dataRes.product.productEyeDeep.description = x.ProductMeshDepth_Description;

                    dataRes.product.productLength.id = x.ProductLength_ID;
                    dataRes.product.productLength.code = x.ProductLength_Code;
                    dataRes.product.productLength.lengthM = x.ProductLength_Length;
                    dataRes.product.productLength.description = x.ProductLength_Description;

                    dataRes.product.rumTypeCode = x.ProductRumType_Code;
                    dataRes.product.rumTypeDescription = x.ProductRumType_Description;
                });
        }
    }
}
