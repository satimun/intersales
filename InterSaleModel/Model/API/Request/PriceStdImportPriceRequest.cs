using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PriceStdImportPriceRequest : IRequestModel
    {
        public List<PriceStdMainsRQ> priceStdMains = new List<PriceStdMainsRQ>();
    }

    public class PriceStdMainsRQ
    {
        public string countryGroupCode { get; set; }
        public string type { get; set; }
        public string productTypeCode { get; set; }
        public string productGradeCode { get; set; }
        public string currencyCode { get; set; }
        public string saleCode { get; set; }

        public List<PriceStdEffectiveDateRQ> priceStdEffectiveDate = new List<PriceStdEffectiveDateRQ>();

    }
    public class PriceStdEffectiveDateRQ
    {
        public string effectiveDateFrom { get; set; }
        public string effectiveDateTo { get; set; }
        public PriceStdProdCodeRQ priceStdProdCode = new PriceStdProdCodeRQ();
        public PriceStdRangeRQ priceStdRange = new PriceStdRangeRQ();
    }

    public class PriceStdProdCodeRQ
    {
        public List<PriceStdValuesProdCodeRQ> priceStdValues = new List<PriceStdValuesProdCodeRQ>();

    }
    public class PriceStdValuesProdCodeRQ
    {
        public string productCode { get; set; }
        public string unitTypeCode { get; set; }
        public decimal? fob { get; set; }
        public decimal? caf { get; set; }
        public decimal? cif { get; set; }
    }
    
    public class PriceStdRangeHRQ
    {
        public string minTwineSizeCode { get; set; }
        public string maxTwineSizeCode { get; set; }
        public string unitTypeCode { get; set; }
        public string colorCode { get; set; }
        public string knotCode { get; set; }
        public string stretchingCode { get; set; }
        public string selvageWovenTypeCode { get; set; }
        public List<PriceStdValuesRangeRQ> priceStdValues = new List<PriceStdValuesRangeRQ>();
    }
    
    public class PriceStdValuesRangeRQ
    {
        public decimal? minEyeSizeCM { get; set; }
        public decimal? maxEyeSizeCM { get; set; }
        public decimal? minEyeAmountMD { get; set; }
        public decimal? maxEyeAmountMD { get; set; }
        public decimal? minLengthM { get; set; }
        public decimal? maxLengthM { get; set; }

        public string productTwineSeriesCode { get; set; }

        public decimal? fob { get; set; }
        public decimal? caf { get; set; }
        public decimal? cif { get; set; }
    }
    public class PriceStdRangeRQ
    {
        public List<PriceStdRangeHRQ> priceStdRangeH = new List<PriceStdRangeHRQ>(); 
    }  

}
