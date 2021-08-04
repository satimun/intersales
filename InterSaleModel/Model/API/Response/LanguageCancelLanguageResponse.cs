using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class LanguageCancelLanguageResponse:IResponseModel
    {
        public List<LanguageCancelLanguageRes> languages = new List<LanguageCancelLanguageRes>();
    }

    public class LanguageCancelLanguageRes
    {
        public int id { get; set; }
        public string code { get; set; }
        public string iconURL { get; set; }
        public string description { get; set; }
        public string status { get; set; }
        public ByDateTimeModel create = new ByDateTimeModel();
        public ByDateTimeModel modify = new ByDateTimeModel();
        public ResultModel _result = new ResultModel();
    }
}
