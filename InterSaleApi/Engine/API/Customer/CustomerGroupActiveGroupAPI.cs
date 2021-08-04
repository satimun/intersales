﻿using InterSaleApi.ADO;
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
    public class CustomerGroupActiveGroupAPI : BaseAPIEngine<CustomerGroupActiveGroupRequest, CustomerGroupActiveGroupResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(CustomerGroupActiveGroupRequest dataReq, CustomerGroupActiveGroupResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            for (int i = 0; i < dataReq.ids.Count; i++)
            {
                CustomerGroupActiveGroupRQ tmp = new CustomerGroupActiveGroupRQ();
                try
                {
                    
                    CustomerGroupADO.GetInstant().UpdateStatus(transac, dataReq.ids[i], "A", this.employeeID, this.Logger)
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
                        tmp._result._message = "NOT ID "+ dataReq.ids[i];
                    } else
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
