using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response.PublicModel;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.PriceStd
{
    public class PriceStdValueUpdateStatusAPI : BaseAPIEngine<UpdateStatusReq, UpdateStatusRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(UpdateStatusReq dataReq, UpdateStatusRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();
            //if(dataReq.type == "R")
            //{
            //    PriceStdRangeDADO.GetInstant().UpdateStatus(transac, new UpdateStatusReq() { ids = dataReq.ids1, status = dataReq.status }, employeeID, Logger).ForEach(x => {
            //        if(x.status != dataReq.status) isSuccess = false;
            //    });
            //}
            //else
            //{
            //    PriceStdProdADO.GetInstant().UpdateStatus(transac, new UpdateStatusReq() { ids = dataReq.ids1, status = dataReq.status }, employeeID, Logger).ForEach(x => {
            //        if (x.status != dataReq.status) isSuccess = false;
            //    });
            //}

            PriceStdValueADO.GetInstant().UpdateStatus(transac, dataReq, this.employeeID, this.Logger).ForEach(x => {
                var tmp = new UpdateStatusRes.idStatus();
                try
                {
                    tmp.id = x.id;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    if (x.status != dataReq.status) throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Unable to update status.");
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.results.Add(tmp);
                }
            });

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.S0002, "");
            }
            else { transac.Commit(); }
            conn.Close();
        }
    }
}
