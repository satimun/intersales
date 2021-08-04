using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductSearchRes : IResponseModel
    {
        public List<Product> products = new List<Product>();
        public class Product
        {
            public int id { get; set; }
            public string code { get; set; }
            public string description { get; set; }

            public string productSpoolCode { get; set; }
            public string boneFlag { get; set; }
            public decimal? boneShiftEyeAmountMD { get; set; }
            public decimal? twineChainAmount { get; set; }
            public string softenTypeCode { get; set; }

            public INTIdCodeDescriptionModel productType { get; set; }
            public INTIdCodeDescriptionModel productGrade { get; set; }
            public INTIdCodeDescriptionModel productTwineType { get; set; }
            public ProductTwineSize productTwineSize { get; set; }
            public INTIdCodeDescriptionModel productColor { get; set; }
            public INTIdCodeDescriptionModel productTwineSeries { get; set; }
            public INTIdCodeDescriptionModel productKnot { get; set; }
            public INTIdCodeDescriptionModel productStretching { get; set; }
            public INTIdCodeDescriptionModel productSelvage { get; set; }
            public INTIdCodeDescriptionModel productSelvageStretching { get; set; }
            public INTIdCodeDescriptionModel productSelvageWoven { get; set; }
            public INTIdCodeDescriptionModel rumType { get; set; }

            public List<ProductLayer> productLayer = new List<ProductLayer>();

            public ProductEyeSize productMeshSize { get; set; }
            public ProductEyeDeep productMeshDepth { get; set; }
            public ProductLength productLength { get; set; }

            public class ProductEyeSize : INTIdCodeDescriptionModel
            {
                public decimal? meshSize { get; set; }
            }

            public class ProductEyeDeep : INTIdCodeDescriptionModel
            {
                public decimal? meshDepth { get; set; }
            }

            public class ProductLength : INTIdCodeDescriptionModel
            {
                public decimal? length { get; set; }
            }

            public class ProductLayer : INTIdCodeDescriptionModel
            {
                public int seq { get; set; }
            }

            public class ProductTwineSize : INTIdCodeDescriptionModel
            {
                public decimal size { get; set; }
                public decimal amount { get; set; }
                public string word { get; set; }
            }
        }
    }
}
