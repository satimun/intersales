using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class RoleADO : BaseADO
    {
        private static RoleADO instant;
        public static RoleADO GetInstant()
        {
            if (instant == null)
                instant = new RoleADO();
            return instant;
        }
        private RoleADO() { }

        public List<sxsRole> GetByPermissionID(int permissionID, Logger logger = null)
        {
            string cmd = "exec SP_Role_GetByPermissionID @permissionID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@permissionID", permissionID);

            return Query<sxsRole>(cmd, param, logger).ToList();
        }
    }
}
