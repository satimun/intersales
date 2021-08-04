using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class PermissionADO : BaseADO
    {
        private static PermissionADO instant;
        public static PermissionADO GetInstant()
        {
            if (instant == null)
                instant = new PermissionADO();
            return instant;
        }
        private PermissionADO() { }

        public List<sxsPermission> CheckPermission(string token, string type, string permissions, Logger logger = null)
        {
            string cmd = "exec SP_Permission_CheckPermission @token, @type, @permissions";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@token", token);
            param.Add("@type", type);
            param.Add("@permissions", permissions);
            
            return Query<sxsPermission>(cmd, param, logger).ToList();
        }
    }
}
