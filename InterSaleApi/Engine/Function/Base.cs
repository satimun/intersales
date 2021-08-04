using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.Function
{
    public static class Base
    {
        public static void PriceUpdateToKKFConnect(PriceJobUpdateReq dataReq)
        {
            string req = JsonConvert.SerializeObject(dataReq);
            string body;
            string Url = StaticValueManager.GetInstant().KKFConnectAPIUrl + "/jobs/price/update";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(Url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var content = new StringContent(req, Encoding.UTF8, "application/json");

                HttpResponseMessage response = new HttpResponseMessage();
                response = client.PostAsync(Url, content).Result;

                HttpContent self = response.Content;
                body = self.ReadAsStringAsync().Result;

                if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                {
                    throw new Exception("ไม่สามารถติดต่อ Server ได้");
                }
            }
        }
    }
}
