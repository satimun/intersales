using InterSaleApi.ADO;
using InterSaleModel.Model.Jobs.Request;
using InterSaleModel.Model.Jobs.Response;
using KKFCoreEngine.KKFException;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.Jobs
{
    public abstract class BaseJobsEngine<JRequest, JRespone> where JRequest : IJRequestModel, new() where JRespone : IJResponseModel, new()
    {
        protected abstract void ExecuteChild(JRequest dataReq, JRespone dataRes);

        public JobsResponse<JRespone> Execute(dynamic data = null)
        {
            var jobID = JobLogADO.GetInstant().Insert(this.GetType().Name, null).ID;
            JobsResponse<JRespone> res = new JobsResponse<JRespone>();
            try
            {
                var dataReq = data == null ? null : this.MappingRequest(data);
                res.data = new JRespone();
                this.ExecuteChild(dataReq, res.data);
                res.status = "S";
                res.message = "SUCCESS";
            }
            catch (Exception ex)
            {
                res.status = "F";
                res.message = ex.Message;
            }
            finally
            {
                JobLogADO.GetInstant().Update(jobID, res.status + " : " + res.message, null);
            }
            return res;
        }

        private JRequest MappingRequest(dynamic data)
        {
            string json = data is string ? (string)data : Newtonsoft.Json.JsonConvert.SerializeObject(data);
            var d = Newtonsoft.Json.JsonConvert.DeserializeObject<JRequest>(json);
            return d;
        }

    }
}
