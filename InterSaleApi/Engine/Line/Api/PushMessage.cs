using InterSaleModel.Model.Line.Request;
using InterSaleModel.Model.Line.Response;
using Line;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.Line.Api
{
    public class PushMessage : BaseLineApi<PushMessageModel>
    {
        protected override void ExecuteChild(PushMessageModel dataReq, LineResponseModel dataRes)
        {
            var msg = new TextMessage($"{dataReq.message}");
            lineBot.Push(dataReq.userID, msg);
        }
    }
}
