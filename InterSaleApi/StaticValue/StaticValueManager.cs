using InterSaleApi.ADO;
using InterSaleModel.Model.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleApi.Model.StaticValue
{
    public class StaticValueManager
    {
        private List<sxsCountryGroup> _sxsCountryGroups;
        public List<sxsCountryGroup> sxsCountryGroups { get { return _sxsCountryGroups; } }
        
        private List<sxsCountry> _sxsCountrys;
        public List<sxsCountry> sxsCountrys { get { return _sxsCountrys; } }

        private List<sxsCurrency> _sxsCurrencys;
        public List<sxsCurrency> sxsCurrencys { get { return _sxsCurrencys; } }

        private List<sxsProductGrade> _sxsProductGrades;
        public List<sxsProductGrade> sxsProductGrades { get { return _sxsProductGrades; } }

        private List<sxsProductType> _sxsProductTypes;
        public List<sxsProductType> sxsProductTypes { get { return _sxsProductTypes; } }

        private List<sxsUnitType> _sxsUnitTypes;
        public List<sxsUnitType> sxsUnitTypes { get { return _sxsUnitTypes; } }

        private List<sxsCustomer> _sxsCustomers;
        public List<sxsCustomer> sxsCustomers { get { return _sxsCustomers; } }

        private List<sxsEmployee> _sxsEmployee;
        public List<sxsEmployee> sxsEmployee { get { return _sxsEmployee; } }

        private List<sxsZoneAccount> _sxsZoneAccount;
        public List<sxsZoneAccount> sxsZoneAccount { get { return _sxsZoneAccount; } }

        private List<sxsPortLoading> _sxsPortLoading;
        public List<sxsPortLoading> sxsPortLoading { get { return _sxsPortLoading; } }

        private Boolean _ShipmentPlanJobReplaceActive;
        public Boolean ShipmentPlanJobReplaceActive { get { return _ShipmentPlanJobReplaceActive; } }

        private Boolean _PriceStdImportActive;
        public Boolean PriceStdImportActive { get { return _PriceStdImportActive; } }

        private Boolean _DiscountStdImportActive;
        public Boolean DiscountStdImportActive { get { return _DiscountStdImportActive; } }

        private Boolean _ShipmentPlanOutstandProcessActive;
        public Boolean ShipmentPlanOutstandProcessActive { get { return _ShipmentPlanOutstandProcessActive; } }

        private static StaticValueManager instant { get; set; }
        private StaticValueManager() {
            this.LoadInstantAll();
        }
        public static StaticValueManager GetInstant()
        {
            if (instant == null) instant = new StaticValueManager();
            return instant;
        }

        public void LoadInstantAll()
        {
            this._sxsEmployee = EmployeeADO.GetInstant().List();
            this._sxsCustomers = CustomerADO.GetInstant().List();
            this._sxsCountryGroups = CountryGroupADO.GetInstant().List();
            this._sxsCurrencys = CurrencyADO.GetInstant().List();
            this._sxsProductGrades = ProductGradeADO.GetInstant().List();
            this._sxsProductTypes = ProductTypeADO.GetInstant().List();
            //this._sxsUnitTypes = UnitTypeADO.GetInstant().List();
            this._sxsZoneAccount = ZoneAccountADO.GetInstant().Search("", new List<string> { "A" }, null);
            this._sxsCountrys = CountryADO.GetInstant().List();
            this._sxsPortLoading = PortLoadingADO.GetInstant().List();
            this._ShipmentPlanJobReplaceActive = false;
            this._PriceStdImportActive = false;
            this._DiscountStdImportActive = false;
            this._ShipmentPlanOutstandProcessActive = false;
        }

        public void sxsPortLoading_load()
        {
            this._sxsPortLoading = PortLoadingADO.GetInstant().List();
        }

        public void ShipmentPlanJobReplaceActive_Set(bool val)
        {
            this._ShipmentPlanJobReplaceActive = val;
        }

        public void PriceStdImportActive_Set(bool val)
        {
            this._PriceStdImportActive = val;
        }

        public void DiscountStdImportActive_Set(bool val)
        {
            this._DiscountStdImportActive = val;
        }

        public void ShipmentPlanOutstandProcessActive_Set(bool val)
        {
            this._ShipmentPlanOutstandProcessActive = val;
        }

        private string _SingleSignOnUrl;
        public string SingleSignOnUrl { get => _SingleSignOnUrl; }
        public void SetSingleSignOnUrl(string url)
        {
            _SingleSignOnUrl = url;
        }

        private string _KKFConnectAPIUrl;
        public string KKFConnectAPIUrl { get => _KKFConnectAPIUrl; }
        public void SetKKFConnectAPIUrl(string url)
        {
            _KKFConnectAPIUrl = url;
        }


    }
}
