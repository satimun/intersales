using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class RemarkGetDataRes : IResponseModel
    {
        public List<RemarkGroup> remarkGroups = new List<RemarkGroup>();
        public class RemarkGroup
        {
            public int id { get; set; }
            public string code { get; set; }
            public string description { get; set; }
            public string groupType { get; set; }
            public string status { get; set; }
            public ByDateTimeModel lastUpdate { get; set; }
            public ResultModel _result = new ResultModel();

            public List<Remark> remarks = new List<Remark>();
            public class Remark
            {
                public int? id { get; set; }
                public int remarkGroupID { get; set; }
                public string code { get; set; }
                public string description { get; set; }
                public string status { get; set; }
                public ByDateTimeModel lastUpdate { get; set; }
                public ResultModel _result = new ResultModel();
            }
        }
    }
}
