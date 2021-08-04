using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using InterSaleModel.Model.Jobs.Request;
using InterSaleModel.Model.Jobs.Response;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.Jobs
{
    public class ShipmentPlanOutstandProcessJobs : BaseJobsEngine<ShipmentPlanOutstandProcessReq, JobEmplyRes>
    { 
        protected override void ExecuteChild(ShipmentPlanOutstandProcessReq dataReq, JobEmplyRes datRes)
        {
            if (StaticValueManager.GetInstant().ShipmentPlanOutstandProcessActive)
            {
                throw new Exception("ระบบกำลังทำงานอยู่...");
            }

            StaticValueManager.GetInstant().ShipmentPlanOutstandProcessActive_Set(false);
            var Issucces = true;
            var msg = "";

            try
            {
                var df = DateTime.Today.AddYears(-2);
                var dt = DateTime.Today.AddYears(1);
                ShipmentPlanADO.GetInstant().OutstandProcessDelete();
                for (var option = 1; option <= 2; option ++)
                {
                    ShipmentPlanADO.GetInstant().OutInv(df, dt, option).GroupBy(x => x.CUSCOD).ToList().ForEach(x =>
                    {
                        var outstands = x.ToList();
                        var orderNos = outstands.Select(y => y.ORDERNO).Distinct().ToList();
                        var stock = ShipmentPlanADO.GetInstant().GetStock(orderNos);
                        var planOrder = ShipmentPlanADO.GetInstant().GetPlanOrder(orderNos, DateTime.Today.AddMonths(1).Month, DateTime.Today.AddMonths(1).Year);
                        var bplTmp = ShipmentPlanADO.GetInstant().GetVolume(null);

                        var tmp = new List<ShipmentPlanOutInv>();
                        outstands.ForEach(o =>
                        {
                            bool isOutstanding = false;
                            if (o.CLOSE_FLAG != "Y" ||        //ยังไม่ปิด Lot ตลาด
                            o.INV_QUANTITY > 0 ||                                   //สินค้าคงคลัง (ดูจากจำนวนผืน)
                            o.INV_WEIGHT > 0)                                       //สินค้าคงคลัง (ดูจากน้ำหนัก)
                            {
                                if (o.CSTAT != "C")        //ยังไม่ปิด Lot ผลิต
                                {
                                    isOutstanding = true;
                                }
                                else if ("Y".Equals(o.ISWEIGHT) && o.INV_WEIGHT > 0) //มีสินค้าคงคลัง (ดูจากน้ำหนัก)
                                {
                                    isOutstanding = true;
                                }
                                else if ("Y".Equals(o.ISWEIGHT) && o.D_WEIGHT / o.P_WEIGHT < (1.0m - (o.PERCEN_CLOSE / 100.0m)))//จำนวนส่งน้อยกว่า % ยอมรับเป้าหมาย (ดูจากน้ำหนัก)
                                {
                                    isOutstanding = true;
                                }
                                else if ("N".Equals(o.ISWEIGHT) && o.INV_QUANTITY > 0)//มีสินค้าคงคลัง (ดูจากจำนวนผืน)
                                {
                                    isOutstanding = true;
                                }
                                else if ("N".Equals(o.ISWEIGHT) && o.D_QUANTITY / o.P_QUANTITY < (1.0m - (o.PERCEN_CLOSE / 100.0m)))//จำนวนส่งน้อยกว่า % ยอมรับเป้าหมาย (ดูจากจำนวนผืน)
                                {
                                    isOutstanding = true;
                                }
                            }
                            var dtRemove = new DateTime(2001, 1, 1);
                            if ("N".Equals(o.ISWEIGHT) && o.INV_QUANTITY <= 0 && o.B_QUANTITY <= 0)//ไม่มีสินค้าในคลัง และไม่มีจำนวนค้างส่ง (ดูจากจำนวนผืน)
                                isOutstanding = false;
                            else if ("Y".Equals(o.ISWEIGHT) && o.INV_WEIGHT <= 0 && o.B_WEIGHT <= 0)//ไม่มีสินค้าในคลัง และไม่มีจำนวนค้างส่ง (ดูจากน้ำหนัก)
                                isOutstanding = false;
                            else if (o.ADMITDATE.Ticks <= dtRemove.Ticks)//ยังไม่ได้เป้าจากผลิต
                                isOutstanding = false;

                            decimal? qty = planOrder.Where(z => z.Order_Code == o.ORDERNO && z.ItemNo == o.ITEMNO && z.Product_Code == o.PRODCODE && z.ProductGrade_Code == o.PQGRADECD).Select(z => z.Quatity).FirstOrDefault();

                            if (qty.HasValue)
                            {
                                decimal oTmp = o.P_QUANTITY - qty.Value;
                                if (oTmp <= 0)
                                {
                                    if (o.INV_QUANTITY <= 0) isOutstanding = false;
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
                                ConvertToDatOutstand(o, bplTmp, stock, option);
                                tmp.Add(o);
                            }
                        });

                        if (tmp.Count != 0)
                        {
                            SqlTransaction transac = BaseADO.BeginTransaction();
                            try
                            {
                                tmp.GroupBy(y => y.CURRENCYCODE).ToList().ForEach(y =>
                                {
                                    var data = new ShipmentPlanOutInv()
                                    {
                                        CUSCOD = y.First().CUSCOD
                                        , CURRENCYCODE = y.First().CURRENCYCODE
                                        , B_QUANTITY = y.Sum(z => z.B_QUANTITY)
                                        , B_WEIGHT = y.Sum(z => z.B_WEIGHT)
                                        , B_PACK = y.Sum(z => z.B_PACK)
                                        , B_VOLUME = y.Sum(z => z.B_VOLUME)
                                        , B_VALUE = y.Sum(z => z.B_VALUE)
                                        , INV_QUANTITY = y.Sum(z => z.INV_QUANTITY)
                                        , INV_WEIGHT = y.Sum(z => z.INV_WEIGHT)
                                        , INV_PACK = y.Sum(z => z.INV_PACK)
                                        , INV_VOLUME = y.Sum(z => z.INV_VOLUME)
                                        , INV_VALUE = y.Sum(z => z.INV_VALUE)
                                    };
                                    ShipmentPlanADO.GetInstant().OutstandProcessSave(data, option, null, transac);
                                });
                            }
                            catch (Exception ex)
                            {
                                transac.Rollback();
                                Issucces = false;
                                msg = ex.Message;
                            }
                            finally
                            {
                                if (Issucces) transac.Commit();
                                if (transac != null && transac.Connection != null && transac.Connection.State == System.Data.ConnectionState.Open) transac.Connection.Close();
                            }
                        }

                    });

                }
            } catch (Exception ex)
            {
                Issucces = false;
                msg = ex.Message;
            }
            finally
            {
                StaticValueManager.GetInstant().ShipmentPlanOutstandProcessActive_Set(false);
            }

            if (!Issucces) throw new Exception(msg);
        }

        public class volTmp
        {
            public decimal qty = 0;
            public decimal vol = 0;
        }

        private void ConvertToDatOutstand(ShipmentPlanOutInv o, List<ShipmetPlanGetVolume> bplTmp, List<ShipmentPlanGetStock> stock, int option)
        {
            // chk stock
            var tmp = stock.Where(x => x.ORDERNO == o.ORDERNO && x.PIITEMNO == o.ITEMNO && x.PRODCODE == o.PRODCODE && x.PQGRADECD == o.PQGRADECD).ToList();
            if(tmp.Count != 0)
            {
                var inv = tmp.Where(x => (option == 1 && x.PKDT == null) || (option == 2 && x.CIDT == null)).Select(x => x.VOLUME).ToList();
                if (inv.Count >= o.B_PACK)
                {
                    for (var v = 0; v < o.B_PACK; v++) { if (v < inv.Count) o.B_VOLUME += inv[v]; }
                    for (var v = 0; v < o.INV_PACK; v++) { if (v < inv.Count) o.INV_VOLUME += inv[v]; }
                }
                else
                {
                    int countqty = 0, countqtyTmp = 0;
                    List<volTmp> tmp2 = new List<volTmp>();
                    decimal qty = 0m;

                    for (var v = 0; v < o.INV_PACK; v++) { if (v < inv.Count) o.INV_VOLUME += inv[v]; }

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
                    o.B_VOLUME = (o.B_QUANTITY / qty) * stdVolume;
                }
            } 
            else // not product in stock
            {
                var volTmp = bplTmp.Where(x => x.CUSCOD.Trim() == o.CUSCOD.Trim() && x.PRODCODE.Trim() == o.PRODCODE.Trim() && x.PQGRADECD.Trim() == o.PQGRADECD).Select(x => new { qty = x.PCPERBALE, vol = x.VOLUME }).FirstOrDefault();
                o.B_VOLUME = (o.B_QUANTITY / volTmp.qty) * volTmp.vol;
            }
        }

    }
}
