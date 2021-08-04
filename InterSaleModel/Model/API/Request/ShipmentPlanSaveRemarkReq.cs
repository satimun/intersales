using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanSaveRemarkReq : IRequestModel
    {
        public List<ShipmentPlanGetRemarkRes.PlanRemark> planRemarks { get; set; }
    }
}
