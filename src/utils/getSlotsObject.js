import { add, parseISO, getTime } from 'date-fns'
import isNilOrEmpty from './isNilOrEmpty'

const excludeSlotsInsideLunchBreak = ({ breakStart, breakEnd }, slots) =>
    slots.filter(({ timeSlotStart, timeSlotEnd }) => breakStart > timeSlotStart || breakEnd < timeSlotEnd)

export const getSlots = (start, end, duration, bookedAppointments, lunchBreakObj) => {
    let parsedStart = parseISO(start)
    let parsedEnd = parseISO(end)
    const results = []

    while (getTime(parsedStart) < getTime(parsedEnd)) {
        results.push({
            timeSlotStart: parsedStart.toISOString(),
            timeSlotEnd: add(parsedStart, { minutes: duration }).toISOString(),
        })
        parsedStart = add(parsedStart, { minutes: duration })
    }
    const slots = !bookedAppointments
        ? results
        : results.filter(({ timeSlotStart }) => !bookedAppointments.includes(timeSlotStart))
    return !isNilOrEmpty(lunchBreakObj) ? excludeSlotsInsideLunchBreak(lunchBreakObj, slots) : slots
}

/*
Only startTimes can be booked
[
    {
        startTime: '2021-05-07T14:00:00.000Z',
        endTime: '2021-05-07T14:15:00.000Z',
    },
    {
        startTime: '2021-05-07T14:20:00.000Z',
        endTime: '2021-05-07T14:35:00.000Z',
    },
] */
