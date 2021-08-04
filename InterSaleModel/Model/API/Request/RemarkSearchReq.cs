using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class RemarkSearchReq : IRequestModel
    {
        public List<string> ids = new List<string>();
        public List<string> groupTypes = new List<string>();
        public List<string> remarkGroupIDs = new List<string>();
        public List<string> status = new List<string>();
    }
}
