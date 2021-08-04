using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{

    public class PriceStdMains
    {
        public int id { get; set; }
        public string code { get; set; }
        public string type { get; set; }
        public string status { get; set; }
        public INTIdCodeModel priceStdEffectiveDate = new INTIdCodeModel();
        public INTIdCodeDescriptionModel countryGroup = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productType = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productGroup = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel productGrade = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel currency = new INTIdCodeDescriptionModel();
        public ByDateTimeModel lastUpdate = new ByDateTimeModel();
        public ResultModel _result = new ResultModel();

    }

    public class PriceStdSearchMainResponse : IResponseModel
    {
        public List<PriceStdMains> priceStdMains = new List<PriceStdMains>();
    }
}
