using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class DiscountStdImportDiscountRequest : IRequestModel
    {
        public List<DiscountStdMainsRQ> discountStdMains = new List<DiscountStdMainsRQ>();

    }

    public class DiscountStdMainsRQ
    {
        public string customerCode { get; set; }
        public string type { get; set; }
        public string productTypeCode { get; set; }
        public string productGradeCode { get; set; }
        public string currencyCode { get; set; }
        public string saleCode { get; set; }

        public List<DiscountStdEffectiveDateRQ> discountStdEffectiveDate = new List<DiscountStdEffectiveDateRQ>();

    }
    public class DiscountStdEffectiveDateRQ
    {
        public string effectiveDateFrom { get; set; }
        public string effectiveDateTo { get; set; }
        public DiscountStdProdCodeRQ discountStdProdCode = new DiscountStdProdCodeRQ();
        public DiscountStdRangeRQ discountStdRange = new DiscountStdRangeRQ();
    }

    public class DiscountStdProdCodeRQ
    {
        public List<DiscountStdValuesProdCodeRQ> discountStdValues = new List<DiscountStdValuesProdCodeRQ>();

    }
    public class DiscountStdValuesProdCodeRQ
    {
        public string productCode { get; set; }
        public string unitTypeCode { get; set; }
        public decimal? discountPercent { get; set; }
        public decimal? discountAmount { get; set; }
        public decimal? increaseAmount { get; set; }
    }

    public class DiscountStdRangeHRQ
    {
        public string minTwineSizeCode { get; set; }
        public string maxTwineSizeCode { get; set; }
        public string unitTypeCode { get; set; }
        public string colorCode { get; set; }
        public string knotCode { get; set; }
        public string stretchingCode { get; set; }
        public string selvageWovenTypeCode { get; set; }
        public List<DiscountStdValuesRangeRQ> discountStdValues = new List<DiscountStdValuesRangeRQ>();
    }
    
    public class DiscountStdValuesRangeRQ
    {
        public decimal? minEyeSizeCM { get; set; }
        public decimal? maxEyeSizeCM { get; set; }
        public decimal? minEyeAmountMD { get; set; }
        public decimal? maxEyeAmountMD { get; set; }
        public decimal? minLengthM { get; set; }
        public decimal? maxLengthM { get; set; }

        public string productTwineSeriesCode { get; set; }

        public decimal? discountPercent { get; set; }
        public decimal? discountAmount { get; set; }
        public decimal? increaseAmount { get; set; }
    }
    public class DiscountStdRangeRQ
    {
        public List<DiscountStdRangeHRQ> discountStdRangeH = new List<DiscountStdRangeHRQ>();
    }
}
