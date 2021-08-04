using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class OauthRenewTokenRequest : IRequestModel
    {
        public string password { get; set; }
    }
}
