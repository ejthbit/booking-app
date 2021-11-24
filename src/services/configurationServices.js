import { PrismaClient } from '.prisma/client'
import { parseISO, set } from 'date-fns'
import { getISODateStringWithCorrectOffset } from '../utils/getISOStringWithOffset'
import isNilOrEmpty from '../utils/isNilOrEmpty'

const prisma = new PrismaClient()

export const getLunchBreakTimes = async (workplace, date) => {
    const configuration =
        (await prisma.configuration.findFirst({
            where: {
                workplace_id: Number(workplace),
            },
        })) ?? {}

    const breakStartHoursMinutes = configuration?.lunch_break_times?.start.split(':') ?? []
    const breakEndHoursMinutes = configuration?.lunch_break_times?.end.split(':') ?? []

    const breakTimes =
        !isNilOrEmpty(breakStartHoursMinutes) && !isNilOrEmpty(breakEndHoursMinutes)
            ? {
                  breakStart: getISODateStringWithCorrectOffset(
                      set(parseISO(date), { hours: breakStartHoursMinutes[0], minutes: breakStartHoursMinutes[1] })
                  ),
                  breakEnd: getISODateStringWithCorrectOffset(
                      set(parseISO(date), { hours: breakEndHoursMinutes[0], minutes: breakEndHoursMinutes[1] })
                  ),
              }
            : null

    return breakTimes
}
