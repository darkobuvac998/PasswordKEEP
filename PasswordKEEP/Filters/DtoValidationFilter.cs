using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;
using System.Linq;

namespace PasswordKEEP.Filters
{
    public class DtoValidationFilter : IActionFilter
    {
        private readonly ILogger _logger;

        public DtoValidationFilter(ILogger logger)
        {
            _logger = logger;
        }

        public void OnActionExecuted(ActionExecutedContext context) { }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var controller = context.RouteData.Values["controller"];
            var action = context.RouteData.Values["action"];

            var param = context.ActionArguments.SingleOrDefault(x => x.Value.ToString().Contains("Dto")).Value;

            if (param == null)
            {
                _logger.Error($"Object sent from client is null. Controller: {controller} | Action: {action}");
                context.Result = new BadRequestObjectResult($"Object is null. Controller: {controller} | Action: {action}");
            }

            if (!context.ModelState.IsValid)
            {
                _logger.Error($"Invalid model send from client! Controller: {context} | Action: {action}");
                context.Result = new UnprocessableEntityObjectResult(context.ModelState);
            }
        }
    }

    public class DtoValidationAttribute : TypeFilterAttribute
    {
        public DtoValidationAttribute() : base(typeof(DtoValidationFilter)) { }
    }
}
