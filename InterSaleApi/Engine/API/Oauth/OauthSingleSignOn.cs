using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.KKFException;
using KKFCoreEngine.Util;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Oauth
{
    public class OauthSingleSignOn : BaseAPIEngine<OauthSingleSignOnReq, OauthRequestTokenResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(OauthSingleSignOnReq dataReq, OauthRequestTokenResponse dataRes)
        {
            string body;
            string Url = StaticValueManager.GetInstant().SingleSignOnUrl + "/api/Oauth/SignOn/APP01";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(Url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Add("AccessToken", dataReq.AccessToken);
                client.DefaultRequestHeaders.Add("Token", dataReq.Token);

                HttpResponseMessage response = new HttpResponseMessage();
                response = client.GetAsync(Url).Result;

                HttpContent self = response.Content;
                body = self.ReadAsStringAsync().Result;

                if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                {
                    throw new KKFException(null, KKFCoreEngine.Constant.KKFExceptionCode.U0000, "ไม่สามารถติดต่อ Server ได้");
                }
            }

            OauthSingleSignOnModel req;
            try
            {
                req = JsonConvert.DeserializeObject<OauthSingleSignOnModel>(body);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new KKFException(null, KKFCoreEngine.Constant.KKFExceptionCode.U0000, "ไม่สามารถติดต่อ Server ได้");
            }

            if (req.UserName == null)
            {
                dynamic tmp = JsonConvert.DeserializeObject<dynamic>(body);
                if (((string)tmp.code).Contains("O0"))
                {
                    throw new KKFException(null, KKFCoreEngine.Constant.KKFExceptionCode.O9001, "");
                }
                throw new Exception((string)tmp.message);
            }

            if (req != null)
            {
                if (!req.Active)
                {
                    throw new KKFException(null, KKFCoreEngine.Constant.KKFExceptionCode.O9001, "");
                }
                if (DateTimeUtil.NumberToDateTime(req.ExpireTime).Value.Ticks < DateTime.Now.Ticks)
                {
                    throw new KKFException(null, KKFCoreEngine.Constant.KKFExceptionCode.O9001, "");
                }

                //var user = StaticValueManager.GetInstant().sxsEmployee.Find(v => v.Code == req.UserName);
                var user = ADO.EmployeeADO.GetInstant().Get(req.UserName);

                if (user == null)
                {
                    ADO.EmployeeADO.GetInstant().Sync(req.UserName);
                    user = ADO.EmployeeADO.GetInstant().Get(req.UserName);
                    if (user == null)
                    {
                        throw new KKFException(null, KKFCoreEngine.Constant.KKFExceptionCode.OU001, ""); 
                    }
                }
                if (user.Status != "A") { throw new KKFException(null, KKFCoreEngine.Constant.KKFExceptionCode.OU002, ""); }

                var token = new InterSaleModel.Model.Entity.sxtToken()
                {
                    Code = dataReq.Token,
                    Employee_ID = user.ID,
                    ExpiryDate = DateTimeUtil.NumberToDateTime(req.ExpireTime).Value,
                    CreateBy = user.ID,
                    ModifyBy = user.ID,
                    Status = "A"
                };

                ADO.TokenADO.GetInstant().Save(token);

                dataRes.token = token.Code;
                dataRes.expiryDate = BaseValidate.GetDateTimeISO(token.ExpiryDate);
                dataRes.username = BaseValidate.GetEmpName(token.Employee_ID);
            }
        }
    }
}
