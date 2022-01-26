using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class AccountRepository : RepositoryBase<Account>, IAccountRepository
    {
        public AccountRepository(RepositoryContext context) : base(context)
        {
        }

        public async Task<Account> GetAccountById(Guid applicationId, Guid id, bool tracking)
        {
            var account = await FindByConditionAsync(acc => acc.ApplicationId == applicationId && acc.Id == id, tracking);
            var result = account.FirstOrDefault();
            return result;
        }
    }
}
