using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class OauthCheckPermissionRequest : IRequestModel
    {
        public string type { get; set; }
        public string[] permissions { get; set; }
    }
}
