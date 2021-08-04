using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API;
using InterSaleModel.Model.API;
using InterSaleApi.Engine.API.Country;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/CountryGroup")]
    public class CountryGroupController : Controller
    {
        [HttpGet("pricelist/{token}")]
        public dynamic PriceList(string token)
        {
            CountryGroupPriceListAPI res = new CountryGroupPriceListAPI();
            return res.Execute(token);
        }


        [HttpGet("Search/{token}")]
        public dynamic Search1(string token, [FromQuery] string[] ids, [FromQuery] string[] countryIDs, [FromQuery] string[] customerIDs, [FromQuery] string[] groupTypes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, ids1 = countryIDs, ids2 = customerIDs, groupTypes = groupTypes, search = search, status = status };
            CountryGroupSearchAPI res = new CountryGroupSearchAPI();
            return res.Execute(token, data);
        }

        [HttpGet("Search")]
        public dynamic Search([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] countryIDs, [FromQuery] string[] customerIDs, [FromQuery] string[] groupTypes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, ids1 = countryIDs, ids2 = customerIDs, groupTypes = groupTypes, search = search, status = status };
            CountryGroupSearchAPI res = new CountryGroupSearchAPI();
            return res.Execute(token, data);
        }

        [HttpPost("Save")]
        public dynamic Save([FromHeader] string token, [FromBody] dynamic data)
        {
            CountryGroupSaveAPI res = new CountryGroupSaveAPI();
            return res.Execute(token, data);
        }

        [HttpPost("MoveCountry")]
        public dynamic MoveCountry([FromHeader] string token, [FromBody] dynamic data)
        {
            var res = new CountryGroupMoveCountryAPI();
            return res.Execute(token, data);
        }

        //[HttpPost("SaveGroup")]
        //public dynamic SaveGroup([FromHeader] string token, [FromBody] dynamic data)
        //{
        //    CountryGroupSaveAPI res = new CountryGroupSaveAPI();
        //    return res.Execute(token, data);
        //}

        //[HttpGet("ListByType/{token}")]
        //public dynamic List(string token, [FromQuery] string groupType)
        //{
        //    var data = new { groupType = groupType };
        //    CountryGroupListByTypeAPI res = new CountryGroupListByTypeAPI();
        //    return res.Execute(token, data);
        //}

        //[HttpGet("MoveCustomerMapping/{token}")]
        //public dynamic MoveCountryMapping(string token, [FromQuery] string countryGroupID, [FromQuery] string[] countryIDs)
        //{ 
        //    var data = new { countryGroupID = countryGroupID, countryIDs = countryIDs };
        //    CountryGroupMoveCountryMappingAPI res = new CountryGroupMoveCountryMappingAPI();
        //    return res.Execute(token, data);
        //}

        //[HttpPost("cancelCustomerMapping/{token}")]
        //public dynamic CancelCountryMapping(string token, [FromBody] dynamic data)
        //{ 
        //    CountryGroupCancelCountryMappingAPI res = new CountryGroupCancelCountryMappingAPI();
        //    return res.Execute(token, data);
        //}

        [HttpGet("SearchCountry")]
        public dynamic SearchCountry([FromHeader] string token, [FromQuery] string[] ids, [FromQuery] string[] countryIDs, [FromQuery] string[] groupTypes, [FromQuery] string search, [FromQuery] string[] status)
        {
            var data = new { ids = ids, ids1 = countryIDs, groupTypes = groupTypes, search = search, status = status };
            CountryGroupSearchCountryAPI res = new CountryGroupSearchCountryAPI();
            return res.Execute(token, data);
        }
    }
}
