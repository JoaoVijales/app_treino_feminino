
export function getCyclePhase(lastPeriodDate: Date, CYCLE_LENGTH: number): 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' {
  const daysSince = differenceInDays(new Date(), new Date(lastPeriodDate));
  const dayInCycle = daysSince % CYCLE_LENGTH;

  if (dayInCycle <= 5) return "menstrual";
  if (dayInCycle <= 12) return "follicular";
  if (dayInCycle <= 16) return "ovulatory";
  return "luteal";
}

export function differenceInDays(date1: Date, date2: Date) {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
