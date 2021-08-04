using Google.Apis.Calendar.v3.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleTest
{
    [TestClass]
    public class TestCalendar
    {
        [TestMethod]
        public void Test()
        {
            var endDate = DateTime.Today.AddDays(2);
            //var events = new Events();
            var events = KKFCoreEngine.Google.Calendar.ListEven("projectco.itkig@gmail.com", DateTime.Today, DateTime.Today.AddDays(10), 30);
            if (events.Items != null && events.Items.Count > 0)
            {
                foreach (var eventItem in events.Items)
                {
                    string when = eventItem.Start.DateTime.ToString();
                    if (String.IsNullOrEmpty(when))
                    {
                        when = eventItem.Start.Date;
                    }
                    Console.WriteLine("{0} ({1})", eventItem.Summary, when);
                }
            }
            else
            {
                Console.WriteLine("No upcoming events found.");
            }
        }
    }
}
