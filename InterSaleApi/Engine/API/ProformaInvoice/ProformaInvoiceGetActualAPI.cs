using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ProformaInvoice
{
    public class ProformaInvoiceGetActualAPI : BaseAPIEngine<ProformaInvoiceGetActualReq, ProformaInvoiceGetActualRes>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(ProformaInvoiceGetActualReq dataReq, ProformaInvoiceGetActualRes dataRes)
        {
            var df = DateTimeUtil.GetDate(dataReq.dateFrom);
            var dt = DateTimeUtil.GetDate(dataReq.dateTo);
            ADO.ProformaInvoiceADO.GetInstant().GetActual(df.Value, dt.Value, dataReq.zoneID, dataReq.customerID, dataReq.productType, dataReq.diamerter, this.Logger).ForEach(
                x => {
                    dataRes.actuals.Add(new ProformaInvoiceGetActualRes.Actual()
                    {
                        piCode = x.piCode,
                        piDate = DateTimeUtil.GetDateString(x.piDate),
                        customer = StaticValueManager.GetInstant().sxsCustomers.Where(z => z.Code == x.customerCode).Select(z => new INTIdCodeDescriptionModel() { id = z.ID, code = z.Code, description = z.CompanyName }).FirstOrDefault(),
                        actual = new ProformaInvoiceGetActualRes.Actual.WeightValue() { weightKg = x.weightkg, amountpc = x.amountpc, value = x.value }
                    });
                }
            );
        }
    }
}
