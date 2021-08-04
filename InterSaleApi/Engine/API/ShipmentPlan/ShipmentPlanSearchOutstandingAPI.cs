using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.Entity.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Constant.ConstEnum;
using KKFCoreEngine.Util;
using System.Diagnostics;
using InterSaleApi.Model.StaticValue;
using InterSaleApi.ADO;
using KKFCoreEngine.KKFException;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanSearchOutstandingAPI : BaseAPIEngine<ShipmentPlanSearchOutstandingRequest,ShipmentPlanSearchOutstandingResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(ShipmentPlanSearchOutstandingRequest dataReq, ShipmentPlanSearchOutstandingResponse dataResponse)
        {
            dataReq.productTypeCodes = dataReq.productTypeCodes == null || dataReq.productTypeCodes.Count == 0 ?
                new List<string> { "F", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" } :
                dataReq.productTypeCodes;

            var dateFrom = BaseValidate.GetDate(dataReq.admitDateFrom);
            var dateTo = BaseValidate.GetDate(dataReq.admitDateTo);

            var outsandingRes = ADO.ShipmentPlanADO.GetInstant().SearchOutstanding(
                 dateFrom,
                 dateTo,
                 dataReq.customerCodes,
                 dataReq.productTypeCodes,
                 dataReq.option,
                 dataReq.IgnoreAdmitDate,
                 this.Logger);

            List<string> unitCodeIsNotSaleWei = new List<string>()//หน่วยขายที่สั่งเป็นน้ำหนัก
            {
                "BD","BL","CT","P3","PC","PK","PL","SP","ST","WC","X1",
            };
            dataResponse.outstandings = new List<ShipmentPlanSearchOutstandingResponse.Outstandigns>();
            var orderNos = outsandingRes.Select(x => x.ORDERNO).Distinct().ToList();
            var stock = ShipmentPlanADO.GetInstant().GetStock(orderNos, this.Logger);
            var planOrder = ShipmentPlanADO.GetInstant().GetPlanOrder(orderNos, dataReq.planMonth, dataReq.planYear, this.Logger);

            //var orderCloseFlags = ADO.ShipmentPlanADO.GetInstant().OrderMarketCloseFlag_ListByOrderNo(orderNos, this.Logger);

            /*SoMRuk*/
            var bplTmp = ADO.ShipmentPlanADO.GetInstant().GetVolume(this.Logger);

            var payAmounts = ShipmentPlanADO.GetInstant().GetPayAmount(outsandingRes.GroupBy(x => x.PINO).Select(x => x.Key).ToList());

            var customerIDs = new List<int>();
            //var orderNos = new List<string>();
            outsandingRes.GroupBy(x => x.CUSCOD).Select(x => x.Key).ToList().ForEach(x =>
            {
                customerIDs.Add(StaticValueManager.GetInstant().sxsCustomers.Where(z => z.Code == x.Trim()).Select(z => z.ID).FirstOrDefault());
            });

            var outstanding = ShipmentPlanOrderStandADO.GetInstant().Get(dataReq.planMonth, dataReq.planYear, dataReq.planType, customerIDs, this.Logger);

            foreach (var o in outsandingRes)    //Loop Outstanding จากระบบเก่าทั้งหมด
            {
                string saleUnitIsWei = unitCodeIsNotSaleWei.Any(y => y == o.SALEUNIT) ? "N" : "Y";//ตรวจสอบว่าหน่วยขายเป็นแบบคำนวนจากน้ำหนัก หรือ จำนวนผืน
                List<string> warnings = new List<string>();
                bool isOutstanding = false;     //ture = รายการนี้เป็น Outstanding
               
                if (o.CLOSE_FLAG != "Y" ||        //ยังไม่ปิด Lot ตลาด
                    o.INV_QUANTITY > 0 ||                                   //สินค้าคงคลัง (ดูจากจำนวนผืน)
                    o.INV_WEIGHT > 0)                                       //สินค้าคงคลัง (ดูจากน้ำหนัก)
                {
                    if (o.CSTAT != "C")        //ยังไม่ปิด Lot ผลิต
                    {
                        isOutstanding = true;
                    }
                    else if ("Y".Equals(saleUnitIsWei) && o.INV_WEIGHT > 0) //มีสินค้าคงคลัง (ดูจากน้ำหนัก)
                    {
                        isOutstanding = true;
                    }
                    else if ("Y".Equals(saleUnitIsWei) && o.D_WEIGHT / o.P_WEIGHT < (1.0m - (o.PERCEN_CLOSE / 100.0m)))//จำนวนส่งน้อยกว่า % ยอมรับเป้าหมาย (ดูจากน้ำหนัก)
                    {
                        isOutstanding = true;
                    }
                    else if ("N".Equals(saleUnitIsWei) && o.INV_QUANTITY > 0)//มีสินค้าคงคลัง (ดูจากจำนวนผืน)
                    {
                        isOutstanding = true;
                    }
                    else if ("N".Equals(saleUnitIsWei) && o.D_QUANTITY / o.P_QUANTITY < (1.0m - (o.PERCEN_CLOSE / 100.0m)))//จำนวนส่งน้อยกว่า % ยอมรับเป้าหมาย (ดูจากจำนวนผืน)
                    {
                        isOutstanding = true;
                    }
                }
                var dtRemove = new DateTime(2001, 1, 1);
                if ("N".Equals(saleUnitIsWei) && o.INV_QUANTITY <= 0 && o.B_QUANTITY <= 0)//ไม่มีสินค้าในคลัง และไม่มีจำนวนค้างส่ง (ดูจากจำนวนผืน)
                    isOutstanding = false;
                else if ("Y".Equals(saleUnitIsWei) && o.INV_WEIGHT <= 0 && o.B_WEIGHT <= 0)//ไม่มีสินค้าในคลัง และไม่มีจำนวนค้างส่ง (ดูจากน้ำหนัก)
                    isOutstanding = false;
                else if (!dataReq.IgnoreAdmitDate && o.ADMITDATE.Ticks <= dtRemove.Ticks)//ยังไม่ได้เป้าจากผลิต
                    isOutstanding = false;
                else if (!dataReq.IgnoreAdmitDate && o.MAXIMUMADMITDATE.Ticks <= dtRemove.Ticks)
                    isOutstanding = false;

                //decimal? qty = planOrder.Where(x => x.Order_Code == o.ORDERNO && x.ItemNo == o.ITEMNO && x.Product_Code == o.PRODCODE && x.ProductGrade_Code == o.PQGRADECD).Select(x => x.Quatity).FirstOrDefault();

                var plan = planOrder.Where(x => x.Order_Code == o.ORDERNO && x.ItemNo == o.ITEMNO && x.Product_Code == o.PRODCODE && x.ProductGrade_Code == o.PQGRADECD).FirstOrDefault();
                //try
                //{ 
                if (plan != null && plan.PlanDate >= DateTime.Today)
                {
                    decimal oTmp = o.P_QUANTITY - plan.Quatity;
                    if (oTmp <= 0)
                    {
                        if(o.INV_QUANTITY <= 0) isOutstanding = false;
                        else
                        {
                            decimal n = 0 / o.P_QUANTITY;
                            o.B_QUANTITY = Math.Round(o.P_QUANTITY * n);
                            o.B_WEIGHT = o.P_WEIGHT * n;
                            o.B_PACK = Math.Floor(o.P_PACK * n);
                            o.B_VALUE = o.P_VALUE * n;
                            o.B_VOLUME = o.P_VOLUME * n;
                        }
                    }
                    else
                    {
                        decimal n = oTmp / o.P_QUANTITY;
                        o.B_QUANTITY = Math.Round(o.P_QUANTITY * n);
                        o.B_WEIGHT = o.P_WEIGHT * n;
                        o.B_PACK = Math.Floor(o.P_PACK * n);
                        o.B_VALUE = o.P_VALUE * n;
                        o.B_VOLUME = o.P_VOLUME * n;
                    }
                }

                if (isOutstanding)//เป็นรายการ Outstanding
                {
                    var a = this.ConvertToDatOutstanding(o, saleUnitIsWei, dataReq.option, bplTmp, payAmounts, stock);
                    a.id = outstanding.Where(x => x.Order_Code == a.orderCode && x.ItemNo == a.itemno && x.Product_Code == a.product.code && x.ProductGrade_Code == a.product.gradeCode).Select(x => x.id).FirstOrDefault();
                    if (a.id == 0)
                    {
                        a.id = ADO.RunningADO.GetInstant().Next_sxtShipmentPlanOrderStand_ID(this.Logger);
                    }
                    a.warnings.InsertRange(0, warnings);
                    //a.orderCloseFlag = ocfs.Any(x => x.OrderCloseFlag.Equals("Y")) ? "Y" : "N";
                    //a.marketCloseFlag = ocfs.Any(x => x.MarketCloseFlag.Equals("Y")) ? "Y" : "N"; ;
                    dataResponse.outstandings.Add(a);
                }
                else
                {
                    Debug.WriteLine("It'n Outstanding");
                }
                //}
                //catch (Exception ex)
                //{
                //    Console.WriteLine(ex.Message);
                //    var x = o;
                //}
            }
            var ord1 = dataResponse.outstandings.Where(x => !string.IsNullOrEmpty(x.admitDate)).OrderByDescending(x => x.urgentFlag).ThenBy(x => x.admitDate).ToList();
            var ord2 = dataResponse.outstandings.Where(x => string.IsNullOrEmpty(x.admitDate)).OrderBy(x => x.orderCode).OrderBy(x => x.orderDate).ToList();

            dataResponse.outstandings = ord1;
            dataResponse.outstandings.AddRange(ord2);

            //dataResponse.outstandings = dataResponse.outstandings.OrderByDescending(x => x.urgentFlag).ThenBy(x=> x.admitDate).ToList();

        }

        public class volTmp
        {
            public decimal qty = 0;
            public decimal vol = 0;
        }

        protected ShipmentPlanSearchOutstandingResponse.Outstandigns ConvertToDatOutstanding(OutstandingSearchCriteria o, string saleUnitIsWei, int option ,List<ShipmetPlanGetVolume> bplTmp, List<ShipmentPlanGetPayAmount> payAmounts, List<ShipmentPlanGetStock> stock)
        {

            decimal qpb = 0;
            decimal qpw = 0;
            decimal qpv = 0;

            decimal toBeShippedQty = 0;
            decimal toBeShippedWei = 0;
            decimal toBeShippedBale = 0;
            decimal toBeShippedValue = 0;
            decimal toBeShippedVolume = 0;

            decimal invVolume = 0;

            //if (o.ORDERNO == "KPI-19060077-E" && o.PRODCODE == "M1707/*400ฑ0509")
            //{
            //    var y = 0;
            //}

            if (o.INV_QUANTITY > 0 && o.INV_QUANTITY >= o.B_QUANTITY)
            {
                try
                {
                    qpb = Math.Round(o.INV_PACK / o.INV_QUANTITY, 3);
                    qpw = Math.Round(o.INV_WEIGHT / o.INV_QUANTITY, 3);
                    qpv = Math.Round(o.INV_VALUE / o.INV_QUANTITY, 3);
                }
                catch (Exception ex) { Console.Write(ex.Message); }

                toBeShippedBale = o.INV_PACK;
                toBeShippedQty = o.INV_QUANTITY;
                toBeShippedWei = o.INV_WEIGHT;
                toBeShippedValue = o.INV_VALUE;
                //toBeShippedVolume = o.INV_PACK * bpl;
            }
            else if (o.B_QUANTITY > 0)
            {
                try
                {
                    qpb = Math.Round(o.B_PACK / o.B_QUANTITY, 3);
                    qpw = Math.Round(o.B_WEIGHT / o.B_QUANTITY, 3);
                    qpv = Math.Round(o.B_VALUE / o.B_QUANTITY, 3);
                }
                catch (Exception ex) { Console.Write(ex.Message); }

                toBeShippedBale = o.B_PACK;
                toBeShippedQty = o.B_QUANTITY;
                toBeShippedWei = o.B_WEIGHT;
                toBeShippedValue = o.B_VALUE;
                //toBeShippedVolume = o.B_PACK * bpl;
            }
            else if (o.P_QUANTITY > 0)
            {
                try
                {
                    qpb = Math.Round(o.P_PACK / o.P_QUANTITY, 3);
                    qpw = Math.Round(o.P_WEIGHT / o.P_QUANTITY, 3);
                    qpv = Math.Round(o.P_VALUE / o.P_QUANTITY, 3);
                }
                catch (Exception ex)
                {
                    Console.Write(ex.Message);
                }
            }

            // chk stock
            var tmp = stock.Where(x => x.ORDERNO == o.ORDERNO && x.PIITEMNO == o.ITEMNO && x.PRODCODE == o.PRODCODE && x.PQGRADECD == o.PQGRADECD).ToList();
            if(tmp.Count != 0)
            {
                var inv = tmp.Where(x => (option == 1 && x.PKDT == null) || (option == 2 && x.CIDT == null)).Select(x => x.VOLUME).ToList();
                if (inv.Count >= toBeShippedBale)
                {
                    for (var v = 0; v < toBeShippedBale; v++) { if (v < inv.Count) toBeShippedVolume += inv[v]; }
                    for (var v = 0; v < o.INV_PACK; v++) { if (v < inv.Count) invVolume += inv[v]; }
                }
                else
                {
                    int countqty = 0, countqtyTmp = 0;
                    List<volTmp> tmp2 = new List<volTmp>();
                    decimal qty = 0m;

                    tmp.GroupBy(z => z.RECVQTY).ToList().ForEach(z =>
                    {
                        var stockTmp = z.ToList();
                        stockTmp.ForEach(y => tmp2.Add(new volTmp()
                        {
                            qty = y.RECVQTY
                            , vol = y.VOLUME
                        }));
                        countqtyTmp = stockTmp.Count;
                        if (countqty < countqtyTmp) { qty = z.Key; }
                    });

                    tmp2.ForEach(z => { if(z.qty != qty) { z.vol = (z.vol / z.qty) * qty; z.qty = qty; } });
                    
                    var stdVolume = tmp2.Sum(x => x.vol) / tmp2.Count;
                    toBeShippedVolume = (toBeShippedQty / qty) * stdVolume;
                }
                o.BPL = toBeShippedVolume / (toBeShippedBale <= 0 ? 1 :toBeShippedBale);
            } 
            else // not product in stock
            {
                var volTmp = bplTmp.Where(x => x.CUSCOD.Trim() == o.CUSCOD.Trim() && x.PRODCODE.Trim() == o.PRODCODE.Trim() && x.PQGRADECD.Trim() == o.PQGRADECD).Select(x => new { qty = x.PCPERBALE, vol = x.VOLUME }).FirstOrDefault();
                //if(volTmp == null) { throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O0000, $"Not Found Packing Standard : {o.CUSCOD} - {o.ORDERNO} - {o.PRODCODE} - {o.PQGRADECD}"); }
                if (volTmp != null && volTmp.qty > 0)
                {
                    o.BPL = volTmp.vol;
                    if (volTmp.qty > 0)
                    {
                        toBeShippedVolume = (toBeShippedQty / volTmp.qty) * volTmp.vol;
                    }
                }
            }

            var res = new ShipmentPlanSearchOutstandingResponse.Outstandigns()
            {
                orderCode = o.ORDERNO,
                piCode = o.PINO,
                //barcode = o.BARCODE,
                itemno = o.ITEMNO,
                warnings = new List<string>(),
                admitDate = o.ADMITDATE <= new DateTime(2001, 1, 1) ? null : BaseValidate.GetDateString(o.ADMITDATE),
                originalAdmitDate = o.ORGADMITDATE <= new DateTime(2001, 1, 1) ? null : BaseValidate.GetDateString(o.ORGADMITDATE),
                maxAdmitDate = o.MAXIMUMADMITDATE <= new DateTime(2001, 1, 1) ? null : BaseValidate.GetDateString(o.MAXIMUMADMITDATE),
                branch = o.BRANCH,
                deliveryType = o.DELIVERYTYPE == "1" ? ENShipmentPlanDeliveryType.LOT.GetValueString() : ENShipmentPlanDeliveryType.COMPILE.GetValueString(),
                deliveryDescription = o.DELIVERYTYPE == "1" ? ENShipmentPlanDeliveryType.LOT.GetDisplayName() : ENShipmentPlanDeliveryType.COMPILE.GetDisplayName(),
                orderDate = BaseValidate.GetDateString(o.ORDERDT),
                saleUnitCode = o.SALEUNIT,
                contianerCode = o.FREIGHTCODE.Contains("20") ? "20\"" : o.FREIGHTCODE.Contains("40") ? "40\"" : o.FREIGHTCODE,
                //contianerSizeKG = o.FREIGHTCODE.Contains("20") ? 12500 : o.FREIGHTCODE.Contains("40") ? 26000 : o.FREIGHTCODE.Contains("Air") ? 1000 : 0,
                percentClose = o.PERCEN_CLOSE,
                beforePaymentTermCode = o.PAYCODE1,
                afterPaymentTermCode = o.PAYCODE2,
                saleUnitIsWei = saleUnitIsWei,
                closeByCI = (option == 2 ? "Y" : "N"),
                urgentFlag = o.UrgentFlag,
                product = new ShipmentPlanSearchOutstandingResponse.Outstandigns.Product()
                {
                    code = o.PRODCODE,
                    description = o.PRODDESC,
                    gradeCode = o.GRADE,
                    brand = o.BRAND,
                    twineSizeCode = o.TWINE,
                    twineTypeCode = o.TWINETYPE
                },
                customer = new ShipmentPlanSearchOutstandingResponse.Outstandigns.Customer()
                {
                    id = StaticValueManager.GetInstant().sxsCustomers.Where(z => z.Code == o.CUSCOD.Trim()).Select(z => z.ID).FirstOrDefault(),
                    code = o.CUSCOD,
                    description = o.CUSNAME,
                    portCode = o.DESTPORT,
                    portDescriotion = o.DESTPORTDESC
                },
                currency = new ShipmentPlanSearchOutstandingResponse.Outstandigns.Currency()
                {
                    code = o.CURRENCYCODE,
                    cpb = o.EXCHRATE
                },
                toBeShipped = new BalanceModel()
                {
                    quantity = Math.Round(toBeShippedQty),
                    weight = toBeShippedWei,
                    bale = toBeShippedBale,
                    value = toBeShippedValue,
                    volume = toBeShippedVolume,
                },
                proformaBalance = new BalanceModel()
                {
                    quantity = Math.Round(o.P_QUANTITY),
                    weight = o.P_WEIGHT,
                    bale = o.P_PACK,
                    value = o.P_VALUE,
                    volume = o.P_PACK * o.BPL
                },
                delivered = new BalanceModel()
                {
                    quantity = Math.Round(o.D_QUANTITY),
                    weight = o.D_WEIGHT,
                    bale = o.D_PACK,
                    value = o.D_VALUE,
                    volume = o.D_PACK * o.BPL
                },
                outstandingBalance = new BalanceModel()
                {
                    quantity = Math.Round(o.B_QUANTITY),
                    weight = o.B_WEIGHT,
                    bale = o.B_PACK,
                    value = o.B_VALUE,
                    volume = o.B_PACK * o.BPL
                },
                inventory = new BalanceModel()
                {
                    quantity = Math.Round(o.INV_QUANTITY),
                    weight = o.INV_WEIGHT,
                    bale = o.INV_PACK,
                    value = o.INV_VALUE,
                    volume = invVolume > 0 ? invVolume : o.INV_PACK * o.BPL
                },
                otherPick = new BalanceModel()
                {
                    bale = o.OUTPACK,
                    quantity = o.OUTQTY,
                    weight = o.OUTWEIGHT,
                    value = o.INV_QUANTITY > 0 ? (o.INV_VALUE / o.INV_QUANTITY) * o.OUTQTY : (o.P_VALUE / o.P_QUANTITY) * o.OUTQTY,
                    volume = o.OUTPACK * o.BPL
                },
                comparisonPercent = new ShipmentPlanSearchOutstandingResponse.Outstandigns.ComparisonPercent()
                {
                    inventory = o.PER_RECV,
                    notYetDelivered = o.PER_OUT,
                    notYetFinished = o.PER_PEND
                },
                valuePerUnit = new ShipmentPlanSearchOutstandingResponse.Outstandigns.ValuePerUnit()
                {
                    cpb = o.EXCHRATE,
                    qpb = qpb,
                    qpw = qpw,
                    qpv = qpv,
                    bpl = o.BPL,
                }
                , marketCloseFlag = (o.CLOSE_FLAG == "Y" ? "Y" : "N")
                , orderCloseFlag = (o.CSTAT == "C" ? "Y" : "N")
                , paymentTerm = o.PaymentTerm
                , payAmount = payAmounts.Where(z => z.PiCode == o.PINO).Select(z => z.PayAmount).FirstOrDefault()

                , TwineSizeLB = o.TWINESIZELB
                , MeshSizeLB = o.EYESIZELB
                , MeshDepthLB = o.EYEAMOUNTLB
                , LengthLB = o.LENGTHLB
                , Label_Code = o.LABEL1
            };
            return res;
        }
    }
}

