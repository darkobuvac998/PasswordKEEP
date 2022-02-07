using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using PasswordKEEP.Extensions;
using Serilog;
using System;

namespace PasswordKEEP
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(configuration)
                .MinimumLevel.Information().WriteTo.File(
                "Logs\\log.txt",
                rollingInterval: RollingInterval.Day).WriteTo.Console().CreateLogger();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "PasswordKEEP", Version = "v1" });
            });

            services.ConfigureCors();

            services.AddAutoMapper(typeof(Startup));
            services.AddSingleton(Log.Logger);

            services.AddSqlContext(Configuration);

            services.AddPasswordService();
            services.AddRepositoryManager();
            services.AddAccountsService();

            services.AddAuthentication();
            services.AddIdentity();
            services.AddJWT(Configuration);

            services.AddAuthenticationManager();

            services.AddHsts(options =>
            {
                options.MaxAge = TimeSpan.FromHours(1);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "PasswordKEEP v1"));
            }
            if (env.IsProduction())
            {
                app.UseHsts();
            }
            app.UseHttpsRedirection();

            app.ConfigureExceptionHandler(logger);
            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors("PasswordKEEPPolicy");
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
