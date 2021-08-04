using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response.PublicModel
{
    public class IdCodeDescriptionModel
    {
        public int ID;
        public string Code;
        public string Description;
        public string Status;
        public int CreateBy;
        public DateTime CreateDate;
        public int? ModifyBy;
        public DateTime? ModifyDate;
    }
}
