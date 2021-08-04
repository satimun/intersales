using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanGetPackListRes : IResponseModel
    {
        public List<shipmentH> shipmentHs { get; set; }
        public class shipmentH
        {
            public string pkno { get; set; }
            public string shipmentDate { get; set; }
            public string containerCode { get; set; }
            public int shipmentWeek { get; set; }
            public List<shipmentD> shipmentDs { get; set; }
            public class shipmentD
            {
                public string orderCode { get; set; }
                public string productCode { get; set; }
                //public string customerCode { get; set; }
                public INTIdCodeDescriptionModel customer { get; set; }
                public BalanceModel packList { get; set; }
                //public decimal quatity { get; set; }
                //public decimal bale { get; set; }
                //public decimal weight { get; set; }
                public string saleUnit { get; set; }
            }
        }
    }
}
