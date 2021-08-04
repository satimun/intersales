using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class LanguageCancelTemplateResponse:IResponseModel
    {
        public List<LanguageCancelTemplateRes> permissionTemplates = new List<LanguageCancelTemplateRes>();
    }

    public class LanguageCancelTemplateRes
    {
        public int id { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string status { get; set; }
        public ByDateTimeModel create = new ByDateTimeModel();
        public ByDateTimeModel modify = new ByDateTimeModel();
        public ResultModel _result = new ResultModel();
    }

}
