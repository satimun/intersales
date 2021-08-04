using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFException;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanMainSavePlanAPI : BaseAPIEngine<ShipmentPlanSavePlanRequest, ShipmentPlanSavePlanResponse>
    {
        protected override string PermissionKey
        {
            get { return "SALES_API"; }
        }

        protected override void ExecuteChild(ShipmentPlanSavePlanRequest dataRequest, ShipmentPlanSavePlanResponse dataResponse)
        {
            SqlTransaction transac = null;
            try
            {
                transac = BaseADO.BeginTransaction();
                this.Logger.LogInfo("######Begin Transaction######");
                //ADO.ShipmentPlanOrderStandADO.GetInstant().UpdateStatusByShipmentPlanMainID(dataRequest.shipmentPlanMain.id, "C", this.employeeID, this.Logger, transac);
                //ADO.ShipmentPlanDADO.GetInstant().UpdateStatusByShipmentPlanMainID(dataRequest.shipmentPlanMain.id, "C", this.employeeID, this.Logger, transac);
                /**************/
                foreach (var orderStand in dataRequest.shipmentPlanMain.shipmentPlanOrderStands)
                {
                    var saveOrderStandModel = this.ConvertToShipmentPlanOrderStand(dataRequest, orderStand);
                    ADO.ShipmentPlanOrderStandADO.GetInstant().Save(saveOrderStandModel, this.employeeID, this.Logger, transac);
                }

                // gen customer group
                var customerIDs = dataRequest.shipmentPlanMain.shipmentPlanOrderStands.GroupBy(x => x.customer.id).Select(x => x.Key).ToList();

                ADO.ShipmentPlanMainADO.GetInstant().UpdateCustomerGroup(dataRequest.shipmentPlanMain.id, customerIDs, this.Logger, transac);

                /**************/
                foreach (var planH in dataRequest.shipmentPlanMain.shipmentPlanHs)
                {
                    sxtShipmentPlanH planHModel = new sxtShipmentPlanH()
                    {
                        ID = planH.id,
                        Container_Code = planH.containerCode,
                        RefID = planH.refID,
                        Remark_ID = planH.remark != null ? planH.remark.id : null,
                        PlanDate = DateTimeUtil.GetDate(planH.planDate).Value,
                        PlanWeek = planH.planWeek,
                        Status = planH.status
                        , CalculateType = planH.calculateType
                        , VolumeAdj = planH.volumeAdj
                        , WeightAdj = planH.weightAdj
                    };
                    var planHRes = ADO.ShipmentPlanHADO.GetInstant().Save(planHModel, this.employeeID, this.Logger, transac);
                    planH.id = planHRes.ID;
                    foreach(var planD in planH.shipmentPlanDs)
                    {
                        sxtShipmentPlanD planDModel = new sxtShipmentPlanD()
                        {
                            ID = planD.id,
                            PlanBale = planD.planBalance.bale,
                            PlanQuatity = planD.planBalance.quantity,
                            PlanValue = planD.planBalance.value,
                            PlanWeightKG = planD.planBalance.weight,
                            ShipmentPlanH_ID = planH.id.Value,
                            //ShipmentPlanMain_ID = planD.shipmentPlanMainID,
                            ShipmentPlanOrderStand_ID = planD.shipmentPlanOrderStandID,
                            Status = planD.status,
                            PlanVolume = planD.planBalance.volume
                            , Customer_ID = planD.customer.id??0
                            , planType = dataRequest.shipmentPlanMain.planType
                            , planMonth = dataRequest.shipmentPlanMain.planMonth
                            , planYear = dataRequest.shipmentPlanMain.planYear
                        };
                        var planDRes = ADO.ShipmentPlanDADO.GetInstant().Save(planDModel, this.employeeID, this.Logger, transac);

                    }
                }
                transac.Commit();
                this.Logger.LogInfo("######Commit Transaction######");
            }
            catch (Exception ex)
            {
                if (transac != null)
                {
                    transac.Rollback();
                    this.Logger.LogInfo("######Rollback Transaction######");
                }
                throw ex;
            }
            finally
            {
                if (transac != null && transac.Connection != null && transac.Connection.State == System.Data.ConnectionState.Open)
                    transac.Connection.Close();
            }
        }

        private sxtShipmentPlanOrderStand ConvertToShipmentPlanOrderStand(ShipmentPlanSavePlanRequest dataRequest, ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand orderStand)
        {
            var res = new sxtShipmentPlanOrderStand()
            {
                ID = orderStand.id,
                MaxAdmitDate = DateTimeUtil.GetDate(orderStand.maxAdmitDate),
                AdmitDate = DateTimeUtil.GetDate(orderStand.admitDate),
                AfterPaymentTerm_Code = orderStand.afterPaymentTermCode,
                BeforePaymentTerm_Code = orderStand.beforePaymentTermCode,
                Branch = orderStand.branch,
                Brand = orderStand.product.brand,
                CompInventory = orderStand.comparisonPercent.inventory,
                CompNotYetDelivered = orderStand.comparisonPercent.notYetDelivered,
                CompNotYetFinished = orderStand.comparisonPercent.notYetFinished,
                Container_Code = orderStand.contianerCode,
                Container_SizeKG = orderStand.contianerSizeKG,
                CPB = orderStand.valuePerUnit.cpb,
                QPB = orderStand.valuePerUnit.qpb,
                QPV = orderStand.valuePerUnit.qpv,
                QPW = orderStand.valuePerUnit.qpw,
                Currency_Code = orderStand.currency.code,
                DelBale = orderStand.delivered.bale,
                DelQuantity = orderStand.delivered.quantity,
                DelValue = orderStand.delivered.value,
                DelWeightKG = orderStand.delivered.weight,
                DeliveryType_Code = orderStand.deliveryType,
                DeliveryType_Description = orderStand.deliveryDescription,
                InvBale = orderStand.inventory.bale,
                InvQuantity = orderStand.inventory.quantity,
                InvValue = orderStand.inventory.value,
                InvWeightKG = orderStand.inventory.weight,
                ItemNo = orderStand.itemno,
                Order_Code = orderStand.orderCode,
                OthBale = orderStand.otherPick.bale,
                OthWeightKG = orderStand.otherPick.weight,
                OthValue = orderStand.otherPick.value,
                OthQuantity = orderStand.otherPick.quantity,
                OutBale = orderStand.outstandingBalance.bale,
                OutValue = orderStand.outstandingBalance.value,
                OutWeightKG = orderStand.outstandingBalance.weight,
                OutQuantity = orderStand.outstandingBalance.quantity,
                PI_Code = orderStand.piCode,
                Port_Code = orderStand.customer.portCode,
                Port_Description = orderStand.customer.portDescriotion ?? string.Empty,
                PercentClose = orderStand.percentClose,
                ProBale = orderStand.proformaBalance.bale,
                ProValue = orderStand.proformaBalance.value,
                ProWeightKG = orderStand.proformaBalance.weight,
                ProQuantity = orderStand.proformaBalance.quantity,
                ProductGrade_Code = orderStand.product.gradeCode,
                ProductGrade_Description = orderStand.product.gradeDescription,
                ToBeBale = orderStand.toBeShipped.bale,
                ToBeValue = orderStand.toBeShipped.value,
                ToBeWeightKG = orderStand.toBeShipped.weight,
                ToBeQuantity = orderStand.toBeShipped.quantity,
                Product_Code = orderStand.product.code,
                Product_Description = orderStand.product.description,
                Transport_Code = null,
                Transport_Description = null,

                ShipmentPlanMain_ID = dataRequest.shipmentPlanMain.id,

                UnitType_Code = orderStand.saleUnitCode,
                UnitType_Description = null,
                Status = orderStand.status,

                BPL = orderStand.valuePerUnit.bpl,
                DelVolume = orderStand.delivered.volume,
                InvVolume = orderStand.inventory.volume,
                OutVolume = orderStand.outstandingBalance.volume,
                ProVolume = orderStand.proformaBalance.volume,
                OthVolume = orderStand.otherPick.volume,
                ToBeVolume = orderStand.toBeShipped.volume,
                FavoriteFlag = orderStand.favoriteFlag ?? "N",
                CloseByCI = orderStand.closeByCI ?? "N",
                customerID = orderStand.customer.id,
                planType = dataRequest.shipmentPlanMain.planType,
                planMonth = dataRequest.shipmentPlanMain.planMonth,
                planYear = dataRequest.shipmentPlanMain.planYear,
                PaymentTerm = orderStand.paymentTerm,
                UrgentFlag = orderStand.urgentFlag,

                TwineSizeLB = orderStand.TwineSizeLB,
                MeshSizeLB = orderStand.MeshSizeLB,
                MeshDepthLB = orderStand.MeshDepthLB,
                LengthLB = orderStand.LengthLB,
                Label_Code = orderStand.Label_Code

            };
            return res;
        }
    }
}
