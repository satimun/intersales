using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using InterSaleModel.Model.Jobs;
using InterSaleModel.Model.Jobs.Request;
using InterSaleModel.Model.Jobs.Response;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.Jobs
{
    public class ShipmentPlanReplacePlanJobs : BaseJobsEngine<ShipmentPlanReplacePlanReq, JobEmplyRes>
    {
        protected override void ExecuteChild(ShipmentPlanReplacePlanReq dataReq, JobEmplyRes datRes)
        {
            if (StaticValueManager.GetInstant().ShipmentPlanJobReplaceActive)
            {
                throw new Exception("ระบบกำลังทำงานอยู่...");
            }

            var Issucces = true;
            var msg = "";

            try
            {
                StaticValueManager.GetInstant().ShipmentPlanJobReplaceActive_Set(true);
                // get date
                var planMonth = dataReq.planMonth.HasValue ? dataReq.planMonth.Value : DateTime.Today.Month;
                var planYear = dataReq.planYear.HasValue ? dataReq.planYear.Value : DateTime.Today.Year;

                int? week = BaseValidate.GetWeeks(planYear, planMonth).Where(x => x.startDate <= DateTime.Today && x.endDate >= DateTime.Today).Select(x => x.weekNo).FirstOrDefault();
                if (dataReq.planYear.HasValue || dataReq.planMonth.HasValue) { week = dataReq.planWeek; }

                // get weekly plan to week
                var planDatas = ADO.ShipmentPlanADO.GetInstant().GetPlanForReplace(planMonth, planYear, new List<int>(), "W", week, null);

                // get packlist
                var packLists = ADO.ShipmentPlanADO.GetInstant().GetPackList(new ShipmentPlanGetPackListReq() { planMonth = planMonth, planYear = planYear, customerIDs = new List<int>(), planWeek = week });//.Where(x => x.SHIPWEEK >= week).ToList();

                // get container
                var containerList = ShipmentPlanADO.GetInstant().ListContainerSize(null);

                // gen outstanding
                var outstandings = new List<sxtShipmentPlanOrderStand>();
                planDatas.ForEach(x => outstandings.Add(ConvertOutstanding1(x, planYear, planMonth)) );

                var packListNoOus = new List<ShipmentPlanGetPackList>(); 
                packLists.ForEach(x => {
                    x.customerID = StaticValueManager.GetInstant().sxsCustomers.Where(z => z.Code == x.CUSCOD.Trim()).Select(z => z.ID).FirstOrDefault();
                    if (!planDatas.Any(y => y.Order_Code == x.ORDERNO && y.Product_Code == x.PRODCODE)) { packListNoOus.Add(x); }
                });

                packListNoOus.GroupBy(c => c.CUSCOD).ToList().ForEach(y =>
                {
                    var tmp = y.ToList();

                    List<string> orderNos = new List<string>();
                    List<string> pkNos = new List<string>();
                    List<string> customerCodes = new List<string>();
                    List<string> productCodes = new List<string>();

                    tmp.ForEach(x =>
                    {
                        orderNos.Add(x.ORDERNO);
                        pkNos.Add(x.PKNO);
                        customerCodes.Add(x.CUSCOD);
                        productCodes.Add(x.PRODCODE);
                    });
                    orderNos = orderNos.Distinct().ToList();
                    pkNos = pkNos.Distinct().ToList();
                    customerCodes = customerCodes.Distinct().ToList();
                    productCodes = productCodes.Distinct().ToList();

                    if (orderNos.Count != 0 || pkNos.Count != 0)
                    {
                        DateTime fdate = new DateTime(planYear - 2, planMonth, 1);
                        DateTime ldate = new DateTime(planYear + 1, planMonth, 1);
                        var getOutstanding = new API.ShipmentPlan.ShipmentPlanGetOutstandingAPI();
                        var outstandingPk = getOutstanding.ExecuteResponse(null, new ShipmentPlanSearchOutstandingRequest() {
                            admitDateFrom = DateTimeUtil.GetDateString(fdate)
                            , admitDateTo = DateTimeUtil.GetDateString(ldate)
                            , customerCodes = customerCodes
                            , orderCodes = orderNos
                            , packlistCodes = pkNos
                            , productCodes = productCodes
                        }, null);

                        outstandingPk.outstandings.ForEach(x => {
                            if(!outstandings.Any(o => o.ID == x.id))
                            {
                                outstandings.Add(ConvertOutstanding2(x, planYear, planMonth));
                            }
                        });
                    }
                });
                
                // set packList outstandind
                var packListsDel = new List<ShipmentPlanGetPackList>();
                packLists.ForEach(x =>
                {
                    var outstand = outstandings.Where(y => y.Order_Code == x.ORDERNO && y.Product_Code == x.PRODCODE && y.customerID == x.customerID).FirstOrDefault();
                    if (outstand != null)
                    {
                        x.outstandID = outstand.ID;
                        //x.VALUE = x.QTY * outstand.QPV;
                    }
                    else
                    {
                        packListsDel.Add(x);
                        //packLists.Remove(x);
                    }
                });

                //packListsDel.ForEach(x => packLists.Remove(x));

                // Gen Plan 
                var plan = new ShipmentPlanReplacePlan();
                planDatas.GroupBy(x => x.ShipmentPlanHID).ToList().ForEach(x =>
                {
                    if(x.Key != null) { plan.planHs.Add(convertPlanHs(x.ToList())); } 
                });

                // Get from week
                //plan.planHs = plan.planHs.Where(x => x.PlanWeek >= week).ToList();

                // Gen PackList
                var packList = new ShipmentPlanReplacePlan();
                packLists.GroupBy(x => x.PKNO).ToList().ForEach(x =>
                {
                    var tmp = x.ToList();
                    packList.planHs.Add(new ShipmentPlanReplacePlan.PlanH()
                    {
                        ID = null
                        , PlanDate = tmp.First().SHIPDATE.Value
                        , PlanWeek = tmp.First().SHIPWEEK
                        , Status = "A"
                        , Container_Code = containerList.Where(z => z.Code == tmp.First().FREIGHTCODE.Trim()).Select(z => z.Code).FirstOrDefault()
                        , RefID = null
                        , Remark_ID = null
                        , customerIDs = tmp.GroupBy(z => z.customerID.Value).Select(z => z.Key).ToList()
                        , packListCode = tmp.First().PKNO
                    });

                    tmp.ForEach(d => {
                        packList.planHs.Last().planDs.Add(new ShipmentPlanReplacePlan.PlanH.PlanD()
                        {
                            ID = null
                            , ShipmentPlanOrderStand_ID = d.outstandID.Value
                            , Customer_ID = d.customerID.Value
                            , PlanBale = d.BALE
                            , PlanQuatity = d.QTY 
                            , PlanWeightKG = d.WEIGHT
                            , PlanValue = d.VALUE
                            , PlanVolume = d.VOLUME
                            , Status = "A"
                        });
                    });
                });

                // update plan
                plan.planHs.ForEach(x =>
                {
                    foreach(var y in packList.planHs)
                    {
                        if ( (y.customerIDs.TrueForAll(z => x.customerIDs.Any(c => c == z)) && x.customerIDs.TrueForAll(z => y.customerIDs.Any(c => c == z)) && x.PlanWeek == y.PlanWeek) && (string.IsNullOrWhiteSpace(x.packListCode) || x.packListCode == y.packListCode) )
                        {
                            x.planDs.ForEach(d => d.Status = "C");
                            x.PlanDate = y.PlanDate;
                            x.Container_Code = string.IsNullOrWhiteSpace(y.Container_Code) ? x.Container_Code : y.Container_Code;
                            x.packListCode = y.packListCode;

                            y.planDs.ForEach(p =>
                            {
                                var chk = true;
                                x.planDs.Where(d => d.ShipmentPlanOrderStand_ID == p.ShipmentPlanOrderStand_ID).ToList().ForEach(d => {
                                    d.PlanBale = p.PlanBale;
                                    d.PlanQuatity = p.PlanQuatity;
                                    d.PlanWeightKG = p.PlanWeightKG;
                                    d.PlanVolume = p.PlanVolume;
                                    d.PlanValue = p.PlanValue;
                                    d.Status = "A";
                                    chk = false;
                                });

                                if (chk)
                                {
                                    x.planDs.Add(new ShipmentPlanReplacePlan.PlanH.PlanD()
                                    {
                                        ID = null
                                        , ShipmentPlanOrderStand_ID = p.ShipmentPlanOrderStand_ID
                                        , Customer_ID = p.Customer_ID
                                        , PlanBale = p.PlanBale
                                        , PlanQuatity = p.PlanQuatity 
                                        , PlanWeightKG = p.PlanWeightKG
                                        , PlanValue = p.PlanValue
                                        , PlanVolume = p.PlanVolume
                                        , Status = "A"
                                    });
                                }
                            });
                            packList.planHs.Remove(y);
                            break;
                        }
                    }
                });

                // Get Monthly Plan
                if(packList.planHs.Count != 0)
                {
                    var monthlyPlan = new ShipmentPlanReplacePlan();
                    ADO.ShipmentPlanADO.GetInstant().GetPlanForReplace(planMonth, planYear, new List<int>(), "M", week, null).GroupBy(x => x.ShipmentPlanHID).ToList().ForEach(x =>
                    {
                        if (x.Key != null) { monthlyPlan.planHs.Add(convertPlanHs(x.ToList())); }
                    });
                    //monthlyPlan.planHs = monthlyPlan.planHs.Where(x => x.PlanWeek >= week).ToList();

                    // Check Remove Monthly Plan
                    plan.planHs.ForEach(x =>
                    {
                        foreach (var y in monthlyPlan.planHs)
                        {
                            if ((y.customerIDs.TrueForAll(z => x.customerIDs.Any(c => c == z)) && x.customerIDs.TrueForAll(z => y.customerIDs.Any(c => c == z)) && x.PlanWeek == y.PlanWeek))
                            {
                                monthlyPlan.planHs.Remove(y);
                                break;
                            }
                        }
                    });

                    // insert new plan
                    foreach (var p in packList.planHs)
                    {
                        if(!plan.planHs.Any(d => d.packListCode == p.packListCode) && p.PlanDate.Ticks <= DateTime.Today.Ticks)
                        {
                            var chk = true;
                            foreach (var x in monthlyPlan.planHs)
                            {
                                if ((p.customerIDs.TrueForAll(z => x.customerIDs.Any(c => c == z)) && x.customerIDs.TrueForAll(z => p.customerIDs.Any(c => c == z)) && x.PlanWeek == p.PlanWeek))
                                {
                                    chk = false;
                                    monthlyPlan.planHs.Remove(x);
                                    break;
                                }
                            }
                            if(chk)
                            {
                                if (string.IsNullOrWhiteSpace(p.Container_Code))
                                {
                                    var wn = p.planDs.Sum(y => y.PlanWeightKG);
                                    var ContainerTmp = new List<sxsFreightContainer>();
                                    containerList.ForEach(y => {
                                        ContainerTmp.Add(new sxsFreightContainer() { ID = y.ID, Code = y.Code, WeightKg = (Math.Abs(y.MaxWeightKg - wn) / wn) * 100 });
                                    });
                                    p.Container_Code = ContainerTmp.OrderBy(y => y.WeightKg).ToList().First().Code;
                                }
                                plan.planHs.Add(p);
                            }
                        }
                    }
                }

                // Save Plan
                SqlTransaction transac = BaseADO.BeginTransaction();
                try
                {
                    // outstanding Save
                    outstandings.ForEach(o => { ADO.ShipmentPlanOrderStandADO.GetInstant().Save(o, 0, null, transac); });

                    plan.planHs.ForEach(x =>
                    {
                        sxtShipmentPlanH planHModel = new sxtShipmentPlanH()
                        {
                            ID = x.ID,
                            Container_Code = x.Container_Code,
                            RefID = x.RefID,
                            Remark_ID = x.Remark_ID,
                            PlanDate = x.PlanDate,
                            PlanWeek = x.PlanWeek,
                            Status = x.Status
                            , PackList_Code = x.packListCode
                        };
                        // planHs Save
                        var planHID = ADO.ShipmentPlanHADO.GetInstant().Save(planHModel, 0, null, transac).ID;

                        x.planDs.ForEach(d =>
                        {
                            sxtShipmentPlanD planDModel = new sxtShipmentPlanD()
                            {
                                ID = d.ID
                                , PlanBale = d.PlanBale
                                , PlanQuatity = d.PlanQuatity
                                , PlanWeightKG = d.PlanWeightKG
                                , PlanValue = d.PlanValue
                                , PlanVolume = d.PlanVolume
                                , Customer_ID = d.Customer_ID
                                , ShipmentPlanH_ID = planHID.Value
                                , ShipmentPlanOrderStand_ID = d.ShipmentPlanOrderStand_ID
                                , planMonth = planMonth
                                , planYear = planYear
                                , planType = "W"
                                , Status = d.Status
                            };
                            // planDs Save
                            ADO.ShipmentPlanDADO.GetInstant().Save(planDModel, 0, null, transac);
                        });
                              
                    });
                    transac.Commit();
                }
                catch (Exception ex)
                {
                    transac.Rollback();
                    Issucces = false;
                    msg = ex.Message;
                }
                finally
                {
                    if (transac != null && transac.Connection != null && transac.Connection.State == System.Data.ConnectionState.Open)
                        transac.Connection.Close();
                }
            }
            catch (Exception ex)
            {
                Issucces = false;
                msg = ex.Message;
            }
            finally
            {
                StaticValueManager.GetInstant().ShipmentPlanJobReplaceActive_Set(false);
            }

            if (!Issucces) throw new Exception(msg);
        }

        private sxtShipmentPlanOrderStand ConvertOutstanding1(ShipmentPlanRelationLastRevisionCriteria o, int planYear, int planMonth)
        {
            var res = new sxtShipmentPlanOrderStand()
            {
                ID = o.ShipmentPlanOrderStandID.Value,
                MaxAdmitDate = o.MaxAdmitDate,
                AdmitDate = o.AdmitDate,
                AfterPaymentTerm_Code = o.AfterPaymentTerm_Code,
                BeforePaymentTerm_Code = o.BeforePaymentTerm_Code,
                Branch = o.Branch,
                Brand = o.Brand,
                CompInventory = o.CompInventory,
                CompNotYetDelivered = o.CompNotYetDelivered,
                CompNotYetFinished = o.CompNotYetFinished,
                Container_Code = o.Container_Code,
                //Container_SizeKG = o.Container_SizeKG,
                CPB = o.CPB,
                QPB = o.QPB,
                QPV = o.QPV,
                QPW = o.QPW,
                Currency_Code = o.Currency_Code,
                DelBale = o.DelBale,
                DelQuantity = o.DelQuantity,
                DelValue = o.DelValue,
                DelWeightKG = o.DelWeightKG,
                DeliveryType_Code = o.DeliveryType_Code,
                DeliveryType_Description = o.DeliveryType_Description,
                InvBale = o.InvBale,
                InvQuantity = o.InvQuantity,
                InvValue = o.InvValue,
                InvWeightKG = o.InvWeightKG,
                ItemNo = o.ItemNo,
                Order_Code = o.Order_Code,
                OthBale = o.OthBale,
                OthWeightKG = o.OthWeightKG,
                OthValue = o.OthValue,
                OthQuantity = o.OthQuantity,
                OutBale = o.OutBale,
                OutValue = o.OutValue,
                OutWeightKG = o.OutWeightKG,
                OutQuantity = o.OutQuantity,
                PI_Code = o.PI_Code,
                Port_Code = o.Port_Code,
                Port_Description = o.Port_Description ?? string.Empty,
                PercentClose = o.PercentClose,
                ProBale = o.ProBale,
                ProValue = o.ProValue,
                ProWeightKG = o.ProWeightKG,
                ProQuantity = o.ProQuantity,
                ProductGrade_Code = o.ProductGrade_Code,
                ProductGrade_Description = o.ProductGrade_Description,
                ToBeBale = o.ToBeBale,
                ToBeValue = o.ToBeValue,
                ToBeWeightKG = o.ToBeWeightKG,
                ToBeQuantity = o.ToBeQuantity,
                Product_Code = o.Product_Code,
                Product_Description = o.Product_Description,
                Transport_Code = null,
                Transport_Description = null,

                //ShipmentPlanMain_ID = o.ShipmentPlanMainID,

                UnitType_Code = o.UnitType_Code,
                UnitType_Description = null,
                Status = "A",

                BPL = o.BPL,
                DelVolume = o.DelVolume,
                InvVolume = o.InvVolume,
                OutVolume = o.OutVolume,
                ProVolume = o.ProVolume,
                OthVolume = o.OthVolume,
                ToBeVolume = o.ToBeVolume,
                FavoriteFlag = o.FavoriteFlag ?? "N",
                CloseByCI = o.CloseByCI ?? "N"

                , customerID = o.CustomerID
                , planType = "W"
                , planMonth = planMonth
                , planYear = planYear

                , PaymentTerm = o.PaymentTerm

                , TwineSizeLB = o.TwineSizeLB
                , MeshSizeLB = o.MeshSizeLB
                , MeshDepthLB = o.MeshDepthLB
                , LengthLB = o.LengthLB
                , Label_Code = o.Label_Code

            };
            return res;
        }

        private sxtShipmentPlanOrderStand ConvertOutstanding2(ShipmentPlanSearchOutstandingResponse.Outstandigns orderStand, int planYear, int planMonth)
        {
            var res = new sxtShipmentPlanOrderStand()
            {
                ID = orderStand.id,
                MaxAdmitDate = DateTimeUtil.GetDate(orderStand.maxAdmitDate).Value,
                AdmitDate = DateTimeUtil.GetDate(orderStand.admitDate).Value,
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

                //ShipmentPlanMain_ID = dataRequest.shipmentPlanMain.id,

                UnitType_Code = orderStand.saleUnitCode,
                UnitType_Description = null,
                Status = "A",

                BPL = orderStand.valuePerUnit.bpl,
                DelVolume = orderStand.delivered.volume,
                InvVolume = orderStand.inventory.volume,
                OutVolume = orderStand.outstandingBalance.volume,
                ProVolume = orderStand.proformaBalance.volume,
                OthVolume = orderStand.otherPick.volume,
                ToBeVolume = orderStand.toBeShipped.volume,
                FavoriteFlag = orderStand.favoriteFlag ?? "N",
                CloseByCI = orderStand.closeByCI ?? "N"

                , customerID = orderStand.customer.id
                , planType = "W"
                , planMonth = planMonth
                , planYear = planYear

                , PaymentTerm = orderStand.paymentTerm

                , TwineSizeLB = orderStand.TwineSizeLB
                , MeshSizeLB = orderStand.MeshSizeLB
                , MeshDepthLB = orderStand.MeshDepthLB
                , LengthLB = orderStand.LengthLB
                , Label_Code = orderStand.Label_Code

            };
            return res;
        }

        private ShipmentPlanReplacePlan.PlanH convertPlanHs(List<ShipmentPlanRelationLastRevisionCriteria> data)
        {
            var res = new ShipmentPlanReplacePlan.PlanH()
            {
                ID = data.First().ShipmentPlanHID
                , PlanDate = data.First().PlanDate
                , PlanWeek = data.First().PlanWeek
                , Status = data.First().ShipmentPlanHStatus
                , Container_Code = data.First().Container_Code
                , RefID = data.First().ShipmentPlanHRefID
                , Remark_ID = data.First().Remark_ID
                , customerIDs = data.GroupBy(z => z.CustomerID).Select(z => z.Key).ToList()
                , packListCode = data.First().PackList_Code
            };
            data.ForEach(d =>
            {
                res.planDs.Add(new ShipmentPlanReplacePlan.PlanH.PlanD()
                {
                    ID = d.ShipmentPlanDID
                    , ShipmentPlanOrderStand_ID = d.ShipmentPlanOrderStandID.Value
                    , Customer_ID = d.CustomerID
                    , PlanBale = d.PlanBale
                    , PlanQuatity = d.PlanQuatity 
                    , PlanWeightKG = d.PlanWeightKG
                    , PlanValue = d.PlanValue
                    , PlanVolume = d.PlanVolume
                    , Status = d.ShipmentPlanDStatus
                });
            });

            return res;
        }
    }
}
