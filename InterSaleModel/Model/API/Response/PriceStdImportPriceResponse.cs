using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdImportPriceResponse : IResponseModel
    {
        public List<PriceStdMainsRS> priceStdMains = new List<PriceStdMainsRS>();

    }

    public class PriceStdMainsRS
    {
        public int id { get; set; }
        public string countryGroupCode { get; set; }
        public string type { get; set; }
        public string productTypeCode { get; set; }
        public string productGradeCode { get; set; }
        public string currencyCode { get; set; }
        public ResultArrModel _result = new ResultArrModel();

        public List<PriceStdEffectiveDateRS> priceStdEffectiveDate = new List<PriceStdEffectiveDateRS>();

    }
    public class PriceStdEffectiveDateRS
    {
        public int id { get; set; }
        public string effectiveDateFrom { get; set; }
        public string effectiveDateTo { get; set; }

        public PriceStdProdCodeRS priceStdProdCode = new PriceStdProdCodeRS();

        public PriceStdRangeRS priceStdRange = new PriceStdRangeRS();

        public ResultArrModel _result = new ResultArrModel();

    }

    public class PriceStdProdCodeRS
    {
        public List<PriceStdValuesProdCodeRS> priceStdValues = new List<PriceStdValuesProdCodeRS>();

    }

    public class PriceStdValuesProdCodeRS
    {
        public int id { get; set; }
        public string productCode { get; set; }
        public string unitTypeCode { get; set; }
        public decimal fob { get; set; }
        public decimal caf { get; set; }
        public decimal cif { get; set; }

        public ResultArrModel _result = new ResultArrModel();
    }


    public class PriceStdRangeRS
    {
        public List<PriceStdRangeHRS> priceStdRangeH = new List<PriceStdRangeHRS>();
    }

    public class PriceStdRangeHRS
    {
        public int id { get; set; }
        public string minTwineSizeCode { get; set; }
        public string maxTwineSizeCode { get; set; }
        public string unitTypeCode { get; set; }
        public string colorCode { get; set; }
        public string knotCode { get; set; }
        public string stretchingCode { get; set; }
        public string selvageWovenTypeCode { get; set; }

        public List<PriceStdValuesRangeRS> priceStdValues = new List<PriceStdValuesRangeRS>();

        public ResultArrModel _result = new ResultArrModel();

    }

    public class PriceStdValuesRangeRS
    {
        public int id { get; set; }
        public decimal? minEyeSizeCM { get; set; }
        public decimal? maxEyeSizeCM { get; set; }
        public decimal? minEyeAmountMD { get; set; }
        public decimal? maxEyeAmountMD { get; set; }
        public decimal? minLengthM { get; set; }
        public decimal? maxLengthM { get; set; }

        public string productTwineSeriesCode { get; set; }

        public decimal fob { get; set; }
        public decimal caf { get; set; }
        public decimal cif { get; set; }

    }

    //public class ProductTwineSeriesRS
    //{
    //    public decimal? amountUnit { get; set; }
    //    public string unitTypeCode { get; set; }
    //    public decimal? amountPackage { get; set; }
    //    public string packageTypeCode { get; set; }

    //}
}
