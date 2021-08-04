using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductGetResponse : IResponseModel
    {
        public Product product = new Product();
    }

    public class Product
    {
        public int id { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string descriptionSale { get; set; }
        public string productSpoolCode { get; set; }
        public string boneFlag { get; set; }
        public decimal? boneShiftEyeAmountMD { get; set; }
        public decimal? twineChainAmount { get; set; }
        public string softenTypeCode { get; set; }
        public string rumTypeCode { get; set; }
        public string rumTypeDescription { get; set; }

        public INTIdCodeDescriptionModel productType = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productGrade = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productTwineType = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productColor = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productTwineSeries = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productKnot = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productStretching = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productSelvage = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productSelvageStretching = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productSelvageWoven = new INTIdCodeDescriptionModel();
        public ProductEyeSize productEyeSize = new ProductEyeSize();
        public ProductEyeDeep productEyeDeep = new ProductEyeDeep();
        public ProductLength productLength = new ProductLength();

    }

    public class ProductEyeSize
    {
        public int? id { get; set; }
        public string code { get; set; }
        public decimal? sezeCM { get; set; }
        public string description { get; set; }
    }

    public class ProductEyeDeep
    {
        public int? id { get; set; }
        public string code { get; set; }
        public decimal? amountMD { get; set; }
        public string description { get; set; }
    }

    public class ProductLength
    {
        public int? id { get; set; }
        public string code { get; set; }
        public decimal? lengthM { get; set; }
        public string description { get; set; }
    }
}
