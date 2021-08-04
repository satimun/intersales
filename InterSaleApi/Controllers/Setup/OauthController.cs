using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.API.Oauth;

namespace InterSaleApi.Controllers.Setup
{
    [Produces("application/json")]
    [Route("v1/api/oauth")]
    public class OAuthController : Controller
    {
        [HttpPost("requestToken")]
        public dynamic RequestToken([FromHeader] string token, [FromBody] dynamic data)
        {
            //data = JsonConvert.SerializeObject(data);
            OauthRequestTokenAPI res = new OauthRequestTokenAPI();
            return res.Execute(token, data);
        }

        [HttpPost("destroyToken")]
        public dynamic DestroyToken([FromHeader] string token)
        {
            OauthDestroyTokenAPI res = new OauthDestroyTokenAPI();
            return res.Execute(token);
        }

        [HttpPost("renewToken")]
        public dynamic RenewToken([FromHeader] string token, [FromBody] dynamic data)
        {
            //data = JsonConvert.SerializeObject(data);
            OauthRenewTokenAPI res = new OauthRenewTokenAPI();
            return res.Execute(token, data);
        }

        [HttpGet("getTokenState")]
        public dynamic GetTokenState([FromHeader] string token)
        {
            OauthGetTokenStatusAPI res = new OauthGetTokenStatusAPI();
            return res.Execute(token);
        }

        [HttpPost("checkpermission")]
        public dynamic checkPermission([FromHeader] string token, [FromBody] dynamic data)
        {
            //data = JsonConvert.SerializeObject(data);
            OauthCheckPermissionAPI res = new OauthCheckPermissionAPI();
            return res.Execute(token, data);
        }

        [HttpPost("ChangePassword")]
        public dynamic ChangePassword([FromHeader] string token, [FromBody] dynamic data)
        {
            //data = JsonConvert.SerializeObject(data);
            OauthChangePasswordAPI res = new OauthChangePasswordAPI();
            return res.Execute(token, data);
        }

        [HttpPost("SingleSignOn")]
        public dynamic SingleSignOn([FromHeader] string AccessToken, [FromHeader] string Token)
        {
            var data = new { AccessToken = AccessToken, Token = Token };
            OauthSingleSignOn res = new OauthSingleSignOn();
            return res.Execute(Token, data);
        }


    }
}

