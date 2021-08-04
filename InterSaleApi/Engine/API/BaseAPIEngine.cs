using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleModel.Model.API.Request;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.KKFException;
using InterSaleApi.ADO;
using System.Diagnostics;
using System.Text;

namespace InterSaleApi.Engine.API
{
    public abstract class BaseAPIEngine<TRequest,TResponse>
        where TRequest : IRequestModel, new()
        where TResponse : IResponseModel, new()
    {
        private Logger _Logger { get; set; }
        protected Logger Logger
        {
            get { return this._Logger; }
            set
            {
                if (value == null)
                {
                    try { LoggerManager.InitInstant(); } catch (Exception ex) { Debug.WriteLine(ex.Message); }
                    this._Logger = LoggerManager.GetLogger("UNITTEST");
                }
                else this._Logger = value;
            }
        }

        protected int employeeID { get; set; }

        protected string token { get; set; }

        protected abstract string PermissionKey { get; }
        protected abstract void ExecuteChild(TRequest dataRequest, TResponse dataResponse);
        public TResponse ExecuteResponse(string token, TRequest dataRequest, Logger logger = null)
        {
            this.Logger = logger;
            TResponse dataResponse = new TResponse();
            this.ExecuteChild(dataRequest, dataResponse);
            return dataResponse;
        }

        public APIResponseModel<TResponse> Execute(string token, dynamic dataRequset = null)
        {
            //int logID = 0;
            string StackTraceMsg = string.Empty;
            
            APIResponseModel<TResponse> res = new APIResponseModel<TResponse>();
            try
            {

                this.Logger = LoggerManager.GetLogger(this.GetType().Name);
                this.token = token;

                this.employeeID = 0;
                var employeeName = "";
                EmployeeADO.GetInstant().GetByToken(token).ForEach( x => { this.employeeID = x.ID; employeeName = x.Name; });
                
                string reqStr = dataRequset != null ? dataRequset.ToString() : "NULL";

                //logID = APILogADO.GetInstant().Insert(this.Logger.RefID, token, this.GetType().Name, employeeID, employeeName, Environment.MachineName, reqStr);

                this.Logger.LogBegin();
                StringBuilder msg = new StringBuilder();
                msg.Append("Data Request = ");
                msg.Append(reqStr);
                this.Logger.LogInfo(msg.ToString());              
                
                var dataReq = dataRequset == null ? null : this.MappingRequest(dataRequset);
                res.data = new TResponse();

                if (this.GetType().Name.IndexOf("Oauth") == -1)
                    this.ValidatePermission();

                this.ExecuteChild(dataReq, res.data);
                res.status = "S";
                res.message = "SUCCESS";
            }
            catch (KKFException ex)
            {
                res.status = "F";
                res.message = ex.Message;
                StackTraceMsg = ex.StackTrace;
            }
            catch (Exception ex)
            {
                res.status = "F";
                res.message = ex.Message;
                StackTraceMsg = ex.StackTrace;
                new KKFException(this.Logger, ex.Message);
            }
            finally
            {
                if (this.Logger != null)
                {
                    this.Logger.LogInfo("DATA RESPONSE = " + Newtonsoft.Json.JsonConvert.SerializeObject(res));
                    this.Logger.LogEnd();
                    this.Logger.Dispose();
                }

                //APILogADO.GetInstant().Update(logID, res.status, res.message, Newtonsoft.Json.JsonConvert.SerializeObject(res), StackTraceMsg);
            }
            return res;
        }

        private TRequest MappingRequest(dynamic dataRequset)
        {
            string json = dataRequset is string ? (string)dataRequset : Newtonsoft.Json.JsonConvert.SerializeObject(dataRequset);
            var d = Newtonsoft.Json.JsonConvert.DeserializeObject<TRequest>(json);
            return d;
        }
        private void ValidatePermission()
        {
            var db = TokenADO.GetInstant().GetTokenStatus(this.token);
            if (db.Count == 0) { throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O9001, ""); }
            db.ForEach(
                x =>
                {
                    if (x.Code == null) { throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O1002, ""); }

                    if (x.Status == "A")
                    {
                        if (x.ExpiryDate > DateTime.Now) { }
                        else if (x.ExpiryDate <= DateTime.Now) throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O9001, "");
                        else throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O9001, "");
                    }
                    else throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O9001, "");
                }
            );
            if (!PermissionADO.GetInstant().CheckPermission(this.token, "C", this.PermissionKey).Any(x => x.Code == this.PermissionKey))
            {
                throw new KKFException(this.Logger, KKFCoreEngine.Constant.KKFExceptionCode.O0000, "คุณไม่มีสิทธิใช้งาน API : " + this.GetType().Name);
            }
        }
}
}
