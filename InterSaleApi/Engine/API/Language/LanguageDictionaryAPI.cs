using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Constant.ConstEnum;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class LanguageDictionaryAPI : BaseAPIEngine<LanguageDictionaryRequest, LanguageDictionaryResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(LanguageDictionaryRequest dataReq, LanguageDictionaryResponse dataRes)
        {
            LanguageDictionaryADO.GetInstant().Search(dataReq.lang, "0", this.Logger).ForEach(
                x => {
                Dictionarys tmp = new Dictionarys();
                tmp.code = x.code;
                tmp.message = x.message;
                dataRes.dictionarys.Add(tmp);
            });

            if (dataReq.group != "0")
            {
                LanguageDictionaryADO.GetInstant().Search(dataReq.lang, dataReq.group, this.Logger).ForEach(
                x => {
                    bool chk = true;
                    dataRes.dictionarys.ForEach(
                        y => {
                            if (y.code == x.code)
                            {
                                y.message = x.message;
                                chk = false;
                            }
                        }
                    );
                    if (chk)
                    {
                        Dictionarys tmp2 = new Dictionarys();
                        tmp2.code = x.code;
                        tmp2.message = x.message;
                        dataRes.dictionarys.Add(tmp2);
                    }
                });
            }
        }
    }
}
