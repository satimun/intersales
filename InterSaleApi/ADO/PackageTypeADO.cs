using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class PackageTypeADO : BaseADO
    {
        private static PackageTypeADO instant;
        public static PackageTypeADO GetInstant()
        {
            if (instant == null)
                instant = new PackageTypeADO();
            return instant;
        }
        private PackageTypeADO() { }

        public List<sxsPackageType> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_PackageType_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsPackageType>(cmd, param, logger).ToList();
        }
    }
}
