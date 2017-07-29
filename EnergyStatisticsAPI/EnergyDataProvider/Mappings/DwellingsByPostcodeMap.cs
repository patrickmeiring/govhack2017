using CsvHelper.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EnergyDataProvider.Models;

namespace EnergyDataProvider.Mappings
{
	sealed public class DwellingsByPostcodeMap : CsvClassMap<DwellingsByPostcode>
	{
		public DwellingsByPostcodeMap()
		{
			Map(m => m.Postcode).Name("Postcode");
			Map(m => m.Dwellings).Name("Dwellings");
		}
	}
}
