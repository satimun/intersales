using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class DiscountStdSearchDiscountRangeHResponse : IResponseModel
    {
        public List<DiscountStdRangeHs> discountStdRangeHs = new List<DiscountStdRangeHs>();
    }

    public class DiscountStdRangeHs
    {
        public int id { get; set; }
        public int discountStdMainID { get; set; }
        public int? DiscountStdEffectiveDate_ID { get; set; }
        public TwineSize minTwineSize { get; set; }
        public TwineSize maxTwineSize { get; set; }
        public INTIdCodeDescriptionModel unitType = new INTIdCodeDescriptionModel();
        public ColorGroups colorGroups = new ColorGroups();
        public INTIdCodeDescriptionModel knot = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel stretching = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel selvageWovenType = new INTIdCodeDescriptionModel();
        public string status { get; set; }
        public ByDateTimeModel lastUpdate = new ByDateTimeModel();
        public ResultModel _result = new ResultModel();

        public class TwineSize
        {
            public string code { get; set; }
            public decimal size { get; set; }
            public decimal amount { get; set; }
            public string word { get; set; }
        }
    }

}
