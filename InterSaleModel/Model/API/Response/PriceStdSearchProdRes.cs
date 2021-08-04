using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdSearchProdRes : IResponseModel
    {
        public List<PriceStdProd> prods = new List<PriceStdProd>();
        public class PriceStdProd
        {
            public int id { get; set; }
            public int priceStdMainID { get; set; }
            public INTIdCodeDescriptionModel product { get; set; }
            public INTIdCodeDescriptionModel unitType { get; set; }
            
            public ByDateTimeModel lastUpdate = new ByDateTimeModel();
            public ResultModel _result = new ResultModel();
        }
    }
}
