using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanClientAutoPlanResponse : IResponseModel
    {
        public List<ShipmentPlanH> shipmentPlanHs { get; set; }
        public class ShipmentPlanH
        {
            public int? id { get; set; }
            public string planDate { get; set; }
            public int planWeek { get; set; }
            public string containerCode { get; set; }
            public List<ShipmentPlanD> shipmentPlanDs { get; set; }
            public string status { get; set; }
            public string refID { get; set; }

            public INTIdCodeDescriptionModel remark = new INTIdCodeDescriptionModel();

            public decimal? volumeAdj { get; set; }
            public decimal? weightAdj { get; set; }
            public string calculateType { get; set; }

            public INTIdCodeDescriptionModel portLoading = new INTIdCodeDescriptionModel();

            public class ShipmentPlanD
            {
                public int? id { get; set; }
                public int shipmentPlanMainID { get; set; }
                public int shipmentPlanOrderStandID { get; set; }
                //public int customerID { get; set; }
                public INTIdCodeDescriptionModel customer { get; set; }
                public BalanceModel planBalance { get; set; }
                public string status { get; set; }
            }
        }
    }
}
