using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}
