using EnergyDataProvider.Mappings;
using EnergyDataProvider.Models;
using CsvHelper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CsvHelper.Configuration;

namespace EnergyDataProvider
{
	public class CSVDataProvider<T, U> where U : CsvClassMap
	{
		public List<T> MappedData { get; private set; }

		public CSVDataProvider(string location = "")
		{
			if (File.Exists(location))
			{
				var csvData = new CsvReader(File.OpenText(location));
				csvData.Configuration.RegisterClassMap<U>();
				MappedData = csvData.GetRecords<T>().ToList();
			}
		}
	}
}
