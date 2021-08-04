using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class OauthSingleSignOnReq : IRequestModel
    {
        public string AccessToken;
        public string Token;
    }
}
