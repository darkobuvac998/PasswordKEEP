using Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {
        private readonly RepositoryContext _context;

        public RepositoryBase(RepositoryContext context)
        {
            _context = context;
        }

        public void Create(T entity) => _context.Set<T>().Add(entity);

        public void Delete(T entity) => _context.Set<T>().Remove(entity);

        public IQueryable<T> FindAll(bool trackChanges) => trackChanges ? _context.Set<T>() : _context.Set<T>().AsNoTracking();

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges) =>
            trackChanges ? _context.Set<T>().Where(expression) : _context.Set<T>().Where(expression).AsNoTracking();

        public async Task<IEnumerable<T>> FindByConditionAsync(Expression<Func<T, bool>> expression, bool trackChanges) =>
            await FindByCondition(expression, trackChanges).ToListAsync();

        public IQueryable<T> FindByConditionInclude(Expression<Func<T, bool>> expressionCondition, Expression<Func<T, object>> expressionInclude, bool trackChanges) =>
            trackChanges ? _context.Set<T>().Include(expressionInclude).Where(expressionCondition)
                         : _context.Set<T>().Include(expressionInclude).Where(expressionCondition)
                                            .AsNoTracking();

        public void Update(T entity) => _context.Set<T>().Update(entity);
    }
}
