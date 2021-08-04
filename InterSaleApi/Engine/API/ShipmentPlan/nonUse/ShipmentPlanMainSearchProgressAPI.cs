using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Constant.ConstEnum;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanMainSearchProgressAPI : BaseAPIEngine<ShipmentPlanMainSearchProgressRequest, ShipmentPlanMainSearchProgressResponse>
    {
        protected override string PermissionKey
        {
            get { return "PUBLIC_API"; }
        }

        protected override void ExecuteChild(ShipmentPlanMainSearchProgressRequest dataRequest, ShipmentPlanMainSearchProgressResponse dataResponse)
        {
            var listCusPlan = ADO.ShipmentPlanADO.GetInstant().ListCustomerPlan(
                dataRequest.planMonth,
                dataRequest.planYear,
                dataRequest.saleEmployeeIDs,
                dataRequest.zoneAccountIDs, 
                dataRequest.customerIDs,
                dataRequest.monthlyStatus,
                dataRequest.weeklyStatus,
                dataRequest.regzoneCodes,
                this.Logger);


            dataResponse.customers = new List<ShipmentPlanMainSearchProgressResponse.Customer>();
            foreach (var lcp in listCusPlan.OrderByDescending(x => x.FavoriteFlag).ThenBy(x=>x.CustomerCode))
            {
                var v = this.ConvertToSPSPRCustomer(lcp);
                if (v.shipmentPlanMain != null)
                {
                    var tmp = GetH(v.id??0, dataRequest.planYear, dataRequest.planMonth);
                    v.shipmentPlanMain.monthlyID = tmp.monthlyID;
                    v.shipmentPlanMain.weeklyID = tmp.weeklyID;
                    v.shipmentPlanMain.monthlyAmount = tmp.amount;
                    v.shipmentPlanMain.monthlyApprove = tmp.approve;
                    v.shipmentPlanMain.weeklyAmount = tmp.weeklyAmount;
                    v.shipmentPlanMain.waitApprove = tmp.waitApprove;
                    if(v.shipmentPlanMain.monthlyAmount == 0)
                    {
                        v.shipmentPlanMain.progress.alertMessage.Add("No shipment plan available.");
                    }
                }
                dataResponse.customers.Add(v);

            }

        }

        private dynamic GetH(int customerID, int planYear, int planMonth)
        {
            var monthly = ShipmentPlanHADO.GetInstant().GetByCustomer(customerID, planYear, planMonth, "M", this.Logger);
            string waitApprove = "N";
            for( int i = 0; i < monthly.Count; i++)
            {
                if (monthly[i].Status != ENShipmentStatus.NOT_APPROVED.GetValueString() && monthly[i].Status != ENShipmentStatus.WORK_IN_PROGRESS.GetValueString())
                {
                    waitApprove = "Y";
                    break;
                }
            }
            int amount = monthly.Count();
            int approve = monthly.Where(x => x.Status == ENShipmentStatus.APPROVED.GetValueString()).Count();
            var weekly = ShipmentPlanHADO.GetInstant().GetByCustomer(customerID, planYear, planMonth, "W", this.Logger);
            int weeklyAmount = weekly.Count();
            return new {
                amount = amount
                , approve = approve
                , weeklyAmount = weeklyAmount
                , waitApprove = waitApprove
                , monthlyID = monthly.Select(x => x.ShipmentPlanMain_ID).FirstOrDefault()
                , weeklyID = weekly.Select( x => x.ShipmentPlanMain_ID).FirstOrDefault()
            };
        }

        private ShipmentPlanMainSearchProgressResponse.Customer.ShipmentPlanMain.ShipmentProgress GetShipmentProgress(ShipmentPlanProgressCriteria lcp)
        {
            if(lcp.ShipmentPlanMainMonthlyStatus == ENShipmentPlanMonthlyStatus.AUTO_PROCESSING.GetValueString())
                return new ShipmentPlanMainSearchProgressResponse.Customer.ShipmentPlanMain.ShipmentProgress()
                {
                    alertMessage = new List<string>(),
                    stockVSPlan = 0
                };

            List<string> alertMessages = new List<string>();
            //int planVSstock = 0;
            decimal sumPlanQty = 0;
            decimal sumInvQty = 0;
            if (lcp.ShipmentPlanMainID.HasValue)
            {
                //bool isOverAdmit = false; //สินค้าเข้าคลังไม่ครบหลังเลย Admit Date
                //bool isOverApprove = false; //ยังไม่ได้รับการอนุมัติหลังจากเริ่มเดือนตามแผน

                var orderStns = ADO.ShipmentPlanOrderStandADO.GetInstant().PlanQty(lcp.ShipmentPlanMainID.Value, this.Logger);
                if (lcp.PlanOrderCount == 0)
                    alertMessages.Add("There is no outstanding.");
                /*if (orderStns.Count > 0)
                {
                    var orderNos = orderStns.GroupBy(x => x.Order_Code).Select(x => x.Key).ToList();
                    var planDate = new DateTime(lcp.ShipmentPlanMainPlanYear.Value, lcp.ShipmentPlanMainPlanMonth.Value, 1).AddMonths(1).AddDays(-1);

                    var stocks = ADO.ShipmentPlanADO.GetInstant().StockInventory_ListByOrder(orderNos, this.Logger);
                    stocks.RemoveAll(x => !x.CIDT.HasValue || x.CIDT.Value.Ticks > planDate.Ticks);
                    stocks.ForEach(x => x.ORDERNO = x.ORDERNO.Trim());

                    sumPlanQty = orderStns.Sum(x => x.PlanQuatity);
                    sumInvQty = stocks
                        .Where(x => orderStns.Any(y => y.Order_Code == x.ORDERNO && y.ItemNo == x.PIITEMNO && !x.CIDT.HasValue))
                        .Sum(x => x.qty);
                }*/

                //if (lcp.ShipmentPlanMainStatus == ENShipmentPlanMonthlyStatus.AUTO_PROCESSING.GetValueString())
                //{
                //    alertMessages.Add("Auto Processing...");
                //}
                //else
                //{
                    

                //    //if (lcp.ShipmentPlanMainMonthlyStatus != ENShipmentPlanMonthlyStatus.APPROVED.GetValueString() &&
                //    //    DateTime.Now > new DateTime(lcp.ShipmentPlanMainPlanYear.Value, lcp.ShipmentPlanMainPlanMonth.Value, 1))
                //    //{
                //    //    isOverApprove = true;
                //    //}

                //    ///************RESULT**************/
                //    //if (isOverAdmit) alertMessages.Add("Products not ready for delivery.");
                //    //if (isOverApprove) alertMessages.Add("Not Yet Approve.");

                //}
                //if(orderStns.Count() > 0)
                //planVSstock = (int)((sumPercent / (decimal)orderStns.Count()) * 100.0m);
            }

            return new ShipmentPlanMainSearchProgressResponse.Customer.ShipmentPlanMain.ShipmentProgress()
            {
                alertMessage = alertMessages,
                stockVSPlan = sumPlanQty == 0 ? 0 : sumInvQty / sumPlanQty * 100,
                planQty = sumPlanQty,
                stockQty = sumInvQty
            };
        }

        private ShipmentPlanMainSearchProgressResponse.Customer ConvertToSPSPRCustomer(ShipmentPlanProgressCriteria lcp)
        {
            var res = new ShipmentPlanMainSearchProgressResponse.Customer()
            {
                id = lcp.CustomerID,
                code = lcp.CustomerCode,
                description = lcp.CustomerDescription,
                country = new INTIdCodeDescriptionModel()
                {
                    id = lcp.CountryID,
                    code = lcp.CountryCode,
                    description = lcp.CountryDescription
                },
                customerGroup = new INTIdCodeDescriptionModel()
                {
                    id = lcp.CustomerGroupID,
                    code = lcp.CustomerGroupCode,
                    description = lcp.CustomerGroupDescription
                },
                saleEmployee = new INTIdCodeDescriptionModel()
                {
                    id = lcp.SaleEmployeeID,
                    code = lcp.SaleEmployeeCode,
                    description = lcp.SaleEmployeeDescription
                },
                zoneAccount = new INTIdCodeDescriptionModel()
                {
                    id = lcp.ZoneAccountID,
                    code = lcp.ZoneAccountCode,
                    description = lcp.ZoneAccountDescription
                },
                shipmentPlanMain = !lcp.ShipmentPlanMainID.HasValue ? null :
                    new ShipmentPlanMainSearchProgressResponse.Customer.ShipmentPlanMain()
                    {
                        id = lcp.ShipmentPlanMainID.Value,
                        code = lcp.ShipmentPlanMainCode,
                        planType = lcp.ShipmentPlanMainPlanType,
                        planMonth = lcp.ShipmentPlanMainPlanMonth.Value,
                        planYear = lcp.ShipmentPlanMainPlanYear.Value,
                        status = lcp.ShipmentPlanMainStatus,
                        create = !lcp.ShipmentPlanMainCreateBy.HasValue ? null :
                        new ByDateTimeModel()
                        {
                            by = BaseValidate.GetEmpName(lcp.ShipmentPlanMainCreateBy.Value),
                            datetime = BaseValidate.GetDateTimeString(lcp.ShipmentPlanMainCreateDate.Value)
                        },
                        modify = !lcp.ShipmentPlanMainModifyBy.HasValue ? null :
                        new ByDateTimeModel()
                        {
                            by = BaseValidate.GetEmpName(lcp.ShipmentPlanMainModifyBy.Value),
                            datetime = BaseValidate.GetDateTimeString(lcp.ShipmentPlanMainModifyDate.Value)
                        },
                        ports = lcp.ShipmentPlanMainPorts == null ? new List<string>() : lcp.ShipmentPlanMainPorts.Split('|').ToList(),
                        progress = this.GetShipmentProgress(lcp)
                    }
            };
            return res;
        }
    }
}
