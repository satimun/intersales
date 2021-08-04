using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.API.UnitType;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/UnitType")]
    public class UnitTypeController : Controller
    {
        [HttpGet("Search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids, [FromQuery] string[] groupTypes, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            UnitTypeSearchAPI res = new UnitTypeSearchAPI();
            //data = "{'groupType' : 'S' , 'code': 'kg'}";
            var data = new { ids = ids, groupTypes = groupTypes, codes = codes, search = search, status = status };
            return res.Execute(token, data);
        }

        [HttpGet("Search")]
        public dynamic Search2([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] groupTypes, [FromQuery] string[] codes, [FromQuery] string search, [FromQuery] string[] status)
        {
            UnitTypeSearchAPI res = new UnitTypeSearchAPI();
            var data = new { ids = ids, groupTypes = groupTypes, codes = codes, search = search, status = status };
            return res.Execute(token, data);
        }

        [HttpGet("ProductTypeList")]
        public dynamic ProductTypeList([FromHeader] string token, [FromQuery] int productTypeID)
        {
            UnitTypeProductTypeListAPI res = new UnitTypeProductTypeListAPI();
            var data = new { id = productTypeID};
            return res.Execute(token, data);
        }
    }
}
