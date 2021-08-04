using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace KKFCoreEngine.Google
{
    public static class Calendar
    {
        static string[] Scopes = { CalendarService.Scope.CalendarReadonly };
        static string ApplicationName = "Google Calendar API .NET Quickstart";

        public static CalendarService OpenService ()
        {
            UserCredential credential;
            using (var stream = new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
            {
                string credPath = "token.json";
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    Scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(credPath, true)).Result;
                Console.WriteLine("Credential file saved to: " + credPath);
            }

            // Create Google Calendar API service.
            return new CalendarService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });
        }

        public static Events ListEven(string calendarID, DateTime start, DateTime end, int limitResults = 10)
        {
            //Open service
            var service = OpenService();

            // Define parameters of request.
            //EventsResource.ListRequest request = service.Events.List("primary");
            //EventsResource.ListRequest request = service.Events.List("projectco.itkig@gmail.com");
            //EventsResource.ListRequest request = service.Events.List("ying.kkf@gmail.com");

            EventsResource.ListRequest request = service.Events.List(calendarID);
            request.TimeMin = start;
            request.TimeMax = end;
            request.ShowDeleted = true;
            request.SingleEvents = true;
            request.MaxResults = limitResults;
            request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;

            // List events.
            return request.Execute();
        }
    }
}
