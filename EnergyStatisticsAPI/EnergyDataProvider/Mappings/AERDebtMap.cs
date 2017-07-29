using CsvHelper.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EnergyDataProvider.Models;

namespace EnergyDataProvider.Mappings
{
	sealed public class AERDebtMap : CsvClassMap<AERDebt>
	{
		public AERDebtMap()
		{
			Map(m => m.Quarter).Index(0);
			Map(m => m.ResidentialElectricityCustomersWithDebt).Index(1);
			Map(m => m.AverageResidentialElectricityDebt).Index(2);
			Map(m => m.ResidentialGasCustomersWithDebt).Index(3);
			Map(m => m.AverageResidentialGasDebt).Index(4);
			Map(m => m.SmallBusinessElectricityCustomersWithDebt).Index(5).Default(0);
			Map(m => m.AverageSmallBusinessElectricityDebt).Index(6).Default(0);
			Map(m => m.SmallBusinessGasCustomersWithDebt).Index(7).Default(0);
			Map(m => m.AverageSmallBusinessGasDebt).Index(8).Default(0);
		}
	}
}

