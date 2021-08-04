using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class CustomerGroupSaveGroupAPI : BaseAPIEngine<CustomerGroupSaveGroupRequest, CustomerGroupSaveGroupResponse>
    {
        //CustomerGroupSaveGroupResponse,CustomerGroupSaveGroupRequest
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(CustomerGroupSaveGroupRequest dataReq, CustomerGroupSaveGroupResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            for (int i = 0; i < dataReq.customerGroups.Count; i++)
            {
                CustomerGroupSaveGroupRQ tmp = new CustomerGroupSaveGroupRQ();

                try
                {
                   CustomerGroupADO.GetInstant().SaveGroup(transac, dataReq.customerGroups[i].ID,dataReq.customerGroups[i].GroupType,dataReq.customerGroups[i].Code,dataReq.customerGroups[i].Description, "", this.employeeID, this.Logger)
                    .ForEach(x => {
                        tmp.ID = x.ID;
                        tmp.GroupType = x.GroupType;
                        tmp.Code = x.Code;
                        tmp.Description = x.Description;
                        tmp.Status = x.Status;

                        tmp.create.by = BaseValidate.GetEmpName(x.CreateBy);
                        tmp.create.datetime = BaseValidate.GetDateTimeString(x.CreateDate);

                        tmp.modify.by = BaseValidate.GetEmpName(x.ModifyBy);
                        tmp.modify.datetime = BaseValidate.GetDateTimeString(x.ModifyDate);

                    }
                    );



                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    if (tmp.ID == 0)
                    {
                        tmp._result._status = "F";
                        tmp._result._message = "NOT ID " + dataReq.customerGroups[i].ID;
                    }
                    else
                    {
                        tmp._result._status = "S";
                        tmp._result._message = "SUCCESS";
                    }
                    dataRes.CustomerGroups.Add(tmp);
                }
            }

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "การอัปเดตไม่สำเร็จ");
            }
            else { transac.Commit(); }
            conn.Close();
        }
    }
}
