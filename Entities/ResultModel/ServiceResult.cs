namespace Entities.ResultModel
{
    public class ServiceResult<T>
    {
        public bool Succeded { get; set; }
        public T Result { get; set; }

    }
}
