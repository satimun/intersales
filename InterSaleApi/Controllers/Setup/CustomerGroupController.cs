using InterSaleApi.Engine.API;
using InterSaleModel.Model.API;
using InterSaleModel.Model.Entity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/CustomerGroup")]
    public class CustomerGroupController: Controller
    {

   
        [HttpGet("Search/{token}")]
        public dynamic Search(string token, [FromQuery] string search, [FromQuery] string groupType, [FromQuery] string[] Status)
        {
            var data = new { search = (search == null ? "" : search), groupType = groupType, Status= Status };
            CustomerGroupSearchAPI res = new CustomerGroupSearchAPI();           
            return res.Execute(token, data);
            
           // return "Hi Front";
        }

        [HttpGet("SearchCustomer/{token}")]
        public dynamic SearchCustomer(string token, [FromQuery] string search, [FromQuery] string[] customerGroupIDs)
        {
            var data = new { search = (search == null ? "" : search), customerGroupIDs = customerGroupIDs };
            CustomerGroupSearchCustomerAPI res = new CustomerGroupSearchCustomerAPI();
            return res.Execute(token, data);

            // return "Hi Front";
        }

        [HttpPost("ActiveGroup/{token}")]
        public dynamic ActiveGroup(string token, [FromBody] dynamic data)
        {
            //data = JsonConvert.SerializeObject(data);
            CustomerGroupActiveGroupAPI res = new CustomerGroupActiveGroupAPI();
            return res.Execute(token, data);

            // return "Hi Front";
        }

        [HttpPost("InactiveGroup/{token}")]
        public dynamic InactiveGroup(string token, [FromBody] dynamic data)
        {
            //data = JsonConvert.SerializeObject(data);
            CustomerGroupInactiveGroupAPI res = new CustomerGroupInactiveGroupAPI();
            return res.Execute(token, data);
             
        }

        [HttpPost("CancelGroup/{token}")]
        public dynamic CancelGroup(string token, [FromBody] dynamic data)
        {
            //data = JsonConvert.SerializeObject(data);
            CustomerGroupCancelGroupAPI res = new CustomerGroupCancelGroupAPI();
            return res.Execute(token, data);
             
        }

        [HttpPost("SaveGroup/{token}")]
        public dynamic SaveGroup(string token, [FromBody] dynamic data)
        {
            //data = JsonConvert.SerializeObject(data);
            CustomerGroupSaveGroupAPI res = new CustomerGroupSaveGroupAPI();
            return res.Execute(token, data);
        }

        [HttpGet("ListByType/{token}")]
        public dynamic List(string token, [FromQuery] string groupType)
        {
            var data = new { groupType = groupType };
            CustomerGroupListByTypeAPI res = new CustomerGroupListByTypeAPI();
            return res.Execute(token,data);
        }

        [HttpPost("MoveCustomerMapping/{token}")]
        public dynamic MoveCustomerMapping(string token, [FromBody] dynamic data)
        { //CustomerGroupMoveCustomerMapping
            ///var data = new { customerGroupID = customerGroupID, customerIDs = customerIDs };
            CustomerGroupMoveCustomerMappingAPI res = new CustomerGroupMoveCustomerMappingAPI();
            return res.Execute(token, data);
        }

        [HttpPost("CancelCustomerMapping/{token}")]
        public dynamic CancelCustomerMapping(string token, [FromBody] dynamic data)
        { //CustomerGroupCancelCustomerMapping

            CustomerGroupCancelCustomerMappingAPI res = new CustomerGroupCancelCustomerMappingAPI();
            return res.Execute(token, data);
        }

        
    }
}
