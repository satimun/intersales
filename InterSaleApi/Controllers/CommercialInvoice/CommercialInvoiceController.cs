using InterSaleApi.Engine.API.CommercialInvoice;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Controllers.CommercialInvoice
{
    [Produces("application/json")]
    [Route("v1/api/CommercialInvoice")]
    public class CommercialInvoiceController : Controller
    {
        [HttpPost("ItemsReport")]
        public dynamic Report([FromHeader] string token, [FromBody] dynamic data)
        {
            CommercialInvoiceItemsReport res = new CommercialInvoiceItemsReport();
            return res.Execute(token, data);
        }
    }
}
