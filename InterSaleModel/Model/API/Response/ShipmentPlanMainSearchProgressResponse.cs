using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanMainSearchProgressResponse : IResponseModel
    {
        public List<Customer> customers { get; set; }
        public class Customer : INTIdCodeDescriptionModel
        {
            public INTIdCodeDescriptionModel customerGroup { get; set; }
            public INTIdCodeDescriptionModel country { get; set; }
            public INTIdCodeDescriptionModel zoneAccount { get; set; }
            public INTIdCodeDescriptionModel saleEmployee { get; set; }

            public Balance outstanding = new Balance();
            public Balance inventory = new Balance();
            public class Balance
            {
                public decimal quantity { get; set; }
                public decimal weight { get; set; }
                public decimal bale { get; set; }
                public decimal volume { get; set; }
                public List<CurrencyModel> values = new List<CurrencyModel>();
            }

            public ShipmentPlanMain shipmentPlanMain { get; set; }
            public class ShipmentPlanMain
            {
                public int monthlyID { get; set; }
                public int weeklyID { get; set; }
                public int id { get; set; }
                public string code { get; set; }
                public string planType { get; set; }
                public int planMonth { get; set; }
                public int planYear { get; set; }
                public string waitApprove { get; set; }
                //public int revision { get; set; }
                //public string monthlyStatus { get; set; }
                //public string weeklyStatus { get; set; }
                //public string monthlyStatusDescription { get; set; }
                //public string weeklyStatusDescription { get; set; }

                public string status { get; set; }
                public List<string> ports { get; set; }
                //public ByDateTimeModel approve { get; set; }

                public int monthlyAmount { get; set; }
                public int monthlyApprove { get; set; }
                public int weeklyAmount { get; set; }

                public ByDateTimeModel create { get; set; }
                public ByDateTimeModel modify { get; set; }

                public ShipmentProgress progress { get; set; }
                public class ShipmentProgress
                {
                    public decimal stockQty { get; set; }
                    public decimal planQty { get; set; }
                    public decimal stockVSPlan { get; set; }
                    public List<string> alertMessage { get; set; }
                }
            }


        }
        
    }
}
