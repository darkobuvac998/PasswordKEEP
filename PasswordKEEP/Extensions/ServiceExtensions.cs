using Contracts;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PasswordKEEP.Services;
using Repositories;

namespace PasswordKEEP.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddSqlContext(this IServiceCollection services, IConfiguration configuration) =>
            services.AddDbContext<RepositoryContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("sqlConnection"), b => b.MigrationsAssembly("PasswordKEEP")));
        public static void AddPasswordService(this IServiceCollection services) =>
            services.AddScoped<IPasswordService, PasswordService>();

        public static void AddRepositoryManager(this IServiceCollection services) =>
            services.AddScoped<IRepositoryManager, RepositoryManager>();

        public static void AddIdentity(this IServiceCollection services)
        {
            var builder = services.AddIdentityCore<User>(o =>
            {
                o.Password.RequireDigit = true;
                o.Password.RequireLowercase = true;
                o.Password.RequireUppercase = true;
                o.Password.RequireNonAlphanumeric = true;
                o.Password.RequiredLength = 5;
                o.User.RequireUniqueEmail = true;
            });

            builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), builder.Services);
            builder.AddEntityFrameworkStores<RepositoryContext>().AddDefaultTokenProviders();
        }

        public static void ConfigureCors(this IServiceCollection services) =>
            services.AddCors(options =>
            {
                options.AddPolicy("PasswordKEEPPolicy", builder =>
                {
                    builder.AllowAnyOrigin().WithMethods("GET", "POST", "PUT", "DELETE").AllowAnyHeader();
                });
            });
    }
}
