using CsvHelper.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EnergyDataProvider.Models;

namespace EnergyDataProvider.Mappings
{
	sealed public class QldDistrictMap : CsvClassMap<QldDistrict>
	{
		public QldDistrictMap()
		{
			Map(m => m.Council).Name("council");
			Map(m => m.Division).Name("division");
			Map(m => m.StateDistrict).Name("state district");
			Map(m => m.FederalDistrict).Name("federal district");
			Map(m => m.Locality).Name("locality");
			Map(m => m.Postcode).Name("postcode");
			Map(m => m.Region).Name("region");
		}
	}
}
