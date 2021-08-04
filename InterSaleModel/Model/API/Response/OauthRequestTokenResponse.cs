using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class OauthRequestTokenResponse : IResponseModel
    {
        public string token { get; set; }
        public string username { get; set; }
        public string expiryDate { get; set; }
    }
}
