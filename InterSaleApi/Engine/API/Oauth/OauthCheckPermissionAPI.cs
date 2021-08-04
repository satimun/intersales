using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class OauthCheckPermissionAPI : BaseAPIEngine<OauthCheckPermissionRequest, OauthCheckPermissionResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(OauthCheckPermissionRequest dataReq, OauthCheckPermissionResponse dataRes)
        {
            var db = PermissionADO.GetInstant().CheckPermission(this.token, dataReq.type, string.Join(",", dataReq.permissions), this.Logger);
            foreach (string p in dataReq.permissions)
            {
                Permission tmp = new Permission();
                if (dataReq.type == "I" && db.Any(x => x.ID == int.Parse(p))){
                    tmp.id = int.Parse(p);
                    tmp.authorize = "Y";
                }
                else if (dataReq.type == "C" && db.Any(x => x.Code == p))
                {
                    tmp.code = p;
                    tmp.authorize = "Y";
                }
                else
                {
                    if (dataReq.type == "I")
                        tmp.id = int.Parse(p);
                    else if (dataReq.type == "C")
                        tmp.code = p;

                    tmp.authorize = "N";
                }

                dataRes.permissions.Add(tmp);
            }


            //db.ForEach(
            //    x =>
            //    {
            //        Permission tmp = new Permission();
            //        tmp.id = x.ID;
            //        tmp.code = x.Code;
            //        //RoleADO.GetInstant().GetByPermissionID(x.ID).ForEach( y => { tmp.roles.Add(y.Description); } );

            //        if (dataReq.type == "I" && Array.IndexOf(dataReq.permissions, x.ID.ToString()) != -1)
            //        {
            //            tmp.authorize = "Y";
            //        } 
            //        else if (dataReq.type == "C" && Array.IndexOf(dataReq.permissions, x.Code) != -1)
            //        {
            //            tmp.authorize = "Y";
            //        }
            //        else
            //        {
            //            tmp.authorize = "N";
            //        }
                    
            //        dataRes.permissions.Add(tmp);

            //    }
            //);

        }
    }
}
