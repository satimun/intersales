using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class ShipmentPlanOrderStandADO : BaseADO
    {
        private static ShipmentPlanOrderStandADO instant;
        public static ShipmentPlanOrderStandADO GetInstant()
        {
            if (instant == null)
                instant = new ShipmentPlanOrderStandADO();
            return instant;
        }
        private ShipmentPlanOrderStandADO() { }

        public List<ShipmentPlanOrderStandOrderQtyCriteria> PlanQty(int shipmentPlanMainID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@sphipmentPlanMainID", shipmentPlanMainID);

            var res = this.Query<ShipmentPlanOrderStandOrderQtyCriteria>(
                "exec [dbo].[SP_ShipmentPlanOrderStand_PlanQty] @sphipmentPlanMainID",
                param,
                logger)
                .ToList();
            return res;
        }

        public List<ShipmentPlanOutstandingGet> Get(int planMonth, int planYear, string planType, List<int> customerIDs, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planMonth", planMonth);
            param.Add("@planYear", planYear);
            param.Add("@planType", planType);
            param.Add("@customerIDs", string.Join(',', customerIDs));

            var res = this.QuerySP<ShipmentPlanOutstandingGet>("SP_ShipmentPlanOrderStand_Get", param, logger).ToList();
            return res;
        }
        
        public List<sxtShipmentPlanOrderStand> Save(sxtShipmentPlanOrderStand shipmentPlanOrder, int actionBy, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", shipmentPlanOrder.ID);
            param.Add("@ShipmentPlanMain_ID", shipmentPlanOrder.ShipmentPlanMain_ID);
            param.Add("@Order_Code", shipmentPlanOrder.Order_Code);
            param.Add("@PI_Code", shipmentPlanOrder.PI_Code);
            param.Add("@ItemNo", shipmentPlanOrder.ItemNo);
            param.Add("@Product_Code", shipmentPlanOrder.Product_Code);
            param.Add("@Product_Description", shipmentPlanOrder.Product_Description);
            param.Add("@ProductGrade_Code", shipmentPlanOrder.ProductGrade_Code);
            param.Add("@ProductGrade_Description", shipmentPlanOrder.ProductGrade_Description);
            param.Add("@Port_Code", shipmentPlanOrder.Port_Code);
            param.Add("@Port_Description", shipmentPlanOrder.Port_Description);
            param.Add("@UnitType_Code", shipmentPlanOrder.UnitType_Code);
            param.Add("@UnitType_Description", shipmentPlanOrder.UnitType_Description);
            param.Add("@DeliveryType_Code", shipmentPlanOrder.DeliveryType_Code);
            param.Add("@DeliveryType_Description", shipmentPlanOrder.DeliveryType_Description);
            param.Add("@Transport_Code", shipmentPlanOrder.Transport_Code);
            param.Add("@Transport_Description", shipmentPlanOrder.Transport_Description);
            param.Add("@Container_Code", shipmentPlanOrder.Container_Code);
            param.Add("@Container_SizeKG", shipmentPlanOrder.Container_SizeKG);
            param.Add("@Currency_Code", shipmentPlanOrder.Currency_Code);
            param.Add("@BeforePaymentTerm_Code", shipmentPlanOrder.BeforePaymentTerm_Code);
            param.Add("@AfterPaymentTerm_Code", shipmentPlanOrder.AfterPaymentTerm_Code);
            param.Add("@Branch", shipmentPlanOrder.Branch);
            param.Add("@Brand", shipmentPlanOrder.Brand);
            param.Add("@PercentClose", shipmentPlanOrder.PercentClose);
            param.Add("@ToBeQuantity", shipmentPlanOrder.ToBeQuantity);
            param.Add("@ToBeWeightKG", shipmentPlanOrder.ToBeWeightKG);
            param.Add("@ToBeBale", shipmentPlanOrder.ToBeBale);
            param.Add("@ToBeValue", shipmentPlanOrder.ToBeValue);
            param.Add("@ProQuantity", shipmentPlanOrder.ProQuantity);
            param.Add("@ProWeightKG", shipmentPlanOrder.ProWeightKG);
            param.Add("@ProBale", shipmentPlanOrder.ProBale);
            param.Add("@ProValue", shipmentPlanOrder.ProValue);
            param.Add("@DelQuantity", shipmentPlanOrder.DelQuantity);
            param.Add("@DelWeightKG", shipmentPlanOrder.DelWeightKG);
            param.Add("@DelBale", shipmentPlanOrder.DelBale);
            param.Add("@DelValue", shipmentPlanOrder.DelValue);
            param.Add("@OutQuantity", shipmentPlanOrder.OutQuantity);
            param.Add("@OutWeightKG", shipmentPlanOrder.OutWeightKG);
            param.Add("@OutBale", shipmentPlanOrder.OutBale);
            param.Add("@OutValue", shipmentPlanOrder.OutValue);
            param.Add("@InvQuantity", shipmentPlanOrder.InvQuantity);
            param.Add("@InvWeightKG", shipmentPlanOrder.InvWeightKG);
            param.Add("@InvBale", shipmentPlanOrder.InvBale);
            param.Add("@InvValue", shipmentPlanOrder.InvValue);
            param.Add("@OthQuantity", shipmentPlanOrder.OthQuantity);
            param.Add("@OthWeightKG", shipmentPlanOrder.OthWeightKG);
            param.Add("@OthBale", shipmentPlanOrder.OthBale);
            param.Add("@OthValue", shipmentPlanOrder.OthValue);
            param.Add("@CompInventory", shipmentPlanOrder.CompInventory);
            param.Add("@CompNotYetDelivered", shipmentPlanOrder.CompNotYetDelivered);
            param.Add("@CompNotYetFinished", shipmentPlanOrder.CompNotYetFinished);
            param.Add("@AdmitDate", shipmentPlanOrder.AdmitDate.HasValue ? shipmentPlanOrder.AdmitDate.Value.Ticks > new DateTime(2000,1,1).Ticks ? shipmentPlanOrder.AdmitDate : null : null);
            param.Add("@MaxAdmitDate", shipmentPlanOrder.MaxAdmitDate.HasValue ? shipmentPlanOrder.MaxAdmitDate.Value.Ticks > new DateTime(2000, 1, 1).Ticks ? shipmentPlanOrder.MaxAdmitDate : null : null);
            param.Add("@CPB", shipmentPlanOrder.CPB);
            param.Add("@QPW", shipmentPlanOrder.QPW);
            param.Add("@QPB", shipmentPlanOrder.QPB);
            param.Add("@QPV", shipmentPlanOrder.QPV);
            param.Add("@Status", shipmentPlanOrder.Status);
            param.Add("@ActionBy", actionBy);
            param.Add("@BPL", shipmentPlanOrder.BPL);
            param.Add("@ToBeVolume", shipmentPlanOrder.ToBeVolume);
            param.Add("@ProVolume", shipmentPlanOrder.ProVolume);
            param.Add("@DelVolume", shipmentPlanOrder.DelVolume);
            param.Add("@OutVolume", shipmentPlanOrder.OutVolume);
            param.Add("@InvVolume", shipmentPlanOrder.InvVolume);
            param.Add("@OthVolume", shipmentPlanOrder.OthVolume);
            param.Add("@FavoriteFlag", shipmentPlanOrder.FavoriteFlag);
            param.Add("@CloseByCI", shipmentPlanOrder.CloseByCI);
            param.Add("@customerID", shipmentPlanOrder.customerID);
            param.Add("@planType", shipmentPlanOrder.planType);
            param.Add("@planMonth", shipmentPlanOrder.planMonth);
            param.Add("@planYear", shipmentPlanOrder.planYear);
            param.Add("@PaymentTerm", shipmentPlanOrder.PaymentTerm);
            param.Add("@UrgentFlag", shipmentPlanOrder.UrgentFlag);

            param.Add("@TwineSizeLB", shipmentPlanOrder.TwineSizeLB);
            param.Add("@MeshSizeLB", shipmentPlanOrder.MeshSizeLB);
            param.Add("@MeshDepthLB", shipmentPlanOrder.MeshDepthLB);
            param.Add("@LengthLB", shipmentPlanOrder.LengthLB);
            param.Add("@Label_Code", shipmentPlanOrder.Label_Code);
            
            var res = this.QuerySP<sxtShipmentPlanOrderStand>(
                transac,
                "SP_ShipmentPlanOrderStand_Save",
                param,
                logger)
                .ToList();


            return res;

        }
    }
}
