using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanHApproveRes : IResponseModel
    {
        public List<ShipmentPlanH> shipmentPlanHs = new List<ShipmentPlanH>();

        public class ShipmentPlanH
        {
            public int id { get; set; }
            public string planDate { get; set; }
            public int planWeek { get; set; }
            public string containerCode { get; set; }
            public string status { get; set; }
            public ApproveDocumentModel salesApprove = new ApproveDocumentModel();
            public ApproveDocumentModel regionalApprove = new ApproveDocumentModel();
            public ApproveDocumentModel managerApprove = new ApproveDocumentModel();
        }
    }
}
