import { add, parseISO, getTime } from 'date-fns'
import isNilOrEmpty from './isNilOrEmpty'

const excludeSlotsInsideLunchBreak = ({ breakStart, breakEnd }, slots) =>
    slots.filter(({ timeSlotStart, timeSlotEnd }) => breakStart > timeSlotStart || breakEnd < timeSlotEnd)

export const getSlots = (start, end, duration, bookedAppointments, lunchBreakObj) => {
    let parsedStart = parseISO(start)
    let parsedEnd = parseISO(end)
    const results = []

    while (getTime(parsedStart) < getTime(parsedEnd)) {
        const nextSlot = add(parsedStart, { minutes: duration })
        results.push({
            timeSlotStart: parsedStart.toISOString(),
            timeSlotEnd: nextSlot.toISOString(),
        })
        parsedStart = nextSlot
    }
    const slots = !bookedAppointments
        ? results
        : (() => {
              const bookedSet = new Set(bookedAppointments)
              return results.filter(({ timeSlotStart }) => !bookedSet.has(timeSlotStart))
          })()
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
