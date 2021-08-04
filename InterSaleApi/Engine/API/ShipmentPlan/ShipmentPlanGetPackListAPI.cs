using InterSaleApi.ADO;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class ShipmentPlanGetPackListAPI : BaseAPIEngine<ShipmentPlanGetPackListReq, ShipmentPlanGetPackListRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(ShipmentPlanGetPackListReq dataReq, ShipmentPlanGetPackListRes dataRes)
        {
            List<string> unitCodeIsNotSaleWei = new List<string>()//หน่วยขายที่สั่งเป็นน้ำหนัก
            {
                "BD","BL","CT","P3","PC","PK","PL","SP","ST","WC","X1",
            };

            dataRes.shipmentHs = new List<ShipmentPlanGetPackListRes.shipmentH>();

            var containerList = ShipmentPlanADO.GetInstant().ListContainerSize(this.Logger);

            ShipmentPlanADO.GetInstant().GetPackList(dataReq, this.Logger).ToList().ForEach(x =>
            {
                var chk = true;
                int ptr = 0;
                dataRes.shipmentHs.ForEach(y => { if (y.pkno == x.PKNO.Trim()) { chk = false; } });
                if(chk)
                {
                    dataRes.shipmentHs.Add(new ShipmentPlanGetPackListRes.shipmentH {
                        pkno = x.PKNO.Trim()
                        , shipmentDate = KKFCoreEngine.Util.DateTimeUtil.GetDateString(x.SHIPDATE)
                        , containerCode = containerList.Where(z => z.Code == x.FREIGHTCODE.Trim()).Select(z => z.Code).FirstOrDefault()
                        , shipmentWeek = x.SHIPWEEK
                        , shipmentDs = new List<ShipmentPlanGetPackListRes.shipmentH.shipmentD>()
                    });
                    ptr = dataRes.shipmentHs.Count - 1;
                }

                dataRes.shipmentHs.ForEach(k => {
                    if(k.pkno == x.PKNO)
                    {
                        k.shipmentDs.Add(new ShipmentPlanGetPackListRes.shipmentH.shipmentD {
                            orderCode = x.ORDERNO.Trim()
                            , productCode = x.PRODCODE.Trim()
                            , customer = StaticValueManager.GetInstant().sxsCustomers.Where(z => z.Code == x.CUSCOD.Trim()).Select(z => new INTIdCodeDescriptionModel() { id = z.ID, code = z.Code, description = z.CompanyName }).FirstOrDefault()
                            , packList = new BalanceModel() {
                                quantity = x.QTY
                                , bale = x.BALE
                                , weight = x.WEIGHT
                                , value = x.VALUE
                                , volume = x.VOLUME
                            }
                            , saleUnit = unitCodeIsNotSaleWei.Any(y => y == x.SALEUNIT) ? "N" : "Y"
                        });
                        return;
                    }
                });
            });

            dataRes.shipmentHs = dataRes.shipmentHs.OrderBy(x => x.shipmentDate).ToList();
        }
    }
}
