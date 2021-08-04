using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsProduct
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string DescriptionSale { get; set; }
        public int ProductType_ID { get; set; }
        public string ProductTypeCode { get; set; }
        public int ProductGrade_ID { get; set; }
        public string ProductGradeCode { get; set; }
        public int ProductTwineType_ID { get; set; }
        public string ProductTwineTypeCode { get; set; }
        public int ProductTwineSize_ID { get; set; }
        public string ProductTwineSizeCode2 { get; set; }
        public int ProductColor_ID { get; set; }
        public string ProductColorCodeOld { get; set; }
        public int ProductTwineSeries_ID { get; set; }
        public string ProductTwineSeriesCode { get; set; }
        public int ProductKnot_ID { get; set; }
        public string ProductKnotCode2 { get; set; }
        public int ProductStretching_ID { get; set; }
        public string ProductStretchingCode { get; set; }
        public int ProductSelvage_ID { get; set; }
        public string ProductSelvageCode { get; set; }
        public int ProductSelvageStretchingType_ID { get; set; }
        public string ProductSelvageStretchingTypeCode { get; set; }
        public int ProductSelvageWovenType_ID { get; set; }
        public string ProductSelvageWovenTypeCode { get; set; }

        public int ProductMeshSize_ID { get; set; }
        public decimal ProductMeshSize_MeshSize { get; set; }

        public int ProductMeshDepth_ID { get; set; }
        public decimal ProductMeshDepth_MeshDepth { get; set; }

        public int ProductLength_ID { get; set; }
        public decimal ProductLength_Length { get; set; }

        public string ProductSpoolCode { get; set; }
        public char BoneFlag { get; set; }
        public decimal BoneShiftEyeAmountMD { get; set; }
        public decimal TwineChainAmount { get; set; }
        public string SoftenTypeCode { get; set; }
        public string ProductRumType_Code { get; set; }
        public string ProductRumType_Description { get; set; }

        public char Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
