using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response.StatusFlag
{
    public class GetForApprovalRes : IResponseModel
    {
        public List<StatusFlag> statusFlags = new List<StatusFlag>();
        public class StatusFlag : INTIdCodeDescriptionModel
        {
            public string groupFlag { get; set; }
            public INTIdCodeDescriptionModel updateFlag { get; set; }
        }
    }
}
