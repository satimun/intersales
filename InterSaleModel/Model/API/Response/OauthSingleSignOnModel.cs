using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class OauthSingleSignOnModel
    {
        public string UserName;
        public string FullName;
        public string Email;
        public CodeDesModel Position;
        public CodeDesModel Department;

        public CodeDesModel Application;
        public bool AllowAccessApp;

        public long ExpireTime;
        public bool Active;

        public class CodeDesModel
        {
            public string Code;
            public string Description;
        }
    }
}
