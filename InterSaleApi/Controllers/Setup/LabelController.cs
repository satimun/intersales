using InterSaleApi.Engine.API.Label;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/Label")]
    public class LabelController : Controller
    {
        [HttpGet("List")]
        public dynamic Search2([FromHeader] string token)
        {
            LabelList exc = new LabelList();
            return exc.Execute(token, null);
        }
    }
}
