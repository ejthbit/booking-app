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
kontaktujte nás telefonicky nebo prostřednictvím emailu
${selectedAmbulance.contact.email}

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
