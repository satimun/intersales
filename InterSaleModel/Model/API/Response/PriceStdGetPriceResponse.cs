using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdGetPriceResponse : IResponseModel
    {
        public List<PriceStds> priceStds = new List<PriceStds>();
    }

    public class PriceStds
    {
        public string productCode { get; set; }
        public string productDescription { get; set; }
        public string productGradeCode { get; set; }
        public string customerCode { get; set; }

        public List<PriceValues> priceValues = new List<PriceValues>();

        public ResultModel _result = new ResultModel();
    }
    
    public class PriceValues
    {
        public int priceStdValueID { get; set; }
        public string priceStdTableType { get; set; }
        public string priceStdTableCode { get; set; }

        public decimal priceFOB { get; set; }
        public decimal priceCAF { get; set; }
        public decimal priceCIF { get; set; }

        public string effectiveStatus { get; set; }
        public string priceStatus { get; set; }
    }
}
