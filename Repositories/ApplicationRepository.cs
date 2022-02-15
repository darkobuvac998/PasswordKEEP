using Contracts;
using Entities.Models;
using Entities.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class ApplicationRepository : RepositoryBase<Application>, IApplicationRepository
    {
        public ApplicationRepository(RepositoryContext context) : base(context)
        {
        }

        public void CreateApplication(string userId, Application app)
        {
            app.UserId = userId;
            Create(app);
        }

        public async Task<Application> FindApplicationAsync(Guid id, bool trackChanges)
        {
            var app = await FindByConditionAsync(app => app.Id == id, trackChanges);
            var result = app.FirstOrDefault();
            return result;
        }

        public async Task<IEnumerable<Application>> PagediListWithSearch(Expression<Func<Application, bool>> expression, bool trackChanges, QueryParameters queryParameters)
        {
            if(queryParameters.Search != null)
            {
                var result = await PagedListAsync(expression, trackChanges, queryParameters);
                result = result.Where(app => app.Name.Contains(queryParameters.Search)).ToList();

                return result;
            }
            return await PagedListAsync(expression, trackChanges, queryParameters);
        }
    }
}
