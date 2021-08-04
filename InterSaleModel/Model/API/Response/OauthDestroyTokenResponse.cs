using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class OauthDestroyTokenResponse : IResponseModel
    {
        public string token { get; set; }
        public string status { get; set; }
    }
}
