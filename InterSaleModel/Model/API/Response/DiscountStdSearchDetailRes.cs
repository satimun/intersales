using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class DiscountStdSearchDetailRes : IResponseModel
    {
        public List<DiscountDetail> discountDetails = new List<DiscountDetail>();
        public class DiscountDetail : DiscountStdValues
        {
            public int discountStdMainID { get; set; }
            public int discountStdProdID { get; set; }
            public INTIdCodeDescriptionModel product = new INTIdCodeDescriptionModel();

            public INTIdCodeDescriptionModel unitType = new INTIdCodeDescriptionModel();

            public TwineSize minTwineSize { get; set; }
            public TwineSize maxTwineSize { get; set; }
            public INTIdCodeDescriptionModel colorGroup = new INTIdCodeDescriptionModel();
            public INTIdCodeDescriptionModel knot = new INTIdCodeDescriptionModel();
            public INTIdCodeDescriptionModel stretching = new INTIdCodeDescriptionModel();
            public INTIdCodeDescriptionModel selvageWovenType = new INTIdCodeDescriptionModel();

            public class TwineSize
            {
                public string code { get; set; }
                public decimal size { get; set; }
                public decimal amount { get; set; }
                public string word { get; set; }
            }
        }
    }
}
