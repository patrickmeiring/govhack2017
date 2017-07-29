using CsvHelper.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EnergyDataProvider.Models;

namespace EnergyDataProvider.Mappings
{
	sealed public class SolarHotWaterInstallationMap : CsvClassMap<SolarHotWaterInstallation>
	{
		public SolarHotWaterInstallationMap()
		{
			Map(m => m.Postcode).Name("Postcode");
			Map(m => m.Technology).Name("Technology");
			Map(m => m.TankCapacity).Name("Tank capacity (litres)");
			Map(m => m.Booster).Name("Booster");
			Map(m => m.Collector).Name("Collector");
			Map(m => m.CollectorCircuit).Name("Collector circuit");
			Map(m => m.Configuration).Name("Configuration");
		}
	}
}
