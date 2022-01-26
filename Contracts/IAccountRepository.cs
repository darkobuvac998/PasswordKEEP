using Entities.Models;
using System;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IAccountRepository : IRepositoryBase<Account>
    {
        Task<Account> GetAccountById(Guid applicationId, Guid id, bool tracking);
    }


}
