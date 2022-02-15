using Entities.Models;
using Entities.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IApplicationRepository : IRepositoryBase<Application>
    {
        void CreateApplication(string userId, Application app);
        Task<Application> FindApplicationAsync(Guid id, bool trackChanges);
        Task<IEnumerable<Application>> PagediListWithSearch(Expression<Func<Application, bool>> expression, bool trackChanges, QueryParameters queryParameters);
    }
}
