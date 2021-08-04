using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class MaterialGroupADO : BaseADO
    {
        private static MaterialGroupADO instant;
        public static MaterialGroupADO GetInstant()
        {
            if (instant == null)
                instant = new MaterialGroupADO();
            return instant;
        }

        public List<sxsMaterialGroup> ListAll(Logger logger = null)
        {
            string cmd = "SELECT * FROM sxsMaterialGroup";
            return Query<sxsMaterialGroup>(cmd, null, logger).ToList();
        }
    }
}
