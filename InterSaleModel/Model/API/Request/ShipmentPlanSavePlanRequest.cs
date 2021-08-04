using InterSaleModel.Model.API.Response.PublicModel;
using System.Collections.Generic;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanSavePlanRequest : IRequestModel
    {
        public ShipmentPlanMain shipmentPlanMain { get; set; }
        public class ShipmentPlanMain
        {
            public int id { get; set; }
            public string code { get; set; }
            public INTIdCodeDescriptionModel customer { get; set; }
            public string planType { get; set; }
            public int planMonth { get; set; }
            public int planYear { get; set; }

            public List<ShipmentPlanOrderStand> shipmentPlanOrderStands { get; set; }
            public class ShipmentPlanOrderStand
            {
                public int id { get; set; }
                public int mainID { get; set; }
                public string orderCode { get; set; }
                public string piCode { get; set; }
                public int itemno { get; set; }
                public string orderCloseFlag { get; set; }
                public string marketCloseFlag { get; set; }
                public string status { get; set; }
                public string afterPaymentTermCode { get; set; }
                public string beforePaymentTermCode { get; set; }
                public string favoriteFlag { get; set; }
                public string closeByCI { get; set; }

                public Customer customer { get; set; }
                public class Customer
                {
                    public int id { get; set; }
                    public string code { get; set; }
                    public string description { get; set; }
                    public string portCode { get; set; }
                    public string portDescriotion { get; set; }
                }
                public Product product { get; set; }
                public class Product
                {
                    public string code { get; set; }
                    public string description { get; set; }
                    public string gradeCode { get; set; }
                    public string gradeDescription { get; set; }
                    public string brand { get; set; }
                }

                public string deliveryType { get; set; }
                public string deliveryDescription { get; set; }

                public string admitDate { get; set; }
                public string maxAdmitDate { get; set; }
                public string saleUnitCode { get; set; }
                public string branch { get; set; }
                public decimal percentClose { get; set; }
                public string contianerCode { get; set; }
                public decimal contianerSizeKG { get; set; }

                public Currency currency { get; set; }
                public class Currency
                {
                    public string code { get; set; }
                    public decimal cpb { get; set; }
                }

                public ValuePerUnit valuePerUnit { get; set; }
                public class ValuePerUnit
                {
                    public decimal qpw { get; set; }
                    public decimal qpb { get; set; }
                    public decimal qpv { get; set; }
                    public decimal cpb { get; set; }
                    public decimal bpl { get; set; }
                }
                public BalanceModel toBeShipped { get; set; }
                public BalanceModel proformaBalance { get; set; }
                public BalanceModel delivered { get; set; }
                public BalanceModel outstandingBalance { get; set; }
                public BalanceModel inventory { get; set; }
                public BalanceModel otherPick { get; set; }

                public ComparisonPercent comparisonPercent { get; set; }
                public class ComparisonPercent
                {
                    public decimal inventory { get; set; }
                    public decimal notYetDelivered { get; set; }
                    public decimal notYetFinished { get; set; }
                }

                public string paymentTerm { get; set; }
                //public decimal payAmount { get; set; }
                public bool urgentFlag { get; set; }

                public string TwineSizeLB;
                public string MeshSizeLB;
                public string MeshDepthLB;
                public string LengthLB;
                public string Label_Code;

            }


            public List<ShipmentPlanH> shipmentPlanHs { get; set; }
            public class ShipmentPlanH
            {
                public int? id { get; set; }
                public string planDate { get; set; }
                public int planWeek { get; set; }
                public string containerCode { get; set; }
                public INTIdCodeDescriptionModel remark { get; set; }
                public string refID { get; set; }
               // public decimal containerSizeKg { get; set; }
                public List<ShipmentPlanD> shipmentPlanDs { get; set; }
                public string status { get; set; }

                public List<int> customerIDs { get; set; }

                public INTIdCodeDescriptionModel portLoading { get; set; }

                public decimal? volumeAdj { get; set; }
                public decimal? weightAdj { get; set; }
                public string calculateType { get; set; }

                public decimal containerSizeVolume { get; set; }
                public decimal containerSizeWeight { get; set; }

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
}
