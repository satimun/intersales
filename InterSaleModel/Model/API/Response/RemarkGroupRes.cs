using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class RemarkGroupRes : IResponseModel
    {
        public List<RemarkGetDataRes.RemarkGroup> remarkGroups = new List<RemarkGetDataRes.RemarkGroup>();
    }
}
