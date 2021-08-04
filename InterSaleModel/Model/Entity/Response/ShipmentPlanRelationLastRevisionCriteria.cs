using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanRelationLastRevisionCriteria
    {
        public int ShipmentPlanMainID { get; set; }
        public int CustomerID { get; set; }
        public string Code { get; set; }
        public string PlanType { get; set; }
        public int PlanMonth { get; set; }
        public int PlanYear { get; set; }
        public string LastRevisionFlag { get; set; }
        public int Revision { get; set; }
        public string ApproveBy { get; set; }
        public DateTime ApproveDate { get; set; }
        public int? ShipmentPlanHID { get; set; }
        public string ShipmentPlanH_ContainerCode { get; set; }
        public decimal ShipmentPlanH_ContainerSizeKg { get; set; }
        public DateTime PlanDate { get; set; }
        public int PlanWeek { get; set; }
        public int? ShipmentPlanDID { get; set; }
        public decimal PlanQuatity { get; set; }
        public decimal PlanWeightKG { get; set; }
        public decimal PlanBale { get; set; }
        public decimal PlanValue { get; set; }
        public decimal PlanVolume { get; set; }

        public int? ShipmentPlanOrderStandID { get; set; }
        public string Order_Code { get; set; }
        public string PI_Code { get; set; }
        public int ItemNo { get; set; }
        public string Product_Code { get; set; }
        public string Product_Description { get; set; }
        public string ProductGrade_Code { get; set; }
        public string ProductGrade_Description { get; set; }
        public string Port_Code { get; set; }
        public string Port_Description { get; set; }
        public string UnitType_Code { get; set; }
        public string UnitType_Description { get; set; }
        public string DeliveryType_Code { get; set; }
        public string DeliveryType_Description { get; set; }
        public string Transport_Code { get; set; }
        public string Transport_Description { get; set; }
        public string Container_Code { get; set; }
        public decimal Container_SizeKG { get; set; }
        public string BeforePaymentTerm_Code { get; set; }
        public string AfterPaymentTerm_Code { get; set; }
        public string Branch { get; set; }
        public string Brand { get; set; }
        public string Currency_Code { get; set; }
        public decimal PercentClose { get; set; }
        public decimal ToBeQuantity { get; set; }
        public decimal ToBeWeightKG { get; set; }
        public decimal ToBeBale { get; set; }
        public decimal ToBeValue { get; set; }
        public decimal ToBeVolume { get; set; }

        public decimal ProQuantity { get; set; }
        public decimal ProWeightKG { get; set; }
        public decimal ProBale { get; set; }
        public decimal ProValue { get; set; }
        public decimal ProVolume { get; set; }

        public decimal DelQuantity { get; set; }
        public decimal DelWeightKG { get; set; }
        public decimal DelBale { get; set; }
        public decimal DelValue { get; set; }
        public decimal DelVolume { get; set; }

        public decimal OutQuantity { get; set; }
        public decimal OutWeightKG { get; set; }
        public decimal OutBale { get; set; }
        public decimal OutValue { get; set; }
        public decimal OutVolume { get; set; }

        public decimal InvQuantity { get; set; }
        public decimal InvWeightKG { get; set; }
        public decimal InvBale { get; set; }
        public decimal InvValue { get; set; }
        public decimal InvVolume { get; set; }

        public decimal OthQuantity { get; set; }
        public decimal OthWeightKG { get; set; }
        public decimal OthBale { get; set; }
        public decimal OthValue { get; set; }
        public decimal OthVolume { get; set; }

        public decimal CompInventory { get; set; }
        public decimal CompNotYetDelivered { get; set; }
        public decimal CompNotYetFinished { get; set; }
        public DateTime? AdmitDate { get; set; }
        public DateTime? MaxAdmitDate { get; set; }
        public decimal CPB { get; set; }
        public decimal QPW { get; set; }
        public decimal QPB { get; set; }
        public decimal QPV { get; set; }
        public decimal BPL { get; set; }

        public string ShipmentPlanMainStatus { get; set; }
        public string ShipmentPlanOrderStandStatus { get; set; }
        public string ShipmentPlanHStatus { get; set; }
        public string ShipmentPlanDStatus { get; set; }
        public string FavoriteFlag { get; set; }
        public string CloseByCI { get; set; }
        public bool UrgentFlag;

        public string TwineSizeLB;
        public string MeshSizeLB;
        public string MeshDepthLB;
        public string LengthLB;
        public string Label_Code;

        public int CustomerIDD { get; set; }
        //public string LastRevisionFlag { get; set; }

        public string SalesApprove { get; set; }
        public int? SalesApproveBy { get; set; }
        public DateTime? SalesApproveDate { get; set; }
        public string RegionalApprove { get; set; }
        public int? RegionalApproveBy { get; set; }
        public DateTime? RegionalApproveDate { get; set; }
        public string ManagerApprove { get; set; }
        public int? ManagerApproveBy { get; set; }
        public DateTime? ManagerApproveDate { get; set; }

        public int? Remark_ID { get; set; }
        public string Remark_Code { get; set; }
        public string Remark_Description { get; set; }

        public string ShipmentPlanHRefID { get; set; }

        public string PaymentTerm { get; set; }
        public List<CurrencyModel> PayAmount { get; set; }
        public int PortLoading_ID { get; set; }

        public string PackList_Code { get; set; }

        public decimal? VolumeAdj { get; set; }
        public decimal? WeightAdj { get; set; }
        public string CalculateType { get; set; }
    }
}
