using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KKFCoreEngine.Util;

namespace InterSaleApi.ADO
{
    public class ZoneAccountADO : BaseADO
    {
        private static ZoneAccountADO instant;
        public static ZoneAccountADO GetInstant()
        {
            if (instant == null)
                instant = new ZoneAccountADO();
            return instant;
        }
        private ZoneAccountADO() { }

        public List<sxsZoneAccount> Search(string search, List<string> status, Logger logger = null)
        {
            string cmd = "exec SP_ZoneAccount_Search @search,@status";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@search", search ?? string.Empty);
            param.Add("@status", string.Join(',', status));
            var res = Query<sxsZoneAccount>(cmd, param, logger).ToList();
            return res;
        }

        public List<sxsZoneAccount> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", d.ids.ListNull());
            param.Add("@status", d.status.ListNull());

            string cmd = "SELECT * FROM sxsZoneAccount " +
                $"WHERE (@ID IS NULL OR ID IN ('{ d.ids.Join("','") }')) " +
                $"AND (@Status IS NULL OR Status IN ('{ d.status.Join("','") }')) " +
                ";";

            return Query<InterSaleModel.Model.Entity.sxsZoneAccount>(cmd, param, logger).ToList();
        }
    }
}
