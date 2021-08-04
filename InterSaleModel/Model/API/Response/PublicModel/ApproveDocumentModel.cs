using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response.PublicModel
{
    public class ApproveDocumentModel
    {
        public int id { get; set; }
        public string actionFlag { get; set; }
        public string flag { get; set; }
        public INTIdCodeDescriptionModel statusFlag { get; set; }
        public string by { get; set; }
        public string datetime { get; set; }
    }
}
