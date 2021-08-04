using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.KKFException;
using KKFCoreEngine.Constant;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.Entity.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleApi.ADO;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanMainGetPlanAPI : BaseAPIEngine<ShipmentPlanGetPlanRequest, ShipmentPlanGetPlanResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(ShipmentPlanGetPlanRequest dataRequest, ShipmentPlanGetPlanResponse dataResponse)
        {
            var resRelations = ADO.ShipmentPlanMainADO.GetInstant().GetPlan(dataRequest.shipmentPlanMainID, this.Logger);

            var planMain = resRelations.FirstOrDefault(x => x.ShipmentPlanMainID == dataRequest.shipmentPlanMainID);
            if (planMain == null)
                throw new KKFException(this.Logger, KKFExceptionCode.V0002, "ShipmentPlanMain ID:" + dataRequest.shipmentPlanMainID);

            dataResponse.shipmentPlanMain = this.ConvertToShipmentPlanMain(planMain);
            //var closeFlags = ADO.ShipmentPlanADO.GetInstant()
            //    .OrderMarketCloseFlag_ListByOrderNo(resRelations.Select(x=>x.Order_Code).Distinct().ToList(), this.Logger);

            var orderNos = resRelations.GroupBy(x => x.Order_Code).Select(x => x.Key).ToList();
            var stockInvs = ADO.ShipmentPlanADO.GetInstant().StockInventory_ListByOrder(orderNos, this.Logger); /*SoMRuk*/
            
            var payAmounts = ShipmentPlanADO.GetInstant().GetPayAmount(resRelations.GroupBy(x => x.PI_Code).Select(x => x.Key).ToList());

            foreach (var r in resRelations)
            {
                if (r.CloseByCI == "Y")
                {
                    var si = stockInvs.Where(x => x.ORDERNO == r.Order_Code && x.PIITEMNO == r.ItemNo && !x.CIDT.HasValue);  /*SoMRuk*/
                    if (si != null)
                    {
                        r.InvQuantity = si.Sum(x => x.qty);
                        r.InvWeightKG = si.Sum(x => x.wei);
                        r.InvBale = si.Sum(x => x.bale);
                        r.InvValue = r.InvQuantity * r.QPV; /* SoMRuk */
                        r.InvVolume = r.InvBale * r.BPL; /* SoMRuk */
                    }
                }
                else
                {
                    var si = stockInvs.Where(x => x.ORDERNO == r.Order_Code && x.PIITEMNO == r.ItemNo && !x.PKDT.HasValue);  /*SoMRuk*/
                    if (si != null)
                    {
                        r.InvQuantity = si.Sum(x => x.qty);
                        r.InvWeightKG = si.Sum(x => x.wei);
                        r.InvBale = si.Sum(x => x.bale);
                        r.InvValue = r.InvQuantity * r.QPV; /* SoMRuk */
                        r.InvVolume = r.InvBale * r.BPL; /* SoMRuk */
                    }
                }


                r.PayAmount = payAmounts.Where(z => z.PiCode == r.PI_Code).Select(z => new CurrencyModel() { num = z.PayAmount, code = z.CurrencyCode }).ToList();


                /***********SET ORDER STAND**************/
                var orderStand = dataResponse
                    .shipmentPlanMain
                    .shipmentPlanOrderStands
                    .FirstOrDefault(x => x.id == r.ShipmentPlanOrderStandID);
                if (orderStand == null)
                {
                    orderStand = this.ConvertToShipmentPlanOrderStand(r);
                    if(orderStand != null)
                    {
                        //orderStand.marketCloseFlag = closeFlags
                        //    .Where(x => x.ORDERNO == orderStand.orderCode && x.PRODCODE == orderStand.product.code && x.ITEMNO == orderStand.itemno)
                        //    .Any(x => x.MarketCloseFlag.Equals("Y")) ? "Y" : "N";
                        //orderStand.orderCloseFlag = closeFlags
                        //    .Where(x => x.ORDERNO == orderStand.orderCode && x.PRODCODE == orderStand.product.code && x.ITEMNO == orderStand.itemno)
                        //    .Any(x => x.OrderCloseFlag.Equals("Y")) ? "Y" : "N";
                        dataResponse.shipmentPlanMain.shipmentPlanOrderStands.Add(orderStand);
                    }
                }
                
                /***********SET PLAN HEAD**************/
                var sph = dataResponse
                    .shipmentPlanMain
                    .shipmentPlanHs
                    .FirstOrDefault(x => x.id == r.ShipmentPlanHID);
                if (sph == null)
                {
                    sph = this.ConvertToShipmentPlanH(r);
                    if (sph != null)
                        dataResponse.shipmentPlanMain.shipmentPlanHs.Add(sph);
                }

                /***********SET PLAN DETAIL**************/
                var spd = this.ConvertToShipmentPlanD(r);
                if (spd != null && sph != null)
                    sph.shipmentPlanDs.Add(spd);
            }

            dataResponse.shipmentPlanMain.ports = dataResponse.shipmentPlanMain.shipmentPlanOrderStands
                .Where(x => x.customer.id == dataResponse.shipmentPlanMain.customer.id)
                .GroupBy(x => x.customer.portCode)
                .Select(x => x.Key).ToList();

            List<string> unitCodeIsNotSaleWei = new List<string>()
            {
                "BD","BL","CT","P3","PC","PK","PL","SP","ST","WC","X1",
            };
            dataResponse.shipmentPlanMain.shipmentPlanOrderStands.ForEach(
                x => x.saleUnitIsWei = unitCodeIsNotSaleWei.Any(y => y == x.saleUnitCode) ? "N" : "Y"
                );
        }

        private ShipmentPlanGetPlanResponse.ShipmentPlanMain ConvertToShipmentPlanMain(ShipmentPlanRelationLastRevisionCriteria r)
        {
            var spc = ADO.ShipmentPlanDateCircleADO.GetInstant().GetByCustomerID(r.CustomerID).FirstOrDefault();
            
            if (spc == null)
            {
                var c = StaticValueManager.GetInstant().sxsCustomers.Find(x => x.ID == r.CustomerID);
                throw new KKFException(this.Logger, KKFExceptionCode.V0002, "ShipmentPlanDateCircle for Customer : " + c.Code);
            }
            var customer = StaticValueManager.GetInstant().sxsCustomers
                    .Where(x => x.ID == r.CustomerID)
                    .Select(x => new INTIdCodeDescriptionModel() { id = x.ID, code = x.Code, description = x.CompanyName })
                    .FirstOrDefault();
            var res = new ShipmentPlanGetPlanResponse.ShipmentPlanMain()
            {
                id = r.ShipmentPlanMainID,
                code = r.Code,
                //customerID = r.CustomerID,
                customer = customer,
                planMonth = r.PlanMonth,
                planYear = r.PlanYear,
                planType = r.PlanType,
                shippingDay = spc.ShippingDay,
                shipmentPlanOrderStands = new List<ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanOrderStand>(),
                shipmentPlanHs = new List<ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanH>(),
                status = r.ShipmentPlanMainStatus
            };
            return res;
        }

        private ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanOrderStand ConvertToShipmentPlanOrderStand(ShipmentPlanRelationLastRevisionCriteria r)
        {
            if (!r.ShipmentPlanOrderStandID.HasValue) return null;
            var customer = StaticValueManager.GetInstant()
                .sxsCustomers
                .FirstOrDefault(x => x.ID == r.CustomerID);
            if (customer == null)
                throw new KKFException(this.Logger, KKFExceptionCode.V0002, "CustomerID " + r.CustomerID);
            var producGradeDesc = StaticValueManager.GetInstant()
                .sxsProductGrades
                .Where(x => x.Code == r.ProductGrade_Code)
                .Select(x => x.Description)
                .FirstOrDefault();

            var res = new ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanOrderStand()
            {
                id = r.ShipmentPlanOrderStandID,
                admitDate = BaseValidate.GetDateString(r.AdmitDate),
                maxAdmitDate = BaseValidate.GetDateString(r.MaxAdmitDate),
                branch = r.Branch,
                contianerCode = r.Container_Code,
                //contianerSizeKG = r.Container_SizeKG,
                itemno = r.ItemNo,
                orderCode = r.Order_Code,
                piCode = r.PI_Code,
                deliveryType = r.DeliveryType_Code,
                deliveryDescription = r.DeliveryType_Description,
                percentClose = r.PercentClose,
                saleUnitCode = r.UnitType_Code,
                status = r.ShipmentPlanOrderStandStatus,
                beforePaymentTermCode = r.BeforePaymentTerm_Code,
                afterPaymentTermCode = r.AfterPaymentTerm_Code,
                favoriteFlag = r.FavoriteFlag,
                closeByCI = r.CloseByCI,
                //shipmentPlanD = new List<ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanOrderStand.ShipmentPlanD>(),
                product = new ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanOrderStand.Product()
                {
                    code = r.Product_Code,
                    description = r.Product_Description,
                    brand = r.Brand,
                    gradeCode = r.ProductGrade_Code,
                    gradeDescription = producGradeDesc
                },
                currency = new ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanOrderStand.Currency()
                {
                    code = r.Currency_Code,
                    cpb = r.CPB
                },
                valuePerUnit = new ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanOrderStand.ValuePerUnit()
                {
                    cpb = r.CPB,
                    qpb = r.QPB,
                    qpv = r.QPV,
                    qpw = r.QPW,
                    bpl = r.BPL
                },
                customer = new ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanOrderStand.Customer()
                {
                    id = customer.ID,
                    code = customer.Code,
                    description = customer.CompanyName,
                    portCode = r.Port_Code,
                    portDescriotion = r.Port_Description
                },
                comparisonPercent = new ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanOrderStand.ComparisonPercent()
                {
                    inventory = r.CompInventory,
                    notYetDelivered = r.CompNotYetDelivered,
                    notYetFinished = r.CompNotYetFinished
                },
                delivered = new BalanceModel()
                {
                    bale = r.DelBale,
                    quantity = r.DelQuantity,
                    value = r.DelValue,
                    weight = r.DelWeightKG,
                    volume = r.DelVolume
                },
                inventory = new BalanceModel()
                {
                    bale = r.InvBale,
                    quantity = r.InvQuantity,
                    value = r.QPV * r.InvQuantity,
                    weight = r.InvWeightKG,
                    volume = r.InvVolume
                },
                outstandingBalance = new BalanceModel()
                {
                    bale = r.OutBale,
                    quantity = r.OutQuantity,
                    value = r.OutValue,
                    weight = r.OutWeightKG,
                    volume = r.OutVolume
                },
                proformaBalance = new BalanceModel()
                {
                    bale = r.ProBale,
                    quantity = r.ProQuantity,
                    value = r.ProValue,
                    weight = r.ProWeightKG,
                    volume = r.ProVolume
                },
                toBeShipped = new BalanceModel()
                {
                    bale = r.ToBeBale,
                    quantity = r.ToBeQuantity,
                    value = r.ToBeValue,
                    weight = r.ToBeWeightKG,
                    volume = r.ToBeVolume
                },
                otherPick = new BalanceModel()
                {
                    bale = r.OthBale,
                    quantity = r.OthQuantity,
                    value = r.OthValue,
                    weight = r.OthWeightKG,
                    volume = r.OthVolume
                }
                , paymentTerm = r.PaymentTerm
                , payAmount = r.PayAmount
                , urgentFlag = r.UrgentFlag
                , TwineSizeLB = r.TwineSizeLB
                , MeshSizeLB = r.MeshSizeLB
                , MeshDepthLB = r.MeshDepthLB
                , LengthLB = r.LengthLB
                , Label_Code = r.Label_Code
            };
            
            return res;
        }
        
        private ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanH ConvertToShipmentPlanH(ShipmentPlanRelationLastRevisionCriteria r)
        {
            if (!r.ShipmentPlanHID.HasValue) return null;

            var portLoadingTmp = StaticValueManager.GetInstant().sxsPortLoading.Where(z => z.ID == r.PortLoading_ID).Select(z => new INTIdCodeDescriptionModel() { id = z.ID, code = z.Code, description = z.Description }).FirstOrDefault();

            var res = new ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanH()
            {
                id = r.ShipmentPlanHID.Value,
                containerCode = r.ShipmentPlanH_ContainerCode,
                //containerSizeKg = r.ShipmentPlanH_ContainerSizeKg,
                planDate = BaseValidate.GetDateString(r.PlanDate),
                planWeek = r.PlanWeek,
                status = r.ShipmentPlanHStatus,
                shipmentPlanDs = new List<ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanH.ShipmentPlanD>()
                , remark = new INTIdCodeDescriptionModel() {
                    id = r.Remark_ID, code = r.Remark_Code, description = r.Remark_Description
                }
                , refID = r.ShipmentPlanHRefID
                , calculateType = r.CalculateType
                , volumeAdj = r.VolumeAdj
                , weightAdj = r.WeightAdj
            };

            if(portLoadingTmp != null) res.portLoading = portLoadingTmp; 
            return res;
        }

        private ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanH.ShipmentPlanD ConvertToShipmentPlanD(ShipmentPlanRelationLastRevisionCriteria r)
        {
            if (!r.ShipmentPlanDID.HasValue) return null;
            var customer = StaticValueManager.GetInstant().sxsCustomers
                    .Where(x => x.ID == r.CustomerID)
                    .Select(x => new INTIdCodeDescriptionModel() { id = x.ID, code = x.Code, description = x.CompanyName })
                    .FirstOrDefault();
            var res = new ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanH.ShipmentPlanD()
            {
                id = r.ShipmentPlanDID.Value,
                customer = customer,
                shipmentPlanMainID = r.ShipmentPlanMainID,
                shipmentPlanOrderStandID = r.ShipmentPlanOrderStandID.Value,
                status = r.ShipmentPlanDStatus,
                planBalance = new BalanceModel()
                {
                    bale = r.PlanBale,
                    quantity = r.PlanQuatity,
                    value = r.PlanValue,
                    weight = r.PlanWeightKG,
                    volume = r.PlanVolume
                }
            };
            return res;
        }


    }
}
