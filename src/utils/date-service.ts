
import {
    formatDistance, formatDistanceToNow, isValid, format,
    isToday, isYesterday, isSameWeek, isSameYear, formatDuration, intervalToDuration,
    addHours,
    addDays,
    addMonths,
    getTime,
    toDate,
    parse,
    lastDayOfMonth,
    isSameDay
} from 'date-fns'

import { enUS } from 'date-fns/locale';


export const ParseDate = (date: string, format: string) => {
    const d = parse(date, format, new Date());
    return d;
}

export const LastDayOfMonth = (date: Date) => {
    const day = lastDayOfMonth(date);
    return day;
}

export const ToDate = (argument: Date | number): Date => {
    return toDate(argument);
}

export const IsValidDate = (date: any): boolean => {
    return isValid(date)
}

export const DateDistance = (date: Date) => {

    if (!isValid(date))
        return '';


    const result = formatDistance(date, new Date(), { addSuffix: true, locale: enUS });

    return result;
}

export const StandarDateFormat = (date: Date) => {

    if (!isValid(date))
        return '';

    return DateFormat(date, 'MM/dd/yyyy');
}

export const DateFormat = (date: Date, fmt = 'dd/MM/yyyy') => {

    if (!isValid(date))
        return '';


    const result = format(date, fmt,
        {
            weekStartsOn: 1,
            locale: enUS
        });

    return result;
}

export const NamedDateFormat = (date: Date) => {
    return DateFormat(date, 'EEEE MMMM yyyy')
}

export const DayName = (date: Date) => {
    return DateFormat(date, 'EEEE')
}

export const MonthName = (date: Date) => {
    return DateFormat(date, 'MMMM')
}

export function fTimestamp(date: Date | string | number) {
    return getTime(new Date(date));
}

export function fDateTimeSuffix(date: Date | string | number) {
    return format(new Date(date), 'dd/MM/yyyy p');
}

export function fToNow(date: Date | string | number) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: enUS
    });
}

export const DateTimeFormat = (date: Date, format = 'dd MMMM yyyy  H:m:s') => {
    return DateFormat(date, format);
}

export function GetFriendlyDateTime(d: Date, exact: Boolean) {

    if (!d)
        return 'Unknown';

    const created_at = new Date(d);
    if (!isValid(created_at))
        return "Unknown";


    if (exact)
        return format(new Date(created_at), 'MMMM dd, yyyy  H:m:s');
    else {
        const options = { includeSeconds: true, addSuffix: true, locale: enUS };
        const result = formatDistanceToNow(created_at, options);
        return result;
    }
}

export function ShortDateDividerHelper(d: Date, includeHourAfterToday = false) {
    try {
        if (!d)
            return 'invalid';

        const date = new Date(d);
        if (!isValid(date))
            return '';

        const current = new Date();

        const hourFormat = "hh:mm aaaa";
        const addFormat = includeHourAfterToday ? ` ${hourFormat}` : "";

        if (isToday(date))
            return DateFormat(date, hourFormat) //1:51 PM   

        if (isYesterday(date))
            return 'Yesterday ' + (includeHourAfterToday ? DateFormat(date, hourFormat) : '');

        if (isSameWeek(date, current))
            return DateFormat(date, "EEEE" + addFormat);//Monday, Tuesday, ..., Sunday

        if (isSameYear(date, current))
            return DateFormat(date, "MMM dd" + addFormat); //Jun 18

        return DateFormat(date, "MM/dd/yyyy" + addFormat); // month/day/year                    
    }
    catch (error) {
        return 'error';
    }
}

export const Duration = (date: Date) => {

    const internal = intervalToDuration({
        start: new Date(date),
        end: new Date()
    });

    const res = formatDuration({
        years: internal.years,
        months: internal.months,
        weeks: internal.weeks,
        days: internal.days,
        hours: internal.hours,
        minutes: 0,
        seconds: 0
    }, { delimiter: ', ', locale: enUS });

    return res;
}

export const AddHoursToDate = (date: Date, amount: number = 0) => {

    const result = addHours(new Date(date), amount);
    return result;
}

export const AddDaysToDate = (date: Date, amount: number = 0) => {

    const result = addDays(new Date(date), amount);
    return result;
}
export const AddMonthsToDate = (date: Date, amount: number = 1) => {

    const result = addMonths(new Date(date), amount);
    return result;
}

export const DaysBetweenDates = (date: Date, start_date: Date): number => {

    if (!date)
        return 0;

    if (isSameDay(date, start_date))
        return 1;

    return Math.ceil((date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24));
}
