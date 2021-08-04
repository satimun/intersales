
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class RemarkRes : IResponseModel
    {
        public List<RemarkGetDataRes.RemarkGroup.Remark> remarks = new List<RemarkGetDataRes.RemarkGroup.Remark>();
    }
}
