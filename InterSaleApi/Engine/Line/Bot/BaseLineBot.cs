using Line;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.Line.Bot
{
    public abstract class BaseLineBot
    {
        protected LineBot lineBot;
        protected abstract void ExecuteChild(IEnumerable<ILineEvent> events);
        //protected abstract void TextType();
        //protected abstract void VideoType();
        //protected abstract void AudoType();
        //protected abstract void ImageType();
        //protected abstract void LocationType();
        //protected abstract void StickerType();

        public void Execute(HttpContext context)
        {
            if (context.Request.Method != HttpMethods.Post) return;

            LineConfiguration config = new LineConfiguration()
            {
                ChannelAccessToken = "O5aVoACyLVwcCBvG8oeKb+Ks7A2eW1ZJLBlFFppr8VdjeTEMle8dxODlvvOTNLZppG0cJyPYgctBkteNG/MuR22xfuzGzPcBbG7VnlcRO8n5QDDsMyTsj4vin3nqBQhGApgzK1IVkCmBU1HHogmmQQdB04t89/1O/w1cDnyilFU="
                , ChannelSecret = "6fb19d59a23263b64f079035fbc95736"
            };
            lineBot = new LineBot(config);

            var res = Handle(context.Request);
        }

        private async Task Handle(HttpRequest request)
        {
            var events = await lineBot.GetEvents(request);
            this.ExecuteChild(events);
        }
    }
}
