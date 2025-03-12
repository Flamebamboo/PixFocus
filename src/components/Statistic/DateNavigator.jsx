import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import COLORS from '@/utils/color';
import PressableScale from '../PressableScale';

const DateNavigator = ({ selectedRange, onDateChange }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  // Reset to today when range type changes
  useEffect(() => {
    setCurrentDate(today);
    updateDateInfo(today);
  }, [selectedRange]);

  // Format date to string
  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format month to string with abbreviated month and year format (e.g., "Feb, 2025")
  const formatMonth = (date) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
  };

  // Get week number of the year
  const getWeekNumber = (date) => {
    // Create a copy of this date object
    const target = new Date(date.valueOf());
    const dayNumber = (date.getDay() + 6) % 7;

    // Set to nearest Thursday: current date + 4 - current day number
    target.setDate(target.getDate() - dayNumber + 3);

    // Get first day of year
    const firstThursday = new Date(target.getFullYear(), 0, 4);

    // Get first Thursday of the year
    firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

    // Calculate week number: 1 + number of days between target and first Thursday / 7
    const weekNumber = 1 + Math.floor((target - firstThursday) / (7 * 24 * 60 * 60 * 1000));

    return weekNumber;
  };

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Get start of week (Monday)
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(d.setDate(diff));
  };

  // Get end of week (Sunday)
  const getEndOfWeek = (date) => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  };

  // Get start of month
  const getStartOfMonth = (date) => {
    const d = new Date(date);
    d.setDate(1);
    return d;
  };

  // Get end of month
  const getEndOfMonth = (date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d;
  };

  // Get start of year
  const getStartOfYear = (date) => {
    const d = new Date(date);
    d.setMonth(0);
    d.setDate(1);
    return d;
  };

  // Get end of year
  const getEndOfYear = (date) => {
    const d = new Date(date);
    d.setMonth(11);
    d.setDate(31);
    return d;
  };

  const updateDateInfo = (date) => {
    let startDate, endDate, displayText;

    switch (selectedRange) {
      case 'day':
        startDate = new Date(date);
        endDate = new Date(date);

        if (isSameDay(date, today)) {
          displayText = 'Today';
        } else if (isSameDay(date, new Date(today.setDate(today.getDate() - 1)))) {
          displayText = 'Yesterday';
          today.setDate(today.getDate() + 1); // Reset today
        } else {
          displayText = formatDate(date);
        }
        break;

      case 'week':
        startDate = getStartOfWeek(date);
        endDate = getEndOfWeek(date);

        const isCurrentWeek = isSameDay(getStartOfWeek(today), startDate);
        const weekNumber = getWeekNumber(date);

        if (isCurrentWeek) {
          displayText = `This Week (Week ${weekNumber})`;
        } else {
          displayText = `Week ${weekNumber}, ${date.getFullYear()}`;
        }
        break;

      case 'month':
        startDate = getStartOfMonth(date);
        endDate = getEndOfMonth(date);

        const isCurrentMonth = today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();

        // Use the short month format (e.g., "Feb, 2025")
        displayText = isCurrentMonth ? 'This Month' : formatMonth(date);
        break;

      case 'year':
        startDate = getStartOfYear(date);
        endDate = getEndOfYear(date);

        // Only display the year number
        const yearNum = date.getFullYear();
        const currentYear = today.getFullYear();

        // Show "This Year" for current year, just the year number for others
        displayText = yearNum === currentYear ? 'This Year' : yearNum.toString();
        break;

      default:
        startDate = date;
        endDate = date;
        displayText = formatDate(date);
    }

    onDateChange({
      startDate,
      endDate,
      displayText,
      currentDate: date,
    });
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);

    switch (selectedRange) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
      default:
        newDate.setDate(newDate.getDate() - 1);
    }

    setCurrentDate(newDate);
    updateDateInfo(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);

    switch (selectedRange) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
      default:
        newDate.setDate(newDate.getDate() + 1);
    }

    // Don't navigate to future dates
    if (newDate > today) {
      return;
    }

    setCurrentDate(newDate);
    updateDateInfo(newDate);
  };

  // Check if we can go forward (we're not at today already)
  const canGoForward = () => {
    switch (selectedRange) {
      case 'day':
        return !isSameDay(currentDate, today);
      case 'week':
        return !isSameDay(getStartOfWeek(currentDate), getStartOfWeek(today));
      case 'month':
        return !(currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear());
      case 'year':
        return currentDate.getFullYear() !== today.getFullYear();
      default:
        return false;
    }
  };

  return (
    <View style={styles.container}>
      <PressableScale onPress={goToPrevious} style={styles.navigationButton}>
        <FontAwesomeIcon icon={faChevronLeft} size={16} color="#000" />
      </PressableScale>

      <View style={styles.dateDisplay}>
        <Text
          style={[
            styles.dateText,
            selectedRange === 'year' && styles.yearText,
            selectedRange === 'week' && styles.weekText,
            selectedRange === 'month' && styles.monthText,
          ]}
        >
          {onDateChange?.displayText ||
            (selectedRange === 'year'
              ? currentDate.getFullYear().toString()
              : selectedRange === 'week'
              ? `Week ${getWeekNumber(currentDate)}, ${currentDate.getFullYear()}`
              : selectedRange === 'month'
              ? formatMonth(currentDate)
              : isSameDay(currentDate, today)
              ? 'Today'
              : formatDate(currentDate))}
        </Text>
      </View>

      <PressableScale
        onPress={goToNext}
        style={[styles.navigationButton, !canGoForward() && styles.disabledButton]}
        disabled={!canGoForward()}
      >
        <FontAwesomeIcon icon={faChevronRight} size={16} color={canGoForward() ? '#000' : '#999'} />
      </PressableScale>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#000',
    padding: 5,
    width: '100%',
    marginBottom: 15,
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryBlue,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  dateDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  dateText: {
    fontFamily: 'PixelCodeBold',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  yearText: {
    fontSize: 22, // Make year text slightly larger
    fontWeight: 'bold',
  },
  weekText: {
    fontSize: 16, // Slightly smaller for week text since it has more information
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DateNavigator;
