using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class OauthChangPasswordReq : IRequestModel
    {
        public string oldPass { get; set; }
        public string newPass { get; set; }
        public string matchPass { get; set; }
    }
}
