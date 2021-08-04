using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API.UnitType;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/UnitConvert")]
    public class UnitConvertController : Controller
    {
        [HttpGet("search")]
        public dynamic Search([FromHeader] string token, [FromQuery] string[] unitTypeIDs, [FromQuery] string[] unitTypeIDs2, [FromQuery] string search, [FromQuery] string[] status)
        {
            UnitConvertSearchAPI res = new UnitConvertSearchAPI();
            var data = new { ids = unitTypeIDs, ids2 = unitTypeIDs2, search = search, status = status };
            return res.Execute(token, data);
        }
    }
}