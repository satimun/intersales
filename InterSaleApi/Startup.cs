using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using InterSaleApi.ADO;
using InterSaleApi.Engine.Line;
using InterSaleApi.Model.StaticValue;
using Line;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace InterSaleApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // string rootName = Configuration["LogPath"]; //"D:/logs/{MachineName}/{Date}/"
            // string fileName = "{ServiceName}.{Date}.log";
            // KKFCoreEngine.KKFLogger.LoggerManager.InitInstant(rootName, fileName);

            //getDbsetting
            //XmlSerializer xml = new XmlSerializer();
            //FileStream xmlStream = new FileStream("config.xml", FileMode.Open);
            //var result = xml.Deserialize(xmlStream);

            //XmlDocument xml = new XmlDocument();
            //xml.Load("config.xml");
            // BaseADO.CONNECTIONSTRING = xml.InnerText.ToString();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowCors", builder =>
                {
                    builder
                    .AllowAnyOrigin()
                    .WithOrigins("http://localhost:8082", "https://intersales.kkfnets.com", "http://intersales.kkfnets.com", "http://devintersales.kkfnets.com", "http://intersalesdev.kkfnets.com", "https://intersalesdev.kkfnets.com")
                    //.WithMethods("GET", "PUT", "POST", "DELETE")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .WithExposedHeaders("x-custom-header");
                });
            });
            services.AddMvc();

            //services
            //    .AddSingleton<ILineConfiguration, LineConfiguration>()
            //    .AddSingleton<ILineBot, LineBot>()
            //    .AddSingleton<LineBotService>();

            //services
            //    .AddSingleton<ILineBotLogger, LineBotSampleLogger>()
            //    .AddSingleton<LineBotSampleConfiguration>()
            //    .AddSingleton<LineBotService>();

            //services
            //    .AddSingleton<ILineEventHandler, MessageEventHandler>()
            //    .AddSingleton<ILineEventHandler, FollowEventHandler>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {

            BaseADO.CONNECTIONSTRING = Configuration["dbPath"];
            StaticValueManager.GetInstant().SetSingleSignOnUrl(Configuration["SingleSignOnUrl"]);
            StaticValueManager.GetInstant().SetKKFConnectAPIUrl(Configuration["KKFConnectAPIUrl"]);

            //var lineConfiguration = (LineConfiguration)app.ApplicationServices.GetRequiredService<ILineConfiguration>();
            //Configuration.Bind("LineConfiguration", lineConfiguration);

            //var lineBotService = app.ApplicationServices.GetRequiredService<LineBotService>();

            //BaseLineEngine.SetInit(lineBotService.lineBot, lineBotService.serviceProvider);

            //BaseLineEngine.SetService(lineBotService);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.Run(async (context) =>
            //{
            //    await lineBotService.Handle(context);
            //});


            app.UseCors("AllowCors");
            app.UseMvc();
        }
    }
}
