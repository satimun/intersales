using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class DiameterGroupADO : BaseADO
    {
        private static DiameterGroupADO instant;
        public static DiameterGroupADO GetInstant()
        {
            if (instant == null)
                instant = new DiameterGroupADO();
            return instant;
        }

        public List<DiameterGroupList> List(Logger logger = null)
        {
            return QuerySP<DiameterGroupList>("SP_DiameterGroup_List", null, logger).ToList();
        }
    }
}
