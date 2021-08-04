using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using InterSaleApi.Engine.Line;
using InterSaleApi.Engine.Line.Api;
using InterSaleApi.Engine.Line.Bot;
using Line;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Protocols;
using Newtonsoft.Json;

namespace InterSaleApi.Controllers.Line
{
    [Produces("application/json")]
    [Route("v1/api/Line")]
    public class JobsController : Controller
    {
        [HttpPost("IntersalesLineBot")]
        public dynamic IntersalesLineBot()
        {
            //var res = BaseLineEngine.lineBotService.Handle(HttpContext);

            //var client = new HttpClient()
            //{
            //    BaseAddress = new Uri("https://api.line.me/v2/bot/")
            //};
            //client.DefaultRequestHeaders.Add("Authorization", $"Bearer O5aVoACyLVwcCBvG8oeKb+Ks7A2eW1ZJLBlFFppr8VdjeTEMle8dxODlvvOTNLZppG0cJyPYgctBkteNG/MuR22xfuzGzPcBbG7VnlcRO8n5QDDsMyTsj4vin3nqBQhGApgzK1IVkCmBU1HHogmmQQdB04t89/1O/w1cDnyilFU=");
            //string userId = "";
            //HttpResponseMessage response = await client.GetAsync($"profile/{userId}");
            //var json = Newtonsoft.Json.JsonConvert.SerializeObject(request);
            //var obj = Newtonsoft.Json.JsonConvert.DeserializeObject(json);
            //var tmp = GetProfile("U91e077e4e5016df5eb43661f92c1bff1");

            IntersalesLineBot hadle = new IntersalesLineBot();
            hadle.Execute(this.HttpContext);

            return HttpStatusCode.OK;
        }

        //internal sealed class UserProfile
        //{
        //    public string DisplayName { get; set; }

        //    public Uri PictureUrl { get; set; }

        //    public string StatusMessage { get; set; }

        //    public string UserId { get; set; }
        //}

        //public async Task<IUserProfile> GetProfile(string userId)
        //{
        //    var client = new HttpClient()
        //    {
        //        BaseAddress = new Uri("https://api.line.me/v2/bot/")
        //    };
        //    client.DefaultRequestHeaders.Add("Authorization", $"Bearer O5aVoACyLVwcCBvG8oeKb+Ks7A2eW1ZJLBlFFppr8VdjeTEMle8dxODlvvOTNLZppG0cJyPYgctBkteNG/MuR22xfuzGzPcBbG7VnlcRO8n5QDDsMyTsj4vin3nqBQhGApgzK1IVkCmBU1HHogmmQQdB04t89/1O/w1cDnyilFU=");

        //    HttpResponseMessage response = await client.GetAsync($"profile/{userId}");
        //    //await response.CheckResult();

        //    HttpContent self = response.Content;

        //    string body = await self.ReadAsStringAsync();

        //    //var json = Newtonsoft.Json.JsonConvert.SerializeObject(body);
        //    var tmp = Newtonsoft.Json.JsonConvert.DeserializeObject<UserProfile>(body);
        //    return null;
        //}

        [HttpPost("PushMessage")]
        public dynamic PushMessage([FromBody] dynamic data)
        {
            PushMessage res = new PushMessage();
            return res.Execute(data);
        }


    }
}