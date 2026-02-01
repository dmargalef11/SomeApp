using SomeApp.Domain.Entities;
using System.Collections.Generic;

namespace SomeApp.Application.Services
{
    public interface IDistributorService
    {
        IEnumerable<Distributor> GetAll();
        Distributor GetById(int id);
        void Add(Distributor distributor);
        bool Delete(int id);
        void Update(int id, Distributor updatedDistributor);
    }
}
