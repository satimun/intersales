using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Label
{
    public class LabelList : BaseAPIEngine<NullRequest, LabelRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, LabelRes dataRes)
        {
            var db = ADO.Label.GetInstant().List();
            db.ForEach(
                    x =>
                    {
                        INTIdCodeDescriptionModel tmp = new INTIdCodeDescriptionModel();
                        tmp.id = x.id;
                        tmp.code = x.code;
                        tmp.description = x.description;
                        dataRes.labels.Add(tmp);
                    }
                );
        }
    }
}
