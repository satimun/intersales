using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanSearchOutstandingExcelAPI : ShipmentPlanSearchOutstandingAPI
    {
        protected override void ExecuteChild(ShipmentPlanSearchOutstandingRequest dataRequest, ShipmentPlanSearchOutstandingResponse dataResponse)
        {
            dataRequest.admitDateFrom = DateTimeUtil.GetDateString(new DateTime(2000, 1, 1));
            dataRequest.admitDateTo = DateTimeUtil.GetDateString(DateTime.Now.AddYears(1));
            base.ExecuteChild(dataRequest, dataResponse);
            var outstandingTmp = dataResponse.outstandings;
            dataResponse.outstandings = new List<ShipmentPlanSearchOutstandingResponse.Outstandigns>();

            for (int i = 0; i < dataRequest.orderCodes.Count; i++)
            {
                string ordCode = dataRequest.orderCodes[i];
                string prodCode = dataRequest.prodCodes[i];
                decimal qty = dataRequest.ouantitys[i];
                var o = outstandingTmp.FirstOrDefault(x => x.orderCode == ordCode && x.product.code == prodCode);
                if (o == null)
                    throw new KKFCoreEngine.KKFException.KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.V0002, "Order: "+ ordCode+" / Product: "+ prodCode);

                o.toBeShipped.quantity = qty;
                o.toBeShipped.weight = o.valuePerUnit.qpw * qty;
                o.toBeShipped.bale = o.valuePerUnit.qpb * qty;
                o.toBeShipped.value = o.valuePerUnit.qpv * qty;
                dataResponse.outstandings.Add(o);
            }
        }
    }
}
