using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.AvgDayAmtKPI
{
    public class AvgDayAmtKPISearchAPI : BaseAPIEngine<SearchRequest, AvgDayAmtKPIRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, AvgDayAmtKPIRes dataRes)
        {

            var tmp = ADO.AvgDateAmtKPIADO.GetInstant().Search(dataReq, this.Logger);

            var zones = ADO.ZoneAccountADO.GetInstant().Search(new SearchRequest() { ids = tmp.Select(x => x.ZoneAccount_ID.ToString()).Distinct().ToList(), status = new List<string>() { "A" } }, this.Logger);
            
            tmp.ForEach(
                x =>
                {
                    dataRes.avgDays.Add(new AvgDayAmtKPIRes.AvgDay()
                    {
                        year = x.Year,
                        zone = zones.Where(y => y.ID == x.ZoneAccount_ID).Select(y => new INTIdCodeDescriptionModel() { id = y.ID, code = y.Code, description = y.Description }).FirstOrDefault(),
                        avgPeriodDay = x.AvgPeriodDay,
                        status = x.Status,
                        lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                    });
                });
        }
    }
}
