export const formatDate = (formatter: Intl.DateTimeFormat, inputDateStr: any) => {
    let inputDate;
    if (typeof inputDateStr === 'string') {
      inputDate = new Date(inputDateStr);
    } else if (typeof inputDateStr === 'object') {
      const year = inputDateStr.$y;
        const month = inputDateStr.$M;
        const day = inputDateStr.$D;
        const hour = inputDateStr.$H;
        const minute = inputDateStr.$m;
        const second = inputDateStr.$s;
        inputDate = new Date(year, month, day, hour, minute, second);
    } else {
      throw new Error('Invalid date format');
    }
    const formattedDateStr = formatter.format(inputDate);
    return formattedDateStr;
  }