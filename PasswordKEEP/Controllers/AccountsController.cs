using Contracts;
using Entities.DataTransferObjects;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PasswordKEEP.Filters;
using System;
using System.Threading.Tasks;

namespace PasswordKEEP.Controllers
{
    [Route("api/{applicationId}/accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountsService _accountsService;

        public AccountsController(IAccountsService accountsService)
        {
            _accountsService = accountsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAccountsForApplication(Guid applicationId)
        {
            var result = await _accountsService.GetAccountsForApplicationAsync(applicationId);
            return Ok(result);
        }

        [HttpGet("{id}", Name = "GetAccountByIdForApplication")]
        [EnsureAccountExists]
        public IActionResult GetAccountByIdForApplication(Guid applicationId, Guid id)
        {
            var accountDto = HttpContext.Items["account"] as AccountDto;
            return Ok(accountDto);
        }

        [HttpPost]
        [DtoValidation]
        public async Task<IActionResult> CreateAccountForApplication(Guid applicationId, [FromBody] AccountForCreationDto accountDto)
        {
            var result = await _accountsService.CreateAccountForApplication(applicationId, accountDto);
            if (result != null)
            {
                return CreatedAtRoute("GetAccountByIdForApplication", new { applicationId, id = result.Id }, result);
            }
            else
            {
                return BadRequest();
            }
        }

        
    }
}
