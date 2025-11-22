export function parseSalaryFilter(salary) {
    const trimmedSalary = salary.trim();
    
    if (trimmedSalary.endsWith('+')) {
      const minSalary = parseInt(trimmedSalary.slice(0, -1));
      return { $gte: minSalary*100000 };
    }
    
    const [min, max] = trimmedSalary.split('-').map(Number);
    
    if (!isNaN(min) && !isNaN(max)) {
      return { $gte: min*100000, $lte: max*100000 };
    }
    
    return null;
  }