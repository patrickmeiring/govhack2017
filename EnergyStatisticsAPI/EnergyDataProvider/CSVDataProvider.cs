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
				csvData.Configuration.IgnoreReadingExceptions = true;
				csvData.Configuration.RegisterClassMap<U>();
				MappedData = csvData.GetRecords<T>().ToList();
			}
		}

		public static List<Tuple<string, CSVDataProvider<T, U>>> LoadMultipleFromDirectory(string location, List<string> fileNames)
		{
			var ret = new List<Tuple<string, CSVDataProvider<T, U>>>();

			if (Directory.Exists(location))
			{
				foreach (var file in fileNames)
				{
					if (!location.EndsWith("\\"))
						location += "\\";

					ret.Add(Tuple.Create(file, new CSVDataProvider<T, U>(location + file)));
				}			
			}

			return ret;
		}
	}
}
