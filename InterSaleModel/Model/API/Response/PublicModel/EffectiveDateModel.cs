using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request.PublicModel
{
    public class EffectiveDateModel
    {
        public int id { get; set; }
        //public int priceStdMainID { get; set; }
        public INTIdCodeModel priceStdMain { get; set; }
        public INTIdCodeModel discountStdMain { get; set; }
        public string code { get; set; }
        public string effectiveDateFrom { get; set; }
        public string effectiveDateTo { get; set; }
        public string effectiveOldDateFrom { get; set; }
        public string effectiveOldDateTo { get; set; }
        public int countApprove { get; set; }
        public int countTotal { get; set; }
        public string status { get; set; }
        public ByDateTimeModel lastUpdate = new ByDateTimeModel();
        public ResultModel _result = new ResultModel();
    }
}
