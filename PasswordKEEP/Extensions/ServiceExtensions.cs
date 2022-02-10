using Contracts;
using Entities.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using PasswordKEEP.Services;
using Repositories;
using System;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

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
                    builder.WithOrigins("http://localhost:4200").WithMethods("GET", "POST", "PUT", "DELETE").AllowAnyHeader();
                });

            });

        public static void AddAccountsService(this IServiceCollection services) =>
            services.AddScoped<IAccountsService, AccountsService>();

        public static void AddAuthenticationManager(this IServiceCollection services) =>
            services.AddScoped<IAuthenticationManager, AuthenticationManager>();

        public static void AddJWT(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtSetting = configuration.GetSection("JwtSettings");
            var secret = Environment.GetEnvironmentVariable("PasswordKEEPSecret");

            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(opt =>
            {
                var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = jwtSetting.GetSection("validIssuer").Value,
                    ValidAudience = jwtSetting.GetSection("validAudience").Value,
                    IssuerSigningKey = new SymmetricSecurityKey(hmac.Key)
                };
            });
        }

        public static void ConfigureAuthorization(this IServiceCollection services)
        {
            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("CanManageUsers", policy => policy.RequireClaim(ClaimTypes.Role, "Admin"));
            });
        }

        public static void ConfigurePostgreSQL(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<RepositoryContext>(options => 
                    options.UseNpgsql(configuration.GetConnectionString("postgreConnection"), 
                    b => b.MigrationsAssembly("PasswordKEEP")));
        }
    }
}
