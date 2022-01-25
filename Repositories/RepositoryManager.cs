using Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly RepositoryContext _context;
        private ApplicationRepository _applicationRepository;
        private AccountRepository _accountRepository;

        public RepositoryManager(RepositoryContext context)
        {
            _context = context;
        }

        public IApplicationRepository Application
        {
            get
            {
                if(_applicationRepository == null)
                {
                    _applicationRepository = new ApplicationRepository(_context);
                }
                return _applicationRepository;
            }
        }

        public IAccountRepository Account
        {
            get
            {
                if(_accountRepository == null)
                {
                    _accountRepository = new AccountRepository(_context);
                }
                return _accountRepository;
            }
        }

        public void Save() => _context.SaveChanges();

        public Task SaveAsync() => _context.SaveChangesAsync();
    }
}
