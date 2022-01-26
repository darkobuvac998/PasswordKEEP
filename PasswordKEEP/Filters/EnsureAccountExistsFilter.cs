using Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;
using System;
using System.Threading.Tasks;

namespace PasswordKEEP.Filters
{
    public class EnsureAccountExistsFilter : IAsyncActionFilter
    {
        private readonly IAccountsService _accountsService;
        private readonly ILogger _logger;

        public EnsureAccountExistsFilter(IAccountsService accountsService, ILogger logger)
        {
            _accountsService = accountsService;
            _logger = logger;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var applicationId = (Guid)context.ActionArguments["applicationId"];
            var id = (Guid)context.ActionArguments["id"];

            var trackChanges = context.HttpContext.Request.Method.Equals("PUT");

            var accountDto = await _accountsService.GetAccountByIdForApplication(applicationId, id, trackChanges);

            if (accountDto == null)
            {
                _logger.Error($"Account with id {id} for application with id {applicationId} doesn't exists.");
                context.Result = new NotFoundResult();
            }
            else
            {
                context.HttpContext.Items.Add("account", accountDto);
                await next();
            }
        }
    }

    public class EnsureAccountExistsAttribute : TypeFilterAttribute
    {
        public EnsureAccountExistsAttribute() : base(typeof(EnsureAccountExistsFilter))
        {
        }
    }
}
