using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Line;
using Microsoft.AspNetCore.Http;

namespace InterSaleApi.Engine.Line.Bot
{
    public class IntersalesLineBot : BaseLineBot
    {
        private string userID { get; set; } 

        protected override void ExecuteChild(IEnumerable<ILineEvent> events)
        {
            foreach (var evt in events)
            {
                this.userID = evt.Source.User.Id;
            }
            var res = pushContent();
        }

        protected async Task pushContent()
        {

            //await lineBot.Reply(evt.ReplyToken, response);
            //var user = await lineBot.GetProfile(userID);
            var res = new TextMessage($"สวัสดี คุณ : {userID}");
            await lineBot.Push(userID, res);
        }
    }
}
