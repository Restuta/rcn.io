const newWeekDay = ({short, full}) => {
  return {
    'short': short,
    full: full
  }
}

const Weekdays = [
  newWeekDay({'short': 'Mon', full: 'Monday'}),
  newWeekDay({'short': 'Tue', full: 'Tuesday'}),
  newWeekDay({'short': 'Wed', full: 'Wednesday'}),
  newWeekDay({'short': 'Thu', full: 'Thursday'}),
  newWeekDay({'short': 'Fri', full: 'Friday'}),
  newWeekDay({'short': 'Sat', full: 'Saturday'}),
  newWeekDay({'short': 'Sun', full: 'Sunday'}),
]


const newMonth = newWeekDay

const Months = [
  newMonth({'short': 'Jan', full: 'January'}),
  newMonth({'short': 'Feb', full: 'February'}),
  newMonth({'short': 'Mar', full: 'March'}),
  newMonth({'short': 'Apr', full: 'April'}),
  newMonth({'short': 'May', full: 'May'}),
  newMonth({'short': 'Jun', full: 'June'}),
  newMonth({'short': 'Jul', full: 'July'}),
  newMonth({'short': 'Aug', full: 'August'}),
  newMonth({'short': 'Sep', full: 'September'}),
  newMonth({'short': 'Oct', full: 'October'}),
  newMonth({'short': 'Nov', full: 'November'}),
  newMonth({'short': 'Dec', full: 'December'}),
]


//checks if moment date is also a first day of it's month
const firstDayOfMonth = function(moment) {
  return moment.date() === 1
}

//checks if moment date is also last day of it's month
const lastDayOfMonth = function(moment) {
  const lastDayOfMonthMoment = moment.clone().endOf('month')
  return moment.date() === lastDayOfMonthMoment.date()
}

export {
  Weekdays,
  Months,
  firstDayOfMonth,
  lastDayOfMonth
}
