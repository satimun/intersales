using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanGetRemarkRes : IResponseModel
    {
        public List<PlanRemark> planRemarks = new List<PlanRemark>();
        public class PlanRemark
        {
            //public int? planHID { get; set; }
            public int planWeek { get; set; } // actual
            public DateTime? planDate { get; set; }
            public List<INTIdCodeDescriptionModel> customers { get; set; }
            public List<string> ciCode { get; set; }      

            public DataPA plan { get; set; }
            public DataPA actual { get; set; }
            public class DataPA
            {
                public string id { get; set; }
                public string date { get; set; }
                public string containerCode { get; set; }
            }
            public INTIdCodeDescriptionModel remark { get; set; }

            public List<string> paymentTerms { get; set; }
            public List<CurrencyModel> payAmounts { get; set; }

            public decimal planAmount { get; set; }
            public decimal stockAmount { get; set; }
            public decimal productComplete { get; set; }
            public string status { get; set; }
            public ResultModel _result = new ResultModel();
        } 
    }
}
