using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Constant.ConstEnum;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanAutoPlanAPI :
        BaseAPIEngine<ShipmentPlanAutoPlanRequest, ShipmentPlanAutoPlanResponse>
    {
        protected override string PermissionKey
        {
            get { return "SALES_API"; }
        }

        protected override void ExecuteChild(ShipmentPlanAutoPlanRequest dataRequest, ShipmentPlanAutoPlanResponse dataResponse)
        {
            //ShipmentPlanSearchOutstandingAutoAPI execOutstanding = new ShipmentPlanSearchOutstandingAutoAPI();
            //var shipmentPlans = ADO.ShipmentPlanADO.GetInstant().ListCustomerPlan(dataRequest.planMonth, dataRequest.planYear,
            //    new List<int>(), new List<int>(), dataRequest.customerIDs, new List<string>(), new List<string>(), new List<string>(), this.Logger);
            var shipmentPlans = ShipmentPlanADO.GetInstant().SearchPlan(new ShipmentPlanMainGetPlanForApproveReq() { planMonth = dataRequest.planMonth, planYear = dataRequest.planYear, customerIDs = dataRequest.customerIDs }, this.Logger);

            if (shipmentPlans.Any(x => x.ShipmentPlanMain_ID != 0))
            {
                var customers = StaticValueManager.GetInstant().sxsCustomers;
                string msg = string.Format( "ลูกค้ารหัส {0} ได้สร้างแผนในระบบแล้ว",
                    string.Join(",", shipmentPlans.Select(x => customers.Where(y => y.ID == x.customerID).Select(y => y.Code).ToList())));
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, msg);
            }

            List<sxtShipmentPlanMain> planMainInits = new List<sxtShipmentPlanMain>();
            dataResponse.shipmentPlanMain = new List<ShipmentPlanAutoPlanResponse.ShipmentPlanMain>();
            foreach (int cusID in dataRequest.customerIDs)
            {
                var planMainInit = ShipmentPlanMainADO.GetInstant()
                    .InsertMonthlyInit(cusID, dataRequest.planMonth, dataRequest.planYear, this.employeeID, this.Logger);
                planMainInit = ShipmentPlanMainADO.GetInstant()
                    .UpdateStatus(new List<int> { planMainInit.ID }, ENShipmentPlanMonthlyStatus.AUTO_PROCESSING, this.employeeID, this.Logger)
                    .FirstOrDefault();
                planMainInits.Add(planMainInit);
                dataResponse.shipmentPlanMain.Add(new ShipmentPlanAutoPlanResponse.ShipmentPlanMain()
                {
                    code = planMainInit.Code,
                    id = planMainInit.ID,
                    customerID = planMainInit.Customer_ID,
                    planMonth = planMainInit.PlanMonth,
                    planYear = planMainInit.PlanYear,
                    planType = planMainInit.PlanType,
                    //revision = planMainInit.Revision,
                    status = planMainInit.Status,
                    create = BaseValidate.GetByDateTime(planMainInit.CreateBy, planMainInit.CreateDate)
                });
            }

            RunAutoPlanProcess run = new RunAutoPlanProcess(planMainInits, dataRequest, Logger, token, employeeID);
            Thread thread = new Thread(run.Run);
            thread.Start();
            //run.Run();
        }
    }

    class RunAutoPlanProcess
    {

        List<sxtShipmentPlanMain> planMainInits { get; set; }
        ShipmentPlanAutoPlanRequest dataRequest { get; set; }
        Logger Logger { get; set; }
        string token { get; set; }
        int employeeID { get; set; }

        bool merge = false;

        List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand> oustandingMerge { get; set; }
        List<int> shippingDayMerge { get; set; }


        public RunAutoPlanProcess(List<sxtShipmentPlanMain> planMainInits, ShipmentPlanAutoPlanRequest dataRequest, Logger Logger, string token, int employeeID)
        {
            this.Logger = Logger;
            this.token = token;
            this.planMainInits = planMainInits;
            this.dataRequest = dataRequest;
            this.merge = dataRequest.merge;
            if (this.merge == true)
            {
                oustandingMerge = new List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand>();
                shippingDayMerge = new List<int>();
            }
        }

        public RunAutoPlanProcess(Logger Logger, string token)
        {
            this.Logger = Logger;
            this.token = token;
        }

        public void Run()
        {
            foreach (var pm in planMainInits)
            {
                this.AutoPlanProcess(pm, dataRequest.limitContainerPerWeeks, dataRequest.containerCodeOfWeek, dataRequest.containerVolumeOfWeek);
            }
        }


        private void AutoPlanProcess(sxtShipmentPlanMain planMainInit, List<int> limitConOfWeek, List<string> containerCodeOfWeek, List<decimal> containerVolumeOfWeek)
        {
            try
            {
                int planMonth = planMainInit.PlanMonth;
                int planYear = planMainInit.PlanYear;
                int customerID = planMainInit.Customer_ID;


                var customer = StaticValueManager.GetInstant().sxsCustomers.FirstOrDefault(x => x.ID == customerID);
                if (customer == null)
                    throw new KKFException(this.Logger, KKFExceptionCode.V0001, "CustomerID");

                var execOutstanding = new ShipmentPlanSearchOutstandingAutoAPI();
                var outstandingRes = execOutstanding.ExecuteResponse(this.token, new ShipmentPlanSearchOutstandingRequest()
                {
                    planMonth = planMonth,
                    planYear = planYear,
                    customerCodes = new List<string> { customer.Code }
                    ,
                    option = this.dataRequest.option
                }, this.Logger);


                ShipmentPlanSavePlanRequest saveReq = new ShipmentPlanSavePlanRequest();
                saveReq.shipmentPlanMain = new ShipmentPlanSavePlanRequest.ShipmentPlanMain();
                saveReq.shipmentPlanMain.id = planMainInit.ID;
                saveReq.shipmentPlanMain.planType = "M";
                saveReq.shipmentPlanMain.planMonth = planMonth;
                saveReq.shipmentPlanMain.planYear = planYear;

                saveReq.shipmentPlanMain.shipmentPlanOrderStands = this.GetOutstandingAuto(planMonth, planYear, customer.Code, outstandingRes.outstandings, planMainInit.ID);

                saveReq.shipmentPlanMain.shipmentPlanOrderStands = saveReq.shipmentPlanMain.shipmentPlanOrderStands.OrderBy(x => BaseValidate.GetDate(x.admitDate)).ThenBy(x => BaseValidate.GetDate(x.maxAdmitDate)).ThenBy(x => x.orderCode).ToList();

                var planDateCircle = ADO.ShipmentPlanDateCircleADO.GetInstant().GetByCustomerID(planMainInit.Customer_ID).FirstOrDefault();

                if (planDateCircle == null) throw new KKFException(this.Logger, KKFExceptionCode.V0002, "Setup รอบส่งออกลูกค้ารหัส " + customer.Code);


                if (this.merge == true)
                {
                    saveReq.shipmentPlanMain.shipmentPlanOrderStands.ForEach(o => oustandingMerge.Add(o));
                    shippingDayMerge.Add(planDateCircle.ShippingDay);
                    saveReq.shipmentPlanMain.shipmentPlanHs = new List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH>();

                    if (this.planMainInits.Last().ID == saveReq.shipmentPlanMain.id)
                    {
                        // Auto Plan
                        saveReq.shipmentPlanMain.shipmentPlanHs = this.GetPlanAuto(oustandingMerge, planMainInit, limitConOfWeek, containerCodeOfWeek, shippingDayMerge.Min(x => x), containerVolumeOfWeek, dataRequest.containerCalcTypeOfWeek);
                    }
                }
                else
                {
                    // Auto Plan
                    saveReq.shipmentPlanMain.shipmentPlanHs = this.GetPlanAuto(saveReq.shipmentPlanMain.shipmentPlanOrderStands, planMainInit, limitConOfWeek, containerCodeOfWeek, planDateCircle.ShippingDay, containerVolumeOfWeek, dataRequest.containerCalcTypeOfWeek);
                }

                // Save Plan 
                ShipmentPlanMainSavePlanAPI excSave = new ShipmentPlanMainSavePlanAPI();
                var saveRes = excSave.ExecuteResponse(token, saveReq);

                if (this.merge == true)
                {
                    if (this.planMainInits.Last().ID == saveReq.shipmentPlanMain.id)
                    {
                        ADO.ShipmentPlanMainADO.GetInstant().UpdateStatus(this.planMainInits.Select(x => x.ID).ToList(), ENShipmentPlanMonthlyStatus.APPROVED, this.employeeID, this.Logger).FirstOrDefault();
                    }
                }
                else
                {
                    ADO.ShipmentPlanMainADO.GetInstant().UpdateStatus(new List<int> { planMainInit.ID }, ENShipmentPlanMonthlyStatus.APPROVED, this.employeeID, this.Logger).FirstOrDefault();
                }

            }
            catch (Exception ex)
            {
                this.Logger.LogError(ex.Message);
                if (this.merge == true)
                {
                    ShipmentPlanMainADO.GetInstant().UpdateStatus(this.planMainInits.Select(x => x.ID).ToList(), ENShipmentPlanMonthlyStatus.REMOVE, this.employeeID, this.Logger);
                }
                else
                {
                    ShipmentPlanMainADO.GetInstant().UpdateStatus(new List<int> { planMainInit.ID }, ENShipmentPlanMonthlyStatus.REMOVE, this.employeeID, this.Logger);
                }
            }
            finally
            {
            }
        }


        private List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand> GetOutstandingAuto(int planMonth, int planYear, string customerCode, List<ShipmentPlanSearchOutstandingResponse.Outstandigns> outstandings, int mainID)
        {
            var sxsGrade = StaticValueManager.GetInstant().sxsProductGrades;
            var res = new List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand>();
            foreach (var o in outstandings)
            {
                ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand r = new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand()
                {
                    id = o.id,
                    mainID = mainID,
                    admitDate = o.admitDate,
                    maxAdmitDate = o.maxAdmitDate,
                    branch = o.branch,
                    contianerCode = o.contianerCode,
                    contianerSizeKG = o.contianerSizeKG,
                    itemno = o.itemno,
                    orderCode = o.orderCode,
                    piCode = o.piCode,
                    deliveryType = o.deliveryType,
                    deliveryDescription = o.deliveryDescription,
                    percentClose = o.percentClose,
                    saleUnitCode = o.saleUnitCode,
                    marketCloseFlag = o.marketCloseFlag,
                    orderCloseFlag = o.orderCloseFlag,
                    afterPaymentTermCode = o.afterPaymentTermCode,
                    beforePaymentTermCode = o.beforePaymentTermCode,
                    favoriteFlag = o.favoriteFlag,
                    status = "A",
                    //shipmentPlanD = new List<ShipmentPlanGetPlanResponse.ShipmentPlanMain.ShipmentPlanOrderStand.ShipmentPlanD>(),
                    product = new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand.Product()
                    {
                        code = o.product.code,
                        description = o.product.description,
                        brand = o.product.brand,
                        gradeCode = o.product.gradeCode,
                        gradeDescription = sxsGrade.Where(x => x.Code == o.product.gradeCode.Trim()).Select(x => x.Description).FirstOrDefault()
                    },
                    currency = new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand.Currency()
                    {
                        code = o.currency.code,
                        cpb = o.currency.cpb
                    },
                    valuePerUnit = new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand.ValuePerUnit()
                    {
                        cpb = o.valuePerUnit.cpb,
                        qpb = o.valuePerUnit.qpb,
                        qpv = o.valuePerUnit.qpv,
                        qpw = o.valuePerUnit.qpw,
                        bpl = o.valuePerUnit.bpl
                    },
                    customer = new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand.Customer()
                    {
                        id = o.customer.id,
                        code = o.customer.code,
                        description = o.customer.description,
                        portCode = o.customer.portCode,
                        portDescriotion = o.customer.portDescriotion
                    },
                    comparisonPercent = new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand.ComparisonPercent()
                    {
                        inventory = o.comparisonPercent.inventory,
                        notYetDelivered = o.comparisonPercent.notYetDelivered,
                        notYetFinished = o.comparisonPercent.notYetFinished
                    },
                    delivered = o.delivered,
                    inventory = o.inventory,
                    outstandingBalance = o.outstandingBalance,
                    proformaBalance = o.proformaBalance,
                    toBeShipped = o.toBeShipped,
                    otherPick = o.otherPick,
                    paymentTerm = o.paymentTerm,
                    closeByCI = o.closeByCI,
                    urgentFlag = o.urgentFlag
                };

                res.Add(r);
            }
            return res;
        }

        public List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH> GetPlanAuto(List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand> orderstands, sxtShipmentPlanMain planMainInit, List<int> limitConOfWeek, List<string> containerCodeOfWeek, int shippingDay, List<decimal> containerVolumeOfWeek, List<string> containerCalcTypeOfWeek)
        {
            var planHs = new List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH>();
            var containerSizes = ADO.ShipmentPlanADO.GetInstant().ListContainerSize(this.Logger);

            string ENSLOT = ENShipmentPlanDeliveryType.LOT.GetValueString();
            string ENSCOMPILE = ENShipmentPlanDeliveryType.COMPILE.GetValueString();

            orderstands
                .Where(x => ("Y".Equals(x.favoriteFlag) || x.urgentFlag) && x.deliveryType == ENSLOT)
                //.OrderBy(x => BaseValidate.GetDate(x.maxAdmitDate)).ThenBy(x => x.orderCode)
                .ToList()
                .ForEach(x => pushToPlan(x));
            orderstands
                .Where(x => !"Y".Equals(x.favoriteFlag) && !x.urgentFlag && x.deliveryType == ENSLOT)
                //.OrderBy(x => BaseValidate.GetDate(x.maxAdmitDate)).ThenBy(x => x.orderCode)
                .ToList()
                .ForEach(x => pushToPlan(x));

            orderstands
                .Where(x => ("Y".Equals(x.favoriteFlag) || x.urgentFlag) && x.deliveryType == ENSCOMPILE)
                //.OrderBy(x => BaseValidate.GetDate(x.admitDate)).ThenBy(x => x.orderCode)
                .ToList()
                .ForEach(x => pushToPlan(x));
            orderstands
                .Where(x => !"Y".Equals(x.favoriteFlag) && !x.urgentFlag && x.deliveryType == ENSCOMPILE)
                //.OrderBy(x => BaseValidate.GetDate(x.admitDate)).ThenBy(x => x.orderCode)
                .ToList()
                .ForEach(x => pushToPlan(x));

            planHs.RemoveAll(x => x.planWeek == -1);

            void pushToPlan(ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand order)
            {
                //var planHIndex = planHs.FirstOrDefault(x=>x.containerSizeKg < x.shipmentPlanDs.Sum(y=>y.planBalance.weight))
                var toBeBale = order.toBeShipped.bale;
                var admitDate = order.deliveryType == ENSLOT ? BaseValidate.GetDate(order.maxAdmitDate) : BaseValidate.GetDate(order.admitDate);
                BalanceModel addSize = null;

                foreach (var planH in planHs.Where(x => x.planWeek != -1 && admitDate.Ticks <= BaseValidate.GetDate(x.planDate).Ticks))//.Where(x => admitDate.Ticks <= BaseValidate.GetDate(x.planDate).Ticks))
                {
                    if (order.deliveryType == ENSLOT)
                    {
                        var os = orderstands.Where(x => planH.shipmentPlanDs.Any(y => y.shipmentPlanOrderStandID == x.id));
                        if (!os.Any(x => x.piCode == order.piCode)) continue;
                    }
                    else
                    {
                        var os = orderstands.Where(x => planH.shipmentPlanDs.Any(y => y.shipmentPlanOrderStandID == x.id));
                        if (os.Any(x => x.deliveryType == ENSLOT)) continue;
                    }

                    var conSize = containerSizes.FirstOrDefault(x => x.Code == planH.containerCode);
                    conSize = conSize ?? containerSizes.FirstOrDefault(x => x.Code == "F20");
                    conSize.Volume = planH.containerSizeVolume;
                    conSize.MaxWeightKg = planH.containerSizeWeight;

                    var sumSize = planH.shipmentPlanDs.Select(x => x.planBalance).ToList();
                    decimal addBale = toBeBale;
                    for (; addBale >= 1; addBale --)
                    {
                        var d = (addBale / order.toBeShipped.bale);
                        addSize = new BalanceModel()
                        {
                            bale = addBale,
                            quantity = order.toBeShipped.quantity * d,
                            weight = order.toBeShipped.weight * d,
                            volume = order.toBeShipped.volume * d,
                            value = order.toBeShipped.value * d
                        };
                        if (checkSpaceContainer(conSize.MaxWeightKg, conSize.Volume, sumSize, addSize, planH, conSize.VolumePercentAdmit))
                        {
                            //สามารถใส่ PlanD ลงไปใน PlanH ที่มีอยู่ได้
                            var newPlanD = new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH.ShipmentPlanD()
                            {
                                shipmentPlanOrderStandID = order.id,
                                customer = new INTIdCodeDescriptionModel()
                                {
                                    id = order.customer.id
                                },
                                planBalance = addSize,
                                status = "A"
                            };
                            planH.shipmentPlanDs.Add(newPlanD);

                            planH.planWeek = -1;
                            var estDate = GetEstimate2(shippingDay, admitDate, new DateTime(planMainInit.PlanYear, planMainInit.PlanMonth, 1).AddMonths(1).AddDays(-1), planHs, limitConOfWeek);
                            if (estDate.HasValue)
                            {
                                planH.planWeek = estDate.Value.GetWeekOfMonth();
                                planH.planDate = estDate.GetDateString();
                            }
                            else
                            {
                                planH.planWeek = DateTimeUtil.GetDate(planH.planDate).Value.GetWeekOfMonth();
                                planH.shipmentPlanDs.Remove(newPlanD);
                            }
                            break;
                        }
                    }
                    toBeBale -= addBale;
                    if (toBeBale <= 0) break;
                }

                // first Add & bale to next shipment
                if (toBeBale > 0)
                {
                    if (addSize == null) addSize = order.toBeShipped;
                    else
                    {
                        var d = (toBeBale / order.toBeShipped.bale);
                        addSize = new BalanceModel()
                        {
                            bale = toBeBale,
                            quantity = order.toBeShipped.quantity * d,
                            weight = order.toBeShipped.weight * d,
                            volume = order.toBeShipped.volume * d,
                            value = order.toBeShipped.value * d
                        };
                    }
                    var estDate = GetEstimate2(shippingDay, admitDate, new DateTime(planMainInit.PlanYear, planMainInit.PlanMonth, 1).AddMonths(1).AddDays(-1), planHs, limitConOfWeek);
                    if (estDate.HasValue)
                    {
                        var conCode = containerCodeOfWeek[estDate.Value.GetWeekOfMonth() - 1];
                        decimal conVolume = containerVolumeOfWeek[estDate.Value.GetWeekOfMonth() - 1];
                        string calcType = containerCalcTypeOfWeek[estDate.Value.GetWeekOfMonth() - 1];

                        conCode = !string.IsNullOrWhiteSpace(conCode) ? conCode : !string.IsNullOrWhiteSpace(order.contianerCode) ? order.contianerCode : containerSizes.First().Code;

                        var tmpCon = containerSizes.Where(z => z.Code == conCode).FirstOrDefault();

                        conVolume = conVolume == 0 ? tmpCon.Volume : conVolume;

                        var chkAdj = !containerSizes.Any(z => z.Code == conCode && z.Volume == conVolume);

                        decimal conWeight = (tmpCon.MaxWeightKg * conVolume) / tmpCon.Volume;

                        var planH = new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH()
                        {
                            id = null,
                            containerCode = conCode,
                            planDate = estDate.GetDateString(),
                            planWeek = estDate.Value.GetWeekOfMonth(),
                            shipmentPlanDs = new List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH.ShipmentPlanD>(),
                            status = "P" /* org status = "A" SoMRuk */,
                            //remark = new INTIdCodeDescriptionModel() { id = null, code = null, description = null }
                            containerSizeVolume = conVolume
                            , containerSizeWeight = conWeight
                            , calculateType = string.IsNullOrWhiteSpace(calcType) ? "V" : calcType
                        };
                        if (chkAdj)
                        {
                            planH.volumeAdj = conVolume;
                            planH.weightAdj = conWeight;
                        }
                        planH.shipmentPlanDs.Add(new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH.ShipmentPlanD()
                        {
                            shipmentPlanOrderStandID = order.id,
                            //shipmentPlanMainID = order.mainID,
                            customer = new INTIdCodeDescriptionModel()
                            {
                                id = order.customer.id
                            },
                            planBalance = addSize,
                            status = "A"
                        });
                        planHs.Add(planH);
                    }
                }
            }

            bool checkSpaceContainer(decimal conSizeKg, decimal conSizeVolume, List<BalanceModel> sumSize, BalanceModel addSize, ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH planH, decimal volumePercentAdmit)
            {
                decimal sumVol = 0;
                decimal sumKg = 0;
                bool checkByVolume = true;
                List<BalanceModel> tmp = new List<BalanceModel>();
                tmp.AddRange(sumSize);
                tmp.Add(addSize);
                tmp.ForEach(x => { if (x.volume <= 0) checkByVolume = false; sumVol += x.volume; sumKg += x.weight; });

                if (checkByVolume)
                {
                    if (planH.calculateType == "W") { checkByVolume = false; }
                    else { planH.calculateType = "V"; }
                }
                else { planH.calculateType = "W"; }

                if (!checkByVolume && ((sumKg / conSizeKg) > 1.0m || sumVol > conSizeVolume))
                    return false;
                else if (checkByVolume && ((sumVol / conSizeVolume) > 1.0m || ((sumVol / conSizeVolume) * 100) > (100m - volumePercentAdmit)))
                    return false;
                return true;
            }

            return planHs;
        }

        private DateTime? GetEstimate2(int dayOfWeek, DateTime admitDate, DateTime planMaxYM, List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH> planHs, List<int> limitContainerOfWeek)
        {
            var minDate = new DateTime(planMaxYM.Year, planMaxYM.Month, 1);
            var esd = admitDate.Ticks < minDate.Ticks ? minDate : admitDate;
            while (true)
            {
                if (esd.Ticks > planMaxYM.Ticks) return null;

                if (dayOfWeek == esd.DayOfWeek.GetValueInt())
                {
                    int week = esd.GetWeekOfMonth();

                    if (planHs.Where(x => x.planWeek == week).Count() < limitContainerOfWeek[week - 1])
                        return esd;
                }
                esd = esd.AddDays(1);
            }
        }

        public List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH> GetPlanAuto2(List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand> orderstands, sxtShipmentPlanMain planMainInit, List<int> limitConOfWeek, List<string> containerCodeOfWeek, int shippingDay, List<decimal> containerVolumeOfWeek, List<string> containerCalcTypeOfWeek)
        {
            var planHs = new List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH>();
            var containerSizes = ADO.ShipmentPlanADO.GetInstant().ListContainerSize(this.Logger);
            var weeks = BaseValidate.GetWeeks(planMainInit.PlanYear, planMainInit.PlanMonth);

            string ENSLOT = ENShipmentPlanDeliveryType.LOT.GetValueString();
            string ENSCOMPILE = ENShipmentPlanDeliveryType.COMPILE.GetValueString();

            orderstands
                .Where(x => "Y".Equals(x.favoriteFlag) && x.deliveryType == ENSLOT)
                .OrderBy(x => BaseValidate.GetDate(x.maxAdmitDate)).ThenBy(x => x.orderCode)
                .ToList()
                .ForEach(x => pushToPlan(x));
            orderstands
                .Where(x => !"Y".Equals(x.favoriteFlag) && x.deliveryType == ENSLOT)
                .OrderBy(x => BaseValidate.GetDate(x.maxAdmitDate)).ThenBy(x => x.orderCode)
                .ToList()
                .ForEach(x => pushToPlan(x));

            orderstands
                .Where(x => "Y".Equals(x.favoriteFlag) && x.deliveryType == ENSCOMPILE)
                .OrderBy(x => BaseValidate.GetDate(x.admitDate)).ThenBy(x => x.orderCode)
                .ToList()
                .ForEach(x => pushToPlan(x));
            orderstands
                .Where(x => !"Y".Equals(x.favoriteFlag) && x.deliveryType == ENSCOMPILE)
                .OrderBy(x => BaseValidate.GetDate(x.admitDate)).ThenBy(x => x.orderCode)
                .ToList()
                .ForEach(x => pushToPlan(x));

            void pushToPlan(ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand order)
            {
                BalanceModel addSize = null;
                var admitDate = order.deliveryType == ENSLOT ? BaseValidate.GetDate(order.maxAdmitDate) : BaseValidate.GetDate(order.admitDate);
                var toBeBale = order.toBeShipped.bale;

                foreach (var planH in planHs.Where(x => admitDate.Ticks <= BaseValidate.GetDate(x.planDate).Ticks))
                {
                    if (order.deliveryType == ENSLOT)
                    {
                        var os = orderstands.Where(x => planH.shipmentPlanDs.Any(y => y.shipmentPlanOrderStandID == x.id));
                        if (!os.Any(x => x.piCode == order.piCode)) continue;
                    }
                    else
                    {
                        var os = orderstands.Where(x => planH.shipmentPlanDs.Any(y => y.shipmentPlanOrderStandID == x.id));
                        if (os.Any(x => x.deliveryType == ENSLOT)) continue;
                    }

                    var conSize = containerSizes.FirstOrDefault(x => x.Code == planH.containerCode);
                    conSize = conSize ?? containerSizes.FirstOrDefault(x => x.Code == "F20");
                    conSize.Volume = planH.containerSizeVolume;
                    conSize.MaxWeightKg = planH.containerSizeWeight;

                    var sumSize = planH.shipmentPlanDs.Select(x => x.planBalance).ToList();
                    decimal addBale = toBeBale;
                    for (; addBale >= 1; addBale -= 1)
                    {
                        var d = (addBale / order.toBeShipped.bale);
                        addSize = new BalanceModel()
                        {
                            bale = addBale,
                            quantity = order.toBeShipped.quantity * d,
                            weight = order.toBeShipped.weight * d,
                            volume = order.toBeShipped.volume * d,
                            value = order.toBeShipped.value * d
                        };
                        if (checkSpaceContainer(conSize.MaxWeightKg, conSize.Volume, sumSize, addSize, planH))
                        {
                            //สามารถใส่ PlanD ลงไปใน PlanH ที่มีอยู่ได้
                            var newPlanD = new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH.ShipmentPlanD()
                            {
                                shipmentPlanOrderStandID = order.id,
                                //shipmentPlanMainID = order.mainID,
                                customer = new INTIdCodeDescriptionModel()
                                {
                                    id = order.customer.id
                                },
                                planBalance = addSize,
                                status = "A"
                            };
                            planH.shipmentPlanDs.Add(newPlanD);

                            planH.planWeek = -1;
                            var estDate = GetEstimate2(shippingDay, admitDate, new DateTime(planMainInit.PlanYear, planMainInit.PlanMonth, 1).AddMonths(1).AddDays(-1), planHs, limitConOfWeek);
                            if (estDate.HasValue)
                            {
                                planH.planWeek = estDate.Value.GetWeekOfMonth();
                                planH.planDate = estDate.GetDateString();
                            }
                            else
                            {
                                planH.planWeek = DateTimeUtil.GetDate(planH.planDate).Value.GetWeekOfMonth();
                                planH.shipmentPlanDs.Remove(newPlanD);
                            }
                            break;
                        }
                    }
                    toBeBale -= addBale;
                    if (toBeBale <= 0) break;
                }

                // first Add & bale to next shipment
                if (toBeBale > 0)
                {
                    if (addSize == null) addSize = order.toBeShipped;
                    else
                    {
                        var d = order.toBeShipped.bale <= 0 ? 0 : (toBeBale / order.toBeShipped.bale);
                        addSize = new BalanceModel()
                        {
                            bale = toBeBale,
                            quantity = order.toBeShipped.quantity * d,
                            weight = order.toBeShipped.weight * d,
                            volume = order.toBeShipped.volume * d,
                            value = order.toBeShipped.value * d
                        };
                    }
                    var estDate = GetEstimate(admitDate);
                    if (estDate.HasValue)
                    {
                        var conCode = containerCodeOfWeek[estDate.Value.GetWeekOfMonth() - 1];
                        decimal conVolume = containerVolumeOfWeek[estDate.Value.GetWeekOfMonth() - 1];
                        string calcType = containerCalcTypeOfWeek[estDate.Value.GetWeekOfMonth() - 1];

                        conCode = !string.IsNullOrWhiteSpace(conCode) ? conCode : !string.IsNullOrWhiteSpace(order.contianerCode) ? order.contianerCode : containerSizes.First().Code;

                        var tmpCon = containerSizes.Where(z => z.Code == conCode).FirstOrDefault();

                        conVolume = conVolume == 0 ? tmpCon.Volume : conVolume;

                        var chkAdj = !containerSizes.Any(z => z.Code == conCode && z.Volume == conVolume);

                        decimal conWeight = (tmpCon.MaxWeightKg * conVolume) / tmpCon.Volume;

                        var planH = new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH()
                        {
                            id = null,
                            containerCode = conCode,
                            planDate = estDate.GetDateString(),
                            planWeek = estDate.Value.GetWeekOfMonth(),
                            shipmentPlanDs = new List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH.ShipmentPlanD>(),
                            status = "P" /* org status = "A" SoMRuk */,
                            //remark = new INTIdCodeDescriptionModel() { id = null, code = null, description = null }
                            containerSizeVolume = conVolume
                            ,
                            containerSizeWeight = conWeight
                            ,
                            calculateType = string.IsNullOrWhiteSpace(calcType) ? "V" : calcType
                        };
                        if (chkAdj)
                        {
                            planH.volumeAdj = conVolume;
                            planH.weightAdj = conWeight;
                        }
                        planH.shipmentPlanDs.Add(new ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH.ShipmentPlanD()
                        {
                            shipmentPlanOrderStandID = order.id,
                            //shipmentPlanMainID = order.mainID,
                            customer = new INTIdCodeDescriptionModel()
                            {
                                id = order.customer.id
                            },

                            planBalance = addSize,
                            status = "A"
                        });
                        planHs.Add(planH);
                    }
                }
            }

            DateTime? GetEstimate(DateTime admitDate)
            {
                var week = weeks.Where(x => x.startDate <= admitDate && x.endDate >= admitDate).FirstOrDefault();
                DateTime esd = week != null ? week.startDate : weeks.First().startDate;
                DateTime endDate = weeks.Last().endDate;
                while (true)
                {
                    if (esd < endDate) return null;
                    if(shippingDay == (int)esd.DayOfWeek)
                    {
                        int weekNo = weeks.Where(x => x.startDate <= esd && x.endDate >= esd).Select(x => x.weekNo).FirstOrDefault();
                        if (planHs.Where(x => x.planWeek == weekNo).Count() < limitConOfWeek[weekNo - 1])
                            return esd;
                    }
                    esd = esd.AddDays(1);
                }
            }

            bool checkSpaceContainer(decimal conSizeKg, decimal conSizeVolume, List<BalanceModel> sumSize, BalanceModel addSize, ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH planH)
            {
                decimal sumVol = 0;
                decimal sumKg = 0;
                bool checkByVolume = true;
                List<BalanceModel> tmp = new List<BalanceModel>();
                tmp.AddRange(sumSize);
                tmp.Add(addSize);
                tmp.ForEach(x => { if (x.volume <= 0) checkByVolume = false; sumVol += x.volume; sumKg += x.weight; });

                if (checkByVolume)
                {
                    if (planH.calculateType == "W") { checkByVolume = false; }
                    else { planH.calculateType = "V"; }
                }
                else { planH.calculateType = "W"; }

                if (!checkByVolume && (sumKg / conSizeKg) > 1.0m)
                    return false;
                else if (checkByVolume && (sumVol / conSizeVolume) > 1.0m)
                    return false;
                return true;
            }

            return planHs;
        }
    }
}
