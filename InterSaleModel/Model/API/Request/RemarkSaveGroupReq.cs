using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class RemarkSaveGroupReq : IRequestModel
    {
        public List<RemarkGetDataRes.RemarkGroup> remarkGroups { get; set; }
    }
}
