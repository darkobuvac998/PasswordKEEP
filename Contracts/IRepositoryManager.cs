using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IRepositoryManager
    {
        IApplicationRepository Application { get; }
        IAccountRepository Account { get; }
        void Save();
        Task SaveAsync();
    }
}
