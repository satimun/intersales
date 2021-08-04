using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class RemarkSaveTextReq : IRequestModel
    {
        public List<RemarkGetDataRes.RemarkGroup.Remark> remarks { get; set; }
    }
}
