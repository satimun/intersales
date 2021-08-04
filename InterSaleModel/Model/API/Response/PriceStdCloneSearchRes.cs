using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdCloneSearchRes : IResponseModel
    {
        public List<PriceCloneSearh> priceStds = new List<PriceCloneSearh>();
        public class PriceCloneSearh : PriceStdMains
        {
            public string effectiveDateFrom { get; set; }
            public string effectiveDateTo { get; set; }
            public int countApproved { get; set; }
        }
    }
}
