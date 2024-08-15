const flattenObject = (obj, parent = '', res = {}, excludeFields = []) => {
    for (let key in obj) {
      if (excludeFields.includes(key)) {
        continue; // Skip the excluded fields
      }
      
      const propName = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        flattenObject(obj[key], propName, res, excludeFields);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  };
  const convertToCSV = (objArray = []) => {
    if (objArray.length === 0) {
      return ''; // Return an empty string if the array is empty
    }
  
    // Flatten the array of objects if needed
    const headers = Object.keys(objArray[0] || {});
    const csvRows = [
      headers.join(','), // Join headers with a comma
      ...objArray.map(row => {
        // Ensure each row is an object with keys
        return headers.map(header => {
          const value = row[header] || ''; // Default to empty string if the value is undefined/null
          return `"${String(value).replace(/"/g, '""')}"`; // Handle quotes and commas in values
        }).join(',');
      })
    ];
  
    return csvRows.join('\n');
  }
  const downloadCSV = (csv, filename) => {
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
  
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
  
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  const exportJSONToCSV = (jsonData, filename = 'data.csv', excludeFields = []) => {
    const flattenedData = jsonData.map(item => flattenObject(item, '', {}, excludeFields));
    const csvData = convertToCSV(flattenedData);
    downloadCSV(csvData, filename);
  };

  export default exportJSONToCSV 