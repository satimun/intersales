using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Constant.ConstEnum;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanGetOutstandingAPI : BaseAPIEngine<ShipmentPlanSearchOutstandingRequest, ShipmentPlanSearchOutstandingResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(ShipmentPlanSearchOutstandingRequest dataReq, ShipmentPlanSearchOutstandingResponse dataRes)
        {
            dataReq.productTypeCodes = dataReq.productTypeCodes == null || dataReq.productTypeCodes.Count == 0 ?
                new List<string> { "F", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" } :
                dataReq.productTypeCodes;

            var dateFrom = BaseValidate.GetDate(dataReq.admitDateFrom);
            var dateTo = BaseValidate.GetDate(dataReq.admitDateTo);

            var outsandingRes = ADO.ShipmentPlanADO.GetInstant().GetOutstanding(
                 dateFrom,
                 dateTo,
                 dataReq.customerCodes,
                 dataReq.productTypeCodes,
                 dataReq.orderCodes,
                 dataReq.productCodes,
                 dataReq.packlistCodes,
                 this.Logger);

            List<string> unitCodeIsNotSaleWei = new List<string>()//หน่วยขายที่สั่งเป็นน้ำหนัก
            {
                "BD","BL","CT","P3","PC","PK","PL","SP","ST","WC","X1",
            };
            dataRes.outstandings = new List<ShipmentPlanSearchOutstandingResponse.Outstandigns>();
            var orderNos = outsandingRes.Select(x => x.ORDERNO).Distinct().ToList();
            var stock = ShipmentPlanADO.GetInstant().GetStock(orderNos, this.Logger);
            //var orderCloseFlags = ADO.ShipmentPlanADO.GetInstant().OrderMarketCloseFlag_ListByOrderNo(orderNos, this.Logger);

            List<int> customerIDs = new List<int>();

            dataReq.customerCodes.ForEach( x => {
                customerIDs.Add(StaticValueManager.GetInstant().sxsCustomers.Where(z => z.Code == x.Trim()).Select(z => z.ID).FirstOrDefault());
            });

            var outstanding = ShipmentPlanOrderStandADO.GetInstant().Get(dataReq.planMonth, dataReq.planYear, dataReq.planType, customerIDs, this.Logger);

            /*SoMRuk*/
            var bplTmp = ADO.ShipmentPlanADO.GetInstant().GetVolume(this.Logger);
            foreach (var o in outsandingRes)    //Loop Outstanding จากระบบเก่าทั้งหมด
            {
                string saleUnitIsWei = unitCodeIsNotSaleWei.Any(y => y == o.SALEUNIT) ? "N" : "Y";//ตรวจสอบว่าหน่วยขายเป็นแบบคำนวนจากน้ำหนัก หรือ จำนวนผืน
                List<string> warnings = new List<string>();

                var a = this.ConvertToDatOutstanding(o, saleUnitIsWei, dataReq.option, bplTmp, stock);
                a.id = outstanding.Where(x => x.Order_Code == a.orderCode && x.ItemNo == a.itemno && x.Product_Code == a.product.code && x.ProductGrade_Code == a.product.gradeCode).Select(x => x.id).FirstOrDefault();
                if (a.id == 0)
                {
                    a.id = ADO.RunningADO.GetInstant().Next_sxtShipmentPlanOrderStand_ID(this.Logger);
                }
                a.warnings.InsertRange(0, warnings);
               
                dataRes.outstandings.Add(a);
            }

            dataRes.outstandings = dataRes.outstandings.OrderByDescending(x => x.urgentFlag).ThenBy(x => x.admitDate).ToList();
        }

        public class volTmp
        {
            public decimal qty = 0;
            public decimal vol = 0;
        }

        protected ShipmentPlanSearchOutstandingResponse.Outstandigns ConvertToDatOutstanding(OutstandingSearchCriteria o, string saleUnitIsWei, int option, List<ShipmetPlanGetVolume> bplTmp, List<ShipmentPlanGetStock> stock)
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
            if (tmp.Count != 0)
            {
                var inv = tmp.Where(x => x.CIDT == null).Select(x => x.VOLUME).ToList();
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
                o.BPL = toBeShippedVolume / (toBeShippedBale <= 0 ? 1 : toBeShippedBale);
            }
            else // not product in stock
            {
                var volTmp = bplTmp.Where(x => x.CUSCOD.Trim() == o.CUSCOD.Trim() && x.PRODCODE.Trim() == o.PRODCODE.Trim() && x.PQGRADECD.Trim() == o.PQGRADECD).Select(x => new { qty = x.PCPERBALE, vol = x.VOLUME }).FirstOrDefault();
                o.BPL = volTmp.vol;
                toBeShippedVolume = (toBeShippedQty / volTmp.qty) * volTmp.vol;
            }

            var res = new ShipmentPlanSearchOutstandingResponse.Outstandigns()
            {
                orderCode = o.ORDERNO,
                piCode = o.PINO,
                //barcode = o.BARCODE,
                itemno = o.ITEMNO,
                warnings = new List<string>(),
                admitDate = BaseValidate.GetDateString(o.ADMITDATE),
                originalAdmitDate = BaseValidate.GetDateString(o.ORGADMITDATE),
                maxAdmitDate = BaseValidate.GetDateString(o.MAXIMUMADMITDATE),
                branch = o.BRANCH,
                deliveryType = o.DELIVERYTYPE == "1" ? ENShipmentPlanDeliveryType.LOT.GetValueString() : ENShipmentPlanDeliveryType.COMPILE.GetValueString(),
                deliveryDescription = o.DELIVERYTYPE == "1" ? ENShipmentPlanDeliveryType.LOT.GetDisplayName() : ENShipmentPlanDeliveryType.COMPILE.GetDisplayName(),
                orderDate = BaseValidate.GetDateString(o.ORDERDT),
                saleUnitCode = o.SALEUNIT,
                contianerCode = o.FREIGHTCODE.Contains("20") ? "20\"" : o.FREIGHTCODE.Contains("40") ? "40\"" : o.FREIGHTCODE,
                contianerSizeKG = o.FREIGHTCODE.Contains("20") ? 12500 : o.FREIGHTCODE.Contains("40") ? 26000 : o.FREIGHTCODE.Contains("Air") ? 1000 : 0,
                percentClose = o.PERCEN_CLOSE,
                beforePaymentTermCode = o.PAYCODE1,
                afterPaymentTermCode = o.PAYCODE2,
                saleUnitIsWei = saleUnitIsWei,
                closeByCI = "Y",
                urgentFlag = o.UrgentFlag,
                product = new ShipmentPlanSearchOutstandingResponse.Outstandigns.Product()
                {
                    code = o.PRODCODE,
                    description = o.PRODDESC,
                    gradeCode = o.GRADE,
                    gradeDescription = o.PQGRADECD,
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
