using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class LanguageSaveGroupRequest : IRequestModel
    {
        public List<LanguageSaveGroupReq> languages = new List<LanguageSaveGroupReq>();
    }

    public class LanguageSaveGroupReq
    {
        public int id { get; set; }
        public string code { get; set; }
        public string description { get; set; }        

    }
}
