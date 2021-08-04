namespace InterSaleModel.Model.Entity.Response
{
    public class DiameterGroupList
    {
        public int ID;
        public string Description;
        public int ProductType_ID;

        public int? MinProductTwineSize_ID;
        public string MinProductTwineSize_Code;
        public int? MaxProductTwineSize_ID;
        public string MaxProductTwineSize_Code;

        public int ProductTwineSize_ID;
        public string ProductTwineSize_Code;
    }
}