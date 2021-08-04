using InterSaleModel.Model.Line.Request;
using InterSaleModel.Model.Line.Response;
using Line;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.Line.Api
{
    public abstract class BaseLineApi<LRequest> where LRequest : ILRequestModel, new()
    {
        protected LineBot lineBot;
        protected string botID;
        protected abstract void ExecuteChild(LRequest dataReq, LineResponseModel dataRes);

        public LineResponseModel Execute(dynamic data = null)
        {
            LineResponseModel res = new LineResponseModel();
            try
            {
                LineConfiguration config = new LineConfiguration()
                {
                    ChannelAccessToken = "O5aVoACyLVwcCBvG8oeKb+Ks7A2eW1ZJLBlFFppr8VdjeTEMle8dxODlvvOTNLZppG0cJyPYgctBkteNG/MuR22xfuzGzPcBbG7VnlcRO8n5QDDsMyTsj4vin3nqBQhGApgzK1IVkCmBU1HHogmmQQdB04t89/1O/w1cDnyilFU="
                    , ChannelSecret = "6fb19d59a23263b64f079035fbc95736"
                };
                lineBot = new LineBot(config);

                var dataReq = data == null ? null : this.MappingRequest(data);
                this.botID = dataReq.botID;
                this.ExecuteChild(dataReq.data, res);
                res.message = "SUCCESS";
                res.status = "S";
            }
            catch (Exception ex)
            {
                res.message = ex.Message;
                res.status = "F";
            }            
            return res;
        }

        private LineRequestModel<LRequest> MappingRequest(dynamic dataReq)
        {
            string json = dataReq is string ? (string)dataReq : Newtonsoft.Json.JsonConvert.SerializeObject(dataReq);
            var d = Newtonsoft.Json.JsonConvert.DeserializeObject<LineRequestModel<LRequest>>(json);
            return d;
        }
    }
}
