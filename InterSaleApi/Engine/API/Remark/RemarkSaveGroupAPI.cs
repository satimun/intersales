using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class RemarkSaveGroupAPI : BaseAPIEngine<RemarkSaveGroupReq, RemarkGroupRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(RemarkSaveGroupReq dataReq, RemarkGroupRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.remarkGroups.ForEach( x => {
                var tmp = new RemarkGetDataRes.RemarkGroup();
                try
                {
                    var res = RemarkADO.GetInstant().SaveGroup(transac, x, this.employeeID, this.Logger).FirstOrDefault();
                    tmp.id = res.RemarkGroup_ID;
                    tmp.code = res.RemarkGroup_Code;
                    tmp.description = res.RemarkGroup_Description;
                    tmp.groupType = res.RemarkGroup_GroupType;
                    tmp.lastUpdate = BaseValidate.GetByDateTime(res.RemarkGroup_LastUpdateBy, res.RemarkGroup_LastUpdateDate);
                    tmp.status = res.RemarkGroup_Status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.remarkGroups.Add(tmp);
                }
                
            });
                        
            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "ไม่สามารถบันทึกข้อมูลได้");
            }
            else { transac.Commit(); }
            conn.Close();

        }
    }
}
