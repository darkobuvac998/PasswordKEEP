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
            if (result.Succeded)
                return Ok(result.Result);
            else
                return BadRequest();
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
            if (result.Succeded)
            {
                return CreatedAtRoute("GetAccountByIdForApplication", new { applicationId, id = result.Result.Id }, result.Result);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPut("{id}")]
        [EnsureAccountExists]
        public async Task<IActionResult> UpdateAccountForCompany(Guid applicationId, Guid id, [FromBody] AccountForCreationDto accountDto)
        {
            var result = await _accountsService.UpdateAccountForApplication(applicationId, id, accountDto);
            if (result.Succeded)
            {
                return Ok(result.Result);
            }
            else
            {
                return BadRequest();
            }
        }


        [HttpDelete("{id}")]
        [EnsureAccountExists]
        public async Task<IActionResult> DeleteAccountForCompany(Guid applicationId, Guid id)
        {
            var accont = HttpContext.Items["account"] as Account;
            if (accont != null)
            {
                await _accountsService.DeleteAccountForApplication(accont);
                return NoContent();
            }
            else
            {
                return BadRequest();
            }
        }

    }
}
