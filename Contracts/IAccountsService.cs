using Entities.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IAccountsService
    {
        Task<IEnumerable<AccountDto>> GetAccountsForApplicationAsync(Guid applicationId);
        Task<AccountDto> GetAccountByIdForApplication(Guid applicationId, Guid accountId,bool trackChanges);
        Task<AccountDto> CreateAccountForApplication(Guid applicationId, AccountForCreationDto accountDto);
        Task UpdateAccountForApplication(Guid applicationId, Guid id, AccountForCreationDto accountDto);
    }
}
