using InterSaleApi.ADO;
using InterSaleApi.Engine.API.ShipmentPlanMain;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Constant.ConstEnum;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanMainGetPlanForApproveAPI : BaseAPIEngine<ShipmentPlanMainGetPlanForApproveReq, ShipmentPlanMainGetPlanForApproveRes>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(ShipmentPlanMainGetPlanForApproveReq dataReq, ShipmentPlanMainGetPlanForApproveRes dataRes)
        {
            if (dataReq == null)
            {
                throw new ArgumentNullException(nameof(dataReq));
            }

            dataReq.shipmentStatus = dataReq.shipmentStatus == null ? "" : dataReq.shipmentStatus;

            List<string> status = new List<string>();

            if (String.IsNullOrEmpty(dataReq.shipmentStatus))
            {

                EnumUtil.ListAttr<ENShipmentStatus>().ForEach(x =>
                {
                    ConstantShipmentStatusRes.ConstantShipmentStatus tmp1 = new ConstantShipmentStatusRes.ConstantShipmentStatus();
                    tmp1.id = ((char)x.Value).ToString();
                    tmp1.code = tmp1.id;
                    tmp1.description = x.Name;
                    tmp1.step = int.Parse(x.GroupName);
                    if (tmp1.step >= dataReq.step)
                    {
                        status.Add(tmp1.id);
                    }
                });
            } else
            {
                status.Add(dataReq.shipmentStatus);
            }
            
            dataRes.shipmentPlanHs = new List<ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH>();

            var containerList = ShipmentPlanADO.GetInstant().ListContainerSize(this.Logger);
            var resRelations = ShipmentPlanADO.GetInstant().GetPlanForApprove(dataReq, status, this.Logger);
            var data = resRelations.GroupBy(x => x.ShipmentPlanMainID).ToList();
            List<string> unitCodeIsNotSaleWei = new List<string>() { "BD", "BL", "CT", "P3", "PC", "PK", "PL", "SP", "ST", "WC", "X1" };

            var payAmounts = ShipmentPlanADO.GetInstant().GetPayAmount(resRelations.GroupBy(x => x.PI_Code).Select(x => x.Key).ToList());

            var tmp = new List<ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH>();
            foreach (var rel in data)
            {
                

                var orderNos = rel.GroupBy(x => x.Order_Code).Select(x => x.Key).ToList();
                var stockInvs = ADO.ShipmentPlanADO.GetInstant().StockInventory_ListByOrder(orderNos, this.Logger); /*SoMRuk*/
                // Loop Set Data
                foreach (var r in rel)
                {
                    if (r.CloseByCI == "Y")
                    {
                        var si = stockInvs.Where(x => x.ORDERNO == r.Order_Code && !x.CIDT.HasValue && x.PIITEMNO == r.ItemNo);  /*SoMRuk*/
                        if (si != null)
                        {
                            r.InvQuantity = si.Sum(x => x.qty);
                            r.InvWeightKG = si.Sum(x => x.wei);
                            r.InvBale = si.Sum(x => x.bale);
                        }
                    }
                    else
                    {
                        var si = stockInvs.Where(x => x.ORDERNO == r.Order_Code && !x.PKDT.HasValue && x.PIITEMNO == r.ItemNo);  /*SoMRuk*/
                        if (si != null)
                        {
                            r.InvQuantity = si.Sum(x => x.qty);
                            r.InvWeightKG = si.Sum(x => x.wei);
                            r.InvBale = si.Sum(x => x.bale);
                        }
                    }

                    /***********SET PLAN HEAD**************/
                    var chkH = true;
                    int shipmentH_index = 0;
                    for (var i = 0; i < tmp.Count; i++)
                    {
                        if (tmp[i].id == r.ShipmentPlanHID)
                        {
                            shipmentH_index = i;
                            chkH = false;
                            break;
                        }
                    }
                    if (chkH)
                    {
                        var sph = this.ConvertToShipmentPlanH(r);
                        if (sph != null)
                        {
                            tmp.Add(sph);
                            shipmentH_index = tmp.Count - 1;
                        }
                    }

                    /***********SET PLAN DETAIL**************/
                    var spd = this.ConvertToShipmentPlanD(r);
                    if (spd != null)
                    {
                        /***********SET ORDER STAND**************/
                        var orderStand = this.ConvertToShipmentPlanOrderStand(r, payAmounts);
                        if (orderStand != null)
                        {
                            orderStand.saleUnitIsWei = unitCodeIsNotSaleWei.Any(y => y == orderStand.saleUnitCode) ? "N" : "Y";
                            spd.shipmentPlanOrderStands = orderStand;
                        }
                        tmp[shipmentH_index].shipmentPlanDs.Add(spd);
                    }
                }
            }

            tmp.ForEach(
                h =>
                {
                    if (!dataRes.shipmentPlanHs.Any(x => x.id == h.id))
                    {
                        h.planBalance = new BalanceModel();
                        h.planBalance.quantity = 0;
                        h.planBalance.weight = 0;
                        h.planBalance.bale = 0;
                        h.planBalance.volume = 0;
                        h.planBalance.value = 0;

                        h.customers = new List<INTIdCodeDescriptionModel>();
                        h.ports = new List<StringIdCodeDescriptionModel>();
                        DateTime? l_lastAdmitDate = null;
                        DateTime? c_lastAdmitDate = null;
                        h.valuetmp = new List<CurrencyModel>();
                        var chkVolume = true;

                        h.shipmentPlanDs.ForEach(
                            x =>
                            {

                                x.valueTHB = x.planBalance.value * x.shipmentPlanOrderStands.valuePerUnit.cpb;
                                x.valuetmp = new List<CurrencyModel>();
                                x.valuetmp.Add(new CurrencyModel() { num = x.planBalance.value, code = x.shipmentPlanOrderStands.currency.code });

                                decimal inv = 0;
                                if (x.shipmentPlanOrderStands.saleUnitIsWei == "Y")
                                {
                                    x.tmpMulti = x.shipmentPlanOrderStands.inventory.weight;
                                    inv = x.planBalance.weight != 0 ? x.tmpMulti / x.planBalance.weight : 0;
                                    x.tmpDivi = x.planBalance.weight;
                                }
                                else if (x.shipmentPlanOrderStands.saleUnitIsWei == "N")
                                {
                                    x.tmpMulti = x.shipmentPlanOrderStands.inventory.quantity;
                                    inv = x.planBalance.quantity != 0 ? x.tmpMulti / x.planBalance.quantity : 0;
                                    x.tmpDivi = x.planBalance.quantity;
                                }
                                x.stockVsPlan = inv * 100;

                                // chk volume
                                if (x.planBalance.volume <= 0) { chkVolume = false; }

                                var chk = true;
                                h.customers.ForEach(
                                    y => { if (y.id == x.customer.id) { chk = false; } }
                                );
                                if (chk) { h.customers.Add(new INTIdCodeDescriptionModel() { id = x.customer.id, code = x.customer.code, description = x.customer.description }); }

                                chk = true;
                                h.ports.ForEach(
                                    y => { if (y.id == x.shipmentPlanOrderStands.customer.portCode) { chk = false; } }
                                );
                                if (chk) { h.ports.Add(new StringIdCodeDescriptionModel() { id = x.shipmentPlanOrderStands.customer.portCode, code = x.shipmentPlanOrderStands.customer.portCode, description = x.shipmentPlanOrderStands.customer.portDescriotion }); }

                                h.planBalance.quantity += x.planBalance.quantity;
                                h.planBalance.weight += x.planBalance.weight;
                                h.planBalance.bale += x.planBalance.bale;
                                h.planBalance.volume += x.planBalance.volume;
                                h.planBalance.value += x.planBalance.value;

                                h.valueTHB += x.valueTHB;

                                chk = true;
                                for (var ix = 0; ix < h.valuetmp.Count; ix++)
                                {
                                    if (h.valuetmp[ix].code == x.shipmentPlanOrderStands.currency.code)
                                    {
                                        h.valuetmp[ix].num += x.planBalance.value;
                                        chk = false;
                                        break;
                                    }
                                }
                                if (chk)
                                {
                                    h.valuetmp.Add(new CurrencyModel() { num = x.planBalance.value, code = x.shipmentPlanOrderStands.currency.code });
                                }

                                if (x.shipmentPlanOrderStands.deliveryType == "L")
                                {
                                    var d = BaseValidate.GetDate(x.shipmentPlanOrderStands.maxAdmitDate);
                                    if (l_lastAdmitDate == null || l_lastAdmitDate < d) { l_lastAdmitDate = d; }
                                }
                                else if (x.shipmentPlanOrderStands.deliveryType == "C")
                                {
                                    var d = BaseValidate.GetDate(x.shipmentPlanOrderStands.admitDate);
                                    if (c_lastAdmitDate == null || c_lastAdmitDate < d) { c_lastAdmitDate = d; }
                                }
                            }
                        );

                        Decimal containerSizeWeight = 0;
                        Decimal containerSizeVolume = 0;
                        for (var i = 0; i < containerList.Count; i++)
                        {
                            if (h.containerCode == containerList[i].Code)
                            {
                                containerSizeWeight = containerList[i].MaxWeightKg;
                                containerSizeVolume = containerList[i].Volume;
                                break;
                            }
                        }
                        var sumSize = containerSizeWeight != 0 ? h.planBalance.weight / containerSizeWeight : 0;
                        if (chkVolume)
                        {
                            sumSize = containerSizeVolume != 0 ? h.planBalance.volume / containerSizeVolume : 0;
                        }
                        //dataH.tmp.statusDetail = [];
                        //if (sumSize >= 0.95 && sumSize <= 1.05) {
                        //    dataH.tmp.status = 'F';
                        //    dataH.tmp.statusDetail.push('Full container.');
                        //} else if (sumSize <= 0.95) {
                        //    dataH.tmp.status = 'N';
                        //    dataH.tmp.statusDetail.push('Not full container.');
                        //} else if (sumSize >= 1.05) {
                        //    dataH.tmp.status = 'O';
                        //    dataH.tmp.statusDetail.push('Volume/Weight exceeded container.');
                        //} 

                        // h % set
                        h.weightMulti = h.planBalance.weight;
                        h.weightDivi = containerSizeWeight;
                        h.weightPerContainer = (h.weightDivi != 0 ? h.weightMulti / h.weightDivi : 0) * 100;

                        h.volumeMulti = h.planBalance.volume;
                        h.volumeDivi = containerSizeVolume;
                        h.volumePerContainer = (h.volumeDivi != 0 ? h.volumeMulti / h.volumeDivi : 0) * 100;

                        h.stockMulti = h.shipmentPlanDs.Sum(x => x.tmpMulti);
                        h.stockDivi = h.shipmentPlanDs.Sum(x => x.tmpDivi);
                        h.stockVsPlan = (h.stockDivi != 0 ? h.stockMulti / h.stockDivi : 0) * 100;

                        // set paymentTerm
                        h.paymentTerm = h.shipmentPlanDs.GroupBy(z => z.shipmentPlanOrderStands.paymentTerm).Select(z => z.Key).ToList();

                        // set pay Amount
                        List<CurrencyModel> payAmountTmp = new List<CurrencyModel>();
                        h.shipmentPlanDs.GroupBy(z => z.shipmentPlanOrderStands.piCode).ToList().ForEach(z => {
                            z.First().shipmentPlanOrderStands.payAmount.ForEach(p => {
                                var chk = true;
                                payAmountTmp.ForEach(c => {
                                    if (c.code == p.code)
                                    {
                                        c.num += p.num;
                                        chk = false;
                                        return;
                                    }
                                });
                                if (chk) { payAmountTmp.Add(p); }
                            });
                        });
                        h.payAmount = payAmountTmp;

                        //if (dataH.tmp.weightPerContainer > 100)
                        //{
                        //    dataH.tmp.statusDetail.push('Weight exceeded container.');
                        //}

                        //if (dataH.tmp.volumePerContainer > 100)
                        //{
                        //    dataH.tmp.statusDetail.push('Volume exceeded container.');
                        //}
                        //else if (dataH.tmp.volumePerContainer <= 0)
                        //{
                        //    dataH.tmp.statusDetail.push('Volume Per Container = 0.');
                        //}

                        if (l_lastAdmitDate != null && c_lastAdmitDate != null)
                        {
                            if (l_lastAdmitDate > c_lastAdmitDate) { h.lastAdmitDate = BaseValidate.GetDateString(l_lastAdmitDate); }
                            else { h.lastAdmitDate = BaseValidate.GetDateString(c_lastAdmitDate); }
                        }
                        else if (l_lastAdmitDate != null) { h.lastAdmitDate = BaseValidate.GetDateString(l_lastAdmitDate); }
                        else if (c_lastAdmitDate != null) { h.lastAdmitDate = BaseValidate.GetDateString(c_lastAdmitDate); }
                        else { h.lastAdmitDate = ""; }

                        dataRes.shipmentPlanHs.Add(h);
                    }
                });

            dataRes.shipmentPlanHs = dataRes.shipmentPlanHs.OrderBy(x => x.planDate).ToList();

        }

        private ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD.ShipmentPlanOrderStand ConvertToShipmentPlanOrderStand(ShipmentPlanRelationLastRevisionCriteria r, List<ShipmentPlanGetPayAmount> payAmounts)
        {
            if (!r.ShipmentPlanOrderStandID.HasValue) return null;
            var customer = StaticValueManager.GetInstant()
                .sxsCustomers
                .FirstOrDefault(x => x.ID == r.CustomerIDD);
            //if (customer == null)
            //    throw new KKFException(this.Logger, KKFExceptionCode.V0002, "CustomerID " + r.CustomerID);
            var producGradeDesc = StaticValueManager.GetInstant()
                .sxsProductGrades
                .Where(x => x.Code == r.ProductGrade_Code)
                .Select(x => x.Description)
                .FirstOrDefault();

            var res = new ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD.ShipmentPlanOrderStand()
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
                //shipmentPlanD = new List<ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanOrderStand.ShipmentPlanD>(),
                product = new ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD.ShipmentPlanOrderStand.Product()
                {
                    code = r.Product_Code,
                    description = r.Product_Description,
                    brand = r.Brand,
                    gradeCode = r.ProductGrade_Code,
                    gradeDescription = producGradeDesc
                },
                currency = new ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD.ShipmentPlanOrderStand.Currency()
                {
                    code = r.Currency_Code,
                    cpb = r.CPB
                },
                valuePerUnit = new ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD.ShipmentPlanOrderStand.ValuePerUnit()
                {
                    cpb = r.CPB,
                    qpb = r.QPB,
                    qpv = r.QPV,
                    qpw = r.QPW,
                    bpl = r.BPL
                },
                customer = new ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD.ShipmentPlanOrderStand.Customer()
                {
                    id = customer.ID,
                    code = customer.Code,
                    description = customer.CompanyName,
                    portCode = r.Port_Code,
                    portDescriotion = r.Port_Description
                },
                comparisonPercent = new ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD.ShipmentPlanOrderStand.ComparisonPercent()
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
                , payAmount = payAmounts.Where(z => z.PiCode == r.PI_Code).Select(z => new CurrencyModel() { num = z.PayAmount, code = z.CurrencyCode }).ToList()
                , urgentFlag = r.UrgentFlag

                , TwineSizeLB = r.TwineSizeLB
                , MeshSizeLB = r.MeshSizeLB
                , MeshDepthLB = r.MeshDepthLB
                , LengthLB = r.LengthLB
                , Label_Code = r.Label_Code
            };
            
            return res;
        }

        private ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH ConvertToShipmentPlanH(ShipmentPlanRelationLastRevisionCriteria r)
        {
            if (!r.ShipmentPlanHID.HasValue) return null;
            var res = new ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH()
            {
                id = r.ShipmentPlanHID.Value,
                containerCode = r.ShipmentPlanH_ContainerCode,
                planDate = BaseValidate.GetDateString(r.PlanDate),
                planWeek = r.PlanWeek,
                planMonth = r.PlanDate.Month,
                planYear = r.PlanDate.Year,
                status = r.ShipmentPlanHStatus,
                salesApprove = new ApproveDocumentModel() { by = BaseValidate.GetEmpName(r.SalesApproveBy), flag = r.SalesApprove, datetime = BaseValidate.GetDateTimeString(r.SalesApproveDate) },
                regionalApprove = new ApproveDocumentModel() { by = BaseValidate.GetEmpName(r.RegionalApproveBy), flag = r.RegionalApprove, datetime = BaseValidate.GetDateTimeString(r.RegionalApproveDate) },
                managerApprove = new ApproveDocumentModel() { by = BaseValidate.GetEmpName(r.ManagerApproveBy), flag = r.ManagerApprove, datetime = BaseValidate.GetDateTimeString(r.ManagerApproveDate) },
                statusDetail = r.ShipmentPlanHStatus == null ? null : EnumUtil.GetDisplayName<ENShipmentStatus>(r.ShipmentPlanHStatus),
                shipmentPlanDs = new List<ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD>()
                , remark = new INTIdCodeDescriptionModel() { id = r.Remark_ID, code = r.Remark_Code, description = r.Remark_Description }
                
            };
            return res;
        }

        private ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD ConvertToShipmentPlanD(ShipmentPlanRelationLastRevisionCriteria r)
        {
            if (!r.ShipmentPlanDID.HasValue) return null;
            var customer = StaticValueManager.GetInstant().sxsCustomers
                    .Where(x => x.ID == r.CustomerIDD)
                    .Select(x => new INTIdCodeDescriptionModel() { id = x.ID, code = x.Code, description = x.CompanyName })
                    .FirstOrDefault();
            var res = new ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD()
            {
                id = r.ShipmentPlanDID.Value,
                customer = customer,
                shipmentPlanMainID = r.ShipmentPlanMainID,
                status = r.ShipmentPlanDStatus,
                planBalance = new BalanceModel()
                {
                    bale = r.PlanBale,
                    quantity = r.PlanQuatity,
                    value = r.PlanValue,
                    weight = r.PlanWeightKG,
                    volume = r.PlanVolume
                }, 
                shipmentPlanOrderStands = new ShipmentPlanMainGetPlanForApproveRes.ShipmentPlanH.ShipmentPlanD.ShipmentPlanOrderStand(),
            };
            return res;
        }

    }
}