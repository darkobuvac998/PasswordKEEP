using Entities.DataTransferObjects;
using Entities.Models;
using Entities.ResultModel;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IAccountsService
    {
        Task<ServiceResult<IEnumerable<AccountDto>>> GetAccountsForApplicationAsync(Guid applicationId);
        Task<ServiceResult<AccountDto>> GetAccountByIdForApplication(Guid applicationId, Guid accountId, bool trackChanges);
        Task<ServiceResult<AccountDto>> CreateAccountForApplication(Guid applicationId, AccountForCreationDto accountDto);
        Task<ServiceResult<AccountDto>> UpdateAccountForApplication(Guid applicationId, Guid id, AccountForCreationDto accountDto);

        Task DeleteAccountForApplication(Guid applicationId, Guid id);
        Task DeleteAccountForApplication(AccountDto account);
    }
}
