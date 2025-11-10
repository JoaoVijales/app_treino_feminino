
function getCyclePhase(lastPeriodDate: Date, CYCLE_LENGTH: number) {
  const daysSince = differenceInDays(new Date(), new Date(lastPeriodDate));
  const dayInCycle = daysSince % CYCLE_LENGTH;

  if (dayInCycle <= 5) return "menstrual";
  if (dayInCycle <= 12) return "folicular";
  if (dayInCycle <= 16) return "ovulacao";
  return "lutea";
}

function differenceInDays(date1: Date, date2: Date) {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}




