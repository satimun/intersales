using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class OauthRequestTokenRequest : IRequestModel
    {
        public string username { get; set; }
        public string password { get; set; }
    }
}
