using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class OauthRenewTokenResponse : IResponseModel
    {
        public string token { get; set; }
        public string expirydate { get; set; }
    }
}
