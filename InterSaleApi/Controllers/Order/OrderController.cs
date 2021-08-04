using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API.Order;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Order
{
    [Produces("application/json")]
    [Route("v1/api/Order")]
    public class OrderController : Controller
    {

        [HttpPost("Report")]
        public dynamic Search([FromHeader] string token, [FromBody] dynamic data)
        {
            var res = new OrderOnhandReport2();
            return res.Execute(token, data);
        }

    }
}