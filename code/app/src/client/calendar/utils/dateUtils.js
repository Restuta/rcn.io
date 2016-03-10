const newWeekDay = ({short, full}) => {
  return {
    'short': short,
    full: full
  }
}

export const Weekdays = [
  newWeekDay({'short': 'Mon', full: 'Monday'}),
  newWeekDay({'short': 'Tue', full: 'Tuesday'}),
  newWeekDay({'short': 'Wed', full: 'Wednesday'}),
  newWeekDay({'short': 'Thu', full: 'Thursday'}),
  newWeekDay({'short': 'Fri', full: 'Friday'}),
  newWeekDay({'short': 'Sat', full: 'Saturday'}),
  newWeekDay({'short': 'Sun', full: 'Sunday'}),
]


const newMonth = newWeekDay

export const Months = [
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
