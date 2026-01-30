using SomeApp.Domain.Entities;
using System.Collections.Generic;

namespace SomeApp.Domain.Repositories
{
    public interface IDistributorRepository
    {
        IEnumerable<Distributor> GetAll();
        Distributor GetById(int id);
        void Add(Distributor distributor);
        bool Delete(int id);
        void Update(int id, Distributor updatedDistributor);
    }
}
