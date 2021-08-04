using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanGetReportAPI
        : BaseAPIEngine<ShipmentPlanGetReportRequest, ShipmentPlanGetReportResponse>
    {
        protected override string PermissionKey
        {
            get { return "PRIVATE_API"; }
        }

        protected override void ExecuteChild(ShipmentPlanGetReportRequest dataRequest, ShipmentPlanGetReportResponse dataResponse)
        {
            this.ExecutePlan(dataRequest, dataResponse);
            this.ExecuteForecast(dataRequest, dataResponse);


        }

        private void ExecuteForecast(ShipmentPlanGetReportRequest dataRequest, ShipmentPlanGetReportResponse dataResponse)
        {
           /* var res = new List<ShipmentPlanGetReportResponse.TotalResult>();
            dataResponse.totalResults = res;

            var cost = ADO.ShipmentPlanADO.GetInstant()
                .PlanCostID_ListByYear(dataRequest.planYear, this.Logger)
                .Where(x => x.ID == dataRequest.costID)
                .FirstOrDefault();

            var sale = StaticValueManager.GetInstant().sxsEmployee.FirstOrDefault(x => x.ID == dataRequest.saleEmployeeID);
            var zoneCodes = StaticValueManager.GetInstant()
                .sxsZoneAccount.Where(x => dataRequest.zoneAccountIDs.Any(y => y == x.ID))
                .Select(x => x.Code).ToList();

            var forecasts = ADO.ShipmentPlanADO.GetInstant().ForecastActualCompare(1, 12, dataRequest.planYear, dataRequest.costID, sale == null ? null : sale.Code, zoneCodes, this.Logger);
            var target = ADO.ShipmentPlanADO.GetInstant().TragetValue(1, 12, dataRequest.planYear, dataRequest.planType, dataRequest.zoneAccountIDs, this.Logger);
            var targetComp = dataRequest.planTypeCompare == null || "N".Equals(dataRequest.planTypeCompare) ?
                new List<ShipmentPlanTragetValueCriteria>() :
                ADO.ShipmentPlanADO.GetInstant().TragetValue(1, 12, dataRequest.planYear, dataRequest.planTypeCompare, dataRequest.zoneAccountIDs, this.Logger);

            zoneCodes = forecasts.GroupBy(x => x.ZoneCode).Select(x => x.Key).ToList();
            foreach (var zc in zoneCodes)
            {

                var r = new ShipmentPlanGetReportResponse.TotalResult()
                {
                    zoneAccount = forecasts.Where(x => x.ZoneCode == zc).Select(x => new ShipmentPlanGetReportResponse.ZoneAccount()
                    {
                        code = x.ZoneCode,
                        description = x.ZoneDescription
                    }).FirstOrDefault(),
                    costDescription = cost.Description,
                    valueNow = forecasts
                            .Where(x => x.ZoneCode == zc && x.Month == dataRequest.planMonth && x.Year == dataRequest.planYear)
                            .GroupBy(x => x.ZoneCode)
                            .Select(x => new ShipmentPlanGetReportResponse.TotalResultValue()
                            {
                                actual = x.Sum(y => y.ActualValue),
                                forecast = x.Sum(y => y.ForecastValue),
                                target = 0,
                                balance = x.Sum(y => y.ForecastValue) - x.Sum(y => y.ActualValue)
                            }).First(),
                    valueJanToNow = forecasts
                            .Where(x => x.ZoneCode == zc && x.Month <= dataRequest.planMonth && x.Year == dataRequest.planYear)
                            .GroupBy(x => x.ZoneCode)
                            .Select(x => new ShipmentPlanGetReportResponse.TotalResultValue()
                            {
                                actual = x.Sum(y => y.ActualValue),
                                forecast = x.Sum(y => y.ForecastValue),
                                target = 0,
                                balance = x.Sum(y => y.ForecastValue) - x.Sum(y => y.ActualValue)
                            }).First(),
                    valueForcastYear = forecasts
                            .Where(x => x.ZoneCode == zc && x.Year == dataRequest.planYear)
                            .Sum(x => x.ForecastValue)
                };

                r.valueNow.target = target.Where(x => x.ZoneCode == zc && x.PlanMonth == dataRequest.planMonth).Sum(x => x.PlanValueTHB);
                r.valueNow.targetCompare = targetComp.Where(x => x.ZoneCode == zc && x.PlanMonth == dataRequest.planMonth).Sum(x => x.PlanValueTHB);

                r.valueJanToNow.target = target.Where(x => x.ZoneCode == zc && x.PlanMonth <= dataRequest.planMonth).Sum(x => x.PlanValueTHB);
                r.valueJanToNow.targetCompare = targetComp.Where(x => x.ZoneCode == zc && x.PlanMonth <= dataRequest.planMonth).Sum(x => x.PlanValueTHB);
                res.Add(r);
            }*/
        }
        private void ExecutePlan(ShipmentPlanGetReportRequest dataRequest, ShipmentPlanGetReportResponse dataResponse)
        {
            List<ShipmentPlanGetReportCriteria> report = ADO.ShipmentPlanADO.GetInstant().GetReport(
                dataRequest.planType,
                dataRequest.planMonth,
                dataRequest.planYear,
                dataRequest.saleEmployeeID ?? 0,
                dataRequest.zoneAccountIDs,
                dataRequest.regionalZoneIDs,
                dataRequest.weeks,
                this.Logger);
            List<ShipmentPlanGetReportCriteria> reportComp = null;
            if (!string.IsNullOrWhiteSpace(dataRequest.planTypeCompare) && !"N".Equals(dataRequest.planTypeCompare))
                reportComp = ADO.ShipmentPlanADO.GetInstant().GetReport(
                dataRequest.planTypeCompare,
                dataRequest.planMonth,
                dataRequest.planYear,
                dataRequest.saleEmployeeID ?? 0,
                dataRequest.zoneAccountIDs,
                dataRequest.regionalZoneIDs,
                dataRequest.weeks,
                this.Logger);


            if (reportComp == null)
            {
                report.ForEach(x => x.ReportStatus = "P");
                var planHs = this.ConvertPlanHs(report);
                dataResponse.planHs = planHs;
            }
            else
            {
                var resReport = this.GetReportCompare(report, reportComp);
                var planHs = this.ConvertPlanHs(resReport);
                dataResponse.planHs = planHs;
                //dataResponse.planHs = GetPlanHCompare(planHs, planHComps);
            }



        }

        private List<ShipmentPlanGetReportResponse.PlanH> ConvertPlanHs(List<ShipmentPlanGetReportCriteria> report)
        {
            var planHs = new List<ShipmentPlanGetReportResponse.PlanH>();
            foreach (var rep in report)
            {
                ShipmentPlanGetReportResponse.PlanH h = planHs.FirstOrDefault(x => x.id == rep.HID);
                if (h == null)
                {
                    h = new ShipmentPlanGetReportResponse.PlanH()
                    {
                        id = rep.HID,
                        containerCode = rep.Container_Code,
                        planDate = BaseValidate.GetDateString(rep.PlanDate),
                        planWeek = rep.PlanWeek,
                        refID = rep.HRefID,
                        revision = rep.Revision,
                        planDs = new List<ShipmentPlanGetReportResponse.PlanD>(),
                        PlanType = rep.PlanType,
                        country = null,
                        ciCodes = null,
                        piCodes = null,
                        currencyCodes = null,
                        customer = null,
                        deliverTypes = null,
                        paymentTerms = null,
                        planBalance = null,
                        port = null,
                        status = null,
                    };
                    planHs.Add(h);
                }

                ShipmentPlanGetReportResponse.PlanD d = new ShipmentPlanGetReportResponse.PlanD()
                {
                    id = rep.DID,
                    refID = rep.DRefID,
                    orefID = rep.ORefID,
                    admitDate = BaseValidate.GetDateString(rep.AdmitDate),
                    maxAdmitDate = BaseValidate.GetDateString(rep.MaxAdmitDate),
                    currencyCode = rep.Currency_Code,
                    paymentTerm = rep.BeforePaymentTerm_Code + "-" + rep.AfterPaymentTerm_Code,
                    planBalance = new ShipmentPlanGetReportResponse.PlanBalance()
                    {
                        bale = rep.PlanBale,
                        quantity = rep.PlanQuatity,
                        weight = rep.PlanWeightKG,
                        value = rep.PlanValue,
                        valueTHB = rep.PlanValueTHB
                    },
                    orderCode = rep.Order_Code,
                    deliverType = rep.DeliveryType_Code,
                    customer = new CodeDescModel()
                    {
                        code = rep.Customer_Code,
                        description = rep.Customer_Description
                    },
                    product = new CodeDescModel()
                    {
                        code = rep.Product_Code,
                        description = rep.Product_Description
                    },
                    country = new CodeDescModel()
                    {
                        code = rep.Country_Code,
                        description = rep.Country_Description
                    },
                    ciCode = rep.CI_Code,
                    piCode = rep.PI_Code,
                    port = new CodeDescModel()
                    {
                        code = rep.Port_Code,
                        description = rep.Port_Description
                    },
                    status = rep.ReportStatus
                };
                h.planDs.Add(d);

            }

            foreach (var h in planHs)
            {
                h.ciCodes = h.planDs.GroupBy(x => x.ciCode).Select(x => x.Key).ToList();
                h.piCodes = h.planDs.GroupBy(x => x.piCode).Select(x => x.Key).ToList();
                h.country = h.planDs.GroupBy(x => new { code = x.country.code, description = x.country.description })
                    .Select(x => new CodeDescModel() { code = x.Key.code, description = x.Key.description }).ToList();
                h.currencyCodes = h.planDs.GroupBy(x => x.currencyCode).Select(x => x.Key).ToList();
                h.deliverTypes = h.planDs.GroupBy(x => x.deliverType).Select(x => x.Key).ToList();
                h.paymentTerms = h.planDs.GroupBy(x => x.paymentTerm).Select(x => x.Key).ToList();
                h.status = h.planDs.TrueForAll(x => x.status == "S") ? "S" :
                    h.planDs.TrueForAll(x => x.status == "N") ? "N" :
                    h.planDs.Any(x => x.status == "R") ? "R" :
                    h.planDs.Any(x => x.status == "M") ? "M" : "P";
                h.planBalance = new ShipmentPlanGetReportResponse.PlanBalance()
                {
                    bale = h.planDs.Sum(x => x.planBalance.bale),
                    quantity = h.planDs.Sum(x => x.planBalance.quantity),
                    weight = h.planDs.Sum(x => x.planBalance.weight),
                    value = h.planDs.Sum(x => x.planBalance.value),
                    valueTHB = h.planDs.Sum(x => x.planBalance.valueTHB)
                };
                h.country = h.planDs
                    .GroupBy(x => new { code = x.country.code, description = x.country.description })
                    .Select(x => new CodeDescModel { code = x.Key.code, description = x.Key.description })
                    .ToList();
                h.customer = h.planDs
                    .GroupBy(x => new { code = x.customer.code, description = x.customer.description })
                    .Select(x => new CodeDescModel { code = x.Key.code, description = x.Key.description })
                    .ToList();
                h.port = h.planDs
                    .GroupBy(x => new { code = x.port.code, description = x.port.description })
                    .Select(x => new CodeDescModel { code = x.Key.code, description = x.Key.description })
                    .ToList();
                //if (dataRequest.planType == "M" || BaseValidate.GetDateTime(h.planDate).DayOfYear >= DateTime.Now.DayOfYear)
                //    h.status = "P";//PLANING

            }

            return planHs;
        }

        private List<ShipmentPlanGetReportCriteria> GetReportCompare(List<ShipmentPlanGetReportCriteria> report, List<ShipmentPlanGetReportCriteria> reportComp)
        {
            List<ShipmentPlanGetReportCriteria> res = new List<ShipmentPlanGetReportCriteria>();
            res.AddRange(report);

            foreach (var r in reportComp)
            {
                var rc = res.FirstOrDefault(x => x.ORefID == r.ORefID
                                        && string.IsNullOrEmpty(x.ReportStatus)
                                        && x.PlanDate.GetWeekOfMonth() == r.PlanDate.GetWeekOfMonth());
                if (rc != null)
                {
                    res[res.IndexOf(rc)] = r;
                    r.HID = rc.HID;
                    r.ReportStatus = "S";
                    continue;
                }
                rc = res.FirstOrDefault(x => x.ORefID == r.ORefID
                                        && string.IsNullOrEmpty(x.ReportStatus)
                                        && x.PlanDate.GetWeekOfMonth() != r.PlanDate.GetWeekOfMonth());
                if (rc != null)
                {
                    rc.ReportStatus = "R";
                    r.ReportStatus = "M";
                    res.Add(r);
                    continue;
                }

                r.ReportStatus = "N";
                res.Add(r);
            }

            res.FindAll(x => string.IsNullOrWhiteSpace(x.ReportStatus))
                .ForEach(x => {
                    if (x.PlanDate.DayOfYear <= DateTime.Now.DayOfYear)
                        x.ReportStatus = "R";
                    else
                        x.ReportStatus = "P";
                });

            return res;
        }

        private List<ShipmentPlanGetReportResponse.PlanH> GetPlanHCompare(List<ShipmentPlanGetReportResponse.PlanH> report, List<ShipmentPlanGetReportResponse.PlanH> reportComp)
        {
            List<ShipmentPlanGetReportResponse.PlanH> res = new List<ShipmentPlanGetReportResponse.PlanH>();
            res.AddRange(report);
            foreach (ShipmentPlanGetReportResponse.PlanH h in reportComp)
            {
                foreach (ShipmentPlanGetReportResponse.PlanD d in h.planDs)
                {

                }
            }

            /*    
                planHs
                    .Where(x => x.PlanType == "W" && planHs.Any(y => y.PlanType == "M" && y.refID == x.refID && y.planWeek == y.planWeek))
                    .ToList().ForEach(x => x.status = "S");//SUCCESS
                planHs
                    .Where(x => x.PlanType == "W" && planHs.Any(y => y.PlanType == "M" && y.refID == x.refID && y.planWeek != y.planWeek))
                    .ToList().ForEach(x => x.status = "M");//SHIFT
                planHs
                    .Where(x => x.PlanType == "W" && !planHs.Any(y => y.PlanType == "M" && y.refID == x.refID))
                    .ToList().ForEach(x => x.status = "N");//NEW
                planHs
                    .Where(x => x.PlanType == "M" &&
                        (!planHs.Any(y => y.PlanType == "W" && y.refID == x.refID) ||
                        planHs.Any(y => y.PlanType == "W" && y.refID == x.refID && y.planWeek != y.planWeek)))
                    .ToList().ForEach(x => x.status = "R");//REMOVE
                planHs.RemoveAll(x => x.PlanType == "M" && x.status == null);//DELETE
            */
            return res;
        }
    }
}
