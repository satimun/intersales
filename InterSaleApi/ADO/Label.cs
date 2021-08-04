using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class Label : BaseADO
    {
        private static Label instant;
        public static Label GetInstant()
        {
            if (instant == null)
                instant = new Label();
            return instant;
        }

        public List<INTIdCodeDescriptionModel> List()
        {
            return QuerySP<INTIdCodeDescriptionModel>("SP_Label_List", null, null).ToList();
        }
    }
}
