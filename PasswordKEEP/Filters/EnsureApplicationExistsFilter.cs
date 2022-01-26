using Contracts;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordKEEP.Filters
{
    public class EnsureApplicationExistsFilter : IActionFilter
    {
        private readonly ILogger _logger;
        private readonly IRepositoryManager _repositoryManager;

        public EnsureApplicationExistsFilter(ILogger logger, IRepositoryManager repositoryManager)
        {
            _logger = logger;
            _repositoryManager = repositoryManager;
        }

        public void OnActionExecuted(ActionExecutedContext context) { }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var id = (Guid)context.ActionArguments["id"];
            var trackChanges = context.HttpContext.Request.Method.Equals("PUT");

            var appEntity = _repositoryManager.Application.FindByCondition(app => app.Id == id, trackChanges);
            if(appEntity == null)
            {
                _logger.Error($"Application with {id} doesn't exists in database!");
                context.Result = new NotFoundResult();
            }
            else
            {
                context.HttpContext.Items.Add("Application", appEntity);
            }

        }
    }

    public class EnsureApplicationExistsAttribute : TypeFilterAttribute
    {
        public EnsureApplicationExistsAttribute() : base(typeof(EnsureApplicationExistsFilter)) { }
    }
}
