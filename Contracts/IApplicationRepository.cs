using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IApplicationRepository : IRepositoryBase<Application>
    {
        void CreateApplication(string userId, Application app);
        Task<Application> FindApplicationAsync(Guid id, bool trackChanges);
    }
}
