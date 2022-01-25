using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IRepositoryBase<T>
    {
        IQueryable<T> FindAll(bool trackChanges);
        IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges);

        Task<IEnumerable<T>> FindByConditionAsync(Expression<Func<T, bool>> expression, bool trackChanges);
        IQueryable<T> FindByConditionInclude(Expression<Func<T, bool>> expressionCondition, Expression<Func<T, object>> expressionInclude, bool trackChanges);
        void Create(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
