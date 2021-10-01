import { format, parseISO, subHours } from 'date-fns'

export const confirmationTemplate = (start, email) => ({
    from: process.env.EMAIL,
    to: email,
    subject: 'Potvzení objednávky termínu',
    text: `Dobrý den
Potvrzujeme přijetí Vaší objednávky na termín ${format(subHours(parseISO(start), 2), 'dd-MM-yyyy kk:mm')}.
V případě změny Vašeho termínu, budete kontaktována telefonicky.

Těšíme se na Vás.

S pozdravem
MUDr. Miroslav Vaněk
Gynekologická ambulance s.r.o.
`,
})

export const contactFormTemplate = ({ from, name, text }, to) => ({
    from,
    to,
    subject: 'Zpráva z kontaktního formuláře',
    text: `${text}

${name} - ${from}
------------
Tato zpráva byla zaslána pomocí kontaktního formuláře na webových stránkách vanek-gynekologie.cz
    `,
})
