﻿using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class LanguageActiveGroupResponse:IResponseModel
    {
        public List<LanguageActiveGroupRes> languageGroups = new List<LanguageActiveGroupRes>();
    }

    public class LanguageActiveGroupRes
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
