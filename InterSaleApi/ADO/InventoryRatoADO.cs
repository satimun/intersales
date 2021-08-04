using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class InventoryRatoADO : BaseADO
    {
        private static InventoryRatoADO instant;
        public static InventoryRatoADO GetInstant()
        {
            if (instant == null)
                instant = new InventoryRatoADO();
            return instant;
        }
        private InventoryRatoADO() { }
        
        public List<InventoryRatoSeach> Search(InvTurnOverReportReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@MonthFrom", d.monthFrom);
            param.Add("@MonthTo", d.monthTo);
            param.Add("@Year", d.year);
            param.Add("@regionalZoneIDs", string.Join(',', d.regionalZoneIDs));
            param.Add("@zoneAccountIDs", string.Join(',', d.zoneAccountIDs));
            param.Add("@customerIDs", string.Join(',', d.customerIDs));
            param.Add("@deadstock", d.deadstock);

            return QuerySP<InventoryRatoSeach>("SP_InventoryRatio_Search", param, logger).ToList();
        }

        
    }
}
