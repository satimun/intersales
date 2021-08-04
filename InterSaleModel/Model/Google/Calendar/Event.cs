using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Google.Calendar
{
    public class Event
    {
        public virtual string Location { get; set; }
        public virtual bool? Locked { get; set; }
        public virtual OrganizerData Organizer { get; set; }
        public virtual EventDateTime OriginalStartTime { get; set; }
        public virtual bool? PrivateCopy { get; set; }
        public virtual IList<string> Recurrence { get; set; }
        public virtual string RecurringEventId { get; set; }
        public virtual RemindersData Reminders { get; set; }
        public virtual int? Sequence { get; set; }
        public virtual SourceData Source { get; set; }
        public virtual EventDateTime Start { get; set; }
        public virtual string Status { get; set; }
        public virtual string Summary { get; set; }
        public virtual string Transparency { get; set; }
        public virtual string UpdatedRaw { get; set; }
        public virtual DateTime? Updated { get; set; }
        public virtual string Visibility { get; set; }
        public virtual string Id { get; set; }
        public virtual string ICalUID { get; set; }
        public virtual string Kind { get; set; }
        public virtual string HangoutLink { get; set; }
        public virtual bool? AnyoneCanAddSelf { get; set; }
        public virtual IList<EventAttachment> Attachments { get; set; }
        public virtual IList<EventAttendee> Attendees { get; set; }
        public virtual bool? AttendeesOmitted { get; set; }
        public virtual string ColorId { get; set; }
        /*public virtual ConferenceData ConferenceData { get; set; }*/
        public virtual string CreatedRaw { get; set; }
        public virtual string HtmlLink { get; set; }
        public virtual CreatorData Creator { get; set; }
        public virtual DateTime? Created { get; set; }
        public virtual EventDateTime End { get; set; }
        public virtual bool? EndTimeUnspecified { get; set; }
        public virtual string ETag { get; set; }
        public virtual ExtendedPropertiesData ExtendedProperties { get; set; }
        public virtual GadgetData Gadget { get; set; }
        public virtual bool? GuestsCanInviteOthers { get; set; }
        public virtual bool? GuestsCanModify { get; set; }
        public virtual bool? GuestsCanSeeOtherGuests { get; set; }
        public virtual string Description { get; set; }
        public class RemindersData
        {
            public virtual IList<EventReminder> Overrides { get; set; }
            public virtual bool? UseDefault { get; set; }
        }
        public class CreatorData
        {
            public virtual string DisplayName { get; set; }
            public virtual string Email { get; set; }
            public virtual string Id { get; set; }
            public virtual bool? Self { get; set; }
        }
        public class ExtendedPropertiesData
        {
            public virtual IDictionary<string, string> Private__ { get; set; }
            public virtual IDictionary<string, string> Shared { get; set; }
        }
        public class GadgetData
        {
            public virtual string Display { get; set; }
            public virtual int? Height { get; set; }
            public virtual string IconLink { get; set; }
            public virtual string Link { get; set; }
            public virtual IDictionary<string, string> Preferences { get; set; }
            public virtual string Title { get; set; }
            public virtual string Type { get; set; }
            public virtual int? Width { get; set; }
        }
        public class OrganizerData
        {
            public virtual string DisplayName { get; set; }
            public virtual string Email { get; set; }
            public virtual string Id { get; set; }
            public virtual bool? Self { get; set; }
        }
        public class SourceData
        {
            public virtual string Title { get; set; }
            public virtual string Url { get; set; }
        }
    }
}
