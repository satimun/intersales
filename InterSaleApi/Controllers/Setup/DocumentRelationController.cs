﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/DocumentRelation")]
    public class DocumentRelationController : Controller
    {
        [HttpGet("search/{token}")]
        public dynamic Search(string token, [FromQuery] dynamic data)
        {
            throw new Exception("404");
            //return null;
        }
    }
}
