using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleApi.Engine.API;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/Remark")]
    public class RemarkController : Controller
    {
        [HttpGet("GetData/{token}")]
        public dynamic GetData(string token, [FromQuery] string[] groupTypes, [FromQuery] string[] status)
        {
            RemarkGetDataAPI res = new RemarkGetDataAPI();
            var data = new { groupTypes = groupTypes, status = status };
            return res.Execute(token, data);
        }

        [HttpPost("SaveGroup/{token}")]
        public dynamic SaveGroup(string token, [FromBody] dynamic data)
        {
            RemarkSaveGroupAPI res = new RemarkSaveGroupAPI();
            return res.Execute(token, data);
        }

        [HttpPost("SaveText/{token}")]
        public dynamic SaveText(string token, [FromBody] dynamic data)
        {
            RemarkSaveTextAPI res = new RemarkSaveTextAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateGroupStatus/{token}")]
        public dynamic UpdateGroupStatus(string token, [FromBody] dynamic data)
        {
            RemarkUpdateGroupStatusAPI res = new RemarkUpdateGroupStatusAPI();
            return res.Execute(token, data);
        }

        [HttpPost("UpdateTextStatus/{token}")]
        public dynamic UpdateTextStatus(string token, [FromBody] dynamic data)
        {
            RemarkUpdateTextStatusAPI res = new RemarkUpdateTextStatusAPI();
            return res.Execute(token, data);
        }

        [HttpGet("SearchGroup/{token}")]
        public dynamic ListGroup(string token, [FromQuery] string[] ids, [FromQuery] string[] groupTypes, [FromQuery] string[] status)
        {
            RemarkSearchGroupAPI res = new RemarkSearchGroupAPI();
            var data = new { ids = ids, groupTypes = groupTypes, status = status };
            return res.Execute(token, data);
        }

        [HttpGet("Search/{token}")]
        public dynamic Search(string token, [FromQuery] string[] ids, [FromQuery] string[] groupTypes, [FromQuery] string[] remarkGroupIDs, [FromQuery] string[] status)
        {
            RemarkSearchAPI res = new RemarkSearchAPI();
            var data = new { ids = ids, groupTypes = groupTypes, remarkGroupIDs = remarkGroupIDs, status = status };
            return res.Execute(token, data);
        }
    }
}
