using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API.ProformaInvoice;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.ProfomaInvoice
{
    [Produces("application/json")]
    [Route("v1/api/ProformaInvoice")]
    public class ProformaInvoiceController : Controller
    {
        [HttpPost("Report")]
        public dynamic Report([FromHeader] string token, [FromBody] dynamic data)
        {
            ProformaInvoiceCompareForecastReportAPI res = new ProformaInvoiceCompareForecastReportAPI();
            return res.Execute(token, data);
        }

        [HttpPost("Report2")]
        public dynamic Report2([FromHeader] string token, [FromBody] dynamic data)
        {
            ProformaInvoiceCompareForecastReport2API res = new ProformaInvoiceCompareForecastReport2API();
            return res.Execute(token, data);
        }

        [HttpPost("GetActual")]
        public dynamic GetActual([FromHeader] string token, [FromBody] dynamic data)
        {
            ProformaInvoiceGetActualAPI res = new ProformaInvoiceGetActualAPI();
            return res.Execute(token, data);
        }
    }
}