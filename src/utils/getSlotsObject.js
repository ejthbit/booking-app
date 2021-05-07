import { add, parseISO, getTime } from 'date-fns'

export const getSlots = (start, end, duration, bookedAppointments) => {
    let parsedStart = parseISO(start)
    let parsedEnd = parseISO(end)
    let results = []

    while (getTime(parsedStart) <= getTime(parsedEnd)) {
        results.push({
            timeSlotStart: parsedStart.toISOString(),
            timeSlotEnd: add(parsedStart, { minutes: duration }).toISOString(),
        })
        parsedStart = add(parsedStart, { minutes: duration })
    }
    return !bookedAppointments ? results : results.filter(({ timeSlotStart }) => !bookedAppointments.includes(timeSlotStart))
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
