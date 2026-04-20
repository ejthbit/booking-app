export const confirmationTemplate = (selectedAmbulance, { start, contact, name }) => ({
    from: process.env.EMAIL,
    to: contact.email,
    subject: 'Potvzení objednávky termínu',
    text: `Dobrý den
(${name})
Potvrzujeme přijetí Vaší objednávky v ambulanci ${selectedAmbulance.name} na termín ${start.toLocaleString('en-GB', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })}.
V případě změny Vašeho termínu, budete kontaktována telefonicky.
Pokud máte jakékoli dotazy týkající se Vaši objednávky,
kontaktujte nás telefonicky.
${selectedAmbulance.contact.phone}

Těšíme se na Vás.

S pozdravem
MUDr. Miroslav Vaňek
Gynekologicko-porodnická ambulance s.r.o.
https://vanek-gynekologie.cz/
`,
})

export const contactFormTemplate = ({ from, name, text, subject = 'Zpráva z kontaktního formuláře', ambulance }, to) => ({
    from: {
        name: name,
        address: to,
    },
    to,
    subject: `${subject} - ${ambulance} - ${from}`,
    text: `${text}

${name} - ${from}
------------
Tato zpráva byla zaslána pomocí formuláře na webových stránkách vanek-gynekologie.cz
    `,
    replyTo: from,
})

export const deleteTemplate = ({ start, contact, name }) => ({
    from: process.env.EMAIL,
    to: contact.email,
    subject: 'Zrušení objednávky termínu',
    text: `Dobrý den
(${name})
Omlouváme se za zrušení Vaší objednávky v termínu ${start.toLocaleString('en-GB', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })}.
Pokud máte jakékoli dotazy týkající se Vaši objednávky,
kontaktujte nás telefonicky.

Těšíme se na Vás.

S pozdravem
MUDr. Miroslav Vaňek
Gynekologicko-porodnická ambulance s.r.o.
https://vanek-gynekologie.cz/

`,
})

export const updateTemplate = ({ start, contact, name }) => ({
    from: process.env.EMAIL,
    to: contact.email,
    subject: 'Změna objednávky termínu',
    text: `Dobrý den
(${name})
Omlouváme se byli jsme nuceni změnit termín Vaší objednávky na ${start.toLocaleString('en-GB', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })}.
Pokud máte jakékoli dotazy týkající se Vaši objednávky,
kontaktujte nás telefonicky.

Těšíme se na Vás.

S pozdravem
MUDr. Miroslav Vaňek

Gynekologicko-porodnická ambulance s.r.o.
https://vanek-gynekologie.cz/

`,
})
