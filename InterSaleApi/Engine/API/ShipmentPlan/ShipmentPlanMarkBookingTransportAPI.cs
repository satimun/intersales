using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanMarkBookingTransportAPI : BaseAPIEngine<ShipmentPlanMarkBookingTransportReq, ShipmentPlanBookingTransportRes>
    {
        protected override string PermissionKey { get { return "EXPORTOFFICER_API"; } }

        protected override void ExecuteChild(ShipmentPlanMarkBookingTransportReq dataReq, ShipmentPlanBookingTransportRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.bookings.ForEach(x => {
                var tmp = new ShipmentPlanBookingTransportRes.BookingTransport();
                try
                {
                    tmp.planHID = x.planHID;
                    tmp.planWeek = x.planWeek;
                    tmp.planDate = x.planDate;
                    tmp.customers = x.customers;
                    tmp.ports = x.ports;
                    tmp.productComplete = x.productComplete;
                    tmp.stockAmount = x.stockAmount;
                    tmp.planAmount = x.planAmount;
                    tmp.containerCode = x.containerCode;
                    tmp.payAmount = x.payAmount;
                    tmp.paymentTerm = x.paymentTerm;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var r = ShipmentPlanADO.GetInstant().MarkBookingTransport(transac, x, this.employeeID, this.Logger).FirstOrDefault();
                    var tmpPortLoading = StaticValueManager.GetInstant().sxsPortLoading.Where(z => z.ID == r.PortLoading_ID).Select(z => new INTIdCodeDescriptionModel() { id = z.ID, code = z.Code, description = z.Description }).FirstOrDefault();
                    if (tmpPortLoading != null) tmp.portLoading = tmpPortLoading;
                    tmp.portLoadingUpdate = BaseValidate.GetByDateTime(r.PortLoadingBy, r.PortLoadingDate);
                    if(x.portLoading.id != r.PortLoading_ID) { throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Data can't be saved."); }
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.bookings.Add(tmp);
                }

            });

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Failed to save.");
            }
            else { transac.Commit(); }
            conn.Close();
        }
    }
}
