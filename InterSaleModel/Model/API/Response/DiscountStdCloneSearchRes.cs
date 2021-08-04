using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class DiscountStdCloneSearchRes : IResponseModel
    {
        public List<DiscountCloneSearh> discountStds = new List<DiscountCloneSearh>();
        public class DiscountCloneSearh : DiscountStdMains
        {
            public string effectiveDateFrom { get; set; }
            public string effectiveDateTo { get; set; }
            public int countApproved { get; set; }
        }
    }
}
