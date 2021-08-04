using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class DiscountStdImportDiscountResponse : IResponseModel
    {
        public List<DiscountStdMainsRS> discountStdMains = new List<DiscountStdMainsRS>();
    }

    public class DiscountStdMainsRS
    {
        public int id { get; set; }
        public string customerCode { get; set; }
        public string type { get; set; }
        public string productTypeCode { get; set; }
        public string productGradeCode { get; set; }
        public string currencyCode { get; set; }
        public ResultArrModel _result = new ResultArrModel();

        public List<DiscountStdEffectiveDateRS> discountStdEffectiveDate = new List<DiscountStdEffectiveDateRS>();

    }
    public class DiscountStdEffectiveDateRS
    {
        public int id { get; set; }
        public string effectiveDateFrom { get; set; }
        public string effectiveDateTo { get; set; }

        public DiscountStdProdCodeRS discountStdProdCode = new DiscountStdProdCodeRS();

        public DiscountStdRangeRS discountStdRange = new DiscountStdRangeRS();

        public ResultArrModel _result = new ResultArrModel();

    }

    public class DiscountStdProdCodeRS
    {
        public List<DiscountStdValuesProdCodeRS> discountStdValues = new List<DiscountStdValuesProdCodeRS>();

    }

    public class DiscountStdValuesProdCodeRS
    {
        public int id { get; set; }
        public string productCode { get; set; }
        public string unitTypeCode { get; set; }

        public decimal discountPercent { get; set; }
        public decimal discountAmount { get; set; }
        public decimal increaseAmount { get; set; }

        public ResultArrModel _result = new ResultArrModel();
    }


    public class DiscountStdRangeRS
    {
        public List<DiscountStdRangeHRS> discountStdRangeH = new List<DiscountStdRangeHRS>();

    }

    public class DiscountStdRangeHRS
    {
        public int id { get; set; }
        public string minTwineSizeCode { get; set; }
        public string maxTwineSizeCode { get; set; }
        public string unitTypeCode { get; set; }
        public string colorCode { get; set; }
        public string knotCode { get; set; }
        public string stretchingCode { get; set; }
        public string selvageWovenTypeCode { get; set; }

        public List<DiscountStdValuesRangeRS> discountStdValues = new List<DiscountStdValuesRangeRS>();

        public ResultArrModel _result = new ResultArrModel();

    }

    public class DiscountStdValuesRangeRS
    {
        public int id { get; set; }
        public decimal? minEyeSizeCM { get; set; }
        public decimal? maxEyeSizeCM { get; set; }
        public decimal? minEyeAmountMD { get; set; }
        public decimal? maxEyeAmountMD { get; set; }
        public decimal? minLengthM { get; set; }
        public decimal? maxLengthM { get; set; }

        public string productTwineSeriesCode { get; set; }

        public decimal discountPercent { get; set; }
        public decimal discountAmount { get; set; }
        public decimal increaseAmount { get; set; }

    }

    //public class ProductTwineSeriesRS
    //{
    //    public decimal? amountUnit { get; set; }
    //    public string unitTypeCode { get; set; }
    //    public decimal? amountPackage { get; set; }
    //    public string packageTypeCode { get; set; }

    //}

}
