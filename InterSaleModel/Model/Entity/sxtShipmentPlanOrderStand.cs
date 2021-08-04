using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxtShipmentPlanOrderStand
    {
        public int ID;
        public int ShipmentPlanMain_ID;
        public string Order_Code;
        public string PI_Code;

        public int ItemNo;
        public string Product_Code;
        public string Product_Description;
        public string ProductGrade_Code;
        public string ProductGrade_Description;

        public string Port_Code;
        public string Port_Description;
        public string UnitType_Code;
        public string UnitType_Description;
        public string DeliveryType_Code;
        public string DeliveryType_Description;
        public string Transport_Code;
        public string Transport_Description;
        public string Container_Code;
        public decimal Container_SizeKG;
        public string Currency_Code;
        public string BeforePaymentTerm_Code;
        public string AfterPaymentTerm_Code;
        public string Branch;
        public string Brand;
        public decimal PercentClose;

        public decimal ToBeQuantity;
        public decimal ToBeWeightKG;
        public decimal ToBeBale;
        public decimal ToBeValue;
        public decimal ProQuantity;
        public decimal ProWeightKG;
        public decimal ProBale;
        public decimal ProValue;
        public decimal DelQuantity;
        public decimal DelWeightKG;
        public decimal DelBale;
        public decimal DelValue;
        public decimal OutQuantity;
        public decimal OutWeightKG;
        public decimal OutBale;
        public decimal OutValue;
        public decimal InvQuantity;
        public decimal InvWeightKG;
        public decimal InvBale;
        public decimal InvValue;
        public decimal OthQuantity;
        public decimal OthWeightKG;
        public decimal OthBale;
        public decimal OthValue;
        public decimal CompInventory;
        public decimal CompNotYetDelivered;
        public decimal CompNotYetFinished;
        public DateTime? AdmitDate;
        public DateTime? MaxAdmitDate;
        public decimal CPB;
        public decimal QPW;
        public decimal QPB;
        public decimal QPV;

        public string Status;
        public int CreateBy;
        public DateTime CreateDate;
        public int ModifyBy;
        public DateTime ModifyDate;

        public decimal BPL;
        public decimal ToBeVolume;
        public decimal ProVolume;
        public decimal DelVolume;
        public decimal OutVolume;
        public decimal InvVolume;
        public decimal OthVolume;
        public string FavoriteFlag;
        public string CloseByCI;

        public string PaymentTerm;

        public bool UrgentFlag;

        public int customerID;
        public string planType;
        public int planMonth;
        public int planYear;

        public string TwineSizeLB;
        public string MeshSizeLB;
        public string MeshDepthLB;
        public string LengthLB;
        public string Label_Code;

    }
}
