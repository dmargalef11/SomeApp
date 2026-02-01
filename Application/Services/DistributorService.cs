using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using System.Collections.Generic;

namespace SomeApp.Application.Services
{
    public class DistributorService : IDistributorService
    {
        private readonly IDistributorRepository _repository;

        public DistributorService(IDistributorRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Distributor> GetAll() => _repository.GetAll();
        public Distributor GetById(int id) => _repository.GetById(id);
        public void Add(Distributor distributor) => _repository.Add(distributor);
        public bool Delete(int id) => _repository.Delete(id);
        public void Update(int id, Distributor updatedDistributor) => _repository.Update(id, updatedDistributor);
    }
}
