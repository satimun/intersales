using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class OauthCheckPermissionResponse : IResponseModel
    {
        public List<Permission> permissions = new List<Permission>();
    }

    public class Permission
    {
        public int id { get; set; }
        public string code { get; set; }
        public List<string> roles = new List<string>();
        public string authorize { get; set; }
    }
}
