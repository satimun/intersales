using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.API.Country;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/Country")]

    public class CountryController : Controller
    {
        //[HttpGet("list/{token}")]
        //public dynamic List(string token)
        //{
        //    CountryGroupListAPI res = new CountryGroupListAPI();
        //    return res.Execute(token);
        //}

        [HttpGet("search/{token}")]
        public dynamic Search(string token, [FromQuery] int countryGroupID)
        {
            var data = new { countryGroupID = countryGroupID };
            CountrySearchAPI res = new CountrySearchAPI();
            return res.Execute(token, data);
        }

        [HttpGet("List/{token}")]
        public dynamic List(string token)
        {
            CountryListAPI res = new CountryListAPI();
            return res.Execute(token);
        }

        [HttpGet("SearchCountryGroup")]
        public dynamic SearchCountryGroup([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] countryGroupIDs, [FromQuery] string[] groupTypes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, ids1 = countryGroupIDs, groupTypes = groupTypes, search = search, status = status };
            CountrySearchCountryGroupAPI res = new CountrySearchCountryGroupAPI();
            return res.Execute(token, data);
        }
    }
}
