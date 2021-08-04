using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class ProductGradeListAPI : BaseAPIEngine<NullRequest, ProductGradeListResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, ProductGradeListResponse dataRes)
        {
            var db = ProductGradeADO.GetInstant().List();
            db.ForEach(
                    x =>
                    {
                        INTIdCodeDescriptionModel tmp = new INTIdCodeDescriptionModel();
                        tmp.id = x.ID;
                        tmp.code = x.Code;
                        tmp.description = x.Description;
                        dataRes.productGrades.Add(tmp);
                    }
                );
        }
    }
}
